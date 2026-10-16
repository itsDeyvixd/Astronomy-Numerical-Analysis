#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
UNIVERSIDAD NACIONAL DE COLOMBIA - ANÁLISIS NUMÉRICO
Proyecto de Astronomía Computacional: Ley de Desplazamiento de Wien
Autor: Juan Huertas

Ejecuta los experimentos numéricos en IEEE 754 (np.float64 y np.float32)
y genera automáticamente el módulo de datos `src/lib/wienData.js` para React.
"""

import os
import json
import math
import numpy as np

# Constantes Físicas Fundamentales (CODATA)
h = 6.62607015e-34   # J*s
c = 299792458.0      # m/s
kB = 1.380649e-23    # J/K

def f_wien(x, dtype=np.float64):
    x = dtype(x)
    return dtype(x + dtype(5.0) * np.exp(-x) - dtype(5.0))

def df_wien(x, dtype=np.float64):
    x = dtype(x)
    return dtype(dtype(1.0) - dtype(5.0) * np.exp(-x))

# 0. Obtener la raíz de referencia en precisión doble de máquina (float64)
def calcular_raiz_referencia():
    xk = np.float64(4.965)
    for _ in range(20):
        xk = np.float64(xk - f_wien(xk, np.float64) / df_wien(xk, np.float64))
    return float(xk)

X_STAR = calcular_raiz_referencia()
B_WIEN = (h * c) / (kB * X_STAR)

def agregar_orden_empirico(pasos):
    for i, fila in enumerate(pasos):
        if i < 2:
            fila["p"] = "—"
            continue
        ek = pasos[i]["err_num"]
        ek1 = pasos[i - 1]["err_num"]
        ek2 = pasos[i - 2]["err_num"]
        if ek > 1e-16 and ek1 > 1e-16 and ek2 > 1e-16:
            den = math.log(ek1 / ek2)
            if abs(den) > 1e-12:
                p_val = math.log(ek / ek1) / den
                fila["p"] = f"{p_val:.2f}" if 0 < p_val < 10 else "—"
            else:
                fila["p"] = "—"
        else:
            fila["p"] = "—"
    for fila in pasos:
        fila.pop("err_num", None)
    return pasos

# 1. Bisección con Guarda de 3 Capas
def ejecutar_biseccion(a=4.0, b=6.0, tol=1e-6, max_iter=100, dtype=np.float64):
    a, b = dtype(a), dtype(b)
    fa, fb = f_wien(a, dtype), f_wien(b, dtype)
    traza = []
    motivo = "max_iter_alcanzado"
    err_prev = None

    for k in range(1, max_iter + 1):
        cota = dtype((b - a) / dtype(2.0))
        ck = dtype(a + cota)
        fc = f_wien(ck, dtype)
        err_real = abs(X_STAR - float(ck))

        highlight = None
        if err_prev is not None:
            if err_real < err_prev * 0.25:
                highlight = "valle"
            elif err_real > err_prev * 2.0:
                highlight = "rebote"
        err_prev = err_real

        estancado = (ck == a) or (ck == b)
        convergido = float(cota) < tol

        if estancado:
            highlight = "estancamiento"
        elif convergido:
            highlight = "convergencia"

        traza.append({
            "k": k,
            "a": f"{float(a):.7f}",
            "b": f"{float(b):.7f}",
            "c": f"{float(ck):.10f}" if dtype == np.float32 else f"{float(ck):.7f}",
            "f": f"{float(fc):+.6e}",
            "cota": f"{float(cota):.6e}",
            "error": f"{err_real:.6e}",
            "highlight": highlight,
        })

        if estancado:
            motivo = "estancamiento_maquina"
            break
        if convergido:
            motivo = "tolerancia_alcanzada"
            break

        if np.sign(fa) != np.sign(fc):
            b, fb = ck, fc
        else:
            a, fa = ck, fc

    return {
        "pasos": traza,
        "iteraciones": len(traza),
        "raiz": f"{float(ck):.16f}" if dtype == np.float64 else f"{float(ck):.10f}",
        "errorFinal": f"{abs(X_STAR - float(ck)):.6e}",
        "cotaFinal": f"{float(cota):.6e}",
        "motivo": motivo,
    }

# 2. Newton-Raphson
def ejecutar_newton(x0=4.5, tol=1e-15, max_iter=50, dtype=np.float64):
    xk = dtype(x0)
    fx0 = f_wien(xk, dtype)
    dfx0 = df_wien(xk, dtype)
    err0 = abs(X_STAR - float(xk))

    traza = [{
        "k": 0,
        "x": f"{float(xk):.16f}",
        "fx": f"{float(fx0):+.6e}",
        "dfx": f"{float(dfx0):.6f}",
        "step": "—",
        "error": f"{err0:.6e}",
        "err_num": err0,
        "highlight": None,
    }]

    motivo = "max_iter_alcanzado"
    x_primer_salto = None

    for k in range(1, max_iter + 1):
        fx = f_wien(xk, dtype)
        dfx = df_wien(xk, dtype)

        if abs(float(dfx)) < 1e-14:
            motivo = "singularidad_derivada"
            break

        x_next = dtype(xk - dtype(fx / dfx))
        if k == 1:
            x_primer_salto = float(x_next)

        step = abs(float(x_next) - float(xk))
        fx_next = f_wien(x_next, dtype)
        dfx_next = df_wien(x_next, dtype)
        err_real = abs(X_STAR - float(x_next))
        convergido = (step < tol) or (x_next == xk)

        traza.append({
            "k": k,
            "x": f"{float(x_next):.16f}",
            "fx": f"{float(fx_next):+.6e}",
            "dfx": f"{float(dfx_next):.6f}",
            "step": f"{step:.6e}",
            "error": f"{err_real:.6e}",
            "err_num": err_real,
            "highlight": "convergencia" if convergido else None,
        })

        if convergido:
            motivo = "convergencia"
            break
        xk = x_next

    return {
        "pasos": agregar_orden_empirico(traza),
        "x0": f"{float(x0):.6f}",
        "dfx0": f"{float(dfx0):+.6f}",
        "x1": f"{x_primer_salto:+.6f}" if x_primer_salto is not None else "NaN / ±Inf",
        "iteraciones": len(traza) - 1,
        "raizFinal": f"{float(xk if len(traza)==1 else x_next):.8f}" if x_primer_salto is not None else "Singularidad",
        "motivo": motivo,
    }

# 3. Secante
def ejecutar_secante(x0=4.0, x1=6.0, tol=1e-15, max_iter=50):
    x_prev, x_curr = np.float64(x0), np.float64(x1)
    traza = []
    for k in range(1, max_iter + 1):
        f_prev, f_curr = f_wien(x_prev), f_wien(x_curr)
        x_next = np.float64(x_curr - f_curr * (x_curr - x_prev) / (f_curr - f_prev))
        step = abs(float(x_next - x_curr))
        fx_next = f_wien(x_next)
        err_real = abs(X_STAR - float(x_next))
        convergido = (step < tol) or (x_next == x_curr)

        traza.append({
            "k": k,
            "x": f"{float(x_next):.16f}",
            "fx": f"{float(fx_next):+.6e}",
            "step": f"{step:.6e}",
            "error": f"{err_real:.6e}",
            "err_num": err_real,
            "highlight": "convergencia" if convergido else None,
        })
        if convergido:
            break
        x_prev, x_curr = x_curr, x_next

    return agregar_orden_empirico(traza)

# 4. Punto Fijo g1(x) = 5(1 - e^-x)
def ejecutar_punto_fijo(x0=4.5, tol=1e-15, max_iter=50):
    xk = np.float64(x0)
    traza = []
    for k in range(1, max_iter + 1):
        x_next = np.float64(5.0 * (1.0 - np.exp(-xk)))
        step = abs(float(x_next - xk))
        fx_next = f_wien(x_next)
        err_real = abs(X_STAR - float(x_next))
        convergido = (step < tol) or (x_next == xk)

        traza.append({
            "k": k,
            "x": f"{float(x_next):.16f}",
            "fx": f"{float(fx_next):+.6e}",
            "step": f"{step:.6e}",
            "error": f"{err_real:.6e}",
            "err_num": err_real,
            "highlight": "convergencia" if convergido else None,
        })
        if convergido:
            break
        xk = x_next

    return agregar_orden_empirico(traza)

if __name__ == "__main__":
    with open(__file__, "r", encoding="utf-8") as f_self:
        codigo_fuente = f_self.read()

    datos_exportados = {
        "meta": {
            "xStar": f"{X_STAR:.16f}",
            "bWien": f"{B_WIEN:.9e}",
            "ln5": f"{math.log(5.0):.10f}",
        },
        "biseccionTol1e6": ejecutar_biseccion(4.0, 6.0, 1e-6, 100, np.float64)["pasos"],
        "newtonOptimo": ejecutar_newton(4.5, 1e-15, 50, np.float64)["pasos"],
        "secanteTraza": ejecutar_secante(4.0, 6.0, 1e-15, 50),
        "puntoFijoTraza": ejecutar_punto_fijo(4.5, 1e-15, 50),
        "sensibilidadNewton": [
            ejecutar_newton(1.2, 1e-12, 50, np.float64),
            ejecutar_newton(math.log(5.0), 1e-12, 50, np.float64),
            ejecutar_newton(1.61, 1e-12, 50, np.float64),
            ejecutar_newton(4.5, 1e-12, 50, np.float64),
        ],
        "precisionComparativa": {
            "float32": ejecutar_biseccion(4.0, 6.0, 1e-18, 100, np.float32),
            "float64": ejecutar_biseccion(4.0, 6.0, 1e-18, 100, np.float64),
        },
        "pythonSource": codigo_fuente,
    }

    contenido_js = (
        "// Archivo autogenerado por generar_resultados_wien.py\n"
        f"export const WIEN_EXPERIMENT_DATA = {json.dumps(datos_exportados, indent=2, ensure_ascii=False)};\n"
    )

    ruta_salida = os.path.join(os.path.dirname(__file__), "src", "lib", "wienData.js")
    os.makedirs(os.path.dirname(ruta_salida), exist_ok=True)
    with open(ruta_salida, "w", encoding="utf-8") as f_out:
        f_out.write(contenido_js)

    print("=" * 70)
    print(f"[OK] Archivo generado exitosamente en: {ruta_salida}")
    print("=" * 70)
    print("\nSi prefieres copiar y pegar manualmente en src/lib/wienData.js:\n")
    print(contenido_js)
