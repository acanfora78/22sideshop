"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

/**
 * The intro "short film", drawn entirely in SVG and directed with one GSAP
 * timeline:
 *   neon flickers on → a kid in a 22 hoodie walks up → close-up on the lock →
 *   key goes in, turns, CLICK! → door bursts open, light floods out →
 *   they step inside → camera dives through the doorway → white flash.
 *
 * viewBox is 1600×1000 with `slice`, and every key element sits in the
 * central ~460 units so the scene reads on a portrait phone too.
 */

const RED = "#d42a24";
const DOOR_L = 640;
const DOOR_R = 960;
const DOOR_T = 250;
const FLOOR = 900;
const KEY = { x: 925, y: 615 };

function Character() {
  // Back view, origin at the feet (0,0). Oversized hoodie with a 22 back print.
  return (
    <g>
      {/* sneakers */}
      <path d="M-92,-26 h70 a18,18 0 0 1 18,18 v8 h-96 z" fill="#E8E5DF" />
      <path d="M-96,-4 h92 v6 h-92 z" fill="#777" />
      <path d="M22,-26 h70 a18,18 0 0 1 18,18 v8 h-96 z" fill="#E8E5DF" transform="translate(-14,0)" />
      <path d="M8,-4 h92 v6 h-92 z" fill="#777" />
      <path d="M-70,-26 h36 M36,-26 h36" stroke={RED} strokeWidth="5" />
      {/* baggy cargos */}
      <path d="M-86,-300 L86,-300 L98,-30 L14,-24 L4,-205 L-4,-205 L-14,-24 L-98,-30 Z" fill="#2b2b2b" />
      <rect x="-92" y="-190" width="34" height="46" fill="#222" stroke="#151515" strokeWidth="3" />
      <rect x="58" y="-190" width="34" height="46" fill="#222" stroke="#151515" strokeWidth="3" />
      <path d="M-60,-120 q10,40 -6,90 M60,-120 q-10,40 6,90" stroke="#1d1d1d" strokeWidth="4" fill="none" />
      {/* left arm, hanging */}
      <path d="M-104,-448 L-140,-420 L-150,-300 L-112,-292 L-100,-400 Z" fill="#dcd8d0" />
      <rect x="-152" y="-306" width="42" height="18" rx="4" fill="#cfcac0" />
      <circle cx="-131" cy="-276" r="17" fill="#8a5a3c" />
      {/* hoodie body */}
      <path
        d="M-112,-455 Q-60,-480 0,-482 Q60,-480 112,-455 L118,-300 Q116,-276 100,-272 L-100,-272 Q-116,-276 -118,-300 Z"
        fill="#E8E5DF"
      />
      <rect x="-112" y="-292" width="224" height="22" rx="6" fill="#d6d1c7" />
      {/* back print */}
      <text x="0" y="-322" textAnchor="middle" fontFamily="var(--font-anton), Impact, sans-serif" fontSize="132" fill="#0b0b0b">
        22
      </text>
      <rect x="-62" y="-386" width="124" height="9" fill={RED} />
      <text x="0" y="-302" textAnchor="middle" fontFamily="var(--font-plex-mono), monospace" fontSize="16" letterSpacing="5" fill="#0b0b0b">
        SIDE
      </text>
      {/* hood */}
      <path d="M-74,-470 Q-86,-560 0,-574 Q86,-560 74,-470 Q40,-486 0,-488 Q-40,-486 -74,-470 Z" fill="#dcd8d0" />
      <path d="M-40,-478 Q0,-530 40,-478" stroke="#c9c3b8" strokeWidth="5" fill="none" />
    </g>
  );
}

function RightArm() {
  // Drawn hanging straight down from the shoulder at (0,0); rotated by GSAP.
  return (
    <g>
      <path d="M-22,0 L22,0 L20,150 L-20,150 Z" fill="#dcd8d0" />
      <rect x="-23" y="140" width="46" height="18" rx="4" fill="#cfcac0" />
      <circle cx="0" cy="172" r="17" fill="#8a5a3c" />
    </g>
  );
}

function Sticker({ x, y, r, w, label, bg, fg }: { x: number; y: number; r: number; w: number; label: string; bg: string; fg: string }) {
  return (
    <g transform={`translate(${x},${y}) rotate(${r})`}>
      <rect x={-w / 2} y={-16} width={w} height={32} rx={4} fill={bg} />
      <text x="0" y="7" textAnchor="middle" fontFamily="var(--font-permanent-marker), sans-serif" fontSize="20" fill={fg}>
        {label}
      </text>
    </g>
  );
}

export function DoorScene({ onComplete, onClick }: { onComplete: () => void; onClick?: () => void }) {
  const root = useRef<SVGSVGElement>(null);
  const done = useRef(onComplete);
  const clicked = useRef(onClick);
  useEffect(() => {
    done.current = onComplete;
    clicked.current = onClick;
  });

  useEffect(() => {
    const svg = root.current;
    if (!svg) return;
    const q = gsap.utils.selector(svg);
    const ctx = gsap.context(() => {
      gsap.set(q("#char"), { x: 1780, y: FLOOR });
      gsap.set(q("#arm"), { rotation: -3, transformOrigin: "50% 0%" });
      gsap.set(q("#key"), { opacity: 0, scale: 2.4, svgOrigin: `${KEY.x} ${KEY.y}` });
      gsap.set(q("#click"), { opacity: 0, scale: 0, svgOrigin: "1015 548" });
      gsap.set(q("#swoosh"), { opacity: 0, scale: 0.4, svgOrigin: "1120 380" });
      gsap.set(q("#neon"), { opacity: 0.05 });
      gsap.set([q("#spill"), q("#glow"), q("#flash"), q("#speed")], { opacity: 0 });

      const tl = gsap.timeline({ defaults: { ease: "power3.inOut" }, onComplete: () => done.current() });

      // 1. Neon sign stutters to life.
      tl.to(q("#neon"), { opacity: 1, duration: 0.05 })
        .to(q("#neon"), { opacity: 0.15, duration: 0.05 })
        .to(q("#neon"), { opacity: 1, duration: 0.05, delay: 0.12 })
        .to(q("#neon"), { opacity: 0.3, duration: 0.04, delay: 0.1 })
        .to(q("#neon"), { opacity: 1, duration: 0.06 });

      // 2. Walk up to the door (with a bouncy step).
      tl.to(q("#char"), { x: 760, duration: 1.15, ease: "power2.out" }, 0.35);
      tl.to(q("#charBob"), { y: -14, duration: 0.14, repeat: 7, yoyo: true, ease: "sine.inOut" }, 0.35);
      tl.add("arrive", 1.45);

      // 3. Reach for the lock.
      tl.to(q("#arm"), { rotation: -21.5, duration: 0.35, ease: "back.out(2)" }, "arrive");

      // 4. Smash zoom on the lock.
      tl.to(q("#camera"), { scale: 3.4, x: 800 - KEY.x, y: 500 - KEY.y, svgOrigin: `${KEY.x} ${KEY.y}`, duration: 0.45, ease: "expo.inOut" }, "arrive+=0.2");
      tl.to(q("#speed"), { opacity: 0.8, duration: 0.1, yoyo: true, repeat: 1 }, "arrive+=0.3");

      // 5. Key in, turn, CLICK.
      tl.to(q("#key"), { opacity: 1, scale: 1, duration: 0.3, ease: "power4.in" }, "arrive+=0.75");
      tl.to(q("#keyTag"), { rotation: 28, svgOrigin: `${KEY.x} ${KEY.y + 22}`, duration: 0.25, yoyo: true, repeat: 3, ease: "sine.inOut" }, "arrive+=1.0");
      tl.to(q("#keyTurn"), { rotation: 90, svgOrigin: `${KEY.x} ${KEY.y}`, duration: 0.22, ease: "back.out(3)" }, "arrive+=1.15");
      tl.call(() => clicked.current?.(), [], "arrive+=1.3");
      tl.to(q("#click"), { opacity: 1, scale: 1, rotation: -12, duration: 0.25, ease: "back.out(3)" }, "arrive+=1.3");
      tl.to(q("#shake"), { x: "random(-14,14)", y: "random(-10,10)", duration: 0.04, repeat: 7, yoyo: true, ease: "none" }, "arrive+=1.3");
      tl.set(q("#shake"), { x: 0, y: 0 });
      tl.to(q("#click"), { opacity: 0, scale: 1.4, duration: 0.2 }, "arrive+=1.75");

      // 6. Pull back, door bursts open, light floods the street.
      tl.to(q("#camera"), { scale: 1, x: 0, y: 0, duration: 0.45, ease: "expo.inOut" }, "arrive+=1.7");
      tl.add("open", "arrive+=2.1");
      tl.to(q("#door"), { scaleX: 0.1, skewY: -9, svgOrigin: `${DOOR_L} ${(DOOR_T + FLOOR) / 2}`, duration: 0.5, ease: "back.out(1.4)" }, "open");
      tl.to([q("#glow"), q("#spill")], { opacity: 1, duration: 0.4, ease: "power2.out" }, "open");
      tl.to(q("#charBob"), { filter: "brightness(0.18)", duration: 0.3 }, "open"); // backlit
      tl.to(q("#arm"), { rotation: -3, duration: 0.3 }, "open");
      tl.to(q("#swoosh"), { opacity: 1, scale: 1, rotation: 8, duration: 0.3, ease: "back.out(3)" }, "open+=0.1");
      tl.to(q("#swoosh"), { opacity: 0, duration: 0.2 }, "open+=0.6");

      // 7. Step inside and the camera follows, straight through the door.
      tl.to(q("#char"), { x: 800, y: FLOOR - 70, scale: 0.6, transformOrigin: "50% 100%", duration: 0.7, ease: "power2.in" }, "open+=0.45");
      tl.to(q("#char"), { opacity: 0, duration: 0.3 }, "open+=0.85");
      tl.to(q("#camera"), { scale: 11, x: 0, y: -60, svgOrigin: "800 560", duration: 0.75, ease: "expo.in" }, "open+=0.7");
      tl.to(q("#speed"), { opacity: 1, duration: 0.3 }, "open+=0.95");
      tl.to(q("#flash"), { opacity: 1, duration: 0.25, ease: "power2.in" }, "open+=1.2");
    }, svg);
    return () => ctx.revert();
  }, []);

  const bricks = [];
  for (let row = 0; row < 40; row++) {
    for (let col = -1; col < 28; col++) {
      bricks.push(<rect key={`${row}-${col}`} x={col * 62 + (row % 2) * 31} y={row * 24} width="58" height="20" />);
    }
  }

  return (
    <svg ref={root} viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full" aria-hidden>
      <defs>
        <filter id="neonGlow" x="-20%" y="-50%" width="140%" height="200%">
          <feGaussianBlur stdDeviation="6" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <radialGradient id="doorLight" cx="50%" cy="45%" r="70%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="55%" stopColor="#E8E5DF" />
          <stop offset="100%" stopColor="#b8b2a8" />
        </radialGradient>
        <linearGradient id="spillGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#E8E5DF" stopOpacity="0.75" />
          <stop offset="100%" stopColor="#E8E5DF" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="lampCone" cx="50%" cy="0%" r="100%">
          <stop offset="0%" stopColor="#E8E5DF" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#E8E5DF" stopOpacity="0" />
        </radialGradient>
        <pattern id="shutter" width="10" height="14" patternUnits="userSpaceOnUse">
          <rect width="10" height="14" fill="#262626" />
          <rect y="11" width="10" height="3" fill="#161616" />
        </pattern>
      </defs>

      <g id="shake">
        <g id="camera">
          {/* Wall */}
          <rect width="1600" height="1000" fill="#121110" />
          <g fill="#191817" stroke="#0c0c0b" strokeWidth="2">
            {bricks}
          </g>
          <polygon points="140,0 460,0 760,1000 -200,1000" fill="url(#lampCone)" />
          <rect x="270" y="40" width="60" height="16" fill="#333" />
          <rect x="285" y="54" width="30" height="8" fill="#E8E5DF" />

          {/* Shuttered windows with tags */}
          {[
            [170, 560],
            [1040, 1430],
          ].map(([a, b]) => (
            <g key={a}>
              <rect x={a - 14} y={300} width={b - a + 28} height={20} fill="#0a0a0a" />
              <rect x={a} y={320} width={b - a} height={FLOOR - 320} fill="url(#shutter)" />
            </g>
          ))}
          <g fontFamily="var(--font-permanent-marker), sans-serif">
            <text x="210" y="520" fontSize="92" fill={RED} transform="rotate(-8 210 520)">
              NO RULES
            </text>
            <text x="260" y="700" fontSize="64" fill="#E8E5DF" opacity="0.85" transform="rotate(4 260 700)">
              just attitude
            </text>
            <text x="1090" y="560" fontSize="150" fill="#E8E5DF" opacity="0.9" transform="rotate(-6 1090 560)">
              22
            </text>
            <text x="1250" y="760" fontSize="56" fill={RED} transform="rotate(7 1250 760)">
              open late
            </text>
            <path d="M1080,600 q80,40 160,-10 t160,20" stroke={RED} strokeWidth="9" fill="none" strokeLinecap="round" />
            <path d="M200,560 q120,-30 260,10" stroke="#E8E5DF" strokeWidth="6" fill="none" strokeLinecap="round" opacity="0.7" />
          </g>

          {/* Neon sign */}
          <g id="neon" filter="url(#neonGlow)">
            <rect x="590" y="78" width="420" height="140" rx="10" fill="none" stroke={RED} strokeWidth="5" />
            <text x="800" y="190" textAnchor="middle" fontFamily="var(--font-anton), Impact, sans-serif" fontSize="118" fill="none" stroke="#ff5a4f" strokeWidth="4">
              22SIDE
            </text>
          </g>

          {/* Sidewalk */}
          <rect x="0" y={FLOOR} width="1600" height="100" fill="#0b0b0a" />
          <rect x="0" y={FLOOR} width="1600" height="6" fill="#2a2a28" />
          {[150, 520, 1080, 1450].map((x) => (
            <line key={x} x1={x} y1={FLOOR + 6} x2={x - 60} y2="1000" stroke="#1f1f1e" strokeWidth="3" />
          ))}

          {/* Door frame + lit interior behind the door */}
          <rect x={DOOR_L - 22} y={DOOR_T - 22} width={DOOR_R - DOOR_L + 44} height={FLOOR - DOOR_T + 22} fill="#050505" />
          <rect x={DOOR_L} y={DOOR_T} width={DOOR_R - DOOR_L} height={FLOOR - DOOR_T} fill="#1b1a19" />
          <g id="glow">
            <rect x={DOOR_L} y={DOOR_T} width={DOOR_R - DOOR_L} height={FLOOR - DOOR_T} fill="url(#doorLight)" />
            {/* glimpse of the shop: rail with tees */}
            <line x1={DOOR_L + 20} y1="400" x2={DOOR_R - 20} y2="400" stroke="#555" strokeWidth="5" />
            {[690, 750, 810, 870].map((x, i) => (
              <path
                key={x}
                d={`M${x},400 l0,14 l-26,8 l-14,26 l12,8 l8,-10 l0,70 l40,0 l0,-70 l8,10 l12,-8 l-14,-26 l-26,-8 z`}
                fill={i === 1 ? RED : "#3a3a3a"}
                opacity="0.75"
              />
            ))}
            <path d={`M${DOOR_L},${FLOOR} L800,640 L${DOOR_R},${FLOOR}`} stroke="#cfc9bf" strokeWidth="3" fill="none" />
          </g>
          <polygon id="spill" points={`${DOOR_L},${FLOOR} ${DOOR_R},${FLOOR} 1240,1000 360,1000`} fill="url(#spillGrad)" />

          {/* The door */}
          <g id="door">
            <rect x={DOOR_L} y={DOOR_T} width={DOOR_R - DOOR_L} height={FLOOR - DOOR_T} fill="#202020" stroke="#3a3a3a" strokeWidth="4" />
            <rect x={DOOR_L + 30} y={DOOR_T + 30} width={DOOR_R - DOOR_L - 60} height="160" fill="#0e0e0e" stroke="#3a3a3a" strokeWidth="3" />
            <text x="800" y={DOOR_T + 128} textAnchor="middle" fontFamily="var(--font-anton), Impact, sans-serif" fontSize="66" fill="#E8E5DF">
              22SIDE
            </text>
            <text x="800" y={DOOR_T + 162} textAnchor="middle" fontFamily="var(--font-plex-mono), monospace" fontSize="15" letterSpacing="4" fill="#777">
              EST. ON THE BLOCK
            </text>
            <rect x={DOOR_L + 30} y={DOOR_T + 220} width={DOOR_R - DOOR_L - 60} height={FLOOR - DOOR_T - 250} fill="none" stroke="#2f2f2f" strokeWidth="3" />
            <Sticker x={720} y={720} r={-12} w={130} label="NO RULES" bg={RED} fg="#E8E5DF" />
            <Sticker x={770} y={800} r={8} w={110} label="fresh drop" bg="#E8E5DF" fg="#0b0b0b" />
            <Sticker x={705} y={560} r={5} w={64} label="22" bg="#0b0b0b" fg="#E8E5DF" />
            {/* handle + lock */}
            <rect x={KEY.x - 9} y="470" width="18" height="100" rx="9" fill="#9a9a9a" />
            <rect x={KEY.x - 22} y={KEY.y - 28} width="44" height="64" rx="6" fill="#8a8a8a" stroke="#555" strokeWidth="2" />
            <circle cx={KEY.x} cy={KEY.y - 4} r="7" fill="#0b0b0b" />
            <rect x={KEY.x - 3} y={KEY.y - 2} width="6" height="16" fill="#0b0b0b" />
            {/* key */}
            <g id="key">
              <g id="keyTurn">
                <circle cx={KEY.x} cy={KEY.y - 30} r="20" fill="#e3b341" stroke="#9c7a1d" strokeWidth="3" />
                <circle cx={KEY.x} cy={KEY.y - 36} r="6" fill="#202020" />
                <rect x={KEY.x - 6} y={KEY.y - 12} width="12" height="14" fill="#e3b341" />
                <text x={KEY.x} y={KEY.y - 21} textAnchor="middle" fontFamily="var(--font-anton), Impact, sans-serif" fontSize="11" fill="#5b4510">
                  22
                </text>
              </g>
              <g id="keyTag">
                <circle cx={KEY.x} cy={KEY.y + 22} r="9" fill="none" stroke="#bbb" strokeWidth="3" />
                <rect x={KEY.x - 13} y={KEY.y + 30} width="26" height="34" rx="4" fill={RED} />
                <text x={KEY.x} y={KEY.y + 54} textAnchor="middle" fontFamily="var(--font-anton), Impact, sans-serif" fontSize="16" fill="#E8E5DF">
                  22
                </text>
              </g>
            </g>
          </g>

          {/* The kid */}
          <g id="char">
            <g id="charBob">
              <Character />
              <g id="arm" transform="translate(100,-450)">
                <RightArm />
              </g>
            </g>
          </g>

          {/* Comic bursts */}
          <g id="click" transform="translate(-90,-95)">
            <polygon
              points="1010,470 1030,515 1080,500 1050,540 1095,570 1045,575 1050,625 1015,590 980,625 982,578 935,575 975,545 950,505 995,515"
              fill={RED}
              stroke="#0b0b0b"
              strokeWidth="4"
            />
            <text x="1015" y="560" textAnchor="middle" fontFamily="var(--font-permanent-marker), sans-serif" fontSize="34" fill="#E8E5DF" stroke="#0b0b0b" strokeWidth="1.5">
              CLICK!
            </text>
          </g>
          <g id="swoosh">
            <text x="1120" y="400" textAnchor="middle" fontFamily="var(--font-permanent-marker), sans-serif" fontSize="110" fill="#E8E5DF" stroke="#0b0b0b" strokeWidth="5">
              SWOOSH!
            </text>
          </g>
        </g>
      </g>

      {/* Screen-space FX */}
      <g id="speed" stroke="#E8E5DF" strokeWidth="3" opacity="0">
        {Array.from({ length: 36 }, (_, i) => {
          const a = (i / 36) * Math.PI * 2;
          const r1 = 380 + (i % 3) * 60;
          return <line key={i} x1={800 + Math.cos(a) * r1} y1={500 + Math.sin(a) * r1} x2={800 + Math.cos(a) * 1200} y2={500 + Math.sin(a) * 1200} />;
        })}
      </g>
      <rect id="flash" width="1600" height="1000" fill="#E8E5DF" />
    </svg>
  );
}
