# 田序共創｜FIELDWISE 網站前端 MVP

農業企業經營顧問、數位轉型與永續經營陪跑平台的前端 MVP。
React 19 + TypeScript + Tailwind CSS v4（Vite），臺灣繁體中文（zh-TW）、NT$ 計價。

> **目前為示範模式**：表單、LINE、付款、登入都沒有串接後端，不會送出任何資料。所有尚未串接的地方都已在畫面上標示。

---

## 快速開始

```bash
npm install
npm run dev        # 本機開發 http://localhost:5173
npm run build      # 型別檢查 + 正式建置到 dist/
npm run preview    # 預覽建置結果
```

`dist/index.html` 另附一份**單一檔案預覽版**（JS、CSS、圖片全部內嵌），直接用瀏覽器開啟就能操作。

> 本專案在沒有網路的環境中開發，未附 `package-lock.json`；第一次 `npm install` 會依 `package.json` 的版本範圍安裝。

---

## 目錄結構

```
src/
├─ config/            ← 改文案、價格、服務只需要動這裡
│  ├─ site.ts         品牌名稱、聯絡方式、LINE 連結、示範模式、官方參考連結
│  ├─ plans.ts        三種方案價格、時數、比較表、不含項目、專案報價
│  ├─ services.ts     服務 A–F 的內容、交付成果、服務邊界、合規提示
│  ├─ content.ts      痛點、優勢、流程、診斷對應、模擬案例、FAQ、專欄範例、關於我們
│  └─ form.ts         表單選項（22 縣市、角色、客戶類型、問題、規模、預算…）
├─ components/BrandIcons.tsx  品牌雙色圖示（依「網站分頁 Icon 設計提案」重繪）
├─ data/demo.ts       工作台示範資料（全部虛構）
├─ types/domain.ts    正式版資料模型草案（Lead、Organization、Subscription…）
├─ context/AppContext.tsx  #hash 路由、表單帶入、服務分頁、提示訊息
├─ components/        UI 元件（按鈕、標籤、Modal、Logo、圖示、圖表、頁首頁尾）
├─ sections/          首頁各區塊
├─ views/             客戶工作台、管理者工作台、法律頁
├─ lib/               格式化、驗證、本機儲存、埋點
└─ index.css          Design tokens（色彩、字體、陰影）與動畫
```

### 常見修改

| 想改什麼 | 改哪裡 |
|---|---|
| 品牌名稱、標語 | `config/site.ts` → `brand` |
| 聯絡方式測試模式 | `config/site.ts` → `contactTestMode: true` 時顯示 `test@example.com`、`09XX-XXX-XXX`、「LINE 測試帳號」並標示「測試資料」，LINE 按鈕不外連 |
| Google 表單欄位 | `config/site.ts` → `googleForm.fields`；Google 表單題目有增刪時，重新「取得預先填入的連結」更新 entry 代號；`enabled: false` 可回到示範模式 |
| 切換成正式營運 | `config/site.ts` → 填入 `contact.lineUrl`（LINE 加好友網址）、`contact.email`、`contact.phone`，再把 `contactTestMode` 改成 `false`；未填的項目會顯示「建置中」 |
| 價格、季繳金額、時數 | `config/plans.ts` → `PLANS`（季繳為 3 個月總額，節省金額自動計算） |
| 含稅／未稅 | `config/site.ts` → `pricing.taxIncluded` |
| 色彩 | `src/index.css` → `@theme` |

---

## 已運作的互動功能

- 桌機吸頂導覽（含服務下拉選單、目前區塊高亮）、手機漢堡選單（Esc 關閉、鎖定捲動）
- 錨點導覽與 `#hash` 畫面切換（`#client-demo`、`#admin-demo`、`#privacy`、`#terms`、`#disclaimer`）
- 月／季計價切換：金額動畫、季繳顯示「一次支付 3 個月」、平均月費與節省金額
- 方案完整比較表（展開／收合）、「詢問此方案」自動帶入表單
- 服務 A–F 分頁（支援方向鍵），「諮詢這項服務」帶入主要問題
- 1 分鐘快速診斷：六選項多選、未選提示、依選項產生服務方向與方案參考、選項變更提示、重設、帶結果預約
- 模擬案例分頁、資源專欄分類篩選與文章 Modal、FAQ 展開／全部展開
- 預約表單：必填、Email 格式、臺灣電話基本檢查、錯誤摘要可跳到欄位、即時重新驗證、送出前摘要、示範送出結果
- 選用的本機示範紀錄（只存縣市、類型、問題、方案、開始時間，不存姓名／Email／電話／補充說明），可在管理者工作台看到，頁尾與表單都有「清除本機示範資料」
- 客戶工作台：任務篩選與狀態切換、PDCA 階段推進、採收排程人數調整與缺工提示、訂單狀態修改與篩選、預算超支警示、指標基準值→目標→實際值（含「尚無資料」）、月度圖表／表格切換
- 管理者工作台：洽詢名單來源篩選、案件階段與顧問指派、通路成效、月營收預估（依方案設定計算）、任務分派、30 天內到期提醒與續約狀態、權限規劃、本次瀏覽埋點事件
- 手機固定底部 CTA（表單出現時自動隱藏）、減少動態偏好（prefers-reduced-motion）、鍵盤焦點樣式、略過導覽連結

---

## 示範（DEMO）與正式上線需要串接的功能

| 功能 | 目前狀態 | 正式上線需要 |
|---|---|---|
| 預約表單 | **已串接 Google 表單**（`config/site.ts` → `googleForm`）：送出後資料進入 Google 表單回覆與試算表；含隱藏防灌單欄位、60 秒內不重複送出 | 之後可改接自有後端與資料庫、加上 reCAPTCHA／Turnstile 與自動確認信 |
| LINE 洽詢 | 未設定連結時顯示「LINE 官方帳號建置中」 | LINE 官方帳號、Messaging API（Channel token 由管理員提供） |
| 會議預約 | 按鈕提示「尚未串接」 | 行事曆預約服務 |
| 文件開啟／下載 | 提示「示範模式無法下載」 | 登入、檔案儲存、依權限存取 |
| 客戶／管理者工作台 | 虛構資料，重新整理即恢復 | 登入、角色權限、多租戶資料隔離、audit log |
| 月營收預估 | 依示範訂閱與方案設定計算 | 訂閱與付款資料 |
| 付款、訂閱 | 未開放，頁面明示不會扣款 | 金流、電子發票、退款與稅額 |
| 埋點 | 只存在本次瀏覽的記憶體 | 取得同意後接合規分析工具 |
| 隱私權政策／服務條款／免責聲明 | 架構草稿，標示需專業審閱 | 律師審閱定稿 |

---

## 下一階段待辦

### 部署
- [ ] 移植到 Next.js App Router（建議 `app/(marketing)` 放官網、`app/(dashboard)` 放工作台；`config/`、`types/`、`components/` 可直接沿用）
- [ ] 網域、HTTPS、正式 `og:image`（1200×630）、`og:url`、canonical、sitemap、robots
- [ ] 圖片改用正式授權或自行拍攝的素材；目前英雄區為 AI 生成情境示意圖
- [ ] Lighthouse 效能與無障礙檢查、錯誤監控

### 資料庫與權限
- [ ] PostgreSQL／Supabase：依 `types/domain.ts` 建表，所有業務資料帶 `organization_id`
- [ ] Row Level Security：企業客戶只看自己的組織、顧問只看被指派案件
- [ ] 登入（Email magic link 或 OAuth）、角色：訪客／企業客戶／顧問／管理員
- [ ] Audit log、每日備份、資料保留期限與刪除流程

### 表單與 CRM
- [ ] 伺服器端驗證與速率限制、reCAPTCHA 或 Turnstile
- [ ] 洽詢寫入 Lead 資料表，記錄來源標籤（官網、LINE 官方帳號、農會推廣、轉介紹、活動）
- [ ] Email 通知（給團隊）與確認信（給洽詢者）

### LINE
- [ ] 申請 LINE 官方帳號，取得加好友網址後填入 `contact.lineUrl`
- [ ] Messaging API：Webhook、自動回覆、與 Lead 綁定（需取得使用者同意）

### 金流與發票
- [ ] 選擇金流服務，實作訂閱週期（月繳／季繳）、付款狀態、停用、續約、退款
- [ ] 電子發票、稅額標示；確認價格含稅／未稅後更新 `pricing.taxIncluded`

### 法務與合規
- [ ] 確認公司名稱、統一編號，完成商標查核
- [ ] 律師審閱：隱私權政策、個資蒐集告知、服務條款、退費規則、免責聲明
- [ ] 會計師確認：稅務、發票、價格標示
- [ ] 確認是否需要任何證照或登記；環境檢測、清運、工程一律轉介合格廠商
- [ ] 不使用政府、農會或第三方標誌，除非取得書面授權

### 第一階段商業驗證
- [ ] 真實完成初談與報價流程，收集付費客戶回饋
- [ ] 確認每位顧問能穩定服務的客戶數、月費／季費的留存與服務成本
- [ ] 指標一律以可驗證的原始資料記錄（基準值→目標→實際值→資料來源），不推算減碳量或 ESG 分數

---

## 設計與無障礙說明

- 色彩：森林綠 `#214D3D`、深綠 `#18392F`、鼠尾草綠 `#8DA582`、奶油白 `#F8F6EF`、田野金 `#C59A43`、主文字 `#22352D`、次文字 `#6C776E`、錯誤 `#B64A43`
- 為了白字對比 ≥ 4.5:1，金色按鈕底使用加深的 `#976C25`；`#C59A43` 用於線條、圖示與裝飾
- `#6C776E` 在奶油白底上的對比略低於 4.5:1，所以段落文字改用 `#56625A`（`text-subtle`），`#6C776E` 保留給白底卡片的輔助說明
- 字體：Noto Sans TC／Noto Serif TC（Google Fonts，開放授權），系統備援微軟正黑體、蘋方
- 品牌圖示：`public/favicon.svg`、`favicon.ico`（16–64px）、`apple-touch-icon.png`（180px）、`icon-192.png`／`icon-512.png` 與 `site.webmanifest`；頁首與頁尾 Logo 使用同一組圖形
- 品牌雙色圖示（`BrandIcon`）：首頁、服務方案、案例、知識專欄、關於我們、聯絡諮詢，以及需求診斷、顧問初談、營運盤點、導入與陪跑、績效追蹤、客戶工作台；用於合作流程、區塊標題、手機選單與工作台
- 介面小圖示：內聯 SVG，幾何資料取自 Lucide Icons（ISC License），正式專案可改用 `lucide-react`
- 已檢查 1440／768／390 px 皆無水平溢出；觸控目標 ≥ 44px；內文 ≥ 16px

## 內容原則

- 不虛構客戶、業績、合作單位、政府背書、成功率或統計數字
- 案例皆標示「模擬案例」、文章皆標示「內容範例」、工作台皆標示「示範資料」
- 補助申請不保證通過；親子農事體驗不等於依法核准的休閒農場；專業檢測、清運、工程、法律與會計由合格者執行
