import { useEffect, useRef, useState } from 'react';
import { useApp } from '../context/AppContext';
import { prefersReducedMotion } from '../hooks/useMotion';
import { track } from '../lib/track';
import { Icon } from '../components/ui/Icon';
import { Button, Reveal } from '../components/ui/primitives';

/** 影片放在 public/media，以相對路徑載入（GitHub Pages 子路徑也適用） */
const VIDEO = 'media/farm-story.mp4';
const POSTER = 'media/farm-story-poster.jpg';

export function FarmStory() {
  const { navigate } = useApp();
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [failed, setFailed] = useState(false);

  // 進入畫面時自動靜音播放、離開時暫停；偏好減少動態時不自動播放
  useEffect(() => {
    const v = ref.current;
    if (!v || prefersReducedMotion() || !('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) v.play().catch(() => undefined);
        else v.pause();
      },
      { threshold: 0.35 },
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);

  const toggle = () => {
    const v = ref.current;
    if (!v) return;
    if (v.paused) v.play().catch(() => undefined);
    else v.pause();
  };

  return (
    <Reveal className="mt-16 grid grid-cols-1 items-center gap-8 lg:grid-cols-[1.25fr_1fr] lg:gap-12">
      <figure className="relative overflow-hidden rounded-[28px] bg-forest-deep shadow-lift ring-1 ring-forest/10">
        {failed ? (
          <img src={POSTER} alt="情境示意：果園中的農友整理鳳梨與荔枝，旁邊的手機顯示商品頁面" className="aspect-video w-full object-cover" />
        ) : (
          <video
            ref={ref}
            className="aspect-video w-full object-cover"
            src={VIDEO}
            poster={POSTER}
            muted={muted}
            loop
            playsInline
            preload="metadata"
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            onError={() => setFailed(true)}
            aria-label="情境示意影片：農友在果園採收鳳梨與荔枝、與親子家庭互動，最後用手機整理商品"
          />
        )}
        <figcaption className="pointer-events-none absolute left-3 top-3 flex items-center gap-1.5 rounded-xl bg-white/85 px-3 py-1.5 text-[12.5px] leading-snug text-forest-deep backdrop-blur">
          <Icon name="info" size={14} className="shrink-0" />
          情境示意影片（AI 生成），非真實客戶或案例
        </figcaption>
        {!failed && (
          <div className="absolute bottom-3 right-3 flex gap-2">
            <button
              type="button"
              onClick={toggle}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-forest-deep shadow-soft backdrop-blur hover:bg-white"
              aria-label={playing ? '暫停影片' : '播放影片'}
            >
              {playing ? (
                <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><rect x="6" y="5" width="4" height="14" rx="1" fill="currentColor" /><rect x="14" y="5" width="4" height="14" rx="1" fill="currentColor" /></svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5z" fill="currentColor" /></svg>
              )}
            </button>
            <button
              type="button"
              onClick={() => {
                setMuted((m) => !m);
                if (ref.current?.paused) ref.current.play().catch(() => undefined);
              }}
              className="inline-flex h-11 items-center gap-1.5 rounded-full bg-white/90 px-4 text-[14px] font-semibold text-forest-deep shadow-soft backdrop-blur hover:bg-white"
              aria-pressed={!muted}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M11 5 6 9H3v6h3l5 4z" />
                {muted ? <path d="m22 9-6 6M16 9l6 6" /> : <path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13" />}
              </svg>
              {muted ? '開啟聲音' : '關閉聲音'}
            </button>
          </div>
        )}
      </figure>

      <div>
        <p className="inline-flex items-center gap-2 text-[15px] font-semibold tracking-[0.18em] text-gold-deep">
          <Icon name="sprout" size={18} />
          我們想陪你走到的樣子
        </p>
        <h3 className="mt-3 font-serif text-[26px] font-bold leading-[1.4] text-forest-deep sm:text-[32px]">
          把力氣留給土地，
          <br />
          把繁瑣交給制度與工具。
        </h3>
        <p className="mt-4 text-[17px] leading-[1.9] text-subtle">
          採收有排程、訂單有入口、親子體驗有規劃，農場的好東西才能穩穩被看見。這段影片是我們想像中的轉型樣貌，實際做法會依每座農場的條件一起討論。
        </p>
        <ul className="mt-5 space-y-2.5 text-[16px] text-ink">
          {['採收與人力排得更順', '訂單從 LINE、電話收攏到同一處', '把農場延伸成親子農事體驗'].map((t) => (
            <li key={t} className="flex items-start gap-2.5">
              <Icon name="circle-check" size={20} className="mt-0.5 shrink-0 text-forest" />
              {t}
            </li>
          ))}
        </ul>
        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <Button
            icon="calendar-check"
            onClick={() => {
              track('cta_click', { cta: 'farm_story_consult' });
              navigate('contact');
            }}
          >
            預約免費初談
          </Button>
          <Button variant="outline" to="services" iconRight="arrow-right">
            看看怎麼做到
          </Button>
        </div>
      </div>
    </Reveal>
  );
}
