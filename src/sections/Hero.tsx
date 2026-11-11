import { useState } from 'react';
import heroImage from '../assets/hero-farm.webp';
import { SITE } from '../config/site';
import { useApp } from '../context/AppContext';
import { track } from '../lib/track';
import { Icon, type IconName } from '../components/ui/Icon';
import { Button } from '../components/ui/primitives';
import { ContourBackdrop, HeroFallbackArt, LeafSprig } from '../components/art';

export function Hero() {
  const { navigate } = useApp();
  return (
    <section id="top" aria-labelledby="hero-title" className="relative overflow-hidden">
      <ContourBackdrop className="pointer-events-none absolute -right-40 -top-24 h-[760px] w-[1100px] text-sage/25" />
      <LeafSprig className="pointer-events-none absolute -bottom-6 -left-10 hidden h-56 w-56 text-sage/40 lg:block" />

      <div className="container-x relative grid grid-cols-1 items-center gap-12 pb-20 pt-10 sm:pt-14 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14 lg:pb-28 lg:pt-16">
        <div className="hero-in">
          <p className="inline-flex flex-wrap items-center gap-x-2 gap-y-1 rounded-full border border-forest/15 bg-white/70 px-4 py-1.5 text-[14px] font-medium tracking-wide text-forest sm:text-[15px]">
            <Icon name="sprout" size={18} className="text-gold-deep" />
            {SITE.brand.pillars}
          </p>
          <h1 id="hero-title" className="mt-6 font-serif text-[38px] font-bold leading-[1.28] tracking-[0.04em] text-forest-deep sm:text-[50px] lg:text-[58px] xl:text-[62px]">
            讓土地好好生長，
            <br />
            讓經營有章可循。
          </h1>
          <svg aria-hidden viewBox="0 0 420 18" className="mt-3 h-4 w-[min(78%,420px)] text-gold">
            <path d="M3 13C88 3 230 1 417 6" stroke="currentColor" strokeWidth="3" strokeLinecap="round" fill="none" className="draw-line" />
            <path d="M60 15c90-6 190-7 300-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" fill="none" opacity=".55" />
          </svg>
          <p className="mt-6 max-w-xl text-[17px] leading-[1.9] text-subtle sm:text-[18px]">{SITE.brand.sub}</p>
          <p className="mt-3 max-w-xl text-[16px] leading-[1.85] text-subtle">
            用專業陪跑與 AI 工具，協助農場與農業企業整理人力、成本與訂單流程，建立可長期經營的制度。
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Button
              size="lg"
              icon="calendar-check"
              iconRight="chevron-right"
              onClick={() => {
                track('cta_click', { cta: 'hero_consult' });
                navigate('contact');
              }}
            >
              預約免費初談
            </Button>
            <Button
              size="lg"
              variant="outline"
              icon="leaf"
              iconRight="chevron-right"
              onClick={() => {
                track('cta_click', { cta: 'hero_services' });
                navigate('services');
              }}
            >
              探索服務
            </Button>
          </div>
          <ul className="mt-8 grid grid-cols-1 gap-x-6 gap-y-2 text-[15px] text-subtle sm:grid-cols-3 sm:gap-y-0">
            {['20 分鐘免費線上初談', '先盤點，再談方案', '服務邊界清楚說明'].map((t) => (
              <li key={t} className="flex items-center gap-2">
                <Icon name="circle-check" size={18} className="shrink-0 text-forest" />
                {t}
              </li>
            ))}
          </ul>
        </div>

        <HeroVisual />
      </div>

      <svg aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-16 w-full text-white/60" viewBox="0 0 1440 64" preserveAspectRatio="none">
        <path d="M0 64V30c240 26 520 34 760 14S1220 4 1440 22v42z" fill="currentColor" />
      </svg>
    </section>
  );
}

const HERO_CARDS: { title: string; icon: IconName; items: string[]; mini: 'week' | 'flow' | 'bars' }[] = [
  { title: '採收排程管理', icon: 'calendar-days', items: ['作物生長階段', '採收與人力安排'], mini: 'week' },
  { title: '訂單流程自動化', icon: 'shopping-cart', items: ['訂單彙整與分派', '出貨與配送排程'], mini: 'flow' },
  { title: '成本預算控管', icon: 'calculator', items: ['營運成本統整', '人力與資金規劃'], mini: 'bars' },
];

function HeroVisual() {
  const [imgOk, setImgOk] = useState(true);
  return (
    <div className="hero-in-late relative mx-auto w-full max-w-[560px] lg:max-w-none lg:pr-6">
      <div className="relative aspect-[4/3] overflow-hidden rounded-[28px] bg-sage-soft shadow-lift ring-1 ring-forest/10 lg:aspect-[475/530]">
        <HeroFallbackArt className="absolute inset-0 h-full w-full" />
        {imgOk && (
          <img
            src={heroImage}
            alt="情境示意：戴草帽的農業工作者站在田間，手持平板查看農場資訊，遠方是山景與溫室"
            className="absolute inset-0 h-full w-full object-cover object-[center_62%] lg:object-center"
            width={475}
            height={530}
            decoding="async"
            fetchPriority="high"
            onError={() => setImgOk(false)}
          />
        )}
        <div aria-hidden className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-forest-deep/45 to-transparent" />
        <p className="absolute left-3 right-3 top-3 flex items-start gap-1.5 rounded-xl bg-white/85 px-3 py-1.5 text-[12.5px] leading-snug text-forest-deep backdrop-blur sm:right-auto sm:max-w-[80%] lg:left-4 lg:top-4 lg:max-w-[52%]">
          <Icon name="info" size={14} className="mt-0.5 shrink-0" />
          情境示意圖（AI 生成），畫面中的平板內容非現有系統。
        </p>
      </div>

      {/* 桌機：資訊卡浮在圖片右側；手機與平板：排在圖片下方可左右滑動 */}
      <ul
        aria-label="陪跑時會一起整理的三件事（介面示意）"
        className="scroll-row -mx-5 mt-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-2 sm:-mx-6 sm:px-6 lg:pointer-events-none lg:mx-0 lg:overflow-visible lg:absolute lg:inset-y-0 lg:right-0 lg:mt-0 lg:flex lg:w-[230px] lg:flex-col lg:justify-between lg:gap-0 lg:px-0 lg:py-6 xl:-right-4"
      >
        {HERO_CARDS.map((c, i) => (
          <li
            key={c.title}
            className={
              'float-card min-w-[232px] snap-start rounded-2xl border border-white/70 bg-white/90 p-4 shadow-lift backdrop-blur-md lg:min-w-0 lg:pointer-events-auto ' +
              (i === 2 ? 'lg:translate-y-9' : i === 0 ? 'lg:-translate-y-5' : '')
            }
            style={{ animationDelay: `${0.25 + i * 0.15}s` }}
          >
            <div className="flex items-center gap-2.5">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-forest text-white">
                <Icon name={c.icon} size={18} />
              </span>
              <span className="text-[16px] font-bold text-forest-deep">{c.title}</span>
            </div>
            <ul className="mt-2.5 space-y-1">
              {c.items.map((it) => (
                <li key={it} className="flex items-center gap-2 text-[14px] text-subtle">
                  <Icon name="circle-check" size={15} className="text-sage" />
                  {it}
                </li>
              ))}
            </ul>
            <MiniVisual kind={c.mini} />
          </li>
        ))}
      </ul>
    </div>
  );
}

function MiniVisual({ kind }: { kind: 'week' | 'flow' | 'bars' }) {
  if (kind === 'week') {
    return (
      <div aria-hidden className="mt-3 grid grid-cols-7 gap-1">
        {['一', '二', '三', '四', '五', '六', '日'].map((d, i) => (
          <span key={d} className="flex flex-col items-center gap-1 text-[11px] text-muted">
            {d}
            <span className={'h-1.5 w-full rounded-full ' + (i < 4 ? 'bg-forest' : i < 6 ? 'bg-sage' : 'bg-line')} />
          </span>
        ))}
      </div>
    );
  }
  if (kind === 'flow') {
    return (
      <div aria-hidden className="mt-3 flex items-center gap-1 text-[11px] font-medium">
        <span className="rounded-full bg-gold-soft px-2 py-0.5 text-[#6B4E1A]">待確認</span>
        <Icon name="chevron-right" size={12} className="text-muted" />
        <span className="rounded-full bg-sage-soft px-2 py-0.5 text-forest">備貨</span>
        <Icon name="chevron-right" size={12} className="text-muted" />
        <span className="rounded-full bg-forest px-2 py-0.5 text-white">已出貨</span>
      </div>
    );
  }
  return (
    <div aria-hidden className="mt-3 flex h-6 items-end gap-1">
      {[70, 95, 40, 30].map((h, i) => (
        <span key={i} className="grow-bar flex-1 rounded-t-[4px] bg-forest/80" style={{ height: `${h}%`, animationDelay: `${0.5 + i * 0.1}s` }} />
      ))}
    </div>
  );
}
