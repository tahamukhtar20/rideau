// English and French copy. The original site was French; English is the default.
import { useEffect, useState } from "react";

export type Lang = "en" | "fr";

const en = {
  studio: "Studio",
  how: "How it works",
  openStudio: "Open the studio",
  trySample: "Try a sample shop",
  heroTitle: "Try artwork on your shop's shutter before you paint it",
  heroBody:
    "Take a photo of your storefront, mark the four corners of the shutter and try designs on it. Rideau shows the result in perspective and works out the area and an estimate.",
  shutter: "Shutter",
  estimate: "Estimate",
  stepPhoto: "Photo",
  stepFit: "Fit",
  stepDress: "Dress",
  stepQuote: "Quote",
  stepPhotoBody: "Upload a straight-on photo of the storefront, or use one of the sample shops.",
  stepFitBody: "Drag the four corners onto the shutter's edges and enter its size.",
  stepDressBody: "Choose a design and a palette. Patterns keep their real size on the shutter.",
  stepQuoteBody: "See the area and an estimate, then download the mockup.",
  samples: "Sample shops",
  upload: "Upload a photo",
  uploading: "Reading the photo…",
  uploadFailed: "That file could not be read as an image.",
  saved: "Saved projects",
  noSaved: "Projects you save appear here. They stay in this browser.",
  open: "Open",
  remove: "Delete",
  fitHelp: "Drag the round handles onto the corners of the shutter. Drag inside the outline to move it. Arrow keys nudge a selected handle.",
  resetCorners: "Reset corners",
  width: "Width",
  height: "Height",
  metres: "m",
  sizeInvalid: "Enter a width up to 30 m and a height up to 15 m.",
  designs: "Design",
  palette: "Palette",
  scale: "Pattern size",
  shopName: "Text",
  area: "Area",
  paint: "Painting",
  designFee: "Design",
  minimum: "Minimum order applies",
  total: "Total",
  rateNote: "Illustrative rates: €150 per m² plus a €120 design fee, €450 minimum.",
  project: "Project",
  untitled: "My shop",
  save: "Save project",
  savedOk: "Saved",
  export: "Download mockup",
  exporting: "Preparing…",
  before: "Before",
  after: "After",
  showBefore: "Show before",
  showAfter: "Show after",
  next: "Next",
  back: "Back",
  summary: "Summary",
  footer: "An anonymised client project by Taha Mukhtar. Rates are illustrative and the shops are fictional.",
  source: "Source code",
  designsTitle: "Designs",
  designsBody: "Nine designs in six palettes, drawn as SVG. The lettering design uses your shop's name.",
  language: "Language",
  corners: ["Top left corner", "Top right corner", "Bottom right corner", "Bottom left corner"],
  saveFailed: "The project could not be saved in this browser.",
  exportFailed: "The mockup could not be created.",
  saving: "Saving…",
  confirmDelete: "Delete?",
  stepsLabel: "Steps",
  designNames: { waves: "Waves", terrazzo: "Terrazzo", leaves: "Leaves", stripes: "Stripes", arcade: "Arcade", dots: "Dots", blocks: "Blocks", sunrise: "Sunrise", lettering: "Lettering" } as Record<string, string>,
  paletteNames: { dusk: "Dusk", sage: "Sage", candy: "Candy", noir: "Noir", sea: "Sea", clay: "Clay" } as Record<string, string>,
};

const fr: typeof en = {
  studio: "Studio",
  how: "Fonctionnement",
  openStudio: "Ouvrir le studio",
  trySample: "Essayer une boutique exemple",
  heroTitle: "Essayez un décor sur le rideau de votre boutique avant de le peindre",
  heroBody:
    "Prenez une photo de votre devanture, placez les quatre coins du rideau et essayez des décors. Rideau affiche le résultat en perspective et calcule la surface et une estimation.",
  shutter: "Rideau",
  estimate: "Estimation",
  stepPhoto: "Photo",
  stepFit: "Cadrage",
  stepDress: "Décor",
  stepQuote: "Devis",
  stepPhotoBody: "Importez une photo de face de la devanture, ou utilisez une boutique exemple.",
  stepFitBody: "Placez les quatre coins sur les bords du rideau et saisissez ses dimensions.",
  stepDressBody: "Choisissez un décor et une palette. Les motifs gardent leur taille réelle.",
  stepQuoteBody: "Consultez la surface et l'estimation, puis téléchargez la maquette.",
  samples: "Boutiques exemples",
  upload: "Importer une photo",
  uploading: "Lecture de la photo…",
  uploadFailed: "Ce fichier ne peut pas être lu comme une image.",
  saved: "Projets enregistrés",
  noSaved: "Vos projets enregistrés apparaissent ici. Ils restent dans ce navigateur.",
  open: "Ouvrir",
  remove: "Supprimer",
  fitHelp: "Faites glisser les poignées rondes sur les coins du rideau. Glissez à l'intérieur du contour pour le déplacer. Les flèches déplacent la poignée sélectionnée.",
  resetCorners: "Réinitialiser les coins",
  width: "Largeur",
  height: "Hauteur",
  metres: "m",
  sizeInvalid: "Saisissez une largeur jusqu'à 30 m et une hauteur jusqu'à 15 m.",
  designs: "Décor",
  palette: "Palette",
  scale: "Taille du motif",
  shopName: "Texte",
  area: "Surface",
  paint: "Peinture",
  designFee: "Création",
  minimum: "Minimum de commande appliqué",
  total: "Total",
  rateNote: "Tarifs indicatifs : 150 € le m² plus 120 € de création, minimum 450 €.",
  project: "Projet",
  untitled: "Ma boutique",
  save: "Enregistrer",
  savedOk: "Enregistré",
  export: "Télécharger la maquette",
  exporting: "Préparation…",
  before: "Avant",
  after: "Après",
  showBefore: "Voir avant",
  showAfter: "Voir après",
  next: "Suivant",
  back: "Retour",
  summary: "Récapitulatif",
  footer: "Un projet client anonymisé de Taha Mukhtar. Les tarifs sont indicatifs et les boutiques fictives.",
  source: "Code source",
  designsTitle: "Décors",
  designsBody: "Neuf décors en six palettes, dessinés en SVG. Le décor lettrage reprend le nom de votre boutique.",
  language: "Langue",
  corners: ["Coin supérieur gauche", "Coin supérieur droit", "Coin inférieur droit", "Coin inférieur gauche"],
  saveFailed: "Le projet n'a pas pu être enregistré dans ce navigateur.",
  exportFailed: "La maquette n'a pas pu être créée.",
  saving: "Enregistrement…",
  confirmDelete: "Supprimer ?",
  stepsLabel: "Étapes",
  designNames: { waves: "Vagues", terrazzo: "Terrazzo", leaves: "Feuilles", stripes: "Rayures", arcade: "Arcades", dots: "Pois", blocks: "Formes", sunrise: "Soleil levant", lettering: "Lettrage" },
  paletteNames: { dusk: "Crépuscule", sage: "Sauge", candy: "Bonbon", noir: "Noir", sea: "Mer", clay: "Argile" },
};

export type Strings = typeof en;
const DICT: Record<Lang, Strings> = { en, fr };

const KEY = "rideau.lang";
const listeners = new Set<(l: Lang) => void>();

function initial(): Lang {
  try {
    const saved = localStorage.getItem(KEY);
    if (saved === "en" || saved === "fr") return saved;
  } catch {
    /* storage can be unavailable */
  }
  return navigator.language?.toLowerCase().startsWith("fr") ? "fr" : "en";
}
let current: Lang = initial();

export function setLang(l: Lang) {
  current = l;
  try {
    localStorage.setItem(KEY, l);
  } catch {
    /* ignore */
  }
  document.documentElement.lang = l;
  listeners.forEach((f) => f(l));
}

/** Current language and its strings; re-renders when the language changes. */
export function useLang(): { lang: Lang; t: Strings } {
  const [lang, set] = useState(current);
  useEffect(() => {
    listeners.add(set);
    return () => void listeners.delete(set);
  }, []);
  return { lang, t: DICT[lang] };
}

export const money = (n: number, lang: Lang) =>
  new Intl.NumberFormat(lang === "fr" ? "fr-FR" : "en-IE", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);
export const num = (n: number, lang: Lang, digits = 2) =>
  new Intl.NumberFormat(lang === "fr" ? "fr-FR" : "en-GB", { minimumFractionDigits: digits, maximumFractionDigits: digits }).format(n);
