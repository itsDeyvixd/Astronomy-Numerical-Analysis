import { useState } from "react";
import PageTransition from "../components/PageTransition.jsx";
import Formula from "../components/Formula.jsx";
import { 
  Telescope, Orbit, Compass, Flame, CheckCircle2, 
  ShieldCheck, Cpu, TrendingDown, Scale, Lightbulb
} from "lucide-react";

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

export default function Conclusiones() {
  const [activeTab, setActiveTab] = useState("redshift");

  return (
    <PageTransition className="mx-auto max-w-5xl py-12 px-6">
      
      {/* Encabezado */}
      <div>
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs uppercase tracking-wider text-sign font-semibold">
            Etapa 03
          </span>
          <span className="text-ink-faint text-xs">·</span>
          <span className="font-mono text-xs text-ink-dim">Análisis Numérico en Astronomía</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold font-display text-ink mt-2">
          Conclusiones y Respuestas Orientadoras
        </h1>
        <p className="mt-3 text-ink-dim max-w-3xl leading-relaxed text-sm sm:text-base">
          Síntesis de los hallazgos analíticos, computacionales y físicos obtenidos tras aplicar métodos de búsqueda de raíces a los problemas astrofísicos y responder a las preguntas orientadoras del proyecto.
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

      {/* Contenido según el tema activo */}
      <div className="mt-6">

        {/* ================= TEMA REDSHIFT (NICOLAS BETANCUR) ================= */}
        {activeTab === "redshift" && (
          <article className="space-y-8 animate-in fade-in duration-300">
            
            {/* Encabezado del Informe */}
            <header className="p-6 rounded-2xl border border-mant/30 bg-surface/80 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-80 h-80 bg-mant/5 rounded-full blur-3xl pointer-events-none" />
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-mono uppercase tracking-wider text-mant font-semibold">
                    Sección 7 del Informe Experimental
                  </span>
                  <h2 className="text-2xl font-bold font-display text-ink mt-1">
                    Conclusiones y Defensa de la Pregunta Orientadora
                  </h2>
                  <p className="text-xs font-mono text-ink-dim mt-1">
                    Modelo Cosmológico <Formula tex="\Lambda\text{CDM}" /> Plano · Búsqueda de Raíces por Bisección
                  </p>
                </div>
                <div className="px-3 py-1.5 rounded-lg border border-line bg-surface font-mono text-xs text-ink-dim">
                  Autor: <span className="text-mant font-semibold">Nicolas Betancur</span>
                </div>
              </div>
            </header>

            {/* Lista de Conclusiones Exactas */}
            <div className="space-y-5">
              
              {/* Conclusión 1 */}
              <div className="p-6 rounded-xl border border-line bg-surface/50 hover:border-mant/40 transition-colors space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center size-8 rounded-lg bg-mant/10 text-mant font-mono font-bold text-sm border border-mant/30 shrink-0">
                    1
                  </div>
                  <h3 className="text-lg font-semibold text-ink flex items-center gap-2">
                    <Lightbulb className="size-5 text-mant" />
                    Respuesta a la pregunta de investigación
                  </h3>
                </div>
                <p className="text-ink-dim leading-relaxed text-sm sm:text-base pl-11">
                  Los métodos numéricos de aproximación de raíces permiten resolver modelos astronómicos no lineales al transformar un problema analíticamente irresoluble (despejar el corrimiento al rojo de una integral elíptica) en una secuencia de evaluaciones funcionales controladas que convergen incondicionalmente a la solución física.
                </p>
              </div>

              {/* Conclusión 2 */}
              <div className="p-6 rounded-xl border border-line bg-surface/50 hover:border-mant/40 transition-colors space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center size-8 rounded-lg bg-mant/10 text-mant font-mono font-bold text-sm border border-mant/30 shrink-0">
                    2
                  </div>
                  <h3 className="text-lg font-semibold text-ink flex items-center gap-2">
                    <ShieldCheck className="size-5 text-mant" />
                    Robustez de Bisección
                  </h3>
                </div>
                <p className="text-ink-dim leading-relaxed text-sm sm:text-base pl-11">
                  Gracias a la estricta monotonía de la distancia de luminosidad cosmológica, el Teorema de Bolzano garantiza convergencia absoluta sin requerir derivadas ni correr riesgos de divergencia local.
                </p>
              </div>

              {/* Conclusión 3 */}
              <div className="p-6 rounded-xl border border-line bg-surface/50 hover:border-mant/40 transition-colors space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center size-8 rounded-lg bg-mant/10 text-mant font-mono font-bold text-sm border border-mant/30 shrink-0">
                    3
                  </div>
                  <h3 className="text-lg font-semibold text-ink flex items-center gap-2">
                    <Cpu className="size-5 text-mant" />
                    Dominio de la aritmética de máquina
                  </h3>
                </div>
                <p className="text-ink-dim leading-relaxed text-sm sm:text-base pl-11">
                  La implementación computacional exige precauciones específicas (cálculo de punto medio <Formula tex="a + (b-a)/2" />, comparación de signos sin multiplicación y control de estancamiento de máquina) para evitar fallos por subdesbordamiento (<em>underflow</em>) y bucles infinitos.
                </p>
              </div>

              {/* Conclusión 4 */}
              <div className="p-6 rounded-xl border border-line bg-surface/50 hover:border-mant/40 transition-colors space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center size-8 rounded-lg bg-mant/10 text-mant font-mono font-bold text-sm border border-mant/30 shrink-0">
                    4
                  </div>
                  <h3 className="text-lg font-semibold text-ink flex items-center gap-2">
                    <TrendingDown className="size-5 text-mant" />
                    Brecha teoría-computación
                  </h3>
                </div>
                <p className="text-ink-dim leading-relaxed text-sm sm:text-base pl-11">
                  Se confirmó que la cota matemática es estrictamente monótona, pero el error real oscila; y que la precisión final está acotada por el formato IEEE 754 de la máquina, validando los conceptos teóricos aprendidos en el curso.
                </p>
              </div>

              {/* Conclusión 5 */}
              <div className="p-6 rounded-xl border border-line bg-surface/50 hover:border-mant/40 transition-colors space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center size-8 rounded-lg bg-mant/10 text-mant font-mono font-bold text-sm border border-mant/30 shrink-0">
                    5
                  </div>
                  <h3 className="text-lg font-semibold text-ink flex items-center gap-2">
                    <Scale className="size-5 text-mant" />
                    Calibración dimensional del residuo
                  </h3>
                </div>
                <p className="text-ink-dim leading-relaxed text-sm sm:text-base pl-11">
                  Se demostró analítica y numéricamente que el residuo está gobernado por la derivada <Formula tex="f'(z^*) \approx 7763\text{ Mpc}" />, evidenciando por qué el criterio de parada en bisección debe gobernar sobre el tamaño del semi-intervalo de la variable física y no sobre el residuo funcional.
                </p>
              </div>

            </div>

            {/* Recuadro de Cierre Sintético */}
            <div className="p-6 rounded-2xl border border-mant/40 bg-surface/90 space-y-3 mt-8">
              <div className="flex items-center gap-2 text-mant font-semibold text-sm">
                <CheckCircle2 className="size-5" /> Síntesis para la Tarea de Análisis Numérico
              </div>
              <p className="text-xs sm:text-sm text-ink-dim leading-relaxed">
                El estudio integral del corrimiento al rojo (<Formula tex="z" />) en supernovas tipo Ia mediante el método de bisección ilustra con rigor cómo la modelación matemática analítica, la física cosmológica moderna y las leyes discretas del estándar IEEE 754 convergen para producir resultados científicos exactos, estables y computacionalmente reproducibles.
              </p>
            </div>

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
              Sección reservada para las conclusiones y respuestas a la pregunta orientadora de este modelo astronómico.
            </p>
            <span className="mt-4 font-mono text-xs px-3 py-1 rounded-full bg-surface text-ink-faint border border-line">
              Conclusiones en desarrollo · Esperando defensa de {TEMAS.find(t => t.id === activeTab)?.author}
            </span>
          </div>
        )}

      </div>
    </PageTransition>
  );
}
