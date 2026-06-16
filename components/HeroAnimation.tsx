'use client'

/*
  Sorting Grid Animation
  ─────────────────────
  6 tiles (Legal, Insurance, Estate, Tax, Benefits, Accounts) start scattered
  and slightly rotated across the viewport, then slide along invisible tracks
  to snap into a clean 3×2 grid. A bounding outline reveals on lock, then
  the whole scene fades and loops.

  Pure SVG + CSS — zero runtime dependencies, zero network requests.
*/

// ── Layout ──────────────────────────────────────────────────────────────────
// viewBox: 400×400
// Tile: 88×50  Gap: 12  Grid: 3 cols × 2 rows
// Grid origin: x=56, y=144

const TILES = [
  // label, accentColor, slot (0-5), scattered start (cx,cy), initial rotation
  { label: 'LEGAL',     accent: '#a8c5b0', slot: 0, sx:  22,  sy:  28, rot: -10 },
  { label: 'INSURANCE', accent: '#c9a46a', slot: 1, sx: 342,  sy:  22, rot:  13 },
  { label: 'ESTATE',    accent: '#a8c5b0', slot: 2, sx: 376,  sy: 115, rot:  -6 },
  { label: 'TAX',       accent: '#c9a46a', slot: 3, sx:  18,  sy: 346, rot:   9 },
  { label: 'BENEFITS',  accent: '#a8c5b0', slot: 4, sx: 198,  sy: 378, rot:  -4 },
  { label: 'ACCOUNTS',  accent: '#c9a46a', slot: 5, sx: 376,  sy: 338, rot:   8 },
] as const

// Final grid centre positions
const SLOTS = [
  { cx: 100, cy: 169 },
  { cx: 200, cy: 169 },
  { cx: 300, cy: 169 },
  { cx: 100, cy: 231 },
  { cx: 200, cy: 231 },
  { cx: 300, cy: 231 },
]

// ── Timing (9s loop) ─────────────────────────────────────────────────────────
// 0-7%   : tiles appear at scattered positions  (fade-in)
// 7-60%  : tiles slide to grid slots            (ease-out-expo)
// 60-68% : lock flash on border + scale pulse
// 68-88% : hold in perfect grid
// 88-97% : fade out
// 97-100%: invisible, positions reset for next cycle

const DUR = '9s'

function tileKeyframes(id: number, dx: number, dy: number, rot: number): string {
  // dx/dy = scattered offset from final grid centre
  const easeSnap = 'cubic-bezier(0.16, 1, 0.3, 1)'
  return `
    @keyframes tile-${id} {
      0%   { transform: translate(${dx}px, ${dy}px) rotate(${rot}deg); opacity: 0; }
      7%   { transform: translate(${dx}px, ${dy}px) rotate(${rot}deg); opacity: 1;
              animation-timing-function: ${easeSnap}; }
      60%  { transform: translate(0px, 0px) rotate(0deg); opacity: 1; }
      88%  { transform: translate(0px, 0px) rotate(0deg); opacity: 1; }
      97%  { transform: translate(0px, 0px) rotate(0deg); opacity: 0; }
      100% { transform: translate(${dx}px, ${dy}px) rotate(${rot}deg); opacity: 0; }
    }
  `
}

// Stagger each tile's slide slightly (baked into per-tile start %)
// by varying when each tile "wakes up" inside the same 9s loop
const STAGGER_OFFSETS = [0, 0.025, 0.05, 0.03, 0.055, 0.04] // fraction of 9s

export default function HeroAnimation() {
  const styles = TILES.map((t, i) => {
    const slot = SLOTS[t.slot]
    const dx = t.sx - slot.cx
    const dy = t.sy - slot.cy
    // Stagger: delay the "appear" point slightly by shifting keyframe percentages
    const off = STAGGER_OFFSETS[i] * 100  // in %
    const easeSnap = 'cubic-bezier(0.16, 1, 0.3, 1)'
    const ap = off          // appear %
    const mv = 7 + off      // start moving %
    const ln = 60 + off     // land %
    const hd = 88           // hold until %
    const fo = 97           // fade out %
    return `
      @keyframes tile-${i} {
        0%    { transform: translate(${dx}px,${dy}px) rotate(${t.rot}deg); opacity:0; }
        ${ap}% { transform: translate(${dx}px,${dy}px) rotate(${t.rot}deg); opacity:0; }
        ${mv}% { transform: translate(${dx}px,${dy}px) rotate(${t.rot}deg); opacity:1;
                animation-timing-function:${easeSnap}; }
        ${ln}% { transform: translate(0px,0px) rotate(0deg); opacity:1; }
        ${hd}% { transform: translate(0px,0px) rotate(0deg); opacity:1; }
        ${fo}% { transform: translate(0px,0px) rotate(0deg); opacity:0; }
        100%  { transform: translate(${dx}px,${dy}px) rotate(${t.rot}deg); opacity:0; }
      }
    `
  }).join('\n')

  return (
    <div
      role="img"
      aria-label="Animation showing financial documents — Legal, Insurance, Estate, Tax, Benefits, Accounts — sliding from scattered positions into a perfectly organised grid, representing Acorn Care's coordination service"
      className="flex w-full items-center justify-center select-none"
    >
      <style>{`
        ${styles}

        /* Grid outline reveals when tiles land (~60%) */
        @keyframes gridReveal {
          0%, 58%  { opacity: 0; }
          65%      { opacity: 1; stroke: rgba(201,164,106,0.9); stroke-width: 1.5; }
          75%      { opacity: 0.4; stroke: rgba(168,197,176,0.5); stroke-width: 1; }
          88%      { opacity: 0.3; }
          97%      { opacity: 0; }
          100%     { opacity: 0; }
        }

        /* Subtle scale pulse on each tile as it locks */
        @keyframes lockPulse {
          0%, 58%  { transform: scale(1); }
          63%      { transform: scale(1.04); }
          67%      { transform: scale(0.98); }
          72%      { transform: scale(1); }
          100%     { transform: scale(1); }
        }

        /* Slow rotating dashed outer ring */
        @keyframes outerRing {
          from { transform: rotate(0deg); transform-origin: 200px 200px; }
          to   { transform: rotate(360deg); transform-origin: 200px 200px; }
        }

        /* Destination slot ghost pulse */
        @keyframes slotPulse {
          0%, 100% { opacity: 0.07; }
          50%      { opacity: 0.14; }
        }
      `}</style>

      <svg
        viewBox="0 0 400 400"
        width="100%"
        height="100%"
        style={{ maxWidth: 520, display: 'block' }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <filter id="tileGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>

        {/* ── Slow outer decorative ring ── */}
        <circle
          cx="200" cy="200" r="175"
          fill="none"
          stroke="rgba(201,164,106,0.07)"
          strokeWidth="1"
          strokeDasharray="3 10"
          style={{ animation: 'outerRing 30s linear infinite' }}
        />

        {/* ── Ghost destination slots (invisible tracks) ── */}
        {SLOTS.map((s, i) => (
          <rect
            key={`slot-${i}`}
            x={s.cx - 44} y={s.cy - 25}
            width={88} height={50}
            rx={4}
            fill="none"
            stroke="rgba(168,197,176,0.12)"
            strokeWidth="1"
            strokeDasharray="4 5"
            style={{ animation: `slotPulse ${3 + i * 0.3}s ease-in-out infinite` }}
          />
        ))}

        {/* ── Grid bounding outline (reveals on lock) ── */}
        <rect
          x={56 - 6} y={144 - 6}
          width={288 + 12} height={112 + 12}
          rx={6}
          fill="none"
          stroke="rgba(201,164,106,0.7)"
          strokeWidth="1"
          style={{ animation: `gridReveal ${DUR} ease-in-out infinite` }}
        />

        {/* ── Tiles ── */}
        {TILES.map((t, i) => {
          const slot = SLOTS[t.slot]
          return (
            <g
              key={t.label}
              style={{
                animation: `tile-${i} ${DUR} ease-in-out infinite`,
                // Lock pulse sits on the group so it combines with translate
              }}
            >
              {/* Tile shadow / glow */}
              <rect
                x={slot.cx - 44} y={slot.cy - 25}
                width={88} height={50} rx={4}
                fill="rgba(0,0,0,0.25)"
                transform="translate(2,3)"
              />

              {/* Tile body */}
              <rect
                x={slot.cx - 44} y={slot.cy - 25}
                width={88} height={50} rx={4}
                fill="rgba(250,247,241,0.06)"
                stroke={t.accent}
                strokeWidth="1"
                strokeOpacity="0.55"
              />

              {/* Accent bar top */}
              <rect
                x={slot.cx - 44} y={slot.cy - 25}
                width={88} height={3} rx={4}
                fill={t.accent}
                opacity="0.7"
              />

              {/* Label */}
              <text
                x={slot.cx} y={slot.cy + 6}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="9.5"
                letterSpacing="0.16em"
                fontFamily="ui-sans-serif, system-ui, sans-serif"
                fontWeight="600"
                fill="rgba(250,247,241,0.75)"
              >
                {t.label}
              </text>

              {/* Small accent dot bottom-right */}
              <circle
                cx={slot.cx + 34} cy={slot.cy + 16}
                r={2.5}
                fill={t.accent}
                opacity="0.5"
              />
            </g>
          )
        })}

        {/* ── "ORGANISED" micro-label that appears when grid locks ── */}
        <g style={{ animation: `gridReveal ${DUR} ease-in-out infinite` }}>
          <text
            x="200" y="290"
            textAnchor="middle"
            fontSize="7.5"
            letterSpacing="0.28em"
            fontFamily="ui-sans-serif, system-ui, sans-serif"
            fontWeight="500"
            fill="rgba(201,164,106,0.65)"
          >
            ORGANISED
          </text>
        </g>

      </svg>
    </div>
  )
}
