// frontend/src/lib/wienSolver.js

/**
 * Constantes Físicas Fundamentales (CODATA)
 */
export const CONSTANTS = {
  h: 6.62607015e-34,      // Constante de Planck (J·s)
  c: 299792458,           // Velocidad de la luz en el vacío (m/s)
  kB: 1.380649e-23,       // Constante de Boltzmann (J/K)
  X_STAR: 4.965114231744276303, // Raíz exacta de referencia en float64
  LN5: Math.log(5),       // Punto crítico f'(x) = 0 -> x ≈ 1.6094379124341003
};

/**
 * Forzador de aritmética de punto flotante IEEE 754
 * @param {number} val - Número a redondear
 * @param {'float32' | 'float64'} precision - Formato numérico
 */
export function fl(val, precision = "float64") {
  return precision === "float32" ? Math.fround(val) : Number(val);
}

/**
 * Función residual de Wien: f(x) = x + 5e^{-x} - 5
 */
export function fWien(x, precision = "float64") {
  const xf = fl(x, precision);
  const expTerm = fl(Math.exp(fl(-xf, precision)), precision);
  const fiveExp = fl(fl(5, precision) * expTerm, precision);
  const sum = fl(xf + fiveExp, precision);
  return fl(sum - fl(5, precision), precision);
}

/**
 * Primera derivada de la función de Wien: f'(x) = 1 - 5e^{-x}
 */
export function dfWien(x, precision = "float64") {
  const xf = fl(x, precision);
  const expTerm = fl(Math.exp(fl(-xf, precision)), precision);
  const fiveExp = fl(fl(5, precision) * expTerm, precision);
  return fl(fl(1, precision) - fiveExp, precision);
}

/**
 * Funciones de iteración de Punto Fijo:
 * g1(x) = 5(1 - e^{-x}) -> Contracción estable en [4, 6] (|g1'(x*)| ≈ 0.0348 < 1)
 * g2(x) = -ln(1 - x/5)  -> Despeje logarítmico divergente cerca de x* (|g2'(x*)| ≈ 28.7 > 1)
 */
export function g1Wien(x, precision = "float64") {
  const xf = fl(x, precision);
  const expTerm = fl(Math.exp(fl(-xf, precision)), precision);
  const fiveExp = fl(fl(5, precision) * expTerm, precision);
  return fl(fl(5, precision) - fiveExp, precision);
}

export function g2Wien(x, precision = "float64") {
  const xf = fl(x, precision);
  const arg = fl(1 - xf / 5, precision);
  if (arg <= 0) return NaN;
  return fl(-Math.log(arg), precision);
}

/**
 * Calcula el orden de convergencia empírico p_k = ln(e_k / e_{k-1}) / ln(e_{k-1} / e_{k-2})
 */
function appendEmpiricalOrder(steps) {
  return steps.map((step, idx) => {
    if (idx < 2) return { ...step, pEmpirical: null };
    const e_k = step.trueError;
    const e_k1 = steps[idx - 1].trueError;
    const e_k2 = steps[idx - 2].trueError;
    if (e_k <= 1e-16 || e_k1 <= 1e-16 || e_k2 <= 1e-16) {
      return { ...step, pEmpirical: null };
    }
    const num = Math.log(e_k / e_k1);
    const den = Math.log(e_k1 / e_k2);
    const p = Math.abs(den) > 1e-12 ? num / den : null;
    return {
      ...step,
      pEmpirical: p && p > 0 && p < 6 ? p : null,
    };
  });
}

/**
 * 1. Método de Bisección Robusta con Guarda de 3 Capas
 */
export function solveBisection({
  a = 4.0,
  b = 6.0,
  tol = 1e-7,
  maxIter = 60,
  precision = "float64",
}) {
  let low = fl(a, precision);
  let high = fl(b, precision);
  let fLow = fWien(low, precision);
  let fHigh = fWien(high, precision);

  if (Math.sign(fLow) === Math.sign(fHigh)) {
    return {
      steps: [],
      status: "error_bolzano",
      message: "El intervalo inicial no cumple el cambio de signo de Bolzano f(a)·f(b) < 0.",
    };
  }

  const steps = [];
  let status = "max_iter_alcanzado";
  let prevError = null;

  for (let k = 1; k <= maxIter; k++) {
    const halfSpan = fl(fl(high - low, precision) / fl(2.0, precision), precision);
    const mid = fl(low + halfSpan, precision);
    const fMid = fWien(mid, precision);
    const cota = Math.abs(halfSpan);
    const trueError = Math.abs(CONSTANTS.X_STAR - mid);

    let highlight = null;
    if (prevError !== null) {
      if (trueError < prevError * 0.15) highlight = "valle";
      else if (trueError > prevError * 2.5) highlight = "rebote";
    }
    prevError = trueError;

    // Capa 2: Guarda de estancamiento IEEE 754 (ULP alcanzado)
    const stagnated = mid === low || mid === high;

    steps.push({
      k,
      a: low,
      b: high,
      x: mid,
      fx: fMid,
      stepError: cota,
      trueError,
      highlight: stagnated ? "estancamiento" : highlight,
    });

    if (stagnated) {
      status = "estancamiento_maquina";
      break;
    }

    // Capa 1: Criterio de parada en el dominio
    if (cota < tol) {
      status = "tolerancia_alcanzada";
      steps[steps.length - 1].highlight = "convergencia";
      break;
    }

    if (Math.sign(fLow) !== Math.sign(fMid)) {
      high = mid;
      fHigh = fMid;
    } else {
      low = mid;
      fLow = fMid;
    }
  }

  return {
    steps: appendEmpiricalOrder(steps),
    status,
    root: steps.length > 0 ? steps[steps.length - 1].x : null,
  };
}

/**
 * 2. Método de Newton-Raphson con detección de singularidad en x = ln(5)
 */
export function solveNewton({
  x0 = 4.5,
  tol = 1e-12,
  maxIter = 30,
  precision = "float64",
}) {
  let xk = fl(x0, precision);
  const steps = [];
  let status = "max_iter_alcanzado";

  for (let k = 1; k <= maxIter; k++) {
    const fx = fWien(xk, precision);
    const dfx = dfWien(xk, precision);

    if (Math.abs(dfx) < 1e-12) {
      status = "singularidad_derivada";
      steps.push({
        k,
        xPrev: xk,
        x: xk,
        fx,
        dfx,
        stepError: Infinity,
        trueError: Math.abs(CONSTANTS.X_STAR - xk),
        highlight: "rebote",
      });
      break;
    }

    const ratio = fl(fx / dfx, precision);
    const xNext = fl(xk - ratio, precision);
    const fNext = fWien(xNext, precision);
    const stepError = Math.abs(xNext - xk);
    const trueError = Math.abs(CONSTANTS.X_STAR - xNext);

    const stagnated = xNext === xk && stepError === 0;

    steps.push({
      k,
      xPrev: xk,
      x: xNext,
      fx: fNext,
      dfx,
      stepError,
      trueError,
      highlight: stagnated
        ? "estancamiento"
        : stepError < tol
        ? "convergencia"
        : xNext < 0
        ? "rebote"
        : null,
    });

    if ( !Number.isFinite(xNext) || Math.abs(xNext) > 1e6 ) {
      status = "divergencia_numerica";
      break;
    }

    if (stepError < tol) {
      status = "tolerancia_alcanzada";
      break;
    }

    if (stagnated) {
      status = "estancamiento_maquina";
      break;
    }

    xk = xNext;
  }

  return {
    steps: appendEmpiricalOrder(steps),
    status,
    root: steps.length > 0 ? steps[steps.length - 1].x : null,
  };
}

/**
 * 3. Método de Iteración de Punto Fijo
 */
export function solveFixedPoint({
  x0 = 4.0,
  tol = 1e-12,
  maxIter = 40,
  precision = "float64",
  variant = "g1", // 'g1' convergente | 'g2' divergente
}) {
  let xk = fl(x0, precision);
  const steps = [];
  let status = "max_iter_alcanzado";
  const gFunc = variant === "g2" ? g2Wien : g1Wien;

  for (let k = 1; k <= maxIter; k++) {
    const xNext = gFunc(xk, precision);

    if (!Number.isFinite(xNext)) {
      status = "fuera_de_dominio";
      break;
    }

    const fx = fWien(xNext, precision);
    const stepError = Math.abs(xNext - xk);
    const trueError = Math.abs(CONSTANTS.X_STAR - xNext);
    const stagnated = xNext === xk;

    steps.push({
      k,
      xPrev: xk,
      x: xNext,
      fx,
      stepError,
      trueError,
      highlight: stagnated
        ? "estancamiento"
        : stepError < tol
        ? "convergencia"
        : null,
    });

    if (stepError < tol) {
      status = "tolerancia_alcanzada";
      break;
    }

    if (stagnated) {
      status = "estancamiento_maquina";
      break;
    }

    xk = xNext;
  }

  return {
    steps: appendEmpiricalOrder(steps),
    status,
    root: steps.length > 0 ? steps[steps.length - 1].x : null,
  };
}

/**
 * 4. Método de la Secante (Orden Superlineal φ ≈ 1.618)
 */
export function solveSecant({
  x0 = 4.0,
  x1 = 6.0,
  tol = 1e-12,
  maxIter = 30,
  precision = "float64",
}) {
  let xPrev = fl(x0, precision);
  let xCurr = fl(x1, precision);
  const steps = [];
  let status = "max_iter_alcanzado";

  for (let k = 1; k <= maxIter; k++) {
    const fPrev = fWien(xPrev, precision);
    const fCurr = fWien(xCurr, precision);
    const denom = fl(fCurr - fPrev, precision);

    if (Math.abs(denom) < 1e-15) {
      status = "estancamiento_maquina";
      break;
    }

    const num = fl(fCurr * fl(xCurr - xPrev, precision), precision);
    const xNext = fl(xCurr - fl(num / denom, precision), precision);
    const fNext = fWien(xNext, precision);
    const stepError = Math.abs(xNext - xCurr);
    const trueError = Math.abs(CONSTANTS.X_STAR - xNext);

    steps.push({
      k,
      xPrev: xCurr,
      x: xNext,
      fx: fNext,
      stepError,
      trueError,
      highlight: stepError < tol ? "convergencia" : null,
    });

    if (stepError < tol) {
      status = "tolerancia_alcanzada";
      break;
    }

    xPrev = xCurr;
    xCurr = xNext;
  }

  return {
    steps: appendEmpiricalOrder(steps),
    status,
    root: steps.length > 0 ? steps[steps.length - 1].x : null,
  };
}

/**
 * Cálculos Astrofísicos a partir de la raíz adimensional x*
 */
export function computeAstrophysics(xRoot = CONSTANTS.X_STAR) {
  const bConstant = (CONSTANTS.h * CONSTANTS.c) / (CONSTANTS.kB * xRoot); // m·K
  return {
    xRoot,
    bMetersKelvin: bConstant,
    bMillimetersKelvin: bConstant * 1e3,
    estimateTempFromNm: (lambdaNm) => bConstant / (lambdaNm * 1e-9),
    estimatePeakNmFromTemp: (tempK) => (bConstant / tempK) * 1e9,
  };
}

/**
 * Catálogo Estelar Real para el Simulador Astrofísico
 */
export const STELLAR_CATALOG = [
  {
    id: "rigel",
    name: "Rigel (β Orionis)",
    spectralType: "B8 Ia · Supergigante Azul",
    lambdaPeakNm: 240,
    realTempK: 12100,
    colorHex: "#60a5fa",
    band: "Ultravioleta Cercano (UV)",
  },
  {
    id: "sirius",
    name: "Sirio A (α Canis Majoris)",
    spectralType: "A1V · Estrella Blanca",
    lambdaPeakNm: 291,
    realTempK: 9940,
    colorHex: "#e0f2fe",
    band: "Ultravioleta / Violeta",
  },
  {
    id: "sun",
    name: "El Sol (G2V)",
    spectralType: "Enana Amarilla Principal",
    lambdaPeakNm: 501.5,
    realTempK: 5778,
    colorHex: "#fde047",
    band: "Óptico (Verde-Amarillo)",
  },
  {
    id: "betelgeuse",
    name: "Betelgeuse (α Orionis)",
    spectralType: "M1-M2 Ia · Supergigante Roja",
    lambdaPeakNm: 828,
    realTempK: 3500,
    colorHex: "#f87171",
    band: "Infrarrojo Cercano (NIR)",
  },
  {
    id: "cmb",
    name: "Fondo Cósmico de Microondas",
    spectralType: "Reliquia del Big Bang (z ≈ 1100)",
    lambdaPeakNm: 1063000, // 1.063 mm
    realTempK: 2.7255,
    colorHex: "#c084fc",
    band: "Microondas",
  },
];
