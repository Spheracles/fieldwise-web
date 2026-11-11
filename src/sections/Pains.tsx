import { MORE_PAINS, PAINS } from '../config/content';
import { Icon } from '../components/ui/Icon';
import { Button, Reveal, SectionHeading } from '../components/ui/primitives';
import { FarmStory } from './FarmStory';

export function Pains() {
  return (
    <section id="pains" aria-labelledby="pains-title" className="bg-white/60 py-20 lg:py-28">
      <div className="container-x">
        <SectionHeading
          id="pains-title"
          eyebrow="你是不是也遇過"
          title="農場的難題，不該只靠一個人硬撐。"
          desc="缺工、資金、訂單與轉型，常常同時發生。先把問題說清楚，才知道從哪裡開始改。"
        />
        <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {PAINS.map((p, i) => (
            <Reveal as="li" key={p.title} delay={i * 80}>
              <article className="group h-full rounded-3xl border border-line/80 bg-cream/60 p-6 transition-[box-shadow,transform,background-color] duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-lift">
                <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-forest shadow-soft ring-1 ring-line transition-colors group-hover:bg-forest group-hover:text-white">
                  <Icon name={p.icon} size={28} strokeWidth={1.5} />
                </span>
                <h3 className="mt-5 text-[20px] font-bold text-forest-deep">{p.title}</h3>
                <p className="mt-2 text-[16px] leading-[1.8] text-subtle">{p.desc}</p>
                <ul className="mt-4 space-y-1.5 border-t border-dashed border-line pt-4">
                  {p.points.map((pt) => (
                    <li key={pt} className="flex items-start gap-2 text-[15px] text-subtle">
                      <span aria-hidden className="mt-[0.7em] h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                      {pt}
                    </li>
                  ))}
                </ul>
              </article>
            </Reveal>
          ))}
        </ul>
        <Reveal className="mt-8 flex flex-col items-center gap-4 rounded-3xl border border-dashed border-sage bg-sage-mist/60 px-6 py-5 text-center lg:flex-row lg:justify-between lg:text-left">
          <div className="flex flex-col items-center gap-2 lg:flex-row lg:gap-3">
            <span className="text-[15px] font-semibold text-forest">還有這些常見狀況：</span>
            <ul className="flex flex-wrap justify-center gap-2">
              {MORE_PAINS.map((m) => (
                <li key={m} className="rounded-full bg-white px-3 py-1 text-[14px] text-subtle ring-1 ring-line">
                  {m}
                </li>
              ))}
            </ul>
          </div>
          <Button to="diagnosis" variant="ghost" size="sm" iconRight="arrow-right" className="shrink-0">
            勾選狀況，看建議方向
          </Button>
        </Reveal>
        <FarmStory />
      </div>
    </section>
  );
}
