export const formatNTD = (n: number) => `NT$${Math.round(n).toLocaleString('zh-TW')}`;

export const formatNumber = (n: number) => Math.round(n).toLocaleString('zh-TW');

/** 2026-11-18 → 11/18（週三） */
export function formatShortDate(iso: string, withWeekday = false) {
  const [y, m, d] = iso.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  const base = `${m}/${d}`;
  if (!withWeekday) return base;
  const wd = ['日', '一', '二', '三', '四', '五', '六'][date.getDay()];
  return `${base}（週${wd}）`;
}

export function daysBetween(fromISO: string, toISO: string) {
  const [y1, m1, d1] = fromISO.split('-').map(Number);
  const [y2, m2, d2] = toISO.split('-').map(Number);
  const a = Date.UTC(y1, m1 - 1, d1);
  const b = Date.UTC(y2, m2 - 1, d2);
  return Math.round((b - a) / 86400000);
}

export const cx = (...classes: (string | false | null | undefined)[]) => classes.filter(Boolean).join(' ');
