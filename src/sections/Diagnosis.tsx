import { useMemo, useState } from 'react';
import { DIAGNOSIS_OPTIONS, suggestPlan, type DiagnosisId } from '../config/content';
import { PLANS, planFullName } from '../config/plans';
import { getService, type ServiceId } from '../config/services';
import { useApp } from '../context/AppContext';
import { cx } from '../lib/format';
import { track } from '../lib/track';
import { Icon } from '../components/ui/Icon';
import { Button, SectionHeading } from '../components/ui/primitives';

export function Diagnosis() {
  const { requestInquiry, showService } = useApp();
  const [selected, setSelected] = useState<DiagnosisId[]>([]);
  const [result, setResult] = useState<DiagnosisId[] | null>(null);
  const [error, setError] = useState(false);

  const toggle = (id: DiagnosisId) => {
    setError(false);
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  };

  const run = () => {
    if (!selected.length) {
      setError(true);
      return;
    }
    const ordered = DIAGNOSIS_OPTIONS.filter((o) => selected.includes(o.id)).map((o) => o.id);
    setResult(ordered);
    track('diagnosis_complete', { count: ordered.length, items: ordered.join(',') });
    requestAnimationFrame(() => document.getElementById('diagnosis-result')?.focus());
  };

  const reset = () => {
    setSelected([]);
    setResult(null);
    setError(false);
  };

  const stale = result !== null && (result.length !== selected.length || result.some((r) => !selected.includes(r)));

  const grouped = useMemo(() => {
    if (!result) return [];
    const map = new Map<ServiceId, typeof DIAGNOSIS_OPTIONS>();
    DIAGNOSIS_OPTIONS.filter((o) => result.includes(o.id)).forEach((o) => {
      map.set(o.service, [...(map.get(o.service) ?? []), o]);
    });
    return [...map.entries()].sort((a, b) => b[1].length - a[1].length);
  }, [result]);

  const plan = result ? suggestPlan(result) : null;
  const planLabel = plan ? (plan.plan === 'project' ? '單次診斷／專案報價' : planFullName(PLANS.find((p) => p.id === plan.plan)!)) : '';

  return (
    <section id="diagnosis" aria-labelledby="diagnosis-title" className="relative overflow-hidden bg-forest-deep py-20 text-white lg:py-28">
      <svg aria-hidden className="pointer-events-none absolute -left-20 bottom-0 h-[420px] w-[900px] text-white/[0.05]" viewBox="0 0 900 420" fill="none">
        {Array.from({ length: 9 }, (_, i) => (
          <path key={i} d={`M0 ${120 + i * 34}C200 ${60 + i * 36} 420 ${200 + i * 26} 900 ${90 + i * 38}`} stroke="currentColor" strokeWidth="1.4" />
        ))}
      </svg>
      <div className="container-x relative">
        <SectionHeading
          tone="dark"
          id="diagnosis-title"
          brand="diagnosis"
          eyebrow="1 分鐘快速診斷"
          title="先勾選現在的狀況，看看可以從哪裡開始。"
          desc="依你勾選的項目，對應出可能的服務方向與第一步準備。這不是正式評估，只是幫你在初談前先整理思緒。"
        />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1.1fr] lg:gap-8">
          <div className="rounded-[28px] bg-white/[0.06] p-5 ring-1 ring-white/10 sm:p-7">
            <fieldset>
              <legend className="text-[17px] font-semibold text-white">目前最困擾的是？（可複選）</legend>
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {DIAGNOSIS_OPTIONS.map((o) => {
                  const on = selected.includes(o.id);
                  return (
                    <button
                      key={o.id}
                      type="button"
                      aria-pressed={on}
                      onClick={() => toggle(o.id)}
                      className={cx(
                        'relative flex min-h-[104px] flex-col items-start justify-between gap-3 rounded-2xl p-4 text-left text-[16px] font-semibold transition-[background-color,box-shadow,transform] duration-200 active:scale-[0.98]',
                        on ? 'bg-cream text-forest-deep shadow-lift ring-2 ring-gold' : 'bg-white/[0.08] text-white ring-1 ring-white/15 hover:bg-white/[0.14]',
                      )}
                    >
                      <span className={cx('inline-flex h-10 w-10 items-center justify-center rounded-xl', on ? 'bg-forest text-white' : 'bg-white/10 text-gold')}>
                        <Icon name={o.icon} size={22} />
                      </span>
                      {o.label}
                      <span
                        aria-hidden
                        className={cx(
                          'absolute right-3 top-3 inline-flex h-6 w-6 items-center justify-center rounded-full border-2 transition-colors',
                          on ? 'border-gold bg-gold text-white' : 'border-white/30',
                        )}
                      >
                        {on && <Icon name="check" size={14} strokeWidth={3} />}
                      </span>
                    </button>
                  );
                })}
              </div>
            </fieldset>
            {error && (
              <p role="alert" className="mt-4 flex items-center gap-2 rounded-xl bg-[#F8E6E3] px-4 py-2.5 text-[15px] font-medium text-danger">
                <Icon name="circle-alert" size={18} />
                請至少勾選一項目前的狀況。
              </p>
            )}
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Button size="lg" icon="sparkles" onClick={run} className="sm:flex-1">
                看看建議方向
              </Button>
              <Button size="lg" variant="light" icon="rotate-ccw" onClick={reset} disabled={!selected.length && !result}>
                重設
              </Button>
            </div>
            <p className="mt-4 text-[14px] text-white/60">已選 {selected.length} 項・勾選內容只在這個頁面中使用，不會傳送。</p>
          </div>

          <div id="diagnosis-result" tabIndex={-1} aria-live="polite" className="rounded-[28px] bg-cream p-5 text-ink outline-none sm:p-7">
            {!result ? (
              <div className="flex h-full min-h-[320px] flex-col items-center justify-center text-center">
                <span className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-sage-soft text-forest">
                  <Icon name="compass" size={36} strokeWidth={1.4} />
                </span>
                <p className="mt-5 text-[18px] font-bold text-forest-deep">建議方向會顯示在這裡</p>
                <p className="mt-2 max-w-sm text-[15px] leading-relaxed text-subtle">勾選左側的狀況後，按下「看看建議方向」。</p>
              </div>
            ) : (
              <div className="fade-in">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="font-serif text-[22px] font-bold text-forest-deep">你的初步建議方向</h3>
                  <span className="rounded-full bg-white px-3 py-1 text-[13px] text-muted ring-1 ring-line">依勾選項目對應，非正式評估</span>
                </div>
                {stale && (
                  <p className="mt-3 flex items-center gap-2 rounded-xl bg-gold-soft px-4 py-2.5 text-[14px] text-[#5A4216]">
                    <Icon name="refresh-cw" size={16} />
                    勾選項目已變更，請再按一次「看看建議方向」更新結果。
                  </p>
                )}
                <ol className="mt-5 space-y-3">
                  {grouped.map(([sid, opts], i) => {
                    const svc = getService(sid);
                    return (
                      <li key={sid} className="rounded-2xl bg-white p-4 ring-1 ring-line sm:p-5">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-forest text-[13px] font-bold text-white">{i + 1}</span>
                          <h4 className="text-[17px] font-bold text-forest-deep">{svc.title}</h4>
                          <span className="text-[14px] text-muted">對應：{opts.map((o) => o.label).join('、')}</span>
                        </div>
                        {opts.map((o) => (
                          <div key={o.id} className="mt-3 space-y-1.5 text-[15px] leading-[1.75]">
                            <p className="text-ink">{o.direction}</p>
                            <p className="flex items-start gap-1.5 text-subtle">
                              <Icon name="notebook-pen" size={16} className="mt-1 shrink-0 text-gold-deep" />
                              初談前可以準備：{o.firstStep}
                            </p>
                          </div>
                        ))}
                        <button type="button" onClick={() => showService(sid)} className="mt-2 inline-flex min-h-11 items-center gap-1 text-[15px] font-semibold text-forest underline-offset-4 hover:underline">
                          看這項服務的細節
                          <Icon name="chevron-right" size={16} />
                        </button>
                      </li>
                    );
                  })}
                </ol>
                {plan && (
                  <div className="mt-4 rounded-2xl border border-gold/40 bg-gold-soft/60 p-4 sm:p-5">
                    <p className="text-[14px] font-semibold tracking-[0.1em] text-gold-deep">可以先參考的方案</p>
                    <p className="mt-1 text-[18px] font-bold text-forest-deep">{planLabel}</p>
                    <p className="mt-1 text-[15px] leading-relaxed text-[#5A4216]">{plan.reason}</p>
                  </div>
                )}
                <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                  <Button
                    icon="calendar-check"
                    onClick={() => {
                      track('cta_click', { cta: 'diagnosis_consult' });
                      requestInquiry({
                        problems: DIAGNOSIS_OPTIONS.filter((o) => result.includes(o.id)).map((o) => o.problem),
                        plan: plan?.plan,
                        label: '快速診斷結果',
                      });
                    }}
                  >
                    帶著結果預約初談
                  </Button>
                  <Button variant="outline" to="pricing" iconRight="arrow-right">
                    比較陪跑方案
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
