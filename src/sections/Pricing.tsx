import { useState } from 'react';
import { PLAN_COMPARISON, PLAN_EXCLUSIONS, PLANS, PROJECT_QUOTES, QUARTER_MONTHS, planFullName, planPrice, type Billing, type Plan } from '../config/plans';
import { SITE, taxLabel } from '../config/site';
import { useApp } from '../context/AppContext';
import { useAnimatedNumber } from '../hooks/useMotion';
import { cx, formatNTD } from '../lib/format';
import { track } from '../lib/track';
import { Icon } from '../components/ui/Icon';
import { Button, Reveal, SectionHeading } from '../components/ui/primitives';

export function Pricing() {
  const [billing, setBilling] = useState<Billing>('monthly');
  const [showTable, setShowTable] = useState(false);
  const { requestInquiry } = useApp();

  const setB = (b: Billing) => {
    if (b === billing) return;
    setBilling(b);
    track('billing_toggle', { billing: b });
  };

  const inquire = (plan: Plan) => {
    track('plan_inquiry', { plan: plan.id, billing });
    requestInquiry({ plan: plan.id, label: `${planFullName(plan)}（${billing === 'monthly' ? '月繳' : '季繳'}）` });
  };

  return (
    <section id="pricing" aria-labelledby="pricing-title" className="relative bg-cream-deep/60 py-20 lg:py-28">
      <div className="container-x">
        <SectionHeading
          id="pricing-title"
          eyebrow="陪跑方案"
          title="依農場階段選擇，隨時可以調整。"
          desc="三種月費陪跑方案，都可以選擇月繳或季繳。不確定適合哪一個，就先預約免費初談。"
        />

        <div className="mb-10 flex flex-col items-center gap-3">
          <div role="radiogroup" aria-label="付款週期" className="relative inline-grid grid-cols-2 rounded-full bg-white p-1.5 shadow-soft ring-1 ring-line">
            <span
              aria-hidden
              className={cx('absolute bottom-1.5 left-1.5 top-1.5 w-[calc(50%-6px)] rounded-full bg-forest transition-transform duration-300', billing === 'quarterly' && 'translate-x-full')}
            />
            {(['monthly', 'quarterly'] as Billing[]).map((b) => (
              <button
                key={b}
                type="button"
                role="radio"
                aria-checked={billing === b}
                onClick={() => setB(b)}
                onKeyDown={(e) => {
                  if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
                    e.preventDefault();
                    setB(billing === 'monthly' ? 'quarterly' : 'monthly');
                  }
                }}
                tabIndex={billing === b ? 0 : -1}
                className={cx(
                  'relative z-10 inline-flex min-h-11 min-w-[132px] items-center justify-center gap-1.5 rounded-full px-5 text-[16px] font-semibold transition-colors sm:min-w-[156px]',
                  billing === b ? 'text-white' : 'text-forest',
                )}
              >
                {b === 'monthly' ? '月繳' : '季繳'}
                {b === 'quarterly' && (
                  <span className={cx('rounded-full px-2 py-0.5 text-[12px] font-bold', billing === 'quarterly' ? 'bg-gold text-forest-deep' : 'bg-gold-soft text-gold-deep')}>較省</span>
                )}
              </button>
            ))}
          </div>
          <p className="text-[14px] text-subtle">
            {billing === 'monthly' ? '每月支付一次，適合先試行。' : `季繳為一次支付 ${QUARTER_MONTHS} 個月的總額。`}
          </p>
        </div>

        <ul className="grid grid-cols-1 gap-5 lg:grid-cols-3 lg:items-stretch">
          {PLANS.map((p, i) => (
            <Reveal as="li" key={p.id} delay={i * 90}>
              <PlanCard plan={p} billing={billing} onInquire={() => inquire(p)} />
            </Reveal>
          ))}
        </ul>

        <p className="mt-6 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-center text-[15px] text-subtle">
          <span className="inline-flex items-center gap-1.5 font-semibold text-gold-deep">
            <Icon name="info" size={16} />
            {SITE.pricing.note}
          </span>
          <span aria-hidden className="hidden text-line sm:inline">｜</span>
          <span>以新臺幣（NT$）計價，{taxLabel}</span>
          <span aria-hidden className="hidden text-line sm:inline">｜</span>
          <span>線上付款尚未開放，示範頁面不會扣款</span>
        </p>

        {/* 比較表 */}
        <div className="mt-10 rounded-[28px] border border-line bg-white shadow-soft">
          <button
            type="button"
            className="flex min-h-14 w-full items-center justify-between gap-3 rounded-[28px] px-5 py-4 text-left sm:px-8"
            aria-expanded={showTable}
            aria-controls="plan-table"
            onClick={() => setShowTable((s) => !s)}
          >
            <span className="flex items-center gap-2 text-[17px] font-bold text-forest-deep">
              <Icon name="list-checks" size={20} className="text-forest" />
              方案功能完整比較
            </span>
            <span className="inline-flex items-center gap-1 text-[15px] font-semibold text-forest">
              {showTable ? '收合' : '展開'}
              <Icon name="chevron-down" size={18} className={cx('transition-transform', showTable && 'rotate-180')} />
            </span>
          </button>
          {showTable && (
            <div id="plan-table" className="fade-in scroll-row overflow-x-auto border-t border-line px-2 pb-4 sm:px-6">
              <table className="w-full min-w-[620px] border-collapse text-left text-[15px]">
                <caption className="sr-only">三種陪跑方案的功能比較</caption>
                <thead>
                  <tr>
                    <th scope="col" className="w-[30%] px-3 py-4 text-[14px] font-semibold text-muted">項目</th>
                    {PLANS.map((p) => (
                      <th key={p.id} scope="col" className="px-3 py-4 text-[16px] font-bold text-forest-deep">
                        {p.name}
                        <span className="block text-[13px] font-medium text-muted">{p.label}</span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-line bg-sage-mist/50">
                    <th scope="row" className="px-3 py-3 font-medium text-ink">
                      {billing === 'monthly' ? '月繳金額' : '季繳金額（3 個月）'}
                    </th>
                    {PLANS.map((p) => (
                      <td key={p.id} className="px-3 py-3 font-bold text-forest-deep">
                        {formatNTD(planPrice(p, billing).total)}
                      </td>
                    ))}
                  </tr>
                  {PLAN_COMPARISON.map((row) => (
                    <tr key={row.label} className="border-t border-line">
                      <th scope="row" className="px-3 py-3 font-medium text-ink">{row.label}</th>
                      {PLANS.map((p) => {
                        const v = row.values[p.id];
                        return (
                          <td key={p.id} className="px-3 py-3 text-subtle">
                            {v === true ? (
                              <Icon name="circle-check" size={20} className="text-forest" label="包含" />
                            ) : v === false ? (
                              <span className="text-line" aria-label="不包含">—</span>
                            ) : (
                              v
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-[1fr_1.35fr]">
          <Reveal className="rounded-[28px] border border-dashed border-gold/50 bg-white/70 p-6 sm:p-7">
            <h3 className="flex items-center gap-2 text-[17px] font-bold text-forest-deep">
              <Icon name="circle-alert" size={20} className="text-gold-deep" />
              所有方案皆不包含（視個案另計）
            </h3>
            <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2">
              {PLAN_EXCLUSIONS.map((x) => (
                <li key={x} className="flex items-start gap-2 text-[15px] text-subtle">
                  <Icon name="minus" size={16} className="mt-1 shrink-0 text-gold-deep" />
                  {x}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-[14px] leading-relaxed text-muted">數位自動化的「需求設計」不等於包含完整系統開發。</p>
          </Reveal>
          <Reveal delay={80} className="rounded-[28px] bg-forest p-6 text-white sm:p-7">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h3 className="text-[19px] font-bold">不想綁月費？也可以專案報價</h3>
                <p className="mt-1 text-[15px] text-white/75">單次需求依範圍評估，先從免費初談了解狀況。</p>
              </div>
              <span className="rounded-full bg-gold px-3 py-1 text-[14px] font-bold text-forest-deep">初談 {SITE.freeConsultMinutes} 分鐘免費</span>
            </div>
            <ul className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
              {PROJECT_QUOTES.map((q) => (
                <li key={q.title} className="rounded-2xl bg-white/[0.08] p-4 ring-1 ring-white/15">
                  <Icon name={q.icon} size={22} className="text-[#E9C77E]" />
                  <p className="mt-2 text-[16px] font-bold">{q.title}</p>
                  <p className="mt-1 text-[14px] leading-relaxed text-white/75">{q.desc}</p>
                  <p className="mt-2 text-[13px] font-semibold text-[#E9C77E]">專案報價</p>
                </li>
              ))}
            </ul>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button
                variant="primary"
                icon="calendar-check"
                onClick={() => {
                  track('plan_inquiry', { plan: 'project' });
                  requestInquiry({ plan: 'project', label: '單次診斷／專案報價' });
                }}
              >
                詢問專案報價
              </Button>
              <p className="text-[13px] text-white/65">免費初談僅做問題初篩，不含完整診斷與書面建議。</p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function PlanCard({ plan, billing, onInquire }: { plan: Plan; billing: Billing; onInquire: () => void }) {
  const { total, perMonth, saving } = planPrice(plan, billing);
  const animated = useAnimatedNumber(total);
  const hi = plan.recommended;
  return (
    <article
      aria-labelledby={`plan-${plan.id}`}
      className={cx(
        'relative flex h-full flex-col rounded-[28px] p-6 transition-shadow sm:p-8',
        hi ? 'bg-forest-deep text-white shadow-lift ring-2 ring-gold lg:-my-3 lg:py-11' : 'border border-line bg-white shadow-soft',
      )}
    >
      {hi && (
        <span className="absolute -top-3.5 left-1/2 inline-flex -translate-x-1/2 items-center gap-1 whitespace-nowrap rounded-full bg-gold px-4 py-1 text-[13px] font-bold text-forest-deep shadow-soft">
          <Icon name="sparkles" size={14} />
          已有訂單與人手的農場可優先參考
        </span>
      )}
      <div className="flex items-center gap-3">
        <span className={cx('inline-flex h-12 w-12 items-center justify-center rounded-2xl', hi ? 'bg-white/10 text-gold' : 'bg-sage-mist text-forest')}>
          <Icon name={plan.icon} size={24} />
        </span>
        <div>
          <h3 id={`plan-${plan.id}`} className={cx('font-serif text-[24px] font-bold leading-tight', hi ? 'text-white' : 'text-forest-deep')}>
            {plan.name}
            <span className={cx('ml-1 text-[17px] font-semibold', hi ? 'text-white/70' : 'text-muted')}>｜{plan.label}</span>
          </h3>
          <p className={cx('text-[14px]', hi ? 'text-white/70' : 'text-muted')}>適合：{plan.audience}</p>
        </div>
      </div>
      <p className={cx('mt-4 text-[15px] leading-relaxed', hi ? 'text-white/80' : 'text-subtle')}>{plan.tagline}</p>

      <div className="mt-6" aria-live="polite">
        <p className="flex flex-wrap items-baseline gap-x-2">
          <span className={cx('text-[40px] font-bold leading-none tracking-tight tabular-nums', hi ? 'text-white' : 'text-forest-deep')}>{formatNTD(animated)}</span>
          <span className={cx('text-[16px] font-medium', hi ? 'text-white/75' : 'text-muted')}>{billing === 'monthly' ? '／月' : '／3 個月'}</span>
        </p>
        <p className={cx('mt-2 min-h-[48px] text-[14px] leading-relaxed', hi ? 'text-white/75' : 'text-subtle')}>
          {billing === 'monthly' ? (
            <>
              每月支付・季繳 3 個月為 {formatNTD(plan.quarterly)}，可省 {formatNTD(plan.monthly * QUARTER_MONTHS - plan.quarterly)}
            </>
          ) : (
            <>
              一次支付 3 個月・平均每月約 {formatNTD(perMonth)}
              <br />
              <span className={cx('font-semibold', hi ? 'text-gold' : 'text-gold-deep')}>較月繳 3 個月（{formatNTD(plan.monthly * QUARTER_MONTHS)}）省 {formatNTD(saving)}</span>
            </>
          )}
        </p>
      </div>

      <ul className={cx('mt-5 space-y-2.5 border-t pt-5 text-[15px]', hi ? 'border-white/15' : 'border-line')}>
        {[plan.meetings, plan.hours].map((t) => (
          <li key={t} className="flex items-start gap-2.5 font-semibold">
            <Icon name="clock" size={18} className={cx('mt-0.5 shrink-0', hi ? 'text-gold' : 'text-forest')} />
            {t}
          </li>
        ))}
        {plan.includesPrevious && (
          <li className={cx('flex items-start gap-2.5', hi ? 'text-white/80' : 'text-subtle')}>
            <Icon name="layers" size={18} className={cx('mt-0.5 shrink-0', hi ? 'text-gold' : 'text-forest')} />
            {plan.includesPrevious}
          </li>
        )}
        {plan.features.map((f) => (
          <li key={f} className={cx('flex items-start gap-2.5', hi ? 'text-white/90' : 'text-ink')}>
            <Icon name="check" size={18} className={cx('mt-0.5 shrink-0', hi ? 'text-gold' : 'text-forest')} />
            {f}
          </li>
        ))}
      </ul>

      <div className="mt-auto pt-7">
        <Button variant={hi ? 'primary' : 'forest'} className="w-full" iconRight="arrow-right" onClick={onInquire}>
          詢問此方案
        </Button>
        <p className={cx('mt-3 text-center text-[13px]', hi ? 'text-white/60' : 'text-muted')}>{taxLabel}・最終以報價為準</p>
      </div>
    </article>
  );
}
