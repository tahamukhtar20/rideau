// Landing page: what Rideau does, a live example and the four steps.
import { useMemo } from "react";
import { DESIGNS, PALETTES, thumbSvg } from "./lib/art.ts";
import { estimate } from "./lib/pricing.ts";
import { money, num, useLang } from "./i18n.ts";
import { fromScene } from "./project.ts";
import { Stage } from "./Stage.tsx";

export function Home({ go }: { go: (path: string) => void }) {
  const { lang, t } = useLang();
  const example = useMemo(() => fromScene("lune", "Pâtisserie Lune", { design: "waves", palette: "dusk", scale: 1, text: "" }), []);
  const est = estimate(3.6, 2.6)!;
  const steps = [
    [t.stepPhoto, t.stepPhotoBody],
    [t.stepFit, t.stepFitBody],
    [t.stepDress, t.stepDressBody],
    [t.stepQuote, t.stepQuoteBody],
  ];
  return (
    <main className="home">
      <section className="hero">
        <div className="copy">
          <h1>{t.heroTitle}</h1>
          <p>{t.heroBody}</p>
          <div className="ctas">
            <button type="button" className="btn lg" onClick={() => go("/studio")}>
              {t.openStudio}
            </button>
            <button type="button" className="btn ghost lg" onClick={() => go("/studio?scene=folio")}>
              {t.trySample}
            </button>
          </div>
        </div>
        <div className="hero-stage">
          <Stage project={example} label="Pâtisserie Lune" />
          <div className="chip bl">
            {t.shutter}
            <b>
              {num(3.6, lang)} × {num(2.6, lang)} m
            </b>
          </div>
          <div className="chip tr">
            {t.estimate}
            <b>{money(est.total, lang)}</b>
          </div>
        </div>
      </section>

      <section className="steps" id="how" aria-label={t.how}>
        {steps.map(([title, body], i) => (
          <div key={title}>
            <span>0{i + 1}</span>
            <h3>{title}</h3>
            <p>{body}</p>
          </div>
        ))}
      </section>

      <section className="gallery">
        <div className="gallery-head">
          <h2>{t.designsTitle}</h2>
          <p>{t.designsBody}</p>
        </div>
        <div className="gallery-grid">
          {DESIGNS.map((d, i) => (
            <figure key={d.id}>
              <span dangerouslySetInnerHTML={{ __html: thumbSvg(d.id, PALETTES[i % PALETTES.length].id, "Lune") }} />
              <figcaption>
                {t.designNames[d.id]} <span>{t.paletteNames[PALETTES[i % PALETTES.length].id]}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>
    </main>
  );
}
