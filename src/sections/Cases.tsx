import { useRef, useState, type KeyboardEvent } from 'react';
import { CASES } from '../config/content';
import { getService } from '../config/services';
import { cx } from '../lib/format';
import { Icon } from '../components/ui/Icon';
import { SectionHeading, Tag } from '../components/ui/primitives';

export function Cases() {
  const [active, setActive] = useState(CASES[0].id);
  const tabsRef = useRef<HTMLDivElement>(null);
  const c = CASES.find((x) => x.id === active)!;

  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const i = CASES.findIndex((x) => x.id === active);
    let n = i;
    if (e.key === 'ArrowRight') n = (i + 1) % CASES.length;
    else if (e.key === 'ArrowLeft') n = (i - 1 + CASES.length) % CASES.length;
    else return;
    e.preventDefault();
    setActive(CASES[n].id);
    tabsRef.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]')[n]?.focus();
  };

  return (
    <section id="cases" aria-labelledby="cases-title" className="py-20 lg:py-28">
      <div className="container-x">
        <SectionHeading
          id="cases-title"
          eyebrow="轉型情境"
          title="三個常見情境，看看陪跑怎麼進行。"
          desc={
            <>
              以下皆為<strong className="font-semibold text-forest">模擬案例</strong>
              ，用來說明工作方法，不是真實客戶或業績。實際成效會以導入後的紀錄衡量。
            </>
          }
        />

        <div ref={tabsRef} role="tablist" aria-label="模擬案例" onKeyDown={onKey} className="mx-auto mb-6 grid max-w-3xl grid-cols-3 gap-2 rounded-full bg-white p-1.5 shadow-soft ring-1 ring-line">
          {CASES.map((x) => {
            const on = x.id === active;
            return (
              <button
                key={x.id}
                type="button"
                role="tab"
                id={`case-tab-${x.id}`}
                aria-selected={on}
                aria-controls="case-panel"
                tabIndex={on ? 0 : -1}
                onClick={() => setActive(x.id)}
                className={cx(
                  'inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-2 text-[15px] font-semibold transition-colors sm:text-[16px]',
                  on ? 'bg-forest text-white' : 'text-forest hover:bg-sage-mist',
                )}
              >
                <Icon name={x.icon} size={18} className="hidden sm:block" />
                {x.tab}
              </button>
            );
          })}
        </div>

        <article id="case-panel" role="tabpanel" aria-labelledby={`case-tab-${c.id}`} key={c.id} className="fade-in overflow-hidden rounded-[32px] border border-line bg-white shadow-soft">
          <header className="flex flex-col gap-3 border-b border-line bg-gradient-to-r from-sage-mist to-white px-5 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-8">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <Tag kind="sim">模擬案例｜非真實業績</Tag>
              </div>
              <h3 className="mt-2 font-serif text-[24px] font-bold text-forest-deep sm:text-[28px]">{c.title}</h3>
              <p className="mt-1 text-[15px] text-subtle">{c.persona}</p>
            </div>
            <ul className="flex flex-wrap gap-2">
              {c.services.map((sid) => (
                <li key={sid} className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-[14px] font-medium text-forest ring-1 ring-sage/40">
                  <Icon name={getService(sid).icon} size={15} />
                  {getService(sid).title}
                </li>
              ))}
            </ul>
          </header>

          <div className="grid grid-cols-1 gap-px bg-line md:grid-cols-3">
            <div className="bg-white p-5 sm:p-7">
              <h4 className="flex items-center gap-2 text-[16px] font-bold text-forest-deep">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-danger-soft text-danger">
                  <Icon name="circle-alert" size={18} />
                </span>
                導入前的狀況
              </h4>
              <ul className="mt-4 space-y-3">
                {c.before.map((b) => (
                  <li key={b} className="flex items-start gap-2.5 text-[15px] leading-[1.75] text-subtle">
                    <Icon name="x" size={16} className="mt-1 shrink-0 text-danger/70" />
                    {b}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white p-5 sm:p-7">
              <h4 className="flex items-center gap-2 text-[16px] font-bold text-forest-deep">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-sage-soft text-forest">
                  <Icon name="route" size={18} />
                </span>
                陪跑做法
              </h4>
              <ol className="mt-4 space-y-3">
                {c.steps.map((s, i) => (
                  <li key={s} className="flex items-start gap-3 text-[15px] leading-[1.75] text-ink">
                    <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-forest text-[12px] font-bold text-white">{i + 1}</span>
                    {s}
                  </li>
                ))}
              </ol>
            </div>
            <div className="bg-white p-5 sm:p-7">
              <h4 className="flex items-center gap-2 text-[16px] font-bold text-forest-deep">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gold-soft text-gold-deep">
                  <Icon name="target" size={18} />
                </span>
                會追蹤的指標
              </h4>
              <ul className="mt-4 space-y-2.5">
                {c.metrics.map((m) => (
                  <li key={m} className="flex items-center justify-between gap-3 rounded-2xl bg-cream px-4 py-3 text-[15px] text-ink">
                    {m}
                    <span className="shrink-0 text-[13px] text-muted">導入後記錄</span>
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-[14px] leading-relaxed text-muted">先記錄基準值，再設定目標；本案例不提供成效數字。</p>
              {c.note && (
                <p className="mt-3 flex items-start gap-2 rounded-2xl bg-gold-soft/60 p-3 text-[14px] leading-relaxed text-[#5A4216]">
                  <Icon name="triangle-alert" size={16} className="mt-0.5 shrink-0 text-gold-deep" />
                  {c.note}
                </p>
              )}
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
