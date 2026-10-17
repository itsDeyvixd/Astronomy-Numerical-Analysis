import Formula from "./Formula.jsx";

export function LagrangeHeader({ stage, title, children }) {
  return <header className="rounded-2xl border border-sign/30 bg-surface/80 p-5 sm:p-7 space-y-3">
    <p className="font-mono text-xs text-sign uppercase tracking-wider">{stage} · Germán Rodríguez</p>
    <h2 className="text-2xl sm:text-3xl font-display font-bold text-ink">{title}</h2>
    <div className="text-sm leading-relaxed text-ink-dim">{children}</div>
  </header>;
}

export function LagrangeSection({ title, children }) {
  return <section className="space-y-4 border-t border-line pt-7">
    <h3 className="text-xl font-display font-semibold text-sign">{title}</h3>
    <div className="space-y-4 text-sm leading-relaxed text-ink-dim">{children}</div>
  </section>;
}

export function LagrangeMath({ tex }) {
  return <div className="min-w-0 max-w-full overflow-x-auto rounded-xl border border-line bg-bg/60 px-4 py-3 text-center text-ink [&_.katex-display]:m-0 [&_.katex-display]:w-max [&_.katex-display]:min-w-full">
    <Formula tex={tex} block />
  </div>;
}

export function LagrangeSources() {
  return <details className="rounded-xl border border-line bg-surface/40 p-4 text-sm text-ink-dim">
    <summary className="cursor-pointer font-semibold text-ink">Referencias bibliográficas</summary>
    <ul className="mt-4 list-disc pl-5 space-y-3 leading-relaxed">
      <li>Kincaid, D., y Cheney, W. <em>Numerical Analysis: Mathematics of Scientific Computing</em>. 3.ª edición, §§3.1–3.4, pp. 74–108.</li>
      <li><a className="text-sign underline" href="https://descanso.jpl.nasa.gov/monograph/series12/LunarTraj--08AppendixALocatingtheLagrangePoints.pdf" target="_blank" rel="noreferrer">JPL, apéndice A: Locating the Lagrange Points</a>, pp. 351–358. Modelo circular restringido y ecuaciones quínticas. Aquí se expresa la distancia normalizada con otra variable, <Formula tex="r" />.</li>
      <li><a className="text-sign underline" href="https://ssd.jpl.nasa.gov/astro_par.html" target="_blank" rel="noreferrer">JPL, Astrodynamic Parameters</a>: parámetros gravitacionales del Sol y la Tierra y unidad astronómica. Se fija <Formula tex="R=1\,\mathrm{au}" /> y se redondea <Formula tex="\mu" /> al decimal declarado en el experimento.</li>
      <li><a className="text-sign underline" href="https://science.nasa.gov/solar-system/resources/faq/what-are-lagrange-points/" target="_blank" rel="noreferrer">NASA, What are Lagrange Points?</a>: interpretación física de los cinco puntos y diferencia entre equilibrio y estabilidad.</li>
      <li><a className="text-sign underline" href="https://tc39.es/ecma262/#sec-math.fround" target="_blank" rel="noreferrer">Especificación ECMAScript, Math.fround</a>: conversión con redondeo al formato binary32. La representación de Number corresponde a binary64.</li>
    </ul>
  </details>;
}
