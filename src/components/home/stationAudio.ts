/**
 * Original, fully synthesized soundscape for "The Arrival" (Web Audio API):
 * fluorescent hum, distant horn, rail clacks, tunnel rumble, a pass-by whoosh
 * and the door chime. No audio files, so no licensing and no download.
 *
 * Never autoplays: an AudioContext is only created from a user gesture
 * (the sound toggle). Events are scheduled on the intro timeline; turning
 * sound on mid-sequence schedules only what is still ahead.
 */

type Ctx = AudioContext;

function noiseBuffer(ctx: Ctx, seconds = 2, brown = false) {
  const len = Math.floor(ctx.sampleRate * seconds);
  const buf = ctx.createBuffer(1, len, ctx.sampleRate);
  const d = buf.getChannelData(0);
  let last = 0;
  for (let i = 0; i < len; i++) {
    const w = Math.random() * 2 - 1;
    if (brown) {
      last = (last + 0.02 * w) / 1.02;
      d[i] = last * 3.5;
    } else d[i] = w;
  }
  return buf;
}

export class StationAudio {
  private ctx: Ctx | null = null;
  private master: GainNode | null = null;
  private humGain: GainNode | null = null;
  private sources: AudioScheduledSourceNode[] = [];

  get running() {
    return !!this.ctx && this.ctx.state === "running";
  }

  /** Must be called from a user gesture. `elapsed` = seconds into the intro. */
  start(elapsed: number, opts: { titleAt: number }) {
    if (typeof window === "undefined") return;
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AC) return;
    this.ctx = new AC();
    const ctx = this.ctx;
    this.master = ctx.createGain();
    this.master.gain.value = 0.0001;
    this.master.gain.exponentialRampToValueAtTime(0.9, ctx.currentTime + 0.4);
    this.master.connect(ctx.destination);

    const at = (t: number) => ctx.currentTime + Math.max(0, t - elapsed);
    const ahead = (t: number) => t >= elapsed;

    this.hum();
    if (ahead(1.5)) this.horn(at(1.5));
    if (ahead(1.0)) this.rumble(at(1.0), at(2.7), at(4.2));
    for (const t of [1.9, 2.15, 2.35, 2.5, 2.6, 2.68, 2.76, 2.84, 2.92]) if (ahead(t)) this.clack(at(t));
    if (ahead(2.55)) this.whoosh(at(2.55));
    if (elapsed > opts.titleAt) this.humGain?.gain.setTargetAtTime(0.05, ctx.currentTime, 0.4);
  }

  private track<T extends AudioScheduledSourceNode>(n: T): T {
    this.sources.push(n);
    return n;
  }

  private hum() {
    const ctx = this.ctx!;
    this.humGain = ctx.createGain();
    this.humGain.gain.value = 0.07;
    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = 700;
    for (const [f, type, g] of [
      [60, "sawtooth", 0.5],
      [120, "square", 0.18],
      [3600, "sine", 0.015],
    ] as const) {
      const o = this.track(ctx.createOscillator());
      o.type = type;
      o.frequency.value = f;
      const og = ctx.createGain();
      og.gain.value = g;
      o.connect(og).connect(lp);
      o.start();
    }
    lp.connect(this.humGain).connect(this.master!);
  }

  private horn(t: number) {
    const ctx = this.ctx!;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.16, t + 0.05);
    g.gain.setValueAtTime(0.16, t + 0.55);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 1.3);
    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = 1400;
    for (const f of [311, 370, 466]) {
      const o = this.track(ctx.createOscillator());
      o.type = "sawtooth";
      o.frequency.value = f;
      o.connect(lp);
      o.start(t);
      o.stop(t + 1.4);
    }
    // distance: echoey delay
    const d = ctx.createDelay();
    d.delayTime.value = 0.23;
    const fb = ctx.createGain();
    fb.gain.value = 0.35;
    lp.connect(g);
    g.connect(this.master!);
    g.connect(d).connect(fb).connect(d);
    fb.connect(this.master!);
  }

  private rumble(t0: number, peak: number, end: number) {
    const ctx = this.ctx!;
    const src = this.track(ctx.createBufferSource());
    src.buffer = noiseBuffer(ctx, 3, true);
    src.loop = true;
    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.setValueAtTime(90, t0);
    lp.frequency.linearRampToValueAtTime(420, peak);
    lp.frequency.linearRampToValueAtTime(120, end);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(1.1, peak);
    g.gain.exponentialRampToValueAtTime(0.0001, end);
    src.connect(lp).connect(g).connect(this.master!);
    src.start(t0);
    src.stop(end + 0.1);
  }

  private clack(t: number) {
    const ctx = this.ctx!;
    const src = this.track(ctx.createBufferSource());
    src.buffer = noiseBuffer(ctx, 0.08);
    const bp = ctx.createBiquadFilter();
    bp.type = "bandpass";
    bp.frequency.value = 1800;
    bp.Q.value = 3;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.5, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.07);
    src.connect(bp).connect(g).connect(this.master!);
    src.start(t);
  }

  private whoosh(t: number) {
    const ctx = this.ctx!;
    const src = this.track(ctx.createBufferSource());
    src.buffer = noiseBuffer(ctx, 1.2);
    const bp = ctx.createBiquadFilter();
    bp.type = "bandpass";
    bp.Q.value = 0.8;
    bp.frequency.setValueAtTime(300, t);
    bp.frequency.exponentialRampToValueAtTime(3200, t + 0.35);
    bp.frequency.exponentialRampToValueAtTime(500, t + 0.9);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.9, t + 0.25);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 1.0);
    src.connect(bp).connect(g).connect(this.master!);
    src.start(t);
    // after the train: the hum settles down
    this.humGain?.gain.setTargetAtTime(0.05, t + 0.8, 0.5);
  }

  /** Subway door "ding-dong" when entering the site. */
  chime() {
    const ctx = this.ctx;
    if (!ctx || !this.master) return;
    const t = ctx.currentTime;
    [
      [659.25, 0],
      [523.25, 0.32],
    ].forEach(([f, dt]) => {
      const o = this.track(ctx.createOscillator());
      o.type = "sine";
      o.frequency.value = f;
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.0001, t + dt);
      g.gain.exponentialRampToValueAtTime(0.25, t + dt + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dt + 1.1);
      o.connect(g).connect(this.master!);
      o.start(t + dt);
      o.stop(t + dt + 1.2);
    });
    this.humGain?.gain.setTargetAtTime(0.0001, t, 0.3);
  }

  stop(fade = 0.4) {
    const ctx = this.ctx;
    if (!ctx || !this.master) return;
    this.master.gain.setTargetAtTime(0.0001, ctx.currentTime, fade / 3);
    const c = ctx;
    window.setTimeout(() => {
      this.sources.forEach((s) => {
        try {
          s.stop();
        } catch {
          /* already stopped */
        }
      });
      this.sources = [];
      c.close().catch(() => {});
    }, fade * 1000 + 200);
    this.ctx = null;
    this.master = null;
    this.humGain = null;
  }
}
