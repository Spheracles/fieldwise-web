/**
 * 正式版資料模型（草案）。MVP 的示範資料沿用這些型別，
 * 移植到 Next.js + PostgreSQL／Supabase 時可直接轉成資料表結構。
 * 每筆業務資料都帶 organizationId，用於多租戶隔離（不同企業資料不得互相看見）。
 */

export type ID = string;
export type ISODate = string;

/** 權限角色：訪客、企業客戶、顧問、管理員 */
export type RoleName = 'visitor' | 'client' | 'consultant' | 'admin';

export interface Role {
  id: ID;
  name: RoleName;
  /** 顧問只能存取被指派的案件 */
  scopes: string[];
}

export type LeadSource = '官網' | 'LINE 官方帳號' | '農會推廣' | '轉介紹' | '活動';
export type LeadStage = '新洽詢' | '已約初談' | '盤點報價' | '已簽約' | '陪跑中' | '暫緩';

export interface Lead {
  id: ID;
  createdAt: ISODate;
  displayName: string; // 介面上一律遮罩顯示
  orgName?: string;
  region: string;
  clientType: string;
  problems: string[];
  interestedPlan?: string;
  source: LeadSource;
  stage: LeadStage;
  assigneeId?: ID;
  consentAt: ISODate; // 個資蒐集告知同意時間
}

export interface Organization {
  id: ID;
  name: string;
  region: string;
  type: string;
  scaleHectare?: number;
}

export interface Customer {
  id: ID;
  organizationId: ID;
  name: string;
  roleId: ID;
}

export interface Plan {
  id: ID;
  name: string;
  monthlyPrice: number;
  quarterlyPrice: number;
  taxIncluded: boolean;
}

export type RenewalStatus = '待聯繫' | '已聯繫' | '已續約' | '不續約';

export interface Subscription {
  id: ID;
  organizationId: ID;
  planId: ID;
  billing: 'monthly' | 'quarterly';
  startDate: ISODate;
  endDate: ISODate;
  paymentStatus: 'unpaid' | 'paid' | 'refunded' | 'void';
  renewal: RenewalStatus;
}

export interface Consultation {
  id: ID;
  organizationId: ID;
  consultantId: ID;
  date: ISODate;
  topic: string;
  mode: '線上' | '現場';
  notes?: string;
}

export type TaskStatus = 'todo' | 'doing' | 'done';

export interface Task {
  id: ID;
  organizationId?: ID;
  title: string;
  owner: string;
  due: ISODate;
  status: TaskStatus;
  tag?: string;
}

export type OrderStatus = '待確認' | '備貨中' | '已出貨';

export interface Order {
  id: ID;
  organizationId?: ID;
  channel: 'LINE' | '電話' | '表單' | '紙本';
  item: string;
  qty: number;
  shipDate: ISODate;
  status: OrderStatus;
}

export interface Timesheet {
  id: ID;
  organizationId?: ID;
  workType: string;
  hours: number;
  month: string;
}

export interface Budget {
  category: string;
  budget: number;
  actual: number;
}

export interface DocumentItem {
  id: ID;
  name: string;
  kind: string;
  updatedAt: ISODate;
  status: '草稿' | '待確認' | '已確認';
}

export interface Activity {
  id: ID;
  leadId?: ID;
  organizationId?: ID;
  at: ISODate;
  kind: '電話' | 'Email' | 'LINE' | '會議' | '備註';
  summary: string;
}

/** 永續／營運指標：以可驗證原始資料為前提，不推算減碳量或 ESG 分數 */
export interface Metric {
  name: string;
  unit: string;
  baseline: number | null;
  target: number | null;
  actual: number | null;
  source: string;
  cadence: '週' | '月' | '季';
  /** 數值越低越好 */
  lowerIsBetter?: boolean;
}
