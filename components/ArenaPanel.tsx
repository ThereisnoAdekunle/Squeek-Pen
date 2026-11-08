"use client";
import { useState } from "react";
import { Sparkles } from "lucide-react";
import { PREDICTION_POINTS, type LeaderRow, type PickChoice } from "@/lib/arena";
import { useArena } from "./useArena";

const tabs = [
  { id: "zoomies", label: "Zoomies goals" },
  { id: "oracles", label: "Oracles" },
] as const;

function Rows({ rows, empty, unit }: { rows: LeaderRow[]; empty: string; unit: string }) {
  if (!rows.length) return <p className="arena-empty">{empty}</p>;
  return (
    <ol className="arena-rows">
      {rows.slice(0, 5).map((row, index) => (
        <li key={row.handle} className="arena-row">
          <span className="arena-rank">{index + 1}</span>
          {row.avatar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img className="arena-avatar" src={row.avatar} alt="" width={22} height={22} referrerPolicy="no-referrer" />
          ) : (
            <span className="arena-avatar" aria-hidden="true" />
          )}
          <span className="arena-name">{row.handle}</span>
          <span className="arena-value">
            {row.value} {unit}
          </span>
        </li>
      ))}
    </ol>
  );
}

/** Zoomies leaderboard and the "will the next settled round be Zoomies?" guess. */
export default function ArenaPanel({
  host,
  token,
  authenticated,
  onLogin,
  settledRound,
}: {
  host: string | null | undefined;
  token: string | null;
  authenticated: boolean;
  onLogin: () => void;
  settledRound: string | null;
}) {
  const arena = useArena({ host, token: authenticated ? token : null });
  const [tab, setTab] = useState<(typeof tabs)[number]["id"]>("zoomies");
  if (!arena.available) return null;
  const { mine } = arena;
  const pending = mine?.pending ?? null;
  const last = mine?.last ?? null;
  const placed = (choice: PickChoice) => () => arena.predict(choice);

  return (
    <section className="arena-card" aria-label="Wheel predictions and Zoomies leaderboard">
      <div className="live-heading">
        <span>
          <Sparkles size={14} aria-hidden="true" /> Call the wheel
        </span>
        {authenticated && mine ? (
          <span className="arena-points">{mine.points} pts</span>
        ) : null}
      </div>
      <h3 className="arena-question">Will the next settled round be Zoomies?</h3>
      <p className="arena-note">
        {pending
          ? `Your guess is in. It settles on the first round after #${pending.afterRound}.`
          : `Guess before the wheel settles${settledRound ? ` round #${Number(settledRound) + 1}` : ""}. A right call earns ${PREDICTION_POINTS} points.`}
      </p>
      {!authenticated ? (
        <button className="arena-login" type="button" onClick={onLogin}>
          Connect with X to guess
        </button>
      ) : pending ? (
        <p className="arena-status" role="status">
          You said: <strong>{pending.choice === "Zoomies" ? "Zoomies" : "Not Zoomies"}</strong>
        </p>
      ) : (
        <div className="arena-picks">
          <button type="button" className="arena-pick" disabled={arena.busy} onClick={placed("Zoomies")}>
            Zoomies
          </button>
          <button type="button" className="arena-pick" disabled={arena.busy} onClick={placed("Other")}>
            Not Zoomies
          </button>
        </div>
      )}
      {arena.error ? (
        <p className="arena-result arena-miss" role="alert">
          {arena.error}
        </p>
      ) : null}
      {last ? (
        <p className={`arena-result ${last.correct ? "arena-win" : "arena-miss"}`} role="status">
          {last.correct
            ? `Called it! +${last.points} points. Round #${last.round} was ${last.outcome}.`
            : `Missed it. Round #${last.round} was ${last.outcome}.`}
        </p>
      ) : null}

      <div className="arena-tabs" role="tablist" aria-label="Leaderboards">
        {tabs.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={tab === item.id}
            className="arena-tab"
            onClick={() => setTab(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div className="arena-board" role="tabpanel">
        {tab === "zoomies" ? (
          <Rows
            rows={arena.board?.zoomies ?? []}
            unit="goals"
            empty="No Zoomies goals yet. They count in online matches played while the wheel is on Zoomies."
          />
        ) : (
          <Rows rows={arena.board?.oracles ?? []} unit="pts" empty="No correct calls yet. Be the first oracle." />
        )}
      </div>
    </section>
  );
}