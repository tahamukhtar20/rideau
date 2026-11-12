import { test } from "node:test";
import assert from "node:assert/strict";
import { DESIGN_FEE, estimate, MINIMUM, parseMetres, RATE_PER_M2 } from "./pricing.ts";

test("area times rate plus design fee", () => {
  const e = estimate(3.6, 2.6)!;
  assert.equal(e.area, 9.36);
  assert.equal(e.paint, Math.round(9.36 * RATE_PER_M2));
  assert.equal(e.total, e.paint + DESIGN_FEE);
  assert.equal(e.minimumApplied, false);
});

test("small shutters pay the minimum", () => {
  const e = estimate(1, 1)!;
  assert.equal(e.total, MINIMUM);
  assert.equal(e.minimumApplied, true);
});

test("unusable sizes give no estimate", () => {
  for (const [w, h] of [[0, 2], [-1, 2], [NaN, 2], [40, 2], [3, 20]]) assert.equal(estimate(w, h), null);
});

test("lengths accept a decimal comma", () => {
  assert.equal(parseMetres("3,6"), 3.6);
  assert.equal(parseMetres(" 2.5 "), 2.5);
  assert.ok(Number.isNaN(parseMetres("abc")));
});
