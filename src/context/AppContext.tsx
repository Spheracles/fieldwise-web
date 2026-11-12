import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import type { ProblemId } from '../config/form';
import type { ServiceId } from '../config/services';
import { prefersReducedMotion } from '../hooks/useMotion';

/** 可用 #hash 直接開啟的獨立畫面；其他 #hash 視為首頁區塊錨點 */
export const VIEWS = ['client-demo', 'admin-demo', 'privacy', 'terms', 'disclaimer'] as const;
export type View = 'home' | (typeof VIEWS)[number];

const isView = (h: string): h is (typeof VIEWS)[number] => (VIEWS as readonly string[]).includes(h);

export interface Prefill {
  plan?: string;
  problems?: ProblemId[];
  label: string;
  nonce: number;
}

type Tone = 'info' | 'success' | 'warn';
interface Toast {
  id: number;
  message: string;
  tone: Tone;
}

interface AppCtx {
  view: View;
  navigate: (target: string) => void;
  prefill: Prefill | null;
  requestInquiry: (p: Omit<Prefill, 'nonce'>) => void;
  activeService: ServiceId;
  showService: (id: ServiceId) => void;
  setActiveService: (id: ServiceId) => void;
  notify: (message: string, tone?: Tone) => void;
}

const Ctx = createContext<AppCtx | null>(null);

export const useApp = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error('useApp must be used within AppProvider');
  return c;
};

function readHash() {
  try {
    return decodeURIComponent(window.location.hash.replace(/^#/, ''));
  } catch {
    return '';
  }
}

function setHash(h: string) {
  try {
    window.history.replaceState(null, '', h ? `#${h}` : window.location.pathname + window.location.search);
  } catch {
    /* 沙盒環境可能不允許，忽略即可 */
  }
}

function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return false;
  el.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' });
  // 將焦點移到區塊，方便鍵盤與螢幕報讀器使用者
  if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '-1');
  el.focus({ preventScroll: true });
  return true;
}

export function AppProvider({ children }: { children: ReactNode }) {
  const initial = readHash();
  const [view, setView] = useState<View>(isView(initial) ? initial : 'home');
  const pendingScroll = useRef<string | null>(!isView(initial) && initial ? initial : null);
  const [prefill, setPrefill] = useState<Prefill | null>(null);
  const [activeService, setActiveService] = useState<ServiceId>('management');
  const [toasts, setToasts] = useState<Toast[]>([]);
  const toastId = useRef(0);

  const notify = useCallback((message: string, tone: Tone = 'info') => {
    const id = ++toastId.current;
    setToasts((t) => [...t.slice(-2), { id, message, tone }]);
    window.setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 5200);
  }, []);

  const navigate = useCallback(
    (target: string) => {
      if (isView(target)) {
        setView(target);
        setHash(target);
        window.scrollTo({ top: 0 });
        return;
      }
      if (target === 'top' || target === '') {
        if (view !== 'home') setView('home');
        setHash('');
        window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
        return;
      }
      setHash(target);
      if (view !== 'home') {
        pendingScroll.current = target;
        setView('home');
      } else {
        scrollToId(target);
      }
    },
    [view],
  );

  // 切回首頁後，捲動到指定區塊
  useEffect(() => {
    if (view === 'home' && pendingScroll.current) {
      const id = pendingScroll.current;
      pendingScroll.current = null;
      requestAnimationFrame(() => requestAnimationFrame(() => scrollToId(id)));
    }
  }, [view]);

  // 支援瀏覽器上一頁／手動修改 #hash
  useEffect(() => {
    const onHash = () => {
      const h = readHash();
      if (isView(h)) {
        setView(h);
        window.scrollTo({ top: 0 });
      } else {
        setView((v) => {
          if (v !== 'home') pendingScroll.current = h || null;
          return 'home';
        });
        if (h) requestAnimationFrame(() => scrollToId(h));
      }
    };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const requestInquiry = useCallback(
    (p: Omit<Prefill, 'nonce'>) => {
      setPrefill({ ...p, nonce: Date.now() });
      navigate('contact');
    },
    [navigate],
  );

  const showService = useCallback(
    (id: ServiceId) => {
      setActiveService(id);
      navigate('service-detail');
    },
    [navigate],
  );

  const value = useMemo(
    () => ({ view, navigate, prefill, requestInquiry, activeService, showService, setActiveService, notify }),
    [view, navigate, prefill, requestInquiry, activeService, showService, notify],
  );

  return (
    <Ctx.Provider value={value}>
      {children}
      <div
        className="pointer-events-none fixed inset-x-0 bottom-24 z-[70] flex flex-col items-center gap-2 px-4 lg:bottom-8"
        role="status"
        aria-live="polite"
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            className={
              'toast-in pointer-events-auto flex max-w-md items-start gap-3 rounded-2xl px-5 py-3.5 text-[15px] leading-relaxed shadow-lift ' +
              (t.tone === 'warn'
                ? 'bg-[#3B2F1C] text-[#FBF3E1]'
                : t.tone === 'success'
                  ? 'bg-forest text-white'
                  : 'bg-forest-deep text-white')
            }
          >
            <span aria-hidden className="mt-1 inline-block h-2 w-2 shrink-0 rounded-full bg-gold" />
            <span>{t.message}</span>
          </div>
        ))}
      </div>
    </Ctx.Provider>
  );
}
