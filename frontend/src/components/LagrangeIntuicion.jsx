import Formula from "./Formula.jsx";
import { LagrangeHeader, LagrangeMath, LagrangeSection, LagrangeSources } from "./LagrangeShared.jsx";

export default function LagrangeIntuicion() {
  return <article className="space-y-8">
    <LagrangeHeader stage="Intuición inicial" title="Puntos de Lagrange: encontrar una posición de equilibrio">
      Se estudian los tres puntos colineales del sistema Sol–Tierra: L₁, L₂ y L₃. Cada uno ocupa una región distinta de la misma recta, y su posición se obtiene al aproximar la raíz de un polinomio de grado cinco.
    </LagrangeHeader>

    <blockquote className="rounded-xl border-l-4 border-sign bg-surface/60 p-5 text-ink leading-relaxed">
      ¿Cómo permiten bisección y Newton localizar los puntos de Lagrange, y qué cambia cuando la computadora usa 32 o 64 bits?
    </blockquote>

    <LagrangeSection title="1. Formulación del modelo físico">
      <p>Imagínese una nave de masa despreciable frente al Sol y la Tierra. Se supone que estos dos cuerpos describen órbitas circulares alrededor de su centro de masa. En un sistema de referencia que gira con ellos, un punto de Lagrange es una posición donde la nave puede permanecer en reposo relativo.</p>
      <p>El equilibrio combina gravedad y efecto centrífugo. <strong className="text-ink">No basta con igualar las dos atracciones gravitacionales.</strong> La velocidad relativa de equilibrio es cero, por lo que el término de Coriolis no interviene al localizar el punto.</p>
      <p>En estos puntos, la nave conserva su posición respecto del Sol y la Tierra mientras el conjunto gira. El reposo es relativo al sistema giratorio: la nave continúa moviéndose en el espacio.</p>
      <figure className="rounded-xl border border-line bg-surface/50 p-4">
        <svg viewBox="0 0 640 155" role="img" aria-label="Esquema sin escala: L3, Sol, L1, Tierra y L2, en ese orden" className="w-full">
          <line x1="35" y1="74" x2="605" y2="74" stroke="#8B5CF6" />
          <circle cx="230" cy="74" r="22" fill="#fbbf24" /><text x="230" y="125" textAnchor="middle" fill="#F5F3FF" fontSize="17">Sol</text>
          <circle cx="475" cy="74" r="11" fill="#2dd4bf" /><text x="475" y="125" textAnchor="middle" fill="#F5F3FF" fontSize="17">Tierra</text>
          {[{ x: 70, label: "L₃" }, { x: 412, label: "L₁" }, { x: 552, label: "L₂" }].map(({ x, label }) => <g key={label}>
            <circle cx={x} cy="74" r="6" fill="#f472b6" /><text x={x} y="48" textAnchor="middle" fill="#f472b6" fontSize="19">{label}</text>
          </g>)}
        </svg>
        <figcaption className="text-xs text-ink-dim">Esquema sin escala. L₄ y L₅ forman triángulos equiláteros con los dos cuerpos; su ubicación se obtiene geométricamente.</figcaption>
      </figure>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3" aria-label="Interpretación física de los tres puntos colineales">
        <section className="min-w-0 rounded-xl border border-sign/30 bg-sign/5 p-5 space-y-3">
          <p className="font-mono text-xs text-sign">Sol · L₁ · Tierra</p>
          <h4 className="font-semibold text-ink">L₁: entre el Sol y la Tierra</h4>
          <p>Está entre ambos cuerpos, cerca de la Tierra. La atracción terrestre se opone a la solar y reduce la atracción neta hacia el Sol. Así, la nave puede acompañar la rotación del sistema aun estando más cerca del Sol que la Tierra.</p>
          <p className="border-t border-sign/20 pt-3"><strong className="text-ink">Distancia buscada:</strong> desde la Tierra hacia el Sol.</p>
        </section>
        <section className="min-w-0 rounded-xl border border-mant/30 bg-mant/5 p-5 space-y-3">
          <p className="font-mono text-xs text-mant">Sol · Tierra · L₂</p>
          <h4 className="font-semibold text-ink">L₂: más allá de la Tierra</h4>
          <p>Está después de la Tierra, alejándose del Sol. Ambas atracciones gravitacionales apuntan hacia el interior del sistema. La contribución terrestre permite que la nave acompañe la misma rotación pese a encontrarse más lejos del Sol.</p>
          <p className="border-t border-mant/20 pt-3"><strong className="text-ink">Distancia buscada:</strong> desde la Tierra en dirección opuesta al Sol.</p>
        </section>
        <section className="min-w-0 rounded-xl border border-exp/30 bg-exp/5 p-5 space-y-3">
          <p className="font-mono text-xs text-exp">L₃ · Sol · Tierra</p>
          <h4 className="font-semibold text-ink">L₃: al otro lado del Sol</h4>
          <p>El Sol queda entre la nave y la Tierra. La atracción terrestre también interviene en el equilibrio, aunque la nave está lejos de la Tierra. Su posición queda aproximadamente a una separación Sol–Tierra del Sol, en el lado opuesto.</p>
          <p className="border-t border-exp/20 pt-3"><strong className="text-ink">Distancia buscada:</strong> desde el Sol en dirección opuesta a la Tierra.</p>
        </section>
      </div>
      <p className="text-xs">Interpretación del equilibrio en el modelo circular restringido: <a className="text-sign underline" href="https://science.nasa.gov/solar-system/resources/faq/what-are-lagrange-points/" target="_blank" rel="noreferrer">NASA</a> y <a className="text-sign underline" href="https://descanso.jpl.nasa.gov/monograph/series12/LunarTraj--08AppendixALocatingtheLagrangePoints.pdf" target="_blank" rel="noreferrer">JPL, apéndice A</a>.</p>
      <p>L₁, L₂ y L₃ son equilibrios dinámicamente inestables. Que el algoritmo converja a su posición no significa que una nave perturbada permanezca allí. Este experimento calcula posiciones del modelo; no simula ni diseña una misión espacial.</p>
    </LagrangeSection>

    <LagrangeSection title="2. De las fuerzas al polinomio quíntico">
      <p>Se adopta la separación entre los cuerpos como unidad de distancia y la masa total como unidad de masa:</p>
      <LagrangeMath tex={String.raw`\mu=\frac{m_{\mathrm T}}{m_{\mathrm S}+m_{\mathrm T}}\approx 3.00348\times10^{-6},\qquad R=149\,597\,870.7\ \mathrm{km}`} />
      <p>En estas unidades el Sol está en <Formula tex="x=-\mu" /> y la Tierra en <Formula tex="x=1-\mu" />. La ecuación del equilibrio sobre la recta es:</p>
      <LagrangeMath tex={String.raw`F(x)=x-\frac{(1-\mu)(x+\mu)}{|x+\mu|^3}-\frac{\mu(x-1+\mu)}{|x-1+\mu|^3}=0`} />
      <h4 className="font-semibold text-ink">L₁: distancia desde la Tierra hacia el Sol</h4>
      <p>Para L₁ se define <Formula tex="r=d/R" />, la distancia desde la Tierra hacia el Sol, con <Formula tex="0<r<1" /> y <Formula tex="x=1-\mu-r" />. Así:</p>
      <LagrangeMath tex={String.raw`F(1-\mu-r)=1-\mu-r-\frac{1-\mu}{(1-r)^2}+\frac{\mu}{r^2}=0`} />
      <p>Al multiplicar por <Formula tex="-r^2(1-r)^2" />, que no se anula dentro de ese intervalo, y agrupar potencias, se obtiene una forma del quíntico de Euler para L₁:</p>
      <LagrangeMath tex={String.raw`P_1(r)=r^5-(3-\mu)r^4+(3-2\mu)r^3-\mu r^2+2\mu r-\mu=0`} />
      <p>El polinomio evita divisiones por distancias casi nulas durante las iteraciones. La raíz se aproxima numéricamente y la distancia física se recupera con <Formula tex="d=Rr" />.</p>
      <div className="rounded-xl border border-line bg-surface/40 p-4 space-y-5">
        <section className="space-y-3">
          <h4 className="font-semibold text-ink">L₂: distancia desde la Tierra hacia afuera</h4>
          <p>Se define <Formula tex="r=d/R>0" />, donde <Formula tex="d" /> se mide desde la Tierra en dirección opuesta al Sol. La coordenada aumenta desde la posición terrestre: <Formula tex="x=1-\mu+r" />. Al sustituir en la ecuación de equilibrio y eliminar denominadores, se obtiene:</p>
          <LagrangeMath tex={String.raw`P_2(r)=r^5+(3-\mu)r^4+(3-2\mu)r^3-\mu r^2-2\mu r-\mu`} />
        </section>
        <section className="border-t border-line pt-5 space-y-3">
          <h4 className="font-semibold text-ink">L₃: distancia desde el Sol hacia el lado opuesto</h4>
          <p>También se utiliza <Formula tex="r=d/R>0" />, pero ahora <Formula tex="d" /> se mide <strong className="text-ink">desde el Sol</strong>, en dirección opuesta a la Tierra. La nave queda a la izquierda del Sol en el esquema: <Formula tex="x=-\mu-r" />. El polinomio correspondiente es:</p>
          <LagrangeMath tex={String.raw`P_3(r)=r^5+(2+\mu)r^4+(1+2\mu)r^3-(1-\mu)r^2-2(1-\mu)r-(1-\mu)`} />
        </section>
        <p className="border-t border-line pt-5">En cada caso se resuelve <Formula tex="P_i(r)=0" /> con bisección o Newton y se convierte la raíz en una distancia mediante <Formula tex="d=Rr" />. Los tres polinomios tienen cambio de signo en <Formula tex="[0,1]" /> para el parámetro adoptado. El procedimiento numérico es el mismo; cambian el polinomio y el origen desde el que se mide la distancia.</p>
      </div>
    </LagrangeSection>

    <LagrangeSection title="3. Existencia, unicidad y aproximación de la raíz">
      <p>Para L₁, <Formula tex="P_1(0)=-\mu<0" /> y <Formula tex="P_1(1)=1-\mu>0" />. Como el polinomio es continuo, Bolzano garantiza una raíz. Además, en cada región sin masas:</p>
      <LagrangeMath tex={String.raw`F'(x)=1+\frac{2(1-\mu)}{|x+\mu|^3}+\frac{2\mu}{|x-1+\mu|^3}>0`} />
      <p>La fuerza efectiva es estrictamente creciente en cada región y solo cruza cero una vez. Esto justifica la unicidad del equilibrio de cada rama.</p>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="min-w-0 rounded-xl border border-line bg-surface/50 p-5 space-y-3">
          <h4 className="font-semibold text-ink">Bisección</h4>
          <LagrangeMath tex={String.raw`c_k=a_k+\frac{b_k-a_k}{2}`} />
          <p>Se comparan los signos y se conserva la mitad que encierra la raíz. El primer punto medio tiene índice <Formula tex="k=1" />. En aritmética exacta (Kincaid y Cheney, §3.1):</p>
          <LagrangeMath tex={String.raw`|c_k-r^*|\le\frac{b_0-a_0}{2^k},\qquad N=\left\lceil\log_2\frac{b_0-a_0}{\tau}\right\rceil`} />
          <p>Con <Formula tex="[a_0,b_0]=[0,1]" /> y <Formula tex="\tau=10^{-10}" />, hacen falta como máximo 34 pasos para esa cota. El error observado puede subir entre dos pasos aunque la cota baje.</p>
        </div>
        <div className="min-w-0 rounded-xl border border-line bg-surface/50 p-5 space-y-3">
          <h4 className="font-semibold text-ink">Newton–Raphson</h4>
          <LagrangeMath tex={String.raw`r_{k+1}=r_k-\frac{P_i(r_k)}{P_i'(r_k)}`} />
          <p>La tangente propone una corrección. La derivada de L₁ se programa explícitamente y también se evalúa con Horner:</p>
          <LagrangeMath tex={String.raw`P_1'(r)=5r^4-4(3-\mu)r^3+3(3-2\mu)r^2-2\mu r+2\mu`} />
          <p>Cerca de una raíz simple tiene convergencia cuadrática: <Formula tex="e_{k+1}\approx C e_k^2" /> (Kincaid y Cheney, §3.2). No conserva un intervalo. Se ensayan distintas semillas; para L₁ y L₂ se utiliza por defecto <Formula tex="r_0=0.01" />, motivado por <Formula tex="r\approx(\mu/3)^{1/3}" />.</p>
        </div>
      </div>
      <p><strong className="text-ink">Relación con la secante y la iteración de punto fijo:</strong> la secante sustituye la derivada por una pendiente entre dos puntos y tiene orden local aproximado 1.618 bajo las hipótesis habituales. El experimento compara bisección y Newton. Newton también es una iteración de punto fijo de <Formula tex="g(r)=r-P(r)/P'(r)" />; en una raíz simple, <Formula tex="g'(r^*)=0" />, lo que explica su rapidez local. Esta propiedad no garantiza que <Formula tex="g" /> sea una contracción en todo el intervalo (Kincaid y Cheney, §§3.3–3.4).</p>
    </LagrangeSection>

    <LagrangeSection title="4. Qué cambia con IEEE 754">
      <div className="overflow-x-auto rounded-xl border border-line">
        <table className="w-full text-left text-xs sm:text-sm"><caption className="sr-only">Formatos IEEE 754 usados</caption>
          <thead className="bg-surface"><tr><th className="p-3">Formato</th><th className="p-3">Signo / exponente / fracción</th><th className="p-3">Precisión efectiva</th><th className="p-3">Épsilon: distancia desde 1 al siguiente número</th></tr></thead>
          <tbody><tr className="border-t border-line"><td className="p-3">binary32</td><td className="p-3">1 / 8 / 23 bits</td><td className="p-3">24 bits ≈ 7 dígitos</td><td className="p-3"><Formula tex="2^{-23}\approx1.19\times10^{-7}" /></td></tr>
            <tr className="border-t border-line"><td className="p-3">binary64</td><td className="p-3">1 / 11 / 52 bits</td><td className="p-3">53 bits ≈ 16 dígitos</td><td className="p-3"><Formula tex="2^{-52}\approx2.22\times10^{-16}" /></td></tr></tbody>
        </table>
      </div>
      <p>El bit inicial implícito explica los 24 y 53 bits efectivos. La unidad de redondeo es la mitad de ese épsilon. El espaciado local, ULP, depende del tamaño del número: cerca de <Formula tex="r\approx0.01" />, vale <Formula tex="2^{-30}" /> en binary32 y <Formula tex="2^{-59}" /> en binary64. Por eso el límite no aparece universalmente en la iteración 24 o 53.</p>
      <ul className="list-disc pl-5 space-y-2">
        <li><strong className="text-ink">En JavaScript:</strong> <code>Number</code> usa binary64; para binary32 se aplica <code>Math.fround</code> a los datos, los coeficientes y cada suma, resta, multiplicación o división del método. No basta con redondear la respuesta final.</li>
        <li><strong className="text-ink">Horner y normalización:</strong> se utiliza una distancia adimensional y el polinomio se evalúa por multiplicaciones y sumas anidadas. Esto reduce el número de operaciones, aunque persiste la cancelación cerca de la raíz.</li>
        <li><strong className="text-ink">Paradas separadas:</strong> tolerancia, punto medio igual a un extremo, paso de Newton que ya no cambia, ciclos, derivada nula, salida de región y máximo de 100 pasos.</li>
        <li><strong className="text-ink">Signos y residuo:</strong> se comparan signos sin multiplicar residuos. Si el residuo se redondea a cero, se registra esa condición como motivo de parada; no constituye una prueba de solución exacta.</li>
      </ul>
    </LagrangeSection>
    <LagrangeSources />
  </article>;
}
