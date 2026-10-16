import { useState } from "react";
import PageTransition from "../components/PageTransition.jsx";
import Formula from "../components/Formula.jsx";
import { Telescope, Compass, Flame, Orbit } from "lucide-react";

const TEMAS = [
  { 
    id: "redshift", 
    title: "Corrimiento al Rojo (z)", 
    subtitle: "Supernovas Tipo Ia · Método de Bisección", 
    author: "Nicolas Betancur", 
    icon: Telescope,
    accent: "mant" 
  },
  { 
    id: "kepler", 
    title: "Ecuación de Kepler", 
    subtitle: "Mecánica Celeste y Órbitas", 
    author: "Por definir", 
    icon: Orbit,
    accent: "exp" 
  },
  { 
    id: "lagrange", 
    title: "Puntos de Lagrange", 
    subtitle: "Equilibrio Gravitacional de 3 Cuerpos", 
    author: "Por definir", 
    icon: Compass,
    accent: "sign" 
  },
  { 
    id: "wien", 
    title: "Ley de Wien", 
    subtitle: "Radiación de Cuerpo Negro", 
    author: "Por definir", 
    icon: Flame,
    accent: "exp" 
  },
];

export default function IntuicionInicial() {
  const [activeTab, setActiveTab] = useState("redshift");

  return (
    <PageTransition className="mx-auto max-w-5xl py-12 px-6">
      
      {/* Encabezado */}
      <div>
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs uppercase tracking-wider text-exp font-semibold">
            Etapa 01
          </span>
          <span className="text-ink-faint text-xs">·</span>
          <span className="font-mono text-xs text-ink-dim">Análisis Numérico en Astronomía</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold font-display text-ink mt-2">
          Intuición Inicial por Modelo
        </h1>
        <p className="mt-3 text-ink-dim max-w-3xl leading-relaxed text-sm sm:text-base">
          Antes de ejecutar algoritmos numéricos, formulamos el marco físico del problema astronómico, identificamos por qué surge una ecuación no lineal imposible de despejar analíticamente y justificamos la viabilidad teórica y computacional del método de aproximación seleccionado.
        </p>
      </div>

      {/* Selector de Tema */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-8 mb-10">
        {TEMAS.map((tema) => {
          const Icon = tema.icon;
          const isActive = activeTab === tema.id;
          return (
            <button
              key={tema.id}
              onClick={() => setActiveTab(tema.id)}
              className={`p-4 border rounded-xl text-left transition-all flex flex-col justify-between ${
                isActive
                  ? "border-mant bg-surface/90 shadow-lg shadow-mant/10"
                  : "border-line bg-surface/40 hover:border-line hover:bg-surface/70 text-ink-dim"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Icon className={`size-5 ${isActive ? "text-mant" : "text-ink-faint"}`} />
                  {isActive && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-mant/10 text-mant border border-mant/30">
                      Activo
                    </span>
                  )}
                </div>
                <h3 className={`font-semibold text-sm ${isActive ? "text-ink" : "text-ink-dim"}`}>
                  {tema.title}
                </h3>
                <p className="text-xs text-ink-faint mt-1 line-clamp-1">{tema.subtitle}</p>
              </div>
              <div className="mt-4 pt-2 border-t border-line/60 flex items-center justify-between text-[11px] font-mono">
                <span className="text-ink-faint">Autor:</span>
                <span className={isActive ? "text-mant font-medium" : "text-ink-dim"}>
                  {tema.author}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Contenido del Tema Activo */}
      <div className="min-h-[500px]">

        {/* ---------------- TEMA: CORRIMIENTO AL ROJO (NICOLÁS BETANCUR) ---------------- */}
        {activeTab === "redshift" && (
          <article className="space-y-10 animate-in fade-in duration-300">
            
            {/* Título y Autor */}
            <div className="border-b border-line pb-6">
              <span className="text-xs font-mono text-mant uppercase tracking-wider block font-semibold mb-1">
                Trabajo de Investigación · Nicolas Betancur
              </span>
              <h2 className="text-2xl sm:text-3xl font-display font-bold text-ink">
                Determinación Numérica del Corrimiento al Rojo (<Formula tex="z" />) en Supernovas Tipo Ia: Aplicación y Límites del Método de Bisección
              </h2>
            </div>

            {/* Sección 1: Motivación y Pregunta */}
            <section className="space-y-4">
              <h3 className="text-xl font-display font-semibold text-exp flex items-center gap-2">
                <span>1. Motivación y Formulación de la Pregunta</span>
              </h3>
              
              <p className="text-ink-dim leading-relaxed">
                En el marco del curso de Análisis Numérico, nos planteamos la siguiente pregunta orientadora:
              </p>

              <div className="p-4 sm:p-5 rounded-xl border border-line bg-surface/70 border-l-4 border-l-mant my-4 shadow-inner">
                <p className="text-base sm:text-lg italic text-ink font-serif leading-relaxed">
                  &ldquo;¿De qué manera los métodos numéricos de aproximación de raíces permiten resolver modelos astronómicos que carecen de solución matemática exacta?&rdquo;
                </p>
              </div>

              <p className="text-ink-dim leading-relaxed">
                Para responder a esta pregunta sin quedarnos en una abstracción general, decidí aterrizar el problema en un caso astrofísico real y contemporáneo: <strong className="text-ink">la estimación del corrimiento al rojo (<Formula tex="z" />) de una supernova lejana a partir de su distancia de luminosidad observada</strong>.
              </p>

              <p className="text-ink-dim leading-relaxed">
                La astrofísica observacional y la cosmología teórica moderna frecuentemente colisionan con una barrera matemática: las leyes físicas fundamentales (en este caso, la Relatividad General y las ecuaciones de Friedmann) generan relaciones funcionales que involucran integrales elípticas o funciones trascendentes de las cuales <strong className="text-ink">es algebraicamente imposible despejar la variable física de interés</strong>.
              </p>

              <p className="text-ink-dim leading-relaxed">
                Mi intuición inicial es que resolver este problema recae directamente en el Análisis Numérico que hemos visto sobre ecuaciones no lineales y métodos de aproximación, dado que la forma de contrastar y hallar las distancias termina siendo encontrar las raíces de una función residual. Sin embargo, para validar si esta intuición es completamente correcta, es necesario analizar la plausibilidad matemática del método, definir criterios de parada rigurosos y examinar las limitaciones que impone la aritmética de punto flotante de una computadora real.
              </p>
            </section>

            {/* Sección 2: Marco Físico e Intuición del Fenómeno */}
            <section className="space-y-6 border-t border-line pt-8">
              <h3 className="text-xl font-display font-semibold text-exp">
                2. Marco Físico e Intuición del Fenómeno
              </h3>

              <p className="text-ink-dim leading-relaxed">
                Para comprender por qué surge una ecuación no lineal, primero debemos entender las dos magnitudes físicas que interactúan en el problema:
              </p>

              {/* 2.1 */}
              <div className="space-y-3 bg-surface/50 p-5 rounded-xl border border-line">
                <h4 className="text-lg font-semibold text-ink">
                  2.1. ¿Qué representa el corrimiento al rojo (<Formula tex="z" />)?
                </h4>
                <p className="text-ink-dim leading-relaxed">
                  Cuando un átomo emite luz en un laboratorio, lo hace en longitudes de onda de referencia conocidas (<Formula tex="\lambda_{\text{emit}}" />). Sin embargo, cuando captamos esa misma luz proveniente de una galaxia distante, observamos que las líneas espectrales se encuentran desplazadas hacia el rojo (<Formula tex="\lambda_{\text{obs}} > \lambda_{\text{emit}}" />). Cuantitativamente, definimos el corrimiento al rojo como:
                </p>

                <div className="my-3 flex justify-center py-3 bg-bg/80 border border-line rounded-lg">
                  <Formula tex={String.raw`z = \frac{\lambda_{\text{obs}} - \lambda_{\text{emit}}}{\lambda_{\text{emit}}}`} block />
                </div>

                <p className="text-ink-dim leading-relaxed">
                  Físicamente, en cosmología este corrimiento no es un simple efecto Doppler cinemático (como el sonido de una ambulancia alejándose), sino el resultado de la <strong className="text-ink">expansión métrica del espacio-tiempo</strong>. A medida que el haz de luz viaja durante miles de millones de años a través del universo, el propio tejido del espacio se estira, alargando la longitud de onda de los fotones. Existe una relación directa entre <Formula tex="z" /> y el factor de escala del universo <Formula tex="a(t)" />:
                </p>

                <div className="my-3 flex justify-center py-3 bg-bg/80 border border-line rounded-lg">
                  <Formula tex={String.raw`1 + z = \frac{a(\text{hoy})}{a(\text{emisión})}`} block />
                </div>

                <p className="text-ink-dim leading-relaxed">
                  De esta manera, <strong className="text-ink">la variable <Formula tex="z" /> actúa simultáneamente como indicador de distancia y como reloj cósmico</strong>: un valor mayor de <Formula tex="z" /> significa que la luz proviene de una época más remota del universo y de una distancia cósmica más lejana.
                </p>
              </div>

              {/* 2.2 */}
              <div className="space-y-3 bg-surface/50 p-5 rounded-xl border border-line">
                <h4 className="text-lg font-semibold text-ink">
                  2.2. ¿Cómo se obtiene la distancia observada (<Formula tex="D_{\text{obs}}" />)?
                </h4>
                <p className="text-ink-dim leading-relaxed">
                  En el cosmos no podemos tender una cinta métrica. Para medir distancias intergalácticas, los astrónomos recurren a las llamadas <strong className="text-ink">candelas estándar</strong>, siendo las más precisas las <strong className="text-ink">Supernovas Tipo Ia</strong>:
                </p>

                <ol className="list-decimal pl-5 space-y-2 text-ink-dim">
                  <li>
                    <strong className="text-ink">Física del evento:</strong> Estas supernovas ocurren cuando una enana blanca en un sistema binario acreta masa hasta alcanzar el límite crítico de Chandrasekhar (<Formula tex="\approx 1.44\text{ masas solares}" />). Al llegar exactamente a esta masa, colapsa en una detonación termonuclear. Como todas explotan bajo las mismas condiciones físicas críticas, <strong className="text-ink">todas emiten prácticamente la misma potencia luminosa intrínseca (<Formula tex="L" />)</strong>.
                  </li>
                  <li>
                    <strong className="text-ink">Medición empírica:</strong> Desde la Tierra, medimos el flujo aparente de energía capturado por el telescopio (<Formula tex="F" />, en <Formula tex="\text{W}/\text{m}^2" />). Por la ley del inverso del cuadrado de la distancia:
                    <div className="my-2 flex justify-center py-2 bg-bg/80 border border-line rounded-lg">
                      <Formula tex={String.raw`F = \frac{L}{4\pi D_{\text{obs}}^2} \implies D_{\text{obs}} = \sqrt{\frac{L}{4\pi F}}`} block />
                    </div>
                  </li>
                </ol>

                <p className="text-ink-dim leading-relaxed mt-2">
                  Así, analizando la luz capturada de la supernova, obtenemos un valor numérico empírico: la distancia de luminosidad observada <Formula tex="D_{\text{obs}}" />.
                </p>
              </div>
            </section>

            {/* Sección 3: El Modelo Teórico y la Ecuación No Lineal */}
            <section className="space-y-4 border-t border-line pt-8">
              <h3 className="text-xl font-display font-semibold text-exp">
                3. El Modelo Teórico y el Origen de la Ecuación No Lineal
              </h3>

              <p className="text-ink-dim leading-relaxed">
                Por otra parte, la cosmología teórica estándar (modelo <Formula tex="\Lambda\text{CDM}" />, que describe un universo plano dominado por materia oscura <Formula tex="\Omega_m" /> y energía oscura <Formula tex="\Omega_\Lambda" />) predice matemáticamente que la distancia de luminosidad a un objeto situado a un corrimiento al rojo <Formula tex="z" /> es:
              </p>

              <div className="my-4 overflow-x-auto py-4 px-6 bg-surface border border-line rounded-xl flex justify-center shadow-inner">
                <Formula tex={String.raw`D_L(z) = \frac{c(1+z)}{H_0} \int_0^z \frac{dz'}{\sqrt{\Omega_m(1+z')^3 + \Omega_\Lambda}}`} block />
              </div>

              <p className="text-ink-dim text-xs font-mono text-center">
                donde <Formula tex="c" /> es la velocidad de la luz, <Formula tex="H_0" /> es la constante de Hubble, <Formula tex="\Omega_m \approx 0.3" /> y <Formula tex="\Omega_\Lambda \approx 0.7" />.
              </p>

              <div className="p-4 rounded-xl border border-line bg-surface/40 my-3">
                <h4 className="font-semibold text-sign text-sm uppercase tracking-wider mb-2">
                  El obstáculo analítico
                </h4>
                <p className="text-ink-dim leading-relaxed text-sm">
                  El integrando contiene el término cúbico <Formula tex="(1+z')^3" /> dentro de una raíz cuadrada en el denominador. Esta integral pertenece a la familia de las <strong className="text-ink">integrales elípticas incompletas</strong>, las cuales <strong className="text-ink">no admiten una función primitiva elemental</strong>.
                </p>
                <ul className="list-disc pl-5 space-y-1 text-xs text-ink-dim mt-2">
                  <li>No podemos resolver la integral simbólicamente mediante métodos de integración convencionales.</li>
                  <li><strong className="text-ink">Es imposible despejar algebraicamente la variable <Formula tex="z" /> en función de <Formula tex="D_L" />.</strong></li>
                </ul>
              </div>

              <p className="text-ink-dim leading-relaxed">
                Para determinar a qué época o distancia cosmológica <Formula tex="z" /> corresponde la supernova que observamos en el telescopio, la teoría física exige que la distancia teórica coincida con la distancia observada:
              </p>

              <div className="my-2 flex justify-center py-2 bg-bg/80 border border-line rounded-lg">
                <Formula tex={String.raw`D_L(z) = D_{\text{obs}}`} block />
              </div>

              <p className="text-ink-dim leading-relaxed">
                Restando ambas cantidades, definimos nuestra <strong className="text-ink">función residual</strong>:
              </p>

              <div className="my-3 flex justify-center py-3 bg-surface border border-line rounded-lg shadow-inner">
                <Formula tex={String.raw`f(z) = D_L(z) - D_{\text{obs}} = 0`} block />
              </div>

              <p className="text-ink-dim leading-relaxed">
                Resolver esta ecuación para hallar el valor exacto de <Formula tex="z" /> es matemáticamente equivalente a <strong className="text-ink">encontrar el cero o la raíz de la función no lineal <Formula tex="f(z)" /></strong>.
              </p>
            </section>

            {/* Sección 4: Plausibilidad Teórica del Método de Bisección */}
            <section className="space-y-4 border-t border-line pt-8">
              <h3 className="text-xl font-display font-semibold text-exp">
                4. Plausibilidad Teórica del Método de Bisección
              </h3>

              <p className="text-ink-dim leading-relaxed">
                Mi propuesta consiste en resolver este problema empleando el <strong className="text-ink">Método de Bisección</strong>. Para garantizar que esta intuición sea viable, verificamos rigurosamente sus fundamentos matemáticos:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
                <div className="p-4 rounded-xl border border-line bg-surface/50">
                  <span className="font-mono text-xs text-mant uppercase font-bold block mb-1">1. Continuidad</span>
                  <p className="text-xs text-ink-dim leading-relaxed">
                    La función <Formula tex="D_L(z)" /> es continua para todo <Formula tex="z \ge 0" />, pues el integrando es una función continua y diferenciable en dicho dominio. En consecuencia, <Formula tex="f(z) \in C[a, b]" />.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-line bg-surface/50">
                  <span className="font-mono text-xs text-mant uppercase font-bold block mb-1">2. Teorema de Bolzano</span>
                  <p className="text-xs text-ink-dim leading-relaxed">
                    En <Formula tex="z = 0" />, <Formula tex="f(0) = -D_{\text{obs}} < 0" />. Para <Formula tex="z_{\max} = 5" />, <Formula tex="D_L(z_{\max}) > D_{\text{obs}} \implies f(z_{\max}) > 0" />. Al haber cambio de signo, el <strong>Teorema del Valor Intermedio</strong> garantiza al menos una raíz en <Formula tex="(0, z_{\max})" />.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-line bg-surface/50">
                  <span className="font-mono text-xs text-mant uppercase font-bold block mb-1">3. Monotonía y Unicidad</span>
                  <p className="text-xs text-ink-dim leading-relaxed">
                    Dado que <Formula tex="\Omega_m, \Omega_\Lambda > 0" />, el integrando es estrictamente positivo para todo <Formula tex="z' \ge 0" />. Por tanto, <Formula tex="D_L(z)" /> es <strong>estrictamente creciente</strong>, asegurando que <strong>la raíz es estrictamente única</strong>, sin riesgo de soluciones espurias.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-line bg-surface/50">
                  <span className="font-mono text-xs text-mant uppercase font-bold block mb-1">4. Ventaja Operativa</span>
                  <p className="text-xs text-ink-dim leading-relaxed">
                    A diferencia del método de Newton o de la Secante, Bisección no exige calcular derivadas analíticas de una función definida por integrales, ni corre riesgo de divergencia local. Su convergencia es incondicional y predecible.
                  </p>
                </div>
              </div>
            </section>

            {/* Sección 5: El Desafío Computacional */}
            <section className="space-y-6 border-t border-line pt-8">
              <h3 className="text-xl font-display font-semibold text-exp">
                5. El Desafío Computacional: Aritmética de Punto Flotante y Criterios de Parada
              </h3>

              <p className="text-ink-dim leading-relaxed">
                Aterrizar este modelo en una computadora exige reconocer que el comportamiento computacional en aritmética de precisión finita difiere del comportamiento matemático ideal. Para nuestro estudio, los focos de análisis numérico son:
              </p>

              {/* 5.1 */}
              <div className="space-y-3 bg-surface/50 p-5 rounded-xl border border-line">
                <h4 className="text-lg font-semibold text-ink">
                  5.1. Criterios de parada y la &quot;no monotonicidad&quot; del error
                </h4>
                <ul className="space-y-3 text-ink-dim text-sm">
                  <li>
                    <strong className="text-ink">Cota a priori:</strong> Sabemos teóricamente que el error absoluto en la iteración <Formula tex="n" /> está acotado por:
                    <div className="my-2 flex justify-center py-2 bg-bg/80 border border-line rounded-lg">
                      <Formula tex={String.raw`|r - c_n| \le \frac{b_0 - a_0}{2^{n+1}}`} block />
                    </div>
                    lo que nos permite predecir el número mínimo de iteraciones <Formula tex="n" /> requeridas para una tolerancia dada <Formula tex="\varepsilon" />:
                    <div className="my-2 flex justify-center py-2 bg-bg/80 border border-line rounded-lg">
                      <Formula tex={String.raw`n \ge \frac{\ln(b_0 - a_0) - \ln \varepsilon}{\ln 2} - 1`} block />
                    </div>
                  </li>
                  <li>
                    <strong className="text-ink">Error real vs. Cota teórica:</strong> Si bien la cota teórica se reduce estrictamente a la mitad en cada paso (<Formula tex="1/2, 1/4, 1/8, \dots" />), el <strong className="text-ink">error verdadero</strong> <Formula tex="|r - c_n|" /> no necesariamente decrece de forma monótona, ya que el punto medio puede situarse accidentalmente muy cerca de la raíz en una etapa y alejarse relativamente en la siguiente.
                  </li>
                </ul>
              </div>

              {/* 5.2 */}
              <div className="space-y-3 bg-surface/50 p-5 rounded-xl border border-line">
                <h4 className="text-lg font-semibold text-ink">
                  5.2. El &quot;Piso de Ruido&quot; de la Cuadratura Numérica
                </h4>
                <p className="text-ink-dim leading-relaxed text-sm">
                  En la máquina, <Formula tex="D_L(z)" /> no puede calcularse de forma continua; debe aproximarse mediante un método de cuadratura numérica (ej. regla de Simpson o Cuadratura Gaussiana). Por tanto, la computadora no evalúa la función continua ideal <Formula tex="f(z)" />, sino una versión perturbada:
                </p>
                <div className="my-2 flex justify-center py-2 bg-bg/80 border border-line rounded-lg">
                  <Formula tex={String.raw`\hat{f}(z) = f(z) + e_{\text{cuadratura}} + e_{\text{redondeo}}`} block />
                </div>
                <p className="text-ink-dim leading-relaxed text-sm">
                  Cerca de la raíz verdadera, los valores de la función son tan pequeños que el error de integración y el error de redondeo compiten con el valor real de la función, generando una fluctuación numérica que puede engañar al algoritmo si se exige una tolerancia por debajo del límite de resolución del integrador.
                </p>
              </div>

              {/* 5.3 */}
              <div className="space-y-3 bg-surface/50 p-5 rounded-xl border border-line">
                <h4 className="text-lg font-semibold text-ink">
                  5.3. Implementación numéricamente estable
                </h4>
                <p className="text-ink-dim leading-relaxed text-sm">
                  En el código se deben aplicar buenas prácticas de punto flotante aprendidas en el curso:
                </p>
                <ul className="list-disc pl-5 space-y-2 text-ink-dim text-sm">
                  <li>
                    <strong className="text-ink">Cálculo estable del punto medio:</strong> Usar <Formula tex={String.raw`c = a + \frac{b - a}{2}`} /> en lugar de <Formula tex={String.raw`c = \frac{a + b}{2}`} /> para evitar desbordamiento (<em>overflow</em>) o pérdida de precisión innecesaria.
                  </li>
                  <li>
                    <strong className="text-ink">Control de signos sin subdesbordamiento (<em>underflow</em>):</strong> Evaluar <code className="font-mono text-xs text-mant">np.sign(f_a) != np.sign(f_c)</code> en vez del producto <code className="font-mono text-xs">f(a) * f(c) &lt; 0</code>, ya que el producto de dos números muy pequeños puede redondearse a cero en punto flotante (<code className="font-mono text-xs">float32</code>), rompiendo la lógica del algoritmo.
                  </li>
                  <li>
                    <strong className="text-ink">Estancamiento de máquina:</strong> Si el intervalo <Formula tex="[a_n, b_n]" /> se reduce al orden del épsilon de máquina <Formula tex="\epsilon" />, ocurre que <Formula tex="\text{fl}(a + (b-a)/2) = a" /> o <Formula tex="b" />, impidiendo que el intervalo continúe dividiéndose. Analizaremos este fenómeno comparando la ejecución en precisión simple (<code className="font-mono text-xs">float32</code>) frente a doble precisión (<code className="font-mono text-xs">float64</code>).
                  </li>
                </ul>
              </div>
            </section>

            {/* Sección 6: Conclusión de la Intuición Inicial */}
            <section className="space-y-4 border-t border-line pt-8">
              <h3 className="text-xl font-display font-semibold text-exp">
                6. Conclusión de la Intuición Inicial
              </h3>

              <div className="p-5 rounded-xl border border-mant/30 bg-surface/80 space-y-3">
                <p className="text-ink-dim leading-relaxed">
                  El problema astronómico de la distancia cosmológica es un ejemplo donde los métodos numéricos no son una opción accesoria, sino el único camino para validar observaciones empíricas frente a la teoría cosmológica.
                </p>
                <p className="text-ink-dim leading-relaxed">
                  El Método de Bisección se postula como una herramienta totalmente plausible, robusta y matemáticamente fundamentada para este fin. La experimentación numérica posterior se centrará en verificar empíricamente la fórmula teórica de iteraciones, graficar la no-monotonicidad del error real, medir el impacto del ruido de cuadratura sobre el residuo y contrastar el límite de precisión de la máquina entre formatos de 32 y 64 bits.
                </p>
              </div>
            </section>

          </article>
        )}

        {/* ---------------- PLACEHOLDERS PARA LOS DEMÁS TEMAS ---------------- */}
        {activeTab !== "redshift" && (
          <div className="animate-in fade-in duration-300 py-16 px-6 border border-dashed border-line rounded-xl flex flex-col items-center justify-center text-center bg-surface/20">
            <div className="p-3 rounded-full bg-surface-2 text-ink-dim mb-3">
              {activeTab === "kepler" && <Orbit className="size-8 text-exp" />}
              {activeTab === "lagrange" && <Compass className="size-8 text-sign" />}
              {activeTab === "wien" && <Flame className="size-8 text-exp" />}
            </div>
            <h3 className="text-xl font-display font-semibold text-ink">
              {TEMAS.find(t => t.id === activeTab)?.title}
            </h3>
            <p className="text-sm text-ink-dim max-w-md mt-2">
              Sección reservada para el planteamiento e intuición inicial de este modelo astronómico.
            </p>
            <span className="mt-4 font-mono text-xs px-3 py-1 rounded-full bg-surface text-ink-faint border border-line">
              Contenido en desarrollo · Esperando intuición de {TEMAS.find(t => t.id === activeTab)?.author}
            </span>
          </div>
        )}

      </div>
    </PageTransition>
  );
}
