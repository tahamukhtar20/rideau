// The photo with the artwork warped onto the shutter, and (when editable) draggable corners.
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import type { KeyboardEvent, PointerEvent as RPointerEvent } from "react";
import { artSvg } from "./lib/art.ts";
import { isConvex, matrix3d } from "./lib/geometry.ts";
import type { Point, Quad } from "./lib/geometry.ts";
import { photoInfo } from "./project.ts";
import type { Project } from "./project.ts";
import { artPixels, shutterSize, slatPeriod } from "./render.ts";

type Props = {
  project: Project;
  editable?: boolean;
  showArt?: boolean;
  onQuad?: (q: Quad) => void;
  label: string;
  /** Accessible names for the four corner handles, in quad order. */
  cornerLabels?: string[];
  /** Small caption shown in the photo's corner. */
  tag?: string;
};

export function Stage({ project, editable = false, showArt = true, onQuad, label, cornerLabels = [], tag }: Props) {
  const info = photoInfo(project.photo);
  const outer = useRef<HTMLDivElement>(null);
  const [box, setBox] = useState({ w: 0, h: 0 });

  // Fit the photo inside the space the parent gives us.
  useLayoutEffect(() => {
    const el = outer.current!;
    const fit = () => {
      const r = el.getBoundingClientRect();
      const k = Math.min(r.width / info.w, r.height / info.h);
      setBox({ w: info.w * k, h: info.h * k });
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, [info.w, info.h]);

  const k = box.w / info.w || 0;
  const size = shutterSize(project);
  const { w: artW, h: artH } = artPixels(size);
  const svg = useMemo(() => artSvg(project.art, size.w, size.h, artW), [project.art, size.w, size.h, artW]);
  const shown = project.quad.map((p) => ({ x: p.x * k, y: p.y * k })) as Quad;
  let transform = "";
  try {
    if (k > 0) transform = matrix3d(artW, artH, shown);
  } catch {
    transform = "";
  }
  const period = slatPeriod(artW, size.w);

  // ---- dragging ----
  const drag = useRef<{ corner: number | "all"; start: Point; quad: Quad } | null>(null);
  const [active, setActive] = useState<number | null>(null);

  const move = (corner: number | "all", base: Quad, dx: number, dy: number) => {
    const clamp = (p: Point) => ({ x: Math.min(info.w, Math.max(0, p.x)), y: Math.min(info.h, Math.max(0, p.y)) });
    let next: Quad;
    if (corner === "all") {
      // Keep the whole outline inside the photo.
      const xs = base.map((p) => p.x), ys = base.map((p) => p.y);
      const ddx = Math.min(Math.max(dx, -Math.min(...xs)), info.w - Math.max(...xs));
      const ddy = Math.min(Math.max(dy, -Math.min(...ys)), info.h - Math.max(...ys));
      next = base.map((p) => ({ x: p.x + ddx, y: p.y + ddy })) as Quad;
    } else {
      next = base.map((p, i) => (i === corner ? clamp({ x: p.x + dx, y: p.y + dy }) : p)) as Quad;
    }
    // Refuse shapes that cross over themselves; the corner just stops.
    if (isConvex(next)) onQuad?.(next);
  };

  const onDown = (corner: number | "all") => (e: RPointerEvent) => {
    if (!editable) return;
    e.preventDefault();
    (e.currentTarget as Element).setPointerCapture(e.pointerId);
    drag.current = { corner, start: { x: e.clientX, y: e.clientY }, quad: project.quad };
    if (corner !== "all") setActive(corner);
  };
  const onMove = (e: RPointerEvent) => {
    const d = drag.current;
    if (!d || !k) return;
    move(d.corner, d.quad, (e.clientX - d.start.x) / k, (e.clientY - d.start.y) / k);
  };
  const onUp = () => {
    drag.current = null;
    setActive(null);
  };
  const onKey = (corner: number) => (e: KeyboardEvent) => {
    const step = (e.shiftKey ? 10 : 1) / (k || 1);
    const d = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] }[e.key];
    if (!d) return;
    e.preventDefault();
    move(corner, project.quad, d[0], d[1]);
  };
  useEffect(() => {
    if (!editable) setActive(null);
  }, [editable]);

  return (
    <div className="stage" ref={outer}>
      <div className="stage-box" style={{ width: box.w, height: box.h }}>
        {/* The picture is one image for assistive tech; the handles below stay separate controls. */}
        <div className="picture" role="img" aria-label={label}>
          <img src={info.url} alt="" draggable={false} />
          {showArt && transform && (
            <div className="art" style={{ width: artW, height: artH, transform }}>
              <div className="art-svg" dangerouslySetInnerHTML={{ __html: svg }} />
              <div className="slats" style={{ backgroundSize: `100% ${period}px` }} />
            </div>
          )}
        </div>
        {tag && <span className="tag">{tag}</span>}
        {editable && k > 0 && (
          <>
            <svg className="outline" width={box.w} height={box.h} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp}>
              <polygon points={shown.map((p) => `${p.x},${p.y}`).join(" ")} onPointerDown={onDown("all")} />
            </svg>
            {shown.map((p, i) => (
              <button
                key={i}
                type="button"
                className={`handle${active === i ? " on" : ""}`}
                style={{ left: p.x, top: p.y }}
                aria-label={cornerLabels[i]}
                onPointerDown={onDown(i)}
                onPointerMove={onMove}
                onPointerUp={onUp}
                onPointerCancel={onUp}
                onFocus={() => setActive(i)}
                onBlur={() => setActive(null)}
                onKeyDown={onKey(i)}
              />
            ))}
          </>
        )}
      </div>
    </div>
  );
}
