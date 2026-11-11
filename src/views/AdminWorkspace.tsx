import { useEffect, useMemo, useState, useSyncExternalStore } from 'react';
import { ADMIN_LEADS, ADMIN_SUBSCRIPTIONS, ADMIN_TASKS, CONSULTANTS, DEMO_TODAY, LEAD_SOURCES, LEAD_STAGES, type DemoLead, type DemoSubscription } from '../data/demo';
import { PLANS, QUARTER_MONTHS } from '../config/plans';
import { useApp } from '../context/AppContext';
import { cx, daysBetween, formatNTD, formatShortDate } from '../lib/format';
import { INQUIRY_KEY, clearDemoData, onDemoStorageChange, readJSON, type LocalInquiry } from '../lib/storage';
import { EVENT_LABELS, getEvents, subscribeEvents } from '../lib/track';
import type { LeadSource, LeadStage, RenewalStatus } from '../types/domain';
import { HBarList, StatTile } from '../components/charts';
import { Icon } from '../components/ui/Icon';
import { Tag } from '../components/ui/primitives';
import { Panel, ViewShell } from './ClientWorkspace';

const RENEWALS: RenewalStatus[] = ['待聯繫', '已聯繫', '已續約', '不續約'];
const ACTIVE_STAGES: LeadStage[] = ['新洽詢', '已約初談', '盤點報價'];
const WON: LeadStage[] = ['已簽約', '陪跑中'];

function useLocalInquiries() {
  const [list, setList] = useState<LocalInquiry[]>(() => readJSON<LocalInquiry[]>(INQUIRY_KEY, []));
  useEffect(() => onDemoStorageChange(() => setList(readJSON<LocalInquiry[]>(INQUIRY_KEY, []))), []);
  return list;
}

const monthlyEquivalent = (s: DemoSubscription) => {
  const plan = PLANS.find((p) => p.id === s.plan)!;
  return s.billing === 'monthly' ? plan.monthly : plan.quarterly / QUARTER_MONTHS;
};

export function AdminWorkspace() {
  const { notify } = useApp();
  const local = useLocalInquiries();
  const [leads, setLeads] = useState<DemoLead[]>(ADMIN_LEADS);
  const [source, setSource] = useState<'全部' | LeadSource>('全部');
  const [subs, setSubs] = useState(ADMIN_SUBSCRIPTIONS);
  const [tasks, setTasks] = useState(ADMIN_TASKS);
  const events = useSyncExternalStore(subscribeEvents, getEvents, getEvents);

  const localLeads: DemoLead[] = local.map((l) => ({
    id: l.id,
    createdAt: l.createdAt,
    displayName: '（本機示範，不含姓名）',
    orgName: '',
    region: l.region,
    clientType: l.clientType,
    problems: l.problems,
    interestedPlan: l.plan,
    source: '官網',
    stage: '新洽詢',
    assignee: '',
    local: true,
  }));
  const allLeads = [...localLeads, ...leads];
  const shown = source === '全部' ? allLeads : allLeads.filter((l) => l.source === source);

  const monthLeads = allLeads.filter((l) => l.createdAt.startsWith(DEMO_TODAY.slice(0, 7)) || l.local).length;
  const activeCases = allLeads.filter((l) => ACTIVE_STAGES.includes(l.stage)).length;
  const expiring = subs
    .map((s) => ({ ...s, left: daysBetween(DEMO_TODAY, s.end) }))
    .filter((s) => s.left >= 0 && s.left <= 30)
    .sort((a, b) => a.left - b.left);
  const mrr = subs.reduce((sum, s) => sum + monthlyEquivalent(s), 0);
  const nextMrr = subs.filter((s) => !(s.renewal === '不續約' && daysBetween(DEMO_TODAY, s.end) <= 30)).reduce((sum, s) => sum + monthlyEquivalent(s), 0);

  const byPlan = PLANS.map((p) => ({
    label: p.name,
    value: subs.filter((s) => s.plan === p.id).reduce((sum, s) => sum + monthlyEquivalent(s), 0),
    sub: `${subs.filter((s) => s.plan === p.id).length} 家`,
  }));

  const stageRows = LEAD_STAGES.map((st) => ({ label: st, value: allLeads.filter((l) => l.stage === st).length }));

  const channel = useMemo(
    () =>
      LEAD_SOURCES.map((src) => {
        const ls = allLeads.filter((l) => l.source === src);
        return { src, total: ls.length, won: ls.filter((l) => WON.includes(l.stage)).length };
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [leads, local],
  );

  const updateLead = (id: string, patch: Partial<DemoLead>) => {
    if (id.startsWith('LOCAL-')) {
      notify('本機示範紀錄僅供檢視；正式版才會寫入資料庫。', 'info');
      return;
    }
    setLeads((ls) => ls.map((l) => (l.id === id ? { ...l, ...patch } : l)));
  };

  return (
    <ViewShell
      title="管理者工作台"
      icon="kanban"
      desc="洽詢名單、案件階段、任務分派、方案到期提醒與月營收預估。正式版僅限管理員與獲授權顧問登入使用。"
      other={{ to: 'client-demo', label: '切換到客戶工作台示範' }}
    >
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatTile label="本月新洽詢" value={monthLeads} sub={local.length ? `含本機示範 ${local.length} 筆` : '2026 年 11 月'} icon="user-plus" />
        <StatTile label="洽談中案件" value={activeCases} sub="新洽詢＋初談＋報價" icon="briefcase" />
        <StatTile label="30 天內到期方案" value={expiring.length} sub="需安排續約聯繫" icon="bell" tone={expiring.length ? 'warn' : 'default'} />
        <StatTile label="月營收預估（月均）" value={formatNTD(mrr)} sub="未稅・季繳以 3 個月平均" icon="circle-dollar-sign" />
      </div>

      <Panel
        title="洽詢名單"
        icon="users"
        className="mt-5"
        action={
          <div className="scroll-row -mx-1 flex gap-1 overflow-x-auto px-1" role="group" aria-label="依來源篩選">
            {(['全部', ...LEAD_SOURCES] as const).map((s) => (
              <button
                key={s}
                type="button"
                aria-pressed={source === s}
                onClick={() => setSource(s)}
                className={cx('inline-flex min-h-10 shrink-0 items-center rounded-full px-3 text-[14px] font-semibold', source === s ? 'bg-forest text-white' : 'bg-cream text-forest')}
              >
                {s}
              </button>
            ))}
          </div>
        }
      >
        <div className="hidden grid-cols-[1.1fr_1fr_1.4fr_0.8fr_0.9fr_1fr_1fr] gap-3 border-b border-line pb-2 text-[13px] font-medium text-muted lg:grid">
          <span>編號／日期</span>
          <span>稱呼・單位</span>
          <span>縣市・類型・主要問題</span>
          <span>詢問方案</span>
          <span>來源</span>
          <span>案件階段</span>
          <span>指派顧問</span>
        </div>
        <ul className="divide-y divide-line">
          {shown.map((l) => (
            <li key={l.id} className={cx('grid grid-cols-1 gap-x-3 gap-y-2 py-3.5 text-[14px] sm:grid-cols-2 lg:grid-cols-[1.1fr_1fr_1.4fr_0.8fr_0.9fr_1fr_1fr] lg:items-center', l.local && '-mx-3 rounded-2xl bg-gold-soft/40 px-3')}>
              <div>
                <span className="font-mono text-[13px] text-subtle">{l.id}</span>
                <span className="block text-[13px] text-muted">{formatShortDate(l.createdAt)}</span>
                {l.local && <Tag kind="demo" className="mt-1">本機示範</Tag>}
              </div>
              <div>
                <span className="block font-semibold text-ink">{l.displayName}</span>
                <span className="block text-[13px] text-muted">{l.orgName || '—'}</span>
              </div>
              <div>
                <span className="block text-ink">
                  {l.region}・{l.clientType}
                </span>
                <span className="mt-1 flex flex-wrap gap-1">
                  {l.problems.map((p) => (
                    <span key={p} className="rounded-full bg-cream px-2 py-0.5 text-[12px] text-subtle">
                      {p}
                    </span>
                  ))}
                </span>
              </div>
              <div className="text-ink">
                <span className="text-[12px] text-muted lg:hidden">詢問方案：</span>
                {l.interestedPlan || '—'}
              </div>
              <div>
                <span className="inline-flex items-center gap-1 rounded-full bg-sage-mist px-2.5 py-0.5 text-[13px] font-medium text-forest">
                  <Icon name="megaphone" size={12} />
                  {l.source}
                </span>
              </div>
              <div>
                <label className="sr-only" htmlFor={`stage-${l.id}`}>
                  {l.id} 案件階段
                </label>
                <select
                  id={`stage-${l.id}`}
                  value={l.stage}
                  disabled={l.local}
                  onChange={(e) => updateLead(l.id, { stage: e.target.value as LeadStage })}
                  className="min-h-10 w-full rounded-xl border border-line bg-white px-2 text-[14px] outline-none focus:border-forest disabled:bg-cream"
                >
                  {LEAD_STAGES.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="sr-only" htmlFor={`as-${l.id}`}>
                  {l.id} 指派顧問
                </label>
                <select
                  id={`as-${l.id}`}
                  value={l.assignee}
                  disabled={l.local}
                  onChange={(e) => updateLead(l.id, { assignee: e.target.value })}
                  className={cx('min-h-10 w-full rounded-xl border bg-white px-2 text-[14px] outline-none focus:border-forest disabled:bg-cream', l.assignee ? 'border-line' : 'border-gold text-[#6B4E1A]')}
                >
                  <option value="">未指派</option>
                  {CONSULTANTS.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </div>
            </li>
          ))}
          {shown.length === 0 && <li className="py-6 text-center text-[15px] text-muted">這個來源目前沒有洽詢。</li>}
        </ul>
        <p className="mt-3 text-[13px] text-muted">名單一律遮罩顯示；正式版依角色控管，顧問只能看到被指派的案件。</p>
      </Panel>

      <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-3">
        <Panel title="案件階段分布" icon="kanban">
          <HBarList rows={stageRows} format={(n) => `${n} 件`} />
        </Panel>

        <Panel title="通路獲客成效" icon="megaphone">
          <table className="w-full text-[14px]">
            <caption className="sr-only">各來源的洽詢數與成交數</caption>
            <thead className="text-left text-muted">
              <tr>
                <th className="pb-2 font-medium">來源</th>
                <th className="pb-2 text-right font-medium">洽詢</th>
                <th className="pb-2 text-right font-medium">成交</th>
                <th className="pb-2 text-right font-medium">成交率</th>
              </tr>
            </thead>
            <tbody>
              {channel.map((c) => (
                <tr key={c.src} className="border-t border-line">
                  <td className="py-2 text-ink">{c.src}</td>
                  <td className="py-2 text-right tabular-nums">{c.total}</td>
                  <td className="py-2 text-right tabular-nums">{c.won}</td>
                  <td className="py-2 text-right tabular-nums text-subtle">{c.total ? `${Math.round((c.won / c.total) * 100)}%` : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-3 text-[13px] text-muted">成交＝已簽約＋陪跑中。樣本為示範資料，不代表實際通路表現。</p>
        </Panel>

        <Panel title="月營收預估" icon="circle-dollar-sign">
          <dl className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-cream p-3">
              <dt className="text-[13px] text-muted">目前月均</dt>
              <dd className="mt-0.5 text-[20px] font-bold tabular-nums text-forest-deep">{formatNTD(mrr)}</dd>
            </div>
            <div className="rounded-2xl bg-cream p-3">
              <dt className="text-[13px] text-muted">扣除不續約後</dt>
              <dd className="mt-0.5 text-[20px] font-bold tabular-nums text-forest-deep">{formatNTD(nextMrr)}</dd>
            </div>
          </dl>
          <div className="mt-4">
            <HBarList rows={byPlan} format={(n) => formatNTD(n)} />
          </div>
          <p className="mt-3 text-[13px] text-muted">依方案設定檔價格計算・未稅・未扣除服務成本。</p>
        </Panel>

        <Panel title="任務分派" icon="clipboard-check" className="lg:col-span-2">
          <ul className="divide-y divide-line">
            {tasks.map((t) => {
              const left = daysBetween(DEMO_TODAY, t.due);
              return (
                <li key={t.id} className="grid grid-cols-1 gap-2 py-3 text-[14px] sm:grid-cols-[1fr_auto_160px] sm:items-center sm:gap-4">
                  <div>
                    <span className="flex items-center gap-2 font-semibold text-ink">
                      {t.priority === '高' && (
                        <span className="inline-flex items-center gap-0.5 rounded-full bg-danger-soft px-2 py-0.5 text-[12px] font-semibold text-danger">
                          <Icon name="flag" size={11} />高
                        </span>
                      )}
                      {t.title}
                    </span>
                    <span className="text-[13px] text-muted">{t.client}</span>
                  </div>
                  <span className={cx('text-[13px] tabular-nums', left <= 2 ? 'font-semibold text-[#6B4E1A]' : 'text-subtle')}>
                    {formatShortDate(t.due, true)}・{left === 0 ? '今天到期' : `剩 ${left} 天`}
                  </span>
                  <div>
                    <label className="sr-only" htmlFor={`ta-${t.id}`}>
                      {t.title} 指派給
                    </label>
                    <select
                      id={`ta-${t.id}`}
                      value={t.assignee}
                      onChange={(e) => {
                        const v = e.target.value;
                        setTasks((ts) => ts.map((x) => (x.id === t.id ? { ...x, assignee: v } : x)));
                        if (v) notify(`已將「${t.title}」指派給${v}（示範，未寄出通知）。`, 'success');
                      }}
                      className={cx('min-h-10 w-full rounded-xl border bg-white px-2 text-[14px] outline-none focus:border-forest', t.assignee ? 'border-line' : 'border-gold text-[#6B4E1A]')}
                    >
                      <option value="">未指派</option>
                      {CONSULTANTS.map((c) => (
                        <option key={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </li>
              );
            })}
          </ul>
        </Panel>

        <Panel title="方案到期提醒（30 天內）" icon="bell">
          {expiring.length === 0 ? (
            <p className="py-6 text-center text-[15px] text-muted">30 天內沒有到期的方案。</p>
          ) : (
            <ul className="space-y-3">
              {expiring.map((s) => {
                const plan = PLANS.find((p) => p.id === s.plan)!;
                return (
                  <li key={s.id} className="rounded-2xl bg-cream p-3.5">
                    <div className="flex items-start justify-between gap-2">
                      <span>
                        <span className="block text-[15px] font-semibold text-ink">{s.client}</span>
                        <span className="block text-[13px] text-muted">
                          {plan.name}・{s.billing === 'monthly' ? '月繳' : '季繳'}・{formatShortDate(s.end)} 到期
                        </span>
                      </span>
                      <span className={cx('shrink-0 rounded-full px-2 py-0.5 text-[12px] font-semibold tabular-nums', s.left <= 7 ? 'bg-danger-soft text-danger' : 'bg-white text-subtle')}>
                        剩 {s.left} 天
                      </span>
                    </div>
                    <label className="mt-2 flex items-center gap-2 text-[13px] text-subtle">
                      續約狀態
                      <select
                        value={s.renewal}
                        onChange={(e) => setSubs((ss) => ss.map((x) => (x.id === s.id ? { ...x, renewal: e.target.value as RenewalStatus } : x)))}
                        className="min-h-9 flex-1 rounded-xl border border-line bg-white px-2 text-[14px] text-ink outline-none focus:border-forest"
                      >
                        {RENEWALS.map((r) => (
                          <option key={r}>{r}</option>
                        ))}
                      </select>
                    </label>
                  </li>
                );
              })}
            </ul>
          )}
        </Panel>

        <Panel title="正式版權限規劃" icon="lock" className="lg:col-span-2">
          <div className="scroll-row overflow-x-auto">
            <table className="w-full min-w-[520px] text-left text-[14px]">
              <caption className="sr-only">各角色可存取的資料範圍</caption>
              <thead className="text-muted">
                <tr>
                  <th className="pb-2 font-medium">角色</th>
                  <th className="pb-2 font-medium">可存取範圍</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['訪客', '公開網站內容、送出預約表單'],
                  ['企業客戶', '僅限自己組織的里程碑、任務、訂單、工時、預算與文件'],
                  ['顧問', '僅限被指派案件；不能看到其他企業資料'],
                  ['管理員', '洽詢名單、案件指派、方案與訂閱、稽核紀錄（audit log）'],
                ].map(([r, d]) => (
                  <tr key={r} className="border-t border-line">
                    <td className="py-2.5 font-semibold text-ink">{r}</td>
                    <td className="py-2.5 text-subtle">{d}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>

        <Panel
          title="本次瀏覽的埋點事件"
          icon="database"
          action={
            local.length > 0 ? (
              <button
                type="button"
                onClick={() => {
                  const n = clearDemoData();
                  notify(`已清除這台裝置上的 ${n} 筆示範資料。`, 'success');
                }}
                className="inline-flex min-h-9 items-center gap-1 rounded-full px-2 text-[13px] font-semibold text-forest hover:bg-sage-mist"
              >
                <Icon name="trash-2" size={14} />
                清除本機紀錄
              </button>
            ) : undefined
          }
        >
          {events.length === 0 ? (
            <p className="text-[14px] leading-relaxed text-muted">回到首頁點擊 CTA、切換方案或完成診斷後，事件會出現在這裡。</p>
          ) : (
            <ul className="max-h-60 space-y-1.5 overflow-y-auto pr-1">
              {events.slice(0, 12).map((e) => (
                <li key={e.at + e.name} className="flex items-center justify-between gap-2 rounded-xl bg-cream px-3 py-2 text-[13px]">
                  <span className="font-medium text-ink">{EVENT_LABELS[e.name]}</span>
                  <span className="tabular-nums text-muted">{new Date(e.at).toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}</span>
                </li>
              ))}
            </ul>
          )}
          <p className="mt-3 text-[13px] leading-relaxed text-muted">事件只存在這次瀏覽的記憶體中，沒有傳送給任何分析服務。</p>
        </Panel>
      </div>
      <div className="mt-6 flex justify-center">
        <Tag kind="demo">本頁所有名單、營收與任務皆為示範資料</Tag>
      </div>
    </ViewShell>
  );
}
