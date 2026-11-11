import { SITE } from '../config/site';
import type { View } from '../context/AppContext';
import { Icon } from '../components/ui/Icon';
import { NavLink, Tag } from '../components/ui/primitives';

type LegalKey = Extract<View, 'privacy' | 'terms' | 'disclaimer'>;

const DOCS: Record<LegalKey, { title: string; intro: string; sections: { h: string; items: string[] }[] }> = {
  privacy: {
    title: '隱私權政策',
    intro: '說明田序共創如何蒐集、處理、利用與保護你的個人資料。以下為架構草稿，正式內容待確認公司資訊與服務流程後撰寫。',
    sections: [
      { h: '蒐集者與聯絡窗口', items: ['公司名稱、統一編號與個資聯絡窗口：建置中。'] },
      { h: '蒐集目的與資料類別', items: ['回覆諮詢、安排初談、提供陪跑服務與合約聯繫。', '姓名或稱呼、聯絡方式、農場與經營相關資訊；只蒐集服務所需的最小必要欄位。'] },
      { h: '利用期間、地區、對象及方式', items: ['於蒐集目的存續期間，在臺灣地區由本團隊與獲授權的顧問利用。', '正式資料保留期限與刪除機制，將於上線前明訂。'] },
      { h: '第三方服務與 AI 工具', items: ['未經你的同意，不會將客戶個資、訂單或未公開企劃提供給外部 AI 服務。', '若使用雲端主機、Email、LINE 官方帳號等服務，將列出服務提供者與資料處理範圍。'] },
      { h: '當事人權利', items: ['你可以依個人資料保護法第 3 條，請求查詢、閱覽、製給複製本、補充或更正、停止蒐集處理利用或刪除。', '行使方式與處理時程：建置中。'] },
      { h: 'Cookie 與數據分析', items: ['示範網站不使用第三方分析工具；本機示範資料只存在你的瀏覽器，可隨時清除。', '正式版若導入分析工具，將先取得同意並提供設定方式。'] },
      { h: '資訊安全', items: ['正式版將實作權限控管、傳輸加密、稽核紀錄（audit log）與資料備份。'] },
    ],
  },
  terms: {
    title: '服務條款',
    intro: '規範田序共創陪跑服務的範圍、費用、責任與雙方權利義務。以下為架構草稿，正式條款以雙方簽署的合約為準。',
    sections: [
      { h: '服務範圍', items: ['依方案或報價單載明的服務項目、時數與交付成果提供服務。', '第三方軟體、API 用量、設備、正式系統開發、專業檢測、清理工程、法務與會計服務、跨區交通與現場工作，皆另行計費。'] },
      { h: '費用與付款', items: [`網站價格為試營運建議價格，${SITE.pricing.taxIncluded ? '含' : '未含'}營業稅，最終以正式報價為準。`, '季繳為一次支付 3 個月總額；付款方式、發票開立：建置中。'] },
      { h: '方案變更、續約與退費', items: ['方案升降級、暫停、續約與退費規則：建置中，需經專業人士審閱。'] },
      { h: '專業服務的界線', items: ['不保證補助或計畫審查結果。', '法律、會計、稅務、環境檢測、廢棄物清理與工程等，由具備相應資格者執行。'] },
      { h: '智慧財產與保密', items: ['雙方提供資料的所有權、交付成果的使用權與保密義務：建置中。'] },
      { h: '責任限制與爭議處理', items: ['責任範圍、準據法與管轄法院：建置中，需經律師審閱。'] },
    ],
  },
  disclaimer: {
    title: '免責聲明',
    intro: '使用本網站與服務前，請先了解以下說明。',
    sections: [
      { h: '示範網站', items: ['本網站目前為前端示範版本：表單、LINE、付款與登入皆未串接，不會送出或受理任何資料。', '工作台畫面、案例與數據皆為示範或模擬，不代表任何真實客戶、業績或成效。'] },
      { h: '補助與計畫申請', items: ['申請資格、補助項目與審查結果，以主管機關及農會當期公告與審查為準；顧問不保證通過。'] },
      { h: '法規與許可', items: ['親子農事體驗不等於依法核准的「休閒農場」；休閒農場申設、農地使用、建物、消防、食品、保險與觀光等規範，需依個案向主管機關查核。'] },
      { h: '專業資格', items: ['專業環境檢測、廢棄物清理、土木工程、法律及會計服務，須由適法資格者執行；本團隊負責需求盤點與協調。'] },
      { h: '成效與永續資訊', items: ['本站不宣稱任何永續認證、ESG 成果、節水率、減碳量或政府背書。改善成效以實際導入後的紀錄衡量。'] },
      { h: '外部連結', items: ['本站列出的政府或第三方網站連結僅供參考；本站不隸屬、也不代表這些機關或企業。'] },
      { h: '內容範例', items: ['資源專欄文章為內容範例，不構成法律、會計或稅務意見。'] },
    ],
  },
};

export function LegalView({ doc }: { doc: LegalKey }) {
  const d = DOCS[doc];
  const others = (Object.keys(DOCS) as LegalKey[]).filter((k) => k !== doc);
  return (
    <main id="main" className="pb-24 pt-6 lg:pb-16 lg:pt-10">
      <div className="container-x max-w-[860px]">
        <NavLink to="top" className="inline-flex min-h-10 items-center gap-1 rounded-full px-2 text-[14px] text-muted hover:text-forest">
          <Icon name="chevron-left" size={16} />
          回到首頁
        </NavLink>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <h1 className="font-serif text-[32px] font-bold text-forest-deep sm:text-[38px]">{d.title}</h1>
          <Tag kind="draft">草稿佔位</Tag>
        </div>
        <div role="note" className="mt-5 flex items-start gap-3 rounded-2xl border border-danger/30 bg-danger-soft px-4 py-3.5 text-[15px] leading-relaxed text-[#7A302B]">
          <Icon name="triangle-alert" size={20} className="mt-0.5 shrink-0" />
          <p>
            <strong className="font-bold">正式上線前需由律師等專業人士審閱。</strong>
            本頁僅列出應涵蓋的項目架構，標示「建置中」的內容尚未定案，不構成正式條款。
          </p>
        </div>
        <p className="mt-6 text-[17px] leading-[1.9] text-subtle">{d.intro}</p>
        <ol className="mt-8 space-y-4">
          {d.sections.map((s, i) => (
            <li key={s.h} className="rounded-3xl border border-line/80 bg-white p-5 shadow-soft sm:p-6">
              <h2 className="flex items-center gap-3 text-[18px] font-bold text-forest-deep">
                <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sage-mist text-[14px] text-forest">{i + 1}</span>
                {s.h}
              </h2>
              <ul className="mt-3 space-y-2 pl-11">
                {s.items.map((it) => (
                  <li key={it} className="list-disc text-[16px] leading-[1.85] text-subtle marker:text-sage">
                    {it}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
        <div className="mt-8 flex flex-wrap gap-3">
          {others.map((k) => (
            <NavLink key={k} to={k} className="inline-flex min-h-11 items-center gap-2 rounded-full border border-forest/30 bg-white px-4 text-[15px] font-semibold text-forest hover:border-forest">
              {DOCS[k].title}
              <Icon name="arrow-right" size={16} />
            </NavLink>
          ))}
        </div>
      </div>
    </main>
  );
}
