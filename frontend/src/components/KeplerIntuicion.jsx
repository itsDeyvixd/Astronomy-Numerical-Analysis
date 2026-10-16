import { useState, useMemo } from "react";
import Formula from "./Formula.jsx";
import { Orbit, Sparkles, AlertTriangle, ShieldCheck, Zap, RefreshCw } from "lucide-react";

const CELESTIAL_PRESETS = [
  { name: "Tierra", e: 0.0167, a: 1.0, desc: "Órbita casi circular. Convergencia cuasi-inmediata." },
  { name: "Marte", e: 0.0934, a: 1.524, desc: "El caso histórico analizado por Kepler con datos de Tycho Brahe." },
  { name: "Mercurio", e: 0.2056, a: 0.387, desc: "El planeta más excéntrico del Sistema Solar clásico." },
  { name: "Cometa Halley", e: 0.9671, a: 17.8, desc: "Órbita hiper-elongada. Prueba de fuego para métodos numéricos." },
];

export default function KeplerIntuicion() {
  const [selectedPlanet, setSelectedPlanet] = useState(1); // Marte por defecto
  const [customE, setCustomE] = useState(0.0934);
  const [meanAnomalyDeg, setMeanAnomalyDeg] = useState(60);

  // Parámetros calculados
  const e = customE;
  const M = (meanAnomalyDeg * Math.PI) / 180; // En radianes
  const a0 = Math.max(0, M - e);
  const b0 = Math.min(2 * Math.PI, M + e);

  // Función residual f(E) = E - e*sin(E) - M
  const f = (valE) => valE - e * Math.sin(valE) - M;
  const fPrime = (valE) => 1 - e * Math.cos(valE);

  // Resolución en tiempo real con Newton-Raphson
  const newtonResult = useMemo(() => {
    let curr = M; // Semilla E0 = M
    let iter = 0;
    const history = [];
    while (iter < 25) {
      const res = f(curr);
      const der = fPrime(curr);
      history.push({ iter, E: curr, res });
      if (Math.abs(res) < 1e-14 || Math.abs(der) < 1e-15) break;
      const next = curr - res / der;
      if (Math.abs(next - curr) < 1e-14) {
        curr = next;
        break;
      }
      curr = next;
      iter++;
    }
    return { E: curr, iter: history.length, history };
  }, [e, M]);

  // Cota teórica de pasos para Bisección con tolerancia eps = 1e-12
  const bisectionSteps = Math.ceil(Math.log2((2 * e) / 1e-12) - 1);

  // Anomalía verdadera nu: tan(nu/2) = sqrt((1+e)/(1-e)) * tan(E/2)
  const E_sol = newtonResult.E;
  const tanHalfNu = Math.sqrt((1 + e) / Math.max(1e-7, 1 - e)) * Math.tan(E_sol / 2);
  const nu = 2 * Math.atan(tanHalfNu);
  const nuDeg = ((nu * 180) / Math.PI + 360) % 360;

  // Coordenadas SVG de la elipse
  const svgWidth = 320;
  const svgHeight = 220;
  const cx = 160;
  const cy = 110;
  const scale = 110; // semieje mayor visual en px
  const semimajor = scale;
  const semiminor = scale * Math.sqrt(Math.max(0.01, 1 - e * e));
  const focusX = cx - scale * e; // Posición del Sol en el foco izquierdo

  // Posición del planeta en la elipse (x = a*(cos E - e), y = - a*sqrt(1-e^2)*sin E)
  const planetX = cx + semimajor * (Math.cos(E_sol) - e);
  const planetY = cy - semiminor * Math.sin(E_sol);

  // Posición del punto en el círculo auxiliar
  const auxX = cx + semimajor * (Math.cos(E_sol) - e);
  const auxY = cy - semimajor * Math.sin(E_sol);

  const applyPreset = (index) => {
    setSelectedPlanet(index);
    setCustomE(CELESTIAL_PRESETS[index].e);
  };

  return (
    <article className="space-y-10 animate-in fade-in duration-300">
      
      {/* Título y Autores */}
      <div className="border-b border-line pb-6">
        <span className="text-xs font-mono text-exp uppercase tracking-wider block font-semibold mb-1">
          Trabajo de Investigación · Deyvi Ardila
        </span>
        <h2 className="text-2xl sm:text-3xl font-display font-bold text-ink">
          Resolución Numérica de la Ecuación de Kepler: Órbitas Planetarias, Métodos de Aproximación y Límites Computacionales
        </h2>
      </div>

      {/* ---------------- 1. MOTIVACIÓN ---------------- */}
      <section className="space-y-4">
        <h3 className="text-xl font-display font-semibold text-exp flex items-center gap-2">
          <span>1. Motivación y Formulación de la Pregunta</span>
        </h3>
        
        <p className="text-ink-dim leading-relaxed">
          En el marco del curso de Análisis Numérico, abordamos la pregunta orientadora fundamental del proyecto:
        </p>

        <div className="p-4 sm:p-5 rounded-xl border border-line bg-surface/70 border-l-4 border-l-exp my-4 shadow-inner">
          <p className="text-base sm:text-lg italic text-ink font-serif leading-relaxed">
            &ldquo;¿De qué manera los métodos numéricos de aproximación de raíces permiten resolver modelos astronómicos que carecen de solución matemática exacta?&rdquo;
          </p>
        </div>

        <p className="text-ink-dim leading-relaxed">
          Para responder a esta pregunta en la mecánica celeste clásica, nos centramos en la predicción del movimiento de planetas, asteroides y satélites a través de la <strong className="text-ink">Ecuación de Kepler</strong>. 
          Cuando Johannes Kepler formuló sus leyes en 1609, surgió una notable asimetría:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-3">
          <div className="p-4 rounded-xl border border-line bg-surface/40">
            <span className="text-xs font-mono text-mant font-semibold block mb-1">El problema directo (Trivial)</span>
            <p className="text-sm text-ink-dim leading-relaxed">
              Dada la posición geométrica del planeta en su órbita (<Formula tex="E" />), calcular el tiempo transcurrido (<Formula tex="M" />) es inmediato mediante una simple resta trigonométrica: <Formula tex="M = E - e\sin(E)" />.
            </p>
          </div>
          <div className="p-4 rounded-xl border border-line bg-surface/40 border-l-4 border-l-sign">
            <span className="text-xs font-mono text-sign font-semibold block mb-1">El problema inverso (La realidad astronómica)</span>
            <p className="text-sm text-ink-dim leading-relaxed">
              En astronomía y navegación espacial observamos el tiempo <Formula tex="t" /> (la fecha en el calendario). Se requiere hallar la posición real <Formula tex="E" />. ¡Pero es <strong className="text-ink">algebraicamente imposible despejar <Formula tex="E" /></strong>!
            </p>
          </div>
        </div>

        <p className="text-ink-dim leading-relaxed">
          Al estar la incógnita <Formula tex="E" /> simultáneamente como término lineal y dentro del argumento de una función trascendente periódica (<Formula tex="\sin E" />), ninguna combinación de operaciones elementales permite su despeje analítico. Kepler declaró que la solución general sólo podía obtenerse por aproximaciones sucesivas. Nuestra meta es formalizar y comparar numéricamente los métodos de <strong className="text-ink">Bisección</strong>, <strong className="text-ink">Newton-Raphson</strong> y <strong className="text-ink">Punto Fijo</strong>.
        </p>
      </section>

      {/* ---------------- 2. MARCO FÍSICO Y GEOMETRÍA ---------------- */}
      <section className="space-y-4 border-t border-line pt-8">
        <h3 className="text-xl font-display font-semibold text-exp">
          2. Marco Físico y Geometría de la Órbita Elíptica
        </h3>

        <p className="text-ink-dim leading-relaxed">
          Para modelar la órbita de un planeta con excentricidad <Formula tex="0 \le e < 1" />, intervienen tres ángulos distintos denominados <em className="text-ink">anomalías</em>:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-4">
          <div className="p-4 rounded-xl border border-line bg-surface/50">
            <span className="font-mono text-xs text-exp uppercase font-bold block mb-1">1. Anomalía Media (M)</span>
            <p className="text-xs text-ink-dim leading-relaxed">
              Ángulo ficticio que avanzaría un planeta hipotético a velocidad angular constante <Formula tex="n = 2\pi/T" />. Crece de forma estrictamente lineal con el tiempo: <Formula tex="M = n(t - t_0)" />.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-line bg-surface/50 border-t-2 border-t-mant">
            <span className="font-mono text-xs text-mant uppercase font-bold block mb-1">2. Anomalía Excéntrica (E)</span>
            <p className="text-xs text-ink-dim leading-relaxed">
              Parámetro geométrico auxiliar medido desde el centro de la elipse sobre un círculo de referencia de radio <Formula tex="a" />. Es la incógnita a resolver en cada instante.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-line bg-surface/50">
            <span className="font-mono text-xs text-sign uppercase font-bold block mb-1">3. Anomalía Verdadera (ν)</span>
            <p className="text-xs text-ink-dim leading-relaxed">
              Ángulo polar real del planeta medido desde el foco (el Sol). Se deduce de <Formula tex="E" /> mediante <Formula tex={String.raw`\tan(\nu/2) = \sqrt{\frac{1+e}{1-e}}\tan(E/2)`} />.
            </p>
          </div>
        </div>

        {/* ---------------- SIMULADOR INTERACTIVO DE KEPLER ---------------- */}
        <div className="p-6 rounded-2xl border border-line bg-surface/80 shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-line pb-4">
            <div>
              <span className="text-xs font-mono text-exp uppercase font-semibold flex items-center gap-1.5">
                <Sparkles className="size-4" /> Laboratorio Interactivo de Órbitas
              </span>
              <h4 className="text-lg font-bold text-ink mt-0.5">
                Simulador de la Ecuación de Kepler en Tiempo Real
              </h4>
            </div>
            <span className="text-xs font-mono text-ink-faint">
              e = {e.toFixed(4)} · M = {meanAnomalyDeg}°
            </span>
          </div>

          {/* Selector de Planetas Preset */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {CELESTIAL_PRESETS.map((p, idx) => (
              <button
                key={p.name}
                onClick={() => applyPreset(idx)}
                className={`px-3 py-2 rounded-lg text-xs font-mono text-left transition-all border ${
                  selectedPlanet === idx
                    ? "border-exp bg-exp/10 text-ink shadow-sm"
                    : "border-line bg-surface/40 hover:bg-surface/70 text-ink-dim"
                }`}
              >
                <div className="font-semibold text-ink">{p.name}</div>
                <div className="text-[10px] text-ink-faint">e = {p.e}</div>
              </button>
            ))}
          </div>

          {/* Controles de Slider */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-bg/50 p-4 rounded-xl border border-line">
            <div>
              <div className="flex justify-between text-xs font-mono mb-1.5">
                <span className="text-ink-dim">Excentricidad orbital (e):</span>
                <span className="text-exp font-bold">{customE.toFixed(4)}</span>
              </div>
              <input
                type="range"
                min="0.0000"
                max="0.9800"
                step="0.001"
                value={customE}
                onChange={(e) => {
                  setCustomE(parseFloat(e.target.value));
                  setSelectedPlanet(-1);
                }}
                className="w-full accent-exp cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-ink-faint mt-1 font-mono">
                <span>0.00 (Circular)</span>
                <span>0.50</span>
                <span>0.98 (Cometaria)</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono mb-1.5">
                <span className="text-ink-dim">Anomalía Media M (Tiempo transcurrido):</span>
                <span className="text-mant font-bold">{meanAnomalyDeg}° ({M.toFixed(3)} rad)</span>
              </div>
              <input
                type="range"
                min="0"
                max="360"
                step="1"
                value={meanAnomalyDeg}
                onChange={(e) => setMeanAnomalyDeg(parseInt(e.target.value))}
                className="w-full accent-mant cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-ink-faint mt-1 font-mono">
                <span>0° (Perihelio)</span>
                <span>180° (Afelio)</span>
                <span>360° (Retorno)</span>
              </div>
            </div>
          </div>

          {/* Gráfico SVG de la órbita y Resultados del Método */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            
            {/* Visualizador Orbital SVG */}
            <div className="lg:col-span-6 flex flex-col items-center justify-center p-4 bg-bg rounded-xl border border-line">
              <svg width={svgWidth} height={svgHeight} className="overflow-visible">
                {/* Ejes principales */}
                <line x1={20} y1={cy} x2={svgWidth - 20} y2={cy} stroke="#412279" strokeWidth="1" strokeDasharray="3 3" />
                <line x1={cx} y1={20} x2={cx} y2={svgHeight - 20} stroke="#412279" strokeWidth="1" strokeDasharray="3 3" />

                {/* Círculo auxiliar de referencia */}
                <ellipse cx={cx} cy={cy} rx={semimajor} ry={semimajor} fill="none" stroke="#8B5CF6" strokeWidth="1" strokeOpacity="0.3" strokeDasharray="2 2" />

                {/* Elipse orbital */}
                <ellipse cx={cx} cy={cy} rx={semimajor} ry={semiminor} fill="none" stroke="#2dd4bf" strokeWidth="2" />

                {/* El Sol en el foco */}
                <circle cx={focusX} cy={cy} r="6" fill="#f2b84b" className="animate-pulse" />
                <text x={focusX} y={cy + 18} fill="#f2b84b" fontSize="10" textAnchor="middle" fontFamily="monospace">Sol (Foco)</text>

                {/* Radio vector desde el Sol al planeta */}
                <line x1={focusX} y1={cy} x2={planetX} y2={planetY} stroke="#f472b6" strokeWidth="1.5" />

                {/* Proyección vertical al círculo auxiliar */}
                <line x1={planetX} y1={planetY} x2={auxX} y2={auxY} stroke="#8B5CF6" strokeWidth="1" strokeDasharray="2 2" />

                {/* Planeta en la elipse */}
                <circle cx={planetX} cy={planetY} r="5" fill="#f472b6" />
                <text x={planetX + 8} y={planetY - 6} fill="#F5F3FF" fontSize="10" fontFamily="monospace">Planeta (ν={nuDeg.toFixed(1)}°)</text>

                {/* Punto auxiliar P' */}
                <circle cx={auxX} cy={auxY} r="3" fill="#8B5CF6" />
              </svg>

              <div className="flex gap-4 mt-3 text-[11px] font-mono text-ink-faint">
                <span className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-mant" /> Órbita Elíptica</span>
                <span className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-exp" /> Círculo Auxiliar (E)</span>
                <span className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-sign" /> Planeta Real (ν)</span>
              </div>
            </div>

            {/* Métricas y Convergencia en Tiempo Real */}
            <div className="lg:col-span-6 space-y-3">
              <div className="p-3.5 rounded-xl border border-line bg-surface/60">
                <span className="text-[11px] font-mono text-ink-faint block">Raíz E calculada (Newton-Raphson):</span>
                <div className="text-xl font-mono text-mant font-bold mt-0.5">
                  E = {E_sol.toFixed(8)} rad <span className="text-xs text-ink-dim font-normal">({((E_sol * 180) / Math.PI).toFixed(2)}°)</span>
                </div>
                <div className="text-xs font-mono text-ink-faint mt-1 flex justify-between">
                  <span>Convergencia: {newtonResult.iter} iteraciones</span>
                  <span>Residuo |f(E)| &lt; 10⁻¹⁴</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl border border-line bg-surface/60">
                <span className="text-[11px] font-mono text-ink-faint block">Intervalo de Bolzano garantizado [M - e, M + e]:</span>
                <div className="text-sm font-mono text-ink font-semibold mt-0.5">
                  [{a0.toFixed(4)}, {b0.toFixed(4)}] rad
                </div>
                <div className="text-xs font-mono text-ink-dim mt-1">
                  f(a) = {f(a0).toFixed(4)} &lt; 0  |  f(b) = {f(b0).toFixed(4)} &gt; 0
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="p-3 rounded-xl border border-line bg-surface/40">
                  <span className="text-ink-faint block text-[10px]">Pasos Bisección (teórico):</span>
                  <span className="text-sign font-bold text-base">{bisectionSteps} iteraciones</span>
                  <span className="text-[10px] text-ink-dim block mt-0.5">para tol = 10⁻¹²</span>
                </div>

                <div className="p-3 rounded-xl border border-line bg-surface/40">
                  <span className="text-ink-faint block text-[10px]">Contracción Punto Fijo:</span>
                  <span className="text-exp font-bold text-base">k = {e.toFixed(3)}</span>
                  <span className="text-[10px] text-ink-dim block mt-0.5">{e > 0.7 ? "Muy lenta" : "Convergencia rápida"}</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ---------------- 3. EL MODELO MATEMÁTICO ---------------- */}
      <section className="space-y-4 border-t border-line pt-8">
        <h3 className="text-xl font-display font-semibold text-exp">
          3. El Modelo Matemático: La Ecuación Trascendente
        </h3>

        <p className="text-ink-dim leading-relaxed">
          A partir de la Segunda Ley de Kepler (velocidad areolar constante <Formula tex="dA/dt = \text{cte}" />), el área barrida por el radio vector en un tiempo <Formula tex="t" /> se relaciona geométricamente con el sector elíptico. Integrando entre el círculo auxiliar y la elipse, se obtiene la célebre <strong className="text-ink">Ecuación de Kepler</strong>:
        </p>

        <div className="my-4 flex justify-center py-4 bg-surface border border-line rounded-xl shadow-inner">
          <Formula tex={String.raw`M = E - e \sin(E)`} block />
        </div>

        <p className="text-ink-dim leading-relaxed">
          Para formular el problema en el marco del Análisis Numérico, trasladamos todos los términos a un solo lado, definiendo la <strong className="text-ink">función residual no lineal</strong>:
        </p>

        <div className="my-4 flex justify-center py-4 bg-surface border border-line rounded-xl shadow-inner">
          <Formula tex={String.raw`f(E) = E - e \sin(E) - M = 0`} block />
        </div>

        <p className="text-ink-dim leading-relaxed">
          Encontrar la posición del planeta en el espacio equivale rigurosamente a <strong className="text-ink">encontrar la raíz o cero de <Formula tex="f(E)" /></strong> para una constante orbital <Formula tex="e" /> y un parámetro temporal <Formula tex="M" /> dados.
        </p>
      </section>

      {/* ---------------- 4. PLAUSIBILIDAD DE LOS MÉTODOS ---------------- */}
      <section className="space-y-4 border-t border-line pt-8">
        <h3 className="text-xl font-display font-semibold text-exp">
          4. Plausibilidad Matemática de los Tres Métodos de Aproximación
        </h3>

        <p className="text-ink-dim leading-relaxed">
          A diferencia de funciones discontinuas o definidas por integrales numéricas, <Formula tex="f(E)" /> es analítica e infinitamente diferenciable (<Formula tex="C^\infty" />). Esto permite aplicar tres metodologías del curso con sólidas garantías teóricas:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-4">
          
          {/* Tarjeta 1: Bisección */}
          <div className="p-5 rounded-xl border border-line bg-surface/50 border-t-4 border-t-sign flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-1.5 text-sign font-mono text-xs font-bold uppercase mb-2">
                <ShieldCheck className="size-4" /> Bisección (Garantía Global)
              </div>
              <p className="text-xs text-ink-dim leading-relaxed">
                Como <Formula tex="|\sin E| \le 1" />, la raíz está estrictamente acotada en el intervalo canónico <Formula tex="[M - e, M + e]" />.
              </p>
              <div className="my-2 p-2 bg-bg/80 rounded border border-line text-[11px] font-mono text-ink-dim">
                f(M - e) = -e(1 + sin(M-e)) &le; 0<br />
                f(M + e) = +e(1 - sin(M+e)) &ge; 0
              </div>
              <p className="text-xs text-ink-dim leading-relaxed">
                Por el <strong>Teorema de Bolzano</strong>, la raíz existe. Además, como <Formula tex="f'(E) = 1 - e\cos E \ge 1 - e > 0" />, la función es estrictamente monótona creciente: <strong className="text-ink">la raíz es única</strong>.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-line text-[11px] font-mono text-sign">
              Cota estricta: |E* - c_n| &le; e / 2ⁿ
            </div>
          </div>

          {/* Tarjeta 2: Newton-Raphson */}
          <div className="p-5 rounded-xl border border-line bg-surface/50 border-t-4 border-t-mant flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-1.5 text-mant font-mono text-xs font-bold uppercase mb-2">
                <Zap className="size-4" /> Newton-Raphson (Velocidad Cuadrática)
              </div>
              <p className="text-xs text-ink-dim leading-relaxed">
                Aprovecha la derivada continua:
              </p>
              <div className="my-2 p-2 bg-bg/80 rounded border border-line text-center text-xs">
                <Formula tex={String.raw`E_{n+1} = E_n - \frac{E_n - e\sin(E_n) - M}{1 - e\cos(E_n)}`} />
              </div>
              <p className="text-xs text-ink-dim leading-relaxed">
                Puesto que <Formula tex="f'(E) \ge 1 - e > 0" /> para todo <Formula tex="e < 1" />, <strong className="text-ink">el denominador jamás se anula</strong>. La convergencia es cuadrática: duplica el número de decimales exactos en cada ciclo.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-line text-[11px] font-mono text-mant">
              Típicamente 4 a 5 iteraciones en float64
            </div>
          </div>

          {/* Tarjeta 3: Punto Fijo */}
          <div className="p-5 rounded-xl border border-line bg-surface/50 border-t-4 border-t-exp flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-1.5 text-exp font-mono text-xs font-bold uppercase mb-2">
                <RefreshCw className="size-4" /> Punto Fijo (Contracción Banach)
              </div>
              <p className="text-xs text-ink-dim leading-relaxed">
                Despejando directamente <Formula tex="E = g(E) = M + e\sin(E)" />:
              </p>
              <div className="my-2 p-2 bg-bg/80 rounded border border-line text-[11px] font-mono text-ink-dim">
                |g'(E)| = |e cos(E)| &le; e &lt; 1
              </div>
              <p className="text-xs text-ink-dim leading-relaxed">
                Por el <strong>Teorema del Punto Fijo de Banach</strong>, <Formula tex="g(E)" /> es una contracción estricta en <Formula tex="\mathbb{R}" /> con constante de Lipschitz <Formula tex="k = e" />. Converge para cualquier semilla inicial, pero su velocidad decae drásticamente cuando <Formula tex="e \to 1" />.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-line text-[11px] font-mono text-exp">
              Error acotado por: eⁿ / (1 - e)
            </div>
          </div>

        </div>
      </section>

      {/* ---------------- 5. DESAFÍO COMPUTACIONAL ---------------- */}
      <section className="space-y-6 border-t border-line pt-8">
        <h3 className="text-xl font-display font-semibold text-exp">
          5. El Desafío Computacional: Aritmética de Punto Flotante y Estabilidad
        </h3>

        <p className="text-ink-dim leading-relaxed">
          En una computadora real (estándar IEEE 754 con <Formula tex="\epsilon_{\text{mach}} \approx 2.22 \times 10^{-16}" /> en <code className="font-mono text-xs">float64</code>), la Ecuación de Kepler impone retos numéricos cruciales:
        </p>

        <div className="space-y-4">
          <div className="p-5 rounded-xl border border-line bg-surface/50">
            <h4 className="text-base font-semibold text-ink flex items-center gap-2">
              <AlertTriangle className="size-4 text-sign" /> 5.1. Cancelación Catastrófica en Órbitas Cercanas al Perihelio
            </h4>
            <p className="text-sm text-ink-dim leading-relaxed mt-2">
              Cuando el planeta está cerca del perihelio (<Formula tex="E \ll 1" />), la expansión de Taylor indica que <Formula tex="\sin(E) \approx E - E^3/6" />. Al evaluar la diferencia:
            </p>
            <div className="my-2 flex justify-center py-2 bg-bg/80 border border-line rounded-lg">
              <Formula tex={String.raw`E - e\sin(E) \approx E(1 - e) + \frac{e E^3}{6}`} block />
            </div>
            <p className="text-sm text-ink-dim leading-relaxed">
              Si la excentricidad es muy alta (<Formula tex="e \approx 0.99" />), restar dos cantidades casi idénticas en punto flotante destruye los dígitos significativos de la mantisa. En nuestra experimentación evaluaremos formulaciones estables alternativas.
            </p>
          </div>

          <div className="p-5 rounded-xl border border-line bg-surface/50">
            <h4 className="text-base font-semibold text-ink">
              5.2. Reducción de Rango Periódico
            </h4>
            <p className="text-sm text-ink-dim leading-relaxed mt-2">
              En simulaciones orbitales continuas de largo plazo, el tiempo <Formula tex="t" /> crece acumulativamente, dando valores de <Formula tex="M = nt" /> de miles de radianes. La reducción precisa módulo <Formula tex="2\pi" /> es indispensable para no arrastrar errores de truncamiento trigonométrico antes de invocar los algoritmos de aproximación.
            </p>
          </div>

          <div className="p-5 rounded-xl border border-line bg-surface/50">
            <h4 className="text-base font-semibold text-ink">
              5.3. Criterio de Parada Dual Robusto
            </h4>
            <p className="text-sm text-ink-dim leading-relaxed mt-2">
              Para evitar bucles infinitos por estancamiento de máquina (<Formula tex="\text{fl}(E - \Delta) == E" />), el algoritmo verificará tanto la cota del paso relativo como la norma del residuo:
            </p>
            <div className="my-2 flex justify-center py-2 bg-bg/80 border border-line rounded-lg">
              <Formula tex={String.raw`|E_{n+1} - E_n| < \varepsilon_{\text{step}}(1 + |E_{n+1}|) \quad \text{o} \quad |f(E_{n+1})| < \varepsilon_{\text{res}}`} block />
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- 6. CONCLUSIÓN ---------------- */}
      <section className="space-y-4 border-t border-line pt-8">
        <h3 className="text-xl font-display font-semibold text-exp">
          6. Conclusión de la Intuición Inicial
        </h3>

        <div className="p-5 rounded-xl border border-exp/30 bg-surface/80 space-y-3">
          <p className="text-ink-dim leading-relaxed">
            La Ecuación de Kepler confirma contundentemente que los métodos numéricos no son una mera conveniencia, sino la única vía para operar los modelos dinámicos del sistema solar y las misiones aeroespaciales.
          </p>
          <p className="text-ink-dim leading-relaxed">
            Nuestro análisis teórico demuestra que <strong className="text-ink">Bisección</strong> ofrece la máxima robustez incondicional mediante el intervalo <Formula tex="[M-e, M+e]" />, mientras que <strong className="text-ink">Newton-Raphson</strong> aporta una velocidad inigualable gracias a que <Formula tex="f'(E) \ge 1-e > 0" />. Por su parte, <strong className="text-ink">Punto Fijo</strong> exhibe una contracción de Banach directa cuya velocidad depende linealmente de la excentricidad del cuerpo astronómico analizado.
          </p>
          <p className="text-ink-dim leading-relaxed">
            En la etapa siguiente de Resultados, contrastaremos estos tres métodos sobre cuerpos celestes reales (Tierra, Marte, Mercurio y Cometa Halley), midiendo órdenes de convergencia, número de evaluaciones de función y comportamiento frente a la precisión de punto flotante de 32 y 64 bits.
          </p>
        </div>
      </section>

    </article>
  );
}
