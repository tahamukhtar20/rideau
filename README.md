# Rideau

A studio for trying artwork on a shop's roller shutter. Upload a photo of the storefront (or use a sample shop), drag four corners onto the shutter, choose a design and a palette, and get the shutter's area, an estimate and a downloadable mockup.

Live at [rideau.tahamukhtar.com](https://rideau.tahamukhtar.com).

This is an anonymised client project. The original 2023 build was a French Next.js and Firebase site for a storefront-decoration business; this version keeps its idea and workflow with new branding, fictional sample shops and artwork, and no accounts or backend. The rates are illustrative.

## How it works

- Perspective fitting: the four corners define a homography from the artwork's rectangle to the shutter as seen in the photo (`src/lib/geometry.ts`). The studio applies it with a CSS `matrix3d` transform; the downloaded image warps the artwork onto a canvas as a mesh of small affine triangles (`src/render.ts`), so both look the same.
- Artwork: nine designs in six palettes, generated as SVG (`src/lib/art.ts`). Patterns are tiles measured in centimetres, so they keep their real size whatever the shutter's dimensions; murals stretch to the shutter's proportions. Roller-shutter slats (about 8 cm) are drawn over the artwork.
- Estimate: area × €150/m² plus a €120 design fee, with a €450 minimum (`src/lib/pricing.ts`).
- Projects are saved in the browser with IndexedDB. Nothing is uploaded anywhere.
- English and French.

## Development

```bash
npm install
npm run dev        # http://localhost:4460
npm test           # geometry, pricing and artwork tests
npm run build      # type-check and build to dist/
npx wrangler deploy
```

It deploys as static assets on Cloudflare Workers (`wrangler.jsonc`).

## License

[MIT](LICENSE)
