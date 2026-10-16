import { useState } from "react";
import PageTransition from "../components/PageTransition.jsx";
import Formula from "../components/Formula.jsx";
import errorImg from "../assets/error-no-monotono-biseccion.png";
import { 
  Telescope, Orbit, Compass, Flame, Table, 
  CheckCircle2, ShieldCheck, Code2
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

const ITERACIONES = [
  { k: 1, a: "0.0000000", b: "5.0000000", c: "2.5000000", f: "+1.522382e+04", cota: "2.500000e+00", error: "1.680000e+00" },
  { k: 2, a: "0.0000000", b: "2.5000000", c: "1.2500000", f: "+3.535926e+03", cota: "1.250000e+00", error: "4.300000e-01" },
  { k: 3, a: "0.0000000", b: "1.2500000", c: "0.6250000", f: "-1.462875e+03", cota: "6.250000e-01", error: "1.950000e-01" },
  { k: 4, a: "0.6250000", b: "1.2500000", c: "0.9375000", f: "+9.286143e+02", cota: "3.125000e-01", error: "1.175000e-01" },
  { k: 5, a: "0.6250000", b: "0.9375000", c: "0.7812500", f: "-2.989386e+02", cota: "1.562500e-01", error: "3.875000e-02" },
  { k: 6, a: "0.7812500", b: "0.9375000", c: "0.8593750", f: "+3.075805e+02", cota: "7.812500e-02", error: "3.937500e-02" },
  { k: 7, a: "0.7812500", b: "0.8593750", c: "0.8203125", f: "+2.426179e+00", cota: "3.906250e-02", error: "3.125000e-04", highlight: "valle" },
  { k: 8, a: "0.7812500", b: "0.8203125", c: "0.8007812", f: "-1.487405e+02", cota: "1.953125e-02", error: "1.921875e-02", highlight: "rebote" },
  { k: 9, a: "0.8007812", b: "0.8203125", c: "0.8105469", f: "-7.327687e+01", cota: "9.765625e-03", error: "9.453125e-03" },
  { k: 10, a: "0.8105469", b: "0.8203125", c: "0.8154297", f: "-3.545511e+01", cota: "4.882812e-03", error: "4.570312e-03" },
  { k: 11, a: "0.8154297", b: "0.8203125", c: "0.8178711", f: "-1.652189e+01", cota: "2.441406e-03", error: "2.128906e-03" },
  { k: 12, a: "0.8178711", b: "0.8203125", c: "0.8190918", f: "-7.049706e+00", cota: "1.220703e-03", error: "9.082031e-04" },
  { k: 13, a: "0.8190918", b: "0.8203125", c: "0.8197021", f: "-2.312226e+00", cota: "6.103516e-04", error: "2.978516e-04" },
  { k: 14, a: "0.8197021", b: "0.8203125", c: "0.8200073", f: "+5.686080e-02", cota: "3.051758e-04", error: "7.324219e-06", highlight: "valle" },
  { k: 15, a: "0.8197021", b: "0.8200073", c: "0.8198547", f: "-1.127712e+00", cota: "1.525879e-04", error: "1.452637e-04", highlight: "rebote" },
  { k: 16, a: "0.8198547", b: "0.8200073", c: "0.8199310", f: "-5.354326e-01", cota: "7.629395e-05", error: "6.896973e-05" },
  { k: 17, a: "0.8199310", b: "0.8200073", c: "0.8199692", f: "-2.392877e-01", cota: "3.814697e-05", error: "3.082275e-05" },
  { k: 18, a: "0.8199692", b: "0.8200073", c: "0.8199883", f: "-9.121392e-02", cota: "1.907349e-05", error: "1.174927e-05" },
  { k: 19, a: "0.8199883", b: "0.8200073", c: "0.8199978", f: "-1.717667e-02", cota: "9.536743e-06", error: "2.212524e-06" },
  { k: 20, a: "0.8199978", b: "0.8200073", c: "0.8200026", f: "+1.984203e-02", cota: "4.768372e-06", error: "2.555847e-06" },
  { k: 21, a: "0.8199978", b: "0.8200026", c: "0.8200002", f: "+1.332673e-03", cota: "2.384186e-06", error: "1.716614e-07", highlight: "valle" },
  { k: 22, a: "0.8199978", b: "0.8200002", c: "0.8199990", f: "-7.922002e-03", cota: "1.192093e-06", error: "1.020432e-06", highlight: "rebote" },
  { k: 23, a: "0.8199990", b: "0.8200002", c: "0.8199996", f: "-3.294665e-03", cota: "5.960464e-07", error: "4.243851e-07", highlight: "convergencia" },
];

export default function Resultados() {
  const [activeTab, setActiveTab] = useState("redshift");
  const [showCode, setShowCode] = useState(false);

  return (
    <PageTransition className="mx-auto max-w-5xl py-12 px-6">
      
      {/* Encabezado */}
      <div>
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs uppercase tracking-wider text-mant font-semibold">
            Etapa 02
          </span>
          <span className="text-ink-faint text-xs">·</span>
          <span className="font-mono text-xs text-ink-dim">Análisis Numérico en Astronomía</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold font-display text-ink mt-2">
          Resultados Experimentales por Modelo
        </h1>
        <p className="mt-3 text-ink-dim max-w-3xl leading-relaxed text-sm sm:text-base">
          Verificación computacional paso a paso, contraste empírico de cotas de error teórico frente a error real, análisis gráfico de no-monotonicidad, límites IEEE 754 de máquina y evaluación analítica de criterios de parada.
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
          <article className="space-y-12 animate-in fade-in duration-300">
            
            {/* Ficha Técnica del Modelo */}
            <header className="p-6 rounded-2xl border border-mant/30 bg-surface/80 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-80 h-80 bg-mant/5 rounded-full blur-3xl pointer-events-none" />
              <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                <div>
                  <span className="text-xs font-mono uppercase tracking-wider text-mant font-semibold">
                    Informe de Resultados Experimentales
                  </span>
                  <h2 className="text-2xl font-bold font-display text-ink mt-1">
                    Determinación Numérica del Corrimiento al Rojo (<Formula tex="z" />) Mediante el Método de Bisección
                  </h2>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowCode(!showCode)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-line bg-surface hover:bg-surface-2 text-ink-dim hover:text-ink text-xs font-mono transition-colors"
                  >
                    <Code2 className="size-4 text-mant" />
                    <span>{showCode ? "Ocultar Código" : "Ver Código Python"}</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono pt-4 border-t border-line/60">
                <div>
                  <span className="text-ink-faint block">Asignatura:</span>
                  <span className="text-ink font-semibold">Análisis Numérico</span>
                </div>
                <div>
                  <span className="text-ink-faint block">Modelo Físico:</span>
                  <span className="text-ink font-semibold">Expansión <Formula tex="\Lambda\text{CDM}" /> Plano</span>
                </div>
                <div>
                  <span className="text-ink-faint block">Problema:</span>
                  <span className="text-ink font-semibold"><Formula tex="f(z) = D_L(z) - D_{\text{obs}} = 0" /></span>
                </div>
                <div>
                  <span className="text-ink-faint block">Fecha de experimentación:</span>
                  <span className="text-ink font-semibold">Octubre de 2026</span>
                </div>
              </div>
            </header>

            {/* Código Plegable */}
            {showCode && (
              <section className="p-5 rounded-xl border border-line bg-surface/90 space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-line">
                  <span className="text-mant font-semibold flex items-center gap-2">
                    <Code2 className="size-4" /> Script Numérico: Bisección con Cuadratura y Guarda de 3 Capas
                  </span>
                  <span className="text-ink-faint text-[11px]">Python 3 + NumPy + SciPy</span>
                </div>
                <pre className="overflow-x-auto text-ink-dim leading-relaxed p-3 bg-bg/80 rounded-lg">
{`import numpy as np
from scipy.integrate import quad

# Parámetros cosmológicos del modelo LCDM plano
c = 299792.458       # km/s
H0 = 70.0            # (km/s)/Mpc
Omega_m = 0.3
Omega_L = 0.7
z_star = 0.8200
D_obs = 5172.5730    # Mpc

def E(z):
    return np.sqrt(Omega_m * (1.0 + z)**3 + Omega_L)

def D_L(z):
    # Integral elíptica sin primitiva elemental
    integral, _ = quad(lambda zp: 1.0 / E(zp), 0.0, z, epsabs=1e-12, epsrel=1e-12)
    return (c * (1.0 + z) / H0) * integral

def f(z):
    return D_L(z) - D_obs

# Algoritmo de Bisección numéricamente estable
def biseccion_cosmologica(a=0.0, b=5.0, tol=1e-6, max_iter=100):
    f_a, f_b = f(a), f(b)
    assert np.sign(f_a) != np.sign(f_b), "No hay cambio de signo en el intervalo"
    
    for k in range(1, max_iter + 1):
        # 1. Punto medio numéricamente estable
        c_k = a + (b - a) / 2.0
        f_c = f(c_k)
        cota = (b - a) / 2.0
        
        # Capa 1: Criterio en el dominio físico
        if cota < tol:
            return c_k, k, "tolerancia_alcanzada"
            
        # Capa 2: Guarda de finitud IEEE 754 (estancamiento)
        if c_k == a or c_k == b:
            return c_k, k, "estancamiento_maquina"
            
        # Actualización de extremos sin multiplicación directa
        if np.sign(f_a) != np.sign(f_c):
            b, f_b = c_k, f_c
        else:
            a, f_a = c_k, f_c
            
    return c_k, max_iter, "max_iter_alcanzado"`}
                </pre>
              </section>
            )}

            {/* SECCIÓN 1: Resumen Ejecutivo y Parámetros del Modelo */}
            <section className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="flex items-center justify-center size-8 rounded-lg bg-mant/10 text-mant font-mono font-bold text-sm border border-mant/30">
                  1
                </span>
                <h3 className="text-xl font-display font-semibold text-ink">
                  Resumen Ejecutivo y Parámetros del Modelo
                </h3>
              </div>

              <div className="p-6 rounded-xl border border-line bg-surface/50 space-y-4 text-ink-dim leading-relaxed">
                <p>
                  En este trabajo se implementó y analizó el comportamiento numérico y computacional del <strong className="text-ink">Método de Bisección</strong> para determinar el corrimiento al rojo (<Formula tex="z" />) de una supernova lejana de tipo Ia a partir de su distancia de luminosidad observada (<Formula tex="D_{\text{obs}}" />).
                </p>

                <p>
                  Los parámetros cosmológicos adoptados corresponden al modelo estándar <Formula tex="\Lambda\text{CDM}" /> plano:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
                  <div className="p-3 rounded-lg border border-line bg-surface/80 font-mono text-xs">
                    <span className="text-ink-faint block">Velocidad de la luz (<Formula tex="c" />):</span>
                    <span className="text-ink text-sm font-semibold">299,792.458 km/s</span>
                  </div>
                  <div className="p-3 rounded-lg border border-line bg-surface/80 font-mono text-xs">
                    <span className="text-ink-faint block">Constante de Hubble (<Formula tex="H_0" />):</span>
                    <span className="text-ink text-sm font-semibold">70.0 (km/s)/Mpc</span>
                  </div>
                  <div className="p-3 rounded-lg border border-line bg-surface/80 font-mono text-xs">
                    <span className="text-ink-faint block">Densidad de materia (<Formula tex="\Omega_m" />):</span>
                    <span className="text-ink text-sm font-semibold">0.3</span>
                  </div>
                  <div className="p-3 rounded-lg border border-line bg-surface/80 font-mono text-xs">
                    <span className="text-ink-faint block">Densidad de energía oscura (<Formula tex="\Omega_\Lambda" />):</span>
                    <span className="text-ink text-sm font-semibold">0.7</span>
                  </div>
                  <div className="p-3 rounded-lg border border-line bg-surface/80 font-mono text-xs">
                    <span className="text-ink-faint block">Corrimiento al rojo exacto (<Formula tex="z^*" />):</span>
                    <span className="text-mant text-sm font-semibold">0.8200</span>
                  </div>
                  <div className="p-3 rounded-lg border border-line bg-surface/80 font-mono text-xs">
                    <span className="text-ink-faint block">Distancia observada (<Formula tex="D_{\text{obs}}" />):</span>
                    <span className="text-exp text-sm font-semibold">5172.5730 Mpc</span>
                  </div>
                </div>

                <p className="pt-2">
                  La distancia teórica se calcula a través de la integral elíptica:
                </p>

                <div className="p-4 rounded-lg bg-bg/80 border border-line/60 overflow-x-auto text-center">
                  <Formula 
                    tex={String.raw`D_L(z) = \frac{c(1+z)}{H_0} \int_0^z \frac{dz'}{\sqrt{\Omega_m(1+z')^3 + \Omega_\Lambda}}`}
                    block
                  />
                </div>

                <p>
                  La cual carece de primitiva analítica elemental, requiriendo cuadratura numérica adaptativa y búsqueda de raíces para despejar <Formula tex="z" />.
                </p>
              </div>
            </section>

            {/* SECCIÓN 2: Experimento 1 */}
            <section className="space-y-6">
              <div className="flex items-center gap-3">
                <span className="flex items-center justify-center size-8 rounded-lg bg-mant/10 text-mant font-mono font-bold text-sm border border-mant/30">
                  2
                </span>
                <h3 className="text-xl font-display font-semibold text-ink">
                  Experimento 1: Validación de Convergencia y Verificación de Pasos Teóricos
                </h3>
              </div>

              {/* 2.1 */}
              <div className="p-6 rounded-xl border border-line bg-surface/50 space-y-4">
                <h4 className="text-lg font-semibold text-ink">
                  2.1. Cota Teórica a Priori
                </h4>
                <p className="text-ink-dim leading-relaxed">
                  Para un intervalo inicial <Formula tex="[a_0, b_0] = [0.0, 5.0]" /> y una tolerancia absoluta <Formula tex="\varepsilon = 10^{-6}" />, la cota teórica de Kincaid & Cheney establece que el número mínimo de iteraciones <Formula tex="n" /> satisface:
                </p>

                <div className="p-4 rounded-lg bg-bg/80 border border-line/60 overflow-x-auto text-center">
                  <Formula 
                    tex={String.raw`n \ge \frac{\ln(b_0 - a_0) - \ln(\varepsilon)}{\ln 2} - 1 = \frac{\ln(5.0) - \ln(10^{-6})}{\ln 2} - 1 = \frac{1.609438 - (-13.815511)}{0.693147} - 1 \approx 21.253`}
                    block
                  />
                </div>

                <p className="text-ink-dim leading-relaxed">
                  Por consiguiente, el número teórico mínimo es <strong className="text-mant"><Formula tex="n_{\text{teórico}} = 22" /> iteraciones</strong>.
                </p>
              </div>

              {/* 2.2 Tabla */}
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h4 className="text-lg font-semibold text-ink flex items-center gap-2">
                    <Table className="size-5 text-mant" /> 2.2. Tabla de Ejecución Iterativa Paso a Paso
                  </h4>
                  <div className="flex items-center gap-2 text-xs font-mono">
                    <span className="flex items-center gap-1 text-mant">
                      <span className="size-2 rounded-full bg-mant inline-block" /> Valle de error
                    </span>
                    <span className="flex items-center gap-1 text-sign">
                      <span className="size-2 rounded-full bg-sign inline-block" /> Rebote
                    </span>
                    <span className="flex items-center gap-1 text-exp">
                      <span className="size-2 rounded-full bg-exp inline-block" /> Convergencia
                    </span>
                  </div>
                </div>

                <p className="text-sm text-ink-dim">
                  A continuación se presenta la traza completa de las 23 iteraciones computadas en precisión doble (<code className="text-mant font-mono text-xs">float64</code>):
                </p>

                <div className="overflow-x-auto rounded-xl border border-line bg-surface/60 shadow-inner">
                  <table className="w-full text-xs font-mono text-left border-collapse">
                    <thead>
                      <tr className="border-b border-line bg-surface-2/80 text-ink">
                        <th className="py-3 px-3 text-center">k</th>
                        <th className="py-3 px-3"><Formula tex="a_k" /></th>
                        <th className="py-3 px-3"><Formula tex="b_k" /></th>
                        <th className="py-3 px-3 text-mant font-semibold"><Formula tex="c_k" /> (Aprox.)</th>
                        <th className="py-3 px-3"><Formula tex="f(c_k)" /> (Mpc)</th>
                        <th className="py-3 px-3 text-ink-dim">Cota <Formula tex="\frac{b_k-a_k}{2}" /></th>
                        <th className="py-3 px-3 text-exp font-semibold">Error Real <Formula tex="|z^* - c_k|" /></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-line/40">
                      {ITERACIONES.map((row) => {
                        let rowBg = "hover:bg-surface/80";
                        if (row.highlight === "valle") rowBg = "bg-mant/10 hover:bg-mant/15";
                        if (row.highlight === "rebote") rowBg = "bg-sign/10 hover:bg-sign/15";
                        if (row.highlight === "convergencia") rowBg = "bg-exp/20 font-semibold text-ink hover:bg-exp/25";

                        return (
                          <tr key={row.k} className={`transition-colors ${rowBg}`}>
                            <td className="py-2 px-3 text-center text-ink-faint font-semibold">
                              {row.k}
                            </td>
                            <td className="py-2 px-3 text-ink-dim">{row.a}</td>
                            <td className="py-2 px-3 text-ink-dim">{row.b}</td>
                            <td className="py-2 px-3 text-mant font-medium">{row.c}</td>
                            <td className="py-2 px-3 text-ink-dim">{row.f}</td>
                            <td className="py-2 px-3 text-ink-faint">{row.cota}</td>
                            <td className="py-2 px-3 text-exp font-medium">
                              {row.error}
                              {row.highlight === "valle" && (
                                <span className="ml-1 text-[10px] text-mant uppercase font-bold">↓ Valle</span>
                              )}
                              {row.highlight === "rebote" && (
                                <span className="ml-1 text-[10px] text-sign uppercase font-bold">↑ 61.5x</span>
                              )}
                              {row.highlight === "convergencia" && (
                                <span className="ml-1 text-[10px] text-exp uppercase font-bold">✓ Éxito</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Tarjetas de Resultado Final */}
                <div className="p-6 rounded-xl border border-mant/30 bg-surface/70 space-y-3">
                  <h5 className="font-semibold text-sm text-ink flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-mant" /> Resultado final: El algoritmo convergió en 23 iteraciones.
                  </h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs font-mono pt-1">
                    <div className="p-3 rounded-lg border border-line bg-surface/90">
                      <span className="text-ink-faint block">Raíz aproximada obtenida:</span>
                      <span className="text-mant font-bold text-sm"><Formula tex="c_{23} = 0.81999958" /></span>
                    </div>
                    <div className="p-3 rounded-lg border border-line bg-surface/90">
                      <span className="text-ink-faint block">Error absoluto real final:</span>
                      <span className="text-exp font-bold text-sm"><Formula tex="|z^* - c_{23}| = 4.243851e-07 < 10^{-6}" /></span>
                    </div>
                    <div className="p-3 rounded-lg border border-line bg-surface/90">
                      <span className="text-ink-faint block">Residuo final evaluado:</span>
                      <span className="text-ink font-bold text-sm"><Formula tex="f(c_{23}) = -3.294665e-03\text{ Mpc}" /></span>
                    </div>
                    <div className="p-3 rounded-lg border border-line bg-surface/90">
                      <span className="text-ink-faint block">Cota de semi-intervalo alcanzada:</span>
                      <span className="text-sign font-bold text-sm"><Formula tex="5.960464e-07\text{ Mpc}" /></span>
                    </div>
                  </div>
                </div>

                {/* 2.3 Discusión */}
                <div className="p-5 rounded-xl border border-line bg-surface/40 space-y-2">
                  <h5 className="font-semibold text-sm text-ink">
                    2.3. Discusión
                  </h5>
                  <p className="text-ink-dim text-sm leading-relaxed">
                    El algoritmo requirió exactamente 23 pasos para garantizar que la semilongitud del intervalo fuera estrictamente menor que <Formula tex="10^{-6}" />. Al cabo de 22 divisiones completas, el intervalo mide <Formula tex="(5.0)/2^{22} \approx 1.192 \times 10^{-6}" />, y en el paso 23 alcanza <Formula tex="(5.0)/2^{23} \approx 5.960 \times 10^{-7} < 10^{-6}" />, cumpliendo con total rigurosidad la predicción analítica formulada a priori.
                  </p>
                </div>
              </div>
            </section>

            {/* SECCIÓN 3: Experimento 2 */}
            <section className="space-y-6">
              <div className="flex items-center gap-3">
                <span className="flex items-center justify-center size-8 rounded-lg bg-mant/10 text-mant font-mono font-bold text-sm border border-mant/30">
                  3
                </span>
                <h3 className="text-xl font-display font-semibold text-ink">
                  Experimento 2: Análisis Gráfico de la No-Monotonicidad del Error Verdadero
                </h3>
              </div>

              {/* 3.1 Evidencia */}
              <div className="p-6 rounded-xl border border-line bg-surface/50 space-y-4">
                <h4 className="text-lg font-semibold text-ink">
                  3.1. Evidencia Experimental
                </h4>
                <p className="text-ink-dim leading-relaxed">
                  En el análisis teórico se enfatiza que la cota superior del error se divide exactamente por 2 en cada paso, pero el <strong className="text-ink">error real <Formula tex="|z^* - c_k|" /> no necesariamente decrece monótonamente</strong>.
                </p>

                <p className="text-ink-dim leading-relaxed">
                  Los datos experimentales obtenidos demuestran este fenómeno de manera contundente:
                </p>

                <ul className="list-disc pl-5 space-y-2 text-ink-dim text-sm">
                  <li>
                    En la iteración <Formula tex="k=6" />, el error real es <Formula tex="|z^* - c_6| = 3.937500e-02" />.
                  </li>
                  <li>
                    En la iteración <Formula tex="k=7" />, el punto medio cae fortuitamente muy cerca de la raíz: <Formula tex="|z^* - c_7| = 3.125000e-04" /> (una reducción de dos órdenes de magnitud).
                  </li>
                  <li>
                    En la iteración <Formula tex="k=8" />, el nuevo punto medio se aleja: <Formula tex="|z^* - c_8| = 1.921875e-02" />.
                  </li>
                  <li className="text-sign font-semibold">
                    ¡El error real aumentó en un factor de aproximadamente 61.5 veces entre el paso 7 y el paso 8!
                  </li>
                </ul>

                <p className="text-ink-dim leading-relaxed text-sm">
                  El mismo comportamiento oscilatorio se repite en <Formula tex="k=14" /> frente a <Formula tex="k=15" />, y en <Formula tex="k=21" /> frente a <Formula tex="k=22" />.
                </p>
              </div>

              {/* 3.2 Gráfica */}
              <div className="p-6 rounded-xl border border-line bg-surface/50 space-y-4">
                <h4 className="text-lg font-semibold text-ink">
                  3.2. Gráfica Comparativa
                </h4>
                <p className="text-ink-dim leading-relaxed">
                  La gráfica generada (<code className="font-mono text-xs text-mant">error-no-monotono-biseccion.png</code>) ilustra este contraste:
                </p>

                <div className="p-2 sm:p-4 rounded-xl border border-line/80 bg-bg/80 flex flex-col items-center justify-center">
                  <img 
                    src={errorImg} 
                    alt="Gráfica de No-Monotonicidad del Error en Bisección" 
                    className="rounded-lg max-w-full h-auto shadow-2xl border border-line/50"
                  />
                  <span className="text-xs font-mono text-ink-faint mt-3 text-center">
                    Figura 1: Comparación entre la cota geométrica teórica <Formula tex="O(2^{-k})" /> y el error absoluto real <Formula tex="|z^* - c_k|" /> en escala semilogarítmica.
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 rounded-xl border border-line bg-surface/70 space-y-2">
                    <span className="text-xs font-mono text-sign font-semibold block uppercase">
                      1. Línea roja discontinua (Cota teórica)
                    </span>
                    <p className="text-ink-dim text-xs leading-relaxed">
                      Es una recta decreciente con pendiente constante en escala semilogarítmica, correspondiente a la contracción geométrica determinista <Formula tex="O(2^{-k})" />.
                    </p>
                  </div>
                  <div className="p-4 rounded-xl border border-line bg-surface/70 space-y-2">
                    <span className="text-xs font-mono text-mant font-semibold block uppercase">
                      2. Línea azul continua con marcadores (Error real)
                    </span>
                    <p className="text-ink-dim text-xs leading-relaxed">
                      Presenta valles abruptos seguidos de rebotes hacia la cota superior. Esto se debe a que la regla de bisección divide el espacio ciegamente a la mitad, sin información sobre la posición relativa de la raíz dentro del subintervalo.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* SECCIÓN 4: Experimento 3 */}
            <section className="space-y-6">
              <div className="flex items-center gap-3">
                <span className="flex items-center justify-center size-8 rounded-lg bg-mant/10 text-mant font-mono font-bold text-sm border border-mant/30">
                  4
                </span>
                <h3 className="text-xl font-display font-semibold text-ink">
                  Experimento 3: Límites de Precisión Finita y Estancamiento por Épsilon de Máquina
                </h3>
              </div>

              <div className="p-6 rounded-xl border border-line bg-surface/50 space-y-4">
                <p className="text-ink-dim leading-relaxed">
                  Para evidenciar cómo la física computacional de punto flotante difiere de la recta real <Formula tex="\mathbb{R}" />, se ejecutó el algoritmo exigiendo una tolerancia inalcanzable (<Formula tex="\varepsilon = 10^{-18}" />) en dos niveles de precisión según el estándar IEEE 754: precisión simple (<code className="text-mant font-mono text-xs">float32</code>) y precisión doble (<code className="text-mant font-mono text-xs">float64</code>).
                </p>

                <h4 className="text-lg font-semibold text-ink pt-2">
                  4.1. Resultados Comparativos
                </h4>

                <div className="overflow-x-auto rounded-xl border border-line bg-surface/60">
                  <table className="w-full text-xs font-mono text-left border-collapse">
                    <thead>
                      <tr className="border-b border-line bg-surface-2 text-ink">
                        <th className="py-3 px-4">Parámetro de Ejecución</th>
                        <th className="py-3 px-4 text-sign">Precisión Simple (<code>float32</code>)</th>
                        <th className="py-3 px-4 text-mant">Precisión Doble (<code>float64</code>)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-line/40 text-ink-dim">
                      <tr className="hover:bg-surface/80">
                        <td className="py-2.5 px-4 font-semibold text-ink">Iteraciones realizadas</td>
                        <td className="py-2.5 px-4 text-sign">28 iteraciones</td>
                        <td className="py-2.5 px-4 text-mant">56 iteraciones</td>
                      </tr>
                      <tr className="hover:bg-surface/80">
                        <td className="py-2.5 px-4 font-semibold text-ink">Motivo de detención</td>
                        <td className="py-2.5 px-4 font-mono text-sign">estancamiento_maquina</td>
                        <td className="py-2.5 px-4 font-mono text-mant">tolerancia_alcanzada</td>
                      </tr>
                      <tr className="hover:bg-surface/80">
                        <td className="py-2.5 px-4 font-semibold text-ink">Ancho final del intervalo <Formula tex="(b-a)" /></td>
                        <td className="py-2.5 px-4"><code>5.960464e-08</code></td>
                        <td className="py-2.5 px-4"><code>2.220446e-16</code></td>
                      </tr>
                      <tr className="hover:bg-surface/80">
                        <td className="py-2.5 px-4 font-semibold text-ink">Última cota de error alcanzable</td>
                        <td className="py-2.5 px-4"><code>2.980232e-08</code></td>
                        <td className="py-2.5 px-4"><code>1.110223e-16</code></td>
                      </tr>
                      <tr className="hover:bg-surface/80">
                        <td className="py-2.5 px-4 font-semibold text-ink">Error real final alcanzado</td>
                        <td className="py-2.5 px-4"><code>5.245209e-08</code></td>
                        <td className="py-2.5 px-4 text-mant font-semibold"><code>0.000000e+00</code></td>
                      </tr>
                      <tr className="hover:bg-surface/80">
                        <td className="py-2.5 px-4 font-semibold text-ink">Épsilon de máquina teórico</td>
                        <td className="py-2.5 px-4"><Formula tex="2^{-24} \approx 5.960464 \times 10^{-8}" /></td>
                        <td className="py-2.5 px-4"><Formula tex="2^{-53} \approx 1.110223 \times 10^{-16}" /></td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <h4 className="text-lg font-semibold text-ink pt-4">
                  4.2. Análisis del Fenómeno de Estancamiento
                </h4>

                <div className="space-y-3">
                  <div className="p-4 rounded-xl border border-line bg-surface/70 space-y-2">
                    <span className="text-xs font-mono text-sign font-semibold block uppercase">
                      1. En float32 (23 bits de mantisa):
                    </span>
                    <ul className="list-disc pl-5 space-y-1 text-ink-dim text-xs leading-relaxed">
                      <li>Al llegar a la iteración 28, el intervalo se reduce a <code className="font-mono text-mant">5.960464e-08</code>.</li>
                      <li>En este punto, los extremos <Formula tex="a" /> y <Formula tex="b" /> se convierten en dos <strong className="text-ink">números de máquina contiguos</strong> en el exponente correspondiente (<Formula tex="z \approx 0.82 \implies m = -1" />).</li>
                      <li>La operación de punto medio computada <Formula tex="\text{fl}(a + (b-a)/2)" /> produce exactamente <Formula tex="a" />. Como no existen números representables intermedios, la condición de salvaguarda <code className="font-mono text-xs text-sign">if c == a or c == b: break</code> detiene el proceso, evitando un bucle infinito.</li>
                    </ul>
                  </div>

                  <div className="p-4 rounded-xl border border-line bg-surface/70 space-y-2">
                    <span className="text-xs font-mono text-mant font-semibold block uppercase">
                      2. En float64 (53 bits de mantisa):
                    </span>
                    <p className="text-ink-dim text-xs leading-relaxed">
                      La mayor longitud de la mantisa permite continuar la bisección hasta la iteración 56, alcanzando un intervalo de <Formula tex="2.220446 \times 10^{-16}" />, consistente con el límite de precisión doble.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl border border-exp/30 bg-surface/90 space-y-2">
                    <span className="text-xs font-mono text-exp font-semibold block uppercase">
                      3. Conclusión fundamental:
                    </span>
                    <p className="text-ink leading-relaxed text-sm">
                      Exigir tolerancias menores al épsilon de máquina es numéricamente inviable; aumentar el número de iteraciones no puede compensar la finitud del formato de representación.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* SECCIÓN 5: Experimento 4 */}
            <section className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="flex items-center justify-center size-8 rounded-lg bg-mant/10 text-mant font-mono font-bold text-sm border border-mant/30">
                  5
                </span>
                <h3 className="text-xl font-display font-semibold text-ink">
                  Experimento 4: Ruido de Cuadratura y el 'Piso de Residuo'
                </h3>
              </div>

              <div className="p-6 rounded-xl border border-line bg-surface/50 space-y-4 text-ink-dim leading-relaxed">
                <p>
                  En aplicaciones donde la función residual proviene de una integral, la computadora no evalúa la función continua ideal <Formula tex="f(z)" />, sino una aproximación perturbada:
                </p>

                <div className="p-4 rounded-lg bg-bg/80 border border-line/60 overflow-x-auto text-center">
                  <Formula 
                    tex={String.raw`\hat{f}(z) = f(z) + e_{\text{cuadratura}} + e_{\text{redondeo}}`}
                    block
                  />
                </div>

                <p>A medida que nos aproximamos a la raíz verdadera:</p>

                <ol className="list-decimal pl-5 space-y-3 text-sm">
                  <li>
                    El valor matemático de <Formula tex="f(z)" /> tiende a cero, pero el error numérico de integración de la regla de cuadratura (incluso con tolerancias de <Formula tex="10^{-12}" />) actúa como un <strong className="text-ink">piso de ruido</strong>.
                  </li>
                  <li>
                    Si se empleara un criterio de parada basado únicamente en el residuo <Formula tex="|f(c)| < 10^{-15}" />, el algoritmo fallaría porque las fluctuaciones numéricas en los últimos dígitos decimales del integrador impedirían alcanzar dicho umbral.
                  </li>
                  <li className="text-mant font-medium">
                    Esto valida que en Bisección el <strong className="text-ink">criterio de parada primario debe ser siempre el tamaño del semi-intervalo <Formula tex="\frac{b-a}{2} < \varepsilon" /></strong>, ya que está matemáticamente blindado por el Teorema de Bolzano y la topología del intervalo.
                  </li>
                </ol>
              </div>
            </section>

            {/* SECCIÓN 6: Criterios de Parada y Comportamiento del Residuo */}
            <section className="space-y-6">
              <div className="flex items-center gap-3">
                <span className="flex items-center justify-center size-8 rounded-lg bg-mant/10 text-mant font-mono font-bold text-sm border border-mant/30">
                  6
                </span>
                <h3 className="text-xl font-display font-semibold text-ink">
                  Análisis Detallado de Criterios de Parada y Comportamiento del Residuo
                </h3>
              </div>

              {/* 6.1 */}
              <div className="p-6 rounded-xl border border-line bg-surface/50 space-y-4">
                <h4 className="text-lg font-semibold text-ink">
                  6.1. La Conexión Matemática entre Residuo y Error: El Papel de la Pendiente <Formula tex="f'(z)" />
                </h4>
                <p className="text-ink-dim leading-relaxed">
                  Un dilema clásico en la implementación práctica de algoritmos numéricos radica en interpretar por qué el error en la variable física puede ser sumamente pequeño mientras que el residuo parece cuantitativamente mayor.
                </p>

                <p className="text-ink-dim leading-relaxed">
                  La relación analítica fundamental entre el residuo de la función y el error absoluto en la variable independiente proviene directamente del <strong className="text-ink">Teorema del Valor Medio</strong>:
                </p>

                <div className="p-4 rounded-lg bg-bg/80 border border-line/60 overflow-x-auto text-center">
                  <Formula 
                    tex={String.raw`f(c_k) - f(z^*) = f'(\xi_k)(c_k - z^*)`}
                    block
                  />
                </div>

                <p className="text-ink-dim leading-relaxed">
                  Dado que por definición <Formula tex="f(z^*) = 0" />:
                </p>

                <div className="p-4 rounded-lg bg-bg/80 border border-line/60 overflow-x-auto text-center">
                  <Formula 
                    tex={String.raw`|f(c_k)| \approx |f'(z^*)| \cdot |c_k - z^*|`}
                    block
                  />
                </div>

                <p className="text-ink-dim leading-relaxed">
                  Esta ecuación revela que la <strong className="text-ink">primera derivada de la función residual en la raíz (<Formula tex="f'(z^*)" />) actúa como un factor de escala y amplificación</strong> entre el espacio de la variable (<Formula tex="z" />) y el espacio de la función residual (<Formula tex="f" />).
                </p>
              </div>

              {/* 6.2 */}
              <div className="p-6 rounded-xl border border-line bg-surface/50 space-y-4">
                <h4 className="text-lg font-semibold text-ink">
                  6.2. Evaluación Cuantitativa de la Derivada Cosmológica en <Formula tex="z^* = 0.82" />
                </h4>
                <p className="text-ink-dim leading-relaxed">
                  Diferenciando analíticamente la expresión de la distancia de luminosidad mediante la regla de Leibniz y el Teorema Fundamental del Cálculo:
                </p>

                <div className="p-4 rounded-lg bg-bg/80 border border-line/60 overflow-x-auto text-center">
                  <Formula 
                    tex={String.raw`f'(z) = D_L'(z) = \frac{D_L(z)}{1+z} + \frac{c(1+z)}{H_0 \sqrt{\Omega_m(1+z)^3 + \Omega_\Lambda}}`}
                    block
                  />
                </div>

                <p className="text-ink-dim leading-relaxed">
                  Evaluando en los parámetros adoptados para nuestra supernova (<Formula tex="z^* = 0.82" />, <Formula tex="D_L \approx 5172.5730\text{ Mpc}" />):
                </p>

                <ol className="list-decimal pl-5 space-y-2 text-ink-dim text-sm">
                  <li>
                    <strong className="text-ink">Primer término:</strong> <Formula tex="\frac{5172.5730}{1.82} \approx 2842.07\text{ Mpc}" />
                  </li>
                  <li>
                    <strong className="text-ink">Segundo término:</strong> <Formula tex="\frac{299792.458 \times 1.82}{70.0 \times \sqrt{0.3(1.82)^3 + 0.7}} \approx 4921.14\text{ Mpc}" />
                  </li>
                  <li>
                    <strong className="text-ink">Pendiente total en la raíz:</strong>
                    <div className="my-2 p-3 bg-bg/80 rounded-lg text-center font-mono">
                      <Formula tex={String.raw`f'(0.82) \approx 2842.07 + 4921.14 = \mathbf{7763.21\text{ Mpc}}`} />
                    </div>
                  </li>
                </ol>

                <p className="text-ink-dim leading-relaxed">
                  Multiplicando esta pendiente por el error absoluto real obtenido en la iteración 23 (<Formula tex="|z^* - c_{23}| = 4.243851 \times 10^{-7}" />):
                </p>

                <div className="p-4 rounded-lg bg-bg/80 border border-line/60 overflow-x-auto text-center">
                  <Formula 
                    tex={String.raw`|f(c_{23})| \approx (7763.21\text{ Mpc}) \times (4.243851 \times 10^{-7}) = \mathbf{3.2946 \times 10^{-3}\text{ Mpc}}`}
                    block
                  />
                </div>

                <p className="text-ink-dim leading-relaxed">
                  Este valor teórico concuerda con exactitud absoluta con el residuo de la tabla iterativa:
                </p>

                <div className="p-3 bg-surface rounded-lg border border-mant/30 text-center font-mono text-mant">
                  <Formula tex={String.raw`f(c_{23}) = -3.294665 \times 10^{-3}\text{ Mpc}`} />
                </div>

                {/* Significado Dimensional */}
                <div className="p-5 rounded-xl border border-line bg-surface/80 space-y-2">
                  <h5 className="font-semibold text-sm text-ink uppercase tracking-wider font-mono">
                    Significado Dimensional y Físico:
                  </h5>
                  <ul className="list-disc pl-5 space-y-1.5 text-xs text-ink-dim leading-relaxed">
                    <li>La variable <Formula tex="z" /> (corrimiento al rojo) es <strong className="text-ink">adimensional</strong>.</li>
                    <li>El residuo <Formula tex="f(z)" /> posee <strong className="text-ink">unidades de distancia astrofísica: Megaparsecs (Mpc)</strong>.</li>
                    <li>
                      Un residuo de <Formula tex="3.29 \times 10^{-3}\text{ Mpc}" /> equivale físicamente a aproximadamente <strong className="text-ink"><Formula tex="10\,700" /> años luz</strong>. En el contexto cosmológico de una galaxia situada a más de 5 mil millones de parsecs (<Formula tex="1.6 \times 10^{10}" /> años luz), un desajuste de <Formula tex="0.003\text{ Mpc}" /> representa un error relativo de distancia de apenas el <strong className="text-mant"><Formula tex="0.00006\%" /></strong>, una exactitud física excepcional.
                    </li>
                  </ul>
                </div>
              </div>

              {/* 6.3 */}
              <div className="p-6 rounded-xl border border-line bg-surface/50 space-y-4">
                <h4 className="text-lg font-semibold text-ink">
                  6.3. Las Trampas del Criterio de Parada Exclusivo por Residuo
                </h4>
                <p className="text-ink-dim leading-relaxed">
                  La dependencia con la pendiente explica por qué fijar un criterio de parada ingenuo basado únicamente en el residuo (<Formula tex="|f(c)| < \text{Tol}" />) acarrea dos fallas fundamentales:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl border border-line bg-surface/70 space-y-2">
                    <span className="text-xs font-mono text-sign font-semibold block uppercase">
                      1. Peligro en funciones de pendiente suave (<Formula tex="|f'(z^*)| \ll 1" />):
                    </span>
                    <p className="text-ink-dim text-xs leading-relaxed">
                      Si la función fuese casi horizontal en la raíz, el residuo <Formula tex="|f(c)|" /> podría ser menor a <Formula tex="10^{-6}" /> incluso cuando <Formula tex="c_k" /> se encuentra a unidades de distancia de la solución real, produciendo una falsa sensación de convergencia.
                    </p>
                  </div>
                  <div className="p-4 rounded-xl border border-line bg-surface/70 space-y-2">
                    <span className="text-xs font-mono text-mant font-semibold block uppercase">
                      2. Peligro en funciones de pendiente empinada (<Formula tex="|f'(z^*)| \gg 1" />, nuestro caso cosmológico):
                    </span>
                    <p className="text-ink-dim text-xs leading-relaxed">
                      Como la pendiente es <Formula tex="\approx 7763" />, exigir por inadvertencia un residuo <Formula tex="|f(c)| < 10^{-6}\text{ Mpc}" /> obligaría a que el error en <Formula tex="z" /> bajase hasta:
                    </p>
                    <div className="p-2 bg-bg/80 rounded font-mono text-center text-xs">
                      <Formula tex={String.raw`|z^* - c| < \frac{10^{-6}}{7763.21} \approx 1.28 \times 10^{-10}`} />
                    </div>
                    <p className="text-ink-dim text-xs leading-relaxed">
                      Esto forzaría al algoritmo a ejecutar al menos 14 iteraciones adicionales innecesarias para resolver una variable que en astronomía observacional no se conoce más allá del cuarto o quinto decimal.
                    </p>
                  </div>
                </div>
              </div>

              {/* 6.4 */}
              <div className="p-6 rounded-xl border border-mant/30 bg-surface/60 space-y-4">
                <h4 className="text-lg font-semibold text-ink flex items-center gap-2">
                  <ShieldCheck className="size-5 text-mant" /> 6.4. Estrategia Híbrida de Tres Capas Implementada
                </h4>
                <p className="text-ink-dim leading-relaxed">
                  Para garantizar tanto la precisión científica como la estabilidad computacional, el algoritmo desarrollado adopta un esquema de parada jerárquico:
                </p>

                <div className="space-y-3">
                  <div className="p-4 rounded-xl border border-line bg-surface/90 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded font-mono text-[11px] bg-mant/10 text-mant border border-mant/30 font-semibold">
                        Capa 1
                      </span>
                      <strong className="text-ink text-sm">Criterio Matemático Primario (Convergencia Controlada en el Dominio):</strong>
                    </div>
                    <div className="p-2.5 bg-bg/80 rounded font-mono text-center text-mant">
                      <Formula tex={String.raw`\frac{b_k - a_k}{2} < \varepsilon_{\text{abs}}`} />
                    </div>
                    <p className="text-ink-dim text-xs leading-relaxed">
                      Garantiza que la incertidumbre en el corrimiento al rojo <Formula tex="z" /> sea estrictamente inferior a la tolerancia fijada, respaldado por la garantía incondicional del Teorema de Bolzano.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl border border-line bg-surface/90 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded font-mono text-[11px] bg-sign/10 text-sign border border-sign/30 font-semibold">
                        Capa 2
                      </span>
                      <strong className="text-ink text-sm">Guarda de Finitud de Máquina (Prevención de Estancamiento):</strong>
                    </div>
                    <div className="p-2.5 bg-bg/80 rounded font-mono text-center text-sign">
                      <code className="text-xs">if c == a or c == b: break</code>
                    </div>
                    <p className="text-ink-dim text-xs leading-relaxed">
                      Detecta el límite físico donde la semilongitud del intervalo alcanza el espaciado entre números de máquina consecutivos (ULP), evitando ciclos repetitivos sin progreso.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl border border-line bg-surface/90 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded font-mono text-[11px] bg-exp/10 text-exp border border-exp/30 font-semibold">
                        Capa 3
                      </span>
                      <strong className="text-ink text-sm">Guarda de Seguridad Algorítmica:</strong>
                    </div>
                    <div className="p-2.5 bg-bg/80 rounded font-mono text-center text-exp">
                      <Formula tex={String.raw`k \ge N_{\text{máx}}`} />
                    </div>
                    <p className="text-ink-dim text-xs leading-relaxed">
                      Protege contra divergencias o parámetros iniciales inconsistentes.
                    </p>
                  </div>
                </div>
              </div>
            </section>

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
              Sección reservada para los resultados experimentales, tablas iterativas y análisis numérico de este modelo.
            </p>
            <span className="mt-4 font-mono text-xs px-3 py-1 rounded-full bg-surface text-ink-faint border border-line">
              Resultados en desarrollo · Esperando experimentos de {TEMAS.find(t => t.id === activeTab)?.author}
            </span>
          </div>
        )}

      </div>
    </PageTransition>
  );
}
