// Draws the finished mockup into a canvas for download, matching what the studio shows.
import { artSvg } from "./lib/art.ts";
import { apply, homography, rectQuad, triangleAffine } from "./lib/geometry.ts";
import type { Point, Quad } from "./lib/geometry.ts";
import { parseMetres } from "./lib/pricing.ts";
import { svgUrl } from "./lib/scenes.ts";
import { loadImage, photoInfo } from "./project.ts";
import type { Project } from "./project.ts";

/** Roller-shutter slats are about 8 cm tall. */
export const SLAT_CM = 8;
/** Longest side of the artwork texture in pixels, before it is warped onto the shutter. */
export const ART_PX = 900;

/** Texture size for a shutter: ART_PX on its long side, so very thin shutters stay small. */
export function artPixels(size: { w: number; h: number }): { w: number; h: number } {
  const k = ART_PX / Math.max(size.w, size.h);
  return { w: Math.max(1, Math.round(size.w * k)), h: Math.max(1, Math.round(size.h * k)) };
}

/** Shutter size in metres, falling back to the outline's proportions when the typed size is unusable. */
export function shutterSize(p: Project): { w: number; h: number } {
  const w = parseMetres(p.width), h = parseMetres(p.height);
  if (w > 0 && h > 0 && w <= 30 && h <= 15) return { w, h };
  const [a, b, c, d] = p.quad;
  const top = Math.hypot(b.x - a.x, b.y - a.y), left = Math.hypot(d.x - a.x, d.y - a.y);
  const right = Math.hypot(c.x - b.x, c.y - b.y);
  return { w: 3, h: (3 * (left + right)) / 2 / Math.max(top, 1) };
}

export function slatPeriod(pxW: number, widthM: number) {
  return (pxW / (widthM * 100)) * SLAT_CM;
}

function drawSlats(ctx: CanvasRenderingContext2D, w: number, h: number, period: number) {
  for (let y = 0; y < h; y += period) {
    ctx.fillStyle = "rgba(0,0,0,0.10)";
    ctx.fillRect(0, y, w, period * 0.5);
    ctx.fillStyle = "rgba(255,255,255,0.18)";
    ctx.fillRect(0, y + period * 0.88, w, period * 0.12);
  }
}

/** Draw `src` (a w x h image) onto `to` in ctx, as a mesh of small affine triangles. */
function warp(ctx: CanvasRenderingContext2D, src: CanvasImageSource, w: number, h: number, to: Quad, n = 28) {
  const H = homography(rectQuad(w, h), to);
  const grid: Point[][] = [];
  for (let j = 0; j <= n; j++) {
    grid.push([]);
    for (let i = 0; i <= n; i++) grid[j].push({ x: (i / n) * w, y: (j / n) * h });
  }
  const dst = grid.map((row) => row.map((p) => apply(H, p)));
  const tri = (s: [Point, Point, Point], d: [Point, Point, Point]) => {
    // Grow each triangle a little around its centre so neighbours overlap and no seams show.
    const cx = (d[0].x + d[1].x + d[2].x) / 3, cy = (d[0].y + d[1].y + d[2].y) / 3;
    const grow = (p: Point) => {
      const dx = p.x - cx, dy = p.y - cy, len = Math.hypot(dx, dy) || 1;
      return { x: p.x + (dx / len) * 0.7, y: p.y + (dy / len) * 0.7 };
    };
    ctx.save();
    ctx.beginPath();
    const g = d.map(grow);
    ctx.moveTo(g[0].x, g[0].y);
    ctx.lineTo(g[1].x, g[1].y);
    ctx.lineTo(g[2].x, g[2].y);
    ctx.closePath();
    ctx.clip();
    const [a, b, c, e, f, k] = triangleAffine(s, d);
    ctx.transform(a, b, c, e, f, k);
    ctx.drawImage(src, 0, 0);
    ctx.restore();
  };
  for (let j = 0; j < n; j++)
    for (let i = 0; i < n; i++) {
      const s00 = grid[j][i], s10 = grid[j][i + 1], s01 = grid[j + 1][i], s11 = grid[j + 1][i + 1];
      const d00 = dst[j][i], d10 = dst[j][i + 1], d01 = dst[j + 1][i], d11 = dst[j + 1][i + 1];
      tri([s00, s10, s11], [d00, d10, d11]);
      tri([s00, s11, s01], [d00, d11, d01]);
    }
}

/** The mockup at `outW` pixels wide (never larger than the photo itself, except for drawn scenes). */
export async function renderMockup(p: Project, outW = 1600): Promise<HTMLCanvasElement> {
  const info = photoInfo(p.photo);
  const photo = await loadImage(info.url);
  const W = p.photo.kind === "image" ? Math.min(outW, info.w) : outW;
  const k = W / info.w;
  const out = document.createElement("canvas");
  out.width = W;
  out.height = Math.round(info.h * k);
  const ctx = out.getContext("2d")!;
  ctx.drawImage(photo, 0, 0, out.width, out.height);

  const size = shutterSize(p);
  const px = artPixels(size);
  const art = await loadImage(svgUrl(artSvg(p.art, size.w, size.h, px.w)));
  const tex = document.createElement("canvas");
  tex.width = px.w;
  tex.height = px.h;
  const tctx = tex.getContext("2d")!;
  tctx.drawImage(art, 0, 0, tex.width, tex.height);
  drawSlats(tctx, tex.width, tex.height, slatPeriod(tex.width, size.w));

  warp(ctx, tex, tex.width, tex.height, p.quad.map((q) => ({ x: q.x * k, y: q.y * k })) as Quad);
  return out;
}

export async function downloadMockup(p: Project) {
  const canvas = await renderMockup(p);
  const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, "image/png"));
  if (!blob) throw new Error("could not encode the image");
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `${(p.name || "rideau").replace(/[^\w\- ]+/g, "").trim().replace(/\s+/g, "-").toLowerCase() || "rideau"}-mockup.png`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}
