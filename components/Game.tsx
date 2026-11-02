"use client";
import dynamic from "next/dynamic";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronRight,
  CircleHelp,
  Clock3,
  Copy,
  Crosshair,
  ExternalLink,
  Gamepad2,
  LoaderCircle,
  LockKeyhole,
  LogOut,
  Radio,
  RotateCcw,
  Shield,
  Sparkles,
  Swords,
  Target,
  Trophy,
  Users,
  Volume2,
  VolumeX,
  X,
  Zap,
} from "lucide-react";
import Hamster from "./Hamster";
import Pitch, { Football } from "./Pitch";
import Modal from "./Modal";
import { guestAuth, type AuthState } from "./auth";
import {
  directions,
  isMatchPoint,
  isSuddenDeath,
  newMatch,
  randomDirection,
  resolveKick,
  shootoutRound,
  type Direction,
  type Match,
} from "@/lib/game";
import { parseActivity, type LiveActivity } from "@/lib/activity";
import { sound, unlockAudio } from "@/lib/sound";
import { useOnlineMatch } from "./useOnlineMatch";

const PrivyAuth = dynamic(() => import("./PrivyAuth"), { ssr: false });
type Phase =
  | "idle"
  | "choose"
  | "locked"
  | "runup"
  | "flight"
  | "result"
  | "finished";
type Mode = "practice" | "friend" | "quick";
type Dialog =
  | "tutorial"
  | "help"
  | "login"
  | "online"
  | "leave"
  | "account"
  | null;
type Config = { privyAppId: string | null; partyHost: string | null };

function XMark({ size = 18 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M18.9 2H22l-6.8 7.8L23.2 22h-6.3L12 14.6 5.5 22H2.3l7.5-8.6L.8 2h6.5l4.4 6.7L18.9 2ZM17.8 20h1.7L6.3 3.9H4.5L17.8 20Z" />
    </svg>
  );
}
function Avatar({
  avatar,
  orange = false,
}: {
  avatar?: string | null;
  orange?: boolean;
}) {
  return (
    <span className={`avatar ${orange ? "avatar-orange" : ""}`}>
      <Hamster color={orange ? "orange" : "blue"} />
      {avatar && (
        <img
          src={avatar}
          alt=""
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />
      )}
    </span>
  );
}

export default function Game() {
  const [config, setConfig] = useState<Config>({
    privyAppId: null,
    partyHost: null,
  });
  const [auth, setAuth] = useState<AuthState>(guestAuth);
  const [match, setMatch] = useState<Match>(newMatch);
  const [phase, setPhase] = useState<Phase>("idle");
  const [mode, setMode] = useState<Mode>("practice");
  const [dialog, setDialog] = useState<Dialog>(null);
  const [soundOn, setSoundOn] = useState(true);
  const [timeLeft, setTimeLeft] = useState(10);
  const [shot, setShot] = useState<Direction | null>(null);
  const [dive, setDive] = useState<Direction | null>(null);
  const [goal, setGoal] = useState<boolean | null>(null);
  const [live, setLive] = useState<LiveActivity | null>(null);
  const [feedState, setFeedState] = useState<"loading" | "live" | "offline">(
    "loading",
  );
  const [stats, setStats] = useState({ played: 0, won: 0, streak: 0 });
  const [copied, setCopied] = useState(false);
  const [roomInput, setRoomInput] = useState("");
  const [roomError, setRoomError] = useState("");
  const [announcement, setAnnouncement] = useState("");
  const [showIntro, setShowIntro] = useState(true);
  const phaseRef = useRef<Phase>("idle");
  const matchRef = useRef(match);
  const aiChoice = useRef<Direction>("left");
  const deadline = useRef(0);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const soundRef = useRef(soundOn);
  const recordedMatch = useRef(false);
  const online = useOnlineMatch({ host: config.partyHost, token: auth.token });
  const onlineActive = online.state !== "idle";
  const me = online.playerIndex ?? 0;
  const playerHandle = auth.handle || "You";
  const activeKicker =
    (phase === "result" || phase === "finished") && match.kicks.length
      ? match.kicks.at(-1)!.kicker
      : match.kicker;
  const role = activeKicker === (onlineActive ? me : 0) ? "kick" : "save";
  const opponent = onlineActive
    ? online.players.find((p) => p.id !== auth.id)
    : null;
  const opponentHandle = opponent?.handle || "Nibbles";
  const activity = feedState === "live" ? live?.current || null : null;
  const transition = useCallback((p: Phase) => {
    phaseRef.current = p;
    setPhase(p);
  }, []);
  const later = useCallback((fn: () => void, ms: number) => {
    timers.current.push(setTimeout(fn, ms));
  }, []);
  const clearTimers = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }, []);
  useEffect(() => {
    matchRef.current = match;
  }, [match]);
  useEffect(() => {
    soundRef.current = soundOn;
  }, [soundOn]);
  useEffect(() => () => clearTimers(), [clearTimers]);
  useEffect(() => {
    fetch("./game-config.json")
      .then((r) => {
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then((c) => {
        if (typeof c.privyAppId === "string" && c.privyAppId)
          setAuth({ ...guestAuth, ready: false });
        setConfig({
          privyAppId:
            typeof c.privyAppId === "string" && c.privyAppId
              ? c.privyAppId
              : null,
          partyHost:
            typeof c.partyHost === "string" && c.partyHost ? c.partyHost : null,
        });
      })
      .catch(() => {});
    try {
      const saved = JSON.parse(localStorage.getItem("squeek-stats") || "null");
      if (
        saved &&
        ["played", "won", "streak"].every(
          (k) => Number.isSafeInteger(saved[k]) && saved[k] >= 0,
        )
      )
        setStats(saved);
      const muted = localStorage.getItem("squeek-muted");
      if (muted === "true") setSoundOn(false);
    } catch {}
    const t = setTimeout(() => setShowIntro(false), 900);
    return () => clearTimeout(t);
  }, []);
  useEffect(() => {
    let disposed = false;
    let pending = false;
    let controller: AbortController;
    async function refresh() {
      if (document.hidden || pending) return;
      pending = true;
      controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 7000);
      try {
        const [a, b] = await Promise.all(
          ["status", "core"].map(async (p) => {
            const r = await fetch(`https://api.squeekchain.com/v1/${p}`, {
              signal: controller.signal,
              cache: "no-cache",
            });
            if (!r.ok) throw new Error();
            return r.json();
          }),
        );
        const data = parseActivity(a, b);
        if (!disposed) {
          setLive(data);
          setFeedState("live");
        }
      } catch {
        if (!disposed) setFeedState("offline");
      } finally {
        pending = false;
        clearTimeout(timeout);
      }
    }
    refresh();
    const interval = setInterval(refresh, 15000);
    document.addEventListener("visibilitychange", refresh);
    return () => {
      disposed = true;
      controller?.abort();
      clearInterval(interval);
      document.removeEventListener("visibilitychange", refresh);
    };
  }, []);
  const beginTurn = useCallback(
    (next: Match) => {
      matchRef.current = next;
      setMatch(next);
      setShot(null);
      setDive(null);
      setGoal(null);
      aiChoice.current = randomDirection();
      deadline.current = Date.now() + 10000;
      setTimeLeft(10);
      transition("choose");
      setAnnouncement(
        next.kicker === 0
          ? "Your shot. Choose left, center, or right."
          : "Your turn in goal. Choose where to dive.",
      );
    },
    [transition],
  );
  const startPractice = useCallback(() => {
    clearTimers();
    online.leave();
    setMode("practice");
    setDialog(null);
    recordedMatch.current = false;
    unlockAudio().then(() => sound("whistle", soundRef.current));
    beginTurn(newMatch());
  }, [beginTurn, clearTimers, online.leave]);
  function requestStart() {
    if (mode !== "practice") {
      setDialog("online");
      return;
    }
    try {
      if (localStorage.getItem("squeek-tutorial") !== "seen") {
        setDialog("tutorial");
        return;
      }
    } catch {}
    startPractice();
  }
  const animateKick = useCallback(
    (next: Match) => {
      const kick = next.kicks.at(-1)!;
      setShot(kick.shot);
      setDive(kick.dive);
      setGoal(kick.goal);
      transition("runup");
      const dramatic = isMatchPoint(matchRef.current);
      const speed = dramatic ? 1300 : activity === "Zoomies" ? 650 : 850;
      later(() => {
        transition("flight");
        sound("kick", soundRef.current);
      }, 500);
      later(() => {
        transition("result");
        setMatch(next);
        matchRef.current = next;
        sound(kick.goal ? "goal" : "save", soundRef.current);
        setAnnouncement(
          `${kick.goal ? "Goal" : "Saved"}. ${kick.kicker === 0 ? playerHandle : opponentHandle} ${next.score[kick.kicker]}. Score ${next.score[me]} to ${next.score[me === 0 ? 1 : 0]}.`,
        );
      }, 500 + speed);
      later(
        () => {
          if (next.winner !== null) {
            transition("finished");
            sound("win", soundRef.current);
          } else if (!onlineActive) beginTurn(next);
          else {
            transition("locked");
          }
        },
        500 + speed + 1300,
      );
    },
    [
      activity,
      beginTurn,
      later,
      me,
      online.deadline,
      onlineActive,
      opponentHandle,
      playerHandle,
      transition,
    ],
  );
  const choose = useCallback(
    (direction: Direction, timedOut = false) => {
      if (phaseRef.current !== "choose") return;
      unlockAudio();
      if (onlineActive) {
        online.choose(direction);
        transition("locked");
        setAnnouncement("Choice locked. Waiting for the other player.");
        return;
      }
      const current = matchRef.current;
      let shoot = current.kicker === 0 ? direction : aiChoice.current;
      let defend = current.kicker === 0 ? aiChoice.current : direction;
      if (timedOut && current.kicker === 1)
        defend = directions[(directions.indexOf(shoot) + 1) % 3];
      const next = resolveKick(
        current,
        shoot,
        defend,
        timedOut && current.kicker === 0,
      );
      animateKick(next);
    },
    [animateKick, onlineActive, online.choose, transition],
  );
  useEffect(() => {
    if (phase !== "choose" || onlineActive) return;
    if (dialog) {
      const pausedAt = Date.now();
      return () => {
        deadline.current += Date.now() - pausedAt;
      };
    }
    const interval = setInterval(() => {
      const left = Math.max(
        0,
        Math.ceil((deadline.current - Date.now()) / 1000),
      );
      setTimeLeft(left);
      if (left === 0) choose(randomDirection(), true);
    }, 100);
    return () => clearInterval(interval);
  }, [phase, choose, onlineActive, dialog]);
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (
        dialog ||
        phaseRef.current !== "choose" ||
        e.altKey ||
        e.ctrlKey ||
        e.metaKey ||
        e.repeat
      )
        return;
      if (
        (e.target as HTMLElement)?.closest(
          'input,textarea,[contenteditable="true"],dialog',
        )
      )
        return;
      const key: Record<string, Direction> = {
        ArrowLeft: "left",
        a: "left",
        ArrowDown: "center",
        ArrowUp: "center",
        s: "center",
        ArrowRight: "right",
        d: "right",
      };
      if (key[e.key]) {
        e.preventDefault();
        choose(key[e.key]);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [choose, dialog]);
  useEffect(() => {
    if (phase !== "finished" || recordedMatch.current || match.winner === null)
      return;
    recordedMatch.current = true;
    if (!onlineActive)
      setStats((previous) => {
        const won = match.winner === 0;
        const next = {
          played: previous.played + 1,
          won: previous.won + (won ? 1 : 0),
          streak: won ? previous.streak + 1 : 0,
        };
        try {
          localStorage.setItem("squeek-stats", JSON.stringify(next));
        } catch {}
        return next;
      });
  }, [phase, match.winner, onlineActive]);
  const onlineKickCount = useRef(0);
  useEffect(() => {
    if (!onlineActive || !online.match) return;
    const next = online.match;
    if (next.kicks.length > onlineKickCount.current) {
      onlineKickCount.current = next.kicks.length;
      animateKick(next);
    } else if (online.turnReady && next.winner === null) {
      if (next.kicks.length === 0) recordedMatch.current = false;
      onlineKickCount.current = next.kicks.length;
      setMatch(next);
      matchRef.current = next;
      setShot(null);
      setDive(null);
      setGoal(null);
      deadline.current = online.deadline;
      transition("choose");
      setDialog(null);
      setTimeLeft(10);
    }
  }, [
    online.match,
    online.state,
    onlineActive,
    online.deadline,
    online.turnReady,
  ]);
  useEffect(() => {
    if (!onlineActive || phase !== "choose") return;
    const t = setInterval(
      () =>
        setTimeLeft(
          Math.max(0, Math.ceil((online.deadline - Date.now()) / 1000)),
        ),
      200,
    );
    return () => clearInterval(t);
  }, [onlineActive, phase, online.deadline]);
  function goHome() {
    clearTimers();
    online.leave();
    setMode("practice");
    setMatch(newMatch());
    matchRef.current = newMatch();
    transition("idle");
    setDialog(null);
    setShot(null);
    setDive(null);
    setGoal(null);
    onlineKickCount.current = 0;
  }
  function toggleSound() {
    unlockAudio();
    const next = !soundOn;
    setSoundOn(next);
    try {
      localStorage.setItem("squeek-muted", String(!next));
    } catch {}
    if (next) sound("kick", true);
  }
  function login() {
    if (config.privyAppId) auth.login();
    else setDialog("login");
  }
  function pickMode(next: Mode) {
    if (phase !== "idle" && phase !== "finished") {
      setDialog("leave");
      return;
    }
    setMode(next);
    if (next !== "practice") setDialog("online");
  }
  function share() {
    const url = new URL(window.location.href);
    url.hash = "";
    url.search = "";
    const text = `${match.winner === me ? "Tiny paws. Massive W." : "I demand a rematch."} ${match.score[me]}–${match.score[me === 0 ? 1 : 0]} in SQUEEK PENALTY${onlineActive ? "" : " practice"}. Think you can beat the hamster? @squeekchain`;
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url.href)}`,
      "_blank",
      "noopener,noreferrer",
    );
  }
  async function connectRoom(kind: "create" | "join" | "quick") {
    setRoomError("");
    if (!auth.authenticated) {
      login();
      return;
    }
    if (!auth.token) {
      setRoomError(
        "Unable to confirm your X login. Sign out and connect again.",
      );
      return;
    }
    if (
      kind === "join" &&
      !/^[A-HJ-NP-Z2-9]{6}$/.test(roomInput.toUpperCase())
    ) {
      setRoomError("Enter the 6-character room code.");
      return;
    }
    onlineKickCount.current = 0;
    recordedMatch.current = false;
    clearTimers();
    transition("idle");
    await online.connect(
      kind,
      kind === "join" ? roomInput.toUpperCase() : undefined,
    );
  }
  const content = (
    <div className="app-shell">
      <a href="#arena" className="skip-link">
        Skip to game
      </a>
      <header className="site-header">
        <div className="header-inner">
          <a
            className="brand"
            href="#"
            aria-label="Squeek Penalty home"
            onClick={(e) => {
              e.preventDefault();
              if (phase !== "idle" && phase !== "finished") setDialog("leave");
              else goHome();
            }}
          >
            <span className="brand-mascot">
              <Hamster />
            </span>
            <span>
              SQUEEK
              <span className="brand-second">
                PENALTY<span className="brand-period">.</span>
              </span>
            </span>
          </a>
          <nav className="desktop-nav" aria-label="Main">
            <a href="#arena" className="active">
              The arena
            </a>
            <button onClick={() => setDialog("help")}>How to play</button>
          </nav>
          <div className="header-utilities">
            <button
              className="icon-button help-mobile"
              aria-label="How to play"
              onClick={() => setDialog("help")}
            >
              <CircleHelp size={20} />
            </button>
            <button
              className="icon-button"
              aria-label={soundOn ? "Mute sound" : "Enable sound"}
              aria-pressed={soundOn}
              onClick={toggleSound}
            >
              {soundOn ? <Volume2 size={20} /> : <VolumeX size={20} />}
            </button>
            <span className="header-divider" />
            <button
              className="connect-button"
              disabled={Boolean(config.privyAppId) && !auth.ready}
              aria-busy={Boolean(config.privyAppId) && !auth.ready}
              onClick={() =>
                auth.authenticated ? setDialog("account") : login()
              }
            >
              {auth.authenticated ? (
                <>
                  <Avatar avatar={auth.avatar} />
                  <span>{auth.handle}</span>
                </>
              ) : (
                <>
                  {config.privyAppId && !auth.ready ? (
                    <LoaderCircle className="spinner" size={18} />
                  ) : (
                    <XMark />
                  )}
                  <span>Connect with X</span>
                </>
              )}
            </button>
          </div>
        </div>
      </header>
      <main id="main-content" className="main-content">
        <div className={`intro-row ${showIntro ? "intro-enter" : ""}`}>
          <div>
            <h1>
              Tiny paws. <span>Big pressure.</span>
            </h1>
            <p>A fast 1v1 penalty shootout with very competitive hamsters.</p>
          </div>
          <div className="intro-meta">
            <span>
              <Clock3 size={16} />
              Under 2 minutes
            </span>
            <span>
              <Swords size={16} />
              Maximum hamster energy
            </span>
          </div>
        </div>
        <div className="game-layout">
          <section
            id="arena"
            className="arena"
            aria-label="Penalty shootout arena"
          >
            <div className="scene">
              <div className="scoreboard">
                <div className="player player-you">
                  <Avatar avatar={auth.avatar} />
                  <div>
                    <strong>{playerHandle}</strong>
                    <span>{onlineActive ? "Player" : "The challenger"}</span>
                  </div>
                </div>
                <div className="score-center">
                  <div className="score-numbers">
                    <strong>{match.score[me]}</strong>
                    <span>:</span>
                    <strong>{match.score[me === 0 ? 1 : 0]}</strong>
                  </div>
                  <span>
                    {phase === "idle"
                      ? "First to 3"
                      : isSuddenDeath(match)
                        ? "Sudden death"
                        : `Round ${Math.min(shootoutRound(match), 5)} of 5`}
                  </span>
                </div>
                <div className="player player-them">
                  <div>
                    <strong>{opponentHandle}</strong>
                    <span>{onlineActive ? "Opponent" : "Practice AI"}</span>
                  </div>
                  <Avatar avatar={opponent?.avatar} orange />
                </div>
              </div>
              <Pitch
                phase={phase}
                shot={shot}
                dive={dive}
                goal={goal}
                activity={activity}
                matchPoint={phase !== "idle" && isMatchPoint(match)}
                role={role}
                timedOut={phase === "result" && !!match.kicks.at(-1)?.timedOut}
              />
              <div className="pitch-corner">
                <span
                  className={`stadium-dot ${feedState === "live" ? "online" : ""}`}
                  aria-hidden="true"
                />
                {feedState === "live"
                  ? `Round #${live?.round} · Last: ${live?.outcome || "Unknown"}`
                  : "Live feed unavailable"}
              </div>
              <div className="pitch-corner pitch-corner-right">
                <Shield size={12} />
                {onlineActive ? "X verified" : "Practice arena"}
              </div>
              {phase === "finished" && (
                <div className="winner-overlay">
                  <div className="confetti" aria-hidden="true">
                    {Array.from({ length: 32 }, (_, i) => (
                      <i
                        key={i}
                        style={
                          {
                            "--i": i,
                            "--x": `${(i * 37) % 100}%`,
                            "--color": [
                              "#ffad5c",
                              "#5fa9ff",
                              "#c6edbf",
                              "#fff1d9",
                            ][i % 4],
                          } as CSSProperties
                        }
                      />
                    ))}
                  </div>
                  <div className="winner-hamster">
                    <Hamster color={match.winner === me ? "blue" : "orange"} />
                  </div>
                  <span className="winner-label">
                    <Trophy size={16} />
                    {match.winner === me
                      ? "Tiny paws. Massive W."
                      : `${opponentHandle} takes the win`}
                  </span>
                  <strong className="winner-score">
                    {match.score[me]} : {match.score[me === 0 ? 1 : 0]}
                  </strong>
                  <p>
                    {match.winner === me
                      ? "The crowd goes squeek."
                      : "A rematch has your name on it."}
                  </p>
                  <div className="winner-actions">
                    <button
                      className="primary-button"
                      onClick={() =>
                        onlineActive ? online.rematch() : startPractice()
                      }
                    >
                      <RotateCcw size={18} />
                      {online.rematchWaiting
                        ? "Rematch requested"
                        : "Play again"}
                    </button>
                    <button className="secondary-button" onClick={share}>
                      <XMark size={16} />
                      Share on X
                    </button>
                  </div>
                  <button className="text-button" onClick={goHome}>
                    Back to the arena
                  </button>
                </div>
              )}
            </div>
            <div className="game-controls">
              {phase === "idle" ? (
                <>
                  <div className="ready-copy">
                    <span className="control-icon">
                      <Crosshair size={22} />
                    </span>
                    <div>
                      <h2>Step up to the spot</h2>
                      <p>
                        {mode === "practice"
                          ? "Warm up against Nibbles, our practice AI."
                          : "Sign in with X to face another hamster."}
                      </p>
                    </div>
                  </div>
                  <button
                    className="primary-button start-button"
                    onClick={requestStart}
                  >
                    <Gamepad2 size={20} />
                    {mode === "practice" ? "Play practice" : "Play online"}
                    <ArrowRight size={18} />
                  </button>
                </>
              ) : phase === "finished" ? (
                <div className="finished-caption">
                  <Sparkles size={18} />
                  Tiny match. Big rematch energy.
                </div>
              ) : (
                <div className="direction-controls">
                  <div className="turn-heading">
                    <span
                      className={`role-label ${role === "save" ? "role-save" : ""}`}
                    >
                      {role === "kick" ? (
                        <Target size={16} />
                      ) : (
                        <Shield size={16} />
                      )}{" "}
                      {phase === "locked"
                        ? "Choice locked"
                        : role === "kick"
                          ? "Pick your shot"
                          : "Pick your dive"}
                    </span>
                    <span
                      className={`turn-timer ${timeLeft <= 3 ? "timer-urgent" : ""}`}
                    >
                      <Clock3 size={14} />
                      {phase === "choose" ? `${timeLeft}s` : "Revealing…"}
                    </span>
                  </div>
                  <div className="direction-buttons">
                    {directions.map((direction, i) => (
                      <button
                        key={direction}
                        disabled={phase !== "choose"}
                        className={`direction-button ${role === "save" ? "dive-button" : ""}`}
                        aria-label={`${role === "kick" ? "Shoot" : "Dive"} ${direction}`}
                        onClick={() => choose(direction)}
                      >
                        {i === 0 ? (
                          <ArrowLeft size={22} />
                        ) : i === 1 ? (
                          <ArrowDown size={22} />
                        ) : (
                          <ArrowRight size={22} />
                        )}
                        <span>
                          {direction[0].toUpperCase() + direction.slice(1)}
                        </span>
                        <kbd>{["A", "S", "D"][i]}</kbd>
                      </button>
                    ))}
                  </div>
                  <p className="direction-hint">
                    {phase === "locked"
                      ? "Waiting for your opponent. Your choice stays secret."
                      : phase === "choose"
                        ? role === "kick"
                          ? "Outsmart the keeper. Different directions = goal."
                          : "Read the shot. Match their direction to save."
                        : "Both choices are locked. Let the paws do the talking."}
                  </p>
                </div>
              )}
            </div>
            <div className="shootout-tracker">
              <div className="kick-dots">
                <span>You</span>
                {Array.from({ length: 5 }, (_, i) => {
                  const k = match.kicks.filter((k) => k.kicker === me)[i];
                  return (
                    <span
                      key={i}
                      className={`kick-dot ${k ? (k.goal ? "dot-goal" : "dot-save") : ""}`}
                      aria-label={`Your kick ${i + 1}: ${k ? (k.goal ? "goal" : "saved") : "not taken"}`}
                    >
                      {k ? (
                        k.goal ? (
                          <Check size={10} />
                        ) : (
                          <X size={10} />
                        )
                      ) : null}
                    </span>
                  );
                })}
              </div>
              <span className="tracker-middle">
                {isSuddenDeath(match)
                  ? `Sudden death · ${shootoutRound(match) - 5}`
                  : "Every kick counts"}
              </span>
              <div className="kick-dots">
                <span>{onlineActive ? "Rival" : "AI"}</span>
                {Array.from({ length: 5 }, (_, i) => {
                  const k = match.kicks.filter((k) => k.kicker !== me)[i];
                  return (
                    <span
                      key={i}
                      className={`kick-dot ${k ? (k.goal ? "dot-goal" : "dot-save") : ""}`}
                      aria-label={`Opponent kick ${i + 1}: ${k ? (k.goal ? "goal" : "saved") : "not taken"}`}
                    >
                      {k ? (
                        k.goal ? (
                          <Check size={10} />
                        ) : (
                          <X size={10} />
                        )
                      ) : null}
                    </span>
                  );
                })}
              </div>
            </div>
          </section>
          <aside className="sidebar">
            <section className="mode-panel">
              <div className="section-title">
                <h2>Find your match</h2>
                <Swords size={20} />
              </div>
              <p className="section-description">
                A little practice or a little friendly rivalry?
              </p>
              <div className="mode-options">
                <button
                  className={`mode-option ${mode === "practice" ? "selected" : ""}`}
                  onClick={() => pickMode("practice")}
                >
                  <span className="mode-icon">
                    <Gamepad2 size={23} />
                  </span>
                  <span>
                    <strong>Play practice</strong>
                    <span>Take on the practice AI</span>
                  </span>
                  {mode === "practice" ? (
                    <span className="selection-dot">
                      <Check size={12} />
                    </span>
                  ) : (
                    <ChevronRight size={17} />
                  )}
                </button>
                <button
                  className={`mode-option ${mode === "friend" ? "selected" : ""}`}
                  onClick={() => pickMode("friend")}
                >
                  <span className="mode-icon">
                    <Users size={23} />
                  </span>
                  <span>
                    <strong>Play a friend</strong>
                    <span>Start a private room</span>
                  </span>
                  <ChevronRight size={17} />
                </button>
                <button
                  className={`mode-option ${mode === "quick" ? "selected" : ""}`}
                  onClick={() => pickMode("quick")}
                >
                  <span className="mode-icon">
                    <Zap size={23} />
                  </span>
                  <span>
                    <strong>Quick match</strong>
                    <span>Find your next rival</span>
                  </span>
                  <ChevronRight size={17} />
                </button>
              </div>
              <div className="login-note">
                <LockKeyhole size={14} />
                <span>Online matches require X login.</span>
              </div>
            </section>
            <section className="hamster-live">
              <div className="live-heading">
                <span>
                  <span
                    className={`status-dot ${feedState === "live" ? "online" : ""}`}
                  />
                  {feedState === "live"
                    ? "Straight from the wheel"
                    : "The hamster connection"}
                </span>
                <Radio size={17} />
              </div>
              <div className="hamster-status">
                <div
                  className={`wheel-illustration ${activity === "Zoomies" ? "wheel-zoomies" : ""}`}
                >
                  <span className="wheel-ring" />
                  <Hamster color="orange" sleepy={activity === "Nap"} />
                </div>
                <div>
                  <h2>
                    {feedState === "loading"
                      ? "Checking in…"
                      : feedState === "offline"
                        ? "Taking a breather"
                        : activity === "Nap"
                          ? "Nap time"
                          : activity === "Zoomies"
                            ? "Full zoomies"
                            : "On a little jog"}
                  </h2>
                  <p>
                    {feedState === "live"
                      ? activity === "Nap"
                        ? "A sleepy keeper with the same fair odds."
                        : activity === "Zoomies"
                          ? "Sparkles and extra speedy little paws."
                          : "Classic kicks with a happy hamster."
                      : "Practice is always ready."}
                  </p>
                </div>
              </div>
              <div className="live-round">
                <span>
                  {feedState === "live" ? (
                    <>
                      Round <strong>#{live?.round}</strong>
                    </>
                  ) : (
                    "Live feed unavailable"
                  )}
                </span>
                <span>
                  {feedState === "live" ? (
                    <>
                      Last: <strong>{live?.outcome || "Unknown"}</strong>
                    </>
                  ) : (
                    <button
                      className="text-button"
                      onClick={() =>
                        window.open(
                          "https://squeekchain.com/",
                          "_blank",
                          "noopener,noreferrer",
                        )
                      }
                    >
                      Check the wheel <ArrowUpRight size={12} />
                    </button>
                  )}
                </span>
              </div>
              <a
                href="https://squeekchain.com/"
                target="_blank"
                rel="noreferrer"
                className="stream-link"
              >
                <span className="play-tiny">▶</span>Watch Squeektoshi
                <ArrowUpRight size={16} />
              </a>
            </section>
            <div className="personal-record">
              <Trophy size={20} />
              <div>
                <strong>
                  {stats.played
                    ? `${stats.won} ${stats.won === 1 ? "win" : "wins"}. ${stats.streak ? `${stats.streak} in a row.` : "Next one’s yours."}`
                    : "Your first win is waiting"}
                </strong>
                <span>
                  {stats.played
                    ? `${stats.played} practice ${stats.played === 1 ? "match" : "matches"} · saved on this device`
                    : "Your legend starts with one kick."}
                </span>
              </div>
            </div>
          </aside>
        </div>
        <section className="how-strip" aria-label="The quick rules">
          <div className="how-title">
            <Football />
            <h2>
              Three steps to
              <br />
              hamster glory
            </h2>
          </div>
          <div className="how-step">
            <span>1</span>
            <div>
              <strong>Pick a direction</strong>
              <p>Left, center, or right. Keep it secret.</p>
            </div>
          </div>
          <div className="how-step">
            <span>2</span>
            <div>
              <strong>Kick, save, switch</strong>
              <p>Match directions to save the shot.</p>
            </div>
          </div>
          <div className="how-step">
            <span>3</span>
            <div>
              <strong>Race to three</strong>
              <p>Reach three with equal turns to win.</p>
            </div>
          </div>
        </section>
        <footer className="site-footer">
          <a
            href="https://squeekchain.com/"
            target="_blank"
            rel="noreferrer"
            className="powered-badge"
          >
            <span className="powered-icon">
              <Hamster />
            </span>
            Powered by <strong>Squeekchain</strong>
            <ArrowUpRight size={14} />
          </a>
          <span>A fan-made game for the Squeekchain community.</span>
          <button className="text-button" onClick={() => setDialog("help")}>
            Game rules <ExternalLink size={13} />
          </button>
        </footer>
      </main>
      <div className="sr-only" role="status" aria-live="polite">
        {announcement}
      </div>
      <Modal
        open={dialog !== null}
        onClose={() => setDialog(null)}
        title={
          dialog === "tutorial" || dialog === "help"
            ? "A little paws-on training."
            : dialog === "login"
              ? "Your X. Your tiny legend."
              : dialog === "online"
                ? mode === "quick"
                  ? "Meet your next rival."
                  : "Bring a friend."
                : dialog === "leave"
                  ? "Leave this match?"
                  : "Your player profile"
        }
      >
        {(dialog === "tutorial" || dialog === "help") && (
          <>
            <div className="tutorial-art">
              <Hamster />
              <Football />
              <Hamster color="orange" />
            </div>
            <p className="modal-description">
              You and your rival secretly pick a direction. Then the chaos
              begins.
            </p>
            <ol className="tutorial-steps">
              <li>
                <span>1</span>
                <div>
                  <strong>Taking a shot?</strong>
                  <p>
                    Go where the keeper doesn’t. Different directions score a
                    goal.
                  </p>
                </div>
              </li>
              <li>
                <span>2</span>
                <div>
                  <strong>Protecting the net?</strong>
                  <p>
                    Guess the kicker’s direction. Match it to make the save.
                  </p>
                </div>
              </li>
              <li>
                <span>3</span>
                <div>
                  <strong>Take turns. Race to three.</strong>
                  <p>
                    Both players get equal turns. Tied after five kicks each?
                    Sudden death, one pair at a time.
                  </p>
                </div>
              </li>
            </ol>
            <p className="tutorial-timer">
              <Clock3 size={16} />
              10 seconds to choose. A missed choice forfeits your turn.
            </p>
            <button
              className="primary-button full-width"
              onClick={() => {
                try {
                  localStorage.setItem("squeek-tutorial", "seen");
                } catch {}
                if (dialog === "tutorial") startPractice();
                else setDialog(null);
              }}
            >
              {dialog === "tutorial" ? "Start my first match" : "Got it"}
              <ArrowRight size={18} />
            </button>
            <p className="modal-footnote">
              Keyboard crew: A / S / D or arrow keys.
            </p>
          </>
        )}
        {dialog === "login" && (
          <>
            <div className="login-art">
              <Hamster />
            </div>
            <p className="modal-description">
              Sign in with X to face friends and other players. Your avatar and
              handle come with you.
            </p>
            <div className="service-notice">
              <LockKeyhole size={20} />
              <div>
                <strong>X login isn’t enabled here yet.</strong>
                <p>
                  The arena needs its Privy connection before online play opens.
                  Free practice is ready right now.
                </p>
              </div>
            </div>
            <button
              className="primary-button full-width"
              onClick={startPractice}
            >
              <Gamepad2 size={18} />
              Play practice
            </button>
            <p className="modal-footnote">
              No wallet connection or seed phrase needed.
            </p>
          </>
        )}
        {dialog === "online" && (
          <>
            <div className="online-art">
              <Swords size={32} />
            </div>
            {!config.privyAppId || !config.partyHost ? (
              <>
                <p className="modal-description">
                  The next best thing to settling it on the pitch.
                </p>
                <div className="service-notice">
                  <LockKeyhole size={20} />
                  <div>
                    <strong>Online play is warming up.</strong>
                    <p>
                      X login and shared rooms aren’t enabled for this arena
                      yet. You can still take Nibbles to penalties.
                    </p>
                  </div>
                </div>
                <button
                  className="primary-button full-width"
                  onClick={startPractice}
                >
                  Play practice
                  <ArrowRight size={18} />
                </button>
              </>
            ) : !auth.authenticated ? (
              <>
                <p className="modal-description">
                  Connect with X to create a room, join a friend, or find
                  another player. No wallet setup.
                </p>
                <button className="primary-button full-width" onClick={login}>
                  <XMark />
                  Connect with X
                </button>
              </>
            ) : (
              <>
                <p className="modal-description">
                  {mode === "quick"
                    ? "Join the queue. We’ll pair you with the next waiting player."
                    : "Share a code. Settle it with penalties."}
                </p>
                {online.state === "connecting" || online.state === "waiting" ? (
                  <div className="waiting-room">
                    <LoaderCircle className="spinner" size={24} />
                    <strong>
                      {online.roomCode
                        ? `Room ${online.roomCode}`
                        : "Finding another player…"}
                    </strong>
                    <p>
                      {online.roomCode
                        ? "Send this code to your friend."
                        : "Keep this window open. Your match starts when they join."}
                    </p>
                    {online.roomCode && (
                      <button
                        className="secondary-button"
                        onClick={async () => {
                          try {
                            await navigator.clipboard.writeText(
                              online.roomCode!,
                            );
                            setCopied(true);
                          } catch {
                            setRoomError("Copy the room code shown above.");
                          }
                        }}
                      >
                        <Copy size={16} />
                        {copied ? "Copied" : "Copy room code"}
                      </button>
                    )}
                    <button
                      className="text-button"
                      onClick={() => online.leave()}
                    >
                      Cancel waiting
                    </button>
                  </div>
                ) : mode === "quick" ? (
                  <button
                    className="primary-button full-width"
                    onClick={() => connectRoom("quick")}
                  >
                    <Zap size={18} />
                    Find a match
                  </button>
                ) : (
                  <div className="room-form">
                    <button
                      className="primary-button full-width"
                      onClick={() => connectRoom("create")}
                    >
                      <Users size={18} />
                      Create a room
                    </button>
                    <span className="or-label">or join your friend</span>
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        connectRoom("join");
                      }}
                    >
                      <label htmlFor="room-code">Room code</label>
                      <div className="room-input-row">
                        <input
                          id="room-code"
                          value={roomInput}
                          onChange={(e) =>
                            setRoomInput(e.target.value.toUpperCase())
                          }
                          maxLength={6}
                          autoComplete="off"
                          autoCapitalize="characters"
                          placeholder="6-character code"
                          aria-invalid={!!roomError}
                          aria-describedby="room-error"
                        />
                        <button className="secondary-button" type="submit">
                          Join
                          <ArrowRight size={16} />
                        </button>
                      </div>
                    </form>
                  </div>
                )}
                <p id="room-error" className="form-error" role="alert">
                  {roomError || online.error}
                </p>
              </>
            )}
          </>
        )}
        {dialog === "leave" && (
          <>
            <p className="modal-description">
              Your current score will be cleared. A fresh pitch is always here
              when you’re ready.
            </p>
            <div className="modal-actions">
              <button
                className="secondary-button"
                onClick={() => setDialog(null)}
              >
                Keep playing
              </button>
              <button className="primary-button" onClick={goHome}>
                Leave match
              </button>
            </div>
          </>
        )}
        {dialog === "account" && (
          <>
            <div className="profile-summary">
              <Avatar avatar={auth.avatar} />
              <strong>{auth.handle}</strong>
              <span>Connected with X via Privy</span>
            </div>
            <button
              className="secondary-button full-width"
              onClick={() => {
                auth.logout();
                goHome();
              }}
            >
              <LogOut size={18} />
              Sign out
            </button>
          </>
        )}
      </Modal>
      {online.state === "disconnected" && (
        <div className="connection-banner" role="alert">
          <span>
            {online.error ||
              "The other player disconnected. Your match has ended."}
          </span>
          <button className="secondary-button" onClick={goHome}>
            Back to arena
          </button>
        </div>
      )}
    </div>
  );
  return (
    <>
      {content}
      {config.privyAppId && (
        <PrivyAuth appId={config.privyAppId} onState={setAuth}>
          {null}
        </PrivyAuth>
      )}
    </>
  );
}
