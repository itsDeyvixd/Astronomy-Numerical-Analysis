import { Link } from "react-router-dom";
import PageTransition from "../components/PageTransition.jsx";
import Formula from "../components/Formula.jsx";
import { 
  Orbit, Telescope, Compass, Flame, ArrowRight, 
  Sparkles, ShieldCheck, Cpu, Database, Binary, ExternalLink
} from "lucide-react";

const TEAM_MODELS = [
  {
    id: "kepler",
    title: "Ecuación de Kepler",
    subtitle: "Mecánica Celeste y Órbitas Planetarias",
    author: "Deyvi Ardila",
    accent: "exp",
    icon: Orbit,
    formula: "M = E - e \\sin(E)",
    desc: "Cálculo de la posición orbital real a partir del tiempo transcurrido. La incógnita geométrica está atrapada de forma trascendente.",
    methods: ["Bisección Robusta", "Newton-Raphson", "Punto Fijo"],
    status: "Completo"
  },
  {
    id: "redshift",
    title: "Corrimiento al Rojo (z)",
    subtitle: "Cosmología ΛCDM y Supernovas Tipo Ia",
    author: "Nicolas Betancur",
    accent: "mant",
    icon: Telescope,
    formula: "D_L(z) - D_{\\text{obs}} = 0",
    desc: "Estimación de distancias cosmológicas e historia de la expansión del universo mediante integrales elípticas incompletas acopladas.",
    methods: ["Bisección", "Cuadratura Simpson"],
    status: "Completo"
  },
  {
    id: "lagrange",
    title: "Puntos de Lagrange",
    subtitle: "Problema Restringido de 3 Cuerpos",
    author: "Germán Rodríguez",
    accent: "sign",
    icon: Compass,
    formula: "\\text{Polinomio Quíntico de Euler}",
    desc: "Ubicación de zonas de equilibrio gravitacional en sistemas binarios (Tierra-Sol) para el estacionamiento de observatorios espaciales.",
    methods: ["Bisección", "Newton-Raphson"],
    status: "Completo"
  },
  {
    id: "wien",
    title: "Ley de Wien",
    subtitle: "Termodinámica y Radiación Estelar",
    author: "Juan Huertas",
    accent: "exp",
    icon: Flame,
    formula: "x = 5(1 - e^{-x})",
    desc: "Determinación de la temperatura superficial de estrellas a partir del pico de emisión espectral en la ley de radiación de Planck.",
    methods: ["Punto Fijo", "Newton-Raphson"],
    status: "Completo"
  }
];

export default function Landing() {
  return (
    <PageTransition className="mx-auto max-w-6xl py-12 px-6 space-y-16">
      
      {/* ---------------- HERO SECTION ---------------- */}
      <section className="relative flex flex-col items-center text-center pt-8 pb-4">
        
        {/* Glow de fondo */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-exp/10 rounded-full blur-3xl pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-line bg-surface/80 text-xs font-mono text-ink-dim mb-6 backdrop-blur-md shadow-sm">
          <Sparkles className="size-3.5 text-exp" />
          <span>Universidad Nacional de Colombia · Análisis Numérico</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold font-display tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-mant via-exp to-sign">
          Astronomía Computacional
        </h1>

        <p className="mt-4 text-xl sm:text-2xl font-display font-medium text-ink max-w-3xl">
          Modelado de Fenómenos Cósmicos mediante Métodos de Búsqueda de Raíces
        </p>

        <p className="mt-4 text-base sm:text-lg text-ink-dim max-w-2xl leading-relaxed">
          En la física astronómica, las leyes fundamentales frecuentemente generan relaciones trascendentes e integrales sin solución matemática analítica. Se examina cómo el cálculo numérico permite descubrir lo que el álgebra no puede despejar.
        </p>

        {/* Tarjeta de la Pregunta Orientadora */}
        <div className="mt-8 p-6 sm:p-7 max-w-3xl rounded-2xl border border-exp/30 bg-surface/80 backdrop-blur-md shadow-2xl relative overflow-hidden text-left">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-exp font-semibold mb-2">
            <span className="size-2 rounded-full bg-exp animate-ping" /> Pregunta Orientadora de la Investigación
          </div>
          <p className="text-base sm:text-lg italic text-ink font-serif leading-relaxed">
            &ldquo;¿De qué manera los métodos numéricos de aproximación de raíces permiten resolver modelos astronómicos que carecen de solución matemática exacta?&rdquo;
          </p>
        </div>

        {/* Botones de Acción */}
        <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
          <Link
            to="/intuicion"
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-exp to-mant text-bg font-bold font-display text-sm hover:opacity-95 transition-all shadow-lg shadow-exp/20"
          >
            Explorar Intuición Inicial <ArrowRight className="size-4" />
          </Link>
          <Link
            to="/resultados"
            className="flex items-center gap-2 px-6 py-3 rounded-xl border border-line bg-surface/80 text-ink font-semibold font-display text-sm hover:bg-surface transition-all"
          >
            Ver Bancos de Prueba
          </Link>
        </div>
      </section>

      {/* ---------------- LOS 4 MODELOS DEL PROYECTO ---------------- */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-line pb-4">
          <div>
            <span className="text-xs font-mono text-exp uppercase font-semibold">Laboratorios de Investigación</span>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-ink mt-0.5">
              Modelos Astronómicos del Proyecto
            </h2>
          </div>
          <p className="text-xs font-mono text-ink-faint">
            4 Modelos · 4 Investigadores
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {TEAM_MODELS.map((m) => {
            const Icon = m.icon;
            return (
              <div
                key={m.id}
                className="p-6 rounded-2xl border border-line bg-surface/60 hover:bg-surface/90 hover:border-exp/40 transition-all shadow-lg flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className={`p-2 rounded-xl bg-${m.accent}/10 text-${m.accent} border border-${m.accent}/30`}>
                        <Icon className="size-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-ink group-hover:text-exp transition-colors">
                          {m.title}
                        </h3>
                        <span className="text-xs text-ink-dim block">{m.subtitle}</span>
                      </div>
                    </div>
                    <span className="text-[11px] font-mono px-2.5 py-1 rounded-full border border-line bg-bg text-ink-dim">
                      {m.status}
                    </span>
                  </div>

                  {/* Fórmula del Modelo */}
                  <div className="my-3 py-2 px-3 bg-bg/80 rounded-xl border border-line flex items-center justify-center font-mono text-sm text-mant">
                    <Formula tex={m.formula} />
                  </div>

                  <p className="text-xs text-ink-dim leading-relaxed mt-2">
                    {m.desc}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-line/60 flex items-center justify-between">
                  <div className="text-xs font-mono">
                    <span className="text-ink-faint">Investigador: </span>
                    <span className="text-ink font-semibold">{m.author}</span>
                  </div>
                  <Link
                    to={`/intuicion?modelo=${m.id}`}
                    className="inline-flex items-center gap-1 text-xs font-mono text-exp hover:text-mant transition-colors"
                  >
                    Ver análisis <ArrowRight className="size-3" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ---------------- PILARES DEL ANÁLISIS NUMÉRICO ---------------- */}
      <section className="space-y-6 border-t border-line pt-10">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs font-mono text-mant uppercase font-semibold">Metodología Rigurosa</span>
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-ink mt-0.5">
            Física Teórica vs Aritmética de Máquina (IEEE 754)
          </h2>
          <p className="text-xs sm:text-sm text-ink-dim mt-2 leading-relaxed">
            Los experimentos examinan cómo las restricciones físicas de las computadoras influyen en la exactitud científica.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-xl border border-line bg-surface/50 space-y-2.5">
            <div className="flex items-center gap-2 text-mant font-semibold text-sm">
              <Binary className="size-4" /> Precisión Simple vs Doble
            </div>
            <p className="text-xs text-ink-dim leading-relaxed">
              Se compara la barrera de estancamiento de máquina entre <code className="text-sign font-mono">float32</code> (24 bits mantisa, límite en iteración 24) y <code className="text-mant font-mono">float64</code> (53 bits, 16 decimales de precisión).
            </p>
          </div>

          <div className="p-5 rounded-xl border border-line bg-surface/50 space-y-2.5">
            <div className="flex items-center gap-2 text-exp font-semibold text-sm">
              <ShieldCheck className="size-4" /> Garantía de Bolzano
            </div>
            <p className="text-xs text-ink-dim leading-relaxed">
              Se construyen intervalos canónicos cerrados donde la física asegura un cambio de signo formal, logrando convergencia incondicional sin riesgo de singularidades.
            </p>
          </div>

          <div className="p-5 rounded-xl border border-line bg-surface/50 space-y-2.5">
            <div className="flex items-center gap-2 text-sign font-semibold text-sm">
              <Cpu className="size-4" /> Misión Crítica (Hard Real-Time)
            </div>
            <p className="text-xs text-ink-dim leading-relaxed">
              Se analiza por qué software aeroespacial como NASA SPICE y receptores GPS confían en métodos con ciclos de reloj estrictamente acotados para garantizar vidas y satélites.
            </p>
          </div>
        </div>
      </section>

      {/* ---------------- RUTA DE NAVEGACIÓN ---------------- */}
      <section className="p-6 sm:p-8 rounded-2xl border border-line bg-surface/70 space-y-4">
        <h3 className="text-lg font-bold font-display text-ink flex items-center gap-2">
          Estructura de la Presentación Web
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs font-mono">
          <Link to="/" className="p-3 bg-bg/60 rounded-xl border border-line hover:border-exp/40 transition-colors">
            <span className="text-exp font-bold block mb-1">00 Inicio</span>
            Presentación general y mapa de investigación.
          </Link>
          <Link to="/intuicion" className="p-3 bg-bg/60 rounded-xl border border-line hover:border-exp/40 transition-colors">
            <span className="text-mant font-bold block mb-1">01 Intuición Inicial</span>
            Formulación física, ecuaciones y simuladores.
          </Link>
          <Link to="/resultados" className="p-3 bg-bg/60 rounded-xl border border-line hover:border-exp/40 transition-colors">
            <span className="text-sign font-bold block mb-1">02 Resultados</span>
            Tablas iterativas, errores reales y límites IEEE 754.
          </Link>
          <Link to="/conclusiones" className="p-3 bg-bg/60 rounded-xl border border-line hover:border-exp/40 transition-colors">
            <span className="text-exp font-bold block mb-1">03 Conclusiones</span>
            Defensas técnicas de la pregunta orientadora.
          </Link>
        </div>
      </section>

    </PageTransition>
  );
}
