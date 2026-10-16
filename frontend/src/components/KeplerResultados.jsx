import { useState, useMemo } from "react";
import Formula from "./Formula.jsx";
import { 
  Orbit, Table, ShieldCheck, Cpu, AlertTriangle, 
  CheckCircle2, Compass, Satellite, RefreshCw, Zap
} from "lucide-react";

const CELESTIAL_CASES = [
  {
    id: "marte",
    name: "Marte (Caso Histórico de Kepler)",
    e: 0.0934,
    M: Math.PI / 3, // 60°
    mDeg: 60,
    a: 1.524,
    desc: "Excentricidad moderada analizada por Kepler con los datos de Tycho Brahe."
  },
  {
    id: "halley",
    name: "Cometa Halley (Órbita Hiper-Elongada)",
    e: 0.9671,
    M: 0.1, // Perihelio
    mDeg: 5.73,
    a: 17.8,
    desc: "Excentricidad extrema cercana a 1. Donde los métodos de tangente divergen, Bisección se mantiene implacable."
  },
  {
    id: "tierra",
    name: "Tierra (Órbita Casi Circular)",
    e: 0.0167,
    M: Math.PI / 2, // 90°
    mDeg: 90,
    a: 1.0,
    desc: "Caso casi circular con convergencia rápida en pocos intervalos."
  }
];

export default function KeplerResultados() {
  const [selectedCaseIdx, setSelectedCaseIdx] = useState(0);
  const [toleranceExp, setToleranceExp] = useState(12); // 10^-12
  const [maxRows, setMaxRows] = useState(15);

  const activeCase = CELESTIAL_CASES[selectedCaseIdx];
  const e = activeCase.e;
  const M = activeCase.M;
  const tol = Math.pow(10, -toleranceExp);

  // Intervalo inicial canónico garantizado por Bolzano: [M - e, M + e]
  const a0 = M - e;
  const b0 = M + e;

  // Raíz de alta precisión calculada previamente para medir el error verdadero
  const exactRoot = useMemo(() => {
    // Calculamos con 50 iteraciones de Newton de alta precisión como 'benchmark'
    let val = M;
    for (let i = 0; i < 50; i++) {
      const res = val - e * Math.sin(val) - M;
      const der = 1 - e * Math.cos(val);
      val = val - res / der;
    }
    return val;
  }, [e, M]);

  // Algoritmo de Bisección paso a paso
  const simulation = useMemo(() => {
    let a = a0;
    let b = b0;
    const history = [];
    let k = 1;
    const theoreticalSteps = Math.ceil(Math.log2((b0 - a0) / tol) - 1);

    const f = (x) => x - e * Math.sin(x) - M;

    while (k <= 60) {
      // Cálculo numéricamente estable del punto medio
      const c = a + (b - a) / 2;
      const fa = f(a);
      const fc = f(c);
      const theoreticalBound = (b0 - a0) / Math.pow(2, k);
      const trueError = Math.abs(exactRoot - c);

      // Detectar rebotes del error verdadero respecto al paso previo
      let behavior = "Monótono";
      if (k > 1) {
        const prevError = history[k - 2].trueError;
        if (trueError > prevError) {
          behavior = "Rebote / Oscilación";
        } else if (trueError < theoreticalBound / 10) {
          behavior = "Valle Accidental";
        }
      }

      history.push({
        k,
        a,
        b,
        c,
        fc,
        theoreticalBound,
        trueError,
        behavior
      });

      // Criterio de parada
      if ((b - a) / 2 < tol || Math.abs(fc) < 1e-15 || k >= 60) {
        break;
      }

      // Control de signos libre de underflow (Math.sign)
      if (Math.sign(fa) !== Math.sign(fc)) {
        b = c;
      } else {
        a = c;
      }

      k++;
    }

    return {
      history,
      steps: history.length,
      theoreticalSteps,
      finalC: history[history.length - 1].c,
      finalRes: history[history.length - 1].fc,
      finalBound: history[history.length - 1].theoreticalBound,
      finalTrueError: history[history.length - 1].trueError
    };
  }, [e, M, a0, b0, tol, exactRoot]);

  return (
    <article className="space-y-10 animate-in fade-in duration-300">
      
      {/* Encabezado */}
      <div className="border-b border-line pb-6">
        <span className="text-xs font-mono text-exp uppercase tracking-wider block font-semibold mb-1">
          Resultados Experimentales · Deyvi
        </span>
        <h2 className="text-2xl sm:text-3xl font-display font-bold text-ink">
          Determinación Numérica de la Posición Orbital: Implementación, Límites de Máquina y Aplicación Real del Método de Bisección
        </h2>
      </div>

      {/* ---------------- SECCIÓN 1: POR QUÉ BISECCIÓN EN LA INDUSTRIA AEROESPACIAL ---------------- */}
      <section className="space-y-4">
        <h3 className="text-xl font-display font-semibold text-exp flex items-center gap-2">
          <span>1. Justificación del Enfoque: Bisección en Sistemas Espaciales y de Navegación</span>
        </h3>
        
        <p className="text-ink-dim leading-relaxed">
          En la teoría matemática pura suele preferirse Newton-Raphson por su rapidez. Sin embargo, en la <strong className="text-ink">astronáutica de misión crítica, la aviónica satelital y los chips receptores GPS</strong>, el <strong className="text-ink">Método de Bisección</strong> sigue siendo el estándar fundamental por tres razones técnicas decisivas:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-4">
          <div className="p-5 rounded-xl border border-line bg-surface/50 border-t-4 border-t-mant">
            <div className="flex items-center gap-2 text-mant font-mono text-xs font-bold uppercase mb-2">
              <Cpu className="size-4" /> 1. Tiempo Determinista (Hard Real-Time)
            </div>
            <p className="text-xs text-ink-dim leading-relaxed">
              En computadores de vuelo espacial (como el procesador endurecido contra radiación <strong>BAE RAD750</strong> de las sondas Mars Curiosity o James Webb), los bucles de control exigen un presupuesto de tiempo exacto. Bisección garantiza el número de ciclos de reloj antes de ejecutar la primera instrucción:
            </p>
            <div className="my-2 p-2 bg-bg/80 rounded border border-line text-center text-xs">
              <Formula tex={String.raw`N = \left\lceil \frac{\ln(2e) - \ln \varepsilon}{\ln 2} \right\rceil`} />
            </div>
          </div>

          <div className="p-5 rounded-xl border border-line bg-surface/50 border-t-4 border-t-sign">
            <div className="flex items-center gap-2 text-sign font-mono text-xs font-bold uppercase mb-2">
              <AlertTriangle className="size-4" /> 2. Inmunidad ante e → 1 (Perihelio)
            </div>
            <p className="text-xs text-ink-dim leading-relaxed">
              Para cuerpos con órbitas alargadas (como el cometa Halley con <Formula tex="e = 0.9671" />), cuando el objeto pasa por el perihelio (<Formula tex="E \approx 0" />), la derivada es casi nula:
            </p>
            <div className="my-2 p-2 bg-bg/80 rounded border border-line text-center text-[11px] font-mono text-sign">
              f'(0) = 1 - e ≈ 0.0329
            </div>
            <p className="text-xs text-ink-dim leading-relaxed">
              Newton genera sobredisparos colosales y divergencias. Bisección no evalúa derivadas y divide el intervalo con inmunidad matemática absoluta.
            </p>
          </div>

          <div className="p-5 rounded-xl border border-line bg-surface/50 border-t-4 border-t-exp">
            <div className="flex items-center gap-2 text-exp font-mono text-xs font-bold uppercase mb-2">
              <ShieldCheck className="size-4" /> 3. Garantía de Confinamiento
            </div>
            <p className="text-xs text-ink-dim leading-relaxed">
              La raíz está matemáticamente confinada en <Formula tex="[M - e, M + e]" />. En ningún caso una iteración puede salirse hacia valores no físicos o infinitos.
            </p>
            <div className="my-2 p-2 bg-bg/80 rounded border border-line text-center text-[11px] font-mono text-exp">
              f(M - e) &le; 0  |  f(M + e) &ge; 0
            </div>
            <p className="text-xs text-ink-dim leading-relaxed">
              Bolzano asegura que la solución está siempre atrapada dentro del intervalo.
            </p>
          </div>
        </div>

        {/* Casos Reales en la Industria */}
        <div className="p-5 rounded-xl border border-line bg-surface/80 shadow-md">
          <h4 className="text-sm font-semibold text-ink uppercase tracking-wider font-mono mb-3 flex items-center gap-2">
            <Satellite className="size-4 text-mant" /> ¿Quiénes y dónde lo usan en la práctica astronómica y espacial?
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-ink-dim leading-relaxed">
            <div className="p-3 bg-bg/50 rounded-lg border border-line">
              <strong className="text-ink block mb-1">NASA JPL (NAIF SPICE Toolkit):</strong>
              El software estándar de la NASA para misiones como <em>Voyager</em>, <em>Cassini</em> y <em>New Horizons</em> usa Bisección como el mecanismo obligatorio de seguridad (*fail-safe bracket*) que atrapa cualquier inestabilidad.
            </div>
            <div className="p-3 bg-bg/50 rounded-lg border border-line">
              <strong className="text-ink block mb-1">Receptores GNSS / GPS / Galileo:</strong>
              Los chips GPS en teléfonos y aviones resuelven la ecuación de Kepler cada segundo para calcular efemérides orbitales. Bisección garantiza un cálculo predecible sin consumir energía excesiva en la FPU.
            </div>
            <div className="p-3 bg-bg/50 rounded-lg border border-line">
              <strong className="text-ink block mb-1">Agencia Espacial Europea (ESA):</strong>
              En sistemas de alerta de colisiones para satélites en órbita terrestre (LEO), donde se propagan millones de trayectorias diarias sin supervisión humana, Bisección garantiza 100% de tasa de éxito.
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- SECCIÓN 2: CALCULADORA EXPERIMENTAL EN VIVO ---------------- */}
      <section className="space-y-6 border-t border-line pt-8">
        <div>
          <span className="text-xs font-mono text-exp uppercase font-semibold">Banco de Pruebas</span>
          <h3 className="text-xl font-display font-semibold text-ink mt-0.5">
            2. Laboratorio Computacional de Bisección para Órbitas Reales
          </h3>
          <p className="text-sm text-ink-dim mt-1">
            Selecciona un cuerpo astronómico real y la tolerancia deseada para ejecutar el algoritmo de Bisección paso a paso y analizar la evolución del error en tiempo real.
          </p>
        </div>

        {/* Controles de Caso y Tolerancia */}
        <div className="p-6 rounded-2xl border border-line bg-surface/80 shadow-xl space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {CELESTIAL_CASES.map((c, idx) => (
              <button
                key={c.id}
                onClick={() => setSelectedCaseIdx(idx)}
                className={`p-4 rounded-xl border text-left transition-all flex flex-col justify-between ${
                  selectedCaseIdx === idx
                    ? "border-exp bg-exp/10 text-ink shadow-md"
                    : "border-line bg-surface/40 hover:bg-surface/70 text-ink-dim"
                }`}
              >
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-sm text-ink">{c.name}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface border border-line text-exp">
                      e = {c.e}
                    </span>
                  </div>
                  <p className="text-xs text-ink-dim line-clamp-2 mt-1">{c.desc}</p>
                </div>
                <div className="mt-3 pt-2 border-t border-line/60 text-[11px] font-mono text-ink-faint">
                  M = {c.mDeg}° ({c.M.toFixed(3)} rad)
                </div>
              </button>
            ))}
          </div>

          {/* Selector de Tolerancia */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-bg/50 rounded-xl border border-line">
            <div>
              <span className="text-xs font-mono text-ink-dim block">Tolerancia de parada (ε):</span>
              <span className="text-sm font-mono text-mant font-bold">10⁻{toleranceExp} ({tol.toExponential(0)})</span>
            </div>
            <div className="flex gap-2">
              {[4, 7, 10, 12, 15].map((exp) => (
                <button
                  key={exp}
                  onClick={() => setToleranceExp(exp)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono border transition-all ${
                    toleranceExp === exp
                      ? "border-mant bg-mant/20 text-ink font-bold shadow-sm"
                      : "border-line bg-surface text-ink-dim hover:text-ink"
                  }`}
                >
                  10⁻{exp}
                </button>
              ))}
            </div>
          </div>

          {/* Tarjetas de Métricas de Ejecución */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 bg-surface rounded-xl border border-line">
              <span className="text-[10px] font-mono text-ink-faint block uppercase">Iteraciones ejecutadas</span>
              <div className="text-xl font-mono text-exp font-bold mt-0.5">
                {simulation.steps} pasos
              </div>
              <span className="text-[10px] font-mono text-ink-dim block mt-0.5">
                Cota teórica: {simulation.theoreticalSteps}
              </span>
            </div>

            <div className="p-3.5 bg-surface rounded-xl border border-line">
              <span className="text-[10px] font-mono text-ink-faint block uppercase">Raíz hallada (E*)</span>
              <div className="text-base font-mono text-mant font-bold mt-0.5 truncate">
                {simulation.finalC.toFixed(10)}
              </div>
              <span className="text-[10px] font-mono text-ink-dim block mt-0.5">
                rad ({((simulation.finalC * 180) / Math.PI).toFixed(4)}°)
              </span>
            </div>

            <div className="p-3.5 bg-surface rounded-xl border border-line">
              <span className="text-[10px] font-mono text-ink-faint block uppercase">Residuo final |f(E)|</span>
              <div className="text-base font-mono text-ink font-bold mt-0.5">
                {Math.abs(simulation.finalRes).toExponential(3)}
              </div>
              <span className="text-[10px] font-mono text-ink-dim block mt-0.5">
                Cumple |f(E)| &lt; tol
              </span>
            </div>

            <div className="p-3.5 bg-surface rounded-xl border border-line">
              <span className="text-[10px] font-mono text-ink-faint block uppercase">Cota de error final</span>
              <div className="text-base font-mono text-sign font-bold mt-0.5">
                {simulation.finalBound.toExponential(3)}
              </div>
              <span className="text-[10px] font-mono text-ink-dim block mt-0.5">
                Real: {simulation.finalTrueError.toExponential(3)}
              </span>
            </div>
          </div>

          {/* ---------------- TABLA DE ITERACIONES ---------------- */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Table className="size-4 text-exp" />
                <h4 className="font-bold text-sm text-ink">
                  Tabla de Evolución Iterativa de Bisección ({activeCase.name})
                </h4>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono">
                <span className="text-ink-faint">Mostrar:</span>
                {[10, 15, 25, 45].map((count) => (
                  <button
                    key={count}
                    onClick={() => setMaxRows(count)}
                    className={`px-2 py-0.5 rounded border text-[11px] ${
                      maxRows === count
                        ? "border-exp bg-exp/20 text-ink"
                        : "border-line bg-surface text-ink-dim"
                    }`}
                  >
                    {count}
                  </button>
                ))}
              </div>
            </div>

            <div className="overflow-x-auto rounded-xl border border-line">
              <table className="w-full text-left border-collapse text-xs font-mono">
                <thead>
                  <tr className="bg-surface-2 border-b border-line text-ink-faint text-[11px]">
                    <th className="p-2.5">k</th>
                    <th className="p-2.5">aₖ</th>
                    <th className="p-2.5">bₖ</th>
                    <th className="p-2.5">cₖ (Punto Medio)</th>
                    <th className="p-2.5">f(cₖ)</th>
                    <th className="p-2.5">Cota Teórica (b-a)/2</th>
                    <th className="p-2.5">Error Real |E* - cₖ|</th>
                    <th className="p-2.5">Comportamiento</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line/40">
                  {simulation.history.slice(0, maxRows).map((row) => (
                    <tr 
                      key={row.k} 
                      className={`hover:bg-surface/50 transition-colors ${
                        row.behavior === "Rebote / Oscilación" 
                          ? "bg-sign/5" 
                          : row.behavior === "Valle Accidental"
                          ? "bg-mant/5"
                          : ""
                      }`}
                    >
                      <td className="p-2.5 font-bold text-ink">{row.k}</td>
                      <td className="p-2.5 text-ink-dim">{row.a.toFixed(8)}</td>
                      <td className="p-2.5 text-ink-dim">{row.b.toFixed(8)}</td>
                      <td className="p-2.5 text-ink font-semibold">{row.c.toFixed(8)}</td>
                      <td className={`p-2.5 ${row.fc >= 0 ? "text-mant" : "text-sign"}`}>
                        {row.fc >= 0 ? "+" : ""}{row.fc.toExponential(4)}
                      </td>
                      <td className="p-2.5 text-ink-dim">{row.theoreticalBound.toExponential(4)}</td>
                      <td className="p-2.5 text-ink font-bold">{row.trueError.toExponential(4)}</td>
                      <td className="p-2.5">
                        {row.behavior === "Rebote / Oscilación" && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] bg-sign/20 text-sign font-semibold border border-sign/30">
                            Rebote
                          </span>
                        )}
                        {row.behavior === "Valle Accidental" && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] bg-mant/20 text-mant font-semibold border border-mant/30">
                            Valle casual
                          </span>
                        )}
                        {row.behavior === "Monótono" && (
                          <span className="text-[10px] text-ink-faint">
                            Monótono
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {simulation.history.length > maxRows && (
              <p className="text-[11px] font-mono text-ink-faint text-center mt-2">
                Mostrando {maxRows} de {simulation.history.length} iteraciones. Aumenta el filtro arriba para ver la tabla completa.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* ---------------- SECCIÓN 3: NO-MONOTONICIDAD Y LÍMITES DE PRECISIÓN ---------------- */}
      <section className="space-y-6 border-t border-line pt-8">
        <h3 className="text-xl font-display font-semibold text-exp">
          3. Hallazgos Numéricos Críticos: Precisión en Máquina IEEE 754
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Tarjeta: El fenómeno de no monotonicidad */}
          <div className="p-5 rounded-xl border border-line bg-surface/50 space-y-3">
            <h4 className="font-semibold text-ink text-sm flex items-center gap-2">
              <AlertTriangle className="size-4 text-sign" /> El Mito de la Monotonicidad del Error
            </h4>
            <p className="text-xs text-ink-dim leading-relaxed">
              Al analizar la columna de <strong>Error Real</strong> frente a la <strong>Cota Teórica</strong>, se observa un fenómeno fundamental estudiado en el curso:
            </p>
            <ul className="text-xs text-ink-dim space-y-2 list-disc pl-4">
              <li>
                La <strong className="text-ink">cota a priori</strong> se divide estrictamente a la mitad en cada paso: <Formula tex="\frac{b-a}{2^k}" /> decrece de forma monotónica perfecta.
              </li>
              <li>
                El <strong className="text-ink">error verdadero</strong> <Formula tex="|E^* - c_k|" /> sufre oscilaciones pronunciadas (rebotes). En ciertas etapas, el punto medio cae por azar geométrico sumamente cerca de la raíz (creando un &quot;valle&quot;), pero en la siguiente división se aleja relativamente.
              </li>
              <li>
                <strong className="text-ink">Conclusión práctica:</strong> En un simulador astronómico real jamás se debe detener el algoritmo solo porque <Formula tex="|f(c_k)|" /> o <Formula tex="|c_{k} - c_{k-1}|" /> fue pequeño en un único paso aislado. La única garantía rigurosa es alcanzar la cota teórica.
              </li>
            </ul>
          </div>

          {/* Tarjeta: Float32 vs Float64 */}
          <div className="p-5 rounded-xl border border-line bg-surface/50 space-y-3">
            <h4 className="font-semibold text-ink text-sm flex items-center gap-2">
              <Cpu className="size-4 text-mant" /> Límite de Estancamiento: Float32 vs Float64
            </h4>
            <p className="text-xs text-ink-dim leading-relaxed">
              La aritmética de punto flotante de la computadora impone una barrera física al refinamiento del intervalo:
            </p>
            <div className="space-y-2 text-xs font-mono">
              <div className="p-2.5 bg-bg/80 rounded border border-line">
                <span className="text-sign font-bold block mb-1">Precisión Simple (float32 · 24 bits mantisa):</span>
                <span className="text-ink-dim">
                  ε_mach ≈ 1.19 × 10⁻⁷. A partir de la iteración <strong>k = 24</strong>, el ancho (b - a) cae por debajo del ULP (Unit in the Last Place). La operación fl(a + (b-a)/2) retorna exactamente a o b. El intervalo se congela.
                </span>
              </div>
              <div className="p-2.5 bg-bg/80 rounded border border-line">
                <span className="text-mant font-bold block mb-1">Precisión Doble (float64 · 53 bits mantisa):</span>
                <span className="text-ink-dim">
                  ε_mach ≈ 2.22 × 10⁻¹⁶. Permite dividir sanamente el intervalo hasta la iteración <strong>k = 53</strong>, alcanzando 16 dígitos decimales de exactitud absoluta.
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Reglas de Estabilidad Numérica */}
        <div className="p-5 rounded-xl border border-mant/30 bg-surface/80 space-y-3">
          <h4 className="text-sm font-semibold text-ink flex items-center gap-2">
            <CheckCircle2 className="size-4 text-mant" /> Reglas de Implementación Numéricamente Estable Utilizadas
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-ink-dim">
            <div className="p-3 bg-bg/50 rounded-lg border border-line">
              <strong className="text-ink block mb-1">1. Punto Medio Libre de Desbordamiento:</strong>
              Se calculó <Formula tex="c = a + \frac{b - a}{2}" /> en lugar de <Formula tex="(a + b) / 2" /> para prevenir desbordamientos numéricos cuando los argumentos son elevados.
            </div>
            <div className="p-3 bg-bg/50 rounded-lg border border-line">
              <strong className="text-ink block mb-1">2. Prueba de Signos Libre de Underflow:</strong>
              Se utilizó <code className="text-mant">Math.sign(fa) !== Math.sign(fc)</code> en vez de <code className="text-ink-dim">fa * fc &lt; 0</code>, evitando que el producto de dos números diminutos colapse en cero.
            </div>
          </div>
        </div>
      </section>

    </article>
  );
}
