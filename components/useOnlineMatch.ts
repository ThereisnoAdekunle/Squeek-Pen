"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Direction, Match, PlayerIndex } from "@/lib/game";
export type OnlinePlayer = {
  id: string;
  handle: string;
  avatar: string | null;
};
export function useOnlineMatch({
  host,
  token,
}: {
  host: string | null;
  token: string | null;
}) {
  const [state, setState] = useState<
    "idle" | "connecting" | "waiting" | "playing" | "disconnected"
  >("idle");
  const [match, setMatch] = useState<Match | null>(null);
  const [players, setPlayers] = useState<OnlinePlayer[]>([]);
  const [playerIndex, setPlayerIndex] = useState<PlayerIndex | null>(null);
  const [roomCode, setRoomCode] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [deadline, setDeadline] = useState(0);
  const [rematchWaiting, setRematchWaiting] = useState(false);
  const [turnReady, setTurnReady] = useState(false);
  const socket = useRef<WebSocket | null>(null);
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const tokenRef = useRef(token);
  tokenRef.current = token;
  const close = useCallback(() => {
    if (timeout.current) clearTimeout(timeout.current);
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
    setState("idle");
    setRoomCode(null);
    setMatch(null);
    setPlayers([]);
    setPlayerIndex(null);
    setError("");
    setRematchWaiting(false);
  }, [close]);
  useEffect(() => () => close(), [close]);
  const connect = useCallback(
    async (kind: "create" | "join" | "quick", code?: string) => {
      if (!host || !tokenRef.current) {
        setError("Connect with X before joining a room.");
        return;
      }
      close();
      setError("");
      setState("connecting");
      setRematchWaiting(false);
      const base = new URL(host.startsWith("http") ? host : `https://${host}`);
      const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
      const values = new Uint8Array(6);
      crypto.getRandomValues(values);
      const room =
        kind === "quick"
          ? "matchmaking"
          : kind === "join"
            ? code!
            : Array.from(values, (n) => alphabet[n % alphabet.length]).join("");
      const url = new URL(`/parties/main/${room}`, base);
      url.protocol = url.protocol === "https:" ? "wss:" : "ws:";
      // Identity tokens travel in the first message, never in a URL or a room code.
      const ws = new WebSocket(url);
      socket.current = ws;
      timeout.current = setTimeout(() => {
        if (socket.current === ws) {
          close();
          setState("disconnected");
          setError(
            "Unable to reach the match service. Try again or play practice.",
          );
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
        setError("Connection interrupted. Return to the arena and try again.");
      };
      ws.onclose = () => {
        if (socket.current === ws) {
          socket.current = null;
          setState("disconnected");
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
          setRoomCode(kind === "quick" ? null : room);
          return;
        }
        if (message.type === "state") {
          setState("playing");
          setRoomCode(room);
          setMatch(message.match);
          setPlayers(message.players);
          setPlayerIndex(message.playerIndex);
          setDeadline(message.deadline);
          setTurnReady(message.turnReady);
          setRematchWaiting(message.rematchWaiting || false);
        }
        if (message.type === "opponent-left") {
          setState("disconnected");
          setError(
            "Your rival left the pitch. Head back to find a fresh match.",
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
    connect,
    leave,
    choose,
    rematch,
  };
}
