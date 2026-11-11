/**
 * 全站設定：品牌、聯絡管道、示範模式、官方參考連結。
 * 品牌名稱與識別日後只需改這一份檔案。
 */
export const SITE = {
  brand: {
    name: '田序共創',
    en: 'FIELDWISE',
    full: '田序共創｜FIELDWISE',
    descriptor: '農業經營陪跑平台',
    slogan: '讓土地好好生長，讓經營有章可循。',
    sub: '從企劃申請、農場管理到 AI 自動化，陪你建立能長久運作的農業事業。',
    pillars: '農業經營陪跑 × AI 數位轉型 × 永續營運',
    trademarkNote: '品牌名稱為暫定，尚未完成商標查核。',
  },

  /** true＝所有表單、LINE、付款、登入皆為前端示範，不會送出任何資料 */
  demoMode: true,

  /**
   * 聯絡方式測試模式：true＝顯示明顯的佔位值並標示「測試資料」，LINE 不會外連。
   * 正式營運時：填好下方 contact 的 lineUrl／email／phone，再改成 false。
   */
  contactTestMode: true,

  /** 測試用佔位值：example.com 為國際保留的範例網域，不會寄到任何人 */
  testContact: {
    email: 'test@example.com',
    phone: '09XX-XXX-XXX',
    line: 'LINE 測試帳號',
  },

  /**
   * 預約表單送到 Google 表單。fields 的 entry 代號來自「取得預先填入的連結」，
   * 順序需與 Google 表單題目一致；若題目有增刪，重新取得連結並更新這裡。
   * enabled 改成 false 會回到純前端示範。
   */
  googleForm: {
    enabled: true,
    action: 'https://docs.google.com/forms/d/e/1FAIpQLSf7ONEeesRtgpViw_gXTzVPUWWjBT_kV2r6QdQLWj6sjnHlWQ/formResponse',
    fields: {
      name: 'entry.1308064626', // 姓名／稱呼
      org: 'entry.425635036', // 單位／農場名稱
      role: 'entry.2064493133', // 你的角色
      email: 'entry.1307253599', // Email
      phone: 'entry.2125624988', // 聯絡電話
      region: 'entry.1652716674', // 服務區域
      clientType: 'entry.1515782636', // 客戶類型
      problems: 'entry.1636663631', // 主要問題
      scale: 'entry.1657171400', // 土地／農場規模
      budget: 'entry.525742114', // 每月預算級距
      plan: 'entry.1227439472', // 有興趣的方案
      startTime: 'entry.1348455360', // 希望開始時間
      notes: 'entry.647637091', // 補充說明
      consentAt: 'entry.94807364', // 個資同意時間
    },
  },

  contact: {
    /** 填入 LINE 官方帳號加好友網址（例：https://lin.ee/xxxx）後才會開啟外連；null＝建置中 */
    lineUrl: null as string | null,
    email: null as string | null,
    phone: null as string | null,
    serviceHours: '週一至週五 09:00–18:00（暫定）',
    serviceArea: '以線上遠端陪跑為主，全臺皆可洽詢；現場工作與跨區交通依個案另計。',
  },

  social: [
    { name: 'Facebook', url: null as string | null },
    { name: 'Instagram', url: null as string | null },
    { name: 'YouTube', url: null as string | null },
  ],

  freeConsultMinutes: 20,

  pricing: {
    currency: 'NT$',
    /** 價格是否含營業稅；正式上線前請與會計師確認 */
    taxIncluded: false,
    note: '試營運建議價格，最終以報價為準',
  },

  /** 僅供參考的官方入口；本品牌不隸屬、也不代表以下任何機關 */
  officialLinks: [
    { name: '農業部農業數位服務', url: 'https://adsp.moa.gov.tw/', desc: '農業部線上服務與申辦入口' },
    { name: '農業部農業推廣入口', url: 'https://farmerservice.moa.gov.tw/', desc: '農民服務與推廣資訊' },
    { name: '休閒農業輔導管理辦法', url: 'https://law.moa.gov.tw/LawContent.aspx?id=FL014288', desc: '農業部主管法規資料庫' },
    { name: 'LINE 官方帳號（LINE Biz-Solutions）', url: 'https://tw.linebiz.com/service/account-solutions/line-official-account/', desc: 'LINE 官方帳號申請與功能說明' },
  ],

  copyrightYear: 2026,
} as const;

export const taxLabel = SITE.pricing.taxIncluded ? '價格含營業稅' : '價格未含營業稅';

/** 畫面上要顯示的聯絡方式；測試模式時回傳佔位值，正式模式時回傳實際值或 null（顯示建置中） */
export function contactInfo() {
  const test = SITE.contactTestMode;
  return {
    test,
    email: test ? SITE.testContact.email : SITE.contact.email,
    phone: test ? SITE.testContact.phone : SITE.contact.phone,
    line: test ? SITE.testContact.line : SITE.contact.lineUrl ? 'LINE 官方帳號' : null,
    /** 只有正式模式且有設定連結時才外連 */
    lineUrl: test ? null : SITE.contact.lineUrl,
  };
}
