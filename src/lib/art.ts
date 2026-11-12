// Artwork for the shutter, generated as SVG.
// Patterns are seamless tiles measured in centimetres, so they keep their real size on any
// shutter; murals are single compositions stretched to the shutter's proportions.

export type Palette = { id: string; name: string; colors: [string, string, string, string] };
export type Design = {
  id: string;
  name: string;
  kind: "pattern" | "mural";
  usesText?: boolean;
  /**
   * SVG body. Patterns draw one tile of tile.w x tile.h cm without its background, and may
   * spill past the tile edge only with content identical to the neighbouring tile; murals draw into w x h.
   */
  draw: (c: string[], size: { w: number; h: number }, text: string) => string;
  tile?: { w: number; h: number };
};

export const PALETTES: Palette[] = [
  { id: "dusk", name: "Dusk", colors: ["#1f2a44", "#e8b04b", "#d9603b", "#7fb7be"] },
  { id: "sage", name: "Sage", colors: ["#e9e4d4", "#6d8b74", "#2f4f3a", "#c97b4a"] },
  { id: "candy", name: "Candy", colors: ["#ffe3e0", "#ff6f61", "#4b3f72", "#ffc145"] },
  { id: "noir", name: "Noir", colors: ["#191919", "#dbc394", "#f4efe6", "#8a7a5a"] },
  { id: "sea", name: "Sea", colors: ["#0f4c5c", "#f1e9da", "#5fa8a0", "#e36414"] },
  { id: "clay", name: "Clay", colors: ["#f2e3d5", "#b5563b", "#2d3047", "#e0a458"] },
];

/** Deterministic random numbers, so a design looks the same every time. */
function rng(seed: number) {
  let s = seed;
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
}

/** Draw `body(dx, dy)` at the eight neighbouring offsets too, so shapes crossing an edge wrap. */
const wrap = (w: number, h: number, body: (dx: number, dy: number) => string) => {
  let s = "";
  for (const dx of [-w, 0, w]) for (const dy of [-h, 0, h]) s += body(dx, dy);
  return s;
};

const esc = (t: string) => t.replace(/[&<>"]/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[ch]!);

export const DESIGNS: Design[] = [
  {
    id: "waves",
    name: "Waves",
    kind: "pattern",
    tile: { w: 120, h: 90 },
    draw: (c) =>
      // Each wave runs one period past both edges so neighbouring tiles overlap exactly.
      [15, 45, 75]
        .map((y, i) => `<path d="M-120 ${y} Q-90 ${y - 14} -60 ${y} T0 ${y} T60 ${y} T120 ${y} T180 ${y} T240 ${y}" fill="none" stroke="${c[1 + i]}" stroke-width="10"/>`)
        .join(""),
  },
  {
    id: "terrazzo",
    name: "Terrazzo",
    kind: "pattern",
    tile: { w: 160, h: 160 },
    draw: (c) => {
      const r = rng(11);
      let chips = "";
      for (let i = 0; i < 46; i++) {
        const x = r() * 160, y = r() * 160, k = 1 + Math.floor(r() * 3), s = 5 + r() * 12;
        const a = r() * 4, b = r() * 4, d = r() * 4;
        chips += wrap(160, 160, (dx, dy) =>
          `<path d="M${x + dx} ${y + dy} l${s} ${a} l${-b} ${s * 0.8} l${-s * 0.9} ${-d}Z" fill="${c[k]}"/>`);
      }
      return chips;
    },
  },
  {
    id: "leaves",
    name: "Leaves",
    kind: "pattern",
    tile: { w: 220, h: 200 },
    draw: (c) => {
      const leaf = (x: number, y: number, rot: number, col: string) =>
        wrap(220, 200, (dx, dy) =>
          `<g transform="translate(${x + dx} ${y + dy}) rotate(${rot})"><path d="M0 0C25-34 75-34 100 0C75 34 25 34 0 0Z" fill="${col}"/><path d="M6 0H94" stroke="${c[0]}" stroke-width="3"/></g>`);
      const spots: [number, number, number, number][] = [
        [10, 40, -20, 1], [120, 20, 15, 2], [150, 120, -35, 3], [20, 140, 25, 2], [90, 100, -8, 1],
      ];
      return spots.map(([x, y, r, k]) => leaf(x, y, r, c[k])).join("");
    },
  },
  {
    id: "stripes",
    name: "Stripes",
    kind: "pattern",
    tile: { w: 60, h: 60 },
    draw: (c) =>
      // The diagonals run past the tile edge along the same lines as the neighbours' diagonals.
      `<path d="M-15 15L15-15M-15 75L75-15M45 75L75 45" stroke="${c[1]}" stroke-width="14"/>` +
      `<path d="M-15 45L45-15M15 75L75 15" stroke="${c[3]}" stroke-width="6"/>`,
  },
  {
    id: "arcade",
    name: "Arcade",
    kind: "pattern",
    tile: { w: 80, h: 90 },
    draw: (c) =>
      `<path d="M10 90V40a30 30 0 0 1 60 0V90Z" fill="${c[1]}"/>` +
      `<path d="M24 90V44a16 16 0 0 1 32 0V90Z" fill="${c[2]}"/><circle cx="40" cy="22" r="4" fill="${c[3]}"/>`,
  },
  {
    id: "dots",
    name: "Dots",
    kind: "pattern",
    tile: { w: 50, h: 50 },
    draw: (c) =>
      `<circle cx="25" cy="25" r="11" fill="${c[1]}"/>` +
      [0, 50].flatMap((x) => [0, 50].map((y) => `<circle cx="${x}" cy="${y}" r="5" fill="${c[3]}"/>`)).join(""),
  },
  {
    id: "blocks",
    name: "Blocks",
    kind: "mural",
    draw: (c, { w, h }) => {
      const u = Math.min(w, h);
      return (
        `<rect width="${w}" height="${h}" fill="${c[0]}"/>` +
        `<circle cx="${w * 0.27}" cy="${h * 0.38}" r="${u * 0.27}" fill="${c[1]}"/>` +
        `<rect x="${w * 0.5}" y="${h * 0.12}" width="${u * 0.42}" height="${u * 0.42}" fill="${c[2]}"/>` +
        `<path d="M${w * 0.06} ${h} L${w * 0.36} ${h * 0.55} L${w * 0.66} ${h}Z" fill="${c[3]}"/>` +
        `<rect x="${w * 0.66}" y="${h * 0.66}" width="${w * 0.3}" height="${h * 0.24}" fill="${c[1]}"/>` +
        `<circle cx="${w * 0.5 + u * 0.21}" cy="${h * 0.12 + u * 0.21}" r="${u * 0.1}" fill="${c[0]}"/>`
      );
    },
  },
  {
    id: "sunrise",
    name: "Sunrise",
    kind: "mural",
    draw: (c, { w, h }) => {
      const R = Math.hypot(w, h) * 1.2;
      let rays = "";
      for (let i = 0; i < 28; i += 2) {
        const a = (i / 28) * Math.PI, b = ((i + 1) / 28) * Math.PI;
        rays += `<path d="M${w / 2} ${h} L${w / 2 + R * Math.cos(a)} ${h - R * Math.sin(a)} L${w / 2 + R * Math.cos(b)} ${h - R * Math.sin(b)}Z" fill="${c[1]}"/>`;
      }
      const r = Math.min(w, h) * 0.32;
      return `<rect width="${w}" height="${h}" fill="${c[0]}"/>${rays}<circle cx="${w / 2}" cy="${h}" r="${r}" fill="${c[2]}"/><circle cx="${w / 2}" cy="${h}" r="${r * 0.6}" fill="${c[3]}"/>`;
    },
  },
  {
    id: "lettering",
    name: "Lettering",
    kind: "mural",
    usesText: true,
    draw: (c, { w, h }, text) => {
      const t = (text.trim() || "Your shop").slice(0, 28);
      const inset = Math.min(w, h) * 0.06;
      // Georgia, not the page font: exported images cannot load web fonts. About 0.62 em per character.
      const size = Math.min(h * 0.3, ((w - inset * 4) / (t.length * 0.62)) | 0);
      return (
        `<rect width="${w}" height="${h}" fill="${c[0]}"/>` +
        `<rect x="${inset}" y="${inset}" width="${w - inset * 2}" height="${h - inset * 2}" fill="none" stroke="${c[1]}" stroke-width="${inset * 0.25}"/>` +
        `<text x="${w / 2}" y="${h / 2}" dominant-baseline="central" text-anchor="middle" font-family="Georgia, serif" font-size="${size}" fill="${c[1]}">${esc(t)}</text>` +
        `<rect x="${w / 2 - w * 0.08}" y="${h / 2 + size * 0.75}" width="${w * 0.16}" height="${Math.max(2, inset * 0.2)}" fill="${c[3]}"/>`
      );
    },
  },
];

export const designById = (id: string) => DESIGNS.find((d) => d.id === id) ?? DESIGNS[0];
export const paletteById = (id: string) => PALETTES.find((p) => p.id === id) ?? PALETTES[0];

// Pattern ids must be unique: several of these SVGs can sit in one page at once.
let uid = 0;

export type ArtSpec = { design: string; palette: string; scale: number; text: string };

/**
 * The artwork for a shutter of widthM x heightM metres, drawn at pxW pixels wide.
 * `scale` resizes pattern tiles (1 = the tile's natural size in centimetres).
 */
export function artSvg(spec: ArtSpec, widthM: number, heightM: number, pxW: number): string {
  const d = designById(spec.design);
  const c = paletteById(spec.palette).colors;
  const pxH = Math.round((pxW * heightM) / widthM);
  let body: string;
  if (d.kind === "pattern" && d.tile) {
    // Tiles are placed as vector copies rather than an SVG <pattern>: patterns are rasterised
    // per tile and leave hairline seams at fractional sizes.
    const k = (pxW / (widthM * 100)) * spec.scale;
    const tw = d.tile.w * k, th = d.tile.h * k;
    const id = `tile${++uid}`;
    let uses = "";
    for (let y = 0; y < pxH; y += th) for (let x = 0; x < pxW; x += tw) uses += `<use href="#${id}" x="${+x.toFixed(3)}" y="${+y.toFixed(3)}"/>`;
    body =
      `<defs><g id="${id}" transform="scale(${k})">${d.draw(c, d.tile, spec.text)}</g></defs>` +
      `<rect width="${pxW}" height="${pxH}" fill="${c[0]}"/><svg width="${pxW}" height="${pxH}" overflow="hidden">${uses}</svg>`;
  } else {
    body = d.draw(c, { w: pxW, h: pxH }, spec.text);
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${pxW}" height="${pxH}" viewBox="0 0 ${pxW} ${pxH}">${body}</svg>`;
}

/** Small square preview for the artwork picker. */
export function thumbSvg(designId: string, paletteId: string, text = ""): string {
  return artSvg({ design: designId, palette: paletteId, scale: 1, text }, 2.4, 1.8, 240);
}
