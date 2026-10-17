import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { LAGRANGE_MODEL, coefficients, evaluatePolynomial, forceResidual, ieeeFields, referenceError, solveLagrangeBisection, solveLagrangeNewton, ulp } from "./lagrangeSolver.js";

const data = JSON.parse(readFileSync(new URL("./lagrangeData.json", import.meta.url), "utf8"));

test("los quínticos representan las fuerzas de sus tres regiones", () => {
  // Identidades físicas independientes de Horner, en puntos alejados del cero.
  for (const r of [0.007, 0.02, 0.25, 0.8]) {
    for (const point of ["L1", "L2", "L3"]) {
      const factor = point === "L1" ? -(r ** 2) * (1 - r) ** 2 : point === "L2" ? r ** 2 * (1 + r) ** 2 : -(r ** 2) * (1 + r) ** 2;
      assert.ok(Math.abs(evaluatePolynomial(r, point) - factor * forceResidual(r, point)) < 1e-12);
    }
  }
});

test("raíces de referencia satisfacen el equilibrio y su región", () => {
  for (const point of ["L1", "L2", "L3"]) {
    const r = Number(data.references[point]);
    assert.ok(r > 0 && r < 1);
    assert.ok(Math.abs(forceResidual(r, point)) < 1e-12);
    assert.ok(Math.abs(evaluatePolynomial(r, point)) < 2e-15);
  }
  assert.ok(Number(data.references.L1) * LAGRANGE_MODEL.distanceKm > 1.48e6);
  assert.ok(Number(data.references.L1) * LAGRANGE_MODEL.distanceKm < 1.5e6);
});

test("bisección conserva la referencia a tolerancias moderadas y cumple la cota", () => {
  for (const point of ["L1", "L2", "L3"]) {
    const result = solveLagrangeBisection({ point, tol: 1e-10 });
    assert.equal(result.status, "tolerancia");
    assert.ok(referenceError(result.root, data.references[point]) <= 1e-10);
    for (const s of result.steps) {
      assert.ok(Number(data.references[point]) >= s.a && Number(data.references[point]) <= s.b);
      assert.ok(referenceError(s.x, data.references[point]) <= s.bound + 1e-16);
    }
  }
  assert.equal(solveLagrangeBisection({ a: 0.2, b: 0.4 }).status, "intervalo_invalido");
});

test("Newton evalúa la derivada correcta y converge en las tres ramas", () => {
  for (const point of ["L1", "L2", "L3"]) {
    const result = solveLagrangeNewton({ point });
    assert.ok(referenceError(result.root, data.references[point]) < 1e-10);
    const x = 0.2, h = 1e-6;
    const finiteDifference = (evaluatePolynomial(x + h, point) - evaluatePolynomial(x - h, point)) / (2 * h);
    assert.ok(Math.abs(finiteDifference - evaluatePolynomial(x, point, "float64", true)) < 1e-9);
  }
  assert.equal(solveLagrangeNewton({ x0: -1 }).status, "fuera_dominio");
  assert.equal(solveLagrangeNewton({ maxIter: 1, x0: 0.5 }).status, "max_iter");
});

test("binary32 redondea coeficientes e iterados; detecta la meseta sin falsa convergencia", () => {
  for (const a of coefficients("L1", "float32")) assert.equal(a, Math.fround(a));
  const result = solveLagrangeBisection({ precision: "float32", tol: 1e-20 });
  assert.equal(result.status, "estancamiento");
  assert.ok(result.steps.length < 100);
  for (const s of result.steps) {
    for (const key of ["a", "b", "x", "fx"]) assert.equal(s[key], Math.fround(s[key]));
  }
  const last = result.steps.at(-1);
  assert.ok(last.x === last.a || last.x === last.b);
  assert.ok(referenceError(result.root, data.references.L1) > 1e-10);
  assert.equal(ulp(result.root, "float32"), 2 ** -30);
  assert.equal(ieeeFields(result.root, "float32").fraction.length, 23);
  assert.equal(ieeeFields(result.root).fraction.length, 52);
});

test("el error de la web conserva los dígitos de la referencia y coincide con Decimal", () => {
  assert.ok(referenceError(Number(data.references.L1), data.references.L1) > 0);
  for (const run of [...data.experiments, ...data.sensitivity]) {
    const ref = data.references[run.point ?? "L1"];
    for (const row of run.steps) {
      const error = referenceError(row.x, ref);
      assert.ok(Math.abs(error - row.error) <= Math.max(1e-80, row.error * 1e-14));
    }
  }
});

test("el experimento guardado se reproduce con el motor actual, sin datos inventados", () => {
  assert.equal(data.experiments.length, 48);
  for (const saved of data.experiments) {
    const solve = saved.method === "bisection" ? solveLagrangeBisection : solveLagrangeNewton;
    const result = solve({ point: saved.point, precision: saved.precision, tol: saved.tol });
    assert.equal(result.status, saved.status);
    assert.equal(result.root, saved.root);
    assert.equal(result.steps.length, saved.steps.length);
    result.steps.forEach((row, i) => {
      assert.equal(row.x, saved.steps[i].x);
      assert.equal(row.fx, saved.steps[i].fx);
    });
  }
});

test("un residuo redondeado a cero no se declara raíz exacta", () => {
  const cases = data.experiments.filter((r) => r.status === "residuo_cero");
  assert.ok(cases.length > 0);
  for (const run of cases) {
    assert.equal(run.steps.at(-1).fx, 0);
    assert.ok(run.error > 0);
    assert.ok(run.referenceResidual > 0);
  }
});
