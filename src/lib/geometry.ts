// Perspective maths for fitting artwork onto a shutter seen at an angle.

export type Point = { x: number; y: number };
/** Shutter corners in order: top-left, top-right, bottom-right, bottom-left. */
export type Quad = [Point, Point, Point, Point];
/** 3x3 homography as [h0..h7], with h8 = 1. Maps (x, y) to ((h0x+h1y+h2)/w, (h3x+h4y+h5)/w), w = h6x+h7y+1. */
export type Homography = number[];

/** Solve A x = b by Gaussian elimination with partial pivoting. */
function solve(a: number[][], b: number[]): number[] {
  const n = b.length;
  const m = a.map((row, i) => [...row, b[i]]);
  for (let c = 0; c < n; c++) {
    let p = c;
    for (let r = c + 1; r < n; r++) if (Math.abs(m[r][c]) > Math.abs(m[p][c])) p = r;
    if (Math.abs(m[p][c]) < 1e-12) throw new Error("degenerate quad");
    [m[c], m[p]] = [m[p], m[c]];
    for (let r = 0; r < n; r++) {
      if (r === c) continue;
      const f = m[r][c] / m[c][c];
      for (let k = c; k <= n; k++) m[r][k] -= f * m[c][k];
    }
  }
  return m.map((row, i) => row[n] / row[i]);
}

/** Homography taking the four `from` points to the four `to` points. */
export function homography(from: Quad, to: Quad): Homography {
  const a: number[][] = [];
  const b: number[] = [];
  for (let i = 0; i < 4; i++) {
    const { x, y } = from[i];
    const { x: u, y: v } = to[i];
    a.push([x, y, 1, 0, 0, 0, -u * x, -u * y]);
    b.push(u);
    a.push([0, 0, 0, x, y, 1, -v * x, -v * y]);
    b.push(v);
  }
  return solve(a, b);
}

export function apply(h: Homography, p: Point): Point {
  const w = h[6] * p.x + h[7] * p.y + 1;
  return { x: (h[0] * p.x + h[1] * p.y + h[2]) / w, y: (h[3] * p.x + h[4] * p.y + h[5]) / w };
}

export const rectQuad = (w: number, h: number): Quad => [
  { x: 0, y: 0 },
  { x: w, y: 0 },
  { x: w, y: h },
  { x: 0, y: h },
];

/** CSS matrix3d() that maps a w x h element (origin top-left) onto `to`. */
export function matrix3d(w: number, h: number, to: Quad): string {
  const m = homography(rectQuad(w, h), to);
  // Column-major 4x4; z passes through unchanged.
  const v = [m[0], m[3], 0, m[6], m[1], m[4], 0, m[7], 0, 0, 1, 0, m[2], m[5], 0, 1];
  return `matrix3d(${v.map((n) => +n.toFixed(10)).join(",")})`;
}

/** A quad is usable when it is convex and has a sensible area (no crossed or collapsed corners). */
export function isConvex(q: Quad): boolean {
  let sign = 0;
  for (let i = 0; i < 4; i++) {
    const a = q[i], b = q[(i + 1) % 4], c = q[(i + 2) % 4];
    const cross = (b.x - a.x) * (c.y - b.y) - (b.y - a.y) * (c.x - b.x);
    if (Math.abs(cross) < 1e-9) return false;
    const s = Math.sign(cross);
    if (sign && s !== sign) return false;
    sign = s;
  }
  return true;
}

/** Affine transform [a, b, c, d, e, f] (canvas setTransform order) taking triangle s to triangle d. */
export function triangleAffine(s: [Point, Point, Point], d: [Point, Point, Point]): number[] {
  const [a, b, c, dd, e, f] = solve(
    [
      [s[0].x, s[0].y, 1, 0, 0, 0],
      [0, 0, 0, s[0].x, s[0].y, 1],
      [s[1].x, s[1].y, 1, 0, 0, 0],
      [0, 0, 0, s[1].x, s[1].y, 1],
      [s[2].x, s[2].y, 1, 0, 0, 0],
      [0, 0, 0, s[2].x, s[2].y, 1],
    ],
    [d[0].x, d[0].y, d[1].x, d[1].y, d[2].x, d[2].y],
  );
  // x' = a x + b y + c, y' = dd x + e y + f  ->  canvas order (a, dd, b, e, c, f)
  return [a, dd, b, e, c, f];
}
