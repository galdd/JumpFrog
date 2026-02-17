// sfx_realistic.ts
let ctx: AudioContext | null = null;

const getCtx = () => {
  if (!ctx) ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
  return ctx;
};

const t = () => getCtx().currentTime;

const makeNoiseBuffer = (durationSec: number) => {
  const c = getCtx();
  const len = Math.floor(c.sampleRate * durationSec);
  const buf = c.createBuffer(1, len, c.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
  return buf;
};

const env = (gain: GainNode, start: number, peak: number, attack: number, decay: number) => {
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(peak, start + attack);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + attack + decay);
};

export const sfx = {
  async unlock() {
    const c = getCtx();
    if (c.state === "suspended") await c.resume();
  },

  // A heavier "push-off" sound (sub + short body)
  jumpBass() {
    const c = getCtx();
    const start = t();

    const master = c.createGain();
    master.gain.setValueAtTime(0.9, start);
    master.connect(c.destination);

    // Low thump (sub)
    {
      const osc = c.createOscillator();
      const g = c.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(110, start);
      osc.frequency.exponentialRampToValueAtTime(75, start + 0.08);
      env(g, start, 0.55, 0.004, 0.12);
      osc.connect(g);
      g.connect(master);
      osc.start(start);
      osc.stop(start + 0.16);
    }

    // Body / friction (lowpassed noise)
    {
      const noise = c.createBufferSource();
      noise.buffer = makeNoiseBuffer(0.10);

      const lp = c.createBiquadFilter();
      lp.type = "lowpass";
      lp.frequency.setValueAtTime(700, start);
      lp.Q.setValueAtTime(0.8, start);

      const g = c.createGain();
      env(g, start, 0.16, 0.002, 0.08);

      noise.connect(lp);
      lp.connect(g);
      g.connect(master);

      noise.start(start);
      noise.stop(start + 0.11);
    }
  },

  // A "wet landing" with more bass impact + subtle splash tail
  landBassWet() {
    const c = getCtx();
    const start = t();

    const master = c.createGain();
    master.gain.setValueAtTime(0.95, start);
    master.connect(c.destination);

    // Deep impact (triangle gives more harmonics than sine)
    {
      const osc = c.createOscillator();
      const g = c.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(95, start);
      osc.frequency.exponentialRampToValueAtTime(60, start + 0.10);
      env(g, start, 0.75, 0.003, 0.18);

      // Lowpass to keep it "real"
      const lp = c.createBiquadFilter();
      lp.type = "lowpass";
      lp.frequency.setValueAtTime(220, start);
      lp.Q.setValueAtTime(0.7, start);

      osc.connect(lp);
      lp.connect(g);
      g.connect(master);

      osc.start(start);
      osc.stop(start + 0.22);
    }

    // Short "mud/wet" body (noise, lowpass)
    {
      const noise = c.createBufferSource();
      noise.buffer = makeNoiseBuffer(0.14);

      const lp = c.createBiquadFilter();
      lp.type = "lowpass";
      lp.frequency.setValueAtTime(900, start);
      lp.Q.setValueAtTime(0.9, start);

      const g = c.createGain();
      env(g, start, 0.22, 0.002, 0.10);

      noise.connect(lp);
      lp.connect(g);
      g.connect(master);

      noise.start(start);
      noise.stop(start + 0.15);
    }

    // Splash tail (bandpass noise) — subtle
    {
      const noise = c.createBufferSource();
      noise.buffer = makeNoiseBuffer(0.22);

      const bp = c.createBiquadFilter();
      bp.type = "bandpass";
      bp.frequency.setValueAtTime(1400, start);
      bp.Q.setValueAtTime(1.2, start);

      const g = c.createGain();
      env(g, start + 0.015, 0.08, 0.001, 0.20);

      noise.connect(bp);
      bp.connect(g);
      g.connect(master);

      noise.start(start);
      noise.stop(start + 0.24);
    }
  },
};
