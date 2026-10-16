import Formula from "./Formula.jsx";
import { 
  CheckCircle2, ShieldCheck, Cpu, TrendingDown, Scale, Lightbulb, Satellite
} from "lucide-react";

export default function KeplerConclusiones() {
  return (
    <article className="space-y-10 animate-in fade-in duration-300">
      
      {/* Encabezado */}
      <div className="border-b border-line pb-6">
        <span className="text-xs font-mono text-exp uppercase tracking-wider block font-semibold mb-1">
          Conclusiones y Respuestas Orientadoras · Deyvi
        </span>
        <h2 className="text-2xl sm:text-3xl font-display font-bold text-ink">
          Conclusiones Técnicas: Ecuación de Kepler mediante el Método de Bisección
        </h2>
      </div>

      {/* ---------------- RESPUESTA A LA PREGUNTA ORIENTADORA ---------------- */}
      <section className="space-y-4">
        <div className="p-6 rounded-2xl border border-exp/40 bg-surface/90 shadow-xl space-y-4">
          <div className="flex items-center gap-2 text-exp font-bold text-base">
            <Lightbulb className="size-5" /> Respuesta Concreta a la Pregunta Orientadora del Curso
          </div>
          
          <blockquote className="border-l-4 border-l-exp pl-4 py-1 italic text-base sm:text-lg text-ink font-serif leading-relaxed">
            &ldquo;¿De qué manera los métodos numéricos de aproximación de raíces permiten resolver modelos astronómicos que carecen de solución matemática exacta?&rdquo;
          </blockquote>

          <p className="text-ink-dim leading-relaxed text-sm sm:text-base">
            En la mecánica orbital kepleriana, la ley física que describe la conservación del momento angular genera una <strong className="text-ink">ecuación trascendente</strong> (<Formula tex="M = E - e\sin E" />) que bloquea cualquier intento de despeje algebraico directo. 
            El <strong className="text-ink">Método de Bisección</strong> resuelve este callejón sin salida transformando el problema físico en un proceso algorítmico determinista:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs font-mono">
            <div className="p-3 bg-bg/70 rounded-xl border border-line">
              <span className="text-mant font-bold block mb-1">1. Confinamiento Físico</span>
              Atrapa la posición real en un intervalo cerrado <Formula tex="[M - e, M + e]" /> deducido de las propiedades naturales de la función seno.
            </div>
            <div className="p-3 bg-bg/70 rounded-xl border border-line">
              <span className="text-exp font-bold block mb-1">2. Teorema de Bolzano</span>
              Garantiza la existencia incondicional de la raíz y su unicidad matemática gracias a la monotonía estricta (<Formula tex="f' \ge 1 - e > 0" />).
            </div>
            <div className="p-3 bg-bg/70 rounded-xl border border-line">
              <span className="text-sign font-bold block mb-1">3. Cota Determinista</span>
              Permite predecir el número exacto de iteraciones y tiempo de CPU requerido antes de ejecutar el primer ciclo en la computadora.
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- LAS 4 CONCLUSIONES FUNDAMENTALES ---------------- */}
      <section className="space-y-6 border-t border-line pt-8">
        <h3 className="text-xl font-display font-semibold text-exp">
          Pilares Técnicos y Aprendizajes de la Experimentación Numérica
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Conclusión 1 */}
          <div className="p-5 rounded-xl border border-line bg-surface/50 space-y-3">
            <div className="flex items-center gap-2 text-mant font-semibold text-sm">
              <ShieldCheck className="size-5" /> 1. Robustez Incondicional frente a Excentricidades Extremas
            </div>
            <p className="text-xs text-ink-dim leading-relaxed">
              Mientras que los métodos basados en tangentes (como Newton) sufren sobredisparos o divergencias cuando <Formula tex="e \to 1" /> y el cuerpo cruza el perihelio (donde <Formula tex="f'(0) \approx 0" />), el método de Bisección se mantiene <strong className="text-ink">matemáticamente implacable</strong>. En nuestro experimento con el <strong>Cometa Halley</strong> (<Formula tex="e = 0.9671" />), Bisección redujo el intervalo de forma regular sin experimentar ninguna inestabilidad.
            </p>
          </div>

          {/* Conclusión 2 */}
          <div className="p-5 rounded-xl border border-line bg-surface/50 space-y-3">
            <div className="flex items-center gap-2 text-exp font-semibold text-sm">
              <Cpu className="size-5" /> 2. El Valor del Determinismo Temporal en Sistemas de Misión Crítica
            </div>
            <p className="text-xs text-ink-dim leading-relaxed">
              En la ingeniería aeroespacial moderna (NASA SPICE Toolkit, satélites GPS y sistemas de control de actitud de la ESA), la rapidez pura de un algoritmo es secundaria frente a su <strong className="text-ink">predictibilidad en tiempo real (Hard Real-Time)</strong>. Bisección proporciona un contrato matemático exacto: para una tolerancia dada <Formula tex="\varepsilon = 10^{-12}" />, sabemos que el procesador de vuelo finalizará en exactamente <Formula tex="N = \lceil \log_2(2e/\varepsilon) \rceil" /> ciclos, eliminando el riesgo de retrasos en maniobras orbitales críticas.
            </p>
          </div>

          {/* Conclusión 3 */}
          <div className="p-5 rounded-xl border border-line bg-surface/50 space-y-3">
            <div className="flex items-center gap-2 text-sign font-semibold text-sm">
              <TrendingDown className="size-5" /> 3. La Naturaleza Oscilatoria del Error Real vs la Cota Teórica
            </div>
            <p className="text-xs text-ink-dim leading-relaxed">
              La experimentación demostró de forma concluyente que el error verdadero <Formula tex="|E^* - c_k|" /> no decrece monótonamente: exhibe valles casuales y rebotes transitorios cuando el punto medio salta de un lado a otro de la raíz. Esto fundamenta una lección vital de análisis numérico: <strong className="text-ink">un criterio de parada nunca debe apoyarse en un residuo pequeño aislado</strong>, sino en la cota de intervalo garantizada por la teoría.
            </p>
          </div>

          {/* Conclusión 4 */}
          <div className="p-5 rounded-xl border border-line bg-surface/50 space-y-3">
            <div className="flex items-center gap-2 text-ink font-semibold text-sm">
              <Scale className="size-5 text-mant" /> 4. La Barrera Física del Estándar IEEE 754
            </div>
            <p className="text-xs text-ink-dim leading-relaxed">
              El análisis comparativo entre formatos de punto flotante evidenció el fenómeno de <strong className="text-ink">estancamiento de máquina</strong>. En <code className="text-sign font-mono">float32</code>, la precisión se detiene en la iteración 24 (<Formula tex="\sim 10^{-7}" />), haciendo inútil solicitar tolerancias menores. En contraste, <code className="text-mant font-mono">float64</code> permite alcanzar la iteración 53 (<Formula tex="\sim 10^{-16}" />), satisfaciendo los requerimientos de navegación interplanetaria de máxima precisión.
            </p>
          </div>

        </div>

        {/* Recuadro de Cierre Sintético */}
        <div className="p-6 rounded-2xl border border-mant/40 bg-surface/90 space-y-3 mt-8">
          <div className="flex items-center gap-2 text-mant font-semibold text-sm">
            <CheckCircle2 className="size-5" /> Síntesis del Trabajo de Investigación de Deyvi
          </div>
          <p className="text-xs sm:text-sm text-ink-dim leading-relaxed">
            La resolución numérica de la Ecuación de Kepler mediante el Método de Bisección demuestra cómo un algoritmo conceptualmente simple se convierte, al implementarse bajo las leyes de la física orbital y las restricciones de la aritmética de punto flotante, en una herramienta de ingeniería de precisión de máxima fiabilidad para la exploración del cosmos.
          </p>
        </div>
      </section>

    </article>
  );
}
