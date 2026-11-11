/**
 * 工作台示範資料：全部為虛構，不代表任何真實農場、客戶或營收。
 * 日期以 DEMO_TODAY 為基準，讓到期提醒等計算固定可重現。
 */
import type {
  Budget, DocumentItem, Lead, LeadSource, LeadStage, Metric, Order, RenewalStatus, Task,
} from '../types/domain';
import type { Billing, PlanId } from '../config/plans';

export const DEMO_TODAY = '2026-11-11';

/* ---------------- 客戶工作台 ---------------- */

export const CLIENT_DEMO = {
  org: '示範農場（虛構）',
  plan: 'grow' as PlanId,
  period: '2026 年第 4 季',
  consultant: '顧問 A（示範）',
  nextMeeting: { date: '2026-11-18', time: '14:00', topic: '訂單表單試行回顧', mode: '線上' },

  goals: [
    { title: '建立採收排程與每週人力試算', progress: 70 },
    { title: '訂單收攏到單一表單入口', progress: 45 },
    { title: '完成每月成本四分類紀錄', progress: 85 },
  ],

  pdca: {
    cycle: '第 2 輪：訂單收攏',
    current: 1 as 0 | 1 | 2 | 3,
    steps: [
      { key: 'P', name: '計畫', items: ['定義訂單必填欄位', '訂出狀態：待確認／備貨中／已出貨', '目標：漏單件數由 5 件降到 1 件以下'] },
      { key: 'D', name: '執行', items: ['表單上線，LINE 下單改導向表單', '每日 17:00 彙整一次', '包裝區張貼出貨清單'] },
      { key: 'C', name: '檢核', items: ['比對表單與出貨紀錄', '統計漏單與錯單件數', '收集員工使用回饋'] },
      { key: 'A', name: '改善', items: ['調整欄位與提醒時間', '把有效做法寫進 SOP', '決定下一輪改善主題'] },
    ],
  },

  tasks: [
    { id: 't1', title: '整理 10 月採收與用工紀錄', owner: '農場', due: '2026-11-13', status: 'doing', tag: '排程' },
    { id: 't2', title: '訂單表單欄位確認', owner: '顧問', due: '2026-11-12', status: 'done', tag: '訂單' },
    { id: 't3', title: '包裝區出貨清單試行一週', owner: '農場', due: '2026-11-20', status: 'todo', tag: '訂單' },
    { id: 't4', title: '設計每日彙整通知的需求規格', owner: '顧問', due: '2026-11-19', status: 'doing', tag: 'AI 流程' },
    { id: 't5', title: '11 月成本收據拍照歸檔', owner: '農場', due: '2026-11-30', status: 'todo', tag: '成本' },
    { id: 't6', title: '人力需求試算表第一版', owner: '顧問', due: '2026-11-08', status: 'done', tag: '排程' },
    { id: 't7', title: '臨時工聯絡名單更新', owner: '農場', due: '2026-11-15', status: 'todo', tag: '排程' },
  ] satisfies Task[] as Task[],

  harvest: [
    { day: '一', date: '11/16', crop: '小白菜', need: 4, assigned: 4 },
    { day: '二', date: '11/17', crop: '青江菜', need: 3, assigned: 3 },
    { day: '三', date: '11/18', crop: '小白菜', need: 5, assigned: 3 },
    { day: '四', date: '11/19', crop: '萵苣', need: 2, assigned: 2 },
    { day: '五', date: '11/20', crop: '青江菜、萵苣', need: 6, assigned: 4 },
    { day: '六', date: '11/21', crop: '小白菜', need: 4, assigned: 4 },
    { day: '日', date: '11/22', crop: '休息', need: 0, assigned: 0 },
  ],

  orders: [
    { id: 'FW-1111-01', channel: 'LINE', item: '綜合葉菜箱', qty: 12, shipDate: '2026-11-12', status: '備貨中' },
    { id: 'FW-1111-02', channel: '表單', item: '小白菜 3 斤', qty: 20, shipDate: '2026-11-12', status: '待確認' },
    { id: 'FW-1110-07', channel: '電話', item: '萵苣 5 斤', qty: 6, shipDate: '2026-11-11', status: '已出貨' },
    { id: 'FW-1110-05', channel: '表單', item: '綜合葉菜箱', qty: 8, shipDate: '2026-11-13', status: '待確認' },
    { id: 'FW-1109-03', channel: '紙本', item: '青江菜 3 斤', qty: 15, shipDate: '2026-11-11', status: '已出貨' },
  ] satisfies Order[] as Order[],

  meetings: [
    { date: '2026-11-18', time: '14:00', topic: '訂單表單試行回顧', mode: '線上' },
    { date: '2026-12-02', time: '10:00', topic: '11 月成本與工時回顧', mode: '線上' },
  ],

  budget: [
    { category: '資材', budget: 48000, actual: 41200 },
    { category: '人力', budget: 72000, actual: 76500 },
    { category: '設備與維修', budget: 20000, actual: 12800 },
    { category: '通路與行銷', budget: 15000, actual: 9600 },
  ] satisfies Budget[] as Budget[],

  monthlyProgress: [
    { month: '7 月', value: 40 },
    { month: '8 月', value: 55 },
    { month: '9 月', value: 62 },
    { month: '10 月', value: 70 },
    { month: '11 月', value: 58, partial: true },
  ],

  timesheet: [
    { type: '採收', hours: 186 },
    { type: '田間管理', hours: 120 },
    { type: '包裝與出貨', hours: 94 },
    { type: '行政與訂單', hours: 38 },
  ],

  metrics: [
    { name: '每週臨時調班次數', unit: '次／週', baseline: 6, target: 3, actual: 4, source: '排班表紀錄', cadence: '週', lowerIsBetter: true },
    { name: '每筆訂單處理時間', unit: '分鐘', baseline: 12, target: 6, actual: 9, source: '訂單表時間戳記', cadence: '月', lowerIsBetter: true },
    { name: '漏單與錯單件數', unit: '件／月', baseline: 5, target: 1, actual: 2, source: '出貨回報紀錄', cadence: '月', lowerIsBetter: true },
    { name: '包裝耗損件數', unit: '件／月', baseline: null, target: null, actual: null, source: '包裝紀錄（尚未建立）', cadence: '月', lowerIsBetter: true },
    { name: '灌溉用水量', unit: '度／月', baseline: null, target: null, actual: null, source: '水表讀數（尚未建立）', cadence: '月', lowerIsBetter: true },
    { name: '用電量', unit: '度／月', baseline: null, target: null, actual: null, source: '電費帳單（待彙整）', cadence: '月', lowerIsBetter: true },
  ] satisfies Metric[] as Metric[],

  documents: [
    { id: 'd1', name: '營運盤點摘要', kind: 'PDF', updatedAt: '2026-10-05', status: '已確認' },
    { id: 'd2', name: '採收排程與人力試算表', kind: '試算表', updatedAt: '2026-11-08', status: '已確認' },
    { id: 'd3', name: '訂單表單欄位規格', kind: '文件', updatedAt: '2026-11-10', status: '待確認' },
    { id: 'd4', name: '出貨作業 SOP（草稿）', kind: '文件', updatedAt: '2026-11-10', status: '草稿' },
    { id: 'd5', name: '11 月行動清單', kind: '文件', updatedAt: '2026-11-03', status: '已確認' },
  ] satisfies DocumentItem[] as DocumentItem[],
};

/* ---------------- 管理者工作台 ---------------- */

export const CONSULTANTS = ['顧問 A', '顧問 B', '顧問 C'];
export const LEAD_STAGES: LeadStage[] = ['新洽詢', '已約初談', '盤點報價', '已簽約', '陪跑中', '暫緩'];
export const LEAD_SOURCES: LeadSource[] = ['官網', 'LINE 官方帳號', '農會推廣', '轉介紹', '活動'];

export type DemoLead = Omit<Lead, 'consentAt' | 'assigneeId'> & { assignee: string; local?: boolean };

export const ADMIN_LEADS: DemoLead[] = [
  { id: 'L-1031', createdAt: '2026-11-10', displayName: '林○○', orgName: '示範農場 A', region: '雲林縣', clientType: '小型或家庭農場', problems: ['訂單管理', '人力與排班'], interestedPlan: '茁壯', source: '官網', stage: '新洽詢', assignee: '' },
  { id: 'L-1030', createdAt: '2026-11-09', displayName: '陳○○', orgName: '示範合作社 B', region: '屏東縣', clientType: '產銷組織／合作社', problems: ['企劃與申請'], interestedPlan: '單次診斷', source: '農會推廣', stage: '已約初談', assignee: '顧問 B' },
  { id: 'L-1029', createdAt: '2026-11-07', displayName: '黃○○', orgName: '示範農園 C', region: '宜蘭縣', clientType: '農事教育／體驗業者', problems: ['親子農事體驗', '農地環境整理'], interestedPlan: '深耕', source: '轉介紹', stage: '盤點報價', assignee: '顧問 A' },
  { id: 'L-1027', createdAt: '2026-11-04', displayName: '張○○', orgName: '', region: '臺南市', clientType: '青年農民／個人農友', problems: ['資金、成本與現金流'], interestedPlan: '啟程', source: 'LINE 官方帳號', stage: '已簽約', assignee: '顧問 C' },
  { id: 'L-1024', createdAt: '2026-10-29', displayName: '吳○○', orgName: '示範公司 D', region: '臺中市', clientType: '農業公司', problems: ['AI 與數位工具導入', '訂單管理'], interestedPlan: '深耕', source: '活動', stage: '陪跑中', assignee: '顧問 A' },
  { id: 'L-1021', createdAt: '2026-10-24', displayName: '劉○○', orgName: '示範農場 E', region: '花蓮縣', clientType: '轉型中的農地經營者', problems: ['農地環境整理'], interestedPlan: '單次診斷', source: '官網', stage: '暫緩', assignee: '顧問 B' },
  { id: 'L-1019', createdAt: '2026-10-20', displayName: '蔡○○', orgName: '示範農場 F', region: '彰化縣', clientType: '小型或家庭農場', problems: ['人力與排班'], interestedPlan: '茁壯', source: '轉介紹', stage: '陪跑中', assignee: '顧問 C' },
  { id: 'L-1016', createdAt: '2026-10-15', displayName: '楊○○', orgName: '', region: '嘉義縣', clientType: '青年農民／個人農友', problems: ['企劃與申請', '資金、成本與現金流'], interestedPlan: '啟程', source: 'LINE 官方帳號', stage: '已簽約', assignee: '顧問 B' },
];

export interface DemoSubscription {
  id: string;
  client: string;
  plan: PlanId;
  billing: Billing;
  start: string;
  end: string;
  renewal: RenewalStatus;
}

export const ADMIN_SUBSCRIPTIONS: DemoSubscription[] = [
  { id: 'S-201', client: '示範公司 D', plan: 'deep', billing: 'quarterly', start: '2026-09-01', end: '2026-11-30', renewal: '已聯繫' },
  { id: 'S-202', client: '示範農場 F', plan: 'grow', billing: 'monthly', start: '2026-10-20', end: '2026-11-19', renewal: '待聯繫' },
  { id: 'S-203', client: '示範農友 G', plan: 'seed', billing: 'quarterly', start: '2026-08-15', end: '2026-11-14', renewal: '不續約' },
  { id: 'S-204', client: '示範農場 H', plan: 'grow', billing: 'quarterly', start: '2026-10-01', end: '2026-12-31', renewal: '待聯繫' },
  { id: 'S-205', client: '示範農友 I', plan: 'seed', billing: 'monthly', start: '2026-11-04', end: '2026-12-03', renewal: '待聯繫' },
  { id: 'S-206', client: '示範合作社 J', plan: 'grow', billing: 'monthly', start: '2026-10-28', end: '2026-11-27', renewal: '已續約' },
];

export const ADMIN_TASKS = [
  { id: 'a1', title: '回覆新洽詢並安排初談', client: '示範農場 A', assignee: '', due: '2026-11-12', priority: '高' },
  { id: 'a2', title: '準備盤點報價單', client: '示範農園 C', assignee: '顧問 A', due: '2026-11-14', priority: '高' },
  { id: 'a3', title: '整理計畫公告與資格檢核表', client: '示範合作社 B', assignee: '顧問 B', due: '2026-11-16', priority: '中' },
  { id: 'a4', title: '11 月月會紀錄與行動清單', client: '示範公司 D', assignee: '顧問 A', due: '2026-11-20', priority: '中' },
  { id: 'a5', title: '續約提醒與服務回顧', client: '示範農場 F', assignee: '', due: '2026-11-17', priority: '高' },
];
