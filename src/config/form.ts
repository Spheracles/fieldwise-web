/** 預約諮詢表單的選項清單 */

export const REGIONS = [
  '基隆市', '臺北市', '新北市', '桃園市', '新竹市', '新竹縣', '苗栗縣', '臺中市',
  '彰化縣', '南投縣', '雲林縣', '嘉義市', '嘉義縣', '臺南市', '高雄市', '屏東縣',
  '宜蘭縣', '花蓮縣', '臺東縣', '澎湖縣', '金門縣', '連江縣',
] as const;

export const ROLES = ['農場主／負責人', '經營者家人／接班二代', '農場員工', '產銷組織／合作社成員', '農業公司人員', '其他'] as const;

export const CLIENT_TYPES = [
  '青年農民／個人農友',
  '小型或家庭農場',
  '農業公司',
  '產銷組織／合作社',
  '轉型中的農地經營者',
  '農事教育／體驗業者',
  '其他',
] as const;

export type ProblemId = 'labor' | 'funds' | 'orders' | 'proposal' | 'family' | 'land' | 'digital' | 'notify' | 'other';

export const PROBLEMS: { id: ProblemId; label: string }[] = [
  { id: 'labor', label: '人力與排班' },
  { id: 'funds', label: '資金、成本與現金流' },
  { id: 'orders', label: '訂單管理' },
  { id: 'proposal', label: '企劃與申請' },
  { id: 'family', label: '親子農事體驗' },
  { id: 'land', label: '農地環境整理' },
  { id: 'digital', label: 'AI 與數位工具導入' },
  { id: 'notify', label: '產季通知與產地體驗' },
  { id: 'other', label: '其他' },
];

export const SCALES = ['未滿 0.5 公頃', '0.5–2 公頃', '2–5 公頃', '5 公頃以上', '尚無農地／不確定'] as const;

export const BUDGETS = ['先了解再說', 'NT$10,000 以下', 'NT$10,000–30,000', 'NT$30,000–60,000', 'NT$60,000 以上'] as const;

export const START_TIMES = ['盡快（一個月內）', '1–3 個月內', '3 個月以上', '先了解，尚未決定'] as const;

export const PLAN_OPTIONS = [
  { value: '', label: '尚未決定' },
  { value: 'seed', label: '啟程｜基礎陪跑' },
  { value: 'grow', label: '茁壯｜營運升級' },
  { value: 'deep', label: '深耕｜轉型共創' },
  { value: 'project', label: '單次診斷／專案報價' },
] as const;

export const NOTES_MAX = 500;
