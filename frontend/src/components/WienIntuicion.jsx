// frontend/src/components/WienIntuicion.jsx
import { useState } from "react";
import Formula from "./Formula.jsx";
import { CONSTANTS, STELLAR_CATALOG, computeAstrophysics } from "../lib/wienSolver.js";
import { Flame, AlertTriangle, CheckCircle2, Sparkles, Sliders } from "lucide-react";

export default function WienIntuicion() {
  const [selectedStar, setSelectedStar] = useState(STELLAR_CATALOG[2]); // El Sol por defecto
  const [customTemp, setCustomTemp] = useState(5778);

  const astro = computeAstrophysics(CONSTANTS.X_STAR);
  const peakNm = astro.estimatePeakNmFromTemp(customTemp);

  // Generación de puntos SVG para la curva de Planck (200 nm a 2000 nm)
  const generatePlanckPath = (T) => {
    const points = [];
    const width = 600;
    const height = 220;
    const minNm = 100;
    const maxNm = 2000;

    // Encontrar valor máximo para normalizar la curva en el lienzo
    const lPeakMeters = astro.bMetersKelvin / T;
    const maxB =
      1 /
      (Math.pow(lPeakMeters, 5) *
        (Math.exp((CONSTANTS.h * CONSTANTS.c) / (lPeakMeters * CONSTANTS.kB * T)) - 1));

    for (let nm = minNm; nm <= maxNm; nm += 15) {
      const lMeters = nm * 1e-9;
      const exponent = (CONSTANTS.h * CONSTANTS.c) / (lMeters * CONSTANTS.kB * T);
      const val =
        exponent > 100
          ? 0
          : 1 / (Math.pow(lMeters, 5) * (Math.exp(exponent) - 1));
      const normalizedY = Math.min(1, val / maxB);

      const xSvg = ((nm - minNm) / (maxNm - minNm)) * (width - 60) + 40;
      const ySvg = height - 30 - normalizedY * (height - 55);
      points.push(`${xSvg.toFixed(1)},${ySvg.toFixed(1)}`);
    }
    return points.join(" ");
  };

  const peakXSvg = Math.min(
    580,
    Math.max(40, ((peakNm - 100) / (2000 - 100)) * 540 + 40)
  );

  return (
    <article className="space-y-10 animate-in fade-in duration-300">
      {/* Encabezado y Autor */}
      <div className="border-b border-line pb-6">
        <span className="text-xs font-mono text-exp uppercase tracking-wider block font-semibold mb-1">
          Trabajo de Investigación · Juan Huertas
        </span>
        <h2 className="text-2xl sm:text-3xl font-display font-bold text-ink">
          Termometría Estelar y Ley de Desplazamiento de Wien: Optimización Espectral mediante Ecuaciones Trascendentes
        </h2>
      </div>

      {/* Sección 1: Motivación y Pregunta Orientadora */}
      <section className="space-y-4">
        <h3 className="text-xl font-display font-semibold text-exp">
          1. Motivación Astrofísica y Pregunta Orientadora
        </h3>

        <p className="text-ink-dim leading-relaxed">
          La investigación aborda la pregunta central del proyecto desde la física térmica estelar:
        </p>

        <div className="p-4 sm:p-5 rounded-xl border border-line bg-surface/70 border-l-4 border-l-exp my-4 shadow-inner">
          <p className="text-base sm:text-lg italic text-ink font-serif leading-relaxed">
            &ldquo;¿De qué manera los métodos numéricos de aproximación de raíces permiten determinar la temperatura superficial de las estrellas cuando la derivada de la Ley de Radiación de Planck conduce a una ecuación trascendente sin solución algebraica cerrada?&rdquo;
          </p>
        </div>

        <p className="text-ink-dim leading-relaxed">
          Es físicamente imposible enviar una sonda con un termómetro de contacto a la fotosfera del Sol (<Formula tex="T \approx 5778\text{ K}" />) o a una supergigante azul como Rigel (<Formula tex="T \approx 12\,100\text{ K}" />). La única información que llega a los telescopios es su <strong className="text-ink">espectro electromagnético</strong>. Determinar la temperatura de una estrella a partir del color donde brilla con mayor intensidad exige encontrar el máximo global de la curva de radiación de cuerpo negro, un problema de cálculo diferencial que desemboca inevitablemente en una ecuación no lineal trascendente.
        </p>
      </section>

      {/* Sección 2: Marco Físico y Deducción Matemática */}
      <section className="space-y-6 border-t border-line pt-8">
        <h3 className="text-xl font-display font-semibold text-exp">
          2. De la Ley de Planck a la Ecuación Trascendente de Wien
        </h3>

        <div className="space-y-4 bg-surface/50 p-5 rounded-xl border border-line">
          <h4 className="text-lg font-semibold text-ink">
            2.1. Radiancia Espectral de Cuerpo Negro
          </h4>
          <p className="text-ink-dim leading-relaxed text-sm sm:text-base">
            En 1900, Max Planck resolvió la catástrofe ultravioleta postulando que la energía electromagnética se emite en cuantos discretos (<Formula tex="E = h\nu" />). La radiancia espectral <Formula tex="B_\lambda(\lambda, T)" /> de una estrella modelada como un cuerpo negro ideal en función de la longitud de onda <Formula tex="\lambda" /> y su temperatura absoluta <Formula tex="T" /> está dada por:
          </p>

          <div className="my-3 flex justify-center py-4 bg-bg/80 border border-line rounded-lg overflow-x-auto">
            <Formula
              tex={String.raw`B_\lambda(\lambda, T) = \frac{2hc^2}{\lambda^5 \left(e^{\frac{hc}{\lambda k_B T}} - 1\right)}`}
              block
            />
          </div>

          <p className="text-xs font-mono text-ink-faint text-center">
            donde <Formula tex="h = 6.626 \times 10^{-34}\text{ J}\cdot\text{s}" /> (Planck), <Formula tex="c = 2.9979 \times 10^8\text{ m/s}" /> (Luz) y <Formula tex="k_B = 1.3806 \times 10^{-23}\text{ J/K}" /> (Boltzmann).
          </p>
        </div>

        <div className="space-y-4 bg-surface/50 p-5 rounded-xl border border-line">
          <h4 className="text-lg font-semibold text-ink">
            2.2. Condición de Máximo Espectral y Cambio de Variable Adimensional
          </h4>
          <p className="text-ink-dim leading-relaxed text-sm sm:text-base">
            Para hallar la longitud de onda <Formula tex="\lambda_{\max}" /> donde la emisión estelar alcanza su cúspide, se deriva parcialmente respecto a <Formula tex="\lambda" /> y se iguala a cero:
          </p>

          <div className="my-3 flex justify-center py-3 bg-bg/80 border border-line rounded-lg overflow-x-auto">
            <Formula
              tex={String.raw`\frac{\partial B_\lambda}{\partial \lambda} = 2hc^2 \frac{d}{d\lambda}\left[\lambda^{-5}\left(e^{\frac{hc}{\lambda k_B T}} - 1\right)^{-1}\right] = 0`}
              block
            />
          </div>

          <p className="text-ink-dim leading-relaxed text-sm sm:text-base">
            Aplicando la regla del producto y definiendo el grupo adimensional de energía fotónica-térmica <Formula tex="x = \frac{hc}{\lambda k_B T}" />, se obtiene, tras simplificar factores estrictamente positivos:
          </p>

          <div className="my-3 flex justify-center py-4 bg-surface border border-exp/40 rounded-xl shadow-inner overflow-x-auto">
            <Formula
              tex={String.raw`-5\left(e^x - 1\right) + x e^x = 0 \iff x + 5e^{-x} - 5 = 0`}
              block
            />
          </div>

          <div className="p-4 rounded-xl border border-line bg-bg/60 space-y-2">
            <span className="font-mono text-xs text-sign uppercase font-bold block">
              El Obstáculo Algebraico (Función W de Lambert)
            </span>
            <p className="text-xs sm:text-sm text-ink-dim leading-relaxed">
              En la ecuación <Formula tex="f(x) = x + 5e^{-x} - 5 = 0" />, la incógnita <Formula tex="x" /> aparece simultáneamente como término lineal polinómico y como exponente trascendente. Es imposible despejar <Formula tex="x" /> mediante un número finito de operaciones algebraicas, raíces o logaritmos elementales. Su cálculo exacto exige aproximación numérica iterativa de raíces.
            </p>
          </div>
        </div>
      </section>

      {/* Sección 3: Simulador Espectral Interactivo */}
      <section className="space-y-4 border-t border-line pt-8">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <span className="text-xs font-mono text-mant uppercase font-semibold flex items-center gap-1.5">
              <Sparkles className="size-3.5" /> Laboratorio Físico Interactivo
            </span>
            <h3 className="text-xl font-display font-semibold text-ink">
              3. Simulador del Desplazamiento de Wien en Estrellas Reales
            </h3>
          </div>
          <span className="text-xs font-mono px-2.5 py-1 rounded-full border border-exp/30 bg-exp/10 text-exp">
            Raíz convergida: x* ≈ 4.96511423
          </span>
        </div>

        <div className="p-6 rounded-2xl border border-line bg-surface/70 space-y-6">
          {/* Botones de preselección estelar */}
          <div className="flex flex-wrap gap-2">
            {STELLAR_CATALOG.slice(0, 4).map((star) => (
              <button
                key={star.id}
                onClick={() => {
                  setSelectedStar(star);
                  setCustomTemp(star.realTempK);
                }}
                className={`px-3 py-2 rounded-xl border text-xs font-mono transition-all flex items-center gap-2 ${
                  selectedStar.id === star.id && customTemp === star.realTempK
                    ? "border-exp bg-exp/15 text-ink font-semibold shadow-sm"
                    : "border-line bg-bg/60 text-ink-dim hover:text-ink"
                }`}
              >
                <span
                  className="size-2.5 rounded-full"
                  style={{ backgroundColor: star.colorHex }}
                />
                {star.name} ({star.realTempK} K)
              </button>
            ))}
          </div>

          {/* Control deslizante de temperatura */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center bg-bg/70 p-4 rounded-xl border border-line">
            <div className="space-y-1">
              <label className="text-xs font-mono text-ink-dim flex items-center gap-1.5">
                <Sliders className="size-3.5 text-exp" /> Temperatura Superficial (T):
              </label>
              <input
                type="range"
                min="2500"
                max="15000"
                step="50"
                value={customTemp}
                onChange={(e) => setCustomTemp(Number(e.target.value))}
                className="w-full accent-amber-400 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-ink-faint">
                <span>2,500 K (Enana Roja)</span>
                <span>15,000 K (Azul B)</span>
              </div>
            </div>

            <div className="p-3 rounded-lg border border-line bg-surface text-center font-mono">
              <span className="text-[11px] text-ink-faint block">Temperatura Seleccionada</span>
              <span className="text-lg font-bold text-exp">{customTemp.toLocaleString()} K</span>
            </div>

            <div className="p-3 rounded-lg border border-line bg-surface text-center font-mono">
              <span className="text-[11px] text-ink-faint block">
                Pico de Emisión <Formula tex="\lambda_{\max} = b / T" />
              </span>
              <span className="text-lg font-bold text-mant">{peakNm.toFixed(1)} nm</span>
            </div>
          </div>

          {/* Gráfica SVG de la Curva de Planck */}
          <div className="p-4 rounded-xl bg-bg/90 border border-line overflow-x-auto">
            <svg viewBox="0 0 600 220" className="w-full h-auto min-w-[480px]">
              {/* Franja del espectro visible (380 nm a 750 nm) */}
              <defs>
                <linearGradient id="visibleSpectrum" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.28" />
                  <stop offset="25%" stopColor="#3b82f6" stopOpacity="0.28" />
                  <stop offset="50%" stopColor="#22c55e" stopOpacity="0.28" />
                  <stop offset="75%" stopColor="#eab308" stopOpacity="0.28" />
                  <stop offset="100%" stopColor="#ef4444" stopOpacity="0.28" />
                </linearGradient>
              </defs>

              {/* Banda visible mapeada entre 380nm y 750nm */}
              <rect
                x={((380 - 100) / 1900) * 540 + 40}
                y="25"
                width={((750 - 380) / 1900) * 540}
                height="165"
                fill="url(#visibleSpectrum)"
              />
              <text
                x={((565 - 100) / 1900) * 540 + 40}
                y="20"
                textAnchor="middle"
                className="fill-ink-dim text-[9px] font-mono"
              >
                Espectro Visible (380-750 nm)
              </text>

              {/* Ejes */}
              <line x1="40" y1="190" x2="580" y2="190" stroke="#334155" strokeWidth="1.5" />
              <line x1="40" y1="25" x2="40" y2="190" stroke="#334155" strokeWidth="1.5" />

              {/* Curva de Planck normalizada */}
              <polyline
                fill="none"
                stroke="#f59e0b"
                strokeWidth="2.5"
                points={generatePlanckPath(customTemp)}
              />

              {/* Línea vertical del Pico de Wien */}
              {peakNm >= 100 && peakNm <= 2000 && (
                <g>
                  <line
                    x1={peakXSvg}
                    y1="35"
                    x2={peakXSvg}
                    y2="190"
                    stroke="#22d3ee"
                    strokeWidth="1.5"
                    strokeDasharray="4 3"
                  />
                  <circle cx={peakXSvg} cy="35" r="4.5" fill="#22d3ee" />
                  <text
                    x={Math.min(535, Math.max(75, peakXSvg))}
                    y="52"
                    textAnchor="middle"
                    className="fill-cyan-300 text-[10px] font-mono font-bold"
                  >
                    λ_max = {peakNm.toFixed(0)} nm
                  </text>
                </g>
              )}

              {/* Etiquetas del eje X */}
              {[100, 400, 750, 1200, 1600, 2000].map((nm) => {
                const xPos = ((nm - 100) / 1900) * 540 + 40;
                return (
                  <text
                    key={nm}
                    x={xPos}
                    y="206"
                    textAnchor="middle"
                    className="fill-ink-faint text-[9px] font-mono"
                  >
                    {nm} nm
                  </text>
                );
              })}
            </svg>
          </div>
        </div>
      </section>

      {/* Sección 4: Plausibilidad Teórica de los Métodos Numéricos */}
      <section className="space-y-6 border-t border-line pt-8">
        <h3 className="text-xl font-display font-semibold text-exp">
          4. Análisis Matemático de los Métodos de Búsqueda de Raíces
        </h3>

        <p className="text-ink-dim leading-relaxed">
          Para resolver <Formula tex="f(x) = x + 5e^{-x} - 5 = 0" /> descartando la raíz trivial no física <Formula tex="x = 0" /> (que correspondería a <Formula tex="\lambda \to \infty" />), se analizan las garantías y dificultades de tres familias de métodos numéricos:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Tarjeta 1: Bisección */}
          <div className="p-5 rounded-xl border border-line bg-surface/50 space-y-3">
            <span className="font-mono text-xs text-mant uppercase font-bold flex items-center gap-1.5">
              <CheckCircle2 className="size-4" /> 1. Método de Bisección
            </span>
            <p className="text-xs text-ink-dim leading-relaxed">
              En el intervalo cerrado <Formula tex="[4, 6]" />, <Formula tex="f(x) \in C^\infty[4,6]" />. Evaluando en los extremos:
            </p>
            <div className="p-2 bg-bg/80 rounded font-mono text-xs text-center">
              <Formula tex="f(4) \approx -0.9084 < 0" />
              <br />
              <Formula tex="f(6) \approx +1.0124 > 0" />
            </div>
            <p className="text-xs text-ink-dim leading-relaxed">
              Por el <strong>Teorema de Bolzano</strong>, existe raíz en <Formula tex="(4,6)" />. Además, como <Formula tex="f'(x) = 1 - 5e^{-x} > 0" /> para todo <Formula tex="x > \ln(5) \approx 1.609" />, la función es estrictamente creciente y la raíz positiva es <strong>única</strong>.
            </p>
          </div>

          {/* Tarjeta 2: Punto Fijo */}
          <div className="p-5 rounded-xl border border-line bg-surface/50 space-y-3">
            <span className="font-mono text-xs text-exp uppercase font-bold flex items-center gap-1.5">
              <Flame className="size-4" /> 2. Punto Fijo (Banach)
            </span>
            <p className="text-xs text-ink-dim leading-relaxed">
              La ecuación admite dos despejes canónicos <Formula tex="x = g(x)" /> con comportamientos opuestos:
            </p>
            <ul className="list-disc pl-4 space-y-1.5 text-xs text-ink-dim">
              <li>
                <strong className="text-mant">Despeje 1 (Estable):</strong>{" "}
                <Formula tex="g_1(x) = 5(1 - e^{-x})" />. Su derivada en la raíz es <Formula tex="|g_1'(x^*)| = 5e^{-4.965} \approx 0.0348 \ll 1" />. Es una contracción ultrarrápida hacia <Formula tex="x^*" />.
              </li>
              <li>
                <strong className="text-sign">Despeje 2 (Inestable):</strong>{" "}
                <Formula tex="g_2(x) = -\ln(1 - x/5)" />. Presenta <Formula tex="|g_2'(x^*)| \approx 28.7 > 1" />, divergiendo de <Formula tex="x^*" /> hacia la raíz espuria <Formula tex="x=0" />.
              </li>
            </ul>
          </div>

          {/* Tarjeta 3: Newton-Raphson */}
          <div className="p-5 rounded-xl border border-line bg-surface/50 space-y-3">
            <span className="font-mono text-xs text-sign uppercase font-bold flex items-center gap-1.5">
              <AlertTriangle className="size-4" /> 3. Newton y su Trampa Crítica
            </span>
            <p className="text-xs text-ink-dim leading-relaxed">
              La iteración <Formula tex="x_{k+1} = x_k - \frac{x_k + 5e^{-x_k} - 5}{1 - 5e^{-x_k}}" /> tiene orden cuadrático (<Formula tex="p=2" />), pero su denominador se anula en el punto estacionario:
            </p>
            <div className="p-2 bg-bg/80 rounded font-mono text-xs text-center text-sign">
              <Formula tex="f'(x_c) = 0 \iff x_c = \ln(5) \approx 1.609438" />
            </div>
            <p className="text-xs text-ink-dim leading-relaxed">
              Si la semilla <Formula tex="x_0 < \ln(5)" />, la pendiente negativa lanza la iteración hacia la raíz trivial <Formula tex="x=0" />. Si <Formula tex="x_0 \approx \ln(5)" />, ocurre una división casi por cero que catapulta <Formula tex="x_1" /> a valores extremos.
            </p>
          </div>
        </div>
      </section>
    </article>
  );
}
