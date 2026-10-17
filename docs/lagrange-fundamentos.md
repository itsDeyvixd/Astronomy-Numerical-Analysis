# Puntos de Lagrange: fundamentos teóricos y metodología experimental

Autor indicado en el proyecto: Germán Rodríguez. Modelo: problema **circular restringido** de tres cuerpos, sistema Sol-Tierra. Métodos implementados: bisección y Newton-Raphson. Se estudian los tres puntos colineales y se explica L1 en detalle.

## Pregunta y alcance

¿Cómo permiten bisección y Newton localizar puntos de Lagrange a partir de una ecuación no lineal, y cómo limita IEEE 754 la precisión alcanzable?

Se calcula una posición de equilibrio en un sistema que gira con los cuerpos principales. No se integra una trayectoria, no se calcula una órbita halo y no se afirma precisión física equivalente a los muchos decimales del cálculo. Las órbitas circulares y la masa despreciable de la nave son hipótesis del modelo. L1, L2 y L3 son equilibrios dinámicamente inestables: la convergencia del algoritmo y la estabilidad orbital son conceptos diferentes.

## 1. Modelo físico y normalización

Se adoptan, de la tabla de parámetros astrodinámicos de JPL:

- $GM_\odot=132712440041.279419\ \mathrm{km^3/s^2}$.
- $GM_\mathrm{T}=398600.435507\ \mathrm{km^3/s^2}$.
- $R=1\ \mathrm{au}=149597870.7\ \mathrm{km}$, fijo en este caso idealizado.

La razón de masas se puede calcular con los parámetros gravitacionales, porque el factor $G$ se cancela:

$$\mu=\frac{GM_\mathrm{T}}{GM_\odot+GM_\mathrm{T}}.$$

Para hacer completamente reproducible el problema, se fija el decimal

$$\mu=0.0000030034805945421925.$$

Este decimal redondeado define la referencia; su conversión al formato binario y el redondeo de los coeficientes pertenecen al experimento de precisión finita.

En coordenadas baricéntricas adimensionales, el Sol está en $x=-\mu$ y la Tierra en $x=1-\mu$. El equilibrio combina gravedad y efecto centrífugo:

$$F(x)=x-\frac{(1-\mu)(x+\mu)}{|x+\mu|^3}-\frac{\mu(x-1+\mu)}{|x-1+\mu|^3}=0.$$

No es una simple igualdad entre las dos fuerzas de gravedad. Coriolis no aparece en esta ecuación de equilibrio porque la velocidad en el sistema giratorio es cero.

## 2. El quíntico de Euler en cada región

Para L1 se define $r=d/R$, distancia desde la Tierra hacia el Sol. Entonces $0<r<1$, $x=1-\mu-r$, y

$$F(1-\mu-r)=1-\mu-r-\frac{1-\mu}{(1-r)^2}+\frac{\mu}{r^2}.$$

Multiplicar por $-r^2(1-r)^2$, no nulo en el interior, produce

$$P_1(r)=r^5-(3-\mu)r^4+(3-2\mu)r^3-\mu r^2+2\mu r-\mu.$$

La derivada usada por Newton es

$$P_1'(r)=5r^4-4(3-\mu)r^3+3(3-2\mu)r^2-2\mu r+2\mu.$$

Para L2 se mide $r$ desde la Tierra hacia afuera y $x=1-\mu+r$:

$$P_2(r)=r^5+(3-\mu)r^4+(3-2\mu)r^3-\mu r^2-2\mu r-\mu.$$

Para L3 se mide $r$ desde el Sol hacia el lado opuesto y $x=-\mu-r$:

$$P_3(r)=r^5+(2+\mu)r^4+(1+2\mu)r^3-(1-\mu)r^2-2(1-\mu)r-(1-\mu).$$

Los polinomios son equivalentes a la ecuación original solo en sus regiones. Para L1 la región física es $0<r<1$; para L2 y L3 es $r>0$. Newton puede pasar por $r>1$ en estas dos últimas ramas sin abandonar su región. Bisección inicia en $[0,1]$ porque allí se encuentra la raíz de las tres ramas para el parámetro adoptado.

No se afirma que todo quíntico particular sea insoluble por radicales. Aquí se necesita una aproximación numérica útil para los parámetros del modelo.

### Existencia y unicidad

Los polinomios son continuos. Sus signos en los extremos son:

| Punto | $P(0)$ | $P(1)$ |
|---|---|---|
| L1 | $-\mu$ | $1-\mu$ |
| L2 | $-\mu$ | $7(1-\mu)$ |
| L3 | $-(1-\mu)$ | $7\mu$ |

Hay cambio de signo y Bolzano garantiza una raíz. En cada región separada por las dos masas,

$$F'(x)=1+\frac{2(1-\mu)}{|x+\mu|^3}+\frac{2\mu}{|x-1+\mu|^3}>0.$$

La fuerza efectiva es estrictamente creciente en cada región; esto da unicidad del equilibrio de cada rama. No se aplica Bolzano sobre un intervalo de la función racional que cruce una singularidad.

## 3. Método de bisección

Se calcula $c=a+(b-a)/2$ y se conserva el subintervalo con cambio de signo. El primer punto medio de la web usa $k=1$, por lo que, en aritmética exacta,

$$|c_k-r^*|\le\frac{b_0-a_0}{2^k}.$$

Con parada por cota menor o igual que $\tau$, el número suficiente de pasos es

$$N=\left\lceil\log_2\frac{b_0-a_0}{\tau}\right\rceil.$$

Con $[0,1]$ y $\tau=10^{-10}$ resulta $N=34$. La indexación adoptada asigna $k=1$ al primer punto medio; con una indexación desde $n=0$, la misma cota se expresa con $2^{n+1}$ (Kincaid y Cheney, §3.1).

El código usa $\max(c-a,b-c)$ como cota geométrica del intervalo actual, para incluir el redondeo del punto medio. Esto solo acota el error respecto de una raíz que siga dentro del intervalo. Si el redondeo corrompe un signo y la raíz real sale del intervalo, se pierde la certificación. El verificador comprueba la pertenencia de la referencia al intervalo mediante Decimal.

El error verdadero puede aumentar entre dos puntos medios mientras la cota ideal baja: la secuencia de puntos medios no siempre se acerca monótonamente a la raíz.

## 4. Método de Newton–Raphson

$$r_{k+1}=r_k-\frac{P(r_k)}{P'(r_k)}.$$

Se deriva el polinomio y se evalúan P y P' con Horner. No se calculan derivadas por diferencias finitas en el método. La semilla predeterminada es $0.01$ en L1 y L2, motivada por $(\mu/3)^{1/3}$; para L3 es $0.99$.

El teorema local exige una raíz simple y regularidad de la función (Kincaid y Cheney, §3.2). Entonces

$$e_{k+1}\approx\frac{|P''(r^*)|}{2|P'(r^*)|}e_k^2.$$

La convergencia local no garantiza el éxito desde cualquier semilla ni una reducción del error en cada paso. Se ensayan seis semillas para L1. Todas convergen en los casos evaluados, con diferentes cantidades de pasos.

### Relación con la secante y la iteración de punto fijo

La secante reemplaza P' por una pendiente entre dos aproximaciones. Bajo hipótesis locales usuales su orden es $(1+\sqrt5)/2$ (Kincaid y Cheney, §3.3). Sirve de comparación conceptual; no es un tercer método del experimento.

Newton se puede interpretar como iteración de punto fijo (Kincaid y Cheney, §3.4) con

$$g(r)=r-\frac{P(r)}{P'(r)},\qquad g'(r)=\frac{P(r)P''(r)}{[P'(r)]^2}.$$

En una raíz simple, $g'(r^*)=0$, lo que explica su rapidez local. No se demuestra ni se asume que g sea contractiva en todo $[0,1]$.

## 5. IEEE 754, evaluación y criterios de parada

| Formato | Signo | Exponente | Fracción almacenada | Precisión efectiva | Épsilon: siguiente después de 1 menos 1 |
|---|---|---|---|---|---|
| binary32 | 1 | 8 | 23 | 24 bits | $2^{-23}$ |
| binary64 | 1 | 11 | 52 | 53 bits | $2^{-52}$ |

Con redondeo al más cercano, la unidad de redondeo es $u=\epsilon/2$. Cerca de $r\approx0.01\in[2^{-7},2^{-6})$, el ULP es $2^{-30}$ en binary32 y $2^{-59}$ en binary64. No hay una regla universal de detenerse en la iteración 24 o 53.

En JavaScript, Number es binary64. La rama binary32 usa Math.fround en la conversión de datos, formación de coeficientes y cada operación básica. La evaluación no usa FMA. Horner reduce la cantidad de operaciones, pero no elimina la cancelación ni asegura signos exactos.

- Bisección: termina si la cota del intervalo es menor o igual que la tolerancia, si el punto medio coincide con un extremo, si el residuo se redondea a cero o si se agotan 100 pasos.
- Newton: para declarar tolerancia se exigen a la vez $|\Delta r|\le\tau$ y $|P_\mathrm{fl}(r)|/\sum_i|a_i r^i|\le\tau$. Se detectan por separado derivada nula, resultados no finitos, salida de la región, estancamiento y ciclos de dos puntos.
- Una parada por estancamiento no significa necesariamente que el error pedido sea grande: puede ocurrir cuando ya hay una muy buena aproximación. Se publica el motivo real y se comprueba el error aparte.
- Un residuo de máquina igual a cero no demuestra que P se anule exactamente. Tampoco se usa el error de referencia para decidir cuándo iterar o detenerse.

En Newton se adopta un criterio conjunto de paso y residuo, y se distinguen los motivos de detención. Este criterio permite evaluar ambos indicadores antes de declarar tolerancia, aunque sigue siendo una comprobación práctica y no un certificado del error verdadero.

## 6. Experimento ejecutado y archivos

Desde la raíz del repositorio:

```bash
python scripts/experimento_lagrange.py
```

Python ejecuta `scripts/ejecutar_lagrange.mjs`, que usa el mismo motor JavaScript del laboratorio. La referencia independiente usa Decimal a 80 dígitos y se contrasta con una ejecución de 90 dígitos; el desacuerdo es menor que $10^{-73}$. No se usan solvers externos de raíces.

El error se calcula convirtiendo cada aproximación de máquina a su decimal exacto antes de restar la referencia. El navegador reproduce esa resta con BigInt, evitando el error cero artificial que resultaría de convertir primero la referencia a Number.

- 48 experimentos: L1/L2/L3, bisección/Newton, binary32/binary64 y tolerancias $10^{-6},10^{-10},10^{-14},10^{-20}$.
- 6 semillas de Newton para L1, en binary64 y tolerancia $10^{-10}$.
- Resultados y parámetros: `frontend/src/lib/lagrangeData.json`.
- Todas las trazas: `frontend/public/lagrange/resultados.csv`.
- Informe generado: `docs/resultados-lagrange.md`.
- Motor: `frontend/src/lib/lagrangeSolver.js`.

Las tablas diferencian el residuo computado, el residuo reevaluado con alta precisión, el error en r, el error convertido a distancia y la pertenencia de la referencia al intervalo. La distancia física se convierte con R fuera de la iteración; la emulación de precisión se refiere al problema adimensional.

## Referencias bibliográficas

1. Kincaid, D., y Cheney, W. *Numerical Analysis: Mathematics of Scientific Computing*. 3.ª edición, §§3.1–3.4, pp. 74–108.
2. [JPL, *Locating the Lagrange Points*, apéndice A, pp. 351–358](https://descanso.jpl.nasa.gov/monograph/series12/LunarTraj--08AppendixALocatingtheLagrangePoints.pdf). Modelo circular restringido y ecuaciones quínticas, adaptados a la variable r definida en este estudio.
3. [JPL, *Astrodynamic Parameters*](https://ssd.jpl.nasa.gov/astro_par.html): parámetros gravitacionales y unidad astronómica.
4. [NASA, *What are Lagrange Points?*](https://science.nasa.gov/solar-system/resources/faq/what-are-lagrange-points/): interpretación física y estabilidad.
5. [Especificación ECMAScript, Math.fround](https://tc39.es/ecma262/#sec-math.fround): redondeo a binary32 y representación numérica de JavaScript.

Se utilizó asistencia de inteligencia artificial para explorar el modelo, revisar los métodos y organizar los experimentos. Se contrastaron las fuentes y se ejecutaron pruebas automáticas y comprobaciones de alta precisión. La explicación y defensa de los resultados corresponde al estudiante.
