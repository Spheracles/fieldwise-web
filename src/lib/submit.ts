/**
 * 把預約資料送到 Google 表單（formResponse）。
 * 使用 no-cors 模式：Google 不回傳可讀取的結果，所以只能確認「請求已送出」；
 * 真正是否收到，請以 Google 表單「回覆」分頁或 Email 通知為準。
 */
import { SITE } from '../config/site';

export type FieldKey = keyof typeof SITE.googleForm.fields;

export const formLive = () => SITE.googleForm.enabled;

export async function submitToGoogleForm(values: Record<FieldKey, string>) {
  const { action, fields } = SITE.googleForm;
  const body = new URLSearchParams();
  (Object.keys(fields) as FieldKey[]).forEach((k) => body.append(fields[k], values[k] ?? ''));
  const ctrl = new AbortController();
  const timer = window.setTimeout(() => ctrl.abort(), 15000);
  try {
    await fetch(action, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
      body: body.toString(),
      signal: ctrl.signal,
    });
  } finally {
    window.clearTimeout(timer);
  }
}

/** 同一瀏覽器 60 秒內只能送出一次，避免重複點擊或灌單 */
const KEY = 'fieldwise:lastSubmit';
export function recentlySubmitted() {
  try {
    const t = Number(sessionStorage.getItem(KEY) || 0);
    return Date.now() - t < 60_000;
  } catch {
    return false;
  }
}
export function markSubmitted() {
  try {
    sessionStorage.setItem(KEY, String(Date.now()));
  } catch {
    /* ignore */
  }
}
