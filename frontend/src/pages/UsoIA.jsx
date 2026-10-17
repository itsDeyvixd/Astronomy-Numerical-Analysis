import { useEffect } from "react";
import geminiImg from "../assets/Gemini1.png";
import PageTransition from "../components/PageTransition.jsx";
import Formula from "../components/Formula.jsx";
import { LagrangeMath } from "../components/LagrangeShared.jsx";

export default function UsoIA() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <PageTransition className="mx-auto max-w-3xl py-12 px-6">
      <h1 className="text-3xl font-display font-bold text-exp">Uso de IA</h1>
      
      <p className="mt-4 text-ink-dim leading-relaxed">
        Como punto de partida para este proyecto, se recurrió a herramientas de inteligencia artificial para comprender
        la utilidad fundamental de los métodos numéricos en la resolución de modelos astronómicos.
      </p>

      <div className="mt-10 rounded-xl border border-line bg-surface/80 backdrop-blur-md p-4 sm:p-8 shadow-2xl shadow-bg/50 transition-all hover:border-exp/30">
        
        {/* Prompt del usuario */}
        <div className="mb-8 flex gap-3 sm:gap-4 border-b border-line pb-6">
          <div className="flex h-8 w-8 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-full bg-surface-2 text-ink text-sm sm:text-base shadow-inner">
            U
          </div>
          <div>
            <p className="text-xs sm:text-sm font-semibold text-ink mb-1">Usuario</p>
            <p className="text-sm sm:text-base text-ink-dim leading-relaxed">
              ¿De qué manera los métodos numéricos de aproximación de raíces permiten resolver modelos astronómicos que carecen de solución matemática exacta?
            </p>
          </div>
        </div>

        {/* Respuesta de Gemini */}
        <div className="flex gap-3 sm:gap-4">
          <div className="flex h-8 w-8 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-full bg-exp-dim text-exp font-bold text-sm sm:text-base shadow-glow shadow-exp/20">
            G
          </div>
          
          <div className="text-ink-dim leading-relaxed space-y-5 text-sm sm:text-base overflow-hidden">
            <p>
              En la mecánica celeste, la cinemática de los cuerpos orbitales a menudo genera <strong className="text-ink">ecuaciones trascendentes</strong>, es decir, expresiones donde la variable de interés se encuentra atrapada simultáneamente como término algebraico y como argumento de una función trigonométrica. Dado que es imposible despejar analíticamente esta variable, los métodos numéricos transforman la limitación matemática en un problema algorítmico computacional: la búsqueda iterativa de una raíz <span className="font-mono text-ink bg-bg px-1.5 py-0.5 rounded">f(x) = 0</span>.
            </p>
            
            <p>
              El obstáculo clásico que ilustra esta necesidad es la <strong className="text-ink">Ecuación de Kepler</strong>, formulada en 1619 para calcular la posición de un planeta en su órbita elíptica en un instante de tiempo determinado:
            </p>
            
            <div className="my-6 flex justify-center py-4 bg-bg border border-line rounded-lg shadow-inner">
              <span className="font-mono text-lg text-mant">M = E - e sin(E)</span>
            </div>
            
            <p>Donde:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong className="text-ink">M (Anomalía media):</strong> Un ángulo ficticio proporcional al tiempo transcurrido.</li>
              <li><strong className="text-ink">e (Excentricidad):</strong> El grado de alargamiento de la órbita elíptica (constante conocida).</li>
              <li><strong className="text-ink">E (Anomalía excéntrica):</strong> El parámetro geométrico que define la posición real del cuerpo en la elipse.</li>
            </ul>
            
            <p>
              Para predecir dónde estará un cuerpo celeste en el futuro, se conoce el tiempo (M) y se necesita calcular la posición (E). Como no existe ninguna combinación finita de operaciones algebraicas para despejar E, se define la función:
            </p>
            
            <div className="my-6 flex justify-center py-4 bg-bg border border-line rounded-lg shadow-inner">
              <span className="font-mono text-lg text-sign">f(E) = E - e sin(E) - M = 0</span>
            </div>

            <div className="my-8 flex flex-col items-center">
              <img src={geminiImg} alt="Geometría de la anomalía excéntrica (E)" className="max-w-full sm:max-w-md h-auto rounded-xl shadow-lg border border-line" />
              <span className="mt-3 text-xs text-ink-faint">Geometría de la anomalía excéntrica (E). Fuente: www.bogan.ca</span>
            </div>

            <h3 className="text-xl font-bold text-ink mt-8 mb-4 border-b border-line pb-2">Solución Algorítmica mediante Iteración</h3>
            
            <p>
              En lugar de buscar una fórmula exacta, la programación de métodos numéricos parte de una aproximación inicial (típicamente <span className="font-mono text-ink bg-bg px-1.5 py-0.5 rounded">E₀ = M</span>) y ejecuta un bucle de refinamiento hasta que el error es menor que una tolerancia de punto flotante predefinida (<span className="font-mono text-ink bg-bg px-1.5 py-0.5 rounded">ε</span>).
            </p>
            
            <p>Los enfoques más comunes implementados en simuladores astronómicos son:</p>
            
            <div className="space-y-6 mt-6">
              <div className="bg-surface-2 p-5 rounded-lg border border-line border-l-4 border-l-exp">
                <h4 className="font-bold text-ink mb-2">1. Método de Newton-Raphson <span className="text-sm font-normal text-ink-dim">(El estándar por eficiencia)</span></h4>
                <p className="text-sm">
                  Debido a que la función de Kepler es suave y diferenciable, este método aprovecha la derivada (<span className="font-mono text-ink bg-bg px-1 py-0.5 rounded">f'(E) = 1 - e cos(E)</span>) para calcular iterativamente la intersección de la recta tangente con el eje horizontal.
                </p>
                <p className="text-sm mt-2">
                  A nivel computacional, este algoritmo posee <strong className="text-ink">convergencia cuadrática</strong>: el número de decimales correctos se duplica en cada iteración. En la mayoría de implementaciones de software, alcanza la precisión máxima de los números de 64 bits en apenas 4 a 6 ciclos de un bucle <code className="text-exp bg-bg px-1 py-0.5 rounded">while</code>.
                </p>
              </div>

              <div className="bg-surface-2 p-5 rounded-lg border border-line border-l-4 border-l-sign">
                <h4 className="font-bold text-ink mb-2">2. Método de Bisección o Secante <span className="text-sm font-normal text-ink-dim">(El respaldo de seguridad)</span></h4>
                <p className="text-sm">
                  Cuando la excentricidad <em className="text-ink font-serif">e</em> es muy cercana a 1 (como ocurre en las trayectorias de los cometas), la derivada puede acercarse a cero, provocando que Newton-Raphson diverja. En estos casos límite, las rutinas numéricas cambian automáticamente a métodos que garantizan el hallazgo de la raíz acotando el error por mitades en cada iteración basándose en el teorema del valor intermedio, sacrificando velocidad por estabilidad absoluta.
                </p>
              </div>
            </div>
            
          </div>
        </div>
      </div>
      <section className="mt-10 rounded-xl border border-sign/30 bg-surface/60 p-5 sm:p-7 space-y-5 text-sm sm:text-base text-ink-dim leading-relaxed">
        <h2 className="text-xl font-display font-semibold text-sign">Puntos de Lagrange · Germán Rodríguez</h2>
        <p className="border-b border-line pb-5 italic text-ink">
          ¿Cómo permiten los métodos numéricos encontrar una posición de equilibrio entre el Sol, la Tierra y una nave espacial?
        </p>
        <p>
          En el problema circular restringido de tres cuerpos, la nave tiene una masa tan pequeña que no altera el movimiento del Sol y la Tierra. En un marco de referencia que gira con estos dos cuerpos, los puntos de Lagrange son posiciones donde la gravedad y el efecto centrífugo permiten que la nave permanezca en reposo relativo.
        </p>
        <p>
          Para localizar <Formula tex="L_1" />, situado entre el Sol y la Tierra, su distancia a la Tierra se expresa como una fracción de la separación entre ambos cuerpos: <Formula tex="r=d/R" />. La condición de equilibrio se transforma en un polinomio quíntico:
        </p>
        <LagrangeMath tex={String.raw`P(r)=r^5-(3-\mu)r^4+(3-2\mu)r^3-\mu r^2+2\mu r-\mu=0`} />
        <p>
          Aquí, <Formula tex="\mu" /> representa la masa de la Tierra dividida por la masa total del sistema. Se calculan aproximaciones sucesivas de la raíz del polinomio y se recupera la distancia física mediante <Formula tex="d=Rr" />.
        </p>
        <h3 className="text-lg font-bold text-ink border-b border-line pb-2">Solución mediante bisección y Newton–Raphson</h3>
        <div className="space-y-4">
          <div className="rounded-lg border border-line border-l-4 border-l-sign bg-surface-2 p-5 space-y-3">
            <h4 className="font-bold text-ink">1. Bisección: reducir el intervalo de búsqueda</h4>
            <p>El método parte de un intervalo donde el polinomio es continuo y cambia de signo. Se calcula su punto medio y se conserva la mitad que contiene la raíz. La repetición del proceso reduce la incertidumbre de la posición de forma predecible.</p>
            <LagrangeMath tex={String.raw`c_k=a_k+\frac{b_k-a_k}{2}`} />
          </div>
          <div className="rounded-lg border border-line border-l-4 border-l-exp bg-surface-2 p-5 space-y-3">
            <h4 className="font-bold text-ink">2. Newton–Raphson: corregir la aproximación con la pendiente</h4>
            <p>Desde una posición inicial, se utilizan el valor del polinomio y su derivada para calcular una corrección. Cerca de una raíz simple, el método puede ganar precisión mucho más rápido, aunque su comportamiento depende de la semilla elegida.</p>
            <LagrangeMath tex={String.raw`r_{k+1}=r_k-\frac{P(r_k)}{P'(r_k)}`} />
          </div>
        </div>
        <h3 className="text-lg font-bold text-ink border-b border-line pb-2">El límite de la aritmética de punto flotante</h3>
        <p>
          La computadora representa los números con una cantidad finita de bits. En IEEE 754, binary32 ofrece aproximadamente 7 dígitos decimales y binary64 alrededor de 16. Cuando dos aproximaciones quedan demasiado cerca, la siguiente corrección puede redondearse al mismo número y el método deja de avanzar.
        </p>
        <p>
          Por eso, además de comparar bisección y Newton, el experimento observa el error, el residuo y el motivo de parada en ambos formatos. Un residuo redondeado a cero no demuestra que se haya encontrado una solución exacta: es necesario distinguir la precisión alcanzada del límite de representación de la máquina.
        </p>
      </section>
    </PageTransition>
  );
}
