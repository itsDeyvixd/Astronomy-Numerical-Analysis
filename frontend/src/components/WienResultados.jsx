// frontend/src/components/WienResultados.jsx
import { useState } from "react";
import Formula from "./Formula.jsx";
import { WIEN_EXPERIMENT_DATA } from "../lib/wienData.js";
import {
  Table,
  Code2,
  Download,
  Copy,
  Check,
  Terminal,
  ShieldCheck,
} from "lucide-react";

export default function WienResultados() {
  const [selectedTable, setSelectedTable] = useState("biseccion");
  const [showCode, setShowCode] = useState(false);
  const [copied, setCopied] = useState(false);

  // Si el archivo wienData.js no tiene datos aún
  if (!WIEN_EXPERIMENT_DATA) {
    return (
      <div className="p-8 rounded-2xl border border-exp/40 bg-surface/80 space-y-4 font-mono text-xs">
        <div className="flex items-center gap-2 text-exp font-bold text-sm">
          <Terminal className="size-5" /> Datos de experimentos pendientes
        </div>
        <p className="text-ink-dim leading-relaxed font-sans text-sm">
          Ejecuta en tu terminal dentro de la carpeta <code>frontend</code> para generar los datos reales:
        </p>
        <pre className="p-4 rounded-xl bg-bg border border-line text-mant">
          python generar_resultados_wien.py
        </pre>
      </div>
    );
  }

  const {
    meta,
    biseccionTol1e6,
    newtonOptimo,
    secanteTraza,
    puntoFijoTraza,
    sensibilidadNewton,
    precisionComparativa,
    pythonSource,
  } = WIEN_EXPERIMENT_DATA;

  const handleDownloadPython = () => {
    const blob = new Blob([pythonSource], { type: "text/x-python;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "generar_resultados_wien.py";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleCopyPython = () => {
    navigator.clipboard.writeText(pythonSource);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <article className="space-y-12 animate-in fade-in duration-300">
      {/* Encabezado */}
      <header className="p-6 rounded-2xl border border-exp/30 bg-surface/80 relative overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-exp font-semibold">
              Informe de Resultados Experimentales · Juan Huertas
            </span>
            <h2 className="text-2xl font-bold font-display text-ink mt-1">
              Determinación Numérica de la Constante de Wien (<Formula tex="x + 5e^{-x} - 5 = 0" />)
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setShowCode(!showCode)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-line bg-surface hover:bg-surface-2 text-ink-dim hover:text-ink text-xs font-mono transition-colors"
            >
              <Code2 className="size-4 text-exp" />
              <span>{showCode ? "Ocultar Código Python" : "Ver Código Python"}</span>
            </button>
            <button
              onClick={handleDownloadPython}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-exp/40 bg-exp/15 hover:bg-exp/25 text-exp text-xs font-mono font-semibold transition-colors"
            >
              <Download className="size-4" />
              <span>Descargar Script .py</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono pt-4 border-t border-line/60">
          <div>
            <span className="text-ink-faint block">Raíz Calculada (<Formula tex="x^*" />):</span>
            <span className="text-mant font-semibold">{meta.xStar}</span>
          </div>
          <div>
            <span className="text-ink-faint block">Constante de Wien (<Formula tex="b" />):</span>
            <span className="text-exp font-semibold">{meta.bWien} m·K</span>
          </div>
          <div>
            <span className="text-ink-faint block">Singularidad <Formula tex="f'(x_c)=0" />:</span>
            <span className="text-sign font-semibold">ln(5) ≈ {meta.ln5}</span>
          </div>
          <div>
            <span className="text-ink-faint block">Motor de Cálculo:</span>
            <span className="text-ink font-semibold">Python + NumPy (IEEE 754)</span>
          </div>
        </div>
      </header>

      {/* Visor de Código Python */}
      {showCode && (
        <section className="p-5 rounded-xl border border-line bg-surface/90 space-y-3 font-mono text-xs">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-line">
            <span className="text-exp font-semibold flex items-center gap-2">
              <Code2 className="size-4" /> generar_resultados_wien.py
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyPython}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded border border-line bg-bg hover:bg-surface-2 text-ink-dim hover:text-ink transition-colors"
              >
                {copied ? <Check className="size-3.5 text-mant" /> : <Copy className="size-3.5" />}
                <span>{copied ? "¡Copiado!" : "Copiar código"}</span>
              </button>
              <button
                onClick={handleDownloadPython}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded border border-exp/40 bg-exp/10 text-exp hover:bg-exp/20 transition-colors"
              >
                <Download className="size-3.5" />
                <span>Descargar .py</span>
              </button>
            </div>
          </div>
          <pre className="overflow-x-auto text-ink-dim leading-relaxed p-3 bg-bg/80 rounded-lg max-h-[420px]">
            {pythonSource}
          </pre>
        </section>
      )}

      {/* SECCIÓN 1: Trazas Paso a Paso */}
      <section className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-xl font-display font-semibold text-ink flex items-center gap-2">
            <Table className="size-5 text-exp" /> 1. Trazas Iterativas Generadas en Python
          </h3>
          <div className="flex flex-wrap gap-2">
            {[
              { id: "biseccion", label: `Bisección (${biseccionTol1e6.length} pasos)` },
              { id: "newton", label: `Newton-Raphson (${newtonOptimo.length - 1} pasos)` },
              { id: "secante", label: `Secante (${secanteTraza.length} pasos)` },
              { id: "punto_fijo", label: `Punto Fijo g₁(x) (${puntoFijoTraza.length} pasos)` },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedTable(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono border transition-all ${
                  selectedTable === tab.id
                    ? "border-exp bg-exp/15 text-ink font-semibold"
                    : "border-line bg-surface/60 text-ink-dim hover:text-ink"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tabla Bisección */}
        {selectedTable === "biseccion" && (
          <div className="overflow-x-auto rounded-xl border border-line bg-surface/60 shadow-inner">
            <table className="w-full text-xs font-mono text-left border-collapse">
              <thead>
                <tr className="border-b border-line bg-surface-2/80 text-ink">
                  <th className="py-3 px-3 text-center">k</th>
                  <th className="py-3 px-3"><Formula tex="a_k" /></th>
                  <th className="py-3 px-3"><Formula tex="b_k" /></th>
                  <th className="py-3 px-3 text-mant"><Formula tex="c_k" /></th>
                  <th className="py-3 px-3"><Formula tex="f(c_k)" /></th>
                  <th className="py-3 px-3">Cota <Formula tex="(b_k-a_k)/2" /></th>
                  <th className="py-3 px-3 text-exp">Error Real <Formula tex="|x^* - c_k|" /></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line/40">
                {biseccionTol1e6.map((row) => (
                  <tr key={row.k} className="hover:bg-surface/80">
                    <td className="py-2 px-3 text-center text-ink-faint">{row.k}</td>
                    <td className="py-2 px-3 text-ink-dim">{row.a}</td>
                    <td className="py-2 px-3 text-ink-dim">{row.b}</td>
                    <td className="py-2 px-3 text-mant">{row.c}</td>
                    <td className="py-2 px-3 text-ink-dim">{row.f}</td>
                    <td className="py-2 px-3 text-ink-faint">{row.cota}</td>
                    <td className="py-2 px-3 text-exp">{row.error}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tabla Newton */}
        {selectedTable === "newton" && (
          <div className="overflow-x-auto rounded-xl border border-line bg-surface/60 shadow-inner">
            <table className="w-full text-xs font-mono text-left border-collapse">
              <thead>
                <tr className="border-b border-line bg-surface-2/80 text-ink">
                  <th className="py-3 px-3 text-center">k</th>
                  <th className="py-3 px-3 text-mant"><Formula tex="x_k" /></th>
                  <th className="py-3 px-3"><Formula tex="f(x_k)" /></th>
                  <th className="py-3 px-3"><Formula tex="f'(x_k)" /></th>
                  <th className="py-3 px-3">Paso <Formula tex="|x_k - x_{k-1}|" /></th>
                  <th className="py-3 px-3 text-exp">Error Real <Formula tex="|x^* - x_k|" /></th>
                  <th className="py-3 px-3 text-center">Orden <Formula tex="p_k" /></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line/40">
                {newtonOptimo.map((row) => (
                  <tr key={row.k} className="hover:bg-surface/80">
                    <td className="py-2.5 px-3 text-center text-ink-faint">{row.k}</td>
                    <td className="py-2.5 px-3 text-mant">{row.x}</td>
                    <td className="py-2.5 px-3 text-ink-dim">{row.fx}</td>
                    <td className="py-2.5 px-3 text-ink-faint">{row.dfx}</td>
                    <td className="py-2.5 px-3 text-ink-dim">{row.step}</td>
                    <td className="py-2.5 px-3 text-exp">{row.error}</td>
                    <td className="py-2.5 px-3 text-center text-mant font-bold">{row.p}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tabla Secante y Punto Fijo */}
        {(selectedTable === "secante" || selectedTable === "punto_fijo") && (
          <div className="overflow-x-auto rounded-xl border border-line bg-surface/60 shadow-inner">
            <table className="w-full text-xs font-mono text-left border-collapse">
              <thead>
                <tr className="border-b border-line bg-surface-2/80 text-ink">
                  <th className="py-3 px-3 text-center">k</th>
                  <th className="py-3 px-3 text-mant"><Formula tex="x_k" /></th>
                  <th className="py-3 px-3"><Formula tex="f(x_k)" /></th>
                  <th className="py-3 px-3">Paso <Formula tex="|x_k - x_{k-1}|" /></th>
                  <th className="py-3 px-3 text-exp">Error Real <Formula tex="|x^* - x_k|" /></th>
                  <th className="py-3 px-3 text-center">Orden <Formula tex="p_k" /></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line/40">
                {(selectedTable === "secante" ? secanteTraza : puntoFijoTraza).map((row) => (
                  <tr key={row.k} className="hover:bg-surface/80">
                    <td className="py-2.5 px-3 text-center text-ink-faint">{row.k}</td>
                    <td className="py-2.5 px-3 text-mant">{row.x}</td>
                    <td className="py-2.5 px-3 text-ink-dim">{row.fx}</td>
                    <td className="py-2.5 px-3 text-ink-dim">{row.step}</td>
                    <td className="py-2.5 px-3 text-exp">{row.error}</td>
                    <td className="py-2.5 px-3 text-center text-mant font-bold">{row.p}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* SECCIÓN 2: Sensibilidad Newton */}
      <section className="space-y-4">
        <h3 className="text-xl font-display font-semibold text-ink">
          2. Experimento de Sensibilidad al Dato Inicial (<Formula tex="x_c = \ln(5)" />)
        </h3>
        <div className="overflow-x-auto rounded-xl border border-line bg-surface/70">
          <table className="w-full text-xs font-mono text-left border-collapse">
            <thead>
              <tr className="border-b border-line bg-surface-2 text-ink">
                <th className="py-3 px-4">Semilla <Formula tex="x_0" /></th>
                <th className="py-3 px-4">Derivada <Formula tex="f'(x_0)" /></th>
                <th className="py-3 px-4">Primer Salto <Formula tex="x_1" /></th>
                <th className="py-3 px-4">Iteraciones</th>
                <th className="py-3 px-4">Raíz Alcanzada</th>
                <th className="py-3 px-4">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line/40 text-ink-dim">
              {sensibilidadNewton.map((item, idx) => (
                <tr key={idx} className="hover:bg-surface/80">
                  <td className="py-2.5 px-4 font-bold text-ink">{item.x0}</td>
                  <td className="py-2.5 px-4">{item.dfx0}</td>
                  <td className="py-2.5 px-4 text-exp">{item.x1}</td>
                  <td className="py-2.5 px-4">{item.iteraciones}</td>
                  <td className="py-2.5 px-4 text-mant font-semibold">{item.raizFinal}</td>
                  <td className="py-2.5 px-4">{item.motivo}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* SECCIÓN 3: Float32 vs Float64 */}
      <section className="space-y-4">
        <h3 className="text-xl font-display font-semibold text-ink flex items-center gap-2">
          <ShieldCheck className="size-5 text-exp" /> 3. Comparación IEEE 754: <code>np.float32</code> vs <code>np.float64</code>
        </h3>
        <div className="overflow-x-auto rounded-xl border border-line bg-surface/70">
          <table className="w-full text-xs font-mono text-left border-collapse">
            <thead>
              <tr className="border-b border-line bg-surface-2 text-ink">
                <th className="py-3 px-4">Métrica Computacional</th>
                <th className="py-3 px-4 text-sign">Precisión Simple (<code>np.float32</code>)</th>
                <th className="py-3 px-4 text-mant">Precisión Doble (<code>np.float64</code>)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line/40 text-ink-dim">
              <tr>
                <td className="py-2.5 px-4 font-semibold text-ink">Iteraciones hasta Estancamiento</td>
                <td className="py-2.5 px-4 text-sign font-bold">{precisionComparativa.float32.iteraciones}</td>
                <td className="py-2.5 px-4 text-mant font-bold">{precisionComparativa.float64.iteraciones}</td>
              </tr>
              <tr>
                <td className="py-2.5 px-4 font-semibold text-ink">Motivo de Parada</td>
                <td className="py-2.5 px-4">{precisionComparativa.float32.motivo}</td>
                <td className="py-2.5 px-4">{precisionComparativa.float64.motivo}</td>
              </tr>
              <tr>
                <td className="py-2.5 px-4 font-semibold text-ink">Raíz Final Computada</td>
                <td className="py-2.5 px-4">{precisionComparativa.float32.raiz}</td>
                <td className="py-2.5 px-4 text-mant">{precisionComparativa.float64.raiz}</td>
              </tr>
              <tr>
                <td className="py-2.5 px-4 font-semibold text-ink">Error Real Final <Formula tex="|x^* - c_k|" /></td>
                <td className="py-2.5 px-4 text-sign">{precisionComparativa.float32.errorFinal}</td>
                <td className="py-2.5 px-4 text-mant">{precisionComparativa.float64.errorFinal}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </article>
  );
}
