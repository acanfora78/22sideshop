/**
 * Original synthesized soundscape for THE MOVEMENT intro (Web Audio):
 * city night ambience, footsteps, key jingle, lock click, door creak,
 * light switches clunking on one by one, and a low "22" hit.
 * No files, no licensing. Never autoplays: started only by the sound toggle.
 */

function noise(ctx: AudioContext, seconds: number, brown = false) {
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

export class MovementAudio {
  private ctx: AudioContext | null = null;
  private out: GainNode | null = null;
  private nodes: AudioScheduledSourceNode[] = [];

  /** `cues` = seconds on the intro timeline; `elapsed` = where the film is now. */
  start(elapsed: number, cues: { steps: number[]; key: number; click: number; door: number; lights: number[]; hit: number }) {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AC) return;
    const ctx = (this.ctx = new AC());
    this.out = ctx.createGain();
    this.out.gain.value = 0.0001;
    this.out.gain.exponentialRampToValueAtTime(0.9, ctx.currentTime + 0.4);
    this.out.connect(ctx.destination);
    const at = (t: number) => ctx.currentTime + Math.max(0, t - elapsed);
    const ahead = (t: number) => t >= elapsed - 0.05;

    this.ambience(at(0), at(cues.door + 0.4));
    cues.steps.filter(ahead).forEach((t) => this.step(at(t)));
    if (ahead(cues.key)) this.jingle(at(cues.key));
    if (ahead(cues.click)) this.click(at(cues.click));
    if (ahead(cues.door)) this.creak(at(cues.door));
    cues.lights.filter(ahead).forEach((t) => this.clunk(at(t)));
    if (ahead(cues.hit)) this.hit(at(cues.hit));
  }

  private keep<T extends AudioScheduledSourceNode>(n: T) {
    this.nodes.push(n);
    return n;
  }

  private ambience(t0: number, t1: number) {
    const ctx = this.ctx!;
    const src = this.keep(ctx.createBufferSource());
    src.buffer = noise(ctx, 4, true);
    src.loop = true;
    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = 500;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(0.35, t0 + 0.8);
    g.gain.setValueAtTime(0.35, t1 - 0.3);
    g.gain.exponentialRampToValueAtTime(0.03, t1 + 0.6);
    src.connect(lp).connect(g).connect(this.out!);
    src.start(t0);
    // distant siren-ish tone
    const o = this.keep(ctx.createOscillator());
    o.type = "sine";
    o.frequency.setValueAtTime(620, t0);
    o.frequency.linearRampToValueAtTime(760, t0 + 1.2);
    o.frequency.linearRampToValueAtTime(620, t0 + 2.4);
    const og = ctx.createGain();
    og.gain.value = 0.012;
    o.connect(og).connect(this.out!);
    o.start(t0);
    o.stop(t1);
  }

  private step(t: number) {
    const ctx = this.ctx!;
    const o = this.keep(ctx.createOscillator());
    o.frequency.setValueAtTime(110, t);
    o.frequency.exponentialRampToValueAtTime(45, t + 0.12);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.5, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.16);
    o.connect(g).connect(this.out!);
    o.start(t);
    o.stop(t + 0.2);
  }

  private jingle(t: number) {
    const ctx = this.ctx!;
    [2400, 3100, 2750, 3600, 2900].forEach((f, i) => {
      const o = this.keep(ctx.createOscillator());
      o.type = "triangle";
      o.frequency.value = f;
      const g = ctx.createGain();
      const s = t + i * 0.07 + Math.random() * 0.03;
      g.gain.setValueAtTime(0.0001, s);
      g.gain.exponentialRampToValueAtTime(0.07, s + 0.005);
      g.gain.exponentialRampToValueAtTime(0.0001, s + 0.35);
      o.connect(g).connect(this.out!);
      o.start(s);
      o.stop(s + 0.4);
    });
  }

  private click(t: number) {
    const ctx = this.ctx!;
    [0, 0.09].forEach((dt, i) => {
      const src = this.keep(ctx.createBufferSource());
      src.buffer = noise(ctx, 0.05);
      const bp = ctx.createBiquadFilter();
      bp.type = "bandpass";
      bp.frequency.value = i ? 1600 : 2600;
      bp.Q.value = 4;
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.9, t + dt);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dt + 0.05);
      src.connect(bp).connect(g).connect(this.out!);
      src.start(t + dt);
    });
  }

  private creak(t: number) {
    const ctx = this.ctx!;
    const o = this.keep(ctx.createOscillator());
    o.type = "sawtooth";
    o.frequency.setValueAtTime(70, t);
    o.frequency.linearRampToValueAtTime(130, t + 0.5);
    o.frequency.linearRampToValueAtTime(90, t + 1.1);
    const bp = ctx.createBiquadFilter();
    bp.type = "bandpass";
    bp.frequency.value = 900;
    bp.Q.value = 6;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.18, t + 0.15);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 1.2);
    o.connect(bp).connect(g).connect(this.out!);
    o.start(t);
    o.stop(t + 1.3);
  }

  private clunk(t: number) {
    const ctx = this.ctx!;
    const o = this.keep(ctx.createOscillator());
    o.frequency.setValueAtTime(160, t);
    o.frequency.exponentialRampToValueAtTime(50, t + 0.18);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.7, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.25);
    o.connect(g).connect(this.out!);
    o.start(t);
    o.stop(t + 0.3);
    // fluorescent buzz after each switch
    const b = this.keep(ctx.createOscillator());
    b.type = "square";
    b.frequency.value = 120;
    const bg = ctx.createGain();
    bg.gain.setValueAtTime(0.0001, t + 0.05);
    bg.gain.exponentialRampToValueAtTime(0.012, t + 0.12);
    bg.gain.exponentialRampToValueAtTime(0.0001, t + 1.4);
    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = 600;
    b.connect(lp).connect(bg).connect(this.out!);
    b.start(t);
    b.stop(t + 1.5);
  }

  private hit(t: number) {
    const ctx = this.ctx!;
    const o = this.keep(ctx.createOscillator());
    o.type = "sine";
    o.frequency.setValueAtTime(90, t);
    o.frequency.exponentialRampToValueAtTime(38, t + 1.2);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.9, t + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 1.8);
    o.connect(g).connect(this.out!);
    o.start(t);
    o.stop(t + 2);
    // reverse-swell noise into the hit
    const src = this.keep(ctx.createBufferSource());
    src.buffer = noise(ctx, 1);
    const hp = ctx.createBiquadFilter();
    hp.type = "highpass";
    hp.frequency.value = 2000;
    const ng = ctx.createGain();
    ng.gain.setValueAtTime(0.0001, t - 0.6);
    ng.gain.exponentialRampToValueAtTime(0.12, t - 0.02);
    ng.gain.exponentialRampToValueAtTime(0.0001, t + 0.05);
    src.connect(hp).connect(ng).connect(this.out!);
    src.start(Math.max(ctx.currentTime, t - 0.6));
  }

  stop(fade = 0.5) {
    const ctx = this.ctx;
    if (!ctx || !this.out) return;
    this.out.gain.setTargetAtTime(0.0001, ctx.currentTime, fade / 3);
    const nodes = this.nodes;
    window.setTimeout(() => {
      nodes.forEach((n) => {
        try {
          n.stop();
        } catch {
          /* already stopped */
        }
      });
      ctx.close().catch(() => {});
    }, fade * 1000 + 200);
    this.ctx = null;
    this.out = null;
    this.nodes = [];
  }
}
