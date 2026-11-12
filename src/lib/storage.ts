/**
 * 本機示範資料（localStorage）。只保存最低必要、非敏感的示範資料：
 * 不保存姓名、Email、電話與補充說明。瀏覽器不允許時自動略過。
 */
const PREFIX = 'fieldwise:demo:';
const EVENT = 'fieldwise:storage';

export function readJSON<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(PREFIX + key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function writeJSON(key: string, value: unknown): boolean {
  try {
    window.localStorage.setItem(PREFIX + key, JSON.stringify(value));
    window.dispatchEvent(new Event(EVENT));
    return true;
  } catch {
    return false;
  }
}

export function clearDemoData(): number {
  let removed = 0;
  try {
    const keys: string[] = [];
    for (let i = 0; i < window.localStorage.length; i++) {
      const k = window.localStorage.key(i);
      if (k && k.startsWith(PREFIX)) keys.push(k);
    }
    keys.forEach((k) => window.localStorage.removeItem(k));
    removed = keys.length;
  } catch {
    /* 無法存取時視為沒有資料 */
  }
  window.dispatchEvent(new Event(EVENT));
  return removed;
}

export function onDemoStorageChange(cb: () => void) {
  window.addEventListener(EVENT, cb);
  window.addEventListener('storage', cb);
  return () => {
    window.removeEventListener(EVENT, cb);
    window.removeEventListener('storage', cb);
  };
}

/** 本機示範洽詢：只含非敏感欄位 */
export interface LocalInquiry {
  id: string;
  createdAt: string;
  region: string;
  clientType: string;
  problems: string[];
  plan: string;
  startTime: string;
}

export const INQUIRY_KEY = 'inquiries';
