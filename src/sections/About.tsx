import { ABOUT } from '../config/content';
import { CLIENT_DEMO } from '../data/demo';
import { Icon } from '../components/ui/Icon';
import { Button, Reveal, SectionHeading, Tag } from '../components/ui/primitives';

export function WorkspacePreview() {
  const leadStages = [
    { label: '新洽詢', n: 2 },
    { label: '初談', n: 1 },
    { label: '報價', n: 1 },
    { label: '陪跑中', n: 2 },
  ];
  return (
    <section id="workspace" aria-labelledby="ws-title" className="bg-white/60 py-20 lg:py-28">
      <div className="container-x">
        <SectionHeading
          id="ws-title"
          eyebrow="陪跑工具示範"
          title="陪跑過程，進度看得見。"
          desc="正式合作後，客戶與顧問會在同一個工作台檢視里程碑、任務、訂單、工時與指標。以下為介面示範，資料皆為虛構。"
        />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Reveal>
            <article className="flex h-full flex-col rounded-[28px] border border-line bg-white p-6 shadow-soft sm:p-8">
              <div className="flex items-center justify-between gap-3">
                <h3 className="flex items-center gap-2 text-[20px] font-bold text-forest-deep">
                  <Icon name="layout-dashboard" size={22} className="text-forest" />
                  客戶工作台
                </h3>
                <Tag kind="demo" />
              </div>
              <p className="mt-2 text-[15px] leading-relaxed text-subtle">本季目標、PDCA 追蹤、採收排程、待交付訂單、預算與文件，一頁看完。</p>
              <div aria-hidden className="mt-5 space-y-3 rounded-2xl bg-cream p-4">
                {CLIENT_DEMO.goals.map((g) => (
                  <div key={g.title}>
                    <div className="flex justify-between text-[13px] text-subtle">
                      <span className="truncate">{g.title}</span>
                      <span className="tabular-nums">{g.progress}%</span>
                    </div>
                    <div className="mt-1 h-2 rounded-full bg-white">
                      <div className="h-2 rounded-full bg-forest" style={{ width: `${g.progress}%` }} />
                    </div>
                  </div>
                ))}
              </div>
              <Button to="client-demo" variant="forest" className="mt-6 self-start" iconRight="arrow-right">
                開啟客戶工作台示範
              </Button>
            </article>
          </Reveal>
          <Reveal delay={80}>
            <article className="flex h-full flex-col rounded-[28px] border border-line bg-white p-6 shadow-soft sm:p-8">
              <div className="flex items-center justify-between gap-3">
                <h3 className="flex items-center gap-2 text-[20px] font-bold text-forest-deep">
                  <Icon name="kanban" size={22} className="text-forest" />
                  管理者工作台
                </h3>
                <Tag kind="demo" />
              </div>
              <p className="mt-2 text-[15px] leading-relaxed text-subtle">洽詢名單與來源、案件階段、任務分派、方案到期提醒與月營收預估。</p>
              <div aria-hidden className="mt-5 grid grid-cols-4 gap-2 rounded-2xl bg-cream p-4">
                {leadStages.map((s) => (
                  <div key={s.label} className="rounded-xl bg-white p-3 text-center">
                    <p className="text-[22px] font-bold text-forest-deep tabular-nums">{s.n}</p>
                    <p className="text-[12px] text-muted">{s.label}</p>
                  </div>
                ))}
              </div>
              <Button to="admin-demo" variant="forest" className="mt-6 self-start" iconRight="arrow-right">
                開啟管理者工作台示範
              </Button>
            </article>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

export function About() {
  return (
    <section id="about" aria-labelledby="about-title" className="py-20 lg:py-28">
      <div className="container-x">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_1fr] lg:gap-16">
          <div>
            <SectionHeading align="left" id="about-title" eyebrow="關於我們" title="一支懂數位、也願意下田的青年團隊。" />
            <Reveal className="-mt-4 space-y-4 text-[17px] leading-[1.95] text-subtle">
              {ABOUT.philosophy.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </Reveal>
            <Reveal className="mt-8">
              <h3 className="text-[16px] font-bold tracking-[0.1em] text-forest-deep">我們的工作方法</h3>
              <ol className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {ABOUT.method.map((m, i) => (
                  <li key={m.title} className="relative rounded-2xl bg-white p-4 ring-1 ring-line">
                    <span className="text-[12px] font-bold tracking-[0.2em] text-gold-deep">0{i + 1}</span>
                    <Icon name={m.icon} size={22} className="mt-2 text-forest" />
                    <p className="mt-2 text-[17px] font-bold text-forest-deep">{m.title}</p>
                    <p className="mt-1 text-[14px] leading-relaxed text-subtle">{m.desc}</p>
                  </li>
                ))}
              </ol>
            </Reveal>
          </div>

          <div className="flex flex-col gap-5">
            <Reveal className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-[28px] bg-forest p-6 text-white">
                <h3 className="flex items-center gap-2 text-[17px] font-bold">
                  <Icon name="circle-check" size={20} className="text-gold" />
                  我們會做的事
                </h3>
                <ul className="mt-4 space-y-2.5">
                  {ABOUT.doList.map((d) => (
                    <li key={d} className="flex items-start gap-2 text-[15px] leading-relaxed text-white/85">
                      <Icon name="check" size={16} className="mt-1 shrink-0 text-sage" />
                      {d}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-[28px] border border-line bg-white p-6">
                <h3 className="flex items-center gap-2 text-[17px] font-bold text-forest-deep">
                  <Icon name="shield" size={20} className="text-gold-deep" />
                  我們不會做的事
                </h3>
                <ul className="mt-4 space-y-2.5">
                  {ABOUT.dontList.map((d) => (
                    <li key={d} className="flex items-start gap-2 text-[15px] leading-relaxed text-subtle">
                      <Icon name="x" size={16} className="mt-1 shrink-0 text-danger/70" />
                      {d}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>

            <Reveal className="rounded-[28px] border border-dashed border-line bg-white/60 p-6">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-[17px] font-bold text-forest-deep">團隊成員</h3>
                <span className="text-[13px] text-muted">成員資料建置中</span>
              </div>
              <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                {ABOUT.team.map((t) => (
                  <li key={t.role} className="flex items-center gap-3 rounded-2xl bg-cream p-3 sm:flex-col sm:items-start">
                    <span aria-hidden className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-sage-soft text-sage">
                      <Icon name="user-round" size={28} strokeWidth={1.4} />
                    </span>
                    <span>
                      <span className="block text-[15px] font-semibold text-forest-deep">{t.role}</span>
                      <span className="block text-[13px] text-muted">{t.note}</span>
                    </span>
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-[14px] leading-relaxed text-muted">團隊成員姓名、照片與相關資格，將於正式確認後公開；目前不以任何成員資格作為宣傳。</p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
