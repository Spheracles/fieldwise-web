import { STORIES, type Story } from '../config/stories';
import { getService } from '../config/services';
import { useApp } from '../context/AppContext';
import { track } from '../lib/track';
import { Icon } from '../components/ui/Icon';
import { Button, NavLink, Tag } from '../components/ui/primitives';
import { STORY_ICONS } from '../sections/Stories';

/** 產地故事專欄：單篇全文閱讀頁 */
export function StoryView({ id }: { id: string }) {
  const { requestInquiry, showService } = useApp();
  const idx = STORIES.findIndex((s) => s.id === id);
  const s = STORIES[idx];
  if (!s) return null;
  const prev: Story | undefined = STORIES[idx - 1];
  const next: Story | undefined = STORIES[idx + 1];

  return (
    <main id="main" className="pb-24 pt-6 lg:pb-16 lg:pt-10">
      <article className="container-x max-w-[760px]" aria-labelledby="story-title">
        <nav aria-label="麵包屑" className="flex flex-wrap items-center gap-1 text-[14px] text-muted">
          <NavLink to="top" className="inline-flex min-h-10 items-center rounded-full px-2 hover:text-forest">
            首頁
          </NavLink>
          <Icon name="chevron-right" size={14} />
          <NavLink to="stories" className="inline-flex min-h-10 items-center rounded-full px-2 hover:text-forest">
            產地故事專欄
          </NavLink>
          <Icon name="chevron-right" size={14} />
          <span className="px-2 text-subtle" aria-current="page">
            第 {idx + 1} 篇
          </span>
        </nav>

        <header className="mt-4 border-b border-line pb-7">
          <div className="flex flex-wrap items-center gap-3 text-[14px]">
            <span className="inline-flex items-center gap-1.5 font-semibold text-gold-deep">
              <Icon name={STORY_ICONS[s.category] ?? 'leaf'} size={18} />
              {s.category}
            </span>
            <span className="inline-flex items-center gap-1.5 text-muted">
              <Icon name="clock" size={15} />
              約 {s.minutes} 分鐘
            </span>
            <Tag kind="example">內容示範</Tag>
          </div>
          <h1 id="story-title" className="mt-4 font-serif text-[30px] font-bold leading-[1.35] text-forest-deep sm:text-[38px]">
            {s.title}
          </h1>
          <p className="mt-4 text-[17px] leading-[1.85] text-subtle">{s.excerpt}</p>
        </header>

        <div className="story-body mt-8">
          {s.blocks.map((b, i) => {
            if (b.t === 'h')
              return (
                <h2 key={i} className="mb-3 mt-10 flex items-center gap-3 text-[21px] font-bold leading-snug text-forest-deep first:mt-0 sm:text-[23px]">
                  <span aria-hidden className="h-6 w-1.5 shrink-0 rounded-full bg-gold" />
                  {b.x}
                </h2>
              );
            if (b.t === 'ul')
              return (
                <ul key={i} className="my-5 space-y-2.5 rounded-3xl bg-sage-mist/70 p-5 sm:p-6">
                  {b.x.map((x) => (
                    <li key={x} className="flex items-start gap-2.5 text-[16px] leading-[1.8] text-ink">
                      <Icon name="check" size={18} className="mt-1 shrink-0 text-forest" />
                      {x}
                    </li>
                  ))}
                </ul>
              );
            return (
              <p key={i} className="my-4 text-[17px] leading-[2] text-ink/90">
                {b.x}
              </p>
            );
          })}
        </div>

        <aside className="mt-12 rounded-[28px] bg-forest-deep p-6 text-white sm:p-8" aria-label="下一步">
          <p className="text-[14px] font-semibold tracking-[0.15em] text-gold">想進一步了解？</p>
          <p className="mt-2 text-[17px] leading-[1.8] text-white/90">
            留下聯絡方式與想了解的內容，我們會在產季或體驗資訊確定後與你聯繫。目前為試營運，資訊以農友實際公告為準。
          </p>
          <Button
            className="mt-5"
            icon="calendar-check"
            onClick={() => {
              track('cta_click', { cta: 'story', story: s.id });
              requestInquiry({ problems: s.cta.problems, label: `產地故事：${s.title}` });
            }}
          >
            {s.cta.label}
          </Button>
        </aside>

        <section className="mt-8" aria-labelledby="story-svc">
          <h2 id="story-svc" className="text-[16px] font-bold text-forest-deep">
            這篇內容與哪些陪跑服務有關
          </h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {s.services.map((sid) => {
              const svc = getService(sid);
              return (
                <li key={sid}>
                  <button
                    type="button"
                    onClick={() => showService(sid)}
                    className="inline-flex min-h-11 items-center gap-2 rounded-full bg-white px-4 text-[15px] font-medium text-forest ring-1 ring-line hover:ring-forest/40"
                  >
                    <Icon name={svc.icon} size={16} />
                    {svc.code}｜{svc.title}
                  </button>
                </li>
              );
            })}
          </ul>
        </section>

        <nav aria-label="上一篇與下一篇" className="mt-10 grid grid-cols-1 gap-3 border-t border-line pt-8 sm:grid-cols-2">
          {prev ? (
            <NavLink to={prev.id} className="group flex flex-col rounded-3xl border border-line bg-white p-5 hover:border-forest/40">
              <span className="inline-flex items-center gap-1 text-[13px] text-muted">
                <Icon name="chevron-left" size={14} />
                上一篇
              </span>
              <span className="mt-1.5 text-[16px] font-semibold leading-snug text-forest-deep">{prev.title}</span>
            </NavLink>
          ) : (
            <span className="hidden sm:block" />
          )}
          {next ? (
            <NavLink to={next.id} className="group flex flex-col rounded-3xl border border-line bg-white p-5 text-right hover:border-forest/40">
              <span className="inline-flex items-center justify-end gap-1 text-[13px] text-muted">
                下一篇
                <Icon name="chevron-right" size={14} />
              </span>
              <span className="mt-1.5 text-[16px] font-semibold leading-snug text-forest-deep">{next.title}</span>
            </NavLink>
          ) : (
            <NavLink to="stories" className="flex flex-col justify-center rounded-3xl border border-dashed border-forest/30 p-5 text-right text-[15px] font-semibold text-forest hover:border-forest">
              回到產地故事專欄
            </NavLink>
          )}
        </nav>
      </article>
    </main>
  );
}
