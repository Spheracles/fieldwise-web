import { ADVANTAGES, PROCESS_STEPS } from '../config/content';
import { Icon } from '../components/ui/Icon';
import { Reveal, SectionHeading } from '../components/ui/primitives';
import { GrowthStages } from '../components/art';
import { BrandIcon } from '../components/BrandIcons';

export function Advantages() {
  return (
    <section id="advantages" aria-labelledby="adv-title" className="py-20 lg:py-28">
      <div className="container-x grid grid-cols-1 gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-16">
        <div>
          <SectionHeading
            align="left"
            id="adv-title"
            eyebrow="品牌優勢"
            title="陪你做，而不只是教你做。"
            desc="顧問報告寫得再漂亮，沒有人接手就會停在紙上。我們把每一次陪跑都落到行動清單、表單與每月回顧，讓改變在農場裡長出來。"
          />
          <Reveal className="-mt-4 rounded-3xl bg-white/70 p-6 ring-1 ring-line">
            <GrowthStages className="h-auto w-full" />
            <ol className="mt-2 grid grid-cols-4 text-center text-[14px] font-semibold text-forest">
              {['盤點', '規劃', '導入', '追蹤'].map((s, i) => (
                <li key={s}>
                  <span className="text-gold-deep">0{i + 1}</span> {s}
                </li>
              ))}
            </ol>
          </Reveal>
        </div>
        <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {ADVANTAGES.map((a, i) => (
            <Reveal as="li" key={a.title} delay={i * 80}>
              <article className="h-full rounded-3xl border border-line/80 bg-white p-6 shadow-soft lg:p-7">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gold-soft text-gold-deep">
                  <Icon name={a.icon} size={24} />
                </span>
                <h3 className="mt-4 text-[19px] font-bold text-forest-deep">{a.title}</h3>
                <p className="mt-2 text-[15.5px] leading-[1.85] text-subtle">{a.desc}</p>
              </article>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function Process() {
  return (
    <section id="process" aria-labelledby="process-title" className="bg-white/60 py-20 lg:py-28">
      <div className="container-x">
        <SectionHeading id="process-title" brand="implementation"
          eyebrow="合作流程" title="五個步驟，從初談走到持續改善。" desc="每一步都有明確的產出，你可以隨時知道現在在哪裡、下一步要做什麼。" />
        <ol className="relative grid grid-cols-1 gap-5 lg:grid-cols-5 lg:gap-4">
          <span aria-hidden className="absolute left-[31px] top-8 bottom-8 w-px bg-gradient-to-b from-sage via-gold/60 to-sage lg:left-[8%] lg:right-[8%] lg:top-[31px] lg:bottom-auto lg:h-px lg:w-auto lg:bg-gradient-to-r" />
          {PROCESS_STEPS.map((s, i) => (
            <Reveal as="li" key={s.title} delay={i * 90} className="relative flex gap-4 lg:flex-col lg:items-center lg:text-center">
              <span className="relative z-10 inline-flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white shadow-soft ring-1 ring-line outline outline-8 outline-[#FCFBF8]">
                <BrandIcon name={s.brand} size={44} />
              </span>
              <div className="flex-1 rounded-3xl border border-line/80 bg-white p-5 shadow-soft lg:mt-5 lg:w-full">
                <p className="text-[13px] font-bold tracking-[0.2em] text-gold-deep">STEP 0{i + 1}</p>
                <h3 className="mt-1 text-[18px] font-bold text-forest-deep">{s.title}</h3>
                <p className="mt-2 text-[15px] leading-[1.75] text-subtle">{s.desc}</p>
                <p className="mt-3 inline-flex items-start gap-1.5 rounded-xl bg-sage-mist px-3 py-1.5 text-left text-[13px] font-medium leading-snug text-forest">
                  <Icon name="package" size={14} className="mt-0.5 shrink-0" />
                  產出：{s.output}
                </p>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
