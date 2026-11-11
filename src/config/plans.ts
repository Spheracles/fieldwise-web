/**
 * 陪跑方案設定（市場測試用假設價格，非已核准對外售價）。
 * 價格、時數、交付項目都只在這裡修改；季費＝一次支付 3 個月的總額。
 */
export type PlanId = 'seed' | 'grow' | 'deep';
export type Billing = 'monthly' | 'quarterly';

export interface Plan {
  id: PlanId;
  name: string;
  label: string;
  tagline: string;
  audience: string;
  monthly: number;
  /** 一次支付 3 個月的總額 */
  quarterly: number;
  meetings: string;
  hours: string;
  includesPrevious?: string;
  features: string[];
  recommended?: boolean;
  icon: 'sprout' | 'leaf' | 'trees';
}

export const QUARTER_MONTHS = 3;

export const PLANS: Plan[] = [
  {
    id: 'seed',
    name: '啟程',
    label: '基礎陪跑',
    tagline: '先把問題理清楚，建立第一套經營節奏。',
    audience: '小農、青年農民、創業前期',
    monthly: 9800,
    quarterly: 27900,
    meetings: '每月 1 次線上會議',
    hours: '每月最多 2 小時遠端陪跑',
    features: ['每月行動清單與進度追蹤', '基礎預算範本', '基礎工時範本'],
    icon: 'sprout',
  },
  {
    id: 'grow',
    name: '茁壯',
    label: '營運升級',
    tagline: '已經有訂單與人手，開始把流程變成制度。',
    audience: '已有訂單與人員的農場',
    monthly: 24800,
    quarterly: 70700,
    meetings: '每月 2 次線上會議',
    hours: '每月最多 6 小時遠端陪跑',
    includesPrevious: '包含「啟程」所有項目',
    features: ['1 項流程梳理與標準化（SOP）', '營運指標追蹤', 'AI 工作流程需求設計'],
    recommended: true,
    icon: 'leaf',
  },
  {
    id: 'deep',
    name: '深耕',
    label: '轉型共創',
    tagline: '多場域、多團隊，一起規劃中長期轉型。',
    audience: '農業企業、多場域業者',
    monthly: 49800,
    quarterly: 141900,
    meetings: '每月 4 次例會／工作坊',
    hours: '每月最多 12 小時顧問服務',
    includesPrevious: '包含「茁壯」所有項目',
    features: ['至多 2 條自動化流程規格設計', '跨領域廠商協作', '季度管理回顧'],
    icon: 'trees',
  },
];

/** 方案比較表：值為 true／false／文字 */
export const PLAN_COMPARISON: { label: string; values: Record<PlanId, string | boolean> }[] = [
  { label: '線上會議／工作坊', values: { seed: '每月 1 次', grow: '每月 2 次', deep: '每月 4 次' } },
  { label: '遠端陪跑／顧問時數', values: { seed: '最多 2 小時／月', grow: '最多 6 小時／月', deep: '最多 12 小時／月' } },
  { label: '行動清單與進度追蹤', values: { seed: true, grow: true, deep: true } },
  { label: '預算與工時範本', values: { seed: '基礎範本', grow: true, deep: true } },
  { label: '流程梳理與標準化', values: { seed: false, grow: '1 項', deep: true } },
  { label: '營運指標追蹤', values: { seed: false, grow: true, deep: true } },
  { label: 'AI 工作流程需求設計', values: { seed: false, grow: true, deep: true } },
  { label: '自動化流程規格設計', values: { seed: false, grow: false, deep: '至多 2 條' } },
  { label: '跨領域廠商協作', values: { seed: false, grow: false, deep: true } },
  { label: '季度管理回顧', values: { seed: false, grow: false, deep: true } },
];

/** 所有方案皆不包含、需視個案另計的項目 */
export const PLAN_EXCLUSIONS = [
  '第三方軟體與訂閱費用',
  'API 用量費用',
  '設備採購',
  '正式系統開發',
  '專業檢測',
  '清理工程',
  '法務與會計服務',
  '跨區交通與現場工作',
];

export const PROJECT_QUOTES = [
  { title: '單次經營診斷', desc: '針對單一問題做完整盤點與建議報告，不綁定月費方案。', icon: 'stethoscope' as const },
  { title: '企劃申請專案', desc: '依申請項目的期程與文件量評估，從資格盤點陪到送件追蹤。', icon: 'file-pen' as const },
  { title: '實地勘查', desc: '到場了解農地、動線與作業現場，交通與工時依地點估算。', icon: 'map-pin' as const },
];

export function planPrice(plan: Plan, billing: Billing) {
  const total = billing === 'monthly' ? plan.monthly : plan.quarterly;
  const perMonth = billing === 'monthly' ? plan.monthly : plan.quarterly / QUARTER_MONTHS;
  const saving = billing === 'quarterly' ? plan.monthly * QUARTER_MONTHS - plan.quarterly : 0;
  return { total, perMonth, saving };
}

export const planFullName = (p: Plan) => `${p.name}｜${p.label}`;
