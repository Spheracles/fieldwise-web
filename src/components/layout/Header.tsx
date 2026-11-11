import { useEffect, useRef, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SERVICES } from '../../config/services';
import { SITE } from '../../config/site';
import { cx } from '../../lib/format';
import { track } from '../../lib/track';
import { useScrollSpy } from '../../hooks/useMotion';
import { Icon } from '../ui/Icon';
import { Button, Logo, NavLink } from '../ui/primitives';
import { LineButton } from '../ui/LineButton';

export const NAV_ITEMS = [
  { id: 'pricing', label: '陪跑方案' },
  { id: 'cases', label: '轉型情境' },
  { id: 'about', label: '關於我們' },
  { id: 'resources', label: '資源專欄' },
  { id: 'contact', label: '預約諮詢' },
];

const SPY_IDS = ['services', ...NAV_ITEMS.map((n) => n.id)];

export function DemoBanner() {
  const [hidden, setHidden] = useState(() => {
    try {
      return sessionStorage.getItem('fieldwise:banner') === '1';
    } catch {
      return false;
    }
  });
  if (!SITE.demoMode || hidden) return null;
  return (
    <div className="bg-forest-deep text-[14px] text-white/90">
      <div className="container-x flex items-center gap-3 py-2">
        <Icon name="info" size={16} className="shrink-0 text-gold" />
        <p className="flex-1 leading-snug">
          <strong className="font-semibold text-white">示範模式</strong>
          <span className="mx-1.5 text-white/40">｜</span>
          <span className="sm:hidden">表單與 LINE 尚未串接，不會送出資料。</span>
          <span className="hidden sm:inline">這是前端 MVP，表單、LINE 與付款尚未串接，不會送出任何資料；頁面數據皆為示範。</span>
        </p>
        <button
          type="button"
          className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full hover:bg-white/10"
          aria-label="關閉示範模式提示"
          onClick={() => {
            setHidden(true);
            try {
              sessionStorage.setItem('fieldwise:banner', '1');
            } catch {
              /* ignore */
            }
          }}
        >
          <Icon name="x" size={18} />
        </button>
      </div>
    </div>
  );
}

export function Header() {
  const { view, navigate, showService } = useApp();
  const [menuOpen, setMenuOpen] = useState(false);
  const [svcOpen, setSvcOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const svcRef = useRef<HTMLDivElement>(null);
  const menuBtnRef = useRef<HTMLButtonElement>(null);
  const active = useScrollSpy(SPY_IDS, view === 'home');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // 服務下拉：點外面或按 Esc 關閉
  useEffect(() => {
    if (!svcOpen) return;
    const onDown = (e: PointerEvent) => {
      if (svcRef.current && !svcRef.current.contains(e.target as Node)) setSvcOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setSvcOpen(false);
    document.addEventListener('pointerdown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [svcOpen]);

  // 手機選單：鎖定捲動、Esc 關閉
  useEffect(() => {
    if (!menuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMenuOpen(false);
        menuBtnRef.current?.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener('keydown', onKey);
    };
  }, [menuOpen]);

  const linkCls = (id: string) =>
    cx(
      'relative inline-flex min-h-11 items-center rounded-full px-3.5 text-[16px] font-medium transition-colors xl:px-4',
      active === id && view === 'home' ? 'text-forest-deep' : 'text-ink/80 hover:text-forest-deep',
    );

  return (
    <header
      className={cx(
        'sticky top-0 z-50 transition-[background-color,box-shadow] duration-300',
        scrolled || menuOpen ? 'bg-cream/90 shadow-[0_1px_0_rgb(24_57_47/0.08),0_8px_24px_-16px_rgb(24_57_47/0.25)] backdrop-blur-md' : 'bg-cream/70 backdrop-blur-sm',
      )}
    >
      <div className="container-x flex h-[72px] items-center justify-between gap-4">
        <NavLink to="top" className="shrink-0 rounded-xl" aria-current={view === 'home' ? 'page' : undefined}>
          <span className="sr-only">田序共創 FIELDWISE 首頁</span>
          <Logo />
        </NavLink>

        <nav aria-label="主要導覽" className="hidden items-center lg:flex">
          <div ref={svcRef} className="relative">
            <button
              type="button"
              className={cx(linkCls('services'), 'gap-1')}
              aria-expanded={svcOpen}
              aria-controls="svc-menu"
              onClick={() => setSvcOpen((o) => !o)}
            >
              服務項目
              <Icon name="chevron-down" size={16} className={cx('transition-transform', svcOpen && 'rotate-180')} />
              {active === 'services' && view === 'home' && <ActiveDot />}
            </button>
            {svcOpen && (
              <div id="svc-menu" className="pop-in absolute left-1/2 top-full mt-2 w-[min(92vw,620px)] -translate-x-1/2 rounded-3xl border border-line bg-white p-3 shadow-lift">
                <div className="grid grid-cols-2 gap-1">
                  {SERVICES.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      className="flex items-start gap-3 rounded-2xl p-3 text-left hover:bg-sage-mist"
                      onClick={() => {
                        setSvcOpen(false);
                        showService(s.id);
                        track('service_view', { service: s.id, from: 'nav' });
                      }}
                    >
                      <span className="mt-0.5 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sage-soft text-forest">
                        <Icon name={s.icon} size={20} />
                      </span>
                      <span>
                        <span className="block text-[15px] font-semibold text-forest-deep">
                          {s.code}｜{s.title}
                        </span>
                        <span className="mt-0.5 block text-[13px] leading-snug text-muted">{s.short}</span>
                      </span>
                    </button>
                  ))}
                </div>
                <div className="mt-2 flex items-center justify-between gap-3 rounded-2xl bg-cream px-4 py-3">
                  <span className="text-[14px] text-subtle">想先看看陪跑工具長什麼樣子？</span>
                  <span className="flex gap-1">
                    <NavLink to="client-demo" onNavigate={() => setSvcOpen(false)} className="rounded-full px-3 py-1.5 text-[14px] font-semibold text-forest hover:bg-white">
                      客戶工作台示範
                    </NavLink>
                    <NavLink to="admin-demo" onNavigate={() => setSvcOpen(false)} className="rounded-full px-3 py-1.5 text-[14px] font-semibold text-forest hover:bg-white">
                      管理者工作台示範
                    </NavLink>
                  </span>
                </div>
              </div>
            )}
          </div>
          {NAV_ITEMS.map((n) => (
            <NavLink key={n.id} to={n.id} className={linkCls(n.id)} aria-current={active === n.id && view === 'home' ? 'true' : undefined}>
              {n.label}
              {active === n.id && view === 'home' && <ActiveDot />}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            icon="calendar-check"
            className="max-[359px]:px-3"
            onClick={() => {
              track('cta_click', { cta: 'header_consult' });
              navigate('contact');
            }}
          >
            預約初談
          </Button>
          <button
            ref={menuBtnRef}
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-forest/20 bg-white/70 text-forest lg:hidden"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? '關閉選單' : '開啟選單'}
            onClick={() => setMenuOpen((o) => !o)}
          >
            <Icon name={menuOpen ? 'x' : 'menu'} size={22} />
          </button>
        </div>
      </div>

      {menuOpen && <MobileMenu onClose={() => setMenuOpen(false)} />}
    </header>
  );
}

function ActiveDot() {
  return <span aria-hidden className="absolute bottom-1 left-1/2 h-1 w-5 -translate-x-1/2 rounded-full bg-gold" />;
}

function MobileMenu({ onClose }: { onClose: () => void }) {
  const { navigate, showService } = useApp();
  const firstRef = useRef<HTMLAnchorElement>(null);
  useEffect(() => {
    firstRef.current?.focus();
  }, []);
  const go = (id: string) => {
    onClose();
    navigate(id);
  };
  return (
    <div id="mobile-menu" className="fixed inset-x-0 bottom-0 top-[72px] z-40 overflow-y-auto bg-cream lg:hidden">
      <nav aria-label="手機版導覽" className="container-x flex flex-col gap-1 pb-32 pt-4">
        <p className="px-2 pb-1 pt-2 text-[14px] font-semibold tracking-[0.15em] text-gold-deep">服務項目</p>
        <div className="grid grid-cols-1 gap-1 sm:grid-cols-2">
          {SERVICES.map((s, i) => (
            <a
              key={s.id}
              ref={i === 0 ? firstRef : undefined}
              href="#service-detail"
              className="flex min-h-12 items-center gap-3 rounded-2xl px-3 py-2.5 text-[16px] text-ink hover:bg-white"
              onClick={(e) => {
                e.preventDefault();
                onClose();
                showService(s.id);
              }}
            >
              <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-sage-soft text-forest">
                <Icon name={s.icon} size={18} />
              </span>
              {s.code}｜{s.title}
            </a>
          ))}
        </div>
        <div className="my-3 h-px bg-line" />
        {NAV_ITEMS.map((n) => (
          <a
            key={n.id}
            href={`#${n.id}`}
            className="flex min-h-12 items-center justify-between rounded-2xl px-3 text-[18px] font-medium text-forest-deep hover:bg-white"
            onClick={(e) => {
              e.preventDefault();
              go(n.id);
            }}
          >
            {n.label}
            <Icon name="chevron-right" size={20} className="text-sage" />
          </a>
        ))}
        <div className="my-3 h-px bg-line" />
        <p className="px-2 pb-1 text-[14px] font-semibold tracking-[0.15em] text-gold-deep">示範工具</p>
        {[
          { id: 'client-demo', label: '客戶工作台示範', icon: 'layout-dashboard' as const },
          { id: 'admin-demo', label: '管理者工作台示範', icon: 'kanban' as const },
        ].map((d) => (
          <a
            key={d.id}
            href={`#${d.id}`}
            className="flex min-h-12 items-center gap-3 rounded-2xl px-3 text-[16px] text-ink hover:bg-white"
            onClick={(e) => {
              e.preventDefault();
              go(d.id);
            }}
          >
            <Icon name={d.icon} size={20} className="text-forest" />
            {d.label}
          </a>
        ))}
        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Button
            size="lg"
            icon="calendar-check"
            onClick={() => {
              track('cta_click', { cta: 'mobile_menu_consult' });
              go('contact');
            }}
          >
            預約免費初談
          </Button>
          <LineButton from="mobile_menu" />
        </div>
        {!SITE.contact.lineUrl && <p className="mt-2 text-center text-[14px] text-muted">LINE 官方帳號建置中</p>}
      </nav>
    </div>
  );
}
