import { useMemo, useState } from "react";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Code2, Download, FlaskConical } from "lucide-react";
import Formula from "./Formula.jsx";
import { LagrangeHeader, LagrangeMath, LagrangeSection, LagrangeSources } from "./LagrangeShared.jsx";
import data from "../lib/lagrangeData.json";
import solverSource from "../lib/lagrangeSolver.js?raw";
import { LAGRANGE_MODEL, POINTS, STATUS_LABELS, ieeeFields, solveLagrangeBisection, solveLagrangeNewton, ulp, withReference } from "../lib/lagrangeSolver.js";

const sci = (value) => value == null ? "—" : value.toExponential(3);
const base = `${import.meta.env.BASE_URL}lagrange/`;
const th = "px-3 py-3 font-semibold whitespace-nowrap";
const td = "px-3 py-2.5 whitespace-nowrap font-mono text-xs";

function Metric({ label, children }) {
  return <div className="min-w-0 rounded-xl border border-line bg-bg/50 p-4"><p className="text-xs text-ink-dim mb-2">{label}</p><div className="font-mono text-sm text-ink break-words">{children}</div></div>;
}

function ComparisonTable({ runs }) {
  return <div className="overflow-x-auto rounded-xl border border-line">
    <table className="w-full text-left text-sm">
      <caption className="sr-only">Comparación de métodos, precisión, errores y motivo de parada</caption>
      <thead className="bg-surface text-ink"><tr>{["Método", "Formato", "τ", "k final", "Error en r", "Error en metros", "Parada"].map((s) => <th className={th} key={s}>{s}</th>)}</tr></thead>
      <tbody>{runs.map((run, i) => <tr className="border-t border-line" key={i}>
        <td className={td}>{run.method === "bisection" ? "Bisección" : "Newton"}</td><td className={td}>{run.precision}</td><td className={td}>{sci(run.tol)}</td><td className={td}>{run.steps.at(-1).k}</td>
        <td className={td}>{sci(run.error)}</td><td className={td}>{sci(run.error * LAGRANGE_MODEL.distanceKm * 1000)}</td>
        <td className="px-3 py-2.5 text-xs min-w-48">{STATUS_LABELS[run.status]}</td>
      </tr>)}</tbody>
    </table>
  </div>;
}

export default function LagrangeResultados() {
  const [point, setPoint] = useState("L1");
  const [precision, setPrecision] = useState("float64");
  const [tol, setTol] = useState(1e-10);
  const [method, setMethod] = useState("bisection");
  const [seed, setSeed] = useState("0.01");
  const [allRows, setAllRows] = useState(false);
  const reference = data.references[point];
  const parsedSeed = Number(seed);
  const validSeed = seed.trim() !== "" && Number.isFinite(parsedSeed) && parsedSeed > 0 && (point !== "L1" || parsedSeed < 1);
  const runs = useMemo(() => {
    const options = { point, precision, tol };
    return {
      bisection: withReference(solveLagrangeBisection(options), reference),
      newton: validSeed ? withReference(solveLagrangeNewton({ ...options, x0: parsedSeed }), reference) : null,
    };
  }, [point, precision, tol, reference, validSeed, parsedSeed]);
  const effectiveMethod = validSeed ? method : "bisection";
  const active = runs[effectiveMethod];
  const bits = ieeeFields(active.root, precision);
  const localUlp = ulp(active.root, precision);
  const recorded = data.experiments.filter((r) => r.point === point);
  const precisionRuns = recorded.filter((r) => r.tol === 1e-20);
  const sweep = recorded.filter((r) => r.precision === precision);
  const reboundCount = active.steps.filter((r, i) => i > 0 && r.error > active.steps[i - 1].error).length;
  const final = active.steps.at(-1);
  const savedBisection = recorded.find((r) => r.method === "bisection" && r.precision === precision && r.tol === tol);
  const idealSteps = Math.max(1, Math.ceil(Math.log2(1 / tol)));
  const graphRows = active.steps.map((s) => ({ k: s.k, error: s.error, bound: s.bound ?? null }));

  return <article className="space-y-8">
    <LagrangeHeader stage="Resultados experimentales" title="Lagrange: bisección frente a Newton">
      <span className="inline-flex gap-2 items-center"><FlaskConical className="size-4 shrink-0 text-sign" /> 48 ejecuciones guardadas y 6 pruebas de semillas; laboratorio que vuelve a calcular con el mismo código.</span>
    </LagrangeHeader>

    <LagrangeSection title="1. Diseño experimental y reproducibilidad">
      <p>Se fija el modelo Sol–Tierra: <Formula tex="\mu=0.0000030034805945421925" />, <Formula tex="R=149\,597\,870.7\ \mathrm{km}" /> y un máximo de 100 iteraciones. Se combinan tres puntos, dos métodos, dos formatos y cuatro tolerancias: <Formula tex="3\times2\times2\times4=48" /> ejecuciones.</p>
      <p>La referencia se obtiene mediante una bisección independiente en Python <code>Decimal</code> con 80 dígitos y se comprueba con 90 dígitos. Una raíz calculada con <code>Number</code> constituye una aproximación de precisión finita. El error de cada aproximación de máquina se calcula contra esa referencia, conservando sus dígitos mediante enteros en el navegador.</p>
      <LagrangeMath tex={String.raw`e_k=|r_k-r_{\mathrm{ref}}|,\qquad \rho_k=|P_{\mathrm{fl}}(r_k)|,\qquad \Delta d_k=R\,e_k`} />
      <p>El residuo <Formula tex="\rho_k" /> y el error <Formula tex="e_k" /> no son lo mismo. El archivo de resultados también reevalúa el residuo con alta precisión. Los valores adoptados definen un caso idealizado; los muchos decimales numéricos no equivalen a conocer una órbita real con esa exactitud.</p>
    </LagrangeSection>

    <LagrangeSection title="2. Laboratorio paso a paso">
      <div className="rounded-xl border border-sign/30 bg-surface/60 p-4 sm:p-5 space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="text-xs font-mono text-ink-dim">Punto de equilibrio
            <select className="mt-2 w-full rounded-lg border border-line bg-bg px-3 py-2.5 text-ink" value={point} onChange={(event) => { const p = event.target.value; setPoint(p); setSeed(String(POINTS[p].seed)); setAllRows(false); }}>
              {Object.entries(POINTS).map(([id, p]) => <option value={id} key={id}>{p.name}</option>)}
            </select>
          </label>
          <label className="text-xs font-mono text-ink-dim">Formato de cálculo
            <select className="mt-2 w-full rounded-lg border border-line bg-bg px-3 py-2.5 text-ink" value={precision} onChange={(e) => setPrecision(e.target.value)}>
              <option value="float64">binary64 · Number</option><option value="float32">binary32 · Math.fround en cada operación</option>
            </select>
          </label>
          <label className="text-xs font-mono text-ink-dim">Tolerancia absoluta en r
            <select className="mt-2 w-full rounded-lg border border-line bg-bg px-3 py-2.5 text-ink" value={tol} onChange={(e) => setTol(Number(e.target.value))}>
              {[1e-6, 1e-10, 1e-14, 1e-20].map((t) => <option key={t} value={t}>{t.toExponential(0)}{t === 1e-20 ? " · explorar el límite de máquina" : ""}</option>)}
            </select>
          </label>
          <label className="text-xs font-mono text-ink-dim">Semilla de Newton r₀
            <input className="mt-2 w-full rounded-lg border border-line bg-bg px-3 py-2.5 text-ink" type="number" step="any" value={seed} onChange={(e) => setSeed(e.target.value)} aria-invalid={!validSeed} aria-describedby="lagrange-seed-note" />
          </label>
        </div>
        <p id="lagrange-seed-note" className={validSeed ? "text-xs text-ink-dim" : "text-xs text-sign"}>{validSeed ? "Bisección usa [0, 1]. La semilla solo cambia Newton." : point === "L1" ? "La semilla de L₁ debe estar entre 0 y 1, sin incluir los extremos." : "La semilla debe ser positiva y finita."}</p>
        <p className="text-xs">La tolerancia elegida equivale a <strong className="text-ink">{sci(tol * LAGRANGE_MODEL.distanceKm * 1000)} m</strong> dentro del modelo.</p>
        <div className="grid gap-3 sm:grid-cols-2">
          {Object.entries(runs).map(([id, run]) => <div key={id} className="rounded-xl border border-line bg-bg/50 p-4 space-y-2">
            <h4 className="font-semibold text-ink">{id === "bisection" ? "Bisección" : "Newton–Raphson"}</h4>
            {run ? <>
              <p><span className="text-ink font-mono">{run.steps.at(-1).k}</span> pasos · {run.evaluations} evaluaciones de P{run.derivativeEvaluations ? ` + ${run.derivativeEvaluations} de P′` : ""}</p>
              <p className="font-mono text-ink">r = {run.root.toPrecision(16)}</p>
              <p>Error: {sci(run.error)} en r · {sci(run.error * LAGRANGE_MODEL.distanceKm * 1000)} m</p>
              <p className="text-xs text-sign">{STATUS_LABELS[run.status]}</p>
              <p className="text-xs">Comparación con la referencia: {run.error <= tol ? "sí alcanza el error pedido" : "no alcanza el error pedido"}.</p>
            </> : <p>Se requiere una semilla válida.</p>}
          </div>)}
        </div>
        <p className="text-xs">Referencia de {point}: <span className="font-mono text-ink">{Number(reference).toPrecision(16)}</span> (se muestra abreviada). Distancia desde {POINTS[point].origin}: <strong className="text-ink">{(Number(reference) * LAGRANGE_MODEL.distanceKm).toLocaleString("es-CO", { maximumFractionDigits: 3 })} km</strong>.</p>
      </div>

      <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Método de la tabla de iteraciones">
        {[['bisection', 'Ver bisección'], ['newton', 'Ver Newton']].map(([id, label]) => <button key={id} disabled={id === "newton" && !validSeed} aria-pressed={effectiveMethod === id} className={`rounded-lg border px-4 py-2 text-xs font-mono disabled:opacity-40 ${effectiveMethod === id ? "border-sign bg-sign/10 text-ink" : "border-line bg-surface text-ink-dim"}`} onClick={() => setMethod(id)}>{label}</button>)}
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <Metric label="Residuo computado |P_fl(r)|">{sci(Math.abs(final.fx))}</Metric>
        <Metric label={effectiveMethod === "bisection" ? "Cota del intervalo actual" : "Último incremento |Δr|"}>{sci(effectiveMethod === "bisection" ? final.bound : final.step)}</Metric>
        <Metric label="ULP en esta aproximación">{sci(localUlp)} en r<br /><span className="text-xs text-ink-dim">{sci(localUlp * LAGRANGE_MODEL.distanceKm * 1000)} m</span></Metric>
      </div>
      {effectiveMethod === "bisection" && <p>Predicción en aritmética exacta: {idealSteps} pasos para la cota. La tabla muestra {active.steps.length} evaluaciones de puntos medios. Si el redondeo interrumpe antes, no se ha cumplido esa predicción ideal.</p>}

      <div className="overflow-x-auto rounded-xl border border-line">
        <table className="w-full text-left text-sm"><caption className="sr-only">Traza de {effectiveMethod === "bisection" ? "bisección" : "Newton"} para {point}</caption>
          <thead className="bg-surface text-ink"><tr><th className={th}>k</th>{effectiveMethod === "bisection" && <><th className={th}>a</th><th className={th}>b</th></>}<th className={th}>rₖ</th><th className={th}>P_fl(rₖ)</th><th className={th}>{effectiveMethod === "bisection" ? "Cota intervalo" : "|Δr|"}</th><th className={th}>Error vs. referencia</th></tr></thead>
          <tbody>{(allRows ? active.steps : active.steps.slice(0, 12)).map((s) => <tr className="border-t border-line" key={s.k}>
            <td className={td}>{s.k}</td>{effectiveMethod === "bisection" && <><td className={td}>{s.x != null && s.a.toPrecision(10)}</td><td className={td}>{s.b.toPrecision(10)}</td></>}<td className={td}>{s.x.toPrecision(16)}</td><td className={td}>{sci(s.fx)}</td><td className={td}>{sci(effectiveMethod === "bisection" ? s.bound : s.step)}</td><td className={td}>{sci(s.error)}</td>
          </tr>)}</tbody>
        </table>
      </div>
      {active.steps.length > 12 && <button className="rounded-lg border border-line bg-surface px-4 py-2 text-xs font-mono text-ink" onClick={() => setAllRows(!allRows)}>{allRows ? "Mostrar primeras 12 filas" : `Ver las ${active.steps.length} filas`}</button>}
      {effectiveMethod === "newton" && <p className="text-xs">La fila k = 0 es la semilla y no cuenta como paso de Newton. La derivada evaluada es la del polinomio de la región elegida.</p>}

      <figure className="min-w-0 rounded-xl border border-line bg-surface/30 p-3 sm:p-5">
        <h4 className="text-sm text-ink font-semibold mb-5">Error y cota · escala logarítmica</h4>
        <div className="h-64 w-full min-w-0">
          <ResponsiveContainer width="100%" height="100%"><LineChart data={graphRows} margin={{ right: 12, left: 0, top: 8, bottom: 10 }}>
            <CartesianGrid stroke="#412279" strokeDasharray="3 3" /><XAxis dataKey="k" stroke="#C4B5FD" tick={{ fontSize: 11 }} label={{ value: "Iteración k", position: "insideBottomRight", offset: -8, fill: "#C4B5FD", fontSize: 11 }} />
            <YAxis scale="log" domain={['auto', 'auto']} stroke="#C4B5FD" width={62} tick={{ fontSize: 10 }} tickFormatter={(v) => v.toExponential(0)} />
            <Tooltip formatter={(v, name) => [sci(v), name]} contentStyle={{ background: "#1B1145", borderColor: "#412279", fontSize: 12 }} labelFormatter={(k) => `k = ${k}`} />
            <Line type="linear" dataKey="error" name="Error vs. referencia" stroke="#2dd4bf" dot={false} strokeWidth={2} isAnimationActive={false} />
            {effectiveMethod === "bisection" && <Line type="linear" dataKey="bound" name="Cota del intervalo" stroke="#f472b6" dot={false} strokeWidth={2} strokeDasharray="5 4" isAnimationActive={false} />}
          </LineChart></ResponsiveContainer>
        </div>
        <figcaption className="mt-4 text-xs leading-relaxed"><span className="text-mant">Verde: error.</span> {effectiveMethod === "bisection" && <span className="text-sign">Rosa discontinua: cota del intervalo.</span>} La tabla ofrece los mismos datos. En esta ejecución el error aumenta entre pasos {reboundCount} veces.</figcaption>
      </figure>
      {effectiveMethod === "bisection" && !savedBisection.bracketContainsReference && <p className="rounded-xl border border-sign/40 bg-sign/5 p-4 text-ink">La comprobación decimal detectó que algún intervalo ya no contenía la referencia. El signo del polinomio redondeado puede diferir del signo real cerca de la raíz. La cota del intervalo deja entonces de certificar el error del modelo original.</p>}
    </LagrangeSection>

    <LagrangeSection title="3. Forzar la precisión y observar dónde se detiene">
      <p>Se fija <Formula tex="\tau=10^{-20}" /> y se mantienen las semillas predeterminadas. El objetivo es observar el límite de precisión alcanzable al solicitar una tolerancia muy exigente.</p>
      <ComparisonTable runs={precisionRuns} />
      <p>Para L₁, binary32 se estanca con un error cercano a 45 m; binary64 llega mucho más lejos. Los conteos dependen del punto, la evaluación de P y el intervalo. Un residuo computado como cero o un incremento nulo puede detener el proceso sin cumplir la tolerancia pedida.</p>
      <details className="rounded-xl border border-line bg-surface/40 p-4">
        <summary className="cursor-pointer text-ink font-semibold">Ver el barrido de tolerancias para {point} en {precision}</summary>
        <div className="mt-4"><ComparisonTable runs={sweep} /></div>
      </details>
      <div className="rounded-xl border border-line bg-bg/60 p-4 space-y-3">
        <h4 className="font-semibold text-ink">Representación binaria de la aproximación seleccionada</h4>
        <p className="text-xs">Signo · exponente almacenado (con sesgo) · fracción. El bit inicial implícito no se almacena.</p>
        <div className="max-w-full overflow-x-auto whitespace-nowrap font-mono text-xs py-2" aria-label={`Representación IEEE 754 de ${active.root}`}><span className="text-sign">{bits.sign}</span> · <span className="text-exp">{bits.exponent}</span> · <span className="text-mant">{bits.fraction}</span></div>
      </div>
    </LagrangeSection>

    <LagrangeSection title="4. Cambiar la semilla de Newton">
      <p>Se realiza una prueba independiente para L₁ en binary64 y <Formula tex="\tau=10^{-10}" />. Únicamente se modifica <Formula tex="r_0" />. Las seis semillas evaluadas convergieron con diferentes cantidades de pasos; este resultado se limita a los casos ensayados.</p>
      <div className="overflow-x-auto rounded-xl border border-line"><table className="w-full text-left text-sm"><caption className="sr-only">Sensibilidad de Newton a la semilla</caption>
        <thead className="bg-surface"><tr>{["r₀", "k final", "Error en r", "Parada"].map((s) => <th key={s} className={th}>{s}</th>)}</tr></thead>
        <tbody>{data.sensitivity.map((r) => <tr className="border-t border-line" key={r.x0}><td className={td}>{r.x0}</td><td className={td}>{r.steps.at(-1).k}</td><td className={td}>{sci(r.error)}</td><td className="px-3 py-2.5 text-xs">{STATUS_LABELS[r.status]}</td></tr>)}</tbody>
      </table></div>
      <p>Desde <Formula tex="r_0=0.01" /> se necesitan 3 pasos con la tolerancia elegida; desde <Formula tex="r_0=10^{-6}" />, 15. La razón empírica de errores indica un orden cercano a 2 antes de la meseta de redondeo, en concordancia con la convergencia cuadrática local de Newton (Kincaid y Cheney, §3.2).</p>
      <LagrangeMath tex={String.raw`p_k\approx\frac{\log(e_k/e_{k-1})}{\log(e_{k-1}/e_{k-2})}\approx 2`} />
    </LagrangeSection>

    <LagrangeSection title="5. Cómo están programados los métodos y las paradas">
      <ul className="list-disc pl-5 space-y-2">
        <li>Bisección usa <code>a + (b - a) / 2</code>, compara signos y detiene al alcanzar la cota solicitada. En máquina usa <Formula tex="\max(c-a,b-c)" /> para incluir el redondeo del punto medio.</li>
        <li>Newton evalúa P y P′ con Horner. Para declarar tolerancia pide a la vez un incremento pequeño y un residuo escalado pequeño: <Formula tex="|\Delta r|\le\tau" /> y <Formula tex="|P_{\mathrm{fl}}(r)|/\sum_i|a_i r^i|\le\tau" />. Son indicadores prácticos, no una demostración del error real.</li>
        <li>Se distinguen estancamiento, residuo cero en máquina y tolerancia. El error contra la referencia se muestra como comprobación independiente y nunca se usa para decidir las iteraciones.</li>
        <li>La referencia usa el decimal de μ declarado. Los métodos usan su representación redondeada y los coeficientes redondeados del formato; esa perturbación también forma parte del error medido.</li>
      </ul>
      <details className="rounded-xl border border-line bg-surface/40 p-4">
        <summary className="cursor-pointer text-ink font-semibold inline-flex items-center gap-2"><Code2 className="size-4 text-sign" /> Ver el código JavaScript que ejecuta esta página</summary>
        <pre className="mt-4 max-h-[32rem] overflow-auto rounded-lg bg-bg p-4 font-mono text-xs leading-relaxed text-ink-dim">{solverSource}</pre>
      </details>
      <div className="flex flex-wrap gap-3">
        <a download className="inline-flex items-center gap-2 rounded-lg border border-sign/40 bg-sign/10 px-4 py-2 text-xs text-ink font-mono" href={`${base}resultados.csv`}><Download className="size-4" /> Trazas CSV</a>
        <a download className="rounded-lg border border-line bg-surface px-4 py-2 text-xs text-ink font-mono" href={`${base}lagrangeSolver.js`}>Motor JavaScript</a>
        <a download className="rounded-lg border border-line bg-surface px-4 py-2 text-xs text-ink font-mono" href={`${base}experimento_lagrange.py`}>Verificador Python</a>
        <a download className="rounded-lg border border-line bg-surface px-4 py-2 text-xs text-ink font-mono" href={`${base}ejecutar_lagrange.mjs`}>Ejecutor de experimentos</a>
      </div>
      <p>La reproducción del experimento requiere Python 3 y Node.js. Desde la raíz del repositorio se utiliza el siguiente comando:</p>
      <pre className="overflow-x-auto rounded-lg border border-line bg-bg p-4 text-xs text-mant">python scripts/experimento_lagrange.py</pre>
      <p className="text-xs">El script vuelve a generar JSON, CSV e informe. Los archivos descargables son copias del código del repositorio y conservan sus rutas relativas; no son programas independientes para ejecutar fuera de él.</p>
    </LagrangeSection>
    <LagrangeSources />
  </article>;
}
