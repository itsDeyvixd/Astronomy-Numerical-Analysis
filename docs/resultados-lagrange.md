# Resultados del experimento de Lagrange

Generado por `python scripts/experimento_lagrange.py`. Motor compartido con la web.

Parámetro adoptado: $\mu=0.0000030034805945421925$; $R=149597870.7\ \mathrm{km}$. Estos valores definen un modelo circular idealizado.

Referencia independiente: bisección decimal a 80 dígitos, comprobada a 90; discrepancia menor que 1e-73.

- L1: $r=0.009970402648655490112150585183784934143809881884488139746459959515381241109828192$
- L2: $r=0.010037119902804573224478207275830322669094303379658569299170200833916014327331778$
- L3: $r=0.9999982479696531822484776507028962505901169270427128177792230265325041043236118$

## L1: precisión y tolerancia

| Formato | Tolerancia | Método | Pasos (k final) | Error en r | Error en km | Parada |
|---|---|---|---|---|---|---|
| float32 | 1e-06 | bisection | 20 | 2.623294e-07 | 3.924392e+01 | tolerancia |
| float32 | 1e-06 | newton | 2 | 3.035942e-10 | 4.541704e-02 | tolerancia |
| float32 | 1e-10 | bisection | 31 | 3.035942e-10 | 4.541704e-02 | estancamiento |
| float32 | 1e-10 | newton | 3 | 3.035942e-10 | 4.541704e-02 | estancamiento |
| float32 | 1e-14 | bisection | 31 | 3.035942e-10 | 4.541704e-02 | estancamiento |
| float32 | 1e-14 | newton | 3 | 3.035942e-10 | 4.541704e-02 | estancamiento |
| float32 | 1e-20 | bisection | 31 | 3.035942e-10 | 4.541704e-02 | estancamiento |
| float32 | 1e-20 | newton | 3 | 3.035942e-10 | 4.541704e-02 | estancamiento |
| float64 | 1e-06 | bisection | 20 | 2.623294e-07 | 3.924392e+01 | tolerancia |
| float64 | 1e-06 | newton | 2 | 7.378126e-13 | 1.103752e-04 | tolerancia |
| float64 | 1e-10 | bisection | 34 | 1.255588e-11 | 1.878333e-03 | tolerancia |
| float64 | 1e-10 | newton | 3 | 5.655480e-20 | 8.460478e-12 | tolerancia |
| float64 | 1e-14 | bisection | 47 | 5.932189e-16 | 8.874428e-08 | tolerancia |
| float64 | 1e-14 | newton | 4 | 5.655480e-20 | 8.460478e-12 | estancamiento |
| float64 | 1e-20 | bisection | 60 | 5.655480e-20 | 8.460478e-12 | estancamiento |
| float64 | 1e-20 | newton | 4 | 5.655480e-20 | 8.460478e-12 | estancamiento |

## Sensibilidad de Newton (L1, binary64, tolerancia 1e-10)

| Semilla | k final | Error en r | Parada |
|---|---|---|---|
| 1e-06 | 15 | 1.678169e-18 | tolerancia |
| 0.001 | 13 | 5.655480e-20 | tolerancia |
| 0.01 | 3 | 5.655480e-20 | tolerancia |
| 0.1 | 10 | 5.655480e-20 | tolerancia |
| 0.5 | 14 | 1.678169e-18 | tolerancia |
| 0.9 | 15 | 1.678169e-18 | tolerancia |

## Interpretación

La cota de bisección corresponde al intervalo y presupone signos correctos; no certifica por sí sola la raíz del modelo real cuando hay redondeo. El JSON registra si cada intervalo conservó la referencia. Un residuo evaluado como cero en binary32/binary64 puede tener residuo no nulo al reevaluarse con Decimal. Newton usa un criterio conjunto de paso y residuo escalado; también detecta estancamiento, ciclos y salidas del dominio. La precisión numérica no representa la incertidumbre física de las masas, las órbitas ni las perturbaciones.

Trazas completas: `frontend/public/lagrange/resultados.csv`. Fundamentos y referencias: `docs/lagrange-fundamentos.md`.
