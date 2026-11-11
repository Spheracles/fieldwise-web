import { useRef, type KeyboardEvent } from 'react';
import { SERVICES, type ServiceId } from '../config/services';
import { useApp } from '../context/AppContext';
import { cx } from '../lib/format';
import { track } from '../lib/track';
import { Icon } from '../components/ui/Icon';
import { Button, Reveal, SectionHeading } from '../components/ui/primitives';

export function Services() {
  const { showService } = useApp();
  const core = SERVICES.filter((s) => s.tier === 'core');
  const land = SERVICES.find((s) => s.id === 'land')!;
  const gov = SERVICES.find((s) => s.id === 'governance')!;

  const open = (id: ServiceId, from: string) => {
    track('service_view', { service: id, from });
    showService(id);
  };

  return (
    <section id="services" aria-labelledby="services-title" className="relative py-20 lg:py-28">
      <div className="container-x">
        <SectionHeading
          id="services-title"
          eyebrow="我們的核心服務"
          title={
            <>
              從一張企劃書，
              <br className="sm:hidden" />
              到一套能持續運作的制度。
            </>
          }
          desc="從經營到轉型，依照「盤點→規劃→導入→追蹤」陪你一起做。每項服務都寫清楚做什麼、交付什麼，以及不做什麼。"
        />

        <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {core.map((s, i) => (
            <Reveal as="li" key={s.id} delay={i * 80}>
              <article className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-line/80 bg-white p-6 shadow-soft transition-[box-shadow,transform] duration-300 hover:-translate-y-1 hover:shadow-lift lg:p-7">
                <span aria-hidden className="absolute right-5 top-4 font-serif text-[44px] font-bold leading-none text-sage-soft">
                  {s.code}
                </span>
                <span className="relative inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-sage-mist text-forest ring-1 ring-sage/30">
                  <Icon name={s.icon} size={32} strokeWidth={1.4} />
                </span>
                <h3 className="mt-5 font-serif text-[21px] font-bold text-forest-deep">{s.title}</h3>
                <span aria-hidden className="mt-3 block h-px w-full bg-gradient-to-r from-gold/60 to-transparent" />
                <p className="mt-3 flex-1 text-[16px] leading-[1.8] text-subtle">{s.short}</p>
                <button
                  type="button"
                  onClick={() => open(s.id, 'card')}
                  className="mt-5 inline-flex min-h-11 items-center justify-between gap-2 rounded-full bg-cream px-4 text-[15px] font-semibold text-forest transition-colors hover:bg-forest hover:text-white"
                  aria-label={`查看「${s.title}」服務細節`}
                >
                  查看服務細節
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-forest text-white transition-colors group-hover:bg-gold-deep">
                    <Icon name="arrow-right" size={16} />
                  </span>
                </button>
              </article>
            </Reveal>
          ))}
        </ul>

        <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-[1.55fr_1fr]">
          <Reveal>
            <article className="flex h-full flex-col gap-5 rounded-3xl border border-line/80 bg-gradient-to-br from-sage-mist to-white p-6 sm:flex-row sm:items-center lg:p-7">
              <span className="inline-flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white text-forest ring-1 ring-sage/40">
                <Icon name={land.icon} size={30} strokeWidth={1.4} />
              </span>
              <div className="flex-1">
                <p className="text-[14px] font-semibold tracking-[0.12em] text-gold-deep">延伸服務 {land.code}</p>
                <h3 className="mt-1 text-[19px] font-bold text-forest-deep">{land.title}</h3>
                <p className="mt-1.5 text-[15px] leading-[1.8] text-subtle">{land.summary}</p>
              </div>
              <Button variant="outline" size="sm" iconRight="arrow-right" onClick={() => open(land.id, 'secondary')} className="shrink-0">
                服務細節
              </Button>
            </article>
          </Reveal>
          <Reveal delay={80}>
            <article className="flex h-full flex-col justify-center rounded-3xl border border-dashed border-line bg-white/60 p-6 lg:p-7">
              <p className="flex items-center gap-2 text-[14px] font-semibold tracking-[0.12em] text-gold-deep">
                <Icon name="scale" size={18} />
                支援項目 {gov.code}｜{gov.title}
              </p>
              <p className="mt-2 text-[15px] leading-[1.8] text-subtle">
                協助整理營運流程與公司設立相關資訊；正式法律、會計與稅務意見，轉介合格律師與會計師。
              </p>
              <button type="button" onClick={() => open(gov.id, 'support')} className="mt-3 inline-flex min-h-11 items-center gap-1 self-start text-[15px] font-semibold text-forest underline-offset-4 hover:underline">
                了解服務邊界
                <Icon name="chevron-right" size={16} />
              </button>
            </article>
          </Reveal>
        </div>

        <ServiceDetail />
      </div>
    </section>
  );
}

function ServiceDetail() {
  const { activeService, setActiveService, requestInquiry } = useApp();
  const tabsRef = useRef<HTMLDivElement>(null);
  const s = SERVICES.find((x) => x.id === activeService)!;

  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const idx = SERVICES.findIndex((x) => x.id === activeService);
    let next = idx;
    if (e.key === 'ArrowRight') next = (idx + 1) % SERVICES.length;
    else if (e.key === 'ArrowLeft') next = (idx - 1 + SERVICES.length) % SERVICES.length;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = SERVICES.length - 1;
    else return;
    e.preventDefault();
    setActiveService(SERVICES[next].id);
    tabsRef.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]')[next]?.focus();
  };

  return (
    <div id="service-detail" className="mt-16 scroll-mt-24 rounded-[32px] border border-line bg-white shadow-soft">
      <div className="border-b border-line px-5 pt-6 sm:px-8">
        <h3 className="flex items-center gap-2 text-[15px] font-semibold tracking-[0.15em] text-gold-deep">
          <Icon name="clipboard-list" size={18} />
          服務細節與交付邊界
        </h3>
        <div ref={tabsRef} role="tablist" aria-label="服務項目" onKeyDown={onKey} className="scroll-row -mx-5 mt-4 flex gap-1 overflow-x-auto px-5 sm:-mx-8 sm:px-8">
          {SERVICES.map((x) => {
            const selected = x.id === activeService;
            return (
              <button
                key={x.id}
                type="button"
                role="tab"
                id={`svc-tab-${x.id}`}
                aria-selected={selected}
                aria-controls="svc-panel"
                tabIndex={selected ? 0 : -1}
                onClick={() => {
                  setActiveService(x.id);
                  track('service_view', { service: x.id, from: 'tab' });
                }}
                className={cx(
                  'relative inline-flex min-h-12 shrink-0 items-center gap-2 whitespace-nowrap rounded-t-2xl px-4 text-[15px] font-semibold transition-colors',
                  selected ? 'bg-sage-mist text-forest-deep' : 'text-muted hover:text-forest',
                )}
              >
                <span className={cx('inline-flex h-6 w-6 items-center justify-center rounded-full text-[12px]', selected ? 'bg-forest text-white' : 'bg-cream text-forest')}>{x.code}</span>
                {x.tab}
                {selected && <span aria-hidden className="absolute inset-x-3 bottom-0 h-[3px] rounded-full bg-gold" />}
              </button>
            );
          })}
        </div>
      </div>

      <div id="svc-panel" role="tabpanel" aria-labelledby={`svc-tab-${s.id}`} key={s.id} className="fade-in grid grid-cols-1 gap-8 p-5 sm:p-8 lg:grid-cols-[1.25fr_1fr] lg:gap-12 lg:p-10">
        <div>
          <div className="flex items-start gap-4">
            <span className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-forest text-white">
              <Icon name={s.icon} size={28} strokeWidth={1.5} />
            </span>
            <div>
              <p className="text-[14px] font-semibold tracking-[0.12em] text-gold-deep">服務 {s.code}</p>
              <h4 className="font-serif text-[24px] font-bold leading-snug text-forest-deep sm:text-[28px]">{s.title}</h4>
            </div>
          </div>
          <p className="mt-5 text-[17px] leading-[1.85] text-ink">{s.summary}</p>
          <p className="mt-3 flex items-start gap-2 text-[15px] leading-[1.8] text-subtle">
            <Icon name="users" size={18} className="mt-1 shrink-0 text-sage" />
            <span>
              <strong className="font-semibold text-forest">適合：</strong>
              {s.fit}
            </span>
          </p>

          <h5 className="mt-7 text-[16px] font-bold text-forest-deep">服務內容</h5>
          <ul className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {s.includes.map((it) => (
              <li key={it} className="flex items-start gap-2.5 rounded-2xl bg-cream/70 px-4 py-3 text-[15px] leading-relaxed text-ink">
                <Icon name="check" size={18} className="mt-0.5 shrink-0 text-forest" />
                {it}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col gap-4">
          <div className="rounded-3xl bg-sage-mist p-5 sm:p-6">
            <h5 className="flex items-center gap-2 text-[16px] font-bold text-forest-deep">
              <Icon name="package" size={18} />
              交付成果
            </h5>
            <ul className="mt-3 flex flex-wrap gap-2">
              {s.deliverables.map((d) => (
                <li key={d} className="rounded-full bg-white px-3 py-1.5 text-[14px] text-forest ring-1 ring-sage/40">
                  {d}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-3xl border border-line p-5 sm:p-6">
            <h5 className="flex items-center gap-2 text-[16px] font-bold text-forest-deep">
              <Icon name="shield-check" size={18} />
              服務邊界
            </h5>
            <ul className="mt-2.5 space-y-2">
              {s.boundary.map((b) => (
                <li key={b} className="flex items-start gap-2 text-[15px] leading-[1.75] text-subtle">
                  <span aria-hidden className="mt-[0.7em] h-1.5 w-1.5 shrink-0 rounded-full bg-sage" />
                  {b}
                </li>
              ))}
              <li className="flex items-start gap-2 text-[15px] leading-[1.75] text-subtle">
                <span aria-hidden className="mt-[0.7em] h-1.5 w-1.5 shrink-0 rounded-full bg-sage" />
                第三方軟體、設備、交通與現場工作等費用，依個案另計。
              </li>
            </ul>
          </div>
          {s.compliance && (
            <p className="flex items-start gap-2.5 rounded-3xl border border-gold/40 bg-gold-soft/60 p-5 text-[15px] leading-[1.75] text-[#5A4216]">
              <Icon name="triangle-alert" size={20} className="mt-0.5 shrink-0 text-gold-deep" />
              {s.compliance}
            </p>
          )}
          <Button
            className="mt-1 self-start"
            icon="calendar-check"
            onClick={() => {
              track('cta_click', { cta: 'service_detail', service: s.id });
              requestInquiry({ problems: [s.relatedProblem], label: `服務：${s.title}` });
            }}
          >
            諮詢這項服務
          </Button>
        </div>
      </div>
    </div>
  );
}
