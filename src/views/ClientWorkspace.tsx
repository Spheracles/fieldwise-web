import { useMemo, useState, type ReactNode } from 'react';
import { CLIENT_DEMO } from '../data/demo';
import { PLANS, planFullName } from '../config/plans';
import { useApp } from '../context/AppContext';
import { cx, formatNTD, formatShortDate } from '../lib/format';
import type { Order, OrderStatus, Task, TaskStatus } from '../types/domain';
import { BudgetBars, ColumnChart, ProgressBar, StatTile } from '../components/charts';
import { Icon, type IconName } from '../components/ui/Icon';
import { NavLink, Tag } from '../components/ui/primitives';

export function ViewShell({ title, desc, icon, children, other }: { title: string; desc: string; icon: IconName; children: ReactNode; other: { to: string; label: string } }) {
  return (
    <main id="main" className="pb-24 pt-6 lg:pb-16 lg:pt-10">
      <div className="container-x">
        <nav aria-label="麵包屑" className="flex flex-wrap items-center gap-1 text-[14px] text-muted">
          <NavLink to="top" className="inline-flex min-h-10 items-center gap-1 rounded-full px-2 hover:text-forest">
            <Icon name="chevron-left" size={16} />
            回到首頁
          </NavLink>
          <span aria-hidden>/</span>
          <span className="px-2 text-ink">{title}</span>
        </nav>
        <header className="mt-3 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="flex items-center gap-3 font-serif text-[30px] font-bold text-forest-deep sm:text-[36px]">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-forest text-white">
                <Icon name={icon} size={24} />
              </span>
              {title}
            </h1>
            <p className="mt-2 max-w-2xl text-[16px] leading-relaxed text-subtle">{desc}</p>
          </div>
          <NavLink to={other.to} className="inline-flex min-h-11 items-center gap-2 self-start rounded-full border border-forest/30 bg-white px-4 text-[15px] font-semibold text-forest hover:border-forest lg:self-auto">
            {other.label}
            <Icon name="arrow-right" size={16} />
          </NavLink>
        </header>
        <div role="note" className="mt-5 flex items-start gap-3 rounded-2xl border-2 border-dashed border-gold/60 bg-gold-soft/60 px-4 py-3 text-[15px] leading-relaxed text-[#5A4216]">
          <Icon name="info" size={20} className="mt-0.5 shrink-0 text-gold-deep" />
          <p>
            <strong className="font-bold">示範資料，非實際農場數值。</strong>
            這個畫面用來展示正式版工作台的功能規劃；所有名稱、數字與文件皆為虛構，操作只會改變這個頁面的畫面，重新整理後即恢復。
          </p>
        </div>
        <div className="mt-6">{children}</div>
      </div>
    </main>
  );
}

export function Panel({ title, icon, action, children, className }: { title: string; icon: IconName; action?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section className={cx('rounded-[28px] border border-line/80 bg-white p-5 shadow-soft sm:p-6', className)} aria-label={title}>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h2 className="flex items-center gap-2 text-[17px] font-bold text-forest-deep">
          <Icon name={icon} size={19} className="text-forest" />
          {title}
        </h2>
        {action}
      </div>
      {children}
    </section>
  );
}

const TASK_LABEL: Record<TaskStatus, string> = { todo: '待辦', doing: '進行中', done: '已完成' };
const ORDER_STATUSES: OrderStatus[] = ['待確認', '備貨中', '已出貨'];

export function ClientWorkspace() {
  const { notify } = useApp();
  const d = CLIENT_DEMO;
  const plan = PLANS.find((p) => p.id === d.plan)!;
  const [tasks, setTasks] = useState<Task[]>(d.tasks);
  const [taskFilter, setTaskFilter] = useState<'all' | TaskStatus>('all');
  const [orders, setOrders] = useState<Order[]>(d.orders);
  const [orderFilter, setOrderFilter] = useState<'all' | OrderStatus>('all');
  const [pdca, setPdca] = useState<number>(d.pdca.current);
  const [pdcaView, setPdcaView] = useState<number>(d.pdca.current);
  const [harvest, setHarvest] = useState(d.harvest);

  const goalAvg = Math.round(d.goals.reduce((s, g) => s + g.progress, 0) / d.goals.length);
  const doing = tasks.filter((t) => t.status === 'doing').length;
  const pending = orders.filter((o) => o.status !== '已出貨').length;
  const shownTasks = taskFilter === 'all' ? tasks : tasks.filter((t) => t.status === taskFilter);
  const shownOrders = orderFilter === 'all' ? orders : orders.filter((o) => o.status === orderFilter);
  const totalHours = d.timesheet.reduce((s, t) => s + t.hours, 0);
  const shortDays = harvest.filter((h) => h.assigned < h.need).length;

  const cycleTask = (id: string) =>
    setTasks((ts) => ts.map((t) => (t.id === id ? { ...t, status: t.status === 'todo' ? 'doing' : t.status === 'doing' ? 'done' : 'todo' } : t)));

  const counts = useMemo(
    () => ({ all: tasks.length, todo: tasks.filter((t) => t.status === 'todo').length, doing, done: tasks.filter((t) => t.status === 'done').length }),
    [tasks, doing],
  );

  return (
    <ViewShell
      title="客戶工作台"
      icon="layout-dashboard"
      desc={`${d.org}・${planFullName(plan)}・${d.period}・負責顧問：${d.consultant}`}
      other={{ to: 'admin-demo', label: '切換到管理者工作台示範' }}
    >
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatTile label="本季目標平均完成度" value={`${goalAvg}%`} sub={`${d.goals.length} 項季度目標`} icon="target" />
        <StatTile label="進行中任務" value={doing} sub={`共 ${tasks.length} 項任務`} icon="list-checks" />
        <StatTile label="待交付訂單" value={pending} sub="待確認＋備貨中" icon="package" tone={pending > 2 ? 'warn' : 'default'} />
        <StatTile label="下次顧問會議" value={formatShortDate(d.nextMeeting.date)} sub={`${d.nextMeeting.time}・${d.nextMeeting.mode}・${d.nextMeeting.topic}`} icon="calendar-check" />
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-3">
        <Panel title="本季目標" icon="flag">
          <ul className="space-y-5">
            {d.goals.map((g) => (
              <li key={g.title}>
                <div className="mb-1.5 flex items-baseline justify-between gap-3 text-[15px]">
                  <span className="text-ink">{g.title}</span>
                  <span className="font-semibold tabular-nums text-forest">{g.progress}%</span>
                </div>
                <ProgressBar value={g.progress} label={g.title} />
              </li>
            ))}
          </ul>
        </Panel>

        <Panel
          title={`PDCA 追蹤・${d.pdca.cycle}`}
          icon="refresh-cw"
          className="lg:col-span-2"
          action={
            <button
              type="button"
              disabled={pdca >= 3}
              onClick={() => {
                const n = Math.min(3, pdca + 1);
                setPdca(n);
                setPdcaView(n);
                notify(`已將「${d.pdca.steps[pdca].name}」標記完成（示範）。`, 'success');
              }}
              className="inline-flex min-h-10 items-center gap-1.5 rounded-full bg-forest px-4 text-[14px] font-semibold text-white disabled:opacity-40"
            >
              <Icon name="check" size={16} />
              {pdca >= 3 ? '本輪進行到改善階段' : `完成「${d.pdca.steps[pdca].name}」`}
            </button>
          }
        >
          <ol className="grid grid-cols-4 gap-2" role="tablist" aria-label="PDCA 階段">
            {d.pdca.steps.map((s, i) => (
              <li key={s.key} role="presentation">
                <button
                  type="button"
                  role="tab"
                  aria-selected={pdcaView === i}
                  onClick={() => setPdcaView(i)}
                  className={cx(
                    'flex w-full flex-col items-center gap-1 rounded-2xl px-1 py-3 text-center transition-colors',
                    pdcaView === i ? 'bg-forest text-white' : i < pdca ? 'bg-sage-mist text-forest' : 'bg-cream text-subtle',
                  )}
                >
                  <span className="font-serif text-[22px] font-bold leading-none">{s.key}</span>
                  <span className="text-[13px] font-semibold">{s.name}</span>
                  <span className={cx('text-[11px]', pdcaView === i ? 'text-white/75' : 'text-muted')}>{i < pdca ? '已完成' : i === pdca ? '進行中' : '未開始'}</span>
                </button>
              </li>
            ))}
          </ol>
          <div role="tabpanel" className="mt-4 rounded-2xl bg-cream p-4" key={pdcaView}>
            <p className="text-[14px] font-semibold text-forest">
              {d.pdca.steps[pdcaView].key}・{d.pdca.steps[pdcaView].name}
            </p>
            <ul className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-3">
              {d.pdca.steps[pdcaView].items.map((it) => (
                <li key={it} className="flex items-start gap-2 rounded-xl bg-white px-3 py-2.5 text-[14px] leading-relaxed text-ink ring-1 ring-line">
                  <Icon name={pdcaView < pdca ? 'circle-check' : 'check'} size={16} className={cx('mt-0.5 shrink-0', pdcaView < pdca ? 'text-forest' : 'text-sage')} />
                  {it}
                </li>
              ))}
            </ul>
          </div>
        </Panel>

        <Panel
          title="任務"
          icon="list-checks"
          className="lg:col-span-2"
          action={
            <div className="scroll-row -mx-1 flex gap-1 overflow-x-auto px-1" role="group" aria-label="任務篩選">
              {(['all', 'todo', 'doing', 'done'] as const).map((k) => (
                <button
                  key={k}
                  type="button"
                  aria-pressed={taskFilter === k}
                  onClick={() => setTaskFilter(k)}
                  className={cx('inline-flex min-h-10 shrink-0 items-center gap-1 rounded-full px-3 text-[14px] font-semibold', taskFilter === k ? 'bg-forest text-white' : 'bg-cream text-forest')}
                >
                  {k === 'all' ? '全部' : TASK_LABEL[k]}
                  <span className={cx('rounded-full px-1.5 text-[12px]', taskFilter === k ? 'bg-white/20' : 'bg-white')}>{counts[k]}</span>
                </button>
              ))}
            </div>
          }
        >
          <ul className="divide-y divide-line">
            {shownTasks.length === 0 && <li className="py-6 text-center text-[15px] text-muted">這個分類目前沒有任務。</li>}
            {shownTasks.map((t) => (
              <li key={t.id} className="flex flex-wrap items-center gap-x-3 gap-y-1.5 py-3">
                <button
                  type="button"
                  onClick={() => setTasks((ts) => ts.map((x) => (x.id === t.id ? { ...x, status: x.status === 'done' ? 'todo' : 'done' } : x)))}
                  className={cx('inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full', t.status === 'done' ? 'text-forest' : 'text-[#7E8A7F] hover:text-forest')}
                  aria-label={t.status === 'done' ? `將「${t.title}」改回待辦` : `將「${t.title}」標記完成`}
                >
                  {t.status === 'done' ? <Icon name="circle-check" size={24} strokeWidth={2} /> : <span aria-hidden className="h-[22px] w-[22px] rounded-full border-2 border-current" />}
                </button>
                <div className="min-w-0 flex-1">
                  <p className={cx('text-[15px]', t.status === 'done' ? 'text-muted line-through' : 'text-ink')}>{t.title}</p>
                  <p className="text-[13px] text-muted">
                    {t.owner}負責・{formatShortDate(t.due, true)} 前・{t.tag}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => cycleTask(t.id)}
                  className={cx(
                    'inline-flex min-h-9 items-center gap-1 rounded-full px-3 text-[13px] font-semibold',
                    t.status === 'done' ? 'bg-sage-mist text-forest' : t.status === 'doing' ? 'bg-gold-soft text-[#6B4E1A]' : 'bg-cream text-subtle',
                  )}
                  title="點一下切換狀態"
                >
                  {TASK_LABEL[t.status]}
                  <Icon name="refresh-cw" size={12} />
                </button>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel title="已排定顧問會議" icon="calendar-days">
          <ul className="space-y-3">
            {d.meetings.map((m) => (
              <li key={m.date} className="flex gap-3 rounded-2xl bg-cream p-3.5">
                <span className="flex w-14 shrink-0 flex-col items-center justify-center rounded-xl bg-white py-1.5 ring-1 ring-line">
                  <span className="text-[12px] text-muted">{m.date.slice(5, 7)} 月</span>
                  <span className="text-[20px] font-bold leading-tight text-forest-deep">{Number(m.date.slice(8))}</span>
                </span>
                <span className="min-w-0">
                  <span className="block text-[15px] font-semibold text-ink">{m.topic}</span>
                  <span className="block text-[13px] text-muted">
                    {formatShortDate(m.date, true)} {m.time}・{m.mode}
                  </span>
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-5 border-t border-dashed border-line pt-4">
            <p className="text-[14px] font-semibold text-forest-deep">會議前，農場要準備</p>
            <ul className="mt-2 space-y-1.5">
              {tasks
                .filter((t) => t.owner === '農場' && t.status !== 'done')
                .slice(0, 3)
                .map((t) => (
                  <li key={t.id} className="flex items-start gap-2 text-[14px] text-subtle">
                    <Icon name="notebook-pen" size={15} className="mt-1 shrink-0 text-gold-deep" />
                    {t.title}
                  </li>
                ))}
            </ul>
          </div>
          <button
            type="button"
            onClick={() => notify('行事曆預約尚未串接，正式版會連到預約系統。', 'warn')}
            className="mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full border border-dashed border-forest/40 text-[15px] font-semibold text-forest hover:bg-sage-mist"
          >
            <Icon name="plus" size={16} />
            申請加開會議（尚未串接）
          </button>
        </Panel>

        <Panel
          title="本週採收排程（11/16–11/22）"
          icon="calendar-days"
          className="lg:col-span-3"
          action={
            shortDays > 0 ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-gold-soft px-3 py-1 text-[13px] font-semibold text-[#6B4E1A]">
                <Icon name="triangle-alert" size={14} />
                {shortDays} 天人力不足
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-full bg-sage-mist px-3 py-1 text-[13px] font-semibold text-forest">
                <Icon name="circle-check" size={14} />
                人力已排滿
              </span>
            )
          }
        >
          <ul className="scroll-row -mx-1 grid auto-cols-[minmax(116px,1fr)] grid-flow-col gap-2 overflow-x-auto px-1 pb-1">
            {harvest.map((h, i) => {
              const short = h.assigned < h.need;
              const rest = h.need === 0;
              return (
                <li key={h.date} className={cx('flex flex-col rounded-2xl p-3 ring-1', rest ? 'bg-cream/60 ring-line' : short ? 'bg-gold-soft/50 ring-gold/40' : 'bg-sage-mist ring-sage/30')}>
                  <span className="text-[13px] text-muted">
                    週{h.day}・{h.date}
                  </span>
                  <span className="mt-1 text-[15px] font-semibold text-forest-deep">{h.crop}</span>
                  {!rest && (
                    <>
                      <span className="mt-2 text-[13px] text-subtle">
                        需 {h.need} 人・已排 <strong className="tabular-nums text-ink">{h.assigned}</strong>
                      </span>
                      <span className="mt-2 flex items-center gap-1">
                        <button
                          type="button"
                          className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white text-forest ring-1 ring-line disabled:opacity-40"
                          aria-label={`週${h.day}減少 1 人`}
                          disabled={h.assigned <= 0}
                          onClick={() => setHarvest((hs) => hs.map((x, j) => (j === i ? { ...x, assigned: x.assigned - 1 } : x)))}
                        >
                          <Icon name="minus" size={14} />
                        </button>
                        <button
                          type="button"
                          className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white text-forest ring-1 ring-line"
                          aria-label={`週${h.day}增加 1 人`}
                          onClick={() => setHarvest((hs) => hs.map((x, j) => (j === i ? { ...x, assigned: x.assigned + 1 } : x)))}
                        >
                          <Icon name="plus" size={14} />
                        </button>
                      </span>
                      {short && (
                        <span className="mt-2 flex items-center gap-1 text-[12px] font-semibold text-[#6B4E1A]">
                          <Icon name="triangle-alert" size={12} />缺 {h.need - h.assigned} 人
                        </span>
                      )}
                    </>
                  )}
                </li>
              );
            })}
          </ul>
        </Panel>

        <Panel
          title="待交付訂單"
          icon="shopping-cart"
          className="lg:col-span-2"
          action={
            <div className="scroll-row -mx-1 flex gap-1 overflow-x-auto px-1" role="group" aria-label="訂單篩選">
              {(['all', ...ORDER_STATUSES] as const).map((k) => (
                <button
                  key={k}
                  type="button"
                  aria-pressed={orderFilter === k}
                  onClick={() => setOrderFilter(k)}
                  className={cx('inline-flex min-h-10 shrink-0 items-center rounded-full px-3 text-[14px] font-semibold', orderFilter === k ? 'bg-forest text-white' : 'bg-cream text-forest')}
                >
                  {k === 'all' ? '全部' : k}
                </button>
              ))}
            </div>
          }
        >
          <div className="scroll-row overflow-x-auto">
            <table className="w-full min-w-[560px] text-left text-[14px]">
              <caption className="sr-only">待交付訂單清單</caption>
              <thead className="text-muted">
                <tr>
                  <th className="px-2 pb-2 font-medium">訂單編號</th>
                  <th className="px-2 pb-2 font-medium">來源</th>
                  <th className="px-2 pb-2 font-medium">品項</th>
                  <th className="px-2 pb-2 text-right font-medium">數量</th>
                  <th className="px-2 pb-2 font-medium">出貨日</th>
                  <th className="px-2 pb-2 font-medium">狀態</th>
                </tr>
              </thead>
              <tbody>
                {shownOrders.map((o) => (
                  <tr key={o.id} className="border-t border-line">
                    <td className="px-2 py-2.5 font-mono text-[13px] text-subtle">{o.id}</td>
                    <td className="px-2 py-2.5">
                      <span className="rounded-full bg-cream px-2 py-0.5 text-[13px]">{o.channel}</span>
                    </td>
                    <td className="px-2 py-2.5 text-ink">{o.item}</td>
                    <td className="px-2 py-2.5 text-right tabular-nums">{o.qty}</td>
                    <td className="px-2 py-2.5 tabular-nums">{formatShortDate(o.shipDate)}</td>
                    <td className="px-2 py-2">
                      <label className="sr-only" htmlFor={`os-${o.id}`}>
                        {o.id} 狀態
                      </label>
                      <select
                        id={`os-${o.id}`}
                        value={o.status}
                        onChange={(e) => setOrders((os) => os.map((x) => (x.id === o.id ? { ...x, status: e.target.value as OrderStatus } : x)))}
                        className={cx(
                          'min-h-10 rounded-full border-0 px-3 text-[13px] font-semibold outline-none ring-1 focus:ring-2 focus:ring-forest',
                          o.status === '已出貨' ? 'bg-sage-mist text-forest ring-sage/40' : o.status === '備貨中' ? 'bg-gold-soft text-[#6B4E1A] ring-gold/40' : 'bg-white text-ink ring-line',
                        )}
                      >
                        {ORDER_STATUSES.map((s) => (
                          <option key={s}>{s}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
                {shownOrders.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-6 text-center text-muted">
                      這個狀態目前沒有訂單。
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Panel>

        <Panel title="預算執行與成本類別" icon="wallet" action={<span className="text-[13px] text-muted">11 月・未稅</span>}>
          <BudgetBars rows={d.budget} />
          <p className="mt-4 text-[13px] text-muted">
            合計支出 {formatNTD(d.budget.reduce((s, b) => s + b.actual, 0))}／預算 {formatNTD(d.budget.reduce((s, b) => s + b.budget, 0))}
          </p>
        </Panel>

        <Panel title="營運指標（基準值→目標→實際值）" icon="gauge" className="lg:col-span-2">
          <div className="scroll-row overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-[14px]">
              <caption className="sr-only">營運與永續指標，含基準值、改善目標、實際值與資料來源</caption>
              <thead className="text-muted">
                <tr>
                  <th className="pb-2 font-medium">指標</th>
                  <th className="pb-2 text-right font-medium">基準值</th>
                  <th className="pb-2 text-right font-medium">改善目標</th>
                  <th className="pb-2 text-right font-medium">實際值</th>
                  <th className="pb-2 pl-4 font-medium">資料來源</th>
                </tr>
              </thead>
              <tbody>
                {d.metrics.map((m) => {
                  const hasData = m.baseline !== null && m.actual !== null && m.target !== null;
                  const progress = hasData ? Math.max(0, Math.min(100, ((m.baseline! - m.actual!) / (m.baseline! - m.target!)) * 100)) : 0;
                  return (
                    <tr key={m.name} className="border-t border-line align-top">
                      <td className="py-3">
                        <span className="block font-medium text-ink">{m.name}</span>
                        <span className="text-[12px] text-muted">
                          {m.unit}・每{m.cadence}
                        </span>
                        {hasData && <ProgressBar value={progress} className="mt-1.5 h-1.5 max-w-[160px]" label={`${m.name}改善進度`} />}
                      </td>
                      <Cell v={m.baseline} />
                      <Cell v={m.target} />
                      <Cell v={m.actual} strong />
                      <td className="py-3 pl-4 text-[13px] text-subtle">{m.source}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="mt-3 flex items-start gap-2 rounded-2xl bg-sage-mist p-3 text-[13px] leading-relaxed text-forest">
            <Icon name="info" size={15} className="mt-0.5 shrink-0" />
            指標以可驗證的原始紀錄為前提；尚無資料的指標會清楚標示，不推算減碳量或 ESG 分數。
          </p>
        </Panel>

        <Panel title="月度行動清單完成率" icon="chart-column">
          <ColumnChart
            caption="7 月至 11 月每月行動清單完成率"
            unit="%"
            max={100}
            data={d.monthlyProgress.map((m) => ({ label: m.month, value: m.value, note: m.partial ? '月中' : undefined }))}
          />
          <p className="mt-2 text-[13px] text-muted">11 月為月中進度（斜紋）。</p>
        </Panel>

        <Panel title="合作文件" icon="folder-open" className="lg:col-span-2">
          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {d.documents.map((doc) => (
              <li key={doc.id} className="flex flex-col rounded-2xl bg-cream p-4">
                <span className="flex items-center gap-2 text-[13px] text-muted">
                  <Icon name="file-text" size={16} />
                  {doc.kind}・{formatShortDate(doc.updatedAt)} 更新
                </span>
                <span className="mt-1.5 flex-1 text-[15px] font-semibold text-ink">{doc.name}</span>
                <span className="mt-3 flex items-center justify-between gap-2">
                  <span
                    className={cx(
                      'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[12px] font-semibold',
                      doc.status === '已確認' ? 'bg-sage-mist text-forest' : doc.status === '待確認' ? 'bg-gold-soft text-[#6B4E1A]' : 'bg-white text-muted ring-1 ring-line',
                    )}
                  >
                    <Icon name={doc.status === '已確認' ? 'circle-check' : doc.status === '待確認' ? 'hourglass' : 'pencil'} size={12} />
                    {doc.status}
                  </span>
                  <button type="button" onClick={() => notify('示範模式無法下載文件；正式版需登入並依權限存取。', 'warn')} className="inline-flex min-h-9 items-center gap-1 rounded-full px-2 text-[13px] font-semibold text-forest hover:bg-white">
                    <Icon name="eye" size={14} />
                    開啟
                  </button>
                </span>
              </li>
            ))}
          </ul>
        </Panel>
        <Panel title="本月工時" icon="clock" action={<span className="text-[14px] tabular-nums text-muted">合計 {totalHours} 小時</span>}>
          <ul className="space-y-3">
            {d.timesheet.map((t) => (
              <li key={t.type}>
                <div className="flex justify-between text-[14px]">
                  <span className="text-ink">{t.type}</span>
                  <span className="tabular-nums text-subtle">
                    {t.hours} 小時<span className="ml-1 text-muted">（{Math.round((t.hours / totalHours) * 100)}%）</span>
                  </span>
                </div>
                <ProgressBar value={(t.hours / d.timesheet[0].hours) * 100} className="mt-1.5" label={`${t.type}工時`} />
              </li>
            ))}
          </ul>
          <p className="mt-4 text-[13px] text-muted">資料來源：排班表與每日工時紀錄（示範）</p>
        </Panel>

      </div>
      <div className="mt-6 flex justify-center">
        <Tag kind="demo">本頁所有資料為示範，非實際農場數值</Tag>
      </div>
    </ViewShell>
  );
}

function Cell({ v, strong }: { v: number | null; strong?: boolean }) {
  return (
    <td className={cx('py-3 text-right tabular-nums', strong ? 'font-semibold text-forest-deep' : 'text-subtle')}>
      {v === null ? <span className="whitespace-nowrap rounded-full bg-cream px-2 py-0.5 text-[12px] font-normal text-muted">尚無資料</span> : v}
    </td>
  );
}
