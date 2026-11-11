export const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());

export const normalizePhone = (v: string) => v.replace(/[\s\-()（）]/g, '');

/** 基本檢查：臺灣手機 09xxxxxxxx、市話 0x-xxxxxxx(x)、或 +886 開頭 */
export function isTwPhone(v: string) {
  const p = normalizePhone(v);
  if (/^\+8869\d{8}$/.test(p)) return true;
  if (/^09\d{8}$/.test(p)) return true;
  if (/^0[2-8]\d{6,8}(#\d{1,6})?$/.test(p)) return true;
  return false;
}

export function maskEmail(v: string) {
  const [user, domain] = v.split('@');
  if (!domain) return v;
  return `${user.slice(0, 2)}${'•'.repeat(Math.max(1, user.length - 2))}@${domain}`;
}

export function maskPhone(v: string) {
  const p = normalizePhone(v);
  if (p.length < 8) return p;
  return `${p.slice(0, 4)}${'•'.repeat(Math.max(1, p.length - 7))}${p.slice(-3)}`;
}
