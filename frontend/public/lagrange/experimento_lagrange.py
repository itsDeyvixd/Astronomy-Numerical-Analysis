#!/usr/bin/env python3
"""Experimento reproducible: Python 3 (biblioteca estándar) + Node.js.

Desde la raíz: python scripts/experimento_lagrange.py
Node ejecuta el MISMO motor de la web; Decimal verifica con 80 dígitos.
No se usan numpy.roots, scipy.optimize ni solvers externos.
"""
import csv
import json
import shutil
import subprocess
from decimal import Decimal, localcontext
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def coefficients(point, mu):
    """Derivación independiente en aritmética decimal de alta precisión."""
    one = Decimal(1)
    if point == 'L1':
        return [one, mu-3, 3-2*mu, -mu, 2*mu, -mu]
    if point == 'L2':
        return [one, 3-mu, 3-2*mu, -mu, -2*mu, -mu]
    return [one, 2+mu, 1+2*mu, -(1-mu), -2*(1-mu), -(1-mu)]


def horner(x, coeffs):
    result = coeffs[0]
    for a in coeffs[1:]:
        result = result*x+a
    return result


def reference(point, mu_text, digits=80):
    with localcontext() as ctx:
        ctx.prec = digits
        coeffs = coefficients(point, Decimal(mu_text))
        a, b = Decimal(0), Decimal(1)
        fa = horner(a, coeffs)
        for _ in range(300):
            x = (a+b)/2
            fx = horner(x, coeffs)
            if fx == 0 or b-a < Decimal(10)**(-digits+5):
                break
            if (fx < 0) != (fa < 0):
                b = x
            else:
                a, fa = x, fx
        return x


def enrich(run, ref, mu_text, point):
    with localcontext() as ctx:
        ctx.prec = 90
        coeffs = coefficients(point, Decimal(mu_text))
        for step in run['steps']:
            exact_machine_value = Decimal.from_float(step['x'])
            step['error'] = float(abs(exact_machine_value-ref))
            step['referenceResidual'] = float(abs(horner(exact_machine_value, coeffs)))
        last = run['steps'][-1]
        run['error'] = last['error']
        run['errorKm'] = float(Decimal.from_float(last['error'])*Decimal('149597870.7'))
        run['referenceResidual'] = last['referenceResidual']
        # Comprueba si el intervalo mantenido en máquina aún encierra la raíz real.
        run['bracketContainsReference'] = all(
            Decimal.from_float(s['a']) <= ref <= Decimal.from_float(s['b'])
            for s in run['steps'] if 'a' in s)
        run['metReferenceTolerance'] = run['error'] <= run.get('tol', 1e-10)
        run['observedOrders'] = []
        if run.get('method') == 'newton':
            import math
            for i in range(2, len(run['steps'])):
                e0, e1, e2 = [run['steps'][j]['error'] for j in (i-2, i-1, i)]
                # Evita estimar el orden en la meseta de redondeo.
                if e0 > e1 > e2 > 1e-15:
                    run['observedOrders'].append(math.log(e2/e1)/math.log(e1/e0))
    return run


def main():
    node = shutil.which('node')
    if not node:
        raise SystemExit('Instala Node.js o añade node al PATH.')
    raw = subprocess.run([node, str(ROOT/'scripts/ejecutar_lagrange.mjs')], cwd=ROOT, check=True, capture_output=True, text=True)
    data = json.loads(raw.stdout)
    mu_text = data['model']['muText']
    refs = {p: reference(p, mu_text) for p in ('L1', 'L2', 'L3')}
    # Verifica 10 dígitos de guarda adicionales en la referencia (80 vs. 90).
    assert all(abs(refs[p]-reference(p, mu_text, 90)) < Decimal('1e-73') for p in refs)
    data['references'] = {p: format(r, 'f') for p, r in refs.items()}
    data['referenceDigits'] = 80
    data['referenceAgreement'] = '80 y 90 dígitos concuerdan a menos de 1e-73'
    for run in data['experiments']:
        enrich(run, refs[run['point']], mu_text, run['point'])
    for run in data['sensitivity']:
        enrich(run, refs['L1'], mu_text, 'L1')
    output = ROOT/'frontend/src/lib/lagrangeData.json'
    output.write_text(json.dumps(data, ensure_ascii=False, indent=2, allow_nan=False)+'\n', encoding='utf-8')
    public = ROOT/'frontend/public/lagrange'
    public.mkdir(exist_ok=True)
    with (public/'resultados.csv').open('w', newline='', encoding='utf-8') as stream:
        fields = ['point', 'precision', 'tol', 'method', 'k', 'x', 'fx', 'error', 'referenceResidual', 'bound', 'step', 'status']
        writer = csv.DictWriter(stream, fieldnames=fields)
        writer.writeheader()
        for run in data['experiments']:
            for step in run['steps']:
                writer.writerow({f: run.get(f, step.get(f, '')) for f in fields})
    # Estas copias permiten descargar todo el código usado sin una API auxiliar.
    shutil.copyfile(__file__, public/'experimento_lagrange.py')
    shutil.copyfile(ROOT/'scripts/ejecutar_lagrange.mjs', public/'ejecutar_lagrange.mjs')
    shutil.copyfile(ROOT/'frontend/src/lib/lagrangeSolver.js', public/'lagrangeSolver.js')
    rows = []
    for run in data['experiments']:
        if run['point'] == 'L1':
            rows.append(f"| {run['precision']} | {run['tol']:.0e} | {run['method']} | {run['steps'][-1]['k']} | {run['error']:.6e} | {run['errorKm']:.6e} | {run['status']} |")
    report = '# Resultados del experimento de Lagrange\n\n'
    report += 'Generado por `python scripts/experimento_lagrange.py`. Motor compartido con la web.\n\n'
    report += f"Parámetro adoptado: $\\mu={mu_text}$; $R=149597870.7\\ \\mathrm{{km}}$. Estos valores definen un modelo circular idealizado.\n\n"
    report += 'Referencia independiente: bisección decimal a 80 dígitos, comprobada a 90; discrepancia menor que 1e-73.\n\n'
    report += '\n'.join(f'- {p}: $r={r}$' for p, r in data['references'].items())+'\n\n'
    report += '## L1: precisión y tolerancia\n\n| Formato | Tolerancia | Método | Pasos (k final) | Error en r | Error en km | Parada |\n|---|---|---|---|---|---|---|\n'+'\n'.join(rows)+'\n\n'
    report += '## Sensibilidad de Newton (L1, binary64, tolerancia 1e-10)\n\n| Semilla | k final | Error en r | Parada |\n|---|---|---|---|\n'
    report += '\n'.join(f"| {r['x0']} | {r['steps'][-1]['k']} | {r['error']:.6e} | {r['status']} |" for r in data['sensitivity'])+'\n\n'
    report += '## Interpretación\n\n'
    report += ('La cota de bisección corresponde al intervalo y presupone signos correctos; no certifica por sí sola la raíz del modelo real cuando hay redondeo. El JSON registra si cada intervalo conservó la referencia. '
               'Un residuo evaluado como cero en binary32/binary64 puede tener residuo no nulo al reevaluarse con Decimal. '
               'Newton usa un criterio conjunto de paso y residuo escalado; también detecta estancamiento, ciclos y salidas del dominio. '
               'La precisión numérica no representa la incertidumbre física de las masas, las órbitas ni las perturbaciones.\n\n')
    report += 'Trazas completas: `frontend/public/lagrange/resultados.csv`. Fundamentos y referencias: `docs/lagrange-fundamentos.md`.\n'
    (ROOT/'docs/resultados-lagrange.md').write_text(report, encoding='utf-8')
    print(f"Generados {len(data['experiments'])} experimentos y {len(data['sensitivity'])} pruebas de semillas.")
    print('\n'.join(rows))


if __name__ == '__main__':
    main()
