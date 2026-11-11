/** 自製 SVG 插畫：梯田等高線、葉片、田野備援圖。全部使用 currentColor／品牌色，無外部圖片。 */

export function ContourBackdrop({ className }: { className?: string }) {
  const lines = Array.from({ length: 11 }, (_, i) => i);
  return (
    <svg aria-hidden className={className} viewBox="0 0 1100 760" fill="none">
      {lines.map((i) => (
        <path
          key={i}
          d={`M${-40 + i * 6} ${150 + i * 48}C ${220 + i * 10} ${60 + i * 50}, ${460 - i * 8} ${260 + i * 40}, ${720 + i * 4} ${170 + i * 46} S ${1040} ${120 + i * 52}, ${1160} ${200 + i * 44}`}
          stroke="currentColor"
          strokeWidth={i % 3 === 0 ? 1.6 : 1}
        />
      ))}
    </svg>
  );
}

export function LeafSprig({ className }: { className?: string }) {
  return (
    <svg aria-hidden className={className} viewBox="0 0 200 200" fill="none">
      <path d="M40 190C70 140 92 96 150 40" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M78 128c-30 2-48-14-52-42 30-1 48 15 52 42z" fill="currentColor" opacity=".55" />
      <path d="M98 98c4-30 24-44 52-44-2 28-20 44-52 44z" fill="currentColor" opacity=".75" />
      <path d="M118 70c-22-12-28-34-18-58 22 12 28 34 18 58z" fill="currentColor" opacity=".45" />
      <path d="M62 156c-24-10-32-30-24-54 24 9 32 30 24 54z" fill="currentColor" opacity=".35" />
    </svg>
  );
}

/** 圖片無法載入時顯示的田野插畫 */
export function HeroFallbackArt({ className }: { className?: string }) {
  return (
    <svg aria-hidden className={className} viewBox="0 0 475 530" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="fb-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#F6EBD3" />
          <stop offset="1" stopColor="#E5EBDD" />
        </linearGradient>
      </defs>
      <rect width="475" height="530" fill="url(#fb-sky)" />
      <circle cx="330" cy="120" r="46" fill="#C59A43" opacity=".55" />
      <path d="M0 230c80-60 160-70 240-40s150 20 235-30v370H0z" fill="#8DA582" opacity=".55" />
      <path d="M0 290c90-40 190-40 280-10s140 10 195-20v270H0z" fill="#8DA582" opacity=".8" />
      <path d="M0 350c100-30 220-30 330 0 60 16 110 10 145-4v184H0z" fill="#214D3D" opacity=".85" />
      {Array.from({ length: 7 }, (_, i) => (
        <path key={i} d={`M-10 ${390 + i * 22}c120-${18 - i} 300-${16 - i} 500 ${-4 + i}`} stroke="#F8F6EF" strokeWidth="1.2" opacity=".35" fill="none" />
      ))}
      <g transform="translate(300 300)" fill="#F8F6EF" opacity=".9">
        <path d="M0 40V0h70v40z" opacity=".6" />
        <path d="M-6 2 35-22 76 2z" />
      </g>
    </svg>
  );
}

/** 成長階段插畫：種子→發芽→成長→成樹 */
export function GrowthStages({ className }: { className?: string }) {
  return (
    <svg aria-hidden className={className} viewBox="0 0 420 150" fill="none">
      <path d="M10 128c100-14 300-14 400 0" stroke="#8DA582" strokeWidth="2" strokeLinecap="round" />
      <ellipse cx="55" cy="122" rx="9" ry="6" fill="#C59A43" />
      <path d="M160 124v-26" stroke="#214D3D" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M160 104c-2-12 6-20 18-20 0 12-7 20-18 20z" fill="#8DA582" />
      <path d="M160 110c1-10-5-16-15-16-1 10 5 16 15 16z" fill="#8DA582" opacity=".7" />
      <path d="M265 124V72" stroke="#214D3D" strokeWidth="2.6" strokeLinecap="round" />
      <path d="M265 86c-3-18 9-30 27-30 1 18-10 30-27 30z" fill="#214D3D" />
      <path d="M265 98c2-15-8-25-23-25-1 15 8 25 23 25z" fill="#8DA582" />
      <path d="M265 112c-2-11 5-18 16-18 0 11-6 18-16 18z" fill="#8DA582" opacity=".7" />
      <path d="M370 124V60" stroke="#18392F" strokeWidth="3" strokeLinecap="round" />
      <circle cx="370" cy="52" r="30" fill="#214D3D" />
      <circle cx="352" cy="66" r="18" fill="#8DA582" />
      <circle cx="390" cy="64" r="16" fill="#2E6350" />
      <circle cx="394" cy="30" r="7" fill="#C59A43" />
    </svg>
  );
}
