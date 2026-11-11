/**
 * 核心數據埋點（示範）：事件只留在這次瀏覽的記憶體中，不會傳送到任何分析服務。
 * 正式版請在取得使用者同意後，再將 send() 接到合規的分析工具。
 */
export type TrackEventName =
  | 'cta_click'
  | 'billing_toggle'
  | 'plan_inquiry'
  | 'diagnosis_complete'
  | 'form_start'
  | 'form_review'
  | 'form_submit_demo'
  | 'line_click'
  | 'service_view'
  | 'article_open';

export interface TrackEvent {
  name: TrackEventName;
  props: Record<string, string | number | boolean>;
  at: number;
}

const buffer: TrackEvent[] = [];
const listeners = new Set<() => void>();
let snapshot: TrackEvent[] = [];

export function track(name: TrackEventName, props: TrackEvent['props'] = {}) {
  buffer.push({ name, props, at: Date.now() });
  if (buffer.length > 40) buffer.shift();
  snapshot = buffer.slice().reverse();
  listeners.forEach((l) => l());
}

/** 回傳快取的快照（新到舊），供 useSyncExternalStore 使用 */
export const getEvents = () => snapshot;

export function subscribeEvents(l: () => void) {
  listeners.add(l);
  return () => {
    listeners.delete(l);
  };
}

export const EVENT_LABELS: Record<TrackEventName, string> = {
  cta_click: 'CTA 點擊',
  billing_toggle: '方案月／季切換',
  plan_inquiry: '詢問方案',
  diagnosis_complete: '完成需求診斷',
  form_start: '開始填寫表單',
  form_review: '表單送出前檢查',
  form_submit_demo: '表單示範送出',
  line_click: 'LINE 洽詢點擊',
  service_view: '查看服務細節',
  article_open: '開啟專欄文章',
};
