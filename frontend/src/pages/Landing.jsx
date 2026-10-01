import PageTransition from "../components/PageTransition.jsx";

export default function Landing() {
  return (
    <PageTransition className="mx-auto max-w-5xl py-16 px-6">
      <div id="inicio" className="flex flex-col items-center text-center">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-display text-transparent bg-clip-text bg-gradient-to-r from-mant via-exp to-sign">
          Astronomía Computacional
        </h1>
        <p className="mt-6 text-lg sm:text-xl text-ink-dim max-w-3xl leading-relaxed">
          Bienvenido al proyecto de Análisis Numérico. Aquí exploraremos diversos modelos astronómicos
          (Ecuación de Kepler, Puntos de Lagrange, Ley de Wien y Corrimiento al rojo) aplicando 
          métodos numéricos iterativos para encontrar soluciones de alta precisión.
        </p>
      </div>
    </PageTransition>
  );
}
