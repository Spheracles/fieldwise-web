import { STORIES, getStory, type Story } from '../config/stories';
import type { IconName } from '../components/ui/Icon';
import { Icon } from '../components/ui/Icon';
import { track } from '../lib/track';
import { NavLink, Reveal, SectionHeading, Tag } from '../components/ui/primitives';

export const STORY_ICONS: Record<string, IconName> = {
  親子食農: 'sprout',
  產季知識: 'calendar-days',
  產地直送: 'truck',
  送禮指南: 'package',
};

/** 首頁「產地故事專欄」：計畫推動後，協助農友對消費者說清楚產地的內容示範 */
export function Stories() {
  const [lead, ...rest] = STORIES;
  return (
    <section id="stories" aria-labelledby="stories-title" className="py-20 lg:py-28">
      <div className="container-x">
        <SectionHeading
          id="stories-title"
          brand="home"
          eyebrow="產地故事專欄"
          title="協助農友，把產地的故事說清楚。"
          desc="陪跑不只整理經營，也包含對消費者的溝通。以下五篇是計畫推動後，協助農友說明產季、採收、出貨與產地體驗的內容示範。"
        />

        <ul className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <Reveal as="li" className="lg:row-span-2">
            <StoryCard story={lead} featured />
          </Reveal>
          {rest.map((s, i) => (
            <Reveal as="li" key={s.id} delay={(i % 2) * 70}>
              <StoryCard story={s} />
            </Reveal>
          ))}
        </ul>

        <p className="mt-6 text-center text-[14px] leading-relaxed text-muted">
          文章為內容行銷示範，不代表特定農場或真實訂單；產季、價格與配送，以各農友實際公告為準。
        </p>
      </div>
    </section>
  );
}

function StoryCard({ story: s, featured }: { story: Story; featured?: boolean }) {
  return (
    <NavLink
      to={s.id}
      onNavigate={() => track('story_open', { story: s.id, from: 'home' })}
      className={
        'group flex h-full flex-col rounded-[28px] border border-line/80 bg-white shadow-soft transition-[box-shadow,transform] duration-300 hover:-translate-y-1 hover:shadow-lift ' +
        (featured ? 'bg-gradient-to-br from-sage-mist via-white to-white p-7 sm:p-9' : 'p-6')
      }
    >
      <span className="flex items-center justify-between gap-2">
        <span className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-gold-deep">
          <Icon name={STORY_ICONS[s.category] ?? 'leaf'} size={18} />
          {s.category}
        </span>
        <Tag kind="example">內容示範</Tag>
      </span>
      <h3 className={(featured ? 'mt-6 font-serif text-[26px] sm:text-[30px]' : 'mt-4 text-[19px]') + ' font-bold leading-snug text-forest-deep'}>{s.title}</h3>
      <p className={(featured ? 'mt-4 text-[17px]' : 'mt-2 text-[15px]') + ' flex-1 leading-[1.8] text-subtle'}>{s.excerpt}</p>
      {featured && (
        <span className="mt-6 hidden flex-col gap-2 border-t border-line/80 pt-5 lg:flex">
          <span className="text-[14px] font-semibold tracking-[0.12em] text-gold-deep">本文段落</span>
          {s.blocks
            .filter((b) => b.t === 'h')
            .slice(0, 6)
            .map((b) => (
              <span key={b.x as string} className="flex items-start gap-2 text-[15px] leading-relaxed text-ink/85">
                <span aria-hidden className="mt-[0.65em] h-1.5 w-1.5 shrink-0 rounded-full bg-sage" />
                {b.x as string}
              </span>
            ))}
        </span>
      )}
      <span className="mt-5 flex items-center justify-between">
        <span className="inline-flex items-center gap-1.5 text-[14px] text-muted">
          <Icon name="clock" size={15} />約 {s.minutes} 分鐘
        </span>
        <span className="inline-flex min-h-11 items-center gap-1.5 rounded-full px-3 text-[15px] font-semibold text-forest group-hover:bg-sage-mist">
          閱讀全文
          <Icon name="arrow-right" size={16} className="transition-transform group-hover:translate-x-0.5" />
        </span>
      </span>
    </NavLink>
  );
}

/** 服務詳情、轉型情境下方的「延伸閱讀」 */
export function StoryLinks({ ids, from, className }: { ids?: string[]; from: string; className?: string }) {
  const list = (ids ?? []).map(getStory).filter((x): x is Story => !!x);
  if (!list.length) return null;
  return (
    <div className={className}>
      <p className="flex items-center gap-2 text-[15px] font-bold text-forest-deep">
        <Icon name="book-open" size={18} className="text-forest" />
        延伸閱讀｜產地故事
      </p>
      <ul className="mt-2.5 flex flex-col gap-2">
        {list.map((s) => (
          <li key={s.id}>
            <NavLink
              to={s.id}
              onNavigate={() => track('story_open', { story: s.id, from })}
              className="group flex min-h-11 items-center justify-between gap-3 rounded-2xl bg-white px-4 py-2.5 text-[15px] leading-snug text-forest ring-1 ring-line hover:ring-forest/40"
            >
              {s.title}
              <Icon name="arrow-right" size={16} className="shrink-0 transition-transform group-hover:translate-x-0.5" />
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
}
