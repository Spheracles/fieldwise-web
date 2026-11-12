/**
 * 服務定義與交付邊界（A–F）。網站上的服務卡、服務細節、診斷推薦都讀這份資料。
 */
import type { IconName } from '../components/ui/Icon';
import type { ProblemId } from './form';

export type ServiceId = 'management' | 'automation' | 'proposal' | 'transition' | 'land' | 'governance';

export interface Service {
  id: ServiceId;
  code: string;
  title: string;
  /** 分頁標籤用的短名稱 */
  tab: string;
  short: string;
  summary: string;
  icon: IconName;
  tier: 'core' | 'secondary' | 'support';
  includes: string[];
  deliverables: string[];
  fit: string;
  boundary: string[];
  compliance?: string;
  relatedProblem: ProblemId;
  /** 延伸閱讀：產地故事專欄文章 id */
  stories?: string[];
}

export const SERVICES: Service[] = [
  {
    id: 'management',
    code: 'A',
    title: '企業經營陪跑',
    tab: '企業經營陪跑',
    short: '營運盤點、成本與人力規劃，建立每月可追蹤的經營節奏。',
    summary: '把散在腦袋裡的經營判斷，整理成看得見的數字、流程與每月行動清單。',
    icon: 'handshake',
    tier: 'core',
    includes: [
      '營運盤點與營利模式梳理',
      '成本與現金流初步整理',
      '人力工時規劃與排班原則',
      '標準作業流程（SOP）建立',
      '每月陪跑會議與行動清單',
      '追蹤儀表板（試算表或輕量工具）',
    ],
    deliverables: ['營運盤點摘要', '每月行動清單', '成本／工時追蹤表', '進度追蹤儀表板'],
    fit: '想知道錢花在哪、人力怎麼排，希望經營有固定節奏的農場與農業公司。',
    boundary: ['正式會計帳務、稅務申報與法律意見，由合格會計師與律師提供。'],
    relatedProblem: 'labor',
  },
  {
    id: 'automation',
    code: 'B',
    title: 'AI 訂單自動化',
    tab: 'AI 訂單自動化',
    short: '把 LINE、電話、紙本訂單收攏，設計簡單好用的流程與通知。',
    summary: '從你現在已經在用的 LINE、表單與試算表開始，讓訂單不漏接、出貨看得到。',
    icon: 'workflow',
    tier: 'core',
    includes: [
      '訂單與工作流程需求盤點',
      'LINE／表單／試算表訂單整理',
      '工作流程設計與狀態定義',
      '簡單通知與報表',
      '員工操作教學',
    ],
    deliverables: ['流程圖與欄位規格', '訂單整理試算表或表單', '操作教學說明'],
    fit: '訂單來自多個管道、常需要人工對帳或擔心漏單的農場。',
    boundary: [
      '方案內的「需求設計」不等於完整系統開發；正式 API 串接需另行報價並取得合法授權。',
      '未經你同意，不會把客戶個資、訂單或企劃內容提供給外部 AI 服務。',
    ],
    relatedProblem: 'orders',
    stories: ['story-fruit-journey'],
  },
  {
    id: 'proposal',
    code: 'C',
    title: '農業企劃申請陪跑',
    tab: '企劃申請陪跑',
    short: '盤點資格、整理文件與預算，陪你把計畫書寫清楚、時程顧好。',
    summary: '把「不知道從哪裡開始」的申請，拆成資格、文件、預算、時程四件事，一起逐項完成。',
    icon: 'file-pen',
    tier: 'core',
    includes: ['申請資格初步盤點', '政策與公告查詢', '文件與計畫書整理', '預算配置建議', '送件時程追蹤'],
    deliverables: ['資格與文件檢核表', '計畫書架構與內容整理', '預算配置表', '送件時程表'],
    fit: '想申請計畫或補助，但不熟悉公告、文件與預算編列方式的農友與團體。',
    boundary: ['不承諾申請資格、審查通過或一定取得補助。'],
    compliance: '實際資格、補助項目與審查結果，以主管機關及農會當期公告為準。',
    relatedProblem: 'proposal',
  },
  {
    id: 'transition',
    code: 'D',
    title: '親子農場轉型',
    tab: '親子農場轉型',
    short: '設計農事體驗活動、預約動線與收支預估，穩健踏出轉型第一步。',
    summary: '從場域盤點、活動設計到安全與收支評估，先小規模試辦，再決定要不要擴大。',
    icon: 'trees',
    tier: 'core',
    includes: ['親子農事活動設計', '預約與現場動線規劃', '風險與安全初步檢查', '收支預估', '品牌與行銷規劃'],
    deliverables: ['活動模組企劃', '動線與人力配置圖', '安全初查清單', '收支試算表'],
    fit: '想把農場延伸成農事教育或親子體驗場域，但還沒有完整規劃的業者。',
    boundary: ['不代為取得休閒農場許可或其他法定許可。'],
    compliance:
      '親子農事體驗不等於依法核准的「休閒農場」。若涉及休閒農場申設、農地使用、建物、消防、食品、保險與觀光相關規範，需依個案向主管機關查核。',
    relatedProblem: 'family',
    stories: ['story-kids-orchard', 'story-orchard-learning'],
  },
  {
    id: 'land',
    code: 'E',
    title: '農地環境盤點及整理改善協調',
    tab: '農地環境協調',
    short: '盤點農地現況與整理需求，比較報價、協調合格廠商執行。',
    summary: '我們負責盤點、規劃與協調；需要專業資格的檢測、清運與工程，交給合格廠商。',
    icon: 'shovel',
    tier: 'secondary',
    includes: ['農地現況盤點', '整理與改善需求整理', '環境監測需求盤點', '廠商報價比較', '合格廠商媒合與專案協調'],
    deliverables: ['現況盤點紀錄', '改善計畫建議', '報價比較表', '專案協調時程'],
    fit: '農地閒置、雜亂或需要改善，卻不知道該找誰、怎麼比價的地主與經營者。',
    boundary: [
      '我們不是環境檢驗機構，不出具檢測報告。',
      '不以一般顧問名義承攬需有資格的清運、檢測或工程業務。',
    ],
    compliance: '專業環境檢測、廢棄物清理與土木工程，須由具備相應資格或許可的業者執行。',
    relatedProblem: 'land',
  },
  {
    id: 'governance',
    code: 'F',
    title: '法務與公司治理資訊整理',
    tab: '法務治理資訊',
    short: '整理營運流程、公司設立與營利模式相關資訊，必要時轉介專業人士。',
    summary: '先把問題與資料整理好，讓你和律師、會計師溝通時更有效率。',
    icon: 'scale',
    tier: 'support',
    includes: ['一般營運流程資訊整理', '公司設立方向資訊整理', '營利模式與分潤架構資料整理', '合格律師／會計師轉介'],
    deliverables: ['問題與資料整理清單', '諮詢前準備摘要'],
    fit: '準備成立公司、調整合作架構，想先把問題整理清楚的經營者。',
    boundary: ['本網站與顧問不提供專屬法律、會計或稅務意見；正式意見由合格律師與會計師提供。'],
    relatedProblem: 'funds',
  },
];

export const getService = (id: ServiceId) => SERVICES.find((s) => s.id === id)!;
