/**
 * 田序共創品牌圖示（依「網站分頁 Icon 設計提案」重繪的 SVG）。
 * 風格：森林綠線框 ＋ 鼠尾草綠／草綠色塊 ＋ 田野金點綴，常帶田埂或葉片元素。
 * 主選單：home、services、cases、resources、about、contact
 * 流程：diagnosis、consultation、planning、implementation、tracking、portal
 */
import type { ReactNode } from 'react';

const F = '#214D3D'; // 森林綠
const S = '#8DA582'; // 鼠尾草綠
const G = '#638B50'; // 草綠
const Y = '#C59A43'; // 田野金
const C = '#F8F6EF'; // 奶油白

export type BrandIconName =
  | 'home' | 'services' | 'cases' | 'resources' | 'about' | 'contact'
  | 'diagnosis' | 'consultation' | 'planning' | 'implementation' | 'tracking' | 'portal';

/** 齒輪路徑 */
function gear(cx: number, cy: number, r: number, teeth = 8) {
  const pts: string[] = [];
  const inner = r * 0.78;
  for (let i = 0; i < teeth * 2; i++) {
    const a0 = (Math.PI * 2 * i) / (teeth * 2) - Math.PI / (teeth * 2);
    const a1 = a0 + Math.PI / (teeth * 2);
    const rr = i % 2 === 0 ? r : inner;
    pts.push(`${(cx + rr * Math.cos(a0)).toFixed(2)},${(cy + rr * Math.sin(a0)).toFixed(2)}`);
    pts.push(`${(cx + rr * Math.cos(a1)).toFixed(2)},${(cy + rr * Math.sin(a1)).toFixed(2)}`);
  }
  return `M${pts.join('L')}Z`;
}

const Sprout = ({ x, y, s = 1, stem = F }: { x: number; y: number; s?: number; stem?: string }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M0 0V-12" stroke={stem} strokeWidth="3" strokeLinecap="round" />
    <path d="M0-7C-1-14-7-18-13-17-12-10-7-6 0-7Z" fill={G} />
    <path d="M0-10C1-18 8-22 15-21 14-13 8-9 0-10Z" fill={F} />
  </g>
);

const ICONS: Record<BrandIconName, ReactNode> = {
  home: (
    <>
      <path d="M8 30 32 10l24 20" stroke={F} strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M14 26v26h36V26" stroke={F} strokeWidth="4.5" strokeLinejoin="round" fill="none" />
      <rect x="27" y="23" width="4.5" height="4.5" rx="1" fill={Y} />
      <rect x="32.5" y="23" width="4.5" height="4.5" rx="1" fill={Y} />
      <rect x="27" y="28.5" width="4.5" height="4.5" rx="1" fill={Y} />
      <rect x="32.5" y="28.5" width="4.5" height="4.5" rx="1" fill={Y} />
      <path d="M16 50c8-8 18-11 32-10v10H16z" fill={S} />
      <path d="M26 50c7-5 14-6 22-5v5z" fill={G} />
    </>
  ),
  services: (
    <>
      <path d="M4 50c10-10 26-14 56-11v13H4z" fill={S} />
      <path d="M4 56c14-9 32-12 56-9v9H4z" fill={G} />
      <path d="M10 45c12-7 26-9 44-7" stroke={F} strokeWidth="4" strokeLinecap="round" fill="none" />
      <Sprout x={32} y={40} s={1.35} />
    </>
  ),
  cases: (
    <>
      <rect x="10" y="12" width="34" height="42" rx="5" stroke={F} strokeWidth="4" fill={C} />
      <rect x="20" y="8" width="14" height="8" rx="3" fill={F} />
      <path d="m16 25 3 3 5-6M16 35l3 3 5-6M16 45l3 3 5-6" stroke={F} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M28 25h10M28 35h8" stroke={F} strokeWidth="3" strokeLinecap="round" />
      <path d={gear(46, 44, 12, 8)} fill={Y} />
      <circle cx="46" cy="44" r="4.5" fill={C} />
    </>
  ),
  resources: (
    <>
      <path d="M6 16c9-3 18-2 26 4 8-6 17-7 26-4v34c-9-3-18-2-26 4-8-6-17-7-26-4z" fill={S} opacity=".35" />
      <path d="M6 16c9-3 18-2 26 4 8-6 17-7 26-4v34c-9-3-18-2-26 4-8-6-17-7-26-4z" stroke={F} strokeWidth="4" strokeLinejoin="round" fill="none" />
      <path d="M32 20v34" stroke={F} strokeWidth="3" />
      <path d="M12 26h12M12 33h10M12 40h12" stroke={G} strokeWidth="3" strokeLinecap="round" />
      <Sprout x={45} y={42} s={0.95} />
    </>
  ),
  about: (
    <>
      <circle cx="22" cy="17" r="8" fill={F} />
      <path d="M6 48c0-11 7-19 16-19s16 8 16 19z" fill={F} />
      <circle cx="42" cy="22" r="7" fill={G} />
      <path d="M30 50c1-10 6-16 13-16s12 6 13 16z" fill={S} />
      <path d="M4 54c16-9 34-11 56-7v9H4z" fill={G} />
    </>
  ),
  contact: (
    <>
      <path d="M8 26c0-10 9-17 22-17s22 7 22 17-9 17-22 17c-3 0-6 0-8-1l-10 6 2-9c-4-3-6-8-6-13z" stroke={F} strokeWidth="4" strokeLinejoin="round" fill={C} />
      <circle cx="21" cy="26" r="2.8" fill={F} />
      <circle cx="30" cy="26" r="2.8" fill={F} />
      <circle cx="39" cy="26" r="2.8" fill={F} />
      <path d="M36 58c0-14 9-22 24-23-1 14-9 22-24 23z" fill={G} />
      <path d="M38 56c5-6 11-11 18-15" stroke={C} strokeWidth="1.8" strokeLinecap="round" />
    </>
  ),
  diagnosis: (
    <>
      <path d="M44 8l-3 5M51 13l-5 3M53 21h-5" stroke={Y} strokeWidth="3.2" strokeLinecap="round" />
      <path d="M6 54c8-6 16-8 26-7" stroke={S} strokeWidth="6" strokeLinecap="round" />
      <circle cx="27" cy="29" r="16" stroke={F} strokeWidth="4.5" fill={C} />
      <path d="m39 41 12 12" stroke={F} strokeWidth="6" strokeLinecap="round" />
      <Sprout x={27} y={38} s={0.95} />
    </>
  ),
  consultation: (
    <>
      <path d="M26 8v6M34 7v7M42 9l-2 6" stroke={Y} strokeWidth="3" strokeLinecap="round" />
      <path d="M3 30l11-9 8 4-11 17z" fill={F} />
      <path d="M61 30l-11-9-8 4 11 17z" fill={S} />
      <path d="M16 28l10-6c3-2 6-2 9 0l6 4c3 2 6 3 9 3l3 5-15 16c-2 2-5 2-7 0L18 38z" fill={C} stroke={F} strokeWidth="3" strokeLinejoin="round" />
      <path d="M30 27l-6 6c-1 2 1 4 3 3l7-5M28 44l-4-4M33 46l-5-5M38 44l-5-5" stroke={F} strokeWidth="2.6" strokeLinecap="round" fill="none" />
    </>
  ),
  planning: (
    <>
      <rect x="10" y="36" width="8" height="14" rx="1.5" fill={S} />
      <rect x="22" y="30" width="8" height="20" rx="1.5" fill={G} />
      <rect x="34" y="24" width="8" height="26" rx="1.5" fill={G} />
      <rect x="46" y="16" width="8" height="34" rx="1.5" fill={Y} />
      <path d="M6 32 22 22l10 4L52 9" stroke={F} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M44 8h9v9" stroke={F} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M4 56c16-8 34-10 56-6v6H4z" fill={S} />
    </>
  ),
  implementation: (
    <>
      <path d={gear(49, 15, 10, 8)} fill={Y} />
      <circle cx="49" cy="15" r="3.8" fill={C} />
      <rect x="10" y="18" width="38" height="26" rx="3" stroke={F} strokeWidth="4" fill={C} />
      <path d="M4 50h50l-4 4H8z" fill={F} />
      <Sprout x={29} y={40} s={0.82} />
    </>
  ),
  tracking: (
    <>
      <rect x="10" y="38" width="7" height="14" rx="1.5" fill={S} />
      <rect x="21" y="32" width="7" height="20" rx="1.5" fill={G} />
      <rect x="32" y="36" width="7" height="16" rx="1.5" fill={S} />
      <rect x="43" y="22" width="7" height="30" rx="1.5" fill={Y} />
      <path d="M8 28l13-11 11 9 17-17" stroke={F} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <circle cx="8" cy="28" r="3.2" fill={F} />
      <circle cx="21" cy="17" r="3.2" fill={F} />
      <circle cx="32" cy="26" r="3.2" fill={F} />
      <circle cx="49" cy="9" r="3.2" fill={F} />
      <path d="M38 58c1-12 9-19 22-19-1 12-9 19-22 19z" fill={G} />
    </>
  ),
  portal: (
    <>
      <rect x="6" y="10" width="52" height="44" rx="5" stroke={F} strokeWidth="4" fill={C} />
      <path d="M8 12h48v8H8z" fill={G} />
      <circle cx="13" cy="16" r="1.6" fill={C} />
      <circle cx="18" cy="16" r="1.6" fill={C} />
      <circle cx="21" cy="31" r="5" fill={F} />
      <path d="M12 47c0-6 4-10 9-10s9 4 9 10z" fill={F} />
      <rect x="35" y="27" width="8" height="7" rx="1.5" fill={S} />
      <rect x="46" y="27" width="8" height="7" rx="1.5" fill={S} />
      <rect x="35" y="38" width="8" height="7" rx="1.5" fill={S} />
      <rect x="46" y="38" width="8" height="7" rx="1.5" fill={S} />
    </>
  ),
};

export function BrandIcon({ name, size = 48, className, label }: { name: BrandIconName; size?: number; className?: string; label?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      width={size}
      height={size}
      className={className}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      focusable="false"
    >
      {ICONS[name]}
    </svg>
  );
}

export const BRAND_ICON_NAMES = Object.keys(ICONS) as BrandIconName[];
