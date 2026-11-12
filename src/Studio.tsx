// The studio: photo, fit, dress and quote steps around the live stage.
import { useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { ArrowLeft, ArrowRight, Check, Download, Eye, EyeOff, RotateCcw, Save, Trash2, Upload } from "lucide-react";
import { DESIGNS, PALETTES, designById, thumbSvg } from "./lib/art.ts";
import type { ArtSpec } from "./lib/art.ts";
import { estimate, parseMetres } from "./lib/pricing.ts";
import { SCENES, sceneById, svgUrl } from "./lib/scenes.ts";
import { money, num, useLang } from "./i18n.ts";
import type { Strings } from "./i18n.ts";
import { deleteProject, fromScene, initialQuad, listProjects, newId, photoInfo, readPhoto, saveProject } from "./project.ts";
import type { Project, SavedProject } from "./project.ts";
import { downloadMockup, renderMockup } from "./render.ts";
import { Stage } from "./Stage.tsx";

const STEPS = ["photo", "fit", "dress", "quote"] as const;
type Step = (typeof STEPS)[number];
const stepLabel = (t: Strings, s: Step) => ({ photo: t.stepPhoto, fit: t.stepFit, dress: t.stepDress, quote: t.stepQuote })[s];
/** Names the app filled in itself (sample shops, "My shop" in either language), as opposed to typed ones. */
const AUTO_NAMES = new Set([...SCENES.map((s) => s.name), "My shop", "Ma boutique"]);

export function Studio({ sceneId }: { sceneId: string | null }) {
  const { lang, t } = useLang();
  const [project, setProject] = useState<Project>(() => fromScene(sceneId ?? "lune", sceneById(sceneId ?? "lune")?.name ?? t.untitled));
  const [step, setStep] = useState<Step>(sceneId ? "dress" : "photo");
  const [showArt, setShowArt] = useState(true);
  const [saved, setSaved] = useState<SavedProject[]>([]);
  const [notice, setNotice] = useState<string | null>(null);
  const [justSaved, setJustSaved] = useState(false);
  const [busy, setBusy] = useState<"upload" | "export" | "save" | null>(null);
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  const refresh = () => listProjects().then(setSaved, () => setSaved([]));
  useEffect(() => void refresh(), []);
  useEffect(() => {
    if (!notice) return;
    const id = setTimeout(() => setNotice(null), 3200);
    return () => clearTimeout(id);
  }, [notice]);
  useEffect(() => {
    if (!justSaved) return;
    const id = setTimeout(() => setJustSaved(false), 2000);
    return () => clearTimeout(id);
  }, [justSaved]);

  const update = (patch: Partial<Project>) => setProject((p) => ({ ...p, ...patch }));
  const setArt = (patch: Partial<ArtSpec>) => setProject((p) => ({ ...p, art: { ...p.art, ...patch } }));

  const w = parseMetres(project.width), h = parseMetres(project.height);
  const est = estimate(w, h);
  const design = designById(project.art.design);
  const stepIndex = STEPS.indexOf(step);
  // Rebuilt only when the palette or text changes, not on every keystroke elsewhere.
  const thumbs = useMemo(
    () => Object.fromEntries(DESIGNS.map((d) => [d.id, thumbSvg(d.id, project.art.palette, project.art.text)])),
    [project.art.palette, project.art.text],
  );
  const info = photoInfo(project.photo);
  const photoRatio = info.w / info.h;

  const pickScene = (id: string) => {
    setProject((p) => {
      // Follow the shop's name in the lettering unless it was typed by hand.
      const typed = p.art.text && !AUTO_NAMES.has(p.art.text);
      // Likewise the project name, while the app chose it.
      const named = p.name.trim() && !AUTO_NAMES.has(p.name);
      // A new photo is a new project, so saving never overwrites the one it came from.
      return fromScene(id, named ? p.name : sceneById(id)!.name, typed ? p.art : { ...p.art, text: "" });
    });
    setShowArt(true);
    setStep("fit");
  };
  const onFile = async (file: File | undefined) => {
    if (!file) return;
    setBusy("upload");
    try {
      const photo = await readPhoto(file);
      setProject((p) => ({
        ...p,
        id: newId(),
        name: AUTO_NAMES.has(p.name) ? t.untitled : p.name,
        art: AUTO_NAMES.has(p.art.text) || !p.art.text ? { ...p.art, text: t.untitled } : p.art,
        photo,
        quad: initialQuad(photo),
        width: "3",
        height: "2.5",
      }));
      setShowArt(true);
      setStep("fit");
    } catch {
      setNotice(t.uploadFailed);
    } finally {
      setBusy(null);
      if (fileInput.current) fileInput.current.value = "";
    }
  };
  const save = async () => {
    setBusy("save");
    try {
      const p = { ...project, name: project.name.trim() || t.untitled, updated: Date.now() };
      const thumb = (await renderMockup(p, 360)).toDataURL("image/jpeg", 0.8);
      await saveProject({ ...p, thumb });
      // Only the fields saving changed: edits made meanwhile are kept.
      setProject((cur) => (cur.id === p.id ? { ...cur, name: cur.name.trim() ? cur.name : p.name, updated: p.updated } : cur));
      setJustSaved(true);
      refresh();
    } catch {
      setNotice(t.saveFailed);
    } finally {
      setBusy(null);
    }
  };
  const exportPng = async () => {
    setBusy("export");
    try {
      await downloadMockup(project);
    } catch {
      setNotice(t.exportFailed);
    } finally {
      setBusy(null);
    }
  };

  const panel: Record<Step, JSX.Element> = {
    photo: (
      <>
        <p className="help">{t.stepPhotoBody}</p>
        <h4>{t.samples}</h4>
        <div className="scenes">
          {SCENES.map((s) => (
            <button key={s.id} type="button" className={project.photo.kind === "scene" && project.photo.id === s.id ? "on" : ""} onClick={() => pickScene(s.id)}>
              <img src={svgUrl(s.svg)} alt="" />
              <span>{s.name}</span>
            </button>
          ))}
        </div>
        <input ref={fileInput} type="file" accept="image/*" hidden onChange={(e) => onFile(e.target.files?.[0])} />
        <button type="button" className="btn ghost wide" onClick={() => fileInput.current?.click()} disabled={busy === "upload"}>
          <Upload size={16} aria-hidden /> {busy === "upload" ? t.uploading : t.upload}
        </button>
        <h4>{t.saved}</h4>
        {saved.length === 0 ? (
          <p className="help">{t.noSaved}</p>
        ) : (
          <ul className="saved">
            {saved.map((s) => (
              <li key={s.id}>
                <img src={s.thumb} alt="" />
                <div>
                  <b>{s.name}</b>
                  <small>{new Date(s.updated).toLocaleDateString(lang === "fr" ? "fr-FR" : "en-GB")}</small>
                </div>
                <button type="button" className="icon" aria-label={`${t.open} ${s.name}`} onClick={() => (setProject(s), setShowArt(true), setStep("dress"))}>
                  <ArrowRight size={16} />
                </button>
                {pendingDelete === s.id ? (
                  <button type="button" className="btn ghost confirm" onClick={() => deleteProject(s.id).then(refresh, () => setNotice(t.saveFailed)).finally(() => setPendingDelete(null))} onBlur={() => setPendingDelete(null)} autoFocus>
                    {t.confirmDelete}
                  </button>
                ) : (
                  <button type="button" className="icon" aria-label={`${t.remove} ${s.name}`} onClick={() => setPendingDelete(s.id)}>
                    <Trash2 size={16} />
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </>
    ),
    fit: (
      <>
        <p className="help">{t.fitHelp}</p>
        <button type="button" className="btn ghost wide" onClick={() => update({ quad: initialQuad(project.photo) })}>
          <RotateCcw size={16} aria-hidden /> {t.resetCorners}
        </button>
      </>
    ),
    dress: (
      <>
        <h4>{t.designs}</h4>
        <div className="designs">
          {DESIGNS.map((d) => (
            <button
              key={d.id}
              type="button"
              className={d.id === project.art.design ? "on" : ""}
              aria-pressed={d.id === project.art.design}
              onClick={() => setArt({ design: d.id })}
              title={t.designNames[d.id]}
            >
              <span className="thumb" dangerouslySetInnerHTML={{ __html: thumbs[d.id] }} />
              <span className="name">{t.designNames[d.id]}</span>
            </button>
          ))}
        </div>
        <h4>{t.palette}</h4>
        <div className="palettes">
          {PALETTES.map((p) => (
            <button key={p.id} type="button" className={p.id === project.art.palette ? "on" : ""} aria-pressed={p.id === project.art.palette} onClick={() => setArt({ palette: p.id })}>
              <span className="sw">{p.colors.map((c) => <i key={c} style={{ background: c }} />)}</span>
              {t.paletteNames[p.id]}
            </button>
          ))}
        </div>
        {design.kind === "pattern" && (
          <label className="range">
            <span>
              {t.scale} <b>{Math.round(project.art.scale * 100)}%</b>
            </span>
            <input type="range" min={0.5} max={2} step={0.05} value={project.art.scale} onChange={(e) => setArt({ scale: +e.target.value })} />
          </label>
        )}
        {design.usesText && (
          <label className="text">
            <span>{t.shopName}</span>
            <input value={project.art.text} maxLength={28} onChange={(e) => setArt({ text: e.target.value })} />
          </label>
        )}
      </>
    ),
    quote: (
      <>
        <p className="help">{t.stepQuoteBody}</p>
        <h4>{t.summary}</h4>
        <dl className="summary">
          <dt>{t.project}</dt>
          <dd>{project.name || t.untitled}</dd>
          <dt>{t.shutter}</dt>
          <dd>{Number.isFinite(w) && Number.isFinite(h) ? `${num(w, lang)} × ${num(h, lang)} m` : "–"}</dd>
          <dt>{t.designs}</dt>
          <dd>
            {t.designNames[design.id]} · {t.paletteNames[project.art.palette]}
          </dd>
        </dl>
        <button type="button" className="btn wide" onClick={exportPng} disabled={busy === "export"}>
          <Download size={16} aria-hidden /> {busy === "export" ? t.exporting : t.export}
        </button>
      </>
    ),
  };

  return (
    <main className="studio">
      <aside className="side left" aria-label={stepLabel(t, step)}>
        <h3>{stepLabel(t, step)}</h3>
        {panel[step]}
        <div className="stepnav">
          <button type="button" className="btn ghost" disabled={stepIndex === 0} onClick={() => setStep(STEPS[stepIndex - 1])}>
            <ArrowLeft size={16} aria-hidden /> {t.back}
          </button>
          <button type="button" className="btn ghost" disabled={stepIndex === STEPS.length - 1} onClick={() => setStep(STEPS[stepIndex + 1])}>
            {t.next} <ArrowRight size={16} aria-hidden />
          </button>
        </div>
      </aside>

      <section className="center">
        <div className="bar">
          <div className="seg" role="group" aria-label={t.stepsLabel}>
            {STEPS.map((s, i) => (
              <button key={s} type="button" aria-current={s === step ? "step" : undefined} className={s === step ? "on" : ""} onClick={() => setStep(s)}>
                <span className="n">{i + 1}</span>
                {stepLabel(t, s)}
              </button>
            ))}
          </div>
          <div className="sp" />
          <button type="button" className="btn ghost" onClick={() => setShowArt((v) => !v)} aria-label={showArt ? t.showBefore : t.showAfter}>
            {showArt ? <EyeOff size={16} aria-hidden /> : <Eye size={16} aria-hidden />}
            <span className="hide-sm">{showArt ? t.showBefore : t.showAfter}</span>
          </button>
          <button type="button" className="btn" onClick={exportPng} disabled={busy === "export"} aria-label={t.export}>
            <Download size={16} aria-hidden />
            <span className="hide-sm">{busy === "export" ? t.exporting : t.export}</span>
          </button>
        </div>
        <div className="view" style={{ "--ratio": `${photoRatio}` } as CSSProperties}>
          <Stage
            project={project}
            editable={step === "fit"}
            showArt={showArt}
            onQuad={(quad) => update({ quad })}
            label={`${project.name}, ${showArt ? t.after : t.before}`}
            tag={showArt ? t.after : t.before}
            cornerLabels={t.corners}
          />
        </div>
      </section>

      <aside className="side right">
        <label className="text">
          <span>{t.project}</span>
          <input value={project.name} maxLength={40} onChange={(e) => update({ name: e.target.value })} />
        </label>
        <h4>{t.shutter}</h4>
        <div className="dims">
          <label>
            <span>{t.width}</span>
            <span className="unit">
              <input inputMode="decimal" value={project.width} onChange={(e) => update({ width: e.target.value })} aria-invalid={!est} />
              {t.metres}
            </span>
          </label>
          <label>
            <span>{t.height}</span>
            <span className="unit">
              <input inputMode="decimal" value={project.height} onChange={(e) => update({ height: e.target.value })} aria-invalid={!est} />
              {t.metres}
            </span>
          </label>
        </div>
        {!est && <p className="warn">{t.sizeInvalid}</p>}
        <div className="price">
          <small>{t.estimate}</small>
          <div className="big">{est ? money(est.total, lang) : "–"}</div>
          {est && (
            <>
              <div className="row">
                <span>{t.area}</span>
                <b>{num(est.area, lang)} m²</b>
              </div>
              <div className="row">
                <span>{t.paint}</span>
                <b>{money(est.paint, lang)}</b>
              </div>
              <div className="row">
                <span>{t.designFee}</span>
                <b>{money(est.design, lang)}</b>
              </div>
              {est.minimumApplied && <p className="note">{t.minimum}</p>}
            </>
          )}
          <p className="note">{t.rateNote}</p>
        </div>
        <div className="sp" />
        <button type="button" className="btn wide" onClick={save} disabled={busy === "save"}>
          {justSaved ? <Check size={16} aria-hidden /> : <Save size={16} aria-hidden />} {busy === "save" ? t.saving : justSaved ? t.savedOk : t.save}
        </button>
      </aside>
      {notice && (
        <div className="toast" role="status">
          {notice}
        </div>
      )}
    </main>
  );
}
