/** Métodos de clase para los puntos colineales del modelo circular restringido.
 * Binary32 se emula redondeando CADA operación básica; binary64 usa Number.
 * No hay FMA ni librerías de búsqueda de raíces. El análisis de error usa
 * una referencia independiente calculada con Decimal a 80 dígitos.
 */
const MU_TEXT = "0.0000030034805945421925";
export const LAGRANGE_MODEL = Object.freeze({
  muText: MU_TEXT,
  mu: Number(MU_TEXT),
  distanceKm: 149597870.7,
  gmSun: "132712440041.279419",
  gmEarth: "398600.435507",
});

export const POINTS = {
  L1: { name: "L₁ · entre el Sol y la Tierra", origin: "la Tierra", seed: 0.01 },
  L2: { name: "L₂ · más allá de la Tierra", origin: "la Tierra", seed: 0.01 },
  L3: { name: "L₃ · al otro lado del Sol", origin: "el Sol", seed: 0.99 },
};

export const STATUS_LABELS = {
  tolerancia: "Tolerancia alcanzada",
  estancamiento: "Estancamiento: el número ya no cambia",
  residuo_cero: "Residuo redondeado a cero",
  ciclo: "Ciclo entre dos números de máquina",
  fuera_dominio: "El paso salió de la región del punto",
  derivada_nula: "Derivada nula en máquina",
  no_finito: "Resultado no finito",
  max_iter: "Máximo de iteraciones",
  intervalo_invalido: "Intervalo sin cambio de signo",
};

const rounder = (precision) => precision === "float32" ? Math.fround : Number;

export function coefficients(point = "L1", precision = "float64") {
  const fl = rounder(precision);
  const mu = fl(LAGRANGE_MODEL.mu);
  const oneMinusMu = fl(1 - mu);
  if (point === "L1") return [1, fl(mu - 3), fl(3 - fl(2 * mu)), fl(-mu), fl(2 * mu), fl(-mu)];
  if (point === "L2") return [1, fl(3 - mu), fl(3 - fl(2 * mu)), fl(-mu), fl(-fl(2 * mu)), fl(-mu)];
  if (point === "L3") return [1, fl(2 + mu), fl(1 + fl(2 * mu)), fl(-oneMinusMu), fl(-fl(2 * oneMinusMu)), fl(-oneMinusMu)];
  throw new Error(`Punto desconocido: ${point}`);
}

/** Horner: cinco multiplicaciones y cinco sumas para el polinomio quíntico. */
export function evaluatePolynomial(r, point = "L1", precision = "float64", derivative = false) {
  const fl = rounder(precision);
  const x = fl(r);
  let c = coefficients(point, precision);
  if (derivative) c = c.slice(0, -1).map((a, i) => fl(a * (5 - i)));
  return c.slice(1).reduce((acc, a) => fl(fl(acc * x) + a), c[0]);
}

/** Residuo relativo a la escala del polinomio, no una cota de error en r. */
function scaledResidual(x, fx, point) {
  const scale = coefficients(point).reduce((s, a) => s * Math.abs(x) + Math.abs(a), 0);
  return Math.abs(fx) / scale;
}

function finish(steps, status, evaluations, derivativeEvaluations = 0) {
  return { steps, status, evaluations, derivativeEvaluations, root: steps.at(-1)?.x ?? null };
}

export function solveLagrangeBisection({ point = "L1", precision = "float64", tol = 1e-10, maxIter = 100, a = 0, b = 1 } = {}) {
  const fl = rounder(precision);
  let low = fl(a), high = fl(b);
  let fa = evaluatePolynomial(low, point, precision);
  const fb = evaluatePolynomial(high, point, precision);
  const steps = [];
  let evaluations = 2;
  if (!(low < high) || !Number.isFinite(fa + fb) || fa === 0 || fb === 0 || Math.sign(fa) === Math.sign(fb)) {
    return finish(steps, "intervalo_invalido", evaluations);
  }
  for (let k = 1; k <= maxIter; k++) {
    const half = fl(fl(high - low) / 2);
    const x = fl(low + half);
    const fx = evaluatePolynomial(x, point, precision);
    evaluations++;
    // Max distancia a los extremos: incluye el redondeo del punto medio.
    const bound = Math.max(x - low, high - x);
    steps.push({ k, a: low, b: high, x, fx, bound, step: half });
    if (x === low || x === high) return finish(steps, "estancamiento", evaluations);
    if (bound <= tol) return finish(steps, "tolerancia", evaluations);
    // P_fl(x)=0 no demuestra que x sea una raíz exacta del polinomio real.
    if (fx === 0) return finish(steps, "residuo_cero", evaluations);
    if (Math.sign(fa) !== Math.sign(fx)) high = x;
    else { low = x; fa = fx; }
  }
  return finish(steps, "max_iter", evaluations);
}

export function solveLagrangeNewton({ point = "L1", precision = "float64", tol = 1e-10, maxIter = 100, x0 = POINTS[point].seed } = {}) {
  const fl = rounder(precision);
  let x = fl(x0);
  let fx = evaluatePolynomial(x, point, precision);
  const steps = [{ k: 0, x, fx, step: null, derivative: null }];
  let evaluations = 1, derivativeEvaluations = 0, previous = null;
  const inDomain = (value) => value > 0 && (point !== "L1" || value < 1);
  if (!inDomain(x)) return finish(steps, "fuera_dominio", evaluations);
  for (let k = 1; k <= maxIter; k++) {
    const derivative = evaluatePolynomial(x, point, precision, true);
    derivativeEvaluations++;
    if (derivative === 0) return finish(steps, "derivada_nula", evaluations, derivativeEvaluations);
    const next = fl(x - fl(fx / derivative));
    if (!Number.isFinite(next)) return finish(steps, "no_finito", evaluations, derivativeEvaluations);
    const nextF = evaluatePolynomial(next, point, precision);
    evaluations++;
    const step = Math.abs(next - x);
    steps.push({ k, x: next, fx: nextF, step, derivative });
    if (!inDomain(next)) return finish(steps, "fuera_dominio", evaluations, derivativeEvaluations);
    if (next === x) return finish(steps, "estancamiento", evaluations, derivativeEvaluations);
    if (next === previous) return finish(steps, "ciclo", evaluations, derivativeEvaluations);
    // El criterio de tolerancia exige que se cumplan ambos
    // indicadores. Aun así, este criterio práctico no certifica el error real.
    if (step <= tol && scaledResidual(next, nextF, point) <= tol) return finish(steps, "tolerancia", evaluations, derivativeEvaluations);
    if (nextF === 0) return finish(steps, "residuo_cero", evaluations, derivativeEvaluations);
    previous = x; x = next; fx = nextF;
  }
  return finish(steps, "max_iter", evaluations, derivativeEvaluations);
}

export function barycentricX(r, point = "L1") {
  const mu = LAGRANGE_MODEL.mu;
  return point === "L1" ? 1 - mu - r : point === "L2" ? 1 - mu + r : -mu - r;
}

/** Ecuación original: evita aceptar como físico un cero de otra región. */
export function forceResidual(r, point = "L1") {
  const x = barycentricX(r, point);
  const mu = LAGRANGE_MODEL.mu;
  const d1 = x + mu, d2 = x - (1 - mu);
  return x - (1 - mu) * d1 / Math.abs(d1) ** 3 - mu * d2 / Math.abs(d2) ** 3;
}

export function ulp(value, precision = "float64") {
  const exponent = Math.floor(Math.log2(Math.abs(value)));
  return 2 ** Math.max(precision === "float32" ? -149 : -1074, exponent - (precision === "float32" ? 23 : 52));
}

export function ieeeFields(value, precision = "float64") {
  const view = new DataView(new ArrayBuffer(8));
  let bits;
  if (precision === "float32") {
    view.setFloat32(0, value); bits = view.getUint32(0).toString(2).padStart(32, "0");
  } else {
    view.setFloat64(0, value); bits = view.getBigUint64(0).toString(2).padStart(64, "0");
  }
  const expBits = precision === "float32" ? 8 : 11;
  return { sign: bits.slice(0, 1), exponent: bits.slice(1, expBits + 1), fraction: bits.slice(expBits + 1) };
}

/** Diferencia con la referencia DECIMAL sin convertirla primero a Number.
 * Decodifica exactamente el binary64 y resta enteros BigInt a igual escala.
 * Los valores binary32 también tienen una representación exacta en binary64.
 */
export function referenceError(value, referenceText) {
  if (!Number.isFinite(value)) return null;
  const view = new DataView(new ArrayBuffer(8));
  view.setFloat64(0, value);
  const bits = view.getBigUint64(0);
  const exp = Number((bits >> 52n) & 2047n);
  const fraction = bits & ((1n << 52n) - 1n);
  let integer = exp === 0 ? fraction : (1n << 52n) + fraction;
  const power = (exp === 0 ? -1022 : exp - 1023) - 52;
  let scale = 0;
  if (power >= 0) integer <<= BigInt(power);
  else { scale = -power; integer *= 5n ** BigInt(scale); }
  if (bits >> 63n) integer = -integer;
  const [whole, decimal = ""] = referenceText.split(".");
  const ref = BigInt(whole + decimal);
  const common = Math.max(scale, decimal.length);
  const diff = integer * 10n ** BigInt(common - scale) - ref * 10n ** BigInt(common - decimal.length);
  return Number(`${diff < 0n ? -diff : diff}e-${common}`);
}

export function withReference(run, referenceText) {
  const steps = run.steps.map((s) => ({ ...s, error: referenceError(s.x, referenceText) }));
  return { ...run, steps, error: steps.at(-1)?.error ?? null };
}
