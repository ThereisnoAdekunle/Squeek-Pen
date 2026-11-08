"use client";
import { useCallback, useEffect, useState } from "react";
import type { Leaderboard, MyPrediction, PickChoice } from "@/lib/arena";

const POLL_MS = 30000;

function endpoint(host: string | null | undefined, path: string) {
  try {
    return host ? new URL(path, host).toString() : null;
  } catch {
    return null;
  }
}

/** Reads the leaderboard and the player's prediction from the game server. */
export function useArena({
  host,
  token,
}: {
  host: string | null | undefined;
  token: string | null;
}) {
  const [board, setBoard] = useState<Leaderboard | null>(null);
  const [mine, setMine] = useState<MyPrediction | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const available = Boolean(endpoint(host, "/leaderboard"));

  useEffect(() => {
    const url = endpoint(host, "/leaderboard");
    if (!url) return;
    const controller = new AbortController();
    const load = async () => {
      if (document.hidden) return;
      try {
        const response = await fetch(url, { signal: controller.signal, cache: "no-cache" });
        if (response.ok) setBoard((await response.json()) as Leaderboard);
      } catch {}
    };
    load();
    const interval = setInterval(load, POLL_MS);
    document.addEventListener("visibilitychange", load);
    return () => {
      controller.abort();
      clearInterval(interval);
      document.removeEventListener("visibilitychange", load);
    };
  }, [host]);

  useEffect(() => {
    const url = endpoint(host, "/prediction");
    if (!url || !token) {
      setMine(null);
      return;
    }
    const controller = new AbortController();
    const load = async () => {
      if (document.hidden) return;
      try {
        const response = await fetch(url, {
          signal: controller.signal,
          cache: "no-cache",
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) setMine((await response.json()) as MyPrediction);
      } catch {}
    };
    load();
    const interval = setInterval(load, POLL_MS);
    document.addEventListener("visibilitychange", load);
    return () => {
      controller.abort();
      clearInterval(interval);
      document.removeEventListener("visibilitychange", load);
    };
  }, [host, token]);

  const predict = useCallback(
    async (choice: PickChoice) => {
      const url = endpoint(host, "/predict");
      if (!url || !token) return;
      setBusy(true);
      setError("");
      try {
        const response = await fetch(url, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ choice }),
        });
        const body = await response.json().catch(() => null);
        if (response.ok) setMine(body as MyPrediction);
        else setError(body?.error || "Could not place your guess. Try again.");
      } catch {
        setError("Could not reach the game server. Try again.");
      } finally {
        setBusy(false);
      }
    },
    [host, token],
  );

  return { available, board, mine, busy, error, predict };
}