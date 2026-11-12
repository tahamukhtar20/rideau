import { test } from "node:test";
import assert from "node:assert/strict";
import { apply, homography, isConvex, matrix3d, rectQuad, triangleAffine } from "./geometry.ts";
import type { Quad } from "./geometry.ts";

const close = (a: number, b: number, eps = 1e-6) => assert.ok(Math.abs(a - b) < eps, `${a} != ${b}`);
const skew: Quad = [{ x: 470, y: 352 }, { x: 812, y: 378 }, { x: 812, y: 650 }, { x: 470, y: 676 }];

test("homography maps each corner onto its target", () => {
  const h = homography(rectQuad(400, 300), skew);
  rectQuad(400, 300).forEach((p, i) => {
    const q = apply(h, p);
    close(q.x, skew[i].x);
    close(q.y, skew[i].y);
  });
});

test("identity for a quad equal to the rectangle", () => {
  const h = homography(rectQuad(10, 5), rectQuad(10, 5));
  [1, 0, 0, 0, 1, 0, 0, 0].forEach((v, i) => close(h[i], v));
});

test("perspective keeps straight lines straight (centre maps to diagonal intersection)", () => {
  const h = homography(rectQuad(1, 1), skew);
  const c = apply(h, { x: 0.5, y: 0.5 });
  // Intersection of the quad's diagonals.
  const [a, , b] = skew, [, d, , e] = skew;
  const t = ((d.x - a.x) * (e.y - d.y) - (d.y - a.y) * (e.x - d.x)) / ((b.x - a.x) * (e.y - d.y) - (b.y - a.y) * (e.x - d.x));
  close(c.x, a.x + t * (b.x - a.x), 1e-6);
  close(c.y, a.y + t * (b.y - a.y), 1e-6);
});

test("matrix3d places the element's corners like the homography", () => {
  const m = matrix3d(200, 100, skew).match(/[-\d.e]+/g)!.slice(1).map(Number);
  // Column-major: x' = (m0 x + m4 y + m12) / (m3 x + m7 y + m15)
  for (const [i, p] of rectQuad(200, 100).entries()) {
    const w = m[3] * p.x + m[7] * p.y + m[15];
    close((m[0] * p.x + m[4] * p.y + m[12]) / w, skew[i].x, 1e-4);
    close((m[1] * p.x + m[5] * p.y + m[13]) / w, skew[i].y, 1e-4);
  }
});

test("convexity rejects crossed and collapsed quads", () => {
  assert.equal(isConvex(skew), true);
  assert.equal(isConvex([skew[0], skew[2], skew[1], skew[3]]), false);
  assert.equal(isConvex([{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }, { x: 0, y: 1 }]), false);
  assert.throws(() => homography(rectQuad(1, 1), [{ x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 }]));
});

test("triangle affine maps the three vertices", () => {
  const s: [any, any, any] = [{ x: 0, y: 0 }, { x: 10, y: 0 }, { x: 0, y: 10 }];
  const d: [any, any, any] = [{ x: 5, y: 5 }, { x: 25, y: 8 }, { x: 3, y: 30 }];
  const [a, b, c, e, f, g] = triangleAffine(s, d);
  s.forEach((p, i) => {
    close(a * p.x + c * p.y + f, d[i].x);
    close(b * p.x + e * p.y + g, d[i].y);
  });
});
