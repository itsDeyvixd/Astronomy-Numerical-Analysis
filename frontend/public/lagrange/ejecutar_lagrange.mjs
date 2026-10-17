// Usa exactamente el mismo motor que el laboratorio de la página.
import { LAGRANGE_MODEL, POINTS, solveLagrangeBisection, solveLagrangeNewton } from '../frontend/src/lib/lagrangeSolver.js';

const experiments = [];
for (const point of Object.keys(POINTS)) {
  for (const precision of ['float32', 'float64']) {
    for (const tol of [1e-6, 1e-10, 1e-14, 1e-20]) {
      for (const method of ['bisection', 'newton']) {
        const solve = method === 'bisection' ? solveLagrangeBisection : solveLagrangeNewton;
        experiments.push({ point, precision, tol, method, x0: method === 'newton' ? POINTS[point].seed : null, ...solve({ point, precision, tol }) });
      }
    }
  }
}
const sensitivity = [0.000001, 0.001, 0.01, 0.1, 0.5, 0.9].map((x0) => ({ x0, ...solveLagrangeNewton({ x0, tol: 1e-10 }) }));
console.log(JSON.stringify({ model: LAGRANGE_MODEL, experiments, sensitivity }));
