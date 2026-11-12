// A mockup project and where it is kept (IndexedDB, in this browser only).
import type { ArtSpec } from "./lib/art.ts";
import type { Quad } from "./lib/geometry.ts";
import { SCENE_SIZE, sceneById, svgUrl } from "./lib/scenes.ts";

export type Photo = { kind: "scene"; id: string } | { kind: "image"; dataUrl: string; w: number; h: number };

export type Project = {
  id: string;
  name: string;
  updated: number;
  photo: Photo;
  /** Shutter corners in photo pixels. */
  quad: Quad;
  /** As typed, so half-finished input survives a re-render. */
  width: string;
  height: string;
  art: ArtSpec;
};

export const DEFAULT_ART: ArtSpec = { design: "waves", palette: "dusk", scale: 1, text: "" };

export function photoInfo(p: Photo): { url: string; w: number; h: number } {
  if (p.kind === "image") return { url: p.dataUrl, w: p.w, h: p.h };
  const s = sceneById(p.id);
  return { url: s ? svgUrl(s.svg) : "", ...SCENE_SIZE };
}

export const newId = () => Math.random().toString(36).slice(2, 10);

export function fromScene(id: string, name: string, art: ArtSpec = DEFAULT_ART): Project {
  const s = sceneById(id) ?? sceneById("lune")!;
  return {
    id: newId(),
    name,
    updated: Date.now(),
    photo: { kind: "scene", id: s.id },
    quad: s.quad.map((p) => ({ ...p })) as Quad,
    width: String(s.widthM),
    height: String(s.heightM),
    art: { ...art, text: art.text || s.name },
  };
}

/** A starting outline for an uploaded photo: the middle half of the frame. */
export function defaultQuad(w: number, h: number): Quad {
  return [
    { x: w * 0.25, y: h * 0.3 },
    { x: w * 0.75, y: h * 0.3 },
    { x: w * 0.75, y: h * 0.8 },
    { x: w * 0.25, y: h * 0.8 },
  ];
}

export function initialQuad(p: Photo): Quad {
  if (p.kind === "scene") return (sceneById(p.id)?.quad ?? defaultQuad(SCENE_SIZE.w, SCENE_SIZE.h)).map((q) => ({ ...q })) as Quad;
  return defaultQuad(p.w, p.h);
}

/** Read an uploaded file into a JPEG data URL no larger than 1600 px on its long side. */
export async function readPhoto(file: File): Promise<Photo> {
  const url = URL.createObjectURL(file);
  try {
    const img = await loadImage(url);
    const k = Math.min(1, 1600 / Math.max(img.naturalWidth, img.naturalHeight));
    const w = Math.round(img.naturalWidth * k), h = Math.round(img.naturalHeight * k);
    const c = document.createElement("canvas");
    c.width = w;
    c.height = h;
    c.getContext("2d")!.drawImage(img, 0, 0, w, h);
    return { kind: "image", dataUrl: c.toDataURL("image/jpeg", 0.86), w, h };
  } finally {
    URL.revokeObjectURL(url);
  }
}

export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("image failed to load"));
    img.src = src;
  });
}

// ---------- storage ----------

const DB = "rideau", STORE = "projects";

function db(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB, 1);
    req.onupgradeneeded = () => req.result.createObjectStore(STORE, { keyPath: "id" });
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function tx<T>(mode: IDBTransactionMode, run: (s: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  const d = await db();
  try {
    // Resolve only once the transaction has committed, so a failed write is never reported as saved.
    return await new Promise<T>((resolve, reject) => {
      const t = d.transaction(STORE, mode);
      const req = run(t.objectStore(STORE));
      t.oncomplete = () => resolve(req.result);
      t.onerror = () => reject(t.error ?? req.error);
      t.onabort = () => reject(t.error ?? new Error("transaction aborted"));
    });
  } finally {
    d.close();
  }
}

export type SavedProject = Project & { thumb: string };

export const listProjects = async () =>
  (await tx<SavedProject[]>("readonly", (s) => s.getAll())).sort((a, b) => b.updated - a.updated);
export const saveProject = (p: SavedProject) => tx("readwrite", (s) => s.put(p));
export const deleteProject = (id: string) => tx("readwrite", (s) => s.delete(id));
