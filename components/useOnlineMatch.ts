"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Direction, Match, PlayerIndex } from "@/lib/game";
import type { Activity } from "@/lib/activity";
export type OnlinePlayer = {
  id: string;
  handle: string;
  avatar: string | null;
};
type ConnectKind = "create" | "join" | "quick" | "rejoin";
const MAX_REJOIN_ATTEMPTS = 6;
export function useOnlineMatch({
  host,
  token,
}: {
  host: string | null;
  token: string | null;
}) {
  const [state, setState] = useState<
    | "idle"
    | "connecting"
    | "waiting"
    | "playing"
    | "reconnecting"
    | "disconnected"
  >("idle");
  const [match, setMatch] = useState<Match | null>(null);
  const [players, setPlayers] = useState<OnlinePlayer[]>([]);
  const [playerIndex, setPlayerIndex] = useState<PlayerIndex | null>(null);
  const [roomCode, setRoomCode] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [deadline, setDeadline] = useState(0);
  const [rematchWaiting, setRematchWaiting] = useState(false);
  const [turnReady, setTurnReady] = useState(false);
  const [youLocked, setYouLocked] = useState(false);
  const [hamster, setHamster] = useState<Activity | null>(null);
  const [opponentAway, setOpponentAway] = useState(false);
  const [walkover, setWalkover] = useState(false);
  const socket = useRef<WebSocket | null>(null);
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const retry = useRef<ReturnType<typeof setTimeout> | null>(null);
  const attempts = useRef(0);
  const inMatch = useRef(false);
  const tokenRef = useRef(token);
  tokenRef.current = token;
  const close = useCallback(() => {
    if (timeout.current) clearTimeout(timeout.current);
    if (retry.current) clearTimeout(retry.current);
    const ws = socket.current;
    socket.current = null;
    if (ws) {
      ws.onclose = null;
      ws.onmessage = null;
      ws.close();
    }
  }, []);
  const leave = useCallback(() => {
    close();
    inMatch.current = false;
    attempts.current = 0;
    setState("idle");
    setRoomCode(null);
    setMatch(null);
    setPlayers([]);
    setPlayerIndex(null);
    setError("");
    setRematchWaiting(false);
    setTurnReady(false);
    setYouLocked(false);
    setHamster(null);
    setOpponentAway(false);
    setWalkover(false);
  }, [close]);
  useEffect(() => () => close(), [close]);
  const connect = useCallback(
    async (kind: ConnectKind, code?: string) => {
      if (!host || !tokenRef.current) {
        setError("Connect with X before joining a room.");
        if (kind === "rejoin") {
          inMatch.current = false;
          setState("disconnected");
        }
        return;
      }
      close();
      setError("");
      setState(kind === "rejoin" ? "reconnecting" : "connecting");
      setRematchWaiting(false);
      if (kind !== "rejoin") {
        inMatch.current = false;
        attempts.current = 0;
        setWalkover(false);
        setOpponentAway(false);
      }
      const base = new URL(host.startsWith("http") ? host : `https://${host}`);
      const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
      const values = new Uint8Array(6);
      crypto.getRandomValues(values);
      const room =
        kind === "quick"
          ? "matchmaking"
          : kind === "join" || kind === "rejoin"
            ? code!
            : Array.from(values, (n) => alphabet[n % alphabet.length]).join("");
      const url = new URL(`/parties/main/${room}`, base);
      url.protocol = url.protocol === "https:" ? "wss:" : "ws:";
      // A dropped match retries with backoff. The server holds the seat during this time.
      const lost = () => {
        if (inMatch.current && attempts.current < MAX_REJOIN_ATTEMPTS) {
          attempts.current += 1;
          setState("reconnecting");
          retry.current = setTimeout(() => {
            void connect("rejoin", room);
          }, attempts.current * 1000);
          return;
        }
        const wasInMatch = inMatch.current;
        inMatch.current = false;
        setError(
          (current) =>
            current ||
            (wasInMatch
              ? "Your connection dropped and we couldn’t get you back in."
              : "Unable to reach the match service. Try again or play practice."),
        );
        setState("disconnected");
      };
      // Identity tokens travel in the first message, never in a URL or a room code.
      const ws = new WebSocket(url);
      socket.current = ws;
      timeout.current = setTimeout(() => {
        if (socket.current === ws) {
          close();
          setError(
            "Unable to reach the match service. Try again or play practice.",
          );
          lost();
        }
      }, 10000);
      ws.onopen = () =>
        ws.send(
          JSON.stringify({
            type: "authenticate",
            token: tokenRef.current,
            action: kind,
          }),
        );
      ws.onerror = () => {
        if (!inMatch.current)
          setError(
            "Connection interrupted. Return to the arena and try again.",
          );
      };
      ws.onclose = () => {
        if (socket.current === ws) {
          socket.current = null;
          if (timeout.current) clearTimeout(timeout.current);
          lost();
        }
      };
      ws.onmessage = (e) => {
        let message: any;
        try {
          message = JSON.parse(e.data);
        } catch {
          return;
        }
        if (timeout.current) clearTimeout(timeout.current);
        if (message.type === "error") {
          setError(String(message.message));
          if (message.fatal) {
            close();
            inMatch.current = false;
            setState("disconnected");
          }
          return;
        }
        if (message.type === "matched") {
          close();
          connect("join", message.room);
          return;
        }
        if (message.type === "waiting") {
          setState("waiting");
          // Quick-match rooms are private to the pair, so their code is never shown.
          setRoomCode(kind === "quick" || room.startsWith("Q") ? null : room);
          return;
        }
        if (message.type === "state") {
          inMatch.current = true;
          attempts.current = 0;
          setError("");
          setState("playing");
          setRoomCode(room);
          setMatch(message.match);
          setPlayers(message.players);
          setPlayerIndex(message.playerIndex);
          // Timed from the server's remaining time, so a wrong device clock cannot skew it.
          setDeadline(
            Number.isFinite(message.remainingMs)
              ? Date.now() + message.remainingMs
              : message.deadline,
          );
          setTurnReady(message.turnReady);
          setYouLocked(Boolean(message.youLocked));
          setHamster(message.hamster ?? null);
          setRematchWaiting(message.rematchWaiting || false);
        }
        if (message.type === "opponent-disconnected") setOpponentAway(true);
        if (message.type === "opponent-back") setOpponentAway(false);
        if (message.type === "opponent-left") {
          close();
          inMatch.current = false;
          setOpponentAway(false);
          setWalkover(Boolean(message.walkover));
          setState("disconnected");
          setError(
            message.walkover
              ? "Your rival didn’t make it back. You win by walkover."
              : "Your rival left the pitch. Head back to find a fresh match.",
          );
        }
      };
    },
    [host, close],
  );
  const choose = useCallback((direction: Direction) => {
    if (socket.current?.readyState === WebSocket.OPEN)
      socket.current.send(JSON.stringify({ type: "choose", direction }));
  }, []);
  const rematch = useCallback(() => {
    if (socket.current?.readyState === WebSocket.OPEN) {
      socket.current.send(JSON.stringify({ type: "rematch" }));
      setRematchWaiting(true);
    }
  }, []);
  return {
    state,
    match,
    players,
    playerIndex,
    roomCode,
    error,
    deadline,
    rematchWaiting,
    turnReady,
    youLocked,
    hamster,
    opponentAway,
    walkover,
    connect,
    leave,
    choose,
    rematch,
  };
}
