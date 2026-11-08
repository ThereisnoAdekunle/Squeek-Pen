import type { CSSProperties } from "react";
import Hamster from "./Hamster";
import type { Direction } from "@/lib/game";
import type { Activity } from "@/lib/activity";
import { flightMs, type Twist } from "@/rules/hamster";

export function Football({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <defs>
        <radialGradient id="ball-shade" cx=".32" cy=".25" r=".8">
          <stop stopColor="#fff" />
          <stop offset=".65" stopColor="#e9edf3" />
          <stop offset="1" stopColor="#8394a8" />
        </radialGradient>
      </defs>
      <circle cx="24" cy="24" r="23" fill="url(#ball-shade)" />
      <path
        d="M21 12L32 17L30 29L17 31L12 20ZM2 18L9 11L8 4M36 5L38 15L47 19M43 38L32 39L27 47M8 40L10 31L2 26"
        fill="#17273c"
      />
      <path
        d="M23 1L21 12M32 17L38 15M30 29L33 39M17 31L10 31M12 20L9 11"
        stroke="#8a99a8"
        strokeWidth="1"
      />
    </svg>
  );
}

export default function Pitch({
  phase,
  shot,
  dive,
  goal,
  activity,
  matchPoint,
  role,
  timedOut,
  twist,
}: {
  phase: string;
  shot: Direction | null;
  dive: Direction | null;
  goal: boolean | null;
  activity: Activity | null;
  matchPoint: boolean;
  role: "kick" | "save";
  timedOut: boolean;
  twist: Twist | null;
}) {
  const reveal =
    phase === "flight" || phase === "result" || phase === "finished";
  const laneX = (lane: Direction | null) =>
    lane === "left" ? -140 : lane === "right" ? 140 : 0;
  // A long-reach save stretches most of the way across to the ball.
  const keeperX =
    twist === "long-reach"
      ? Math.round(laneX(dive) * 0.35 + laneX(shot) * 0.65)
      : laneX(dive);
  const style = {
    "--shot-x": shot === "left" ? "-116px" : shot === "right" ? "116px" : "0px",
    "--dive-x": `${keeperX}px`,
    "--dive-rot":
      dive === "left" ? "-58deg" : dive === "right" ? "58deg" : "0deg",
    "--flight-time": `${flightMs(activity, matchPoint)}ms`,
  } as CSSProperties;
  const advantage =
    activity === "Zoomies"
      ? "advantage-kicker"
      : activity === "Nap"
        ? "advantage-keeper"
        : "";
  return (
    <div
      className={`pitch ${advantage} ${reveal ? "revealing" : ""} ${phase === "runup" ? "runup" : ""} ${phase === "result" && goal ? "goal-shake" : ""} ${matchPoint ? "dramatic" : ""} activity-${activity?.toLowerCase() || "unknown"}`}
      style={style}
    >
      <svg
        className="stadium"
        viewBox="0 0 800 500"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="sky" x2="0" y2="1">
            <stop stopColor="#121e3b" />
            <stop offset="1" stopColor="#203b52" />
          </linearGradient>
          <linearGradient id="grass" x2="0" y2="1">
            <stop stopColor="#194d4f" />
            <stop offset="1" stopColor="#0b303b" />
          </linearGradient>
          <linearGradient id="beam" x2="0" y2="1">
            <stop stopColor="#92c5ef" stopOpacity=".14" />
            <stop offset="1" stopColor="#91caf1" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="post" x1="0" x2="1">
            <stop stopColor="#7c9aa8" />
            <stop offset=".45" stopColor="#f3faff" />
            <stop offset="1" stopColor="#a2c4d3" />
          </linearGradient>
          <radialGradient id="spot">
            <stop stopColor="#76d7b7" stopOpacity=".12" />
            <stop offset="1" stopColor="#7de0b9" stopOpacity="0" />
          </radialGradient>
          <pattern
            id="net"
            width="21"
            height="19"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M0 0H21V19"
              fill="none"
              stroke="#a1c9d5"
              strokeWidth="1"
              opacity=".45"
            />
          </pattern>
          <pattern
            id="turf"
            width="18"
            height="22"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M2 13L3 10M12 21L14 18"
              stroke="#7cbba2"
              strokeWidth=".65"
              opacity=".13"
            />
          </pattern>
          <symbol id="crowd" viewBox="0 0 28 29">
            <ellipse cx="14" cy="24" rx="12" ry="7" fill="currentColor" />
            <circle cx="6" cy="7" r="5" fill="#b28b70" />
            <circle cx="22" cy="7" r="5" fill="#b28b70" />
            <ellipse cx="14" cy="15" rx="12" ry="11" fill="#d9af81" />
            <ellipse cx="14" cy="20" rx="9" ry="6" fill="#ecd9b6" />
            <circle cx="9" cy="13" r="1.7" fill="#352f34" />
            <circle cx="19" cy="13" r="1.7" fill="#352f34" />
            <path d="M12 18L14 20L16 18" fill="#9f625e" />
          </symbol>
        </defs>
        <path fill="url(#sky)" d="M0 0H800V500H0Z" />
        <circle cx="577" cy="73" r="24" fill="#cad9ed" opacity=".06" />
        <path d="M0 68Q400 174 800 68V228H0Z" fill="#131f33" />
        <path
          d="M0 112Q400 202 800 112M0 155Q400 232 800 155M0 196Q400 258 800 196"
          fill="none"
          stroke="#2b3a4b"
          strokeWidth="4"
        />
        <g className="crowd-row" opacity=".8">
          {Array.from({ length: 25 }, (_, i) => (
            <use
              key={i}
              href="#crowd"
              x={i * 34 - 20}
              y={125 + Math.sin((i / 25) * Math.PI) * 43}
              width="27"
              height="29"
              color={
                i % 3 === 0 ? "#517eb9" : i % 3 === 1 ? "#cc8752" : "#728088"
              }
            />
          ))}
          {Array.from({ length: 21 }, (_, i) => (
            <use
              key={`b${i}`}
              href="#crowd"
              x={i * 40 - 11}
              y={166 + Math.sin((i / 21) * Math.PI) * 30}
              width="30"
              height="32"
              color={i % 2 ? "#d59150" : "#5384b9"}
            />
          ))}
        </g>
        <path d="M0 214H800V253H0Z" fill="#142a3d" />
        <path d="M0 216H800" stroke="#4c9ae3" strokeWidth="2" opacity=".55" />
        <path d="M0 249H800V500H0Z" fill="url(#grass)" />
        <path
          d="M160 249H249L166 500H0ZM335 249H421L448 500H282ZM506 249H591L728 500H567Z"
          fill="#c0e7b7"
          opacity=".025"
        />
        <path d="M0 250H800V500H0Z" fill="url(#turf)" />
        <ellipse cx="400" cy="372" rx="350" ry="170" fill="url(#spot)" />
        {/* Goal line, six-yard box and penalty area, drawn in perspective. */}
        <path
          d="M0 310H800M250 310L232 352H568L550 310M120 310L40 490H760L680 310"
          stroke="#b3e4d0"
          strokeWidth="2"
          opacity=".28"
          fill="none"
        />
        {/* Penalty spot with a dashed guide and distance tag back to the goal. */}
        <path
          d="M400 424V322"
          stroke="#e3f6ff"
          strokeWidth="2"
          strokeDasharray="7 9"
          strokeLinecap="round"
          opacity=".34"
        />
        <path d="M391 322H409M392 318V326M408 318V326" stroke="#e3f6ff" strokeWidth="2" opacity=".4" fill="none" />
        <g opacity=".85">
          <rect x="415" y="360" width="58" height="26" rx="13" fill="#0b263a" opacity=".72" />
          <text x="444" y="378" textAnchor="middle" fontSize="16" fontWeight="700" fill="#d7efff">
            11 m
          </text>
        </g>
        <ellipse cx="400" cy="436" rx="19" ry="7" fill="none" stroke="#e3f6ff" strokeWidth="2" opacity=".4" />
        <ellipse cx="400" cy="436" rx="8" ry="3.2" fill="#f4fbff" opacity=".95" />
        <g opacity=".8">
          <path d="M91 42L-40 400H400Z" fill="url(#beam)" />
          <path d="M709 42L840 400H400Z" fill="url(#beam)" />
        </g>
        <g stroke="#4c667d" strokeWidth="5">
          <path d="M88 30V158M712 30V158" />
        </g>
        <g fill="#f3f7d8" stroke="#708b9e" strokeWidth="3">
          {[0, 1, 2, 3].map((i) => (
            <g key={i}>
              <rect x={62 + i * 15} y="29" width="11" height="10" rx="2" />
              <rect x={687 + i * 15} y="29" width="11" height="10" rx="2" />
            </g>
          ))}
        </g>
        {/* The goal and keeper sit further away: drawn at 80% around the middle of the goal line. */}
        <g transform="translate(400 310) scale(0.8) translate(-400 -310)">
          <path
            d="M223 188L244 166H556L577 188V312H223Z"
            fill="#091c2a"
            opacity=".5"
          />
          <g className="goal-net">
            <path d="M225 191L247 171H553L575 191V310H225Z" fill="url(#net)" />
            <path
              d="M225 191H575M247 171V290H553V171M225 310L247 290M575 310L553 290"
              stroke="#95acbd"
              opacity=".55"
              fill="none"
            />
          </g>
          <path
            d="M224 312V188H576V312"
            stroke="#09232b"
            strokeWidth="12"
            strokeLinecap="round"
            fill="none"
            opacity=".3"
            transform="translate(3 3)"
          />
          <path
            d="M224 310V188H576V310"
            stroke="url(#post)"
            strokeWidth="7"
            strokeLinecap="round"
            fill="none"
          />
          <path d="M227 190H573" stroke="#e4fcff" strokeWidth="2" opacity=".8" />
          <g className="goalkeeper-position" transform="translate(350 222)">
            <foreignObject
              x="-10"
              y="-4"
              width="120"
              height="136"
              overflow="visible"
            >
              <div className="goalkeeper">
                <Hamster
                  color={role === "kick" ? "orange" : "blue"}
                  sleepy={activity === "Nap"}
                />
              </div>
            </foreignObject>
          </g>
          {activity === "Nap" && !reveal && (
            <g fill="#a8c5ef" opacity=".8">
              <path
                d="M456 218H466L456 229H466M470 203H478L470 212H478"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
              />
            </g>
          )}
        </g>
        <ellipse
          className="ball-shadow"
          cx="400"
          cy="442"
          rx="17"
          ry="5"
          fill="#031a25"
          opacity=".5"
        />
        <g transform="translate(294 356)">
          <foreignObject
            x="0"
            y="0"
            width="98"
            height="111"
            overflow="visible"
          >
            <div className="kicker">
              <Hamster color={role === "kick" ? "blue" : "orange"} back />
            </div>
          </foreignObject>
        </g>
        {activity === "Zoomies" && (
          <g className="sparkles" fill="#ffcb6c" transform="translate(4 70)">
            <path d="M318 332L321 322L324 332L334 335L324 338L321 348L318 338L308 335ZM292 369L294 362L296 369L303 371L296 373L294 380L292 373L285 371ZM366 315L368 308L370 315L377 317L370 319L368 326L366 319L359 317Z" />
          </g>
        )}
        <foreignObject
          x="381"
          y="403"
          width="38"
          height="38"
          overflow="visible"
        >
          <div className={`flying-ball ${reveal ? "fly" : ""}`}>
            <Football />
          </div>
        </foreignObject>
        {phase === "choose" && (
          <g className="scene-targets" aria-hidden="true">
            {[-116, 0, 116].map((dx) => (
              <g key={dx}>
                <circle cx={400 + dx} cy="258" r="16" fill="none" stroke="#e2f2ff" strokeWidth="2" strokeDasharray="4 5" opacity=".6" />
                <path d={`M${400 + dx - 5} 258H${400 + dx + 5}M${400 + dx} 253V263`} stroke="#d2e9f6" strokeWidth="2" opacity=".7" />
              </g>
            ))}
          </g>
        )}
        {phase === "result" && !goal && (
          <g className="dust" fill="#c0b79c" opacity=".6">
            <ellipse cx={400 + keeperX * 0.8} cy="307" rx="34" ry="10" />
            <circle cx={400 + keeperX * 0.8 - 24} cy="297" r="11" />
            <circle cx={400 + keeperX * 0.8 + 20} cy="299" r="9" />
          </g>
        )}
        <path
          d="M0 487Q400 456 800 487"
          stroke="#80bfa7"
          strokeWidth="2"
          opacity=".15"
          fill="none"
        />
      </svg>
      {phase === "choose" && (
        <div className="pitch-role">
          <span className="tiny-dot" />
          {role === "kick" ? "You’re taking the shot" : "You’re in goal"}
        </div>
      )}
      {phase === "result" && (
        <div className={`result-callout ${goal ? "scored" : "saved"}`}>
          <strong>
            {timedOut
              ? "Time’s up"
              : twist === "too-fast"
                ? "Too fast!"
                : twist === "long-reach"
                  ? "Long reach!"
                  : goal
                    ? "Goooal!"
                    : "What a save!"}
          </strong>
          <span>
            {timedOut
              ? "The shot clock wins this one."
              : twist === "too-fast"
                ? "Zoomies ball. The keeper read it and still got beat."
                : twist === "long-reach"
                  ? "Nap-slowed ball. The keeper stretched a lane over."
                  : shot === dive
                    ? "Great minds. Same direction."
                    : "Sent the keeper the wrong way."}
          </span>
        </div>
      )}
      {phase === "runup" && (
        <div className="locked-label">Locked in. Here we go…</div>
      )}
      {phase === "flight" && matchPoint && (
        <div className="locked-label">The pressure is tiny. And enormous.</div>
      )}
    </div>
  );
}