/**
 * 首頁文案與內容資料。所有案例為「模擬案例」、所有文章為「內容範例」。
 */
import type { IconName } from '../components/ui/Icon';
import type { ProblemId } from './form';
import type { ServiceId } from './services';
import type { PlanId } from './plans';

export const PAINS: { title: string; desc: string; icon: IconName; points: string[] }[] = [
  {
    title: '人力缺口',
    desc: '採收季一到就缺工，排班靠記憶、電話和 LINE 群組。',
    icon: 'users',
    points: ['臨時工到場時間不一', '工時沒有紀錄可以回頭看'],
  },
  {
    title: '資金壓力',
    desc: '資材、工資常要先墊，錢花在哪裡、還能撐多久說不清楚。',
    icon: 'wallet',
    points: ['農場帳和家用帳混在一起', '不確定哪個品項真的賺錢'],
  },
  {
    title: '訂單混亂',
    desc: '訂單散落在 LINE、電話與紙本，出貨前才發現漏單、錯單。',
    icon: 'clipboard-list',
    points: ['同一位客人在三個地方下單', '月底對帳要翻好幾天'],
  },
  {
    title: '農場轉型',
    desc: '想做農事體驗或親子活動，卻不知道從場域、法規還是行銷開始。',
    icon: 'sprout',
    points: ['不確定需要哪些許可', '不知道收費怎麼訂才合理'],
  },
];

export const MORE_PAINS = ['農地整理不知道找誰', '看不懂計畫公告與申請文件', '成本與現金流不透明', '數位工具買了卻沒人用'];

export const ADVANTAGES: { title: string; desc: string; icon: IconName }[] = [
  {
    title: '青年數位團隊',
    desc: '熟悉 AI 與數位工具，但從你現在用的 LINE、試算表開始，用農場聽得懂的方式導入。',
    icon: 'sparkles',
  },
  {
    title: '符合預算的人力方案',
    desc: '從月費方案起步，依農場階段調整時數與服務內容，不用一開始就投入大筆預算。',
    icon: 'piggy-bank',
  },
  {
    title: '可量測的改善進度',
    desc: '每個改善項目都寫下基準值、目標與資料來源，每月回顧時用紀錄說話，而不是憑感覺。',
    icon: 'gauge',
  },
  {
    title: '跨領域協作',
    desc: '需要專業資格的工作，我們負責整理需求與協調，交給合格的會計師、律師與專業廠商。',
    icon: 'heart-handshake',
  },
];

export const PROCESS_STEPS: { title: string; desc: string; output: string; icon: IconName }[] = [
  { title: '線上需求診斷', desc: '在網站勾選目前的困擾，先看看可能的方向。', output: '初步方向', icon: 'list-checks' },
  { title: '顧問初談', desc: '20 分鐘免費線上初談，釐清最需要先處理的問題。', output: '問題初篩', icon: 'message-circle' },
  { title: '盤點與報價', desc: '了解現場、資料與預算，提出服務範圍與報價。', output: '服務範圍與報價單', icon: 'clipboard-check' },
  { title: '導入及執行', desc: '依行動清單逐項導入流程、工具與制度，一起做。', output: '行動清單與追蹤表', icon: 'tractor' },
  { title: '每月／每季回顧', desc: '對照基準值與目標，調整下一階段的優先順序。', output: '回顧紀錄與下一步', icon: 'refresh-cw' },
];

/* ---------------- 快速診斷 ---------------- */

export type DiagnosisId = 'labor' | 'funds' | 'orders' | 'proposal' | 'family' | 'land';

export const DIAGNOSIS_OPTIONS: {
  id: DiagnosisId;
  label: string;
  icon: IconName;
  service: ServiceId;
  problem: ProblemId;
  direction: string;
  firstStep: string;
}[] = [
  {
    id: 'labor',
    label: '缺人手',
    icon: 'users',
    service: 'management',
    problem: 'labor',
    direction: '先把作物週期與採收高峰排出來，估算每週需要多少人力，再決定排班與招募方式。',
    firstStep: '準備近一季的採收時間與用工紀錄（手寫也可以）。',
  },
  {
    id: 'funds',
    label: '缺資金',
    icon: 'coins',
    service: 'management',
    problem: 'funds',
    direction: '先分清楚農場與家用帳，整理成本類別與現金流，再評估是否適合申請計畫或調整產品組合。',
    firstStep: '整理最近 3 個月的主要支出與收入來源。',
  },
  {
    id: 'orders',
    label: '訂單亂',
    icon: 'shopping-cart',
    service: 'automation',
    problem: 'orders',
    direction: '把各管道訂單收攏到同一個入口，定義訂單狀態，再設計提醒與出貨報表。',
    firstStep: '列出目前接單的管道，以及一筆訂單從接單到出貨經過哪些人。',
  },
  {
    id: 'proposal',
    label: '不會寫企劃',
    icon: 'file-pen',
    service: 'proposal',
    problem: 'proposal',
    direction: '先確認想申請的項目與期程，盤點資格與文件，再一起整理計畫書與預算。',
    firstStep: '找出有興趣的計畫公告或名稱，記下截止日期。',
  },
  {
    id: 'family',
    label: '想做親子農場',
    icon: 'smile',
    service: 'transition',
    problem: 'family',
    direction: '從場域條件、活動設計與安全初查開始，搭配法規查核與收支試算，先小規模試辦。',
    firstStep: '拍下可使用的場域照片，想想希望接待的年齡層與人數。',
  },
  {
    id: 'land',
    label: '需要場域整理',
    icon: 'shovel',
    service: 'land',
    problem: 'land',
    direction: '先盤點農地現況與整理需求，判斷哪些需要合格廠商，再比較報價與排定時程。',
    firstStep: '記錄農地位置、面積與目前的使用狀況。',
  },
];

export function suggestPlan(selected: DiagnosisId[]): { plan: PlanId | 'project'; reason: string } {
  const n = selected.length;
  const has = (id: DiagnosisId) => selected.includes(id);
  if (n >= 4 || (has('family') && has('land'))) {
    return { plan: 'deep', reason: '同時處理多項議題，初談時可評估「深耕｜轉型共創」或改採專案報價。' };
  }
  if (has('orders') || (has('labor') && n >= 2)) {
    return { plan: 'grow', reason: '涉及流程梳理與工具導入，「茁壯｜營運升級」的時數與流程標準化較貼近需求。' };
  }
  if (n === 1 && (has('proposal') || has('land'))) {
    return { plan: 'project', reason: '單一明確任務，可先考慮單次診斷或專案報價，不一定需要月費方案。' };
  }
  return { plan: 'seed', reason: '從「啟程｜基礎陪跑」建立每月行動清單，先把最重要的一件事做好。' };
}

/* ---------------- 模擬案例 ---------------- */

export interface SimCase {
  id: string;
  tab: string;
  title: string;
  persona: string;
  icon: IconName;
  before: string[];
  steps: string[];
  metrics: string[];
  services: ServiceId[];
  note?: string;
}

export const CASES: SimCase[] = [
  {
    id: 'harvest',
    tab: '採收排程',
    title: '小農採收排程混亂',
    persona: '虛構情境：家庭經營的葉菜農場，採收季需要臨時人力',
    icon: 'calendar-days',
    before: ['排班寫在白板與 LINE 群組，常臨時改動', '採收與包裝人力互相卡住', '工時與工資沒有固定紀錄'],
    steps: ['盤點作物週期與採收高峰', '建立採收排程表與每週人力需求試算', '固定每週排班公布時間與通知方式', '每月回顧工時紀錄並調整'],
    metrics: ['每週臨時調班次數', '採收到出貨的時間', '每月人力工時與工資'],
    services: ['management'],
  },
  {
    id: 'orders',
    tab: '訂單管理',
    title: '農場紙本訂單管理',
    persona: '虛構情境：販售禮盒的果園，訂單來自 LINE、電話與紙本',
    icon: 'package',
    before: ['同一位客人在不同管道重複下單', '出貨狀態只有負責人知道', '月底對帳要翻聊天紀錄與紙本'],
    steps: ['統一訂單入口與必填欄位', '定義訂單狀態：待確認→備貨→已出貨', '建立出貨看板與每日彙整', '設計提醒與月報表的需求規格'],
    metrics: ['漏單與錯單件數', '每筆訂單處理時間', '月底對帳所需時間'],
    services: ['automation'],
  },
  {
    id: 'family',
    tab: '親子體驗',
    title: '場域規劃親子體驗',
    persona: '虛構情境：想在週末開辦親子農事體驗的家庭農場',
    icon: 'smile',
    before: ['不確定場地能不能接待親子團', '活動內容、收費與人力都還沒想好', '不清楚需要查核哪些法規'],
    steps: ['場域與動線盤點、安全初查', '設計 2–3 個季節性活動模組', '法規查核清單與保險需求整理', '收支試算後小規模試辦並收集回饋'],
    metrics: ['試辦場次的報名與出席', '參加者回饋', '單場收入與成本'],
    services: ['transition', 'land'],
    note: '是否需申請休閒農場或其他許可，須依個案向主管機關確認。',
  },
];

/* ---------------- 常見問答 ---------------- */

export const FAQS: { q: string; a: string }[] = [
  {
    q: '免費初談會談什麼？需要準備什麼？',
    a: '初談約 20 分鐘、線上進行，目的是初步篩選問題，不是完整診斷。建議先想好農場的基本狀況、目前最困擾的 1–3 件事，以及大概能投入的時間與預算區間。',
  },
  {
    q: '你們能保證補助或計畫申請通過嗎？',
    a: '不能，也不會這樣承諾。我們協助盤點資格、整理文件與預算、追蹤時程；實際資格、補助項目與審查結果，以主管機關及農會當期公告與審查為準。',
  },
  {
    q: '方案價格含稅嗎？季繳怎麼計算？',
    a: '網站上的價格為試營運建議價格、未含營業稅，最終以正式報價為準。季繳是一次支付 3 個月的總額，例如「啟程」季繳為 NT$27,900／3 個月，不是每月金額。',
  },
  {
    q: 'AI 自動化會不會很難？一定要買新系統嗎？',
    a: '不一定。我們通常從你已經在用的 LINE、表單與試算表開始。方案內提供的是流程與需求設計；若需要正式系統開發或 API 串接，會另外說明範圍與報價。',
  },
  {
    q: '我的訂單、客戶與企劃資料會被怎麼使用？',
    a: '只在服務需要的範圍內使用，並依權限控管。未經你同意，不會把客戶個資、訂單或未公開的企劃內容提供給外部 AI 服務。',
  },
  {
    q: '你們有做環境檢測或廢棄物清運嗎？',
    a: '沒有。我們不是環境檢驗機構，也不承攬需要資格的清運、檢測或工程。我們協助盤點需求、比較報價，並協調具備相應資格的廠商執行。',
  },
  {
    q: '想做親子農場，可以直接開始辦活動嗎？',
    a: '建議先做法規與安全查核。親子農事體驗不等於依法核准的「休閒農場」，農地使用、建物、消防、食品與保險等都可能需要個案確認。我們會陪你整理查核清單。',
  },
  {
    q: '服務範圍在哪裡？可以到現場嗎？',
    a: '以線上遠端陪跑為主，全臺都可以洽詢。需要到現場勘查或工作時，交通與工時會依地點另外估算。',
  },
  {
    q: '你們跟農會或政府單位有合作嗎？',
    a: '目前沒有與任何政府機關或農會的合作或背書。網站上列出的官方網站連結僅供參考查詢，我們不隸屬也不代表這些單位。',
  },
];

/* ---------------- 資源專欄（內容範例） ---------------- */

export type ArticleCategory = '農業經營' | 'AI 工具' | '申請資訊' | '法規提醒';

export interface Article {
  id: string;
  category: ArticleCategory;
  title: string;
  excerpt: string;
  minutes: number;
  icon: IconName;
  body: { heading?: string; text?: string; list?: string[] }[];
}

export const ARTICLES: Article[] = [
  {
    id: 'cost-four',
    category: '農業經營',
    title: '先把成本分成四類：小農也看得懂的月度收支表',
    excerpt: '不用會計背景，先把支出分成資材、人力、設備與通路，就能開始看見錢的流向。',
    minutes: 4,
    icon: 'calculator',
    body: [
      { text: '多數農場不是不記帳，而是記了卻看不出重點。先用四個類別整理，每月固定一天更新，三個月後就能看出趨勢。' },
      { heading: '建議的四個類別', list: ['資材：種苗、肥料、包材', '人力：自家與臨時工的工時與工資', '設備與維修：農機、溫室、水電', '通路與行銷：運費、平台費、廣告'] },
      { heading: '三個小習慣', list: ['農場帳與家用帳分開', '收據拍照存在同一個資料夾', '每月固定時間花 30 分鐘更新'] },
      { text: '正式帳務與稅務處理，請與合格會計師確認。' },
    ],
  },
  {
    id: 'harvest-prep',
    category: '農業經營',
    title: '採收季前的排班準備清單',
    excerpt: '人力排班不是採收前一天才想，提前四週準備，現場就能少一半的臨時電話。',
    minutes: 3,
    icon: 'calendar-check',
    body: [
      { heading: '四週前', list: ['依作物週期估算採收高峰週', '列出可聯絡的固定與臨時人力'] },
      { heading: '兩週前', list: ['公布排班表與集合時間', '確認工資、餐點與交通安排'] },
      { heading: '採收期間', list: ['每天記錄實際到場人數與工時', '週末回顧，調整下週排班'] },
    ],
  },
  {
    id: 'line-orders',
    category: 'AI 工具',
    title: '用表單＋試算表收攏 LINE 訂單：導入前先想清楚的 5 件事',
    excerpt: '工具不難，難的是規則。先定義欄位、狀態與負責人，自動化才不會越做越亂。',
    minutes: 5,
    icon: 'workflow',
    body: [
      { text: '很多農場的第一步不是買系統，而是讓所有訂單都進到同一張表。' },
      { heading: '導入前的 5 個問題', list: ['每筆訂單一定要有哪些欄位？', '訂單有哪些狀態？由誰更新？', '客人改單、取消時怎麼處理？', '個資存在哪裡？誰可以看？', '資料多久備份一次？'] },
      { text: '想清楚這些規則後，再決定要用哪些通知與報表工具。' },
    ],
  },
  {
    id: 'ai-privacy',
    category: 'AI 工具',
    title: '把 AI 用在農場文書，哪些資料不該貼上去？',
    excerpt: 'AI 可以幫忙寫文案、整理會議紀錄，但客戶個資與未公開企劃要特別小心。',
    minutes: 3,
    icon: 'shield-check',
    body: [
      { heading: '建議不要直接貼上的資料', list: ['客戶姓名、電話、地址', '未公開的企劃書與預算', '帳務、薪資與合約內容'] },
      { heading: '比較安全的做法', list: ['先把資料去識別化再使用', '確認工具的資料使用條款', '團隊內約定哪些資料可以使用 AI 處理'] },
    ],
  },
  {
    id: 'apply-six',
    category: '申請資訊',
    title: '申請計畫或補助前，先回答這 6 個問題',
    excerpt: '與其急著寫計畫書，不如先確認資格、期程與自籌款，避免白忙一場。',
    minutes: 4,
    icon: 'file-text',
    body: [
      { heading: '六個自我檢核問題', list: ['我符合公告的申請資格嗎？', '申請與執行期程是否和農忙衝突？', '是否需要自籌款？金額多少？', '預算科目有哪些限制？', '需要準備哪些佐證文件？', '計畫結束後，誰負責持續執行？'] },
      { text: '各項計畫的資格與規定不同，請以主管機關及農會當期公告為準。可參考農業部農業數位服務與農業推廣入口網站。' },
    ],
  },
  {
    id: 'leisure-farm',
    category: '法規提醒',
    title: '親子農事體驗和「休閒農場」不一樣：開辦前的查核方向',
    excerpt: '辦一場體驗活動，和經營一座依法核准的休閒農場，是兩件不同的事。',
    minutes: 4,
    icon: 'scroll-text',
    body: [
      { text: '若要以「休閒農場」名義經營，需依《休閒農業輔導管理辦法》等相關規定辦理。一般的農事體驗活動，也可能涉及其他規範。' },
      { heading: '建議逐項確認的方向', list: ['農地與建物的使用是否符合規定', '消防與公共安全', '若提供餐點，食品衛生相關規範', '活動保險', '收費與消費者權益'] },
      { text: '以上為查核方向提示，不是法律意見。實際規定請向主管機關確認，必要時諮詢專業人士。' },
    ],
  },
];

/* ---------------- 關於我們 ---------------- */

export const ABOUT = {
  philosophy: [
    '我們是一群熟悉數位工具、也願意下田了解現場的青年團隊。我們相信農業經營的難題，很少是因為不夠努力，而是缺少一套能持續運作的方法。',
    '所以我們不只給建議，而是陪著你把盤點、規劃、導入與追蹤一步一步做完，讓好的做法留在農場裡，而不是留在顧問的簡報裡。',
  ],
  method: [
    { title: '盤點', desc: '看現場、看資料，找出真正卡住的地方。', icon: 'search' as IconName },
    { title: '規劃', desc: '排出優先順序，寫下可量測的目標。', icon: 'route' as IconName },
    { title: '導入', desc: '從現有工具開始，陪團隊一起上手。', icon: 'tractor' as IconName },
    { title: '追蹤', desc: '每月回顧數字，持續調整。', icon: 'refresh-cw' as IconName },
  ],
  doList: ['經營盤點與每月陪跑', '流程梳理、SOP 與數位工具導入', '企劃申請的資料整理與時程追蹤', '親子農事體驗規劃與法規查核清單', '農地整理需求盤點與廠商協調'],
  dontList: ['保證補助或計畫審查通過', '出具環境檢測報告、承攬清運與工程', '提供專屬法律、會計或稅務意見', '代為取得休閒農場或其他法定許可', '未經同意將你的資料交給外部 AI'],
  team: [
    { role: '經營與財務規劃', note: '成員介紹建置中' },
    { role: '數位工具與流程自動化', note: '成員介紹建置中' },
    { role: '農場轉型與企劃整理', note: '成員介紹建置中' },
  ],
};
