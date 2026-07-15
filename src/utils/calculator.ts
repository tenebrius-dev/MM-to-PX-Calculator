export function parseInput(val: string): number | null {
  if (!val || val.trim() === '') return null;
  const normalized = val.replace(',', '.');
  const num = parseFloat(normalized);
  if (isNaN(num) || num < 0) return null;
  return num;
}

export const formatOutput = (num: number): string => {
  // Round to 1 decimal place to avoid floating point issues,
  // then convert to string and replace '.' with ','
  let str = (Math.round(num * 10) / 10).toString();
  return str.replace('.', ',');
};

export function mmToPx(mm: number, ppi: number): number {
  return (mm / 25.4) * ppi;
}

export function calculateGross(widthMm: number, heightMm: number, bleedMm: number, ppi: number) {
  const grossWidthMm = widthMm + bleedMm * 2;
  const grossHeightMm = heightMm + bleedMm * 2;
  return {
    widthPx: mmToPx(grossWidthMm, ppi),
    heightPx: mmToPx(grossHeightMm, ppi)
  };
}

export function calculateNet(widthMm: number, heightMm: number, ppi: number) {
  return {
    widthPx: mmToPx(widthMm, ppi),
    heightPx: mmToPx(heightMm, ppi)
  };
}

export function calculateSafeArea(widthMm: number, heightMm: number, marginMm: number) {
  const safeWidthMm = widthMm - marginMm * 2;
  const safeHeightMm = heightMm - marginMm * 2;
  return { safeWidthMm, safeHeightMm };
}
