import data from "../lib/lagrangeData.json";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, Compass, Cpu, Lightbulb, Orbit, Scale, ShieldCheck, Target, Zap } from "lucide-react";
import Formula from "./Formula.jsx";
import { LagrangeMath, LagrangeSources } from "./LagrangeShared.jsx";

const tones = {
  sign: "border-sign/30 bg-sign/10 text-sign",
  exp: "border-exp/30 bg-exp/10 text-exp",
  mant: "border-mant/30 bg-mant/10 text-mant",
};

function FindingCard({ number, icon: Icon, title, tone = "sign", children }) {
  return <section className="min-w-0 rounded-xl border border-line bg-surface/50 p-5 sm:p-6 space-y-4 transition-colors hover:border-sign/40">
    <div className="flex items-start gap-3">
      <span className={`flex size-9 shrink-0 items-center justify-center rounded-lg border font-mono text-xs font-bold ${tones[tone]}`}>{number}</span>
      <div className="min-w-0 pt-0.5">
        <h4 className="text-base sm:text-lg font-semibold text-ink leading-snug"><Icon aria-hidden="true" className="mr-2 inline-block size-4 text-sign" />{title}</h4>
      </div>
    </div>
    <div className="space-y-3 text-sm leading-relaxed text-ink-dim">{children}</div>
  </section>;
}

export default function LagrangeConclusiones() {
  const normal = data.experiments.filter((r) => r.point === "L1" && r.precision === "float64" && r.tol === 1e-10);
  const bis = normal.find((r) => r.method === "bisection");
  const newton = normal.find((r) => r.method === "newton");
  const low = data.experiments.find((r) => r.point === "L1" && r.precision === "float32" && r.method === "bisection" && r.tol === 1e-20);
  const seedSteps = data.sensitivity.map((run) => run.steps.at(-1).k);
  const km = (point) => (Number(data.references[point]) * data.model.distanceKm).toLocaleString("es-CO", { maximumFractionDigits: 0 });
  const locations = [
    { id: "L1", label: "L₁", location: "Entre el Sol y la Tierra", origin: "la Tierra" },
    { id: "L2", label: "L₂", location: "Más allá de la Tierra", origin: "la Tierra" },
    { id: "L3", label: "L₃", location: "Al otro lado del Sol respecto de la Tierra", origin: "el Sol" },
  ];

  return <article className="space-y-8 sm:space-y-10">
    <header className="relative overflow-hidden rounded-2xl border border-sign/30 bg-surface/80 p-5 sm:p-7">
      <div aria-hidden="true" className="pointer-events-none absolute -right-20 -top-24 size-72 rounded-full bg-sign/10 blur-3xl" />
      <div className="relative space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-sign"><Compass aria-hidden="true" className="size-4" /> Conclusiones · sistema Sol–Tierra</p>
          <p className="rounded-lg border border-line bg-bg/50 px-3 py-1.5 text-xs text-ink-dim">Autor: <span className="font-semibold text-sign">Germán Rodríguez</span></p>
        </div>
        <h2 className="max-w-3xl text-2xl sm:text-3xl font-display font-bold leading-tight text-ink">Localización del equilibrio y límites de precisión</h2>
        <p className="max-w-3xl text-sm leading-relaxed text-ink-dim">El quíntico de Euler permite determinar una posición de equilibrio. La comparación entre bisección y Newton, junto con el análisis de punto flotante, permite evaluar la precisión del resultado.</p>
        <div className="flex flex-wrap gap-2 text-[11px] font-mono text-ink-dim">
          {["3 puntos colineales", `${data.experiments.length} ejecuciones`, `${data.sensitivity.length} semillas`, `Referencia de ${data.referenceDigits} dígitos`].map((label) => <span key={label} className="rounded-full border border-line bg-bg/50 px-3 py-1.5">{label}</span>)}
        </div>
      </div>
    </header>

    <section aria-label="Resultados destacados" className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      <div className="min-w-0 rounded-xl border border-mant/30 bg-mant/5 p-5 space-y-2">
        <p className="text-xs font-mono text-mant">L₁ desde la Tierra</p>
        <p className="font-display text-3xl font-bold text-ink">{km("L1")} <span className="text-sm font-normal">km</span></p>
        <p className="text-xs leading-relaxed text-ink-dim">Hacia el Sol, en el modelo circular adoptado.</p>
      </div>
      <div className="min-w-0 rounded-xl border border-exp/30 bg-exp/5 p-5 space-y-2">
        <p className="text-xs font-mono text-exp">Bisección / Newton</p>
        <p className="font-display text-3xl font-bold text-ink">{bis.steps.at(-1).k} <span className="text-ink-faint">/</span> {newton.steps.at(-1).k} <span className="text-sm font-normal">pasos</span></p>
        <p className="text-xs leading-relaxed text-ink-dim">L₁ en binary64, <Formula tex="\tau=10^{-10}" className="whitespace-nowrap" /> y semilla de Newton <Formula tex="r_0=0.01" className="whitespace-nowrap" />.</p>
      </div>
      <div className="min-w-0 rounded-xl border border-sign/30 bg-sign/5 p-5 space-y-2">
        <p className="text-xs font-mono text-sign">Error al estancarse</p>
        <p className="font-display text-3xl font-bold text-ink">{(low.errorKm * 1000).toLocaleString("es-CO", { maximumFractionDigits: 1 })} <span className="text-sm font-normal">m</span></p>
        <p className="text-xs leading-relaxed text-ink-dim">L₁ con bisección en binary32, al exigir <Formula tex="\tau=10^{-20}" />.</p>
      </div>
    </section>

    <section className="rounded-2xl border border-sign/40 bg-surface/80 p-5 sm:p-7 space-y-5">
      <h3 className="flex items-center gap-2 text-lg font-semibold text-sign"><Lightbulb aria-hidden="true" className="size-5 shrink-0" /> Respuesta a la pregunta orientadora</h3>
      <blockquote className="border-l-4 border-sign pl-4 text-base sm:text-lg italic leading-relaxed text-ink">
        ¿De qué manera los métodos numéricos de aproximación de raíces permiten resolver modelos astronómicos que carecen de solución matemática exacta?
      </blockquote>
      <p className="text-sm sm:text-base leading-relaxed text-ink-dim">En este caso, la condición de equilibrio se convierte en <Formula tex="P_i(r)=0" />. Los métodos construyen aproximaciones de su raíz y las convierten en una distancia física. <strong className="text-ink">La solución existe en el modelo; el trabajo numérico consiste en aproximarla y comprobar qué precisión se ha conseguido.</strong></p>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 text-sm leading-relaxed text-ink-dim">
        <div className="min-w-0 rounded-xl border border-line bg-bg/60 p-4"><p className="mb-2 font-semibold text-mant">1. Modelar</p>Relacionar las fuerzas y el marco giratorio para obtener el polinomio de cada región.</div>
        <div className="min-w-0 rounded-xl border border-line bg-bg/60 p-4"><p className="mb-2 font-semibold text-exp">2. Aproximar</p>Reducir un intervalo con bisección o corregir una semilla con la tangente de Newton.</div>
        <div className="min-w-0 rounded-xl border border-line bg-bg/60 p-4"><p className="mb-2 font-semibold text-sign">3. Comprobar</p>Comparar error, residuo y parada con una referencia independiente de alta precisión.</div>
      </div>
    </section>

    <section className="border-t border-line pt-7 space-y-5">
      <div className="space-y-2">
        <h3 className="text-xl font-display font-semibold text-sign">Aportes de cada método</h3>
        <p className="text-sm leading-relaxed text-ink-dim">Ambos métodos se comparan para el mismo punto de equilibrio y la misma tolerancia.</p>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <FindingCard number="01" icon={ShieldCheck} title="Bisección: controlar el intervalo" tone="mant">
          <p>En L₁, el cambio de signo en <Formula tex="[0,1]" /> permite iniciar la búsqueda. Cada punto medio reduce la región de incertidumbre y la cota ideal anticipa los <strong className="text-ink">{bis.steps.at(-1).k} pasos</strong> observados en binary64 para <Formula tex="\tau=10^{-10}" />.</p>
          <LagrangeMath tex={String.raw`|c_k-r^*|\le\frac{b_0-a_0}{2^k}`} />
          <p>Su fortaleza es el control del intervalo, siempre que las evaluaciones conserven los signos correctos. El error real puede tener rebotes mientras la cota ideal disminuye.</p>
        </FindingCard>
        <FindingCard number="02" icon={Zap} title="Newton: aprovechar la pendiente" tone="exp">
          <p>Con <Formula tex="r_0=0.01" />, Newton alcanza el criterio de tolerancia en <strong className="text-ink">{newton.steps.at(-1).k} pasos</strong>. La derivada orienta la corrección y produce convergencia cuadrática cerca de una raíz simple.</p>
          <LagrangeMath tex={String.raw`r_{k+1}=r_k-\frac{P(r_k)}{P'(r_k)}`} />
          <p>Esta ejecución evalúa P {newton.evaluations} veces y P′ {newton.derivativeEvaluations} veces; bisección evalúa P {bis.evaluations} veces. Menos pasos no constituye, por sí solo, una medición de tiempo de CPU.</p>
        </FindingCard>
      </div>
    </section>

    <section className="space-y-5">
      <h3 className="text-xl font-display font-semibold text-sign">Cuatro hallazgos que explican los resultados</h3>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <FindingCard number="03" icon={Cpu} title="La precisión establece el límite">
          <p>En la prueba con <Formula tex="\tau=10^{-20}" />, bisección en binary32 se estanca tras {low.steps.at(-1).k} pasos, a unos <strong className="text-ink">{(low.errorKm * 1000).toLocaleString("es-CO", { maximumFractionDigits: 1 })} m</strong> de la referencia de L₁.</p>
          <p>El ULP es la separación local entre números representables. Cuando el punto medio se redondea a un extremo, aumentar el máximo de iteraciones deja de aportar precisión.</p>
        </FindingCard>
        <FindingCard number="04" icon={Target} title="La semilla cambia el esfuerzo" tone="exp">
          <p>Las {data.sensitivity.length} semillas ensayadas para Newton en L₁ convergieron, pero necesitaron entre <strong className="text-ink">{Math.min(...seedSteps)} y {Math.max(...seedSteps)} pasos</strong> en binary64.</p>
          <p>Una aproximación inicial cercana ahorra trabajo. El éxito de estas pruebas no demuestra que el método converja desde cualquier semilla: su garantía teórica es local.</p>
        </FindingCard>
        <FindingCard number="05" icon={Scale} title="Residuo pequeño: interpretar la pendiente" tone="mant">
          <LagrangeMath tex={String.raw`|P(r_k)|\approx |P'(r^*)|\,|r_k-r^*|`} />
          <p>Cerca de L₁, la pendiente del polinomio es pequeña. Por eso, un residuo diminuto puede acompañar un error de posición mayor de lo que sugiere su tamaño. Publicar ambos permite interpretar el resultado.</p>
        </FindingCard>
        <FindingCard number="06" icon={ShieldCheck} title="La parada también es un resultado">
          <p>El redondeo puede alterar el signo de P cerca de la raíz. En algunas ejecuciones el intervalo de máquina dejó de contener la referencia, y la cota del intervalo perdió su garantía para la raíz real.</p>
          <p>La referencia de {data.referenceDigits} dígitos permite detectar ese efecto y distinguir tolerancia, estancamiento y residuo redondeado a cero. Se utiliza para verificar; no decide cuándo se detienen los métodos.</p>
        </FindingCard>
      </div>
    </section>

    <section className="rounded-2xl border border-line bg-surface/60 p-5 sm:p-6 space-y-4">
      <h3 className="flex items-center gap-2 text-lg font-display font-semibold text-ink"><Compass aria-hidden="true" className="size-5 shrink-0 text-sign" /> Del número a una posición en el espacio</h3>
      <p className="text-sm leading-relaxed text-ink-dim">La raíz adimensional se convierte en distancia mediante <Formula tex="d=Rr" />. Así se interpretan los tres resultados del modelo circular Sol–Tierra:</p>
      <div className="overflow-x-auto rounded-xl border border-line">
        <table className="w-full text-left text-xs sm:text-sm">
          <caption className="sr-only">Distancias aproximadas de los puntos colineales en el modelo Sol–Tierra</caption>
          <thead className="bg-surface-2 text-ink"><tr><th className="px-4 py-3">Punto</th><th className="px-4 py-3">Ubicación</th><th className="whitespace-nowrap px-4 py-3">Distancia aproximada</th><th className="whitespace-nowrap px-4 py-3">Medida desde</th></tr></thead>
          <tbody className="divide-y divide-line text-ink-dim">{locations.map((point) => <tr key={point.id} className="hover:bg-surface">
            <td className="px-4 py-3 font-semibold text-sign">{point.label}</td><td className="min-w-40 px-4 py-3">{point.location}</td><td className="whitespace-nowrap px-4 py-3 font-mono font-semibold text-ink">{km(point.id)} km</td><td className="px-4 py-3">{point.origin}</td>
          </tr>)}</tbody>
        </table>
      </div>
      <p className="flex items-start gap-2 text-xs sm:text-sm leading-relaxed text-ink-dim"><Orbit aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-mant" /><span>L₁, L₂ y L₃ son equilibrios dinámicamente inestables. Calcular su posición con precisión y mantener una nave cerca de ellos son problemas distintos. Las distancias de esta tabla corresponden al modelo idealizado; la incertidumbre física de las masas y las órbitas se suma al error numérico.</span></p>
    </section>

    <section className="rounded-2xl border border-mant/40 bg-surface/80 p-5 sm:p-7 space-y-4">
      <h3 className="flex items-center gap-2 text-lg font-semibold text-mant"><CheckCircle2 aria-hidden="true" className="size-5 shrink-0" /> Resumen del estudio</h3>
      <p className="text-sm sm:text-base leading-relaxed text-ink-dim">Los puntos de Lagrange muestran cómo el análisis numérico conecta una ley física con una posición calculable. Bisección aporta control del intervalo; Newton aprovecha la derivada para reducir el número de pasos. La elección del método se completa al estudiar el redondeo, la semilla y los criterios de parada.</p>
      <p className="text-sm leading-relaxed text-ink-dim"><strong className="text-ink">Una aproximación útil debe venir acompañada de evidencia de su precisión.</strong> Los errores, residuos y motivos de parada de las {data.experiments.length} ejecuciones permiten responder a la pregunta de investigación y reconocer los límites de la máquina y del modelo.</p>
      <Link to="/resultados?modelo=lagrange" className="inline-flex items-center gap-2 rounded-lg border border-mant/30 bg-mant/10 px-4 py-2.5 text-xs sm:text-sm font-semibold text-mant transition-colors hover:bg-mant/20">Explorar los resultados del experimento <ArrowRight aria-hidden="true" className="size-4" /></Link>
    </section>
    <LagrangeSources />
  </article>;
}
