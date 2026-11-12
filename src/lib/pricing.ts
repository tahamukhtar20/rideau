// Indicative price for painting a shutter. The rates are illustrative, not a real tariff.

export const RATE_PER_M2 = 150;
export const DESIGN_FEE = 120;
export const MINIMUM = 450;

export type Estimate = { area: number; paint: number; design: number; total: number; minimumApplied: boolean };

/** Width and height in metres. Returns null for sizes that are not usable. */
export function estimate(width: number, height: number): Estimate | null {
  if (!(width > 0 && height > 0 && width <= 30 && height <= 15)) return null;
  const area = Math.round(width * height * 100) / 100;
  const paint = Math.round(area * RATE_PER_M2);
  const sum = paint + DESIGN_FEE;
  const total = Math.max(sum, MINIMUM);
  return { area, paint, design: DESIGN_FEE, total, minimumApplied: total > sum };
}

/** Parse a length typed by a person, accepting a comma as decimal separator. */
export function parseMetres(text: string): number {
  const n = Number(text.trim().replace(",", "."));
  return Number.isFinite(n) ? n : NaN;
}
