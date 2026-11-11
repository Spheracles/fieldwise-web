import type { ReactNode } from 'react';
import { useApp } from '../../context/AppContext';
import { SERVICES } from '../../config/services';
import { SITE } from '../../config/site';
import { clearDemoData } from '../../lib/storage';
import { track } from '../../lib/track';
import { useInView } from '../../hooks/useMotion';
import { Icon } from '../ui/Icon';
import { Button, LogoMark, NavLink } from '../ui/primitives';
import { LineButton } from '../ui/LineButton';
import { NAV_ITEMS } from './Header';

export function Footer() {
  const { showService, notify } = useApp();
  return (
    <footer className="relative overflow-hidden bg-forest-deep text-white/85">
      <svg aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-24 w-full text-cream" viewBox="0 0 1440 96" preserveAspectRatio="none">
        <path d="M0 0h1440v36c-180 34-420 52-720 30S170 30 0 58z" fill="currentColor" />
      </svg>
      <div className="container-x relative pb-28 pt-28 lg:pb-12">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.3fr_1fr_1fr_1.1fr]">
          <div>
            <div className="flex items-center gap-3">
              <span className="rounded-2xl bg-cream p-2">
                <LogoMark size={40} />
              </span>
              <span>
                <span className="block font-serif text-[22px] font-bold tracking-[0.14em] text-white">田序共創</span>
                <span className="block text-[11px] font-semibold tracking-[0.42em] text-white/70">FIELDWISE</span>
              </span>
            </div>
            <p className="mt-5 font-serif text-[18px] text-white">{SITE.brand.slogan}</p>
            <p className="mt-3 text-[15px] leading-relaxed text-white/70">農業企業經營顧問、數位轉型與永續經營陪跑平台。</p>
            <dl className="mt-5 space-y-1.5 text-[14px] text-white/70">
              <div className="flex gap-2">
                <dt className="shrink-0">公司識別：</dt>
                <dd>公司名稱、統一編號建置中</dd>
              </div>
              <div className="flex gap-2">
                <dt className="shrink-0">品牌狀態：</dt>
                <dd>{SITE.brand.trademarkNote}</dd>
              </div>
            </dl>
          </div>

          <FooterCol title="服務項目">
            {SERVICES.map((s) => (
              <li key={s.id}>
                <a
                  href="#service-detail"
                  className="inline-flex min-h-10 items-center hover:text-white"
                  onClick={(e) => {
                    e.preventDefault();
                    showService(s.id);
                  }}
                >
                  {s.title}
                </a>
              </li>
            ))}
          </FooterCol>

          <FooterCol title="網站導覽">
            {NAV_ITEMS.map((n) => (
              <li key={n.id}>
                <NavLink to={n.id} className="inline-flex min-h-10 items-center hover:text-white">
                  {n.label}
                </NavLink>
              </li>
            ))}
            <li>
              <NavLink to="client-demo" className="inline-flex min-h-10 items-center hover:text-white">
                客戶工作台示範
              </NavLink>
            </li>
            <li>
              <NavLink to="admin-demo" className="inline-flex min-h-10 items-center hover:text-white">
                管理者工作台示範
              </NavLink>
            </li>
          </FooterCol>

          <div>
            <h3 className="text-[15px] font-semibold tracking-[0.15em] text-gold">聯絡我們</h3>
            <ul className="mt-4 space-y-2 text-[15px]">
              <li className="flex items-start gap-2">
                <Icon name="mail" size={18} className="mt-1 shrink-0 text-sage" />
                <span>{SITE.contact.email ?? 'Email 建置中，請先使用網站表單'}</span>
              </li>
              <li className="flex items-start gap-2">
                <Icon name="phone" size={18} className="mt-1 shrink-0 text-sage" />
                <span>{SITE.contact.phone ?? '電話建置中'}</span>
              </li>
              <li className="flex items-start gap-2">
                <Icon name="message-circle" size={18} className="mt-1 shrink-0 text-sage" />
                <span>{SITE.contact.lineUrl ? 'LINE 官方帳號' : 'LINE 官方帳號建置中'}</span>
              </li>
              <li className="flex items-start gap-2">
                <Icon name="clock" size={18} className="mt-1 shrink-0 text-sage" />
                <span>{SITE.contact.serviceHours}</span>
              </li>
            </ul>
            <div className="mt-5 flex flex-wrap gap-2">
              {SITE.social.map((s) =>
                s.url ? (
                  <a key={s.name} href={s.url} target="_blank" rel="noopener noreferrer" className="rounded-full border border-white/25 px-3 py-1.5 text-[13px] hover:bg-white/10">
                    {s.name}
                  </a>
                ) : (
                  <span key={s.name} className="rounded-full border border-dashed border-white/25 px-3 py-1.5 text-[13px] text-white/60">
                    {s.name}・建置中
                  </span>
                ),
              )}
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-white/15 pt-6 text-[14px] text-white/65 lg:flex-row lg:items-center lg:justify-between">
          <p>
            © {SITE.copyrightYear} 田序共創 FIELDWISE（暫定品牌）・本站為示範網站，頁面數據與案例皆為示範或模擬。
          </p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <NavLink to="privacy" className="inline-flex min-h-10 items-center hover:text-white">
              隱私權政策
            </NavLink>
            <NavLink to="terms" className="inline-flex min-h-10 items-center hover:text-white">
              服務條款
            </NavLink>
            <NavLink to="disclaimer" className="inline-flex min-h-10 items-center hover:text-white">
              免責聲明
            </NavLink>
            <button
              type="button"
              className="inline-flex min-h-10 items-center gap-1.5 rounded-full border border-white/25 px-3 hover:bg-white/10"
              onClick={() => {
                const n = clearDemoData();
                notify(n ? `已清除這台裝置上的 ${n} 筆示範資料。` : '這台裝置上沒有儲存任何示範資料。', 'success');
              }}
            >
              <Icon name="trash-2" size={16} />
              清除本機示範資料
            </button>
          </div>
        </div>
        <p className="mt-4 text-[13px] leading-relaxed text-white/50">
          本站不隸屬、也不代表任何政府機關或農會；所列官方網站連結僅供參考。補助與計畫申請以主管機關公告為準，顧問不保證審查結果。
        </p>
      </div>
    </footer>
  );
}

function FooterCol({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <h3 className="text-[15px] font-semibold tracking-[0.15em] text-gold">{title}</h3>
      <ul className="mt-3 text-[15px]">{children}</ul>
    </div>
  );
}

/** 手機版固定底部 CTA；表單區塊出現在畫面時自動隱藏 */
export function MobileCTA() {
  const { view, navigate } = useApp();
  const contactVisible = useInView('contact', view === 'home');
  const hidden = view === 'home' && contactVisible;
  return (
    <div
      className={
        'fixed inset-x-0 bottom-0 z-40 border-t border-line bg-cream/95 px-4 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-3 backdrop-blur-md transition-transform duration-300 lg:hidden ' +
        (hidden ? 'translate-y-full' : 'translate-y-0')
      }
      aria-hidden={hidden}
    >
      <div className="mx-auto flex max-w-xl gap-3">
        <LineButton from="mobile_bar" size="md" className="flex-1" label="LINE 洽詢" />
        <Button
          size="sm"
          icon="calendar-check"
          className="flex-[1.4]"
          tabIndex={hidden ? -1 : undefined}
          onClick={() => {
            track('cta_click', { cta: 'mobile_bar_consult' });
            navigate('contact');
          }}
        >
          預約免費初談
        </Button>
      </div>
    </div>
  );
}
