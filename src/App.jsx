import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Cell, ResponsiveContainer } from 'recharts';

const ROKUYO_START = '2025-01-01';
const ROKUYO_CODES = '234501234501234501234501234523450123450123450123450123450134501234501234501234501234501450123450123450123450123450123501234501234501234501234501230123450123450123450123450123412345012345012345012345012345012345012345012345012345012345234501234501234501234501234501345012345012345012345012345014501234501234501234501234501235012345012345012345012345012340123450123450123450123450123451234501234501234501234501234523450123450123450123450123450134501234501234501234501234501450123450123450123450123450123501234501234501234501234501230123450123450123450123450123412345012345012345012345012345023450123450123450123450123450345012345012345012345012345014501234501234501234501234501235012345012345012345012345012340123450123450123450123450123451234501234501234501234501234523450123450123450123450123450134501234501234501234501234501245012345012345012345012345012501234501234501234501234501234012345012345012345012345012341234501234501234501234501234523450123450123450123450123450134501234501234501234501234501450123450123450123450123450125012345012345012345012345012340123450123450123450123450123451234501234501234501234501234523450123450123450123450123450134501234501234501234501234501245012345012345012345012345012350123450123450123450123450123012345012345012345012345012345012345012345012345012345012341234501234501234501234501234523450123450123450123450123450134501234501234501234501234501450123450123450123450123450125012345012345012345012345012340123450123450123';

const SETSU_BOUNDS = [["2024-02-04", "立春"], ["2024-03-05", "啓蟄"], ["2024-04-04", "清明"], ["2024-05-05", "立夏"], ["2024-06-05", "芒種"], ["2024-07-06", "小暑"], ["2024-08-07", "立秋"], ["2024-09-07", "白露"], ["2024-10-08", "寒露"], ["2024-11-07", "立冬"], ["2024-12-06", "大雪"], ["2025-01-05", "小寒"], ["2025-02-03", "立春"], ["2025-03-05", "啓蟄"], ["2025-04-04", "清明"], ["2025-05-05", "立夏"], ["2025-06-05", "芒種"], ["2025-07-07", "小暑"], ["2025-08-07", "立秋"], ["2025-09-07", "白露"], ["2025-10-08", "寒露"], ["2025-11-07", "立冬"], ["2025-12-07", "大雪"], ["2026-01-05", "小寒"], ["2026-02-04", "立春"], ["2026-03-05", "啓蟄"], ["2026-04-05", "清明"], ["2026-05-05", "立夏"], ["2026-06-05", "芒種"], ["2026-07-07", "小暑"], ["2026-08-07", "立秋"], ["2026-09-07", "白露"], ["2026-10-08", "寒露"], ["2026-11-07", "立冬"], ["2026-12-07", "大雪"], ["2027-01-05", "小寒"], ["2027-02-04", "立春"], ["2027-03-06", "啓蟄"], ["2027-04-05", "清明"], ["2027-05-06", "立夏"], ["2027-06-06", "芒種"], ["2027-07-07", "小暑"], ["2027-08-08", "立秋"], ["2027-09-08", "白露"], ["2027-10-08", "寒露"], ["2027-11-07", "立冬"], ["2027-12-07", "大雪"], ["2028-01-06", "小寒"], ["2028-02-04", "立春"], ["2028-03-05", "啓蟄"], ["2028-04-04", "清明"], ["2028-05-05", "立夏"], ["2028-06-05", "芒種"], ["2028-07-06", "小暑"], ["2028-08-07", "立秋"], ["2028-09-07", "白露"], ["2028-10-08", "寒露"], ["2028-11-07", "立冬"], ["2028-12-06", "大雪"], ["2029-01-05", "小寒"], ["2029-02-03", "立春"], ["2029-03-05", "啓蟄"], ["2029-04-04", "清明"], ["2029-05-05", "立夏"], ["2029-06-05", "芒種"], ["2029-07-07", "小暑"], ["2029-08-07", "立秋"], ["2029-09-07", "白露"], ["2029-10-08", "寒露"], ["2029-11-07", "立冬"], ["2029-12-07", "大雪"], ["2030-01-05", "小寒"], ["2030-02-04", "立春"], ["2030-03-05", "啓蟄"], ["2030-04-05", "清明"], ["2030-05-05", "立夏"], ["2030-06-05", "芒種"], ["2030-07-07", "小暑"], ["2030-08-07", "立秋"], ["2030-09-07", "白露"], ["2030-10-08", "寒露"], ["2030-11-07", "立冬"], ["2030-12-07", "大雪"], ["2031-01-05", "小寒"], ["2031-02-04", "立春"]];

// ===== ゲーム定義 =====
const GAMES = {
  loto6: { label: 'ロト6', short: 'L6', min: 1, max: 43, pick: 6, hasData: true, draw: '毎週月・木', color: '#1F6F5C', jackpot: { count: 1, message: 'これで君も\n億万長者だー！！', align: 'end' } },
  loto7: { label: 'ロト7', short: 'L7', min: 1, max: 37, pick: 7, hasData: true, draw: '毎週金', color: '#2A6F8C', jackpot: { count: 1, message: 'これで君も\n億万長者だー！！', align: 'end' } },
  miniloto: { label: 'ミニロト', short: 'ML', min: 1, max: 31, pick: 5, hasData: true, draw: '毎週火', color: '#6F5C1F', jackpot: { count: 3, message: '1000万円\nゲーット！！', align: 'end' } },
  numbers3: { label: 'ナンバーズ3', short: 'N3', digits: 3, hasData: true, draw: '平日毎日', color: '#7A4A9C', jackpot: { count: 3, message: '高額当選だー！！', align: 'end' } },
  numbers4: { label: 'ナンバーズ4', short: 'N4', digits: 4, hasData: true, draw: '平日毎日', color: '#9C4A6F', jackpot: { count: 3, message: '高額当選だー！！', align: 'end' } },
  bingo5: { label: 'ビンゴ5', short: 'B5', min: 1, max: 40, pick: 8, hasData: true, draw: '毎週水', color: '#4A7A9C', jackpot: { count: 5, message: 'GO!GO!\n高額当選GOー！', align: 'end' } },
};
const GAME_ORDER = ['loto6', 'loto7', 'miniloto', 'numbers3', 'numbers4', 'bingo5'];

// ===== ふくろう博士レオ（縁起物ポップ配色・SVG+CSSアニメ） =====
function OwlLeo({ size = 104, surprised = false }) {
  return (
    <div className={'leo-wrap' + (surprised ? ' leo-surprised' : '')} style={{ width: size, height: size * 1.16 }}>
      <svg viewBox="0 0 130 150" width="100%" height="100%" className="leo-svg">
        <defs>
          <radialGradient id="leo-body" cx="50%" cy="35%" r="75%">
            <stop offset="0%" stopColor="#8C5A2F" />
            <stop offset="100%" stopColor="#6B4423" />
          </radialGradient>
          <linearGradient id="leo-cap" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#E05A4C" />
            <stop offset="100%" stopColor="#9A2418" />
          </linearGradient>
          <radialGradient id="leo-halo" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFE9A8" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#FFE9A8" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="65" cy="80" r="62" fill="url(#leo-halo)" className="leo-halo" />
        <ellipse cx="65" cy="92" rx="46" ry="46" fill="url(#leo-body)" />
        <ellipse cx="26" cy="94" rx="13" ry="24" fill="#7A4A28" className={surprised ? 'leo-wing-l leo-wing-spread-l' : 'leo-wing-l'} />
        <ellipse cx="104" cy="94" rx="13" ry="24" fill="#7A4A28" className={surprised ? 'leo-wing-r leo-wing-spread-r' : 'leo-wing-r'} />
        <ellipse cx="65" cy="98" rx="30" ry="34" fill="#FCEFD4" />
        <circle cx="40" cy="96" r="8" fill="#F4A98A" opacity="0.75" className="leo-cheek" />
        <circle cx="90" cy="96" r="8" fill="#F4A98A" opacity="0.75" className="leo-cheek" />
        {surprised ? (
          <g className="leo-eyes">
            <circle cx="51" cy="76" r="18" fill="#FFF" />
            <circle cx="79" cy="76" r="18" fill="#FFF" />
            <text x="51" y="82" textAnchor="middle" fontSize="17" fontWeight="900" fill="#1F8A4C" className="leo-pupil-shock" fontFamily="Arial, sans-serif">¥</text>
            <text x="79" y="82" textAnchor="middle" fontSize="17" fontWeight="900" fill="#1F8A4C" className="leo-pupil-shock" fontFamily="Arial, sans-serif">¥</text>
          </g>
        ) : (
          <g className="leo-eyes">
            <circle cx="51" cy="78" r="15" fill="#FFF" />
            <circle cx="79" cy="78" r="15" fill="#FFF" />
            <circle cx="51" cy="79" r="8" fill="#3A2A1A" className="leo-pupil" />
            <circle cx="79" cy="79" r="8" fill="#3A2A1A" className="leo-pupil" />
            <circle cx="54" cy="76" r="3" fill="#FFF" className="leo-shine" />
            <circle cx="82" cy="76" r="3" fill="#FFF" className="leo-shine" />
          </g>
        )}
        <g stroke="#F4D06F" strokeWidth="2.5" fill="none">
          <circle cx="51" cy={surprised ? 76 : 78} r={surprised ? 20 : 17} />
          <circle cx="79" cy={surprised ? 76 : 78} r={surprised ? 20 : 17} />
          <line x1="68" y1="78" x2="62" y2="78" />
        </g>
        {surprised ? (
          <ellipse cx="65" cy="93" rx="7" ry="9" fill="#B5601E" className="leo-beak-open" />
        ) : (
          <path d="M65 88 L59 95 Q65 99 71 95 Z" fill="#F0B44C" />
        )}
        {surprised && (
          <g className="leo-shock-lines" stroke="#FFE9A8" strokeWidth="2.5" strokeLinecap="round">
            <line x1="20" y1="58" x2="10" y2="52" />
            <line x1="18" y1="72" x2="6" y2="72" />
            <line x1="110" y1="58" x2="120" y2="52" />
            <line x1="112" y1="72" x2="124" y2="72" />
          </g>
        )}
        <g className="leo-cap">
          <ellipse cx="65" cy="34" rx="38" ry="10" fill="url(#leo-cap)" />
          <ellipse cx="65" cy="32" rx="20" ry="6" fill="#9A2418" opacity="0.5" />
          <rect x="47" y="14" width="36" height="20" rx="4" fill="url(#leo-cap)" />
          <path d="M83 20 L104 25 L101 32 L83 27 Z" fill="#E05A4C" />
          <circle cx="104" cy="28" r="5" fill="#FFE9A8" className="leo-tassel" />
        </g>
        <path d="M54 134 l-4 8 M58 134 l0 9 M62 134 l4 8" stroke="#F0B44C" strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d="M76 134 l-4 8 M72 134 l0 9 M68 134 l4 8" stroke="#F0B44C" strokeWidth="3" fill="none" strokeLinecap="round" />
        <g>
          <path d="M20 40 l1.5 4 l4 1.5 l-4 1.5 l-1.5 4 l-1.5 -4 l-4 -1.5 l4 -1.5 Z" fill="#FFE9A8" className="spark spark1" />
          <path d="M110 50 l1.2 3.2 l3.2 1.2 l-3.2 1.2 l-1.2 3.2 l-1.2 -3.2 l-3.2 -1.2 l3.2 -1.2 Z" fill="#FFE9A8" className="spark spark2" />
          <path d="M108 110 l1 2.6 l2.6 1 l-2.6 1 l-1 2.6 l-1 -2.6 l-2.6 -1 l2.6 -1 Z" fill="#FFE9A8" className="spark spark3" />
        </g>
      </svg>
    </div>
  );
}

// ===== 占い師フクロウ(魔法使い帽子+水晶玉、宇宙の背景に浮かぶ) =====
function OwlFortuneTeller({ size = 104 }) {
  return (
    <div className="leo-wrap fortune-owl-wrap" style={{ width: size, height: size * 1.16 }}>
      <svg viewBox="0 0 130 150" width="100%" height="100%" className="leo-svg">
        <defs>
          <radialGradient id="fo-body" cx="50%" cy="35%" r="75%">
            <stop offset="0%" stopColor="#5B4A8C" />
            <stop offset="100%" stopColor="#3A2E63" />
          </radialGradient>
          <linearGradient id="fo-hat" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6B4FA0" />
            <stop offset="100%" stopColor="#2E2154" />
          </linearGradient>
          <radialGradient id="fo-halo" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#C9A8FF" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#C9A8FF" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="fo-orb" cx="40%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="45%" stopColor="#C9A8FF" />
            <stop offset="100%" stopColor="#6B4FA0" />
          </radialGradient>
        </defs>
        <circle cx="65" cy="80" r="62" fill="url(#fo-halo)" className="leo-halo" />
        <ellipse cx="65" cy="92" rx="46" ry="46" fill="url(#fo-body)" />
        <ellipse cx="26" cy="94" rx="13" ry="24" fill="#4A3A75" className="leo-wing-l" />
        <ellipse cx="104" cy="94" rx="13" ry="24" fill="#4A3A75" className="leo-wing-r" />
        <ellipse cx="65" cy="98" rx="30" ry="34" fill="#EDE4FF" />
        <circle cx="40" cy="96" r="8" fill="#C9A8E8" opacity="0.6" />
        <circle cx="90" cy="96" r="8" fill="#C9A8E8" opacity="0.6" />
        {/* 神秘的な半目 */}
        <g>
          <circle cx="51" cy="78" r="15" fill="#FFF" />
          <circle cx="79" cy="78" r="15" fill="#FFF" />
          <path d="M39 78 Q51 70 63 78" stroke="#3A2E63" strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M67 78 Q79 70 91 78" stroke="#3A2E63" strokeWidth="3" fill="none" strokeLinecap="round" />
          <circle cx="51" cy="81" r="6" fill="#3A2E63" className="fo-pupil" />
          <circle cx="79" cy="81" r="6" fill="#3A2E63" className="fo-pupil" />
          <circle cx="53" cy="79" r="2" fill="#C9A8FF" />
          <circle cx="81" cy="79" r="2" fill="#C9A8FF" />
        </g>
        <path d="M65 88 L59 95 Q65 99 71 95 Z" fill="#E8A63C" />
        {/* 魔法使いの帽子(星付き三角帽) */}
        <g className="fo-hat">
          <ellipse cx="65" cy="34" rx="34" ry="8" fill="url(#fo-hat)" />
          <path d="M65 -6 L94 34 Q65 42 36 34 Z" fill="url(#fo-hat)" />
          <path d="M60 6 l1.5 4 l4 1.5 l-4 1.5 l-1.5 4 l-1.5 -4 l-4 -1.5 l4 -1.5 Z" fill="#FFE9A8" />
          <path d="M72 18 l1.2 3.2 l3.2 1.2 l-3.2 1.2 l-1.2 3.2 l-1.2 -3.2 l-3.2 -1.2 l3.2 -1.2 Z" fill="#FFE9A8" />
        </g>
        {/* 水晶玉 */}
        <g className="fo-orb-group">
          <ellipse cx="65" cy="132" rx="16" ry="5" fill="#2E2154" opacity="0.4" />
          <circle cx="65" cy="120" r="14" fill="url(#fo-orb)" className="fo-orb" />
          <circle cx="60" cy="115" r="3" fill="#FFFFFF" opacity="0.8" />
        </g>
        <g>
          <path d="M14 44 l1.5 4 l4 1.5 l-4 1.5 l-1.5 4 l-1.5 -4 l-4 -1.5 l4 -1.5 Z" fill="#C9A8FF" className="spark spark1" />
          <path d="M114 54 l1.2 3.2 l3.2 1.2 l-3.2 1.2 l-1.2 3.2 l-1.2 -3.2 l-3.2 -1.2 l3.2 -1.2 Z" fill="#C9A8FF" className="spark spark2" />
          <path d="M110 100 l1 2.6 l2.6 1 l-2.6 1 l-1 2.6 l-1 -2.6 l-2.6 -1 l2.6 -1 Z" fill="#FFE9A8" className="spark spark3" />
        </g>
      </svg>
    </div>
  );
}

// ===== 小判・大判が降る背景 =====
function KobanRain({ count = 20, bgFixed = false }) {
  const items = Array.from({ length: count });
  return (
    <div className={'koban-rain' + (bgFixed ? ' bg-fixed' : '')}>
      {items.map((_, i) => {
        const kind = i % 5 === 0 ? 'box' : (i % 3 === 0 ? 'oban' : 'koban'); // 5枚に1枚千両箱、他は大判/小判
        const style = {
          left: `${(i * 4.7 + 2) % 100}%`,
          animationDelay: `${(i * 0.42) % 7}s`,
          animationDuration: `${5 + (i % 5)}s`,
        };
        if (kind === 'box') {
          return (
            <span key={i} className="fall-box" style={style}>
              <span className="mini-box">
                <span className="mini-box-lid"></span>
                <span className="mini-box-body">千両</span>
              </span>
            </span>
          );
        }
        return (
          <span key={i} className={kind === 'oban' ? 'oban' : 'koban'} style={style}>
            <span className={kind === 'oban' ? 'oban-face' : 'koban-face'}>{kind === 'oban' ? '大判' : '小判'}</span>
          </span>
        );
      })}
    </div>
  );
}

// ===== 宇宙背景(星が瞬く) =====
function CosmicBackground({ starCount = 40 }) {
  const stars = Array.from({ length: starCount }, (_, i) => ({
    top: `${(i * 13 + 7) % 100}%`,
    left: `${(i * 29 + 11) % 100}%`,
    size: 1 + (i % 3),
    delay: `${(i * 0.31) % 4}s`,
    dur: `${2 + (i % 3)}s`,
  }));
  return (
    <div className="cosmic-bg">
      {stars.map((s, i) => (
        <span key={i} className="cosmic-star" style={{ top: s.top, left: s.left, width: s.size, height: s.size, animationDelay: s.delay, animationDuration: s.dur }} />
      ))}
      <span className="cosmic-nebula cosmic-nebula-1"></span>
      <span className="cosmic-nebula cosmic-nebula-2"></span>
    </div>
  );
}

// ===== 降る星(流れ星のように上から降ってくる) =====
function StarRain({ count = 18 }) {
  const items = Array.from({ length: count }, (_, i) => ({
    left: `${(i * 5.6 + 3) % 100}%`,
    size: 10 + (i % 3) * 4,
    delay: `${(i * 0.5) % 8}s`,
    dur: `${6 + (i % 5)}s`,
    kind: i % 4 === 0 ? '✨' : '⭐',
  }));
  return (
    <div className="star-rain">
      {items.map((s, i) => (
        <span
          key={i}
          className="star-rain-item"
          style={{ left: s.left, fontSize: s.size, animationDelay: s.delay, animationDuration: s.dur }}
        >
          {s.kind}
        </span>
      ))}
    </div>
  );
}

// ===== 千両箱（予測数字を1枚ずつ出す演出） =====
function TreasureBox({ open, numbers, delay = 0, showJackpot = true, jackpotContent = null, jackpotAlign = 'center' }) {
  const [visibleCount, setVisibleCount] = useState(0);
  const [phase, setPhase] = useState('closed'); // closed -> opening -> revealed
  const numKey = numbers.join(',');

  useEffect(() => {
    if (!open) { setVisibleCount(0); setPhase('closed'); return; }
    setVisibleCount(0);
    setPhase('closed');
    const timers = [];
    // 箱ごとの時間差(delay)後にフタを開け、中が光ってコインが1枚ずつ飛び出す
    timers.push(setTimeout(() => setPhase('opening'), delay));
    numbers.forEach((_, i) => {
      timers.push(setTimeout(() => setVisibleCount((c) => Math.max(c, i + 1)), delay + 550 + i * 260));
    });
    // 全部出きったら少し間を置いて「箱を消して数字のみ表示」に切り替える
    const revealAt = delay + 550 + numbers.length * 260 + 500;
    timers.push(setTimeout(() => setPhase('revealed'), revealAt));
    return () => timers.forEach(clearTimeout);
    // eslint-disable-next-line
  }, [open, numKey, delay]);

  if (phase === 'revealed') {
    const showInline = showJackpot && jackpotAlign !== 'end';
    return (
      <div className="tb-revealed">
        <div className="tb-revealed-nums">
          {numbers.map((n, i) => (
            <span key={i} className="tb-coin tb-coin-final">{n}</span>
          ))}
        </div>
        {showInline && (
          <div style={{ alignSelf: 'center' }}>
            {jackpotContent || <LeoJackpot />}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={'treasure-box' + (phase === 'opening' ? ' open' : '')}>
      <div className="tb-glow"></div>
      <div className="tb-flash"></div>
      <div className="tb-coins">
        {numbers.map((n, i) => (
          <span key={i} className={'tb-coin' + (i < visibleCount ? ' pop' : '')}>{n}</span>
        ))}
      </div>
      <div className="tb-base">
        <div className="tb-lid">
          <div className="tb-lid-band"></div>
          <div className="tb-lid-lock"></div>
        </div>
        <div className="tb-front">
          <span className="tb-label">千両箱</span>
          <div className="tb-band tb-band-1"></div>
          <div className="tb-band tb-band-2"></div>
        </div>
      </div>
    </div>
  );
}

// ===== 大金に驚喜するレオ（1匹・頭上に札束ピラミッド） =====
// レインボー(SVGの同心円弧)
function RainbowArc() {
  const colors = ['#E63946', '#F4A261', '#FFD166', '#4CAF50', '#3A86FF', '#7C3AED'];
  const cx = 100, cy = 105;
  return (
    <svg className="lj-rainbow" viewBox="0 0 200 110" width="100%" height="100%">
      {colors.map((c, i) => {
        const r = 92 - i * 9;
        return (
          <path
            key={c}
            d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
            stroke={c}
            strokeWidth="7"
            fill="none"
            strokeLinecap="round"
          />
        );
      })}
    </svg>
  );
}

function LeoJackpot({ message = 'これで君も\n億万長者だー！！' }) {
  const lines = message.split('\n');
  return (
    <div className="leo-jackpot">
      <div className="lj-burst"></div>
      <div className="lj-burst lj-burst2"></div>
      <div className="lj-rainbow-wrap"><RainbowArc /></div>
      <div className="lj-sparkles">
        <span className="lj-spk lj-spk1">✨</span>
        <span className="lj-spk lj-spk2">✨</span>
        <span className="lj-spk lj-spk3">✨</span>
        <span className="lj-spk lj-spk4">✨</span>
      </div>
      <div className="lj-barpile">
        <div className="lj-bar-row">
          <span className="lj-bar"></span>
        </div>
        <div className="lj-bar-row">
          <span className="lj-bar"></span>
          <span className="lj-bar"></span>
        </div>
        <div className="lj-bar-row">
          <span className="lj-bar"></span>
          <span className="lj-bar"></span>
          <span className="lj-bar"></span>
        </div>
      </div>
      <div className="lj-owl-center">
        <div className="lj-owl"><OwlLeo size={72} surprised /></div>
      </div>
      <div className="lj-bubble">{lines.map((l, i) => <React.Fragment key={i}>{i > 0 && <br />}{l}</React.Fragment>)}</div>
    </div>
  );
}

// ===== ミニフクロウ部隊(複数羽で喜ぶ演出) =====
function MiniOwlSquad({ count = 3, message = '高額当選だー！！' }) {
  const lines = message.split('\n');
  // 羽数に応じた配置(3羽=下段に一列、5羽=下段に弧形)
  const layout = count >= 5
    ? [
        { top: '58%', left: '18%', size: 32 }, { top: '52%', left: '38%', size: 36 }, { top: '52%', left: '62%', size: 36 },
        { top: '68%', left: '28%', size: 32 }, { top: '68%', left: '52%', size: 32 },
      ]
    : [
        { top: '62%', left: '20%', size: 36 }, { top: '54%', left: '42%', size: 40 }, { top: '62%', left: '64%', size: 36 },
      ];
  return (
    <div className="leo-jackpot mini-squad">
      <div className="lj-burst"></div>
      <div className="lj-rainbow-wrap"><RainbowArc /></div>
      <div className="lj-sparkles">
        <span className="lj-spk lj-spk1">✨</span>
        <span className="lj-spk lj-spk2">✨</span>
        <span className="lj-spk lj-spk3">✨</span>
        <span className="lj-spk lj-spk4">✨</span>
      </div>
      <div className="lj-billpile">
        <div className="lj-bill-row">
          <span className="lj-bill"></span>
        </div>
        <div className="lj-bill-row">
          <span className="lj-bill"></span>
          <span className="lj-bill"></span>
        </div>
        <div className="lj-bill-row">
          <span className="lj-bill"></span>
          <span className="lj-bill"></span>
          <span className="lj-bill"></span>
        </div>
      </div>
      <div className="mini-squad-owls">
        {layout.slice(0, count).map((pos, i) => (
          <div key={i} className="mini-owl-slot" style={{ top: pos.top, left: pos.left }}>
            <OwlLeo size={pos.size} surprised />
          </div>
        ))}
      </div>
      <div className="lj-bubble mini-squad-bubble">{lines.map((l, i) => <React.Fragment key={i}>{i > 0 && <br />}{l}</React.Fragment>)}</div>
    </div>
  );
}

// レオが吉日を語る吹き出し
function LeoKichiSpeech({ dateLabel, tags }) {
  const hasKichi = tags.length > 0;
  let msg;
  const labels = tags.map((t) => t.label);
  if (labels.includes('天赦日')) {
    msg = `おっ、今日は天赦日じゃ！暦の上で最上の吉日、思い切って動くには絶好の日じゃよ🦉✨`;
  } else if (labels.includes('一粒万倍日') && labels.includes('大安')) {
    msg = `わお！大安と一粒万倍日が重なる好日じゃ。新しいことを始めるには絶好のタイミングじゃよ🦉`;
  } else if (labels.includes('一粒万倍日')) {
    msg = `一粒万倍日じゃ。まいた種が大きく実る、始めごとに良い日じゃよ🦉`;
  } else if (labels.includes('己巳の日')) {
    msg = `己巳の日じゃ！弁財天さまのご縁日、金運にはとびきりの日じゃよ🦉💰`;
  } else if (labels.some((l) => l === '寅の日' || l === '巳の日')) {
    msg = `${labels.find((l) => l === '寅の日' || l === '巳の日')}じゃ。金運にゆかりのある日、財布の新調にも良いぞ🦉`;
  } else if (hasKichi) {
    msg = `今日は${labels.join('・')}。縁起をかついで、いい一日にするのじゃ🦉`;
  } else {
    msg = `今日はふつうの日じゃな。無理せずマイペースでいこうかの🦉`;
  }
  return (
    <div className="leo-kichi">
      <div className="leo-kichi-leo"><OwlLeo size={92} /></div>
      <div className="leo-kichi-bubble">
        <div className="leo-kichi-date">{dateLabel}は…</div>
        {hasKichi && (
          <div className="leo-kichi-tags">
            {tags.map((t) => (
              <span key={t.key} className="leo-ktag" style={{ background: t.c }}>{t.label}</span>
            ))}
          </div>
        )}
        <div className="leo-kichi-msg">「{msg}」</div>
      </div>
    </div>
  );
}


// ===== 最新結果の表示 & 的中チェック =====
function numBallStyle(active, size) {
  return {
    width: size, height: size, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, fontSize: size * 0.4,
    background: active ? 'var(--brand-deep)' : 'var(--surface-alt)',
    color: active ? '#fff' : 'var(--ink)',
    border: active ? '2px solid var(--gold)' : '1px solid var(--line)',
    transition: 'all .15s ease',
  };
}

const WEIGHT_PRESETS = [
  { key: 'balanced', label: 'バランス型', weights: { prior: 0.3, mk: 0.3, ema: 0.2, cop: 0.2 } },
  { key: 'freq', label: '実績重視型', weights: { prior: 0.55, mk: 0.2, ema: 0.15, cop: 0.1 } },
  { key: 'momentum', label: '勢い重視型', weights: { prior: 0.15, mk: 0.15, ema: 0.5, cop: 0.2 } },
  { key: 'markov', label: '相関重視型', weights: { prior: 0.2, mk: 0.5, ema: 0.15, cop: 0.15 } },
  { key: 'pair', label: '相性重視型', weights: { prior: 0.2, mk: 0.2, ema: 0.15, cop: 0.45 } },
];

function computeTrackRecord(data, game, n, weights) {
  if (data.length < n + 5) n = Math.max(0, data.length - 5);
  if (n <= 0) return [];
  const cutoff = data.length - n;
  const train = data.slice(0, cutoff);
  const model = buildModel(train, game);
  const results = [];
  for (let i = cutoff; i < data.length; i++) {
    const prevRow = data[i - 1];
    const prevSet = new Set(prevRow.slice(1, 1 + game.pick));
    const scores = scoreAllPick(model, prevSet, weights);
    const predicted = Object.entries(scores).sort((a, b) => b[1] - a[1]).slice(0, game.pick).map(([m]) => Number(m));
    const actualSet = new Set(data[i].slice(1, 1 + game.pick));
    const matched = predicted.filter((x) => actualSet.has(x)).length;
    results.push({ round: data[i][0], matched });
    // 逐次モデル更新(ローリング検証)
    model.total += 1;
    prevRow.slice(1, 1 + game.pick).forEach((nn) => { model.freq[nn] += 1; });
    for (let nn = game.min; nn <= game.max; nn++) model.ema[nn] = 0.3 * (prevSet.has(nn) ? 1 : 0) + 0.7 * model.ema[nn];
    for (let nn = game.min; nn <= game.max; nn++) {
      const key = (prevSet.has(nn) ? '1' : '0') + (actualSet.has(nn) ? '1' : '0');
      model.markov[nn][key] += 1;
    }
    const sorted = prevRow.slice(1, 1 + game.pick).slice().sort((a, b) => a - b);
    for (let a = 0; a < game.pick; a++) for (let b = a + 1; b < game.pick; b++) {
      const key = sorted[a] + '-' + sorted[b];
      model.pairCounter[key] = (model.pairCounter[key] || 0) + 1;
    }
  }
  return results;
}

// 複数の重み配合を過去n回でバックテストし、最も平均一致数が多かった配合を選ぶ
function selectBestWeights(data, game, n) {
  let best = null;
  for (const preset of WEIGHT_PRESETS) {
    const track = computeTrackRecord(data, game, n, preset.weights);
    if (track.length === 0) continue;
    const avg = track.reduce((s, t) => s + t.matched, 0) / track.length;
    if (!best || avg > best.avg) {
      best = { ...preset, avg, track };
    }
  }
  return best;
}

function computeHotCold(data, game, windowSize) {
  const recent = data.slice(-windowSize);
  const freq = {};
  for (let n = game.min; n <= game.max; n++) freq[n] = 0;
  recent.forEach((r) => r.slice(1, 1 + game.pick).forEach((n) => { freq[n] += 1; }));
  const lastSeen = {};
  for (let n = game.min; n <= game.max; n++) lastSeen[n] = -1;
  data.forEach((r, idx) => r.slice(1, 1 + game.pick).forEach((n) => { lastSeen[n] = idx; }));
  const sinceLastSeen = {};
  for (let n = game.min; n <= game.max; n++) sinceLastSeen[n] = lastSeen[n] === -1 ? data.length : (data.length - 1 - lastSeen[n]);
  const hot = Object.entries(freq).sort((a, b) => b[1] - a[1] || Number(a[0]) - Number(b[0])).slice(0, 8).map(([n, c]) => ({ n: Number(n), c }));
  const hotSet = new Set(hot.map((h) => h.n));
  const cold = Object.entries(sinceLastSeen)
    .filter(([n]) => !hotSet.has(Number(n)))
    .sort((a, b) => b[1] - a[1] || Number(a[0]) - Number(b[0]))
    .slice(0, 8)
    .map(([n, c]) => ({ n: Number(n), c }));
  return { hot, cold, window: Math.min(windowSize, data.length) };
}

function LatestResultCheck({ data, digitData, game, gameKey }) {
  const isDigit = !!game.digits;
  const latest = isDigit ? (digitData && digitData[digitData.length - 1]) : (data && data[data.length - 1]);
  const [track, setTrack] = useState(null);
  const [hotCold, setHotCold] = useState(null);
  const [predCheck, setPredCheck] = useState(null);
  const [nextPred, setNextPred] = useState(null);
  const [bestWeights, setBestWeights] = useState(null);

  useEffect(() => {
    if (isDigit || !data || data.length < 20) { setTrack(null); setHotCold(null); setBestWeights(null); return; }
    const best = selectBestWeights(data, game, 15);
    setBestWeights(best);
    setTrack(best ? best.track : null);
    setHotCold(computeHotCold(data, game, 30));
  }, [data, game, gameKey, isDigit]);

  useEffect(() => {
    if (isDigit || !data || data.length < 3) return;
    let cancelled = false;
    (async () => {
      const key = `pred_${gameKey}`;
      const latestRound = data[data.length - 1][0];
      const weights = (bestWeights && bestWeights.weights) || WEIGHT_PRESETS[0].weights;
      try {
        const res = await window.storage.get(key);
        const saved = JSON.parse(res.value);
        if (saved.round === latestRound) {
          const actualSet = new Set(data[data.length - 1].slice(1, 1 + game.pick));
          const matched = saved.predicted.filter((n) => actualSet.has(n)).length;
          if (!cancelled) setPredCheck({ round: saved.round, predicted: saved.predicted, matched, actualSet, label: saved.label });
        }
      } catch (e) { /* 保存された前回予想なし */ }

      const model = buildModel(data, game);
      const prevSet = new Set(data[data.length - 1].slice(1, 1 + game.pick));
      const scores = scoreAllPick(model, prevSet, weights);
      const predicted = Object.entries(scores).sort((a, b) => b[1] - a[1]).slice(0, game.pick).map(([n]) => Number(n)).sort((a, b) => a - b);
      const label = (bestWeights && bestWeights.label) || WEIGHT_PRESETS[0].label;
      if (!cancelled) setNextPred({ round: latestRound + 1, predicted, label });
      try { await window.storage.set(key, JSON.stringify({ round: latestRound + 1, predicted, label })); } catch (e) { /* 保存失敗は無視 */ }
    })();
    return () => { cancelled = true; };
  }, [data, game, gameKey, isDigit, bestWeights]);

  if (!latest) return null;

  return (
    <div className="kl-card" style={{ marginBottom: 16 }}>
      <div className="kl-card-head">
        <div className="kl-card-title">🎯 直近の結果と分析トラッキング</div>
      </div>
      <div className="kl-card-desc">
        第{latest[0]}回の結果：
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 8, marginBottom: 4 }}>
          {isDigit
            ? String(latest[1]).padStart(game.digits, '0').split('').map((d, i) => (
                <div key={i} style={numBallStyle(true, 36)}>{d}</div>
              ))
            : latest.slice(1, 1 + game.pick).map((n) => (
                <div key={n} style={numBallStyle(true, 36)}>{n}</div>
              ))}
        </div>
      </div>

      {predCheck && (
        <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px dashed var(--line)' }}>
          <div style={{ fontSize: 12.5, fontWeight: 700, marginBottom: 6 }}>
            📮 前回(第{predCheck.round}回)のエンジン予想、答え合わせ
            {predCheck.label && <span style={{ fontSize: 10.5, fontWeight: 500, color: 'var(--muted)', marginLeft: 6 }}>（{predCheck.label}）</span>}
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {predCheck.predicted.map((n) => (
              <div key={n} style={numBallStyle(predCheck.actualSet.has(n), 32)}>{n}</div>
            ))}
          </div>
          <div style={{ marginTop: 6, fontSize: 13, fontWeight: 700, color: predCheck.matched > 0 ? 'var(--brand-deep)' : 'var(--muted)' }}>
            {predCheck.matched}個 一致していました
          </div>
        </div>
      )}

      {nextPred && (
        <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px dashed var(--line)' }}>
          <div style={{ fontSize: 12.5, fontWeight: 700, marginBottom: 6 }}>🔮 次回(第{nextPred.round}回)へのエンジン予想を記録済み</div>
          <div style={{ fontSize: 11.5, color: 'var(--muted)' }}>
            次回の結果が反映されたら、自動でここに答え合わせが表示されます。
            {nextPred.label && <>採用中の配合：<b>{nextPred.label}</b>（過去15回の実績が最も良かった方式）</>}
          </div>
        </div>
      )}

      {!isDigit && track && track.length > 0 && (
        <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px dashed var(--line)' }}>
          <div style={{ fontSize: 12.5, fontWeight: 700, marginBottom: 6 }}>
            📊 過去{track.length}回の的中実績
            {bestWeights && <span style={{ fontSize: 10.5, fontWeight: 500, color: 'var(--muted)', marginLeft: 6 }}>（{bestWeights.label}を採用）</span>}
          </div>
          <div style={{ display: 'flex', gap: 4, alignItems: 'flex-end', height: 60 }}>
            {track.map((t) => (
              <div key={t.round} title={`第${t.round}回：${t.matched}個一致`} style={{
                flex: 1,
                background: t.matched >= 3 ? 'var(--brand-deep)' : t.matched >= 1 ? 'var(--gold)' : 'var(--surface-alt)',
                height: `${Math.max(8, t.matched * 14)}px`, borderRadius: 3,
              }} />
            ))}
          </div>
          <div style={{ marginTop: 6, fontSize: 11.5, color: 'var(--muted)' }}>
            平均 {(track.reduce((s, t) => s + t.matched, 0) / track.length).toFixed(2)}個/回 一致
            （5種類の配合パターンをそれぞれ過去{track.length}回で検証し、最も成績が良かったものを自動採用）
          </div>
        </div>
      )}

      {!isDigit && hotCold && (
        <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px dashed var(--line)' }}>
          <div style={{ fontSize: 12.5, fontWeight: 700, marginBottom: 6 }}>🔥❄️ 直近{hotCold.window}回の出現傾向</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 4 }}>よく出ている(ホット)</div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {hotCold.hot.map((h) => (
                  <div key={h.n} style={numBallStyle(true, 30)}>{h.n}</div>
                ))}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 4 }}>しばらく出ていない(コールド)</div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {hotCold.cold.map((h) => (
                  <div key={h.n} style={numBallStyle(false, 30)}>{h.n}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const ROKUYO_NAMES = ['大安', '赤口', '先勝', '友引', '先負', '仏滅'];
const ROKUYO_TONE = {
  '大安': { c: '#1F6F5C', label: '最も良いとされる日' },
  '友引': { c: '#3A7A5C', label: '吉凶が引き分けの日' },
  '先勝': { c: '#6B8F6A', label: '午前が良いとされる日' },
  '赤口': { c: '#9AA39C', label: '正午のみ良いとされる日' },
  '先負': { c: '#A08A5C', label: '午後が良いとされる日' },
  '仏滅': { c: '#9C6B5C', label: '静かに過ごす日' },
};

function rokuyoOf(dateObj) {
  const start = new Date(ROKUYO_START + 'T00:00:00Z');
  const target = new Date(Date.UTC(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate()));
  const diffDays = Math.round((target - start) / 86400000);
  if (diffDays < 0 || diffDays >= ROKUYO_CODES.length) return null;
  const code = ROKUYO_CODES[diffDays];
  if (code === '9') return null;
  return ROKUYO_NAMES[Number(code)];
}

// ===== 干支（十干十二支）の日 =====
// 2025-01-01 を基準日として、天干(10周期)・地支(12周期)からmod計算。実際の暦と照合済み。
const GANZHI_EPOCH = '2025-01-01';
const GANZHI_EPOCH_TG = 6; // 天干インデックス(0=甲)
const GANZHI_EPOCH_DZ = 6; // 地支インデックス(0=子)
const DIZHI = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
const TIANGAN = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];

function ganzhiOf(dateObj) {
  const epoch = new Date(GANZHI_EPOCH + 'T00:00:00Z');
  const target = new Date(Date.UTC(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate()));
  const diff = Math.round((target - epoch) / 86400000);
  const tg = ((GANZHI_EPOCH_TG + diff) % 10 + 10) % 10;
  const dz = ((GANZHI_EPOCH_DZ + diff) % 12 + 12) % 12;
  return { tg, dz, name: TIANGAN[tg] + DIZHI[dz] };
}

function kichijitsuOf(dateObj) {
  const { tg, dz, name } = ganzhiOf(dateObj);
  const tags = [];
  if (dz === 2) tags.push({ key: 'tora', label: '寅の日', desc: '金運を呼ぶとされる日', c: '#B8863B' });
  if (dz === 4) tags.push({ key: 'tatsu', label: '辰の日', desc: '成長・発展にゆかりの日', c: '#5C8C6F' });
  if (dz === 5) tags.push({ key: 'mi', label: '巳の日', desc: '金運・財運の日', c: '#B8863B' });
  if (tg === 5 && dz === 5) tags.push({ key: 'tsuchinoto-mi', label: '己巳の日', desc: '弁財天ゆかりの特に良い金運日（60日に一度）', c: '#8C5A1F' });
  if (tg === 0 && dz === 0) tags.push({ key: 'kinoe-ne', label: '甲子の日', desc: '物事の始まりに良いとされる日（60日に一度）', c: '#3A5C8C' });
  return { ganzhi: name, tags };
}

// ===== 一粒万倍日・天赦日（節気の節月と日の干支から算出。実データと照合済み） =====
const ICHIRYU_RULE = {
  '立春': ['丑', '午'], '啓蟄': ['寅', '酉'], '清明': ['子', '卯'], '立夏': ['卯', '辰'],
  '芒種': ['巳', '午'], '小暑': ['午', '酉'], '立秋': ['子', '未'], '白露': ['卯', '申'],
  '寒露': ['午', '酉'], '立冬': ['酉', '戌'], '大雪': ['子', '亥'], '小寒': ['子', '卯'],
};
const TENSHA_RULE = {
  '立春': '戊寅', '啓蟄': '戊寅', '清明': '戊寅',
  '立夏': '甲午', '芒種': '甲午', '小暑': '甲午',
  '立秋': '戊申', '白露': '戊申', '寒露': '戊申',
  '立冬': '甲子', '大雪': '甲子', '小寒': '甲子',
};

function currentSetsu(dateObj) {
  const target = new Date(Date.UTC(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate()));
  const dateStr = target.toISOString().slice(0, 10);
  let result = null;
  for (const [d, name] of SETSU_BOUNDS) {
    if (d <= dateStr) result = name; else break;
  }
  return result;
}

function seasonalKichijitsuOf(dateObj) {
  const setsu = currentSetsu(dateObj);
  const tags = [];
  if (!setsu) return tags;
  const { name } = ganzhiOf(dateObj);
  const dz = ganzhiOf(dateObj).dz;
  const branch = DIZHI[dz];
  if (ICHIRYU_RULE[setsu] && ICHIRYU_RULE[setsu].includes(branch)) {
    tags.push({ key: 'ichiryu', label: '一粒万倍日', desc: '新しく始めることに良いとされる日', c: '#1F6F5C' });
  }
  if (TENSHA_RULE[setsu] === name) {
    tags.push({ key: 'tensha', label: '天赦日', desc: '暦の上で最上とされる吉日（年5〜6回）', c: '#B8863B' });
  }
  return tags;
}

// ===== 月齢（新月からの経過日数。近似値のため目安として表示） =====
const REF_NEW_MOON_UTC = Date.UTC(2000, 0, 6, 18, 14);
const SYNODIC_MONTH = 29.530588853;
function moonAgeOf(dateObj) {
  const noonJST = Date.UTC(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate(), 3, 0); // JST正午
  const days = (noonJST - REF_NEW_MOON_UTC) / 86400000;
  const age = ((days % SYNODIC_MONTH) + SYNODIC_MONTH) % SYNODIC_MONTH;
  return age;
}
function moonPhaseLabel(age) {
  if (age < 1.5 || age > 28) return { label: '新月', icon: '●', c: '#3A4A5C' };
  if (age < 6.5) return { label: '三日月', icon: '🌒', c: '#647065' };
  if (age < 8) return { label: '上弦', icon: '半', c: '#647065' };
  if (age < 13) return { label: '十三夜', icon: '🌔', c: '#B8863B' };
  if (age < 16) return { label: '満月', icon: '○', c: '#B8863B' };
  if (age < 21) return { label: '寝待月', icon: '🌖', c: '#647065' };
  if (age < 23) return { label: '下弦', icon: '半', c: '#647065' };
  return { label: '有明月', icon: '🌘', c: '#647065' };
}

// ===== ロト6 統計モデル(実データ) =====
function buildModel(data, game) {
  const { min, max, pick } = game;
  const total = data.length;
  const freq = {};
  for (let n = min; n <= max; n++) freq[n] = 0;
  data.forEach((r) => r.slice(1, 1 + pick).forEach((n) => (freq[n] += 1)));

  const alpha = 0.3;
  const ema = {};
  for (let n = min; n <= max; n++) ema[n] = pick / (max - min + 1);
  data.forEach((r) => {
    const nums = new Set(r.slice(1, 1 + pick));
    for (let n = min; n <= max; n++) {
      ema[n] = alpha * (nums.has(n) ? 1 : 0) + (1 - alpha) * ema[n];
    }
  });

  const markov = {};
  for (let n = min; n <= max; n++) markov[n] = { '00': 0, '01': 0, '10': 0, '11': 0 };
  for (let i = 1; i < data.length; i++) {
    const prev = new Set(data[i - 1].slice(1, 1 + pick));
    const curr = new Set(data[i].slice(1, 1 + pick));
    for (let n = min; n <= max; n++) {
      const key = (prev.has(n) ? '1' : '0') + (curr.has(n) ? '1' : '0');
      markov[n][key] += 1;
    }
  }

  const pairCounter = {};
  data.forEach((r) => {
    const nums = r.slice(1, 1 + pick).slice().sort((a, b) => a - b);
    for (let i = 0; i < pick; i++) {
      for (let j = i + 1; j < pick; j++) {
        const key = nums[i] + '-' + nums[j];
        pairCounter[key] = (pairCounter[key] || 0) + 1;
      }
    }
  });
  return { total, freq, ema, markov, pairCounter, min, max, pick };
}
function pairRatio(model, a, b) {
  const { total, freq, pairCounter } = model;
  const lo = Math.min(a, b), hi = Math.max(a, b);
  const key = lo + '-' + hi;
  const exp = (freq[lo] / total) * (freq[hi] / total) * total;
  if (exp <= 0) return 1;
  return (pairCounter[key] || 0) / exp;
}
function scoreAllPick(model, prevSet, weights) {
  const { total, freq, ema, markov, min, max, pick } = model;
  const scores = {};
  const uniform = pick / (max - min + 1);
  for (let n = min; n <= max; n++) {
    const prior = freq[n] / (total * pick);
    const p11 = markov[n]['11'] + markov[n]['01'];
    const p10 = markov[n]['10'] + markov[n]['00'];
    const mk = prevSet.has(n) ? (p11 > 0 ? markov[n]['11'] / p11 : uniform) : (p10 > 0 ? markov[n]['10'] / p10 : uniform);
    const emaScore = 1 - ema[n];
    let cop = 0;
    prevSet.forEach((m) => { if (m !== n) cop += pairRatio(model, n, m); });
    const copScore = prevSet.size > 0 ? cop / prevSet.size : 1;
    scores[n] = weights.prior * prior + weights.mk * mk + weights.ema * emaScore + weights.cop * copScore;
  }
  return scores;
}
function combinations(arr, k) {
  const results = [];
  const combo = [];
  function go(start) {
    if (combo.length === k) { results.push(combo.slice()); return; }
    for (let i = start; i < arr.length; i++) { combo.push(arr[i]); go(i + 1); combo.pop(); }
  }
  go(0);
  return results;
}
function generatePickSets(model, scores, opts) {
  const { min, max, pick } = model;
  const sorted = Object.entries(scores).map(([n, s]) => [Number(n), s]).sort((a, b) => b[1] - a[1]);
  const pool = sorted.slice(0, Math.min(opts.poolSize, max - min + 1)).map((x) => x[0]);
  const badPairs = new Set();
  const freqNums = Object.entries(model.freq).filter(([, c]) => c >= model.total * pick * 0.12).map(([n]) => Number(n));
  for (let i = 0; i < freqNums.length; i++) {
    for (let j = i + 1; j < freqNums.length; j++) {
      if (pairRatio(model, freqNums[i], freqNums[j]) < 0.72) {
        badPairs.add(Math.min(freqNums[i], freqNums[j]) + '-' + Math.max(freqNums[i], freqNums[j]));
      }
    }
  }
  const combos = combinations(pool, pick);
  const candidates = [];
  for (const combo of combos) {
    const sum = combo.reduce((a, b) => a + b, 0);
    if (sum < opts.sumMin || sum > opts.sumMax) continue;
    const odd = combo.filter((n) => n % 2 === 1).length;
    if (odd < opts.oddMin || odd > opts.oddMax) continue;
    let bad = false;
    for (let i = 0; i < pick && !bad; i++) for (let j = i + 1; j < pick; j++) {
      if (badPairs.has(Math.min(combo[i], combo[j]) + '-' + Math.max(combo[i], combo[j]))) { bad = true; break; }
    }
    if (bad) continue;
    candidates.push({ combo: combo.slice().sort((a, b) => a - b), score: combo.reduce((s, n) => s + scores[n], 0) });
  }
  candidates.sort((a, b) => b.score - a.score);
  const picked = [];
  const overlapLimit = Math.max(pick - 1, Math.ceil(pick * 0.8));
  for (const c of candidates) {
    if (!picked.some((p) => c.combo.filter((n) => p.combo.includes(n)).length >= overlapLimit)) picked.push(c);
    if (picked.length >= opts.count) break;
  }
  return picked;
}

// ===== ナンバーズ3/4用: 桁ごとの出現頻度モデル =====
function buildDigitModel(data, digits) {
  const total = data.length;
  const posFreq = Array.from({ length: digits }, () => new Array(10).fill(0));
  const posEma = Array.from({ length: digits }, () => new Array(10).fill(0.1));
  const alpha = 0.3;
  data.forEach(([, str]) => {
    for (let i = 0; i < digits; i++) posFreq[i][Number(str[i])] += 1;
  });
  data.forEach(([, str]) => {
    for (let i = 0; i < digits; i++) {
      const actual = Number(str[i]);
      for (let d = 0; d < 10; d++) {
        posEma[i][d] = alpha * (actual === d ? 1 : 0) + (1 - alpha) * posEma[i][d];
      }
    }
  });
  return { total, posFreq, posEma, digits };
}
function scoreDigitPositions(model) {
  const { total, posFreq, posEma, digits } = model;
  const scores = [];
  for (let i = 0; i < digits; i++) {
    const row = [];
    for (let d = 0; d < 10; d++) {
      const prior = (posFreq[i][d] / total) * 10; // 一様なら1.0になるよう正規化
      const emaScore = 1 - posEma[i][d];
      row.push(0.5 * prior + 0.5 * emaScore);
    }
    scores.push(row);
  }
  return scores;
}
function generateDigitStatSets(model, count) {
  const scores = scoreDigitPositions(model);
  const digits = model.digits;
  const topPerPos = scores.map((row) => row.map((s, d) => ({ d, s })).sort((a, b) => b.s - a.s).slice(0, 4));
  let combos = [[]];
  for (let i = 0; i < digits; i++) {
    const next = [];
    for (const c of combos) for (const { d } of topPerPos[i]) next.push([...c, d]);
    combos = next;
  }
  const scoredCombos = combos.map((arr) => {
    let s = 0;
    arr.forEach((d, i) => { s += scores[i][d]; });
    return { str: arr.join(''), score: s };
  });
  scoredCombos.sort((a, b) => b.score - a.score);
  const picked = [];
  for (const c of scoredCombos) {
    if (!picked.some((p) => p.str === c.str)) picked.push(c);
    if (picked.length >= count) break;
  }
  return picked;
}

// ===== プレミアム: ライブ・バックテスト(現在の重み・条件で実際に過去データを再検証する) =====
function comb(n, k) {
  if (k < 0 || k > n) return 0;
  let r = 1;
  for (let i = 0; i < k; i++) r = (r * (n - i)) / (i + 1);
  return r;
}
function randomKPlusRate(min, max, pick, k) {
  // ランダム選択でk個以上一致する理論確率(pick個選ぶくじの場合)
  const range = max - min + 1;
  const total = comb(range, pick);
  let s = 0;
  for (let j = k; j <= pick; j++) s += (comb(pick, j) * comb(range - pick, pick - j)) / total;
  return s;
}

function runLiveBacktest(fullData, trainEnd, weights, sumRange, game) {
  const train = fullData.filter((r) => r[0] <= trainEnd);
  const test = fullData.filter((r) => r[0] > trainEnd);
  const pick = game.pick, min = game.min, max = game.max;
  let model = buildModel(train, game);
  let hitsK = 0, total = 0, sumMatchTotal = 0;
  const kThreshold = Math.max(3, pick - 3);
  for (let i = 0; i < test.length - 1; i++) {
    const prevNums = test[i].slice(1, 1 + pick);
    const actual = new Set(test[i + 1].slice(1, 1 + pick));
    const prevSet = new Set(prevNums);
    const scores = scoreAllPick(model, prevSet, weights);
    const predicted = Object.entries(scores).sort((a, b) => b[1] - a[1]).slice(0, pick).map(([n]) => Number(n));
    const matches = predicted.filter((n) => actual.has(n)).length;
    if (matches >= kThreshold) hitsK++;
    sumMatchTotal += matches;
    total++;
    // モデルを1回分だけ逐次更新(ローリング検証)
    model.total += 1;
    prevNums.forEach((n) => { model.freq[n] += 1; });
    const appeared = prevSet;
    for (let n = min; n <= max; n++) model.ema[n] = 0.3 * (appeared.has(n) ? 1 : 0) + 0.7 * model.ema[n];
    for (let n = min; n <= max; n++) {
      const key = (prevSet.has(n) ? '1' : '0') + (actual.has(n) ? '1' : '0');
      model.markov[n][key] += 1;
    }
    const sorted = prevNums.slice().sort((a, b) => a - b);
    for (let a = 0; a < pick; a++) for (let b = a + 1; b < pick; b++) {
      const key = sorted[a] + '-' + sorted[b];
      model.pairCounter[key] = (model.pairCounter[key] || 0) + 1;
    }
  }
  return {
    total, hitsK, kThreshold,
    rate: total > 0 ? hitsK / total : 0,
    avgMatch: total > 0 ? sumMatchTotal / total : 0,
    randomRate: randomKPlusRate(min, max, pick, kThreshold),
  };
}

// ===== プレミアム: 三数字の相性分析(トリオ分析) =====
function buildTripleCounter(data, pick) {
  const counter = {};
  data.forEach((r) => {
    const nums = r.slice(1, 1 + pick).slice().sort((a, b) => a - b);
    for (let i = 0; i < pick; i++) for (let j = i + 1; j < pick; j++) for (let k = j + 1; k < pick; k++) {
      const key = nums[i] + '-' + nums[j] + '-' + nums[k];
      counter[key] = (counter[key] || 0) + 1;
    }
  });
  return counter;
}
function tripleRatio(model, tripleCounter, a, b, c) {
  const total = model.total;
  const exp = (model.freq[a] / total) * (model.freq[b] / total) * (model.freq[c] / total) * total;
  if (exp <= 0) return 0;
  const sorted = [a, b, c].sort((x, y) => x - y);
  const key = sorted.join('-');
  return { ratio: (tripleCounter[key] || 0) / exp, count: tripleCounter[key] || 0 };
}
function topTrios(model, tripleCounter, candidateNums, limit) {
  const nums = Array.from(new Set(candidateNums)).slice(0, 14);
  const results = [];
  for (let i = 0; i < nums.length; i++) {
    for (let j = i + 1; j < nums.length; j++) {
      for (let k = j + 1; k < nums.length; k++) {
        const { ratio, count } = tripleRatio(model, tripleCounter, nums[i], nums[j], nums[k]);
        if (count >= 3 && ratio >= 1.3) results.push({ trio: [nums[i], nums[j], nums[k]], ratio, count });
      }
    }
  }
  results.sort((a, b) => b.ratio - a.ratio);
  return results.slice(0, limit);
}

// ===== 汎用: バランス生成(データなしゲーム用) =====
function seededRandom(seed) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return function () {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}
function hashSeed(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = (h * 16777619) >>> 0;
  }
  return h;
}
function generateBalancedSets(game, count, seedStr) {
  const rand = seededRandom(seedStr ? hashSeed(seedStr) : Date.now() % 2147483647);
  const results = [];
  let guard = 0;
  while (results.length < count && guard < 4000) {
    guard++;
    const nums = new Set();
    while (nums.size < game.pick) {
      nums.add(Math.floor(rand() * (game.max - game.min + 1)) + game.min);
    }
    const arr = Array.from(nums).sort((a, b) => a - b);
    const odd = arr.filter((n) => n % 2 === 1).length;
    const half = game.pick / 2;
    if (Math.abs(odd - half) > Math.ceil(game.pick / 3)) continue;
    const dup = results.some((r) => r.filter((n) => arr.includes(n)).length >= game.pick - 1);
    if (dup) continue;
    results.push(arr);
  }
  return results;
}
function generateDigitSets(digits, count, seedStr) {
  const rand = seededRandom(seedStr ? hashSeed(seedStr) : Date.now() % 2147483647);
  const results = [];
  for (let i = 0; i < count; i++) {
    let s = '';
    for (let d = 0; d < digits; d++) s += Math.floor(rand() * 10);
    results.push(s);
  }
  return results;
}

// ===== 占いエンジン(エンタメ) =====
function fortuneSets(game, name, birth, count) {
  const seed = (name || '') + (birth || '') + new Date().toDateString();
  if (game.digits) return generateDigitSets(game.digits, count, seed + 'fortune');
  return generateBalancedSets(game, count, seed + 'fortune');
}

// 合計値の理論頻出レンジ(組み合わせ論による計算。実データ不要でどのゲームにも適用可)
function theoreticalSumRange(min, max, pick, coverage) {
  const cov = coverage || 0.8;
  const maxSum = max * pick;
  const dp = [];
  for (let k = 0; k <= pick; k++) dp.push(new Array(maxSum + 1).fill(0));
  dp[0][0] = 1;
  for (let n = min; n <= max; n++) {
    for (let k = pick; k >= 1; k--) {
      for (let s = maxSum; s >= n; s--) {
        if (dp[k - 1][s - n]) dp[k][s] += dp[k - 1][s - n];
      }
    }
  }
  const total = dp[pick].reduce((a, b) => a + b, 0);
  const sums = [];
  for (let s = 0; s <= maxSum; s++) if (dp[pick][s] > 0) sums.push([s, dp[pick][s]]);
  let best = null;
  for (let start = 0; start < sums.length; start++) {
    let cum = 0, end = start;
    while (end < sums.length && cum < total * cov) { cum += sums[end][1]; end++; }
    if (cum >= total * cov) {
      const width = sums[end - 1][0] - sums[start][0];
      if (!best || width < best.width) best = { min: sums[start][0], max: sums[end - 1][0], width, pct: (cum / total) * 100 };
    }
  }
  return best;
}

// プレミアム版バランス生成: 理論頻出レンジ + 連番過多を避ける制約つき
function generateAnalyzedBalancedSets(game, count, sumInfo) {
  const rand = seededRandom(Date.now() % 2147483647);
  const results = [];
  let guard = 0;
  while (results.length < count && guard < 6000) {
    guard++;
    const nums = new Set();
    while (nums.size < game.pick) nums.add(Math.floor(rand() * (game.max - game.min + 1)) + game.min);
    const arr = Array.from(nums).sort((a, b) => a - b);
    const sum = arr.reduce((a, b) => a + b, 0);
    if (sumInfo && (sum < sumInfo.min || sum > sumInfo.max)) continue;
    const odd = arr.filter((n) => n % 2 === 1).length;
    if (Math.abs(odd - game.pick / 2) > Math.ceil(game.pick / 3)) continue;
    let consec = 0, maxConsec = 0;
    for (let i = 1; i < arr.length; i++) { if (arr[i] === arr[i - 1] + 1) { consec++; maxConsec = Math.max(maxConsec, consec); } else consec = 0; }
    if (maxConsec > 1) continue;
    if (results.some((r) => r.filter((n) => arr.includes(n)).length >= game.pick - 1)) continue;
    results.push(arr);
  }
  return results;
}

// 月間運勢(プレミアム占い): 日ごとの金運スコアと詳細文章を生成(エンタメ)
function fortuneTier(score) {
  if (score >= 82) return { label: '絶好調', c: '#1F6F5C' };
  if (score >= 62) return { label: '好調', c: '#3A8C6F' };
  if (score >= 38) return { label: '普通', c: '#B8863B' };
  if (score >= 18) return { label: 'やや注意', c: '#A0704A' };
  return { label: '要注意', c: '#9C5C4A' };
}

const KINUN_TEMPLATES = {
  '絶好調': [
    '財布のひもを緩めても大丈夫そうな一日。思い切った出費や新しい挑戦が実りやすいタイミングです。',
    '臨時収入やうれしい知らせが舞い込みやすい日。人とのご縁がお金にもつながりそうです。',
    '貯蓄や投資など、お金を「育てる」行動を始めるのに向いている日です。',
  ],
  '好調': [
    '堅実な判断がうまくいきやすい日。欲しかったものを選ぶにも良いタイミングです。',
    '小さな幸運が積み重なりそうな一日。お財布の新調にも向いています。',
    '仕事や副収入の種まきにふさわしい日。焦らず着実に進めましょう。',
  ],
  '普通': [
    'いつも通りのペースで過ごすのが吉。無理な出費は控えめにしておきましょう。',
    '大きな動きより、家計の見直しなど地に足のついた行動が向いている日です。',
    '可もなく不可もなく、平常心で過ごすのが一番の日です。',
  ],
  'やや注意': [
    '衝動買いには少し気をつけたい日。一晩考えてから決めると安心です。',
    '契約や大きな買い物は、内容をよく確認してから進めましょう。',
    '人に流されての出費に注意。自分のペースを大事にしたい日です。',
  ],
  '要注意': [
    '大きな決断や高額の出費は、できれば別の日に見送るのが無難です。',
    '忘れ物やうっかりミスに気をつけたい日。財布の管理も慎重に。',
    '今日は無理をせず、静かに過ごすことでバランスが整いやすくなります。',
  ],
};

function dayFortuneText(seed, day, tier, calendarNote) {
  const rand = seededRandom(hashSeed(seed + ':' + day + ':text'));
  const pool = KINUN_TEMPLATES[tier.label];
  const base = pool[Math.floor(rand() * pool.length)];
  return calendarNote ? `${base}　この日は${calendarNote}でもあり、金運の切り口として意識してみるのも良さそうです。` : base;
}

function monthlyFortuneScores(name, birth, year, month, calendarBonusFn) {
  const seed = (name || 'guest') + (birth || '') + year + '-' + month;
  const rand = seededRandom(hashSeed(seed));
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days = [];
  for (let d = 1; d <= daysInMonth; d++) {
    let score = Math.round(rand() * 70 + 15); // 15-85のベース
    const bonusResult = calendarBonusFn ? calendarBonusFn(new Date(year, month, d)) : { bonus: 0 };
    score = Math.max(2, Math.min(99, score + bonusResult.bonus));
    days.push({ day: d, score });
  }
  return { seed, days };
}

function calendarLuckBonus(dateObj) {
  // 実際の暦(六曜・干支・一粒万倍日・天赦日)による金運ボーナス。エンタメ演出として加点する
  let bonus = 0;
  let notes = [];
  const roku = rokuyoOf(dateObj);
  if (roku === '大安') { bonus += 12; notes.push('大安'); }
  if (roku === '仏滅') { bonus -= 10; notes.push('仏滅'); }
  const kichi = kichijitsuOf(dateObj);
  kichi.tags.forEach((t) => {
    if (t.key === 'tsuchinoto-mi' || t.key === 'kinoe-ne') { bonus += 15; notes.push(t.label); }
    else { bonus += 8; notes.push(t.label); }
  });
  const seasonal = seasonalKichijitsuOf(dateObj);
  seasonal.forEach((t) => { bonus += (t.key === 'tensha' ? 16 : 10); notes.push(t.label); });
  return { bonus, note: notes.join('・') };
}

// ===== 生年月日ベースの占術（四柱推命・西洋占星術・数秘術）=====
// いずれも生年月日から一意に定まる古典的な算出方法。占い結果自体はエンタメ。

// 四柱推命：日主（生まれた日の十干）と五行
const GOGYO_OF_KAN = { '甲': '木', '乙': '木', '丙': '火', '丁': '火', '戊': '土', '己': '土', '庚': '金', '辛': '金', '壬': '水', '癸': '水' };
const NISSHU_DESC = {
  '甲': { type: '大樹の木', text: 'まっすぐ上へ伸びる大木のような人。信念が強く、リーダーとして人を導く力があります。' },
  '乙': { type: '草花の木', text: 'しなやかな草花のような人。柔軟で協調性があり、逆境でも折れずに生き抜く強さを持ちます。' },
  '丙': { type: '太陽の火', text: '太陽のように明るく開放的な人。情熱的で、周囲を照らす存在になります。' },
  '丁': { type: '灯火の火', text: 'ろうそくの炎のような人。繊細で思いやりがあり、身近な人を静かに照らします。' },
  '戊': { type: '山の土', text: 'どっしりとした山のような人。包容力があり、周囲から頼られる安定感を持ちます。' },
  '己': { type: '田畑の土', text: '作物を育てる田畑のような人。面倒見がよく、地道な努力で実りを生み出します。' },
  '庚': { type: '鋼の金', text: '鍛えられた鉄のような人。意志が強く決断力に富み、困難を切り開いていきます。' },
  '辛': { type: '宝石の金', text: '磨かれた宝石のような人。美意識が高く、繊細な感性と気品を備えています。' },
  '壬': { type: '大海の水', text: '大海のような人。度量が広く自由を愛し、大きな流れをつくり出します。' },
  '癸': { type: '雨露の水', text: '恵みの雨のような人。柔らかな感受性を持ち、周囲を潤し支えます。' },
};
// 五行の相生（金→水→木→火→土→金）で日ごとの相性を金運寄りに解釈
const GOGYO_ORDER = ['木', '火', '土', '金', '水'];
function gogyoRelation(selfEl, dayEl) {
  // 生じる（自分を強める）＝好調、剋す＝注意
  const seiseiNext = { '木': '火', '火': '土', '土': '金', '金': '水', '水': '木' };
  const kokuTarget = { '木': '土', '土': '水', '水': '火', '火': '金', '金': '木' };
  if (selfEl === dayEl) return 3;               // 比和：安定
  if (seiseiNext[dayEl] === selfEl) return 5;   // 日が自分を生じる：絶好調
  if (seiseiNext[selfEl] === dayEl) return 2;   // 自分が日を生じる（漏らす）：やや疲れ
  if (kokuTarget[selfEl] === dayEl) return 4;   // 自分が日を剋す（財を得る）：金運好調
  if (kokuTarget[dayEl] === selfEl) return 1;   // 日が自分を剋す：要注意
  return 3;
}
function shichuMeishiki(birth) {
  if (!birth) return null;
  const [y, m, d] = birth.split('-').map(Number);
  const dateObj = new Date(y, m - 1, d);
  const { tg } = ganzhiOf(dateObj);
  const kan = TIANGAN[tg];
  const el = GOGYO_OF_KAN[kan];
  return { kan, element: el, ...NISSHU_DESC[kan] };
}

// 西洋占星術：太陽星座
const ZODIAC = [
  [1, 20, '山羊座', '責任感が強く努力家。着実に成果を積み上げる堅実さが魅力です。'],
  [2, 19, '水瓶座', '独創的で自由な発想の持ち主。人と違う視点から新しい価値を生みます。'],
  [3, 21, '魚座', '感受性が豊かで優しい人。想像力と共感力で人の心に寄り添います。'],
  [4, 20, '牡羊座', '情熱的で行動力抜群。まっさきに飛び込む勇気を持っています。'],
  [5, 21, '牡牛座', 'マイペースで粘り強い人。美しいものと豊かさを大切にします。'],
  [6, 22, '双子座', '好奇心旺盛で機転が利く人。軽やかに情報と人をつなぎます。'],
  [7, 23, '蟹座', '面倒見がよく情に厚い人。身近な人を守る温かさを持ちます。'],
  [8, 23, '獅子座', '華やかで堂々とした人。周囲を惹きつける存在感とリーダー性があります。'],
  [9, 23, '乙女座', '几帳面で分析力に優れた人。細やかな気配りで信頼を集めます。'],
  [10, 24, '天秤座', 'バランス感覚に優れた人。調和を大切にし、洗練された美意識を持ちます。'],
  [11, 23, '蠍座', '一途で情熱を内に秘めた人。深い集中力で物事を極めます。'],
  [12, 22, '射手座', '自由と冒険を愛する人。おおらかで前向き、視野が広いのが魅力です。'],
];
function sunSign(birth) {
  if (!birth) return null;
  const [, m, d] = birth.split('-').map(Number);
  for (const [mm, dd, name, text] of ZODIAC) {
    if (m < mm || (m === mm && d < dd)) return { name, text };
  }
  return { name: '山羊座', text: ZODIAC[0][3] };
}

// 数秘術：ライフパスナンバー
const LIFEPATH_DESC = {
  1: 'リーダーの数。独立心と開拓精神にあふれ、道を切り開く力を持ちます。',
  2: '調和の数。協調性と繊細さで、人と人をつなぐ役割を果たします。',
  3: '創造の数。明るく表現力豊かで、楽しさを生み出す才能があります。',
  4: '安定の数。堅実で誠実、こつこつと土台を築いていく力を持ちます。',
  5: '自由の数。好奇心旺盛で変化を楽しみ、行動力にあふれています。',
  6: '愛の数。面倒見がよく、周囲を支え癒やす存在です。',
  7: '探究の数。深く物事を見つめる思索家で、独自の世界を持ちます。',
  8: '豊かさの数。現実的で野心的、財と成功を引き寄せる力を持ちます。',
  9: '博愛の数。広い視野と思いやりで、人のために力を尽くします。',
  11: '直感の数。鋭い感性とひらめきを持つ、特別な導き手です。',
  22: '実現の数。大きな夢を現実に変える、稀有なスケールを持ちます。',
  33: '無償の愛の数。深い慈愛で多くの人を包む、まれな魂の持ち主です。',
};
function reduceNumber(n) {
  while (n > 9 && n !== 11 && n !== 22 && n !== 33) {
    n = String(n).split('').reduce((a, c) => a + Number(c), 0);
  }
  return n;
}
function lifePathNumber(birth) {
  if (!birth) return null;
  const digits = birth.replace(/-/g, '').split('').map(Number);
  const num = reduceNumber(digits.reduce((a, b) => a + b, 0));
  return { number: num, text: LIFEPATH_DESC[num] || '' };
}

// 3占術を統合した金運寄りの総合診断
function tripleDivination(birth) {
  const shichu = shichuMeishiki(birth);
  const sign = sunSign(birth);
  const life = lifePathNumber(birth);
  return { shichu, sign, life };
}

// ===== プレミアム: 四柱推命・西洋占星術・数秘術から実際に数字を導き出す =====
function divinationNumberSets(game, birth, count) {
  const div = tripleDivination(birth);
  if (!div.shichu || !div.sign || !div.life) return [];
  const kanIndex = TIANGAN.indexOf(div.shichu.kan); // 四柱推命: 日主(0-9)
  const signIndex = ZODIAC.findIndex((z) => z[2] === div.sign.name); // 西洋占星術: 星座(0-11)
  const lifeNum = div.life.number; // 数秘術: ライフパスナンバー
  const seedBase = birth + '-' + kanIndex + '-' + signIndex + '-' + lifeNum;

  if (game.digits) {
    const results = [];
    for (let c = 0; c < count; c++) {
      const rand = seededRandom(hashSeed(seedBase + ':' + c));
      const anchors = [kanIndex % 10, signIndex % 10, lifeNum % 10];
      let s = '';
      for (let d = 0; d < game.digits; d++) {
        s += (c === 0 && d < anchors.length) ? anchors[d] : Math.floor(rand() * 10);
      }
      results.push({ str: s, sources: ['四柱推命(日主)', '西洋占星術(星座)', '数秘術(LP)'] });
    }
    return results;
  }

  const range = game.max - game.min + 1;
  const results = [];
  for (let c = 0; c < count; c++) {
    const rand = seededRandom(hashSeed(seedBase + ':' + c));
    const nums = new Set();
    const anchors = [
      game.min + ((kanIndex * 7 + c * 3) % range),
      game.min + ((signIndex * 11 + c * 5) % range),
      game.min + ((lifeNum * 13 + c * 2) % range),
    ];
    anchors.forEach((a) => { if (nums.size < game.pick) nums.add(a); });
    let guard = 0;
    while (nums.size < game.pick && guard < 200) { nums.add(Math.floor(rand() * range) + game.min); guard++; }
    results.push({ combo: Array.from(nums).sort((a, b) => a - b), anchors });
  }
  return results;
}

// ===== 表示ユーティリティ =====
function nextDrawInfo(gameKey) {
  const now = new Date();
  const dow = now.getDay(); // 0=日
  const schedule = {
    loto6: [1, 4], loto7: [5], miniloto: [2], bingo5: [3], numbers3: [0,1,2,3,4,5,6], numbers4: [0,1,2,3,4,5,6],
  }[gameKey] || [1];
  for (let add = 0; add < 14; add++) {
    const d = new Date(now); d.setDate(now.getDate() + add);
    if (schedule.includes(d.getDay())) return d;
  }
  return now;
}
function fmtDate(d) {
  return `${d.getMonth() + 1}月${d.getDate()}日(${['日','月','火','水','木','金','土'][d.getDay()]})`;
}

// ===== 占いページ(独立ページ) =====
function FortunePage(props) {
  const {
    fortuneName, setFortuneName, fortuneBirth, setFortuneBirth,
    fortuneGameKey, setFortuneGameKey, fortuneResult, handleGenFortune, premiumPreview,
    monthlyFortune, calMonth, setCalMonth, handleGenMonthlyFortune,
    selectedFortuneDay, setSelectedFortuneDay,
  } = props;
  const fGame = GAMES[fortuneGameKey] || GAMES['loto6'];
  const [divResult, setDivResult] = useState([]);
  const handleGenDivination = () => {
    if (!fortuneBirth) return;
    setDivResult(divinationNumberSets(fGame, fortuneBirth, 3));
  };

  return (
    <div className="fortune-cosmic-page" style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: 16 }}>
      <CosmicBackground starCount={50} />
      <StarRain count={20} />
      <div className="kl-hero" style={{ position: 'relative', zIndex: 1 }}>
        <div>
          <div className="kl-hero-label">占い・金運カレンダー</div>
          <div className="kl-hero-date" style={{ fontSize: 15 }}>お名前と生年月日から、今日の一口と今月の金運を占います</div>
        </div>
        <div className="kl-rokuyo-chip" style={{ background: '#8B6FD9' }}>エンタメ機能</div>
      </div>

      <div className="kl-card" style={{ position: 'relative', zIndex: 1 }}>
        <div>
          <div className="kl-card-title" style={{ marginBottom: 10 }}>
            今日の一口占い
            <span className="kl-badge kl-badge-fun" style={{ marginLeft: 8 }}>エンタメ</span>
          </div>
          <div className="kl-card-desc">統計的な根拠はなく、あくまで楽しむための機能です。占う対象のくじを選んでください。</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: 180 }}>
              <div style={{ display: 'flex', gap: 8, marginBottom: 10, flexWrap: 'wrap' }}>
                <input className="kl-input" style={{ width: 140 }} placeholder="お名前（任意）" value={fortuneName} onChange={(e) => setFortuneName(e.target.value)} />
                <input className="kl-input" style={{ width: 150 }} type="date" value={fortuneBirth} onChange={(e) => setFortuneBirth(e.target.value)} />
                <select className="kl-input" style={{ width: 140 }} value={fortuneGameKey} onChange={(e) => setFortuneGameKey(e.target.value)}>
                  {GAME_ORDER.map((k) => <option key={k} value={k}>{GAMES[k].label}</option>)}
                </select>
              </div>
              <button className="kl-btn" onClick={handleGenFortune} style={{ background: 'linear-gradient(135deg, #8B6FD9, #5B4A8C)' }}>🔮 今日の一口を占う 🔮</button>
              {fortuneResult.length > 0 && (
                <div style={{ marginTop: 14 }}>
                  {fortuneResult.map((s, i) => (
                    <div key={i} className="kl-numrow">
                      {fGame.digits
                        ? <span className="kl-digitchip" style={{ background: 'radial-gradient(circle at 40% 25%, #EDE4FF, #8B6FD9)', color: '#FFF' }}>{s}</span>
                        : <>{s.map((n) => <span key={n} className="kl-chip" style={{ background: 'radial-gradient(circle at 35% 28%, #EDE4FF, #8B6FD9 72%, #5B4A8C)', color: '#FFFFFF', border: '1.5px solid #C9A8FF' }}>{n}</span>)}</>}
                    </div>
                  ))}
                  {!premiumPreview && (
                    <div className="kl-lock-overlay"><span>無料版は1口のみ。プレミアムで最大5口占えます。</span></div>
                  )}
                </div>
              )}
            </div>
            <div style={{ flexShrink: 0 }}>
              <OwlFortuneTeller size={80} />
            </div>
          </div>
        </div>
      </div>

      <div className="kl-card" style={{ position: 'relative', zIndex: 1 }}>
        <div className="kl-card-title" style={{ marginBottom: 4 }}>
          生年月日で占う本格診断
          {premiumPreview
            ? <span className="kl-badge kl-badge-premium" style={{ marginLeft: 8 }}>プレミアム</span>
            : <span className="kl-badge kl-badge-soon" style={{ marginLeft: 8 }}>プレミアム限定</span>}
        </div>
        <div className="kl-card-desc">
          四柱推命・西洋占星術・数秘術の3つの観点から、あなたの本質を占います。生年月日を入力してください。
        </div>
        {!premiumPreview && (
          <div className="kl-lock-overlay">
            <span>本格診断はプレミアム限定です。画面右上のスイッチでプレビューできます。</span>
          </div>
        )}
        {premiumPreview && !fortuneBirth && (
          <div style={{ fontSize: 12.5, color: 'var(--muted)', padding: '10px 0' }}>
            上の「今日の一口占い」で生年月日を入力すると、ここに診断結果が表示されます。
          </div>
        )}
        {premiumPreview && fortuneBirth && (() => {
          const div = tripleDivination(fortuneBirth);
          const cards = [
            div.shichu && {
              key: 'shichu', tag: '四柱推命', c: '#1F6F5C',
              title: `日主・${div.shichu.kan}（${div.shichu.element}）— ${div.shichu.type}`,
              text: div.shichu.text,
            },
            div.sign && {
              key: 'sign', tag: '西洋占星術', c: '#3A5C8C',
              title: `太陽星座・${div.sign.name}`,
              text: div.sign.text,
            },
            div.life && {
              key: 'life', tag: '数秘術', c: '#8C5A1F',
              title: `ライフパスナンバー・${div.life.number}`,
              text: div.life.text,
            },
          ].filter(Boolean);
          return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 6 }}>
              {cards.map((c) => (
                <div key={c.key} style={{ borderLeft: `3px solid ${c.c}`, background: 'var(--surface-alt)', borderRadius: '0 6px 6px 0', padding: '10px 14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <span style={{ fontSize: 10, fontWeight: 700, color: 'white', background: c.c, padding: '2px 8px', borderRadius: 4 }}>{c.tag}</span>
                    <b style={{ fontSize: 13.5 }}>{c.title}</b>
                  </div>
                  <div style={{ fontSize: 12.5, lineHeight: 1.8, color: 'var(--ink)' }}>{c.text}</div>
                </div>
              ))}
              <div style={{ fontSize: 11, color: 'var(--muted)', lineHeight: 1.7 }}>
                四柱推命の日主・西洋占星術の太陽星座・数秘術のライフパスナンバーは、いずれも生年月日から古典的な方法で算出しています。占い結果の解釈はエンタメとしてお楽しみください。
              </div>
            </div>
          );
        })()}
      </div>

      <div className="kl-card" style={{ position: 'relative', zIndex: 1 }}>
        <div className="kl-card-title" style={{ marginBottom: 4 }}>
          三占術で一口占う
          {premiumPreview
            ? <span className="kl-badge kl-badge-premium" style={{ marginLeft: 8 }}>プレミアム</span>
            : <span className="kl-badge kl-badge-soon" style={{ marginLeft: 8 }}>プレミアム限定</span>}
        </div>
        <div className="kl-card-desc">
          四柱推命の日主・西洋占星術の太陽星座・数秘術のライフパスナンバー、3つの観点から実際に数字を導き出します。占い師フクロウが水晶玉を覗いて一口占います。
        </div>
        {!premiumPreview && (
          <div className="kl-lock-overlay">
            <span>三占術による一口占いはプレミアム限定です。画面右上のスイッチでプレビューできます。</span>
          </div>
        )}
        {premiumPreview && !fortuneBirth && (
          <div style={{ fontSize: 12.5, color: '#C9BEEA', padding: '10px 0' }}>
            上で生年月日を入力すると、占い師フクロウが数字を占います。
          </div>
        )}
        {premiumPreview && fortuneBirth && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: 180 }}>
              <button className="kl-btn" style={{ background: 'linear-gradient(135deg, #8B6FD9, #5B4A8C)' }} onClick={handleGenDivination}>
                🔮 三占術で占う 🔮
              </button>
              {divResult.length > 0 && (
                <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {divResult.map((r, i) => (
                    <div key={i} className="kl-numrow" style={{ marginBottom: 0 }}>
                      {fGame.digits
                        ? <span className="kl-digitchip" style={{ background: 'radial-gradient(circle at 40% 25%, #EDE4FF, #8B6FD9)', color: '#FFF' }}>{r.str}</span>
                        : r.combo.map((n) => (
                            <span key={n} className="kl-chip" style={{ background: 'radial-gradient(circle at 35% 28%, #EDE4FF, #8B6FD9 72%, #5B4A8C)', color: '#FFF', border: '1.5px solid #C9A8FF' }}>{n}</span>
                          ))}
                    </div>
                  ))}
                  <div style={{ fontSize: 11, color: '#C9BEEA', lineHeight: 1.7, marginTop: 4 }}>
                    各セットの数字には、日主・星座・ライフパスナンバーから導いた数字が軸として含まれています。統計的な根拠はなく、エンタメとしてお楽しみください。
                  </div>
                </div>
              )}
            </div>
            <div style={{ flexShrink: 0 }}>
              <OwlFortuneTeller size={92} />
            </div>
          </div>
        )}
      </div>

      <div className="kl-card" style={{ position: 'relative', zIndex: 1 }}>
        <div className="kl-card-title" style={{ marginBottom: 4 }}>
          月間金運チャート
          {premiumPreview
            ? <span className="kl-badge kl-badge-premium" style={{ marginLeft: 8 }}>プレミアム</span>
            : <span className="kl-badge kl-badge-soon" style={{ marginLeft: 8 }}>プレミアム限定</span>}
        </div>
        <div className="kl-card-desc">今月の金運の上がり下がりをグラフで占い、気になる日をタップすると詳しい運勢が読めます。</div>

        {!premiumPreview && (
          <div className="kl-lock-overlay">
            <span>月間金運チャートはプレミアム限定です。画面右上のスイッチでプレビューできます。</span>
          </div>
        )}

        {premiumPreview && (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '10px 0' }}>
              <button className="kl-btn-ghost" onClick={() => setCalMonth((c) => c.m === 0 ? { y: c.y - 1, m: 11 } : { y: c.y, m: c.m - 1 })}>◀ 前月</button>
              <div className="kl-display" style={{ fontSize: 15 }}>{calMonth.y}年{calMonth.m + 1}月</div>
              <button className="kl-btn-ghost" onClick={() => setCalMonth((c) => c.m === 11 ? { y: c.y + 1, m: 0 } : { y: c.y, m: c.m + 1 })}>次月 ▶</button>
            </div>
            <button className="kl-btn-ghost" onClick={handleGenMonthlyFortune}>この月の金運チャートを占う</button>

            {monthlyFortune && monthlyFortune.year === calMonth.y && monthlyFortune.month === calMonth.m && (
              <div style={{ marginTop: 16 }}>
                <div style={{ height: 220 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyFortune.days} margin={{ top: 4, right: 4, left: -18, bottom: 0 }}>
                      <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#647065' }} interval={monthlyFortune.days.length > 20 ? 1 : 0} />
                      <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: '#647065' }} />
                      <Tooltip
                        formatter={(v) => [v, '金運スコア']}
                        labelFormatter={(l) => `${monthlyFortune.month + 1}月${l}日`}
                        contentStyle={{ fontSize: 12, borderRadius: 6 }}
                      />
                      <Bar dataKey="score" radius={[3, 3, 0, 0]} onClick={(data) => setSelectedFortuneDay(data.day)} cursor="pointer">
                        {monthlyFortune.days.map((d, i) => (
                          <Cell key={i} fill={fortuneTier(d.score).c} opacity={selectedFortuneDay === d.day ? 1 : 0.75} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div style={{ display: 'flex', gap: 10, fontSize: 11, color: 'var(--muted)', marginTop: 6, flexWrap: 'wrap' }}>
                  {['絶好調', '好調', '普通', 'やや注意', '要注意'].map((label) => (
                    <span key={label}><span className="kl-legend-dot" style={{ background: fortuneTier(label === '絶好調' ? 90 : label === '好調' ? 70 : label === '普通' ? 50 : label === 'やや注意' ? 25 : 10).c }}></span>{label}</span>
                  ))}
                </div>
                {selectedFortuneDay && (() => {
                  const dayData = monthlyFortune.days.find((d) => d.day === selectedFortuneDay);
                  const tier = fortuneTier(dayData.score);
                  const dateObj = new Date(monthlyFortune.year, monthlyFortune.month, selectedFortuneDay);
                  const { note } = calendarLuckBonus(dateObj);
                  const text = dayFortuneText(monthlyFortune.seed, selectedFortuneDay, tier, note);
                  const roku = rokuyoOf(dateObj);
                  return (
                    <div style={{ marginTop: 14, padding: '16px 18px', background: '#EFE4F3', borderRadius: 8 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                        <b style={{ fontSize: 15 }}>{monthlyFortune.month + 1}月{selectedFortuneDay}日の金運</b>
                        <span style={{ fontSize: 12, fontWeight: 700, color: tier.c, background: 'white', padding: '3px 10px', borderRadius: 10 }}>
                          {tier.label}（{dayData.score}点）
                        </span>
                      </div>
                      <div style={{ fontSize: 13.5, lineHeight: 1.9, color: 'var(--ink)' }}>{text}</div>
                      {(roku || note) && (
                        <div style={{ fontSize: 11.5, color: 'var(--muted)', marginTop: 8 }}>
                          暦の参考情報：{[roku, note].filter(Boolean).join('・')}
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>
            )}
          </>
        )}
      </div>

      <div className="kl-footer-note" style={{ position: 'relative', zIndex: 1 }}>
        占いは統計的な根拠のないエンタメ機能です。購入は無理のない範囲でお楽しみください。
      </div>
    </div>
  );
}

// ===== メインアプリ =====
export default function KujiLabApp() {
  const [gameKey, setGameKey] = useState('loto6');
  const [view, setView] = useState('predict'); // predict | calendar
  const [premiumPreview, setPremiumPreview] = useState(false);
  const [weights, setWeights] = useState({ prior: 0.1, mk: 0.2, ema: 0.2, cop: 0.5 });
  const [sumRange, setSumRange] = useState([100, 165]);
  const [statSets, setStatSets] = useState([]);
  const [balSets, setBalSets] = useState([]);
  const [fortuneName, setFortuneName] = useState('');
  const [fortuneBirth, setFortuneBirth] = useState('');
  const [fortuneGameKey, setFortuneGameKey] = useState('loto6');
  const [fortuneResult, setFortuneResult] = useState([]);
  const [monthlyFortune, setMonthlyFortune] = useState(null); // { seed, year, month, days:[{day,score}] }
  const [selectedFortuneDay, setSelectedFortuneDay] = useState(null);
  const [calMonth, setCalMonth] = useState(() => { const d = new Date(); return { y: d.getFullYear(), m: d.getMonth() }; });
  const [gameData, setGameData] = useState(null);
  const [gameDataError, setGameDataError] = useState(null);
  useEffect(() => {
    let cancelled = false;
    const files = ['loto6', 'loto7', 'miniloto', 'bingo5', 'numbers3', 'numbers4'];
    Promise.all(files.map((f) => fetch(`/data/${f}.json`).then((r) => {
      if (!r.ok) throw new Error(`${f}.json の取得に失敗しました (status ${r.status})`);
      return r.json();
    })))
      .then((results) => {
        if (cancelled) return;
        const obj = {};
        files.forEach((f, i) => { obj[f] = results[i]; });
        setGameData(obj);
      })
      .catch((err) => {
        if (cancelled) return;
        setGameDataError(err.message || String(err));
      });
    return () => { cancelled = true; };
  }, []);
  const [history, setHistory] = useState([]);
  const [historyLoaded, setHistoryLoaded] = useState(false);
  const [roundLabel, setRoundLabel] = useState('');
  const [checkTarget, setCheckTarget] = useState(null);
  const [actualInput, setActualInput] = useState('');
  const [msg, setMsg] = useState('');

  const game = GAMES[gameKey] || GAMES['loto6'];

  // ゲームごとの実データ(数字選択式)
  const data = useMemo(() => {
    if (!gameData) return null;
    switch (gameKey) {
      case 'loto6': return gameData.loto6;
      case 'loto7': return gameData.loto7;
      case 'miniloto': return gameData.miniloto;
      case 'bingo5': return gameData.bingo5;
      default: return null; // numbers3/4/fortune
    }
  }, [gameKey, gameData]);
  // ゲームごとの実データ(ナンバーズ系)
  const digitData = useMemo(() => {
    if (!gameData) return null;
    if (gameKey === 'numbers3') return gameData.numbers3;
    if (gameKey === 'numbers4') return gameData.numbers4;
    return null;
  }, [gameKey, gameData]);

  const model = useMemo(() => (data ? buildModel(data, game) : null), [data, game]);
  const digitModel = useMemo(() => (digitData ? buildDigitModel(digitData, game.digits) : null), [digitData, game]);
  const latest = data ? data[data.length - 1] : null;
  const latestSet = useMemo(() => (latest ? new Set(latest.slice(1, 1 + game.pick)) : new Set()), [latest, game]);
  const scores = useMemo(() => (model ? scoreAllPick(model, latestSet, weights) : null), [model, latestSet, weights]);
  const tripleCounter = useMemo(() => (data ? buildTripleCounter(data, game.pick) : null), [data, game]);
  const [backtestResult, setBacktestResult] = useState(null);
  const [backtestRunning, setBacktestRunning] = useState(false);
  const [statBoxOpen, setStatBoxOpen] = useState(false);
  const [balBoxOpen, setBalBoxOpen] = useState(false);

  // ゲームを切り替えたら合計値レンジをそのゲームの理論値に合わせ直す
  useEffect(() => {
    if (!game.digits) {
      const info = theoreticalSumRange(game.min, game.max, game.pick, 0.8);
      if (info) setSumRange([info.min, info.max]);
    }
  }, [gameKey]);

  useEffect(() => {
    (async () => {
      try {
        const res = await window.storage.list('kujilab:');
        if (res && res.keys) {
          const items = [];
          for (const k of res.keys) {
            try {
              const v = await window.storage.get(k.key || k, false);
              if (v && v.value) items.push(JSON.parse(v.value));
            } catch (e) {}
          }
          items.sort((a, b) => (b.ts || 0) - (a.ts || 0));
          setHistory(items);
        }
      } catch (e) {}
      setHistoryLoaded(true);
    })();
  }, []);

  const handleGenStat = useCallback(() => {
    setStatBoxOpen(false);
    setBacktestResult(null);
    if (game.digits) {
      if (!digitModel) return;
      const count = premiumPreview ? 8 : 2;
      const result = generateDigitStatSets(digitModel, count);
      setStatSets(result.map((r) => ({ str: r.str })));
    } else {
      if (!model || !scores) return;
      const opts = { sumMin: sumRange[0], sumMax: sumRange[1], oddMin: 2, oddMax: 4, poolSize: premiumPreview ? 26 : 14, count: premiumPreview ? 8 : 2 };
      setStatSets(generatePickSets(model, scores, opts));
    }
    setTimeout(() => setStatBoxOpen(true), 60);
  }, [game, digitModel, model, scores, sumRange, premiumPreview]);

  const handleRunBacktest = useCallback(() => {
    if (!data) return;
    setBacktestRunning(true);
    setTimeout(() => {
      const trainEnd = data[Math.floor(data.length * 0.7)][0];
      const result = runLiveBacktest(data, trainEnd, weights, sumRange, game);
      setBacktestResult(result);
      setBacktestRunning(false);
    }, 30);
  }, [data, weights, sumRange, game]);

  const sumInfo = useMemo(() => (game.digits ? null : theoreticalSumRange(game.min, game.max, game.pick, 0.8)), [game]);

  const handleGenBalanced = useCallback(() => {
    const count = premiumPreview ? 8 : 2;
    setBalBoxOpen(false);
    if (game.digits) { setBalSets(generateDigitSets(game.digits, count)); }
    else if (premiumPreview) setBalSets(generateAnalyzedBalancedSets(game, count, sumInfo));
    else setBalSets(generateBalancedSets(game, count));
    setTimeout(() => setBalBoxOpen(true), 60);
  }, [game, premiumPreview, sumInfo]);

  const handleGenFortune = useCallback(() => {
    const count = premiumPreview ? 5 : 1;
    const fGame = GAMES[fortuneGameKey] || GAMES['loto6'];
    setFortuneResult(fortuneSets(fGame, fortuneName, fortuneBirth, count));
  }, [fortuneGameKey, fortuneName, fortuneBirth, premiumPreview]);

  const handleGenMonthlyFortune = useCallback(() => {
    const result = monthlyFortuneScores(fortuneName, fortuneBirth, calMonth.y, calMonth.m, calendarLuckBonus);
    setMonthlyFortune({ ...result, year: calMonth.y, month: calMonth.m });
    setSelectedFortuneDay(null);
  }, [fortuneName, fortuneBirth, calMonth]);

  const handleSaveHistory = useCallback(async (engine, sets) => {
    if (!roundLabel) { setMsg('回号を入力してください'); return; }
    const key = gameKey + ':' + roundLabel + ':' + engine;
    const record = { key, game: gameKey, round: roundLabel, engine, sets, actual: null, ts: Date.now() };
    try {
      await window.storage.set('kujilab:' + key, JSON.stringify(record), false);
      setHistory((h) => [record, ...h.filter((x) => x.key !== key)]);
      setMsg('記録しました');
    } catch (e) { setMsg('保存に失敗しました'); }
  }, [roundLabel, gameKey]);

  const handleCheckSave = useCallback(async () => {
    if (!checkTarget || !actualInput) return;
    let actual;
    if (GAMES[checkTarget.game].digits) {
      actual = actualInput.trim();
    } else {
      actual = actualInput.split(/[,、\s]+/).map((s) => Number(s.trim())).filter((n) => !isNaN(n));
    }
    const updated = { ...checkTarget, actual };
    try {
      await window.storage.set('kujilab:' + checkTarget.key, JSON.stringify(updated), false);
      setHistory((h) => h.map((x) => (x.key === checkTarget.key ? updated : x)));
      setCheckTarget(null); setActualInput(''); setMsg('結果を記録しました');
    } catch (e) { setMsg('保存に失敗しました'); }
  }, [checkTarget, actualInput]);

  const calDays = useMemo(() => {
    const { y, m } = calMonth;
    const first = new Date(y, m, 1);
    const startDow = first.getDay();
    const daysInMonth = new Date(y, m + 1, 0).getDate();
    const cells = [];
    for (let i = 0; i < startDow; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(y, m, d));
    return cells;
  }, [calMonth]);

  const nextDraw = nextDrawInfo(gameKey);
  const nextDrawRokuyo = rokuyoOf(nextDraw);

  if (gameDataError) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#FBE9B8', fontFamily: 'sans-serif', padding: 24, textAlign: 'center' }}>
        <div>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🦉💦</div>
          <div style={{ fontWeight: 700, marginBottom: 8 }}>データの読み込みに失敗しました</div>
          <div style={{ fontSize: 13, color: '#7A4A22' }}>{gameDataError}</div>
        </div>
      </div>
    );
  }
  if (!gameData) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#FBE9B8', fontFamily: 'sans-serif' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🦉</div>
          <div>データを読み込み中...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="kl-root">
      <KobanRain count={16} bgFixed />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700;900&family=Zen+Kaku+Gothic+New:wght@500;700;900&family=JetBrains+Mono:wght@500;700&display=swap');

        .kl-root {
          --bg: #FFF8EC;
          --surface: #FFFFFF;
          --surface-alt: #FBEFD6;
          --ink: #4A3218;
          --muted: #8A6A42;
          --line: #E8CE86;
          --brand: #C0392B;
          --brand-deep: #A82A1E;
          --gold: #C9A23C;
          --gold-bright: #F4D06F;
          --danger: #B85C3B;
          font-family: 'Noto Sans JP', sans-serif;
          background:
            radial-gradient(circle at 15% 8%, rgba(255,240,190,0.9), transparent 40%),
            radial-gradient(circle at 85% 20%, rgba(255,225,150,0.8), transparent 45%),
            linear-gradient(165deg, #FBE9B8 0%, #F5D98A 35%, #EFC96A 70%, #F3D488 100%);
          background-attachment: fixed;
          color: var(--ink);
          min-height: 100%;
          padding: 0 0 40px;
          box-sizing: border-box;
        }
        .kl-root * { box-sizing: border-box; }
        .kl-mono { font-family: 'JetBrains Mono', monospace; }
        .kl-display { font-family: 'Zen Kaku Gothic New', sans-serif; font-weight: 900; }

        .kl-header {
          position: relative;
          z-index: 2;
          background:
            linear-gradient(165deg, #D4453A 0%, #A82A1E 55%, #7A150E 100%);
          color: #FFF3D6;
          padding: 20px 20px 0;
          overflow: hidden;
          border-bottom: 3px solid #F4D06F;
          box-shadow: 0 4px 24px rgba(212,160,60,0.5);
        }
        .kl-header::before {
          content: ''; position: absolute; inset: 0;
          background:
            repeating-linear-gradient(45deg, transparent, transparent 13px, rgba(255,215,120,0.14) 13px, rgba(255,215,120,0.14) 15px),
            radial-gradient(circle at 50% 0%, rgba(255,220,130,0.35), transparent 60%);
          pointer-events: none;
        }
        .kl-header::after {
          content: ''; position: absolute; top: -40%; left: -60%; width: 70%; height: 200%;
          background: linear-gradient(100deg, transparent, rgba(255,240,190,0.5), transparent);
          transform: skewX(-18deg); animation: headerSheen 5s ease-in-out infinite; pointer-events: none;
        }
        @keyframes headerSheen { 0%,100% { left: -60%; } 42%,58% { left: 140%; } }
        .kl-header-inner { position: relative; z-index: 2; max-width: 920px; margin: 0 auto; }
        .kl-brand-row { display: flex; justify-content: space-between; align-items: flex-start; gap: 10px; }
        .kl-brand-left { display: flex; align-items: flex-start; gap: 8px; }
        .kl-eyebrow { display: inline-block; font-size: 9.5px; letter-spacing: 0.08em; color: #A82A1E; background: #FFE1A0; padding: 2px 10px; border-radius: 10px; margin-bottom: 4px; font-weight: 700; }
        .kl-title { font-family: 'Zen Kaku Gothic New', sans-serif; font-weight: 900; font-size: 26px; margin: 0; letter-spacing: 0.03em;
          background: linear-gradient(180deg, #FFFBE0 0%, #FFE9A8 45%, #F4D06F 100%);
          -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent;
          filter: drop-shadow(0 2px 1px #7A150E) drop-shadow(0 0 10px rgba(255,215,120,0.7));
          animation: titleGlow 3s ease-in-out infinite;
        }
        @keyframes titleGlow { 0%,100% { filter: drop-shadow(0 2px 1px #7A150E) drop-shadow(0 0 8px rgba(255,215,120,0.6)); } 50% { filter: drop-shadow(0 2px 1px #7A150E) drop-shadow(0 0 16px rgba(255,225,140,0.95)); } }
        .kl-sub { font-size: 11.5px; color: #FFE1AE; margin-top: 4px; font-weight: 500; }

        /* レオ */
        .leo-wrap { position: relative; animation: leoFloat 3.6s ease-in-out infinite; flex-shrink: 0; }
        @keyframes leoFloat { 0%,100% { transform: translateY(0) rotate(-2deg); } 50% { transform: translateY(-8px) rotate(2deg); } }
        .leo-svg { overflow: visible; filter: drop-shadow(0 8px 12px rgba(0,0,0,0.3)); }
        .leo-halo { animation: haloPulse 3s ease-in-out infinite; transform-origin: 65px 80px; }
        @keyframes haloPulse { 0%,100% { opacity: 0.6; transform: scale(1); } 50% { opacity: 1; transform: scale(1.08); } }
        .leo-pupil { animation: leoBlink 3.8s infinite; transform-origin: center; transform-box: fill-box; }
        @keyframes leoBlink { 0%,90%,100% { transform: scaleY(1); } 95% { transform: scaleY(0.15); } }
        .leo-shine { animation: shineWink 3.8s infinite; }
        @keyframes shineWink { 0%,90%,100% { opacity: 1; } 95% { opacity: 0; } }
        .leo-cheek { animation: cheekGlow 2.6s ease-in-out infinite; }
        @keyframes cheekGlow { 0%,100% { opacity: 0.55; } 50% { opacity: 0.85; } }
        .leo-cap { animation: leoTip 5s ease-in-out infinite; transform-origin: 65px 34px; }
        @keyframes leoTip { 0%,100% { transform: rotate(0deg); } 50% { transform: rotate(-7deg) translateY(-2px); } }
        .leo-tassel { animation: leoTassel 2.2s ease-in-out infinite; transform-origin: 100px 25px; }
        @keyframes leoTassel { 0%,100% { transform: rotate(0deg); } 50% { transform: rotate(22deg); } }
        .leo-wing-l { animation: wingL 2.6s ease-in-out infinite; transform-origin: 30px 80px; }
        .leo-wing-r { animation: wingR 2.6s ease-in-out infinite; transform-origin: 100px 80px; }
        @keyframes wingL { 0%,100% { transform: rotate(0deg); } 50% { transform: rotate(-16deg); } }
        @keyframes wingR { 0%,100% { transform: rotate(0deg); } 50% { transform: rotate(16deg); } }
        .spark { animation: sparkTwinkle 2.4s ease-in-out infinite; transform-origin: center; transform-box: fill-box; }
        .spark2 { animation-delay: 0.8s; } .spark3 { animation-delay: 1.5s; }
        @keyframes sparkTwinkle { 0%,100% { opacity: 0; transform: scale(0.4); } 50% { opacity: 1; transform: scale(1.1); } }

        /* 占い師フクロウ */
        .fo-pupil { animation: foPupilGaze 4s ease-in-out infinite; transform-origin: center; transform-box: fill-box; }
        @keyframes foPupilGaze { 0%,100% { transform: translateX(0); } 30% { transform: translateX(2px); } 60% { transform: translateX(-2px); } }
        .fo-hat { animation: foHatSway 3.6s ease-in-out infinite; transform-origin: 65px 34px; }
        @keyframes foHatSway { 0%,100% { transform: rotate(-2deg); } 50% { transform: rotate(2deg); } }
        .fo-orb { animation: foOrbGlow 2.2s ease-in-out infinite; }
        @keyframes foOrbGlow { 0%,100% { filter: brightness(1) drop-shadow(0 0 3px #C9A8FF); } 50% { filter: brightness(1.3) drop-shadow(0 0 10px #C9A8FF); } }
        .fo-orb-group { animation: foOrbFloat 3s ease-in-out infinite; }
        @keyframes foOrbFloat { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-3px); } }

        /* 宇宙背景 */
        .cosmic-bg { position: absolute; inset: 0; overflow: hidden; border-radius: inherit; background: radial-gradient(ellipse at 30% 20%, #2A2154 0%, #150F30 55%, #0A0620 100%); z-index: 0; }
        .cosmic-star { position: absolute; background: #FFFFFF; border-radius: 50%; animation: cosmicTwinkle ease-in-out infinite; }
        @keyframes cosmicTwinkle { 0%,100% { opacity: 0.2; } 50% { opacity: 1; } }
        .cosmic-nebula { position: absolute; border-radius: 50%; filter: blur(18px); opacity: 0.35; }
        .cosmic-nebula-1 { width: 140px; height: 100px; top: -20px; right: -30px; background: #8B5CF6; }
        .cosmic-nebula-2 { width: 120px; height: 90px; bottom: -30px; left: -20px; background: #4C6EF5; }

        /* 降る星 */
        .star-rain { position: absolute; inset: 0; overflow: hidden; pointer-events: none; z-index: 1; }
        .star-rain-item {
          position: absolute; top: -30px; color: #E8DAFF; opacity: 0;
          animation-name: starRainFall; animation-timing-function: linear; animation-iteration-count: infinite;
          filter: drop-shadow(0 0 4px rgba(201,168,255,0.8));
        }
        @keyframes starRainFall {
          0% { transform: translateY(0) rotate(0deg); opacity: 0; }
          10% { opacity: 0.9; }
          90% { opacity: 0.9; }
          100% { transform: translateY(420px) rotate(200deg); opacity: 0; }
        }

        /* 占いページ全体を宇宙テーマに統一 */
        .fortune-cosmic-page { position: relative; border-radius: 14px; overflow: hidden; }
        .fortune-cosmic-page .kl-card {
          background: rgba(30, 22, 58, 0.55); border-color: rgba(201,168,255,0.28);
          box-shadow: 0 3px 0 rgba(139,111,217,0.2), 0 6px 16px rgba(10,6,30,0.35);
        }
        .fortune-cosmic-page .kl-card::before { background: linear-gradient(90deg, transparent, #C9A8FF, #EDE4FF, #C9A8FF, transparent); }
        .fortune-cosmic-page .kl-card-title { color: #EDE4FF; }
        .fortune-cosmic-page .kl-card-desc { color: #C9BEEA; }
        .fortune-cosmic-page .kl-hero {
          background: rgba(30, 22, 58, 0.55); border-color: rgba(201,168,255,0.28);
          box-shadow: 0 3px 0 rgba(139,111,217,0.2), 0 6px 16px rgba(10,6,30,0.35);
        }
        .fortune-cosmic-page .kl-hero-label { color: #C9BEEA; }
        .fortune-cosmic-page .kl-hero-date { color: #EDE4FF; }
        .fortune-cosmic-page .kl-badge-soon { background: rgba(255,255,255,0.12); color: #C9BEEA; }
        .fortune-cosmic-page .kl-lock-overlay { background: rgba(255,255,255,0.08); color: #C9BEEA; }
        .fortune-cosmic-page .kl-input { background: rgba(20,15,40,0.5); border-color: rgba(201,168,255,0.3); color: #EDE4FF; }
        .fortune-cosmic-page .kl-btn-ghost { border-color: rgba(201,168,255,0.4); color: #C9BEEA; }
        .fortune-cosmic-page .kl-footer-note { color: #9C8FC2; border-top-color: rgba(201,168,255,0.2); }

        /* 小判・大判が降る背景 */
        .koban-rain { position: absolute; inset: 0; overflow: hidden; pointer-events: none; z-index: 1; }
        .koban-rain.bg-fixed { position: fixed; z-index: 0; opacity: 0.5; }
        .koban, .oban {
          position: absolute; top: -36px;
          animation-name: kobanFall; animation-timing-function: linear; animation-iteration-count: infinite;
        }
        .koban { width: 30px; height: 19px; }
        .oban { width: 34px; height: 46px; }
        .koban-face {
          display: flex; align-items: center; justify-content: center; width: 30px; height: 19px;
          font-size: 8px; font-weight: 900; color: #7A5210; letter-spacing: -0.5px;
          background: radial-gradient(ellipse at 32% 26%, #FFF6CC, #F4D06F 45%, #D9AE47 72%, #B8862F);
          border-radius: 50%; border: 1.5px solid #FFF3C0;
          box-shadow: inset 0 1px 3px rgba(255,255,255,0.8), 0 0 8px rgba(255,215,120,0.7), 0 2px 5px rgba(120,80,20,0.35);
          transform: rotate(-8deg);
        }
        .oban-face {
          display: flex; align-items: center; justify-content: center; width: 34px; height: 46px;
          font-size: 11px; font-weight: 900; color: #6E4A16; letter-spacing: 1px; writing-mode: vertical-rl;
          background: radial-gradient(ellipse at 34% 22%, #FFFBDE, #F7DA82 38%, #E4B84E 68%, #C99A30);
          border-radius: 48% / 40%; border: 2px solid #FFF3C0;
          box-shadow: inset 0 2px 5px rgba(255,255,255,0.85), 0 0 18px rgba(255,215,120,0.9), 0 3px 8px rgba(120,80,20,0.4);
          transform: rotate(6deg);
        }
        @keyframes kobanFall {
          0% { transform: translateY(0) rotate(0deg); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(440px) rotate(260deg); opacity: 0; }
        }

        /* 背景に降る千両箱 */
        .fall-box { position: absolute; top: -40px; width: 28px; height: 22px; animation-name: kobanFall; animation-timing-function: linear; animation-iteration-count: infinite; }
        .mini-box { position: relative; display: block; width: 28px; height: 22px; }
        .mini-box-body { position: absolute; bottom: 0; width: 28px; height: 16px; display: flex; align-items: center; justify-content: center;
          font-size: 7px; font-weight: 900; color: #FFE9A8; background: linear-gradient(160deg, #8A5A28, #5E3A16); border: 1px solid #C99A4E; border-radius: 2px;
          box-shadow: inset 0 1px 2px rgba(255,220,150,0.3); }
        .mini-box-lid { position: absolute; top: 0; left: -1px; width: 30px; height: 8px; background: linear-gradient(160deg, #A06A34, #6E4420); border: 1px solid #C99A4E; border-radius: 3px 3px 0 0; }

        /* ===== 千両箱・数字排出演出 ===== */
        .treasure-box { position: relative; width: 300px; max-width: 100%; height: 190px; margin: 0 auto; }
        .tb-glow { position: absolute; bottom: 60px; left: 50%; transform: translateX(-50%); width: 200px; height: 110px; border-radius: 50%;
          background: radial-gradient(ellipse, rgba(255,220,120,0.85), rgba(255,215,120,0) 70%); opacity: 0; transition: opacity 0.4s; z-index: 1; }
        .treasure-box.open .tb-glow { opacity: 1; animation: glowPulse 1.6s ease-in-out infinite; }
        @keyframes glowPulse { 0%,100% { opacity: 0.6; } 50% { opacity: 1; } }

        .tb-base { position: absolute; bottom: 0; left: 50%; transform: translateX(-50%); width: 150px; height: 96px; z-index: 3; }
        .tb-front {
          position: absolute; bottom: 0; width: 150px; height: 74px; border-radius: 5px 5px 8px 8px;
          background: linear-gradient(165deg, #9A6632 0%, #7A4A22 55%, #5E3A16 100%);
          border: 2px solid #C99A4E; box-shadow: inset 0 2px 6px rgba(255,220,150,0.25), 0 6px 16px rgba(80,50,15,0.5);
          display: flex; align-items: center; justify-content: center; overflow: hidden;
        }
        .tb-label { font-family: 'Zen Kaku Gothic New', sans-serif; font-weight: 900; font-size: 20px; color: #FFE9A8;
          text-shadow: 0 1px 2px rgba(0,0,0,0.5); letter-spacing: 2px; z-index: 2; }
        .tb-band { position: absolute; top: 0; bottom: 0; width: 12px; background: linear-gradient(180deg, #D9AE47, #B8862F); border-left: 1px solid #F4D06F; border-right: 1px solid #8A6420; }
        .tb-band-1 { left: 26px; } .tb-band-2 { right: 26px; }
        .tb-lid {
          position: absolute; top: 0; left: -3px; width: 156px; height: 30px; border-radius: 6px 6px 3px 3px;
          background: linear-gradient(165deg, #A9743A 0%, #825024 55%, #6E4420 100%);
          border: 2px solid #C99A4E; transform-origin: bottom center; transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1); z-index: 2;
          box-shadow: inset 0 2px 4px rgba(255,220,150,0.3);
        }
        .treasure-box.open .tb-lid { transform: rotateX(-125deg); }
        .tb-lid-band { position: absolute; top: -2px; left: 50%; transform: translateX(-50%); width: 14px; height: calc(100% + 4px); background: linear-gradient(180deg, #D9AE47, #B8862F); border-left: 1px solid #F4D06F; border-right: 1px solid #8A6420; }
        .tb-lid-lock { position: absolute; bottom: -6px; left: 50%; transform: translateX(-50%); width: 16px; height: 12px; background: linear-gradient(160deg, #F4D06F, #C9A23C); border: 1px solid #8A6420; border-radius: 2px; }

        /* コインは箱の口の上に一列で飛び出す */
        .tb-coins { position: absolute; bottom: 74px; left: 0; right: 0; display: flex; flex-wrap: wrap; justify-content: center; gap: 6px; z-index: 5; padding: 0 8px; min-height: 44px; }
        .tb-coin {
          width: 42px; height: 42px; border-radius: 50%; display: flex; align-items: center; justify-content: center;
          font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: 16px; color: #7A5210;
          background: radial-gradient(circle at 35% 28%, #FFF6CC, #F4D06F 45%, #D9AE47 72%, #B8862F);
          border: 2px solid #FFF3C0; box-shadow: inset 0 1px 2px rgba(255,255,255,0.7), 0 0 12px rgba(255,215,120,0.9), 0 3px 6px rgba(120,80,20,0.35);
          opacity: 0; transform: translateY(60px) scale(0.2);
        }
        .tb-coin.pop { animation: coinPop 0.55s cubic-bezier(0.34, 1.8, 0.5, 1) forwards; }
        @keyframes coinPop {
          0% { opacity: 0; transform: translateY(60px) scale(0.2); }
          50% { opacity: 1; transform: translateY(-18px) scale(1.2); }
          75% { transform: translateY(4px) scale(0.96); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        .tb-sparkle { position: absolute; font-size: 14px; color: #FFE9A8; opacity: 0; z-index: 6; }
        .treasure-box.open .tb-sparkle { animation: tbSparkle 1.4s ease-out infinite; }

        /* 箱を開けた瞬間、箱の口が強く閃光する */
        .tb-flash {
          position: absolute; bottom: 66px; left: 50%; transform: translateX(-50%) scale(0.3); width: 130px; height: 90px; border-radius: 50%;
          background: radial-gradient(ellipse, rgba(255,255,255,0.95), rgba(255,230,160,0.8) 40%, rgba(255,215,120,0) 72%);
          opacity: 0; z-index: 4; pointer-events: none;
        }
        .treasure-box.open .tb-flash { animation: tbFlash 0.9s ease-out forwards; }
        @keyframes tbFlash {
          0% { opacity: 0; transform: translateX(-50%) scale(0.2); }
          25% { opacity: 1; transform: translateX(-50%) scale(1.3); }
          100% { opacity: 0; transform: translateX(-50%) scale(1.9); }
        }

        /* 箱が消えて数字のみ表示＋レオの驚喜リアクション */
        .tb-revealed { display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap; animation: revealFadeIn 0.5s ease; min-height: 100px; }
        @keyframes revealFadeIn { 0% { opacity: 0; transform: translateY(8px); } 100% { opacity: 1; transform: translateY(0); } }
        .tb-revealed-nums { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; }
        .tb-coin-final { opacity: 1; transform: none; position: static; animation: none; }

        .leo-jackpot { position: relative; flex-shrink: 0; width: 150px; height: 220px; }
        .lj-burst {
          position: absolute; top: 62%; left: 50%; transform: translate(-50%, -50%); width: 150px; height: 150px; z-index: 0;
          background:
            repeating-conic-gradient(from 0deg, rgba(255,225,140,0.6) 0deg 8deg, transparent 8deg 20deg);
          border-radius: 50%; animation: ljBurstSpin 6s linear infinite; opacity: 0.85;
        }
        .lj-burst2 {
          width: 180px; height: 180px; opacity: 0.4;
          background: repeating-conic-gradient(from 10deg, rgba(255,255,255,0.5) 0deg 4deg, transparent 4deg 16deg);
          animation: ljBurstSpin 9s linear infinite reverse;
        }
        @keyframes ljBurstSpin { 0% { transform: translate(-50%, -50%) rotate(0deg); } 100% { transform: translate(-50%, -50%) rotate(360deg); } }

        /* レインボー */
        .lj-rainbow-wrap { position: absolute; top: -6px; left: 50%; transform: translateX(-50%); width: 190px; height: 105px; z-index: 0; opacity: 0.92; }

        /* 札束ピラミッド(虹の下) */
        .lj-billpile { position: absolute; top: 66px; left: 50%; transform: translateX(-50%); z-index: 1; display: flex; flex-direction: column; align-items: center; gap: 2px; }
        .lj-bill-row { display: flex; justify-content: center; }
        .lj-bill-row .lj-bill { margin: 0 -5px; }
        .lj-bill {
          width: 32px; height: 18px; display: inline-block; position: relative; border-radius: 2px;
          background: linear-gradient(160deg, #EAF3D9 0%, #D3E8B8 55%, #BFDA9C 100%);
          border: 1.5px solid #8FAE68;
          box-shadow:
            0 2px 0 -1px #C7DDAA, 0 3px 0 -1px #8FAE68,
            0 5px 0 -2px #C7DDAA, 0 6px 0 -2px #8FAE68,
            0 2px 4px rgba(80,60,10,0.3);
          animation: ljBillSway 2.6s ease-in-out infinite;
        }
        .lj-bill::before {
          content: '万'; position: absolute; inset: 0; display: flex; align-items: center; justify-content: center;
          font-size: 8px; font-weight: 900; color: #5C7A3A; font-family: 'Zen Kaku Gothic New', sans-serif;
        }
        .lj-bill-row:nth-child(1) .lj-bill { animation-delay: 0.1s; }
        .lj-bill-row:nth-child(2) .lj-bill:nth-child(1) { animation-delay: 0.3s; }
        .lj-bill-row:nth-child(2) .lj-bill:nth-child(2) { animation-delay: 0.45s; }
        .lj-bill-row:nth-child(3) .lj-bill:nth-child(1) { animation-delay: 0.15s; }
        .lj-bill-row:nth-child(3) .lj-bill:nth-child(2) { animation-delay: 0.5s; }
        .lj-bill-row:nth-child(3) .lj-bill:nth-child(3) { animation-delay: 0.35s; }
        @keyframes ljBillSway { 0%,100% { transform: rotate(-2deg) translateY(0); } 50% { transform: rotate(2deg) translateY(-2px); } }

        .lj-rainbow { animation: ljRainbowFloat 3.2s ease-in-out infinite; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1)); }
        @keyframes ljRainbowFloat { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }

        .lj-sparkles { position: absolute; inset: 0; z-index: 1; pointer-events: none; }
        .lj-spk { position: absolute; font-size: 15px; animation: ljSpkTwinkle 1.6s ease-in-out infinite; }
        .lj-spk1 { top: 8%; left: 10%; animation-delay: 0s; }
        .lj-spk2 { top: 14%; right: 6%; animation-delay: 0.4s; }
        .lj-spk3 { bottom: 30%; left: 2%; animation-delay: 0.8s; }
        .lj-spk4 { bottom: 22%; right: 10%; animation-delay: 1.2s; }
        @keyframes ljSpkTwinkle { 0%,100% { opacity: 0.2; transform: scale(0.7) rotate(0deg); } 50% { opacity: 1; transform: scale(1.2) rotate(20deg); } }

        .lj-barpile { position: absolute; top: 22px; left: 50%; transform: translateX(-50%); z-index: 1; display: flex; flex-direction: column; align-items: center; gap: 2px; }
        .lj-bar-row { display: flex; justify-content: center; }
        .lj-bar-row .lj-bar { margin: 0 -3px; }
        .lj-bar {
          width: 38px; height: 20px; display: inline-block; position: relative;
          clip-path: polygon(12% 0%, 88% 0%, 100% 100%, 0% 100%);
          background: linear-gradient(160deg, #FFF3C4 0%, #F4D06F 35%, #D9AE47 70%, #B8862F 100%);
          box-shadow: inset 0 2px 3px rgba(255,255,255,0.7), inset 0 -3px 4px rgba(120,80,20,0.35), 0 3px 5px rgba(120,80,20,0.4);
          animation: ljBarShine 2.4s ease-in-out infinite;
        }
        .lj-bar::before {
          content: '金'; position: absolute; inset: 0; display: flex; align-items: center; justify-content: center;
          font-size: 9px; font-weight: 900; color: #8A5E10; font-family: 'Zen Kaku Gothic New', sans-serif; opacity: 0.75;
        }
        .lj-bar-row:nth-child(1) .lj-bar { animation-delay: 0.1s; }
        .lj-bar-row:nth-child(2) .lj-bar:nth-child(1) { animation-delay: 0.3s; }
        .lj-bar-row:nth-child(2) .lj-bar:nth-child(2) { animation-delay: 0.45s; }
        .lj-bar-row:nth-child(3) .lj-bar:nth-child(1) { animation-delay: 0.15s; }
        .lj-bar-row:nth-child(3) .lj-bar:nth-child(2) { animation-delay: 0.5s; }
        .lj-bar-row:nth-child(3) .lj-bar:nth-child(3) { animation-delay: 0.35s; }
        @keyframes ljBarShine { 0%,100% { filter: brightness(1); } 50% { filter: brightness(1.18); } }

        /* フクロウは下寄りの位置に固定 */
        .lj-owl-center { position: absolute; top: 68%; left: 50%; transform: translate(-50%, -50%); z-index: 2; }
        .lj-owl { animation: ljOwlJump 0.7s cubic-bezier(0.34,1.6,0.5,1) 1; }
        @keyframes ljOwlJump { 0% { transform: translateY(20px) scale(0.5); opacity: 0; } 60% { transform: translateY(-10px) scale(1.15); opacity: 1; } 100% { transform: translateY(0) scale(1); opacity: 1; } }

        .lj-bubble {
          position: absolute; bottom: 2px; left: 50%; transform: translateX(-50%); z-index: 2;
          background: linear-gradient(135deg, #FFFFFF, #FFF3CC); border: 2px solid #F4D06F; white-space: nowrap;
          border-radius: 14px; padding: 7px 14px; font-size: 12.5px; font-weight: 900; color: #A82A1E; text-align: center; line-height: 1.4;
          box-shadow: 0 4px 12px rgba(200,150,50,0.4); animation: ljBubblePop 0.4s ease 0.5s backwards;
        }
        @keyframes ljBubblePop { 0% { opacity: 0; transform: translateX(-50%) scale(0.6); } 100% { opacity: 1; transform: translateX(-50%) scale(1); } }

        /* ミニフクロウ部隊 */
        .mini-squad-owls { position: absolute; inset: 0; z-index: 2; }
        .mini-owl-slot {
          position: absolute; transform: translate(-50%, -50%);
          animation: miniOwlPop 0.55s cubic-bezier(0.34,1.7,0.5,1) backwards;
        }
        .mini-owl-slot:nth-child(1) { animation-delay: 0.05s; }
        .mini-owl-slot:nth-child(2) { animation-delay: 0.2s; }
        .mini-owl-slot:nth-child(3) { animation-delay: 0.35s; }
        .mini-owl-slot:nth-child(4) { animation-delay: 0.5s; }
        .mini-owl-slot:nth-child(5) { animation-delay: 0.65s; }
        @keyframes miniOwlPop { 0% { opacity: 0; transform: translate(-50%, -50%) scale(0.3); } 100% { opacity: 1; transform: translate(-50%, -50%) scale(1); } }
        .mini-squad-bubble { bottom: 0px; white-space: normal; width: 140px; }

        /* 驚いた表情用の動き */
        .leo-surprised .leo-halo { animation: haloPulse 0.8s ease-in-out infinite; }
        .leo-pupil-shock { animation: pupilShock 0.6s ease-in-out infinite; transform-origin: center; transform-box: fill-box; }
        @keyframes pupilShock { 0%,100% { transform: scale(1); } 50% { transform: scale(1.2); } }
        .leo-beak-open { animation: beakGasp 0.5s ease-in-out infinite; transform-origin: 65px 88px; transform-box: fill-box; }
        @keyframes beakGasp { 0%,100% { transform: scaleY(1); } 50% { transform: scaleY(1.18); } }
        .leo-wing-spread-l { animation: wingSpreadL 0.6s ease-in-out infinite; transform-origin: 30px 80px; }
        .leo-wing-spread-r { animation: wingSpreadR 0.6s ease-in-out infinite; transform-origin: 100px 80px; }
        @keyframes wingSpreadL { 0%,100% { transform: rotate(-68deg); } 50% { transform: rotate(-78deg); } }
        @keyframes wingSpreadR { 0%,100% { transform: rotate(68deg); } 50% { transform: rotate(78deg); } }
        .leo-shock-lines { animation: shockLinesFlicker 0.5s ease-in-out infinite; transform-origin: 65px 75px; transform-box: fill-box; }
        @keyframes shockLinesFlicker { 0%,100% { opacity: 0.4; } 50% { opacity: 1; } }

        .kl-premium-toggle {
          display: flex; align-items: center; gap: 8px; font-size: 11px; color: #FFE1AE;
        }
        .kl-switch {
          width: 34px; height: 19px; border-radius: 10px; background: rgba(255,255,255,0.25);
          position: relative; cursor: pointer; transition: background 0.2s; border: none;
        }
        .kl-switch.on { background: linear-gradient(135deg, #F4D06F, #C9A23C); }
        .kl-switch-knob {
          position: absolute; top: 2px; left: 2px; width: 15px; height: 15px; border-radius: 50%;
          background: white; transition: transform 0.2s;
        }
        .kl-switch.on .kl-switch-knob { transform: translateX(15px); }

        .kl-gametabs {
          position: relative; z-index: 2; display: flex; gap: 6px; overflow-x: auto; padding: 16px 0 0;
        }
        .kl-gametab {
          flex-shrink: 0; display: flex; flex-direction: column; align-items: center; gap: 3px;
          padding: 9px 14px; border-radius: 10px 10px 0 0; cursor: pointer; background: transparent;
          border: none; color: #FFD98A; font-size: 12px; font-weight: 700;
        }
        .kl-gametab.active { background: #FFFBEF; color: var(--brand); box-shadow: 0 -3px 14px rgba(255,205,90,0.7); }
        .kl-gametab-badge {
          width: 26px; height: 26px; border-radius: 7px; display: flex; align-items: center; justify-content: center;
          font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: 11px; color: white;
          box-shadow: inset 0 1px 2px rgba(255,255,255,0.3);
        }

        .kl-viewtabs { position: relative; z-index: 2; display: flex; gap: 16px; max-width: 920px; margin: 0 auto; padding: 14px 20px 0; }
        .kl-viewtab {
          background: none; border: none; font-size: 13px; color: var(--muted); cursor: pointer;
          padding: 6px 2px; border-bottom: 2px solid transparent; font-weight: 500;
        }
        .kl-viewtab.active { color: var(--brand); border-bottom-color: var(--brand); font-weight: 700; }

        .kl-content { position: relative; z-index: 2; max-width: 920px; margin: 0 auto; padding: 16px 20px 0; }

        .kl-hero {
          position: relative; overflow: hidden;
          background: linear-gradient(135deg, #FFFFFF 0%, #FFF6DC 55%, #FCEBBE 100%); border: 2px solid #EFC96A; border-radius: 14px;
          padding: 16px 18px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;
          flex-wrap: wrap; gap: 10px; box-shadow: 0 4px 0 #E4B84E, 0 8px 20px rgba(212,160,60,0.35);
        }
        .kl-hero::after {
          content: ''; position: absolute; top: 0; left: -70%; width: 45%; height: 100%;
          background: linear-gradient(100deg, transparent, rgba(255,240,190,0.55), transparent);
          transform: skewX(-20deg); animation: heroSheen 5.5s ease-in-out infinite; pointer-events: none;
        }
        @keyframes heroSheen { 0%,100% { left: -70%; } 48%,60% { left: 150%; } }
        .kl-hero-label { position: relative; z-index: 1; font-size: 11px; color: var(--muted); letter-spacing: 0.05em; }
        .kl-hero-date { position: relative; z-index: 1; font-size: 18px; font-weight: 700; margin-top: 2px; color: var(--ink); }
        .kl-rokuyo-chip {
          position: relative; z-index: 1; display: inline-flex; align-items: center; gap: 6px; padding: 6px 12px; border-radius: 20px;
          font-size: 13px; font-weight: 700; color: white; box-shadow: inset 0 1px 2px rgba(255,255,255,0.3), 0 2px 6px rgba(0,0,0,0.15);
        }

        /* レオ吉日吹き出し */
        .leo-kichi { display: flex; align-items: center; gap: 6px; margin-bottom: 16px; padding: 12px; border-radius: 16px; position: relative; overflow: hidden;
          background: linear-gradient(135deg, #FFFFFF, #FFF3CC); border: 2px solid #EFC96A; box-shadow: 0 4px 0 #E4B84E, 0 8px 18px rgba(212,160,60,0.3); }
        .leo-kichi-leo { flex-shrink: 0; z-index: 2; }
        .leo-kichi-bubble { position: relative; z-index: 2; flex: 1; background: #fff; border-radius: 14px; padding: 10px 12px; border: 1.5px solid #F4D06F; }
        .leo-kichi-bubble::before { content: ''; position: absolute; left: -8px; top: 26px; border-style: solid; border-width: 8px 8px 8px 0; border-color: transparent #fff transparent transparent; }
        .leo-kichi-date { font-size: 11px; color: #A88A5A; font-weight: 700; margin-bottom: 5px; }
        .leo-kichi-tags { display: flex; gap: 5px; flex-wrap: wrap; margin-bottom: 7px; }
        .leo-ktag { font-size: 10.5px; font-weight: 700; padding: 3px 9px; border-radius: 12px; color: #fff; box-shadow: inset 0 1px 1px rgba(255,255,255,0.3); }
        .leo-kichi-msg { font-size: 12.5px; line-height: 1.75; color: #4A3524; font-weight: 500; }

        .kl-engine-grid { display: grid; gap: 14px; }
        .kl-card {
          position: relative; overflow: hidden;
          background: linear-gradient(160deg, #FFFFFF 0%, #FFFBF0 100%); border: 1.5px solid #EFC96A; border-radius: 14px; padding: 18px 20px;
          box-shadow: 0 3px 0 rgba(228,184,78,0.4), 0 6px 16px rgba(200,150,50,0.15);
        }
        .kl-card::before {
          content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px;
          background: linear-gradient(90deg, transparent, #F4D06F, #FFEBA8, #F4D06F, transparent);
        }
        .kl-card-head { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 4px; }
        .kl-card-title { font-size: 15.5px; font-weight: 700; display: flex; align-items: center; gap: 8px; }
        .kl-badge {
          font-size: 10px; padding: 3px 8px; border-radius: 4px; font-weight: 700; letter-spacing: 0.03em;
        }
        .kl-badge-free { background: #FCE9CC; color: var(--brand-deep); }
        .kl-badge-premium { background: linear-gradient(135deg, #F7E3B8, #EFD08A); color: #8A6410; }
        .kl-badge-fun { background: #F7E4E0; color: #C0392B; }
        .kl-badge-soon { background: var(--surface-alt); color: var(--muted); }
        .kl-card-desc { font-size: 12.5px; color: var(--muted); line-height: 1.7; margin: 6px 0 14px; }

        .kl-numrow { display: flex; flex-wrap: wrap; gap: 6px; align-items: center; margin-bottom: 10px; }
        .kl-chip {
          width: 34px; height: 34px; border-radius: 50%; display: flex; align-items: center; justify-content: center;
          font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: 13px; color: #7A5210;
          background: radial-gradient(circle at 35% 28%, #FBE49A, #D9AE47 72%, #B8862F);
          border: 1.5px solid #FFF3D0; box-shadow: inset 0 1px 2px rgba(255,255,255,0.6), 0 3px 7px rgba(180,140,40,0.35);
        }
        .kl-digitchip {
          font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: 20px; letter-spacing: 0.15em; color: #7A5210;
          background: radial-gradient(circle at 40% 25%, #FBE49A, #E8C874); padding: 8px 14px; border-radius: 8px;
          border: 1.5px solid #FFF3D0; box-shadow: inset 0 1px 2px rgba(255,255,255,0.5);
        }
        .kl-sum { font-size: 11.5px; color: var(--muted); margin-left: 4px; }

        .kl-btn {
          position: relative; overflow: hidden;
          background: linear-gradient(135deg, #EF5B4C, #C0392B); color: white; border: none; border-radius: 9px; padding: 11px 20px;
          font-size: 13.5px; font-weight: 700; cursor: pointer; font-family: 'Noto Sans JP', sans-serif;
          box-shadow: 0 4px 0 #96271C, 0 6px 12px rgba(192,57,43,0.3);
        }
        .kl-btn::after {
          content: ''; position: absolute; top: 0; left: -80%; width: 50%; height: 100%;
          background: linear-gradient(100deg, transparent, rgba(255,255,255,0.4), transparent);
          transform: skewX(-20deg); animation: btnSheen 4.5s ease-in-out infinite;
        }
        @keyframes btnSheen { 0%,100% { left: -80%; } 50%,60% { left: 140%; } }
        .kl-btn:hover { filter: brightness(1.05); }
        .kl-btn:active { transform: translateY(2px); box-shadow: 0 2px 0 #96271C; }
        .kl-btn-ghost {
          background: transparent; border: 1px solid var(--line); color: var(--muted); border-radius: 6px;
          padding: 8px 14px; font-size: 12.5px; cursor: pointer;
        }
        .kl-btn-ghost:hover { border-color: var(--brand); color: var(--brand); }
        .kl-input {
          border: 1px solid var(--line); border-radius: 6px; padding: 8px 10px; font-size: 13px; width: 100%;
          font-family: 'Noto Sans JP', sans-serif;
        }
        .kl-lock-overlay {
          margin-top: 12px; padding: 12px 14px; background: var(--surface-alt); border-radius: 6px;
          font-size: 12px; color: var(--muted); display: flex; justify-content: space-between; align-items: center;
        }

        .kl-cal-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 4px; }
        .kl-cal-dow { font-size: 11px; color: var(--muted); text-align: center; padding: 4px 0; }
        .kl-cal-cell {
          aspect-ratio: 1; border-radius: 6px; display: flex; flex-direction: column; align-items: center;
          justify-content: center; font-size: 11px; gap: 2px; background: var(--surface-alt);
          padding: 2px; overflow: hidden; position: relative; min-width: 0;
        }
        .kl-cal-daynum { font-family: 'JetBrains Mono', monospace; font-size: 12px; font-weight: 700; }
        .kl-cal-roku {
          font-size: 9.5px; max-width: 100%; overflow: hidden; text-overflow: ellipsis;
          white-space: nowrap; text-align: center; padding: 0 1px;
        }

        .kl-legend { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 14px; font-size: 11px; color: var(--muted); }
        .kl-legend-dot { width: 8px; height: 8px; border-radius: 50%; display: inline-block; margin-right: 4px; }

        .kl-footer-note {
          text-align: center; font-size: 11px; color: var(--muted); margin-top: 28px; padding-top: 16px;
          border-top: 1px solid var(--line); line-height: 1.8;
        }
        details summary { cursor: pointer; }
        ::-webkit-scrollbar { height: 6px; width: 6px; }
        ::-webkit-scrollbar-thumb { background: var(--line); border-radius: 3px; }

        /* ===== スマホ縦画面向けの調整 ===== */
        @media (max-width: 480px) {
          .kl-header-inner, .kl-viewtabs, .kl-content { padding-left: 12px; padding-right: 12px; }
          .kl-brand-row { flex-wrap: wrap; }
          .kl-brand-left { min-width: 0; }
          .kl-title { font-size: 20px; }
          .kl-sub { font-size: 10.5px; }
          .kl-premium-toggle { font-size: 10px; }

          .kl-gametabs { gap: 3px; }
          .kl-gametab { padding: 7px 9px; font-size: 10.5px; }
          .kl-gametab-badge { width: 22px; height: 22px; font-size: 9.5px; }

          .kl-hero { padding: 12px 14px; gap: 6px; }
          .kl-hero-date { font-size: 15px; }
          .kl-rokuyo-chip { font-size: 11px; padding: 5px 9px; }

          .kl-card { padding: 14px 14px; }
          .kl-card-title { font-size: 14px; }

          .kl-cal-grid { gap: 2px; }
          .kl-cal-daynum { font-size: 10px; }
          .kl-cal-roku { font-size: 7.5px; }
          .kl-legend { font-size: 10px; gap: 7px; }

          .treasure-box { transform: scale(0.82); transform-origin: center top; margin-bottom: -30px; }
          .leo-jackpot { transform: scale(0.78); transform-origin: center top; }
          .leo-kichi-leo svg, .kl-brand-left svg { max-width: 100%; height: auto; }
        }
        @media (max-width: 360px) {
          .kl-cal-daynum { font-size: 9px; }
          .kl-cal-roku { font-size: 6.8px; }
          .kl-title { font-size: 18px; }
        }
      `}</style>

      <div className="kl-header">
        <KobanRain count={24} />
        <div className="kl-header-inner">
          <div className="kl-brand-row">
            <div className="kl-brand-left">
              <OwlLeo size={78} />
              <div>
                <div className="kl-eyebrow">開運くじ予想ラボ</div>
                <h1 className="kl-title kl-display">くじ解析ラボ</h1>
                <div className="kl-sub">データ分析と占いで、金運を彩る毎日を🦉</div>
              </div>
            </div>
            <div className="kl-premium-toggle">
              <span>プレビュー：{premiumPreview ? 'プレミアム' : '無料'}</span>
              <button className={'kl-switch' + (premiumPreview ? ' on' : '')} onClick={() => setPremiumPreview(!premiumPreview)}>
                <span className="kl-switch-knob"></span>
              </button>
            </div>
          </div>
          <div className="kl-gametabs">
            {GAME_ORDER.map((k) => (
              <button key={k} className={'kl-gametab' + (gameKey === k ? ' active' : '')} onClick={() => { setGameKey(k); setStatSets([]); setBalSets([]); setFortuneResult([]); }}>
                <span className="kl-gametab-badge" style={{ background: GAMES[k].color }}>{GAMES[k].short}</span>
                {GAMES[k].label}
              </button>
            ))}
            <button className={'kl-gametab' + (gameKey === 'fortune' ? ' active' : '')} onClick={() => setGameKey('fortune')}>
              <span className="kl-gametab-badge" style={{ background: '#7A4A9C' }}>🔮</span>
              占い
            </button>
          </div>
        </div>
      </div>

      {gameKey !== 'fortune' && (
      <div className="kl-viewtabs">
        <button className={'kl-viewtab' + (view === 'predict' ? ' active' : '')} onClick={() => setView('predict')}>予測エンジン</button>
        <button className={'kl-viewtab' + (view === 'calendar' ? ' active' : '')} onClick={() => setView('calendar')}>吉日カレンダー</button>
        <button className={'kl-viewtab' + (view === 'history' ? ' active' : '')} onClick={() => setView('history')}>記録</button>
      </div>
      )}

      <div className="kl-content">
        {gameKey === 'fortune' && (
          <FortunePage
            fortuneName={fortuneName} setFortuneName={setFortuneName}
            fortuneBirth={fortuneBirth} setFortuneBirth={setFortuneBirth}
            fortuneGameKey={fortuneGameKey} setFortuneGameKey={setFortuneGameKey}
            fortuneResult={fortuneResult} handleGenFortune={handleGenFortune}
            premiumPreview={premiumPreview}
            monthlyFortune={monthlyFortune} calMonth={calMonth} setCalMonth={setCalMonth}
            handleGenMonthlyFortune={handleGenMonthlyFortune}
            selectedFortuneDay={selectedFortuneDay} setSelectedFortuneDay={setSelectedFortuneDay}
          />
        )}
        {gameKey !== 'fortune' && view === 'predict' && (
          <>
            <div className="kl-hero">
              <div>
                <div className="kl-hero-label">次回抽せん・{game.label}（{game.draw}）</div>
                <div className="kl-hero-date">{fmtDate(nextDraw)}</div>
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {nextDrawRokuyo && (
                  <div className="kl-rokuyo-chip" style={{ background: ROKUYO_TONE[nextDrawRokuyo].c }}>
                    {nextDrawRokuyo} — {ROKUYO_TONE[nextDrawRokuyo].label}
                  </div>
                )}
                {kichijitsuOf(nextDraw).tags.map((t) => (
                  <div key={t.key} className="kl-rokuyo-chip" style={{ background: t.c }}>
                    {t.label}
                  </div>
                ))}
                {seasonalKichijitsuOf(nextDraw).map((t) => (
                  <div key={t.key} className="kl-rokuyo-chip" style={{ background: t.c }}>
                    {t.label}
                  </div>
                ))}
              </div>
            </div>

            <LeoKichiSpeech
              dateLabel={fmtDate(nextDraw)}
              tags={[
                ...(nextDrawRokuyo ? [{ key: 'roku', label: nextDrawRokuyo, c: ROKUYO_TONE[nextDrawRokuyo].c }] : []),
                ...kichijitsuOf(nextDraw).tags,
                ...seasonalKichijitsuOf(nextDraw),
              ]}
            />

            <LatestResultCheck data={data} digitData={digitData} game={game} gameKey={gameKey} />

            <div className="kl-engine-grid">
              {/* 統計解析エンジン */}
              <div className="kl-card">
                <div className="kl-card-head">
                  <div className="kl-card-title">
                    統計解析エンジン
                    <span className="kl-badge kl-badge-free">無料</span>
                    {premiumPreview && <span className="kl-badge kl-badge-premium">深掘り解析</span>}
                  </div>
                </div>
                <div className="kl-card-desc">
                  {game.digits
                    ? `過去${digitData ? digitData.length : 0}回の当せんデータをもとに、桁ごとの数字の出現頻度と直近の勢い（指数移動平均）を分析しています。`
                    : `過去${data ? data.length : 0}回の当せんデータをもとに、出現頻度・直近の勢い（指数移動平均）・前回との相関（マルコフ連鎖）・数字同士の相性（共起分析）を組み合わせて算出しています。${premiumPreview ? '　プレミアムでは候補プールを広げたうえで、今の設定を実データで再検証するライブバックテストと、3数字単位の相性を探すトリオ分析が使えます。' : ''}`}
                </div>

                {!game.digits && premiumPreview && (
                  <div style={{ display: 'flex', gap: 10, marginBottom: 12, flexWrap: 'wrap' }}>
                    <div>
                      <label style={{ fontSize: 11, color: 'var(--muted)' }}>合計値 最小</label>
                      <input className="kl-input" type="number" value={sumRange[0]} onChange={(e) => setSumRange([Number(e.target.value), sumRange[1]])} style={{ width: 90 }} />
                    </div>
                    <div>
                      <label style={{ fontSize: 11, color: 'var(--muted)' }}>合計値 最大</label>
                      <input className="kl-input" type="number" value={sumRange[1]} onChange={(e) => setSumRange([sumRange[0], Number(e.target.value)])} style={{ width: 90 }} />
                    </div>
                  </div>
                )}

                <button className="kl-btn" onClick={handleGenStat}>💰 千両箱を開けて解析する 💰</button>

                {/* ナンバーズ系: 桁チップ+ミニフクロウ部隊 */}
                {game.digits && statSets.length > 0 && (
                  <div style={{ marginTop: 14 }}>
                    {statSets.map((s, i) => (
                      <div key={i} className="kl-numrow">
                        <span className="kl-digitchip">{s.str}</span>
                      </div>
                    ))}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 10 }}>
                      <MiniOwlSquad count={game.jackpot.count} message={game.jackpot.message} />
                    </div>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 8 }}>
                      <input className="kl-input" style={{ width: 140 }} placeholder="回号を入力" value={roundLabel} onChange={(e) => setRoundLabel(e.target.value)} />
                      <button className="kl-btn-ghost" onClick={() => handleSaveHistory('統計解析', statSets.map((s) => s.str))}>記録する</button>
                    </div>
                    {!premiumPreview && (
                      <div className="kl-lock-overlay"><span>無料版は2セットまで。プレミアムで最大8セットになります。</span></div>
                    )}
                  </div>
                )}

                {/* 数字選択式: 千両箱演出+プレミアム深掘り分析 */}
                {!game.digits && statSets.length > 0 && (
                  <div style={{ marginTop: 14 }}>
                    {statSets.map((s, i) => (
                      <div key={i} style={{ marginBottom: 6 }}>
                        <TreasureBox
                          open={statBoxOpen} numbers={s.combo} delay={i * 400} showJackpot={i === 0}
                          jackpotAlign={game.jackpot.align}
                          jackpotContent={game.jackpot.count > 1
                            ? <MiniOwlSquad count={game.jackpot.count} message={game.jackpot.message} />
                            : <LeoJackpot message={game.jackpot.message} />}
                        />
                        <div style={{ textAlign: 'center', fontSize: 11.5, color: 'var(--muted)', marginTop: 2, marginBottom: 2 }}>
                          第{['一', '二', '三', '四', '五', '六', '七', '八'][i] || (i + 1)}の候補（合計{s.combo.reduce((a, b) => a + b, 0)}）
                        </div>
                      </div>
                    ))}
                    {game.jackpot.align === 'end' && (
                      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 10 }}>
                        {game.jackpot.count > 1
                          ? <MiniOwlSquad count={game.jackpot.count} message={game.jackpot.message} />
                          : <LeoJackpot message={game.jackpot.message} />}
                      </div>
                    )}
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 8 }}>
                      <input className="kl-input" style={{ width: 140 }} placeholder="回号を入力" value={roundLabel} onChange={(e) => setRoundLabel(e.target.value)} />
                      <button className="kl-btn-ghost" onClick={() => handleSaveHistory('統計解析', statSets.map((s) => s.combo))}>記録する</button>
                    </div>
                    {!premiumPreview && (
                      <div className="kl-lock-overlay">
                        <span>無料版は2セットまで・候補プール14個から選出。プレミアムでは候補プールが26個に広がり、最大8セット・条件カスタム・スコア内訳・ライブバックテスト・トリオ分析が解放されます。</span>
                      </div>
                    )}
                    {premiumPreview && model && scores && (
                      <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px dashed var(--line)' }}>
                        <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--gold)', marginBottom: 8 }}>スコア内訳（上位8数字）</div>
                        <div style={{ overflowX: 'auto' }}>
                          <table style={{ width: '100%', fontSize: 11, borderCollapse: 'collapse' }}>
                            <thead>
                              <tr style={{ color: 'var(--muted)', textAlign: 'left' }}>
                                <th style={{ padding: '3px 6px' }}>数字</th>
                                <th style={{ padding: '3px 6px' }}>長期出現率</th>
                                <th style={{ padding: '3px 6px' }}>直近の勢い</th>
                                <th style={{ padding: '3px 6px' }}>枯渇度</th>
                                <th style={{ padding: '3px 6px' }}>共起場</th>
                                <th style={{ padding: '3px 6px' }}>合計</th>
                              </tr>
                            </thead>
                            <tbody>
                              {Object.entries(scores).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([nStr]) => {
                                const n = Number(nStr);
                                const uniform = game.pick / (game.max - game.min + 1);
                                const prior = model.freq[n] / (model.total * game.pick);
                                const p11 = model.markov[n]['11'] + model.markov[n]['01'];
                                const p10 = model.markov[n]['10'] + model.markov[n]['00'];
                                const mk = latestSet.has(n) ? (p11 > 0 ? model.markov[n]['11'] / p11 : uniform) : (p10 > 0 ? model.markov[n]['10'] / p10 : uniform);
                                const emaScore = 1 - model.ema[n];
                                let cop = 0;
                                latestSet.forEach((m) => { if (m !== n) cop += pairRatio(model, n, m); });
                                const copScore = latestSet.size > 0 ? cop / latestSet.size : 1;
                                return (
                                  <tr key={n} style={{ borderTop: '1px solid var(--line)' }}>
                                    <td className="kl-mono" style={{ padding: '4px 6px', fontWeight: 700 }}>{n}</td>
                                    <td style={{ padding: '4px 6px' }}>{prior.toFixed(3)}</td>
                                    <td style={{ padding: '4px 6px' }}>{mk.toFixed(3)}</td>
                                    <td style={{ padding: '4px 6px' }}>{emaScore.toFixed(3)}</td>
                                    <td style={{ padding: '4px 6px' }}>{copScore.toFixed(3)}</td>
                                    <td style={{ padding: '4px 6px', fontWeight: 700, color: 'var(--brand)' }}>{scores[n].toFixed(3)}</td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    {premiumPreview && data && (
                      <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px dashed var(--line)' }}>
                        <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--gold)', marginBottom: 8 }}>ライブ・バックテスト</div>
                        <div style={{ fontSize: 11.5, color: 'var(--muted)', marginBottom: 8, lineHeight: 1.7 }}>
                          今の重み設定・合計値条件をそのまま使い、実際に過去データの後半約30%で「一つ前の回のデータだけで次を予測できていたら」を検証します。設定を変えるたびに結果も変わります。
                        </div>
                        <button className="kl-btn-ghost" onClick={handleRunBacktest} disabled={backtestRunning}>
                          {backtestRunning ? '検証中…' : 'この設定でバックテストする'}
                        </button>
                        {backtestResult && (
                          <div style={{ marginTop: 10, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
                            <div style={{ background: 'var(--surface-alt)', borderRadius: 6, padding: '8px 6px', textAlign: 'center' }}>
                              <div style={{ fontSize: 9, color: 'var(--muted)' }}>検証回数</div>
                              <div className="kl-mono" style={{ fontSize: 15, fontWeight: 700 }}>{backtestResult.total}回</div>
                            </div>
                            <div style={{ background: '#E4EFE9', borderRadius: 6, padding: '8px 6px', textAlign: 'center' }}>
                              <div style={{ fontSize: 9, color: 'var(--muted)' }}>{backtestResult.kThreshold}個以上一致率</div>
                              <div className="kl-mono" style={{ fontSize: 15, fontWeight: 700, color: 'var(--brand-deep)' }}>{(backtestResult.rate * 100).toFixed(2)}%</div>
                            </div>
                            <div style={{ background: 'var(--surface-alt)', borderRadius: 6, padding: '8px 6px', textAlign: 'center' }}>
                              <div style={{ fontSize: 9, color: 'var(--muted)' }}>ランダム比較</div>
                              <div className="kl-mono" style={{ fontSize: 15, fontWeight: 700 }}>{(backtestResult.randomRate * 100).toFixed(2)}%</div>
                            </div>
                            <div style={{ gridColumn: '1 / -1', fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>
                              平均一致数 {backtestResult.avgMatch.toFixed(3)}個／回　・　この設定はランダムの
                              <b style={{ color: 'var(--brand)' }}> {(backtestResult.rate / backtestResult.randomRate).toFixed(2)}倍</b> の{backtestResult.kThreshold}個以上一致率でした。
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {premiumPreview && tripleCounter && (
                      <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px dashed var(--line)' }}>
                        <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--gold)', marginBottom: 8 }}>三数字の相性分析（トリオ分析）</div>
                        <div style={{ fontSize: 11.5, color: 'var(--muted)', marginBottom: 8, lineHeight: 1.7 }}>
                          2つの数字の相性（共起分析）だけでなく、候補に含まれる数字から「3つセットで期待値より特に一緒に出やすい」組み合わせを全期間データから探索した結果です。
                        </div>
                        {(() => {
                          const candNums = statSets.flatMap((s) => s.combo);
                          const trios = topTrios(model, tripleCounter, candNums, 6);
                          if (trios.length === 0) {
                            return <div style={{ fontSize: 11.5, color: 'var(--muted)' }}>この候補群では、期待値を大きく上回るトリオは見つかりませんでした。</div>;
                          }
                          return (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                              {trios.map((t, i) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12 }}>
                                  {t.trio.map((n) => <span key={n} className="kl-chip" style={{ width: 26, height: 26, fontSize: 11 }}>{n}</span>)}
                                  <span style={{ color: 'var(--brand-deep)', fontWeight: 700 }}>{t.ratio.toFixed(2)}倍</span>
                                  <span style={{ color: 'var(--muted)', fontSize: 11 }}>（過去{t.count}回同時出現）</span>
                                </div>
                              ))}
                            </div>
                          );
                        })()}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* バランス生成エンジン */}
              <div className="kl-card">
                <div className="kl-card-head">
                  <div className="kl-card-title">
                    バランス生成エンジン
                    <span className="kl-badge kl-badge-free">無料</span>
                    {premiumPreview && <span className="kl-badge kl-badge-premium">分析付き</span>}
                  </div>
                </div>
                <div className="kl-card-desc">
                  {premiumPreview
                    ? `${game.label}（${game.min || 0}〜${game.max}から${game.pick}個）の組み合わせ論から、合計値が理論上もっとも集中する範囲を算出し、その範囲と連番の出すぎを避ける条件で生成します。`
                    : '奇数・偶数のバランスなど、数字選択式くじで一般的な構造を踏まえてランダムに組み合わせを生成します。'}
                </div>
                {premiumPreview && sumInfo && (
                  <div style={{ fontSize: 12, color: 'var(--brand-deep)', background: '#E4EFE9', padding: '8px 12px', borderRadius: 6, marginBottom: 12 }}>
                    分析：この{game.label}では合計値が <b>{sumInfo.min}〜{sumInfo.max}</b> の範囲に全組み合わせの約{sumInfo.pct.toFixed(0)}%が集中します（理論値・組み合わせ論による計算）。
                  </div>
                )}
                <button className="kl-btn" onClick={handleGenBalanced}>💰 千両箱を開けて生成する 💰</button>
                {balSets.length > 0 && (
                  <div style={{ marginTop: 14 }}>
                    {game.digits
                      ? balSets.map((s, i) => (
                          <div key={i} className="kl-numrow">
                            <span className="kl-digitchip">{s}</span>
                          </div>
                        ))
                      : balSets.map((s, i) => (
                          <div key={i} style={{ marginBottom: 6 }}>
                            <TreasureBox
                              open={balBoxOpen} numbers={s} delay={i * 400} showJackpot={i === 0}
                              jackpotAlign={game.jackpot.align}
                              jackpotContent={game.jackpot.count > 1
                                ? <MiniOwlSquad count={game.jackpot.count} message={game.jackpot.message} />
                                : <LeoJackpot message={game.jackpot.message} />}
                            />
                            <div style={{ textAlign: 'center', fontSize: 11.5, color: 'var(--muted)', marginTop: 2, marginBottom: 2 }}>
                              第{['一', '二', '三', '四', '五', '六', '七', '八'][i] || (i + 1)}の候補（合計{s.reduce((a, b) => a + b, 0)}）
                            </div>
                          </div>
                        ))}
                    {game.jackpot.align === 'end' && (
                      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 10 }}>
                        {game.jackpot.count > 1
                          ? <MiniOwlSquad count={game.jackpot.count} message={game.jackpot.message} />
                          : <LeoJackpot message={game.jackpot.message} />}
                      </div>
                    )}
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 8 }}>
                      <input className="kl-input" style={{ width: 140 }} placeholder="回号を入力" value={roundLabel} onChange={(e) => setRoundLabel(e.target.value)} />
                      <button className="kl-btn-ghost" onClick={() => handleSaveHistory('バランス生成', balSets)}>記録する</button>
                    </div>
                    {!premiumPreview && (
                      <div className="kl-lock-overlay"><span>無料版は2セット・簡易ランダムのみ。プレミアムで合計値の理論分析つき・最大8セットになります。</span></div>
                    )}
                  </div>
                )}
              </div>
            </div>
            {msg && <div style={{ marginTop: 12, fontSize: 12.5, color: 'var(--brand)' }}>{msg}</div>}
          </>
        )}

        {gameKey !== 'fortune' && view === 'calendar' && (
          <div className="kl-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <button className="kl-btn-ghost" onClick={() => setCalMonth((c) => c.m === 0 ? { y: c.y - 1, m: 11 } : { y: c.y, m: c.m - 1 })}>◀ 前月</button>
              <div className="kl-display" style={{ fontSize: 17 }}>{calMonth.y}年 {calMonth.m + 1}月</div>
              <button className="kl-btn-ghost" onClick={() => setCalMonth((c) => c.m === 11 ? { y: c.y + 1, m: 0 } : { y: c.y, m: c.m + 1 })}>次月 ▶</button>
            </div>
            <div className="kl-cal-grid">
              {['日', '月', '火', '水', '木', '金', '土'].map((d) => <div key={d} className="kl-cal-dow">{d}</div>)}
              {calDays.map((d, i) => {
                if (!d) return <div key={i}></div>;
                const roku = rokuyoOf(d);
                const kichi = kichijitsuOf(d);
                const seasonal = seasonalKichijitsuOf(d);
                const allTags = [...kichi.tags, ...seasonal];
                const moonAge = moonAgeOf(d);
                const moon = moonPhaseLabel(moonAge);
                const isToday = d.toDateString() === new Date().toDateString();
                const isLucky = monthlyFortune && monthlyFortune.year === calMonth.y && monthlyFortune.month === calMonth.m && (monthlyFortune.days.find((x) => x.day === d.getDate())?.score >= 80);
                return (
                  <div key={i} className="kl-cal-cell" style={{ border: isToday ? '1.5px solid var(--brand)' : (isLucky ? '1.5px solid #7A4A9C' : 'none'), background: roku ? ROKUYO_TONE[roku].c + '18' : 'var(--surface-alt)', position: 'relative' }}>
                    {isLucky && <span style={{ position: 'absolute', top: 2, right: 4, fontSize: 10, color: '#7A4A9C' }}>★</span>}
                    {(moon.label === '新月' || moon.label === '満月') && (
                      <span style={{ position: 'absolute', top: 2, left: 4, fontSize: 9, color: moon.c }}>{moon.icon}</span>
                    )}
                    <span className="kl-cal-daynum">{d.getDate()}</span>
                    {roku && <span className="kl-cal-roku" style={{ color: ROKUYO_TONE[roku].c, fontWeight: 700 }}>{roku}</span>}
                    {allTags.length > 0 && (
                      <span className="kl-cal-roku" style={{ color: allTags[0].c, fontSize: 8.5 }}>{allTags.map((t) => t.label).join('・')}</span>
                    )}
                  </div>
                );
              })}
            </div>
            <div className="kl-legend">
              {ROKUYO_NAMES.map((r) => (
                <span key={r}><span className="kl-legend-dot" style={{ background: ROKUYO_TONE[r].c }}></span>{r}：{ROKUYO_TONE[r].label}</span>
              ))}
              <span><span className="kl-legend-dot" style={{ background: '#B8863B' }}></span>寅の日／巳の日：金運の日</span>
              <span><span className="kl-legend-dot" style={{ background: '#5C8C6F' }}></span>辰の日：成長・発展の日</span>
              <span><span className="kl-legend-dot" style={{ background: '#8C5A1F' }}></span>己巳の日：60日に一度の金運日</span>
              <span><span className="kl-legend-dot" style={{ background: '#3A5C8C' }}></span>甲子の日：60日に一度の始まりの日</span>
              <span><span className="kl-legend-dot" style={{ background: '#1F6F5C' }}></span>一粒万倍日：新しく始めるのに良い日</span>
              <span><span className="kl-legend-dot" style={{ background: '#B8863B' }}></span>天赦日：年5〜6回の最上の吉日</span>
              <span>●新月／○満月（月齢による近似表示）</span>
              {premiumPreview && <span><span style={{ color: '#7A4A9C' }}>★</span>＝あなたの今月の運気が良い日（プレミアム占い）</span>}
            </div>
            <p style={{ fontSize: 11.5, color: 'var(--muted)', marginTop: 14, lineHeight: 1.8 }}>
              六曜・干支の日（寅の日・辰の日・巳の日・己巳の日・甲子の日）・一粒万倍日・天赦日は、いずれも実際の暦計算にもとづいて表示しています（2026年の公開カレンダーと照合済み）。新月・満月は簡易的な天文計算による近似で、時刻によっては前後1日ずれる場合があります。不成就日・天恩日・母倉日・神吉日など一部の暦注は、正確な算出方法を検証しきれなかったため今回は掲載していません。いずれも当せんを保証するものではなく、伝統的な暦の参考情報としてご覧ください。
            </p>
          </div>
        )}

        {gameKey !== 'fortune' && view === 'history' && (
          <div className="kl-card">
            <div className="kl-card-title" style={{ marginBottom: 14 }}>記録した予測</div>
            {!historyLoaded && <div style={{ fontSize: 13, color: 'var(--muted)' }}>読み込み中…</div>}
            {historyLoaded && history.length === 0 && (
              <div style={{ fontSize: 13, color: 'var(--muted)' }}>まだ記録がありません。「予測エンジン」タブでセットを生成して記録してみてください。</div>
            )}
            {history.map((h) => (
              <div key={h.key} style={{ marginBottom: 16, paddingBottom: 16, borderBottom: '1px solid var(--line)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <b>{GAMES[h.game].label} 第{h.round}回 ／ {h.engine}</b>
                  {!h.actual && <button className="kl-btn-ghost" onClick={() => setCheckTarget(h)}>結果を入力</button>}
                </div>
                {h.sets.map((s, i) => {
                  const isDigit = GAMES[h.game].digits;
                  const matches = h.actual && !isDigit ? s.filter((n) => h.actual.includes(n)).length : (h.actual && isDigit ? (s === h.actual ? 'ストレート一致' : null) : null);
                  return (
                    <div key={i} className="kl-numrow" style={{ marginTop: 4 }}>
                      {isDigit
                        ? <span className="kl-digitchip" style={{ fontSize: 15 }}>{s}</span>
                        : s.map((n) => (
                          <span key={n} className="kl-chip" style={{ width: 28, height: 28, fontSize: 11, background: h.actual && h.actual.includes(n) ? 'var(--gold)' : 'var(--line)', color: h.actual && h.actual.includes(n) ? '#fff' : 'var(--muted)' }}>{n}</span>
                        ))}
                      {matches !== null && matches !== undefined && <span className="kl-sum">{matches}{typeof matches === 'number' ? '個一致' : ''}</span>}
                    </div>
                  );
                })}
                {h.actual && <div style={{ fontSize: 11.5, color: 'var(--muted)', marginTop: 4 }}>実際：{Array.isArray(h.actual) ? h.actual.join(' ・ ') : h.actual}</div>}
              </div>
            ))}
            {checkTarget && (
              <div style={{ padding: 14, background: 'var(--surface-alt)', borderRadius: 6 }}>
                <div style={{ fontSize: 13, marginBottom: 8 }}>{GAMES[checkTarget.game].label} 第{checkTarget.round}回の結果を入力</div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <input className="kl-input" placeholder={GAMES[checkTarget.game].digits ? '例: 4821' : '例: 2,5,32,36,38,42'} value={actualInput} onChange={(e) => setActualInput(e.target.value)} />
                  <button className="kl-btn" onClick={handleCheckSave}>記録</button>
                  <button className="kl-btn-ghost" onClick={() => setCheckTarget(null)}>やめる</button>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="kl-footer-note">
          本アプリは公表されている抽せん結果の統計分析であり、当せんを保証するものではありません。<br />
          購入は無理のない範囲でお楽しみください。プレミアム表示は現在デザインプレビューであり、実際の課金は行われません。
        </div>
      </div>
    </div>
  );
}
