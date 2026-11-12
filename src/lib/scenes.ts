// Sample storefronts, drawn as SVG so the demo needs no photos of real shops.
// Each scene is 1200 x 800 and knows where its shutter is and how big it is.

import type { Quad } from "./geometry.ts";

export type Scene = { id: string; name: string; svg: string; quad: Quad; widthM: number; heightM: number };

const W = 1200, H = 800;

/** Grey roller-shutter slats filling a quad given as a polygon. */
function shutter(q: Quad, id: string): string {
  const pts = q.map((p) => `${p.x},${p.y}`).join(" ");
  const minY = Math.min(...q.map((p) => p.y)), maxY = Math.max(...q.map((p) => p.y));
  let slats = "";
  for (let y = minY; y < maxY; y += 14) slats += `<rect x="0" y="${y}" width="${W}" height="7" fill="#000" opacity=".09"/><rect x="0" y="${y + 7}" width="${W}" height="2" fill="#fff" opacity=".22"/>`;
  return `<clipPath id="${id}"><polygon points="${pts}"/></clipPath><polygon points="${pts}" fill="#b4b8bc"/><g clip-path="url(#${id})">${slats}</g>`;
}

const plant = (x: number, y: number, s = 1) =>
  `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-26" y="0" width="52" height="46" rx="4" fill="#7a5b44"/><circle cx="0" cy="-12" r="30" fill="#5f7d5c"/><circle cx="-16" cy="-28" r="18" fill="#6f8f69"/></g>`;

const luneQuad: Quad = [{ x: 405, y: 395 }, { x: 795, y: 395 }, { x: 795, y: 690 }, { x: 405, y: 690 }];
const lune = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}">
<rect width="${W}" height="${H}" fill="#cfc7b8"/>
<rect x="180" y="40" width="840" height="680" fill="#e8e0d1"/>
${[0, 1, 2].map((i) => `<rect x="${260 + i * 250}" y="90" width="180" height="150" fill="#9fb3bd" stroke="#cfc4b0" stroke-width="12"/><rect x="${252 + i * 250}" y="240" width="196" height="12" fill="#cfc4b0"/>`).join("")}
<rect x="210" y="300" width="780" height="62" fill="#2f2f2f"/>
<text x="600" y="342" font-family="Georgia,serif" font-size="30" fill="#dbc394" text-anchor="middle" letter-spacing="8">PÂTISSERIE LUNE</text>
<rect x="230" y="395" width="140" height="295" fill="#55636a"/><rect x="244" y="409" width="112" height="268" fill="#8fa6ad"/><circle cx="340" cy="545" r="6" fill="#dbc394"/>
${shutter(luneQuad, "c-lune")}
<rect x="395" y="380" width="410" height="16" fill="#4a4a4a"/>
<rect x="830" y="395" width="140" height="295" fill="#55636a"/><rect x="844" y="409" width="112" height="268" fill="#8fa6ad"/>
<rect x="120" y="690" width="960" height="110" fill="#9c958a"/><rect x="120" y="690" width="960" height="8" fill="#857e73"/>
${plant(270, 645)}${plant(930, 645)}
</svg>`;

const folioQuad: Quad = [{ x: 470, y: 352 }, { x: 812, y: 378 }, { x: 812, y: 650 }, { x: 470, y: 676 }];
const folio = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}">
<rect width="${W}" height="${H}" fill="#c7cbc6"/>
<polygon points="140,20 1000,110 1000,700 140,780" fill="#d9c9b3"/>
<polygon points="1000,110 1200,90 1200,700 1000,700" fill="#b9a993"/>
${[0, 1, 2].map((i) => {
  const x = 230 + i * 250, w = 170, y1 = 90 + i * 22, y2 = 100 + (x + w - 230) * 0.088;
  return `<polygon points="${x},${y1} ${x + w},${y2} ${x + w},${y2 + 140 - i * 6} ${x},${y1 + 150 - i * 4}" fill="#8ea4ad" stroke="#efe6d6" stroke-width="10"/>`;
}).join("")}
<polygon points="170,250 1000,318 1000,372 170,320" fill="#2d3047"/>
<text transform="translate(585 318) rotate(4.6)" font-family="Georgia,serif" font-size="30" fill="#f1e9da" text-anchor="middle" letter-spacing="10">FOLIO · BOOKS</text>
<polygon points="200,352 420,368 420,690 200,712" fill="#3c4a52"/><polygon points="214,366 406,380 406,678 214,698" fill="#9db1b8"/>
${shutter(folioQuad, "c-folio")}
<polygon points="458,340 824,366 824,382 458,356" fill="#43454a"/>
<polygon points="860,382 980,391 980,640 860,648" fill="#3c4a52"/>
<polygon points="0,800 140,780 1000,700 1200,700 1200,800" fill="#9a958c"/>
${plant(300, 700, 1.1)}${plant(930, 610, 0.85)}
</svg>`;

const kioskQuad: Quad = [{ x: 300, y: 330 }, { x: 900, y: 330 }, { x: 900, y: 600 }, { x: 300, y: 600 }];
const kiosk = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}">
<rect width="${W}" height="${H}" fill="#2b3340"/>
<rect y="560" width="${W}" height="240" fill="#3b3f45"/>
<rect x="240" y="170" width="720" height="470" rx="10" fill="#365e4f"/>
<path d="M210 170 L600 90 L990 170Z" fill="#284638"/>
<rect x="270" y="200" width="660" height="80" fill="#1d2b24"/>
<text x="600" y="252" font-family="Georgia,serif" font-size="34" fill="#e0a458" text-anchor="middle" letter-spacing="10">KIOSK NORD</text>
${shutter(kioskQuad, "c-kiosk")}
<rect x="290" y="316" width="620" height="16" fill="#1d2b24"/>
<rect x="240" y="640" width="720" height="18" fill="#1d2b24"/>
<circle cx="1060" cy="120" r="34" fill="#f1e9da" opacity=".9"/>
<rect x="1040" y="300" width="14" height="340" fill="#1a1f26"/><circle cx="1047" cy="292" r="22" fill="#f6d78b"/>
</svg>`;

export const SCENES: Scene[] = [
  { id: "lune", name: "Pâtisserie Lune", svg: lune, quad: luneQuad, widthM: 3.6, heightM: 2.6 },
  { id: "folio", name: "Folio Books", svg: folio, quad: folioQuad, widthM: 3.2, heightM: 2.5 },
  { id: "kiosk", name: "Kiosk Nord", svg: kiosk, quad: kioskQuad, widthM: 4.4, heightM: 2.0 },
];
export const SCENE_SIZE = { w: W, h: H };
export const sceneById = (id: string) => SCENES.find((s) => s.id === id) ?? null;
export const svgUrl = (svg: string) => `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
