import { useEffect, useRef, type ButtonHTMLAttributes, type MouseEvent, type ReactNode } from 'react';
import { cx } from '../../lib/format';
import { useApp } from '../../context/AppContext';
import { useReveal } from '../../hooks/useMotion';
import { Icon, type IconName } from './Icon';
import { BrandIcon, type BrandIconName } from '../BrandIcons';

/* ---------------- Button ---------------- */

type Variant = 'primary' | 'forest' | 'outline' | 'ghost' | 'light';
type Size = 'sm' | 'md' | 'lg';

const variants: Record<Variant, string> = {
  primary:
    'bg-gold-deep text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.18),0_10px_24px_-12px_rgb(151_108_37/0.75)] hover:bg-[#85601F]',
  forest: 'bg-forest text-white shadow-[0_10px_24px_-14px_rgb(24_57_47/0.8)] hover:bg-forest-deep',
  outline: 'border border-forest/35 bg-white/70 text-forest hover:border-forest hover:bg-white',
  ghost: 'text-forest hover:bg-forest/[0.06]',
  light: 'border border-white/35 bg-white/10 text-white hover:bg-white/20',
};

const sizes: Record<Size, string> = {
  sm: 'min-h-11 px-4 text-[15px] gap-1.5',
  md: 'min-h-12 px-5 text-[16px] gap-2',
  lg: 'min-h-[3.25rem] px-6 sm:px-7 text-[17px] gap-2.5',
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  icon?: IconName;
  iconRight?: IconName;
  /** 首頁區塊 id 或畫面 id；提供時以連結呈現 */
  to?: string;
  href?: string;
}

export function Button({ variant = 'primary', size = 'md', icon, iconRight, to, href, className, children, onClick, ...rest }: ButtonProps) {
  const { navigate } = useApp();
  const cls = cx(
    'inline-flex select-none items-center justify-center rounded-full font-semibold tracking-wide transition-[background-color,border-color,transform,box-shadow] duration-200 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50',
    variants[variant],
    sizes[size],
    className,
  );
  const inner = (
    <>
      {icon && <Icon name={icon} size={size === 'lg' ? 20 : 18} />}
      <span>{children}</span>
      {iconRight && <Icon name={iconRight} size={size === 'lg' ? 20 : 18} />}
    </>
  );
  if (to || href) {
    return (
      <a
        href={href ?? `#${to}`}
        className={cls}
        target={href ? '_blank' : undefined}
        rel={href ? 'noopener noreferrer' : undefined}
        onClick={(e: MouseEvent<HTMLAnchorElement>) => {
          onClick?.(e as unknown as MouseEvent<HTMLButtonElement>);
          if (to) {
            e.preventDefault();
            navigate(to);
          }
        }}
      >
        {inner}
      </a>
    );
  }
  return (
    <button type="button" className={cls} onClick={onClick} {...rest}>
      {inner}
    </button>
  );
}

/* ---------------- NavLink ---------------- */

export function NavLink({
  to,
  className,
  children,
  onNavigate,
  ...rest
}: { to: string; className?: string; children: ReactNode; onNavigate?: () => void; 'aria-current'?: 'page' | 'true' | undefined }) {
  const { navigate } = useApp();
  return (
    <a
      href={`#${to}`}
      className={className}
      onClick={(e) => {
        e.preventDefault();
        onNavigate?.();
        navigate(to);
      }}
      {...rest}
    >
      {children}
    </a>
  );
}

/* ---------------- Tags ---------------- */

const tagStyles = {
  demo: 'border-gold/60 bg-gold-soft text-[#6B4E1A]',
  sim: 'border-sage bg-sage-mist text-forest',
  example: 'border-sage bg-sage-mist text-forest',
  draft: 'border-danger/40 bg-danger-soft text-danger',
  illus: 'border-white/60 bg-white/85 text-forest-deep',
  test: 'border-[#7A9BB8] bg-[#EEF3F8] text-[#2F4F6B]',
};

const tagLabels = {
  demo: '示範資料',
  sim: '模擬案例',
  example: '內容範例',
  draft: '草稿佔位',
  illus: '情境示意',
  test: '測試資料',
};

export function Tag({ kind, children, className }: { kind: keyof typeof tagStyles; children?: ReactNode; className?: string }) {
  return (
    <span
      className={cx(
        'inline-flex items-center gap-1 rounded-full border border-dashed px-2.5 py-0.5 text-[13px] font-medium leading-6 whitespace-nowrap',
        tagStyles[kind],
        className,
      )}
    >
      <Icon name="info" size={14} />
      {children ?? tagLabels[kind]}
    </span>
  );
}

/* ---------------- Section heading ---------------- */

export function SectionHeading({
  eyebrow,
  title,
  desc,
  align = 'center',
  tone = 'light',
  id,
  brand,
}: {
  brand?: BrandIconName;
  eyebrow: string;
  title: ReactNode;
  desc?: ReactNode;
  align?: 'center' | 'left';
  tone?: 'light' | 'dark';
  id?: string;
}) {
  const ref = useReveal<HTMLDivElement>();
  return (
    <div ref={ref} className={cx('reveal mb-10 lg:mb-14', align === 'center' ? 'mx-auto max-w-3xl text-center' : 'max-w-2xl')}>
      <p
        className={cx(
          'mb-3 inline-flex items-center gap-2 text-[15px] font-semibold tracking-[0.18em]',
          tone === 'dark' ? 'text-gold' : 'text-gold-deep',
        )}
      >
        {brand ? (
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-cream ring-1 ring-line">
            <BrandIcon name={brand} size={26} />
          </span>
        ) : (
          <Icon name="leaf" size={18} />
        )}
        {eyebrow}
      </p>
      <h2
        id={id}
        className={cx(
          'font-serif text-[28px] font-bold leading-[1.35] sm:text-[34px] lg:text-[40px]',
          tone === 'dark' ? 'text-white' : 'text-forest-deep',
        )}
      >
        {title}
      </h2>
      {align === 'center' && (
        <div aria-hidden className="mx-auto mt-5 flex items-center justify-center gap-2">
          <span className="h-px w-12 bg-gradient-to-r from-transparent to-gold/70" />
          <span className="h-1.5 w-1.5 rotate-45 bg-gold" />
          <span className="h-px w-12 bg-gradient-to-l from-transparent to-gold/70" />
        </div>
      )}
      {desc && (
        <p className={cx('mt-5 text-[17px] leading-[1.85]', tone === 'dark' ? 'text-white/80' : 'text-subtle')}>{desc}</p>
      )}
    </div>
  );
}

/* ---------------- Reveal wrapper ---------------- */

export function Reveal({ children, className, delay = 0, as = 'div' }: { children: ReactNode; className?: string; delay?: number; as?: 'div' | 'li' | 'article' }) {
  const ref = useReveal<HTMLDivElement>();
  const Tag = as as 'div';
  return (
    <Tag ref={ref} className={cx('reveal', className)} style={delay ? { transitionDelay: `${delay}ms` } : undefined}>
      {children}
    </Tag>
  );
}

/* ---------------- Modal ---------------- */

export function Modal({ open, onClose, title, children, labelledBy = 'modal-title' }: { open: boolean; onClose: () => void; title: ReactNode; children: ReactNode; labelledBy?: string }) {
  const panelRef = useRef<HTMLDivElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;
    lastFocus.current = document.activeElement as HTMLElement;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const t = window.setTimeout(() => panelRef.current?.querySelector<HTMLElement>('[data-autofocus]')?.focus(), 30);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'Tab' && panelRef.current) {
        const f = panelRef.current.querySelectorAll<HTMLElement>('a[href],button:not([disabled]),input,select,textarea,[tabindex]:not([tabindex="-1"])');
        if (!f.length) return;
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      window.clearTimeout(t);
      document.body.style.overflow = prevOverflow;
      document.removeEventListener('keydown', onKey);
      lastFocus.current?.focus?.();
    };
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center sm:items-center sm:p-6">
      <div className="fade-in absolute inset-0 bg-forest-deep/55 backdrop-blur-[2px]" onClick={onClose} aria-hidden />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        className="modal-in relative max-h-[88vh] w-full overflow-y-auto rounded-t-[28px] bg-cream p-6 shadow-lift sm:max-w-2xl sm:rounded-[28px] sm:p-9"
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          <h3 id={labelledBy} className="font-serif text-[22px] font-bold leading-snug text-forest-deep sm:text-[26px]">
            {title}
          </h3>
          <button
            type="button"
            data-autofocus
            onClick={onClose}
            className="-mr-2 -mt-1 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-forest hover:bg-forest/[0.07]"
            aria-label="關閉"
          >
            <Icon name="x" size={22} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

/* ---------------- Card shell ---------------- */

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cx('rounded-3xl border border-line/80 bg-white shadow-soft', className)}>{children}</div>;
}

/* ---------------- Logo ---------------- */

/** 品牌圖示：田埂、嫩芽、朝陽（與 public/favicon.svg 同一組圖形，去掉底色方塊） */
export function LogoMark({ size = 44 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="6 12 112 112" aria-hidden="true">
      <circle cx="89" cy="37" r="17" fill="#C59A43" />
      <path d="M62 69 C61 55 62 42 64 35" stroke="#214D3D" strokeWidth="7" strokeLinecap="round" fill="none" />
      <path d="M61 50 C45 51 34 42 33 28 C50 26 60 35 61 50 Z" fill="#8DA582" />
      <path d="M65 42 C68 27 81 20 94 21 C91 36 80 43 65 42 Z" fill="#214D3D" />
      <path d="M16 94 C39 72 65 67 111 73" stroke="#214D3D" strokeWidth="14" strokeLinecap="round" fill="none" />
      <path d="M24 111 C48 88 76 83 111 90" stroke="#8DA582" strokeWidth="14" strokeLinecap="round" fill="none" />
      <path d="M69 115 C83 105 98 103 111 107" stroke="#638B50" strokeWidth="13" strokeLinecap="round" fill="none" />
    </svg>
  );
}

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <span className="flex items-center gap-2.5">
      <LogoMark />
      <span className="flex flex-col leading-none">
        <span className="font-serif text-[22px] font-bold tracking-[0.14em] text-forest-deep">田序共創</span>
        <span className="mt-1 text-[11px] font-semibold tracking-[0.42em] text-forest/80">FIELDWISE</span>
      </span>
      {!compact && (
        <>
          <span aria-hidden className="mx-2 hidden h-8 w-px bg-forest/20 xl:block" />
          <span className="hidden text-[15px] tracking-[0.12em] text-forest xl:block">農業經營陪跑平台</span>
        </>
      )}
    </span>
  );
}
