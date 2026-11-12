import { test } from "node:test";
import assert from "node:assert/strict";
import { artSvg, DESIGNS, PALETTES } from "./art.ts";

test("every design renders with every palette and a sized viewBox", () => {
  for (const d of DESIGNS) for (const p of PALETTES) {
    const s = artSvg({ design: d.id, palette: p.id, scale: 1, text: "Lune" }, 3.6, 2.6, 900);
    assert.match(s, /^<svg [^>]*width="900" height="650"/);
    assert.doesNotMatch(s, /NaN|undefined/);
  }
});

test("pattern ids differ between renders", () => {
  const a = artSvg({ design: "waves", palette: "dusk", scale: 1, text: "" }, 3, 2, 300);
  const b = artSvg({ design: "waves", palette: "dusk", scale: 1, text: "" }, 3, 2, 300);
  assert.notEqual(a.match(/id="(\w+)"/)![1], b.match(/id="(\w+)"/)![1]);
});

test("lettering escapes markup in the shop name", () => {
  const s = artSvg({ design: "lettering", palette: "noir", scale: 1, text: `<b>&"` }, 3, 2, 300);
  assert.match(s, /&lt;b&gt;&amp;&quot;/);
});
