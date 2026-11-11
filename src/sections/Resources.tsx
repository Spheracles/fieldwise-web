import { useState } from 'react';
import { ARTICLES, FAQS, type Article, type ArticleCategory } from '../config/content';
import { SITE } from '../config/site';
import { cx } from '../lib/format';
import { track } from '../lib/track';
import { Icon } from '../components/ui/Icon';
import { Button, Modal, Reveal, SectionHeading, Tag } from '../components/ui/primitives';

const CATS: ('全部' | ArticleCategory)[] = ['全部', '農業經營', 'AI 工具', '申請資訊', '法規提醒'];

export function Resources() {
  const [cat, setCat] = useState<(typeof CATS)[number]>('全部');
  const [open, setOpen] = useState<Article | null>(null);
  const list = cat === '全部' ? ARTICLES : ARTICLES.filter((a) => a.category === cat);

  return (
    <section id="resources" aria-labelledby="res-title" className="bg-white/60 py-20 lg:py-28">
      <div className="container-x">
        <SectionHeading id="res-title" brand="resources"
          eyebrow="資源專欄" title="把經營知識，整理成今天就能用的清單。" desc="農業經營、AI 工具、申請資訊與法規提醒。目前文章為內容範例，正式上線前會由團隊與專業人士審閱。" />

        <div className="scroll-row -mx-5 mb-8 flex gap-2 overflow-x-auto px-5 sm:mx-0 sm:flex-wrap sm:justify-center sm:px-0" role="group" aria-label="文章分類">
          {CATS.map((c) => (
            <button
              key={c}
              type="button"
              aria-pressed={cat === c}
              onClick={() => setCat(c)}
              className={cx(
                'inline-flex min-h-11 shrink-0 items-center rounded-full px-5 text-[15px] font-semibold transition-colors',
                cat === c ? 'bg-forest text-white' : 'bg-white text-forest ring-1 ring-line hover:ring-forest/40',
              )}
            >
              {c}
            </button>
          ))}
        </div>

        <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((a, i) => (
            <Reveal as="li" key={a.id} delay={(i % 3) * 70}>
              <article className="group flex h-full flex-col rounded-[28px] border border-line/80 bg-white p-6 shadow-soft transition-[box-shadow,transform] duration-300 hover:-translate-y-1 hover:shadow-lift">
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-gold-deep">
                    <Icon name={a.icon} size={18} />
                    {a.category}
                  </span>
                  <Tag kind="example" />
                </div>
                <h3 className="mt-4 text-[19px] font-bold leading-snug text-forest-deep">{a.title}</h3>
                <p className="mt-2 flex-1 text-[15px] leading-[1.8] text-subtle">{a.excerpt}</p>
                <div className="mt-5 flex items-center justify-between">
                  <span className="text-[14px] text-muted">約 {a.minutes} 分鐘</span>
                  <button
                    type="button"
                    onClick={() => {
                      setOpen(a);
                      track('article_open', { article: a.id });
                    }}
                    className="inline-flex min-h-11 items-center gap-1.5 rounded-full px-3 text-[15px] font-semibold text-forest hover:bg-sage-mist"
                  >
                    閱讀範例
                    <Icon name="arrow-right" size={16} />
                  </button>
                </div>
              </article>
            </Reveal>
          ))}
        </ul>

        <Reveal className="mt-8 rounded-[28px] border border-line bg-cream p-6 sm:p-8">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <h3 className="flex items-center gap-2 text-[17px] font-bold text-forest-deep">
              <Icon name="link" size={20} className="text-forest" />
              官方參考入口
            </h3>
            <p className="text-[14px] text-muted">本站不隸屬、也不代表以下任何機關或企業</p>
          </div>
          <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {SITE.officialLinks.map((l) => (
              <li key={l.url}>
                <a href={l.url} target="_blank" rel="noopener noreferrer" className="flex h-full min-h-11 flex-col rounded-2xl bg-white p-4 ring-1 ring-line transition-shadow hover:shadow-soft">
                  <span className="flex items-start justify-between gap-2 text-[15px] font-semibold text-forest-deep">
                    {l.name}
                    <Icon name="external-link" size={16} className="mt-1 shrink-0 text-muted" />
                  </span>
                  <span className="mt-1 text-[13px] text-muted">{l.desc}</span>
                </a>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>

      <Modal open={!!open} onClose={() => setOpen(null)} title={open?.title} labelledBy="article-title">
        {open && (
          <div className="space-y-5 text-[16px] leading-[1.9] text-ink">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[14px] font-semibold text-gold-deep">{open.category}</span>
              <Tag kind="example" />
            </div>
            {open.body.map((b, i) => (
              <div key={i}>
                {b.heading && <h4 className="mb-2 text-[17px] font-bold text-forest-deep">{b.heading}</h4>}
                {b.text && <p className="text-subtle">{b.text}</p>}
                {b.list && (
                  <ul className="space-y-1.5">
                    {b.list.map((x) => (
                      <li key={x} className="flex items-start gap-2 text-subtle">
                        <Icon name="check" size={16} className="mt-1.5 shrink-0 text-forest" />
                        {x}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
            <p className="rounded-2xl bg-sage-mist p-4 text-[14px] leading-relaxed text-forest">
              本文為內容範例，僅供版型與方向參考，不構成法律、會計或稅務意見；實際規定以主管機關公告為準。
            </p>
            <Button variant="outline" onClick={() => setOpen(null)}>
              關閉
            </Button>
          </div>
        )}
      </Modal>
    </section>
  );
}

export function FAQ() {
  const [openIdx, setOpenIdx] = useState<number[]>([0]);
  const all = openIdx.length === FAQS.length;
  return (
    <section id="faq" aria-labelledby="faq-title" className="py-20 lg:py-28">
      <div className="container-x grid grid-cols-1 gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <div>
          <SectionHeading align="left" id="faq-title" eyebrow="常見問答" title={<>開始之前，<br />你可能想問的事。</>} desc="沒有看到你的問題？預約初談時直接問我們，或先在表單補充說明中留言。" />
          <div className="-mt-4 flex flex-wrap gap-3">
            <Button to="contact" icon="calendar-check">
              預約免費初談
            </Button>
            <Button variant="outline" onClick={() => setOpenIdx(all ? [] : FAQS.map((_, i) => i))}>
              {all ? '全部收合' : '全部展開'}
            </Button>
          </div>
        </div>
        <ul className="divide-y divide-line rounded-[28px] border border-line bg-white px-2 shadow-soft sm:px-4">
          {FAQS.map((f, i) => {
            const open = openIdx.includes(i);
            return (
              <li key={f.q}>
                <h3>
                  <button
                    type="button"
                    id={`faq-q-${i}`}
                    aria-expanded={open}
                    aria-controls={`faq-a-${i}`}
                    onClick={() => setOpenIdx((o) => (o.includes(i) ? o.filter((x) => x !== i) : [...o, i]))}
                    className="flex min-h-16 w-full items-center justify-between gap-4 rounded-2xl px-3 py-4 text-left text-[17px] font-semibold text-forest-deep sm:px-4"
                  >
                    <span className="flex items-start gap-3">
                      <span className="mt-0.5 font-serif text-[17px] font-bold text-gold-deep">Q</span>
                      {f.q}
                    </span>
                    <span className={cx('inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-colors', open ? 'bg-forest text-white' : 'bg-cream text-forest')}>
                      <Icon name={open ? 'minus' : 'plus'} size={18} />
                    </span>
                  </button>
                </h3>
                <div id={`faq-a-${i}`} role="region" aria-labelledby={`faq-q-${i}`} hidden={!open} className="px-3 pb-5 pl-10 text-[16px] leading-[1.9] text-subtle sm:px-4 sm:pl-12">
                  {f.a}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
