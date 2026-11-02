let context: AudioContext | null = null;
export async function unlockAudio() {
  try {
    context ??= new AudioContext();
    if (context.state === "suspended") await context.resume();
  } catch {}
}
export function sound(
  kind: "kick" | "goal" | "save" | "whistle" | "win",
  enabled: boolean,
) {
  if (!enabled || !context) return;
  const ctx = context;
  function tone(
    frequency: number,
    start: number,
    duration: number,
    type: OscillatorType,
    volume: number,
    end?: number,
  ) {
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, ctx.currentTime + start);
    if (end)
      oscillator.frequency.exponentialRampToValueAtTime(
        end,
        ctx.currentTime + start + duration,
      );
    gain.gain.setValueAtTime(0.001, ctx.currentTime + start);
    gain.gain.exponentialRampToValueAtTime(
      volume,
      ctx.currentTime + start + 0.01,
    );
    gain.gain.exponentialRampToValueAtTime(
      0.001,
      ctx.currentTime + start + duration,
    );
    oscillator.connect(gain);
    gain.connect(ctx.destination);
    oscillator.start(ctx.currentTime + start);
    oscillator.stop(ctx.currentTime + start + duration + 0.01);
  }
  if (kind === "kick") tone(180, 0, 0.16, "triangle", 0.3, 35);
  if (kind === "save") {
    tone(100, 0, 0.22, "triangle", 0.3, 40);
    tone(260, 0.06, 0.15, "sine", 0.1);
  }
  if (kind === "whistle") {
    tone(1650, 0, 0.13, "sine", 0.09);
    tone(1900, 0.17, 0.24, "sine", 0.08);
  }
  if (kind === "goal" || kind === "win")
    [523, 659, 784, 1047].forEach((f, i) =>
      tone(f, i * 0.09, 0.35, "triangle", 0.11),
    );
  if (kind === "win")
    [784, 1047, 1318, 1568].forEach((f, i) =>
      tone(f, 0.45 + i * 0.12, 0.5, "sine", 0.08),
    );
}
