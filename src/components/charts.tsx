/**
 * 輕量圖表元件（純 HTML／CSS）：單一色相、細線條、4px 圓角資料端、
 * 滑鼠移入或鍵盤聚焦時顯示數值，並提供表格檢視。
 */
import { useState, type ReactNode } from 'react';
import { cx, formatNTD } from '../lib/format';
import { Icon } from './ui/Icon';

export function StatTile({ label, value, sub, icon, tone = 'default' }: { label: string; value: ReactNode; sub?: ReactNode; icon: Parameters<typeof Icon>[0]['name']; tone?: 'default' | 'warn' }) {
  return (
    <div className="rounded-3xl border border-line/80 bg-white p-5 shadow-soft">
      <div className="flex items-center justify-between gap-2">
        <p className="text-[14px] font-medium text-muted">{label}</p>
        <span className={cx('inline-flex h-9 w-9 items-center justify-center rounded-xl', tone === 'warn' ? 'bg-gold-soft text-gold-deep' : 'bg-sage-mist text-forest')}>
          <Icon name={icon} size={18} />
        </span>
      </div>
      <p className="mt-2 break-words text-[22px] font-bold leading-tight tracking-tight text-forest-deep tabular-nums sm:text-[28px]">{value}</p>
      {sub && <p className="mt-1 text-[13px] text-subtle">{sub}</p>}
    </div>
  );
}

export function ProgressBar({ value, label, className }: { value: number; label?: string; className?: string }) {
  const v = Math.max(0, Math.min(100, value));
  return (
    <div className={cx('h-2.5 w-full overflow-hidden rounded-full bg-cream-deep', className)} role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(v)} aria-label={label}>
      <div className="progress-fill h-full rounded-full bg-forest" style={{ width: `${v}%` }} />
    </div>
  );
}

/** 預算執行：每列一個類別，軌道＝預算、填色＝實際支出；超支以狀態色＋圖示＋文字標示 */
export function BudgetBars({ rows }: { rows: { category: string; budget: number; actual: number }[] }) {
  const totalActual = rows.reduce((s, r) => s + r.actual, 0);
  return (
    <ul className="space-y-4">
      {rows.map((r) => {
        const pct = (r.actual / r.budget) * 100;
        const over = r.actual > r.budget;
        const share = Math.round((r.actual / totalActual) * 100);
        return (
          <li key={r.category} className="group" title={`${r.category}：實際 ${formatNTD(r.actual)}／預算 ${formatNTD(r.budget)}`}>
            <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5 text-[14px]">
              <span className="whitespace-nowrap font-semibold text-ink">
                {r.category}
                <span className="ml-1.5 font-normal text-muted">占支出 {share}%</span>
              </span>
              <span className="ml-auto whitespace-nowrap tabular-nums text-subtle">
                {formatNTD(r.actual)} <span className="text-muted">／ {formatNTD(r.budget)}</span>
              </span>
            </div>
            <div className="relative mt-1.5 h-2.5 rounded-full bg-cream-deep">
              <div className={cx('progress-fill h-full rounded-full', over ? 'bg-danger' : 'bg-forest')} style={{ width: `${Math.min(100, pct)}%` }} />
            </div>
            {over && (
              <p className="mt-1 flex items-center gap-1 text-[13px] font-medium text-danger">
                <Icon name="triangle-alert" size={14} />
                超出預算 {formatNTD(r.actual - r.budget)}（{Math.round(pct)}%）
              </p>
            )}
          </li>
        );
      })}
    </ul>
  );
}

/** 直條圖：單一數列；hover／focus 顯示數值；可切換表格 */
export function ColumnChart({
  data,
  unit = '',
  max,
  caption,
  highlightLast = true,
}: {
  data: { label: string; value: number; note?: string }[];
  unit?: string;
  max?: number;
  caption: string;
  highlightLast?: boolean;
}) {
  const [hover, setHover] = useState<number | null>(null);
  const [table, setTable] = useState(false);
  const top = max ?? Math.max(...data.map((d) => d.value)) * 1.15;
  const ticks = [0, 0.5, 1].map((t) => Math.round(top * t));
  return (
    <div>
      <div className="mb-2 flex justify-end">
        <button type="button" onClick={() => setTable((t) => !t)} className="inline-flex min-h-9 items-center gap-1 rounded-full px-3 text-[13px] font-semibold text-forest hover:bg-sage-mist" aria-pressed={table}>
          <Icon name={table ? 'chart-column' : 'list-checks'} size={14} />
          {table ? '圖表檢視' : '表格檢視'}
        </button>
      </div>
      {table ? (
        <table className="w-full text-[14px]">
          <caption className="sr-only">{caption}</caption>
          <thead>
            <tr className="text-left text-muted">
              <th className="py-1.5 font-medium">月份</th>
              <th className="py-1.5 text-right font-medium">數值</th>
            </tr>
          </thead>
          <tbody>
            {data.map((d) => (
              <tr key={d.label} className="border-t border-line">
                <td className="py-1.5">{d.label}</td>
                <td className="py-1.5 text-right tabular-nums">
                  {d.value}
                  {unit}
                  {d.note && <span className="ml-1 text-muted">（{d.note}）</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <figure>
          <div className="relative flex h-44 gap-3 pl-9">
            {ticks.map((t) => (
              <div key={t} aria-hidden className="pointer-events-none absolute left-9 right-0 border-t border-line/70" style={{ bottom: `${(t / top) * 100}%` }}>
                <span className="absolute -left-9 -translate-y-1/2 text-[11px] tabular-nums text-muted">
                  {t}
                  {unit}
                </span>
              </div>
            ))}
            {data.map((d, i) => {
              const last = highlightLast && i === data.length - 1;
              const show = hover === i || (hover === null && last);
              return (
                <button
                  key={d.label}
                  type="button"
                  className="group relative flex h-full flex-1 items-end justify-center outline-none"
                  onMouseEnter={() => setHover(i)}
                  onMouseLeave={() => setHover(null)}
                  onFocus={() => setHover(i)}
                  onBlur={() => setHover(null)}
                  aria-label={`${d.label}：${d.value}${unit}${d.note ? `（${d.note}）` : ''}`}
                >
                  <span
                    className={cx('grow-bar block w-full max-w-[34px] rounded-t-[4px] transition-colors', hover === i ? 'bg-forest-deep' : 'bg-forest/85', d.note && 'bg-[repeating-linear-gradient(135deg,#214D3D_0_4px,#3F6D5B_4px_8px)]')}
                    style={{ height: `${(d.value / top) * 100}%`, animationDelay: `${i * 70}ms` }}
                  />
                  {show && (
                    <span className="pointer-events-none absolute z-10 -translate-y-2 whitespace-nowrap rounded-lg bg-forest-deep px-2 py-1 text-[12px] font-semibold text-white shadow-soft" style={{ bottom: `${(d.value / top) * 100}%` }}>
                      {d.value}
                      {unit}
                      {d.note ? `・${d.note}` : ''}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
          <div aria-hidden className="mt-2 flex gap-3 pl-9">
            {data.map((d) => (
              <span key={d.label} className="flex-1 text-center text-[12px] text-muted">
                {d.label}
              </span>
            ))}
          </div>
          <figcaption className="sr-only">{caption}</figcaption>
        </figure>
      )}
    </div>
  );
}

/** 水平長條（單一色相），用於階段分布、方案營收等 */
export function HBarList({ rows, format = (n: number) => String(n), max }: { rows: { label: string; value: number; sub?: string }[]; format?: (n: number) => string; max?: number }) {
  const top = max ?? Math.max(1, ...rows.map((r) => r.value));
  return (
    <ul className="space-y-3">
      {rows.map((r) => (
        <li key={r.label} className="grid grid-cols-[88px_1fr_auto] items-center gap-3 text-[14px]" title={`${r.label}：${format(r.value)}`}>
          <span className="truncate font-medium text-ink">{r.label}</span>
          <span className="h-2.5 rounded-full bg-cream-deep">
            <span className="progress-fill block h-full rounded-full bg-forest" style={{ width: `${(r.value / top) * 100}%`, minWidth: r.value ? 6 : 0 }} />
          </span>
          <span className="min-w-[2.5rem] text-right tabular-nums text-subtle">
            {format(r.value)}
            {r.sub && <span className="ml-1 text-muted">{r.sub}</span>}
          </span>
        </li>
      ))}
    </ul>
  );
}
