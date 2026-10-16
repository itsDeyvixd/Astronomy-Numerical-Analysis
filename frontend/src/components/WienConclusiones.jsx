// frontend/src/components/WienConclusiones.jsx
import Formula from "./Formula.jsx";
import { CONSTANTS, STELLAR_CATALOG, computeAstrophysics } from "../lib/wienSolver.js";
import {
  Lightbulb,
  ShieldCheck,
  Cpu,
  TrendingDown,
  Flame,
  CheckCircle2,
} from "lucide-react";

export default function WienConclusiones() {
  const astro = computeAstrophysics(CONSTANTS.X_STAR);

  return (
    <article className="space-y-8 animate-in fade-in duration-300">
      {/* Encabezado */}
      <header className="p-6 rounded-2xl border border-exp/30 bg-surface/80 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-exp/5 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-exp font-semibold">
              Defensa y Síntesis Experimental
            </span>
            <h2 className="text-2xl font-bold font-display text-ink mt-1">
              Conclusiones: Termometría Estelar y Límites Computacionales en la Ley de Wien
            </h2>
            <p className="text-xs font-mono text-ink-dim mt-1">
              Radiación de Cuerpo Negro de Planck · Bisección, Punto Fijo y Newton-Raphson
            </p>
          </div>
          <div className="px-3 py-1.5 rounded-lg border border-line bg-surface font-mono text-xs text-ink-dim">
            Investigador: <span className="text-exp font-semibold">Juan Huertas</span>
          </div>
        </div>
      </header>

      {/* Los 5 Hallazgos Fundamentales */}
      <div className="space-y-5">
        <div className="p-6 rounded-xl border border-line bg-surface/50 hover:border-exp/40 transition-colors space-y-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center size-8 rounded-lg bg-exp/10 text-exp font-mono font-bold text-sm border border-exp/30 shrink-0">
              1
            </div>
            <h3 className="text-lg font-semibold text-ink flex items-center gap-2">
              <Lightbulb className="size-5 text-exp" />
              Respuesta a la Pregunta Orientadora del Proyecto
            </h3>
          </div>
          <p className="text-ink-dim leading-relaxed text-sm sm:text-base pl-11">
            La imposibilidad de despejar analíticamente <Formula tex="x" /> en la condición de máximo espectral de Planck (<Formula tex="x + 5e^{-x} - 5 = 0" />) demuestra que una ley fundamental de la astrofísica depende intrínsecamente del cálculo numérico. Al transformar el problema de optimización continua en una sucesión convergente de aproximaciones, determinamos la raíz adimensional <Formula tex="x^* \approx 4.965114231744276" /> y con ella la constante universal de desplazamiento de Wien <Formula tex="b = \frac{hc}{k_B x^*} \approx 2.897771955 \times 10^{-3}\text{ m}\cdot\text{K}" />.
          </p>
        </div>

        <div className="p-6 rounded-xl border border-line bg-surface/50 hover:border-exp/40 transition-colors space-y-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center size-8 rounded-lg bg-exp/10 text-exp font-mono font-bold text-sm border border-exp/30 shrink-0">
              2
            </div>
            <h3 className="text-lg font-semibold text-ink flex items-center gap-2">
              <ShieldCheck className="size-5 text-mant" />
              Dualidad de Estabilidad en Iteración de Punto Fijo (Teorema de Banach)
            </h3>
          </div>
          <p className="text-ink-dim leading-relaxed text-sm sm:text-base pl-11">
            Se comprobó analítica y experimentalmente que dos despejes algebraicamente equivalentes poseen comportamientos dinámicos opuestos: el esquema <Formula tex="g_1(x) = 5(1 - e^{-x})" /> es fuertemente contractivo (<Formula tex="|g_1'(x^*)| \approx 0.0348 < 1" />), ganando casi 1.5 dígitos decimales por iteración sin requerir derivadas; mientras que el despeje logarítmico <Formula tex="g_2(x) = -\ln(1 - x/5)" /> viola la condición de Lipschitz local (<Formula tex="|g_2'(x^*)| \approx 28.7 > 1" />) y repele cualquier semilla hacia la solución trivial no física <Formula tex="x=0" />.
          </p>
        </div>

        <div className="p-6 rounded-xl border border-line bg-surface/50 hover:border-exp/40 transition-colors space-y-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center size-8 rounded-lg bg-exp/10 text-exp font-mono font-bold text-sm border border-exp/30 shrink-0">
              3
            </div>
            <h3 className="text-lg font-semibold text-ink flex items-center gap-2">
              <TrendingDown className="size-5 text-sign" />
              Sensibilidad Crítica de Newton-Raphson y Frontera de Cuenca en <Formula tex="\ln(5)" />
            </h3>
          </div>
          <p className="text-ink-dim leading-relaxed text-sm sm:text-base pl-11">
            Aunque Newton-Raphson exhibe convergencia cuadrática (<Formula tex="p \approx 2.00" />) alcanzando precisión de máquina de 64 bits en solo 4 iteraciones desde <Formula tex="x_0 = 4.5" />, sufre una falla catastrófica si la semilla se aproxima al punto estacionario <Formula tex="x_c = \ln(5) \approx 1.609438" />. Para <Formula tex="x_0 < \ln(5)" />, el método converge a la raíz espuria <Formula tex="x = 0" />, demostrando por qué los algoritmos híbridos profesionales combinan encierro por Bisección con refinamiento por Newton.
          </p>
        </div>

        <div className="p-6 rounded-xl border border-line bg-surface/50 hover:border-exp/40 transition-colors space-y-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center size-8 rounded-lg bg-exp/10 text-exp font-mono font-bold text-sm border border-exp/30 shrink-0">
              4
            </div>
            <h3 className="text-lg font-semibold text-ink flex items-center gap-2">
              <Cpu className="size-5 text-exp" />
              Finitud IEEE 754 y Escalado del ULP en el Intervalo <Formula tex="[4, 6]" />
            </h3>
          </div>
          <p className="text-ink-dim leading-relaxed text-sm sm:text-base pl-11">
            Dado que la raíz <Formula tex="x^* \approx 4.965" /> se ubica en la octava binaria <Formula tex="[2^2, 2^3)" />, el espaciado entre números de máquina representables consecutivos es <Formula tex="\text{ULP}(x^*) = 4 \cdot \epsilon_{\text{mach}}" />. En precisión simple (<code>float32</code>), esto limita la resolución del dominio a <Formula tex="\approx 4.768 \times 10^{-7}" />, provocando estancamiento exacto en la iteración 23 de Bisección; mientras que en <code>float64</code> alcanza la iteración 52 con exactitud de <Formula tex="8.88 \times 10^{-16}" />.
          </p>
        </div>
      </div>

      {/* Tabla de Aplicación Astrofísica Real */}
      <section className="p-6 rounded-2xl border border-line bg-surface/70 space-y-4">
        <h3 className="text-lg font-bold font-display text-ink flex items-center gap-2">
          <Flame className="size-5 text-exp" /> Aplicación Directa: Termometría de Cuerpos Celestes Reales
        </h3>
        <p className="text-xs sm:text-sm text-ink-dim">
          Utilizando la constante numérica convergida <Formula tex="b = 2.897771955 \times 10^6\text{ nm}\cdot\text{K}" />, contrastamos las temperaturas efectivas calculadas frente a las mediciones espectrales de referencia:
        </p>

        <div className="overflow-x-auto rounded-xl border border-line bg-surface/90">
          <table className="w-full text-xs font-mono text-left border-collapse">
            <thead>
              <tr className="border-b border-line bg-surface-2 text-ink">
                <th className="py-3 px-4">Objeto Astronómico</th>
                <th className="py-3 px-4">Clasificación</th>
                <th className="py-3 px-4">Pico Observado <Formula tex="\lambda_{\max}" /></th>
                <th className="py-3 px-4 text-exp">Temperatura Wien <Formula tex="T = b/\lambda_{\max}" /></th>
                <th className="py-3 px-4 text-mant">Temperatura Efectiva Real</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line/40 text-ink-dim">
              {STELLAR_CATALOG.map((item) => {
                const calcT = astro.estimateTempFromNm(item.lambdaPeakNm);
                return (
                  <tr key={item.id} className="hover:bg-surface">
                    <td className="py-2.5 px-4 font-bold text-ink">{item.name}</td>
                    <td className="py-2.5 px-4">{item.spectralType}</td>
                    <td className="py-2.5 px-4">{item.lambdaPeakNm.toLocaleString()} nm</td>
                    <td className="py-2.5 px-4 text-exp font-semibold">
                      {calcT < 10 ? calcT.toFixed(4) : Math.round(calcT).toLocaleString()} K
                    </td>
                    <td className="py-2.5 px-4 text-mant">
                      {item.realTempK.toLocaleString()} K
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* Síntesis Final */}
      <div className="p-6 rounded-2xl border border-exp/40 bg-surface/90 space-y-3">
        <div className="flex items-center gap-2 text-exp font-semibold text-sm">
          <CheckCircle2 className="size-5" /> Aprendizaje y Verificación Científica
        </div>
        <p className="text-xs sm:text-sm text-ink-dim leading-relaxed">
          La exploración de la Ley de Wien evidencia que ningún método numérico debe tratarse como una caja negra: comprender la geometría de <Formula tex="f(x)" />, identificar analíticamente puntos críticos como <Formula tex="\ln(5)" /> y dominar la representación binaria IEEE 754 son requisitos indispensables para transformar ecuaciones trascendentes de la física teórica en herramientas confiables de la astrofísica observacional.
        </p>
      </div>
    </article>
  );
}
