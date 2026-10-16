# Determinación Numérica del Corrimiento al Rojo ($z$) en Supernovas Tipo Ia: Aplicación y Límites del Método de Bisección

## 1. Motivación y Formulación de la Pregunta

En el marco del curso de Análisis Numérico, nos planteamos la siguiente pregunta orientadora:

> **"¿De qué manera los métodos numéricos de aproximación de raíces permiten resolver modelos astronómicos que carecen de solución matemática exacta?"**

Para responder a esta pregunta sin quedarnos en una abstracción general, decidí aterrizar el problema en un caso astrofísico real y contemporáneo: **la estimación del corrimiento al rojo ($z$) de una supernova lejana a partir de su distancia de luminosidad observada**.

La astrofísica observacional y la cosmología teórica moderna frecuentemente colisionan con una barrera matemática: las leyes físicas fundamentales (en este caso, la Relatividad General y las ecuaciones de Friedmann) generan relaciones funcionales que involucran integrales elípticas o funciones trascendentes de las cuales **es algebraicamente imposible despejar la variable física de interés**.

Mi intuición inicial es que resolver este problema recae directamente en el Análisis Numérico que hemos visto sobre ecuaciones no lineales y métodos de aproximación, dado que la forma de contrastar y hallar las distancias termina siendo encontrar las raíces de una función residual. Sin embargo, para validar si esta intuición es completamente correcta, es necesario analizar la plausibilidad matemática del método, definir criterios de parada rigurosos y examinar las limitaciones que impone la aritmética de punto flotante de una computadora real.

---

## 2. Marco Físico e Intuición del Fenómeno

Para comprender por qué surge una ecuación no lineal, primero debemos entender las dos magnitudes físicas que interactúan en el problema:

### 2.1. ¿Qué representa el corrimiento al rojo ($z$)?
Cuando un átomo emite luz en un laboratorio, lo hace en longitudes de onda de referencia conocidas ($\lambda_{\text{emit}}$). Sin embargo, cuando captamos esa misma luz proveniente de una galaxia distante, observamos que las líneas espectrales se encuentran desplazadas hacia el rojo ($\lambda_{\text{obs}} > \lambda_{\text{emit}}$). Cuantitativamente, definimos el corrimiento al rojo como:

$$z = \frac{\lambda_{\text{obs}} - \lambda_{\text{emit}}}{\lambda_{\text{emit}}}$$

Físicamente, en cosmología este corrimiento no es un simple efecto Doppler cinemático (como el sonido de una ambulancia alejándose), sino el resultado de la **expansión métrica del espacio-tiempo**. A medida que el haz de luz viaja durante miles de millones de años a través del universo, el propio tejido del espacio se estira, alargando la longitud de onda de los fotones. Existe una relación directa entre $z$ y el factor de escala del universo $a(t)$:

$$1 + z = \frac{a(\text{hoy})}{a(\text{emisión})}$$

De esta manera, **la variable $z$ actúa simultáneamente como indicador de distancia y como reloj cósmico**: un valor mayor de $z$ significa que la luz proviene de una época más remota del universo y de una distancia cósmica más lejana.

### 2.2. ¿Cómo se obtiene la distancia observada ($D_{\text{obs}}$)?
En el cosmos no podemos tender una cinta métrica. Para medir distancias intergalácticas, los astrónomos recurren a las llamadas **candelas estándar**, siendo las más precisas las **Supernovas Tipo Ia**:
1. **Física del evento:** Estas supernovas ocurren cuando una enana blanca en un sistema binario acreta masa hasta alcanzar el límite crítico de Chandrasekhar ($\approx 1.44\text{ masas solares}$). Al llegar exactamente a esta masa, colapsa en una detonación termonuclear. Como todas explotan bajo las mismas condiciones físicas críticas, **todas emiten prácticamente la misma potencia luminosa intrínseca ($L$)**.
2. **Medición empírica:** Desde la Tierra, medimos el flujo aparente de energía capturado por el telescopio ($F$, en $\text{W}/\text{m}^2$). Por la ley del inverso del cuadrado de la distancia:

   $$F = \frac{L}{4\pi D_{\text{obs}}^2} \implies D_{\text{obs}} = \sqrt{\frac{L}{4\pi F}}$$

Así, analizando la luz capturada de la supernova, obtenemos un valor numérico empírico: la distancia de luminosidad observada $D_{\text{obs}}$.

---

## 3. El Modelo Teórico y el Origen de la Ecuación No Lineal

Por otra parte, la cosmología teórica estándar (modelo $\Lambda\text{CDM}$, que describe un universo plano dominado por materia oscura $\Omega_m$ y energía oscura $\Omega_\Lambda$) predice matemáticamente que la distancia de luminosidad a un objeto situado a un corrimiento al rojo $z$ es:

$$D_L(z) = \frac{c(1+z)}{H_0} \int_0^z \frac{dz'}{\sqrt{\Omega_m(1+z')^3 + \Omega_\Lambda}}$$

donde $c$ es la velocidad de la luz, $H_0$ es la constante de Hubble, $\Omega_m \approx 0.3$ y $\Omega_\Lambda \approx 0.7$.

### El obstáculo analítico
El integrando contiene el término cúbico $(1+z')^3$ dentro de una raíz cuadrada en el denominador. Esta integral pertenece a la familia de las **integrales elípticas incompletas**, las cuales **no admiten una función primitiva elemental**.

En consecuencia:
- No podemos resolver la integral simbólicamente mediante métodos de integración convencionales.
- **Es imposible despejar algebraicamente la variable $z$ en función de $D_L$.**

Para determinar a qué época o distancia cosmológica $z$ corresponde la supernova que observamos en el telescopio, la teoría física exige que la distancia teórica coincida con la distancia observada:

$$D_L(z) = D_{\text{obs}}$$

Restando ambas cantidades, definimos nuestra **función residual**:

$$f(z) = D_L(z) - D_{\text{obs}} = 0$$

Resolver esta ecuación para hallar el valor exacto de $z$ es matemáticamente equivalente a **encontrar el cero o la raíz de la función no lineal $f(z)$**.

---

## 4. Plausibilidad Teórica del Método de Bisección

Mi propuesta consiste en resolver este problema empleando el **Método de Bisección**. Para garantizar que esta intuición sea viable, verificamos rigurosamente sus fundamentos matemáticos:

1. **Continuidad:** La función $D_L(z)$ es continua para todo $z \ge 0$, pues el integrando es una función continua y diferenciable en dicho dominio. En consecuencia, $f(z) \in C[a, b]$.
2. **Cumplimiento del Teorema de Bolzano:**
   - En $z = 0$, la integral es nula: $D_L(0) = 0 \implies f(0) = 0 - D_{\text{obs}} = -D_{\text{obs}} < 0$ (ya que toda distancia física observada es estrictamente positiva).
   - Para un valor superior astronómicamente alto (por ejemplo, $z_{\max} = 5$ o $z_{\max} = 10$, que abarca casi la totalidad del universo observable), la función acumulada crece lo suficiente tal que $D_L(z_{\max}) > D_{\text{obs}} \implies f(z_{\max}) > 0$.
   - Al haber un cambio de signo en los extremos del intervalo $[0, z_{\max}]$, el **Teorema del Valor Intermedio (Bolzano)** garantiza formalmente que existe al menos un $r \in (0, z_{\max})$ tal que $f(r) = 0$.
3. **Monotonía y Unicidad de la Raíz:**
   Dado que $\Omega_m, \Omega_\Lambda > 0$, el integrando es estrictamente positivo para todo $z' \ge 0$. Por tanto, la función $D_L(z)$ es **estrictamente creciente**. Esto nos asegura que **la raíz no solo existe, sino que es estrictamente única**, descartando cualquier riesgo de convergencia a soluciones múltiples o espurias.
4. **Ventaja operativa:** A diferencia del método de Newton o de la Secante, Bisección no exige calcular derivadas analíticas de una función definida por integrales, ni corre el riesgo de divergencia local. Su convergencia es incondicional y predecible.

---

## 5. El Desafío Computacional: Aritmética de Punto Flotante y Criterios de Parada

Aterrizar este modelo en una computadora exige reconocer que el comportamiento computacional en aritmética de precisión finita difiere del comportamiento matemático ideal. Para nuestro estudio, los focos de análisis numérico son:

### 5.1. Criterios de parada y la "no monotonicidad" del error
- **Cota a priori:** Sabemos teóricamente que el error absoluto en la iteración $n$ está acotado por:

  $$|r - c_n| \le \frac{b_0 - a_0}{2^{n+1}}$$

  lo que nos permite predecir el número mínimo de iteraciones $n$ requeridas para una tolerancia dada $\varepsilon$:

  $$n \ge \frac{\ln(b_0 - a_0) - \ln \varepsilon}{\ln 2} - 1$$

- **Error real vs. Cota teórica:** Si bien la cota teórica se reduce estrictamente a la mitad en cada paso ($1/2, 1/4, 1/8, \dots$), el **error verdadero** $|r - c_n|$ no necesariamente decrece de forma monótona, ya que el punto medio puede situarse accidentalmente muy cerca de la raíz en una etapa y alejarse relativamente en la siguiente.

### 5.2. El "Piso de Ruido" de la Cuadratura Numérica
En la máquina, $D_L(z)$ no puede calcularse de forma continua; debe aproximarse mediante un método de cuadratura numérica (ej. regla de Simpson o Cuadratura Gaussiana). Por tanto, la computadora no evalúa la función continua ideal $f(z)$, sino una versión perturbada:

$$\hat{f}(z) = f(z) + e_{\text{cuadratura}} + e_{\text{redondeo}}$$

Cerca de la raíz verdadera, los valores de la función son tan pequeños que el error de integración y el error de redondeo compiten con el valor real de la función, generando una fluctuación numérica que puede engañar al algoritmo si se exige una tolerancia por debajo del límite de resolución del integrador.

### 5.3. Implementación numéricamente estable
En el código se deben aplicar buenas prácticas de punto flotante aprendidas en el curso:
- **Cálculo estable del punto medio:** Usar $c = a + \frac{b - a}{2}$ en lugar de $c = \frac{a + b}{2}$ para evitar desbordamiento (*overflow*) o pérdida de precisión innecesaria.
- **Control de signos sin subdesbordamiento (*underflow*):** Evaluar `np.sign(f_a) != np.sign(f_c)` en vez del producto `f(a) * f(c) < 0`, ya que el producto de dos números muy pequeños puede redondearse a cero en punto flotante (`float32`), rompiendo la lógica del algoritmo.
- **Estancamiento de máquina:** Si el intervalo $[a_n, b_n]$ se reduce al orden del épsilon de máquina $\epsilon$, ocurre que $\text{fl}(a + (b-a)/2) = a$ o $b$, impidiendo que el intervalo continúe dividiéndose. Analizaremos este fenómeno comparando la ejecución en precisión simple (`float32`) frente a doble precisión (`float64`).

---

## 6. Conclusión de la Intuición Inicial

El problema astronómico de la distancia cosmológica es un ejemplo donde los métodos numéricos no son una opción accesoria, sino el único camino para validar observaciones empíricas frente a la teoría cosmológica.

El Método de Bisección se postula como una herramienta totalmente plausible, robusta y matemáticamente fundamentada para este fin. La experimentación numérica posterior se centrará en verificar empíricamente la fórmula teórica de iteraciones, graficar la no-monotonicidad del error real, medir el impacto del ruido de cuadratura sobre el residuo y contrastar el límite de precisión de la máquina entre formatos de 32 y 64 bits.
