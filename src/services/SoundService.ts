import { WeatherCondition, AlarmSoundMode } from '../types';

class SoundService {
  private ctx: AudioContext | null = null;
  private ambientGain: GainNode | null = null;
  private toneGain: GainNode | null = null;
  private volumeInterval: number | null = null;

  private initCtx() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  private createNoise(type: 'white' | 'pink') {
    if (!this.ctx) return null;
    const bufferSize = 2 * this.ctx.sampleRate;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = buffer.getChannelData(0);

    if (type === 'white') {
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }
    } else {
      let b0, b1, b2, b3, b4, b5, b6;
      b0 = b1 = b2 = b3 = b4 = b5 = b6 = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
        output[i] *= 0.11; // (roughly) compensate for gain
        b6 = white * 0.115926;
      }
    }

    const node = this.ctx.createBufferSource();
    node.buffer = buffer;
    node.loop = true;
    return node;
  }

  startAlarm(condition: WeatherCondition, soundMode: AlarmSoundMode, targetVolume: number, gradual: boolean) {
    this.initCtx();
    this.stopAll();

    const ctx = this.ctx!;
    this.ambientGain = ctx.createGain();
    this.toneGain = ctx.createGain();
    
    this.ambientGain.connect(ctx.destination);
    this.toneGain.connect(ctx.destination);

    this.ambientGain.gain.value = gradual ? 0.15 : targetVolume;
    this.toneGain.gain.value = targetVolume;

    this.playAmbient(condition);
    this.playTone(condition);

    if (gradual) {
      let currentVol = 0.15;
      this.volumeInterval = window.setInterval(() => {
        currentVol = Math.min(targetVolume, currentVol + 0.05);
        if (this.ambientGain) this.ambientGain.gain.linearRampToValueAtTime(currentVol, ctx.currentTime + 1);
        if (currentVol >= targetVolume && this.volumeInterval) {
          clearInterval(this.volumeInterval);
        }
      }, 3000);
    }
  }

  private playAmbient(condition: WeatherCondition) {
    if (!this.ctx || !this.ambientGain) return;
    const ctx = this.ctx;

    if (condition === 'Rain' || condition === 'Storm') {
      const rain = this.createNoise('white');
      if (rain) {
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 800;
        rain.connect(filter);
        filter.connect(this.ambientGain);
        rain.start();
      }
    } else if (condition === 'Snow' || condition === 'Cloudy') {
      const wind = this.createNoise('pink');
      if (wind) {
        const lfo = ctx.createOscillator();
        const lfoGain = ctx.createGain();
        lfo.frequency.value = 0.1;
        lfoGain.gain.value = 0.2;
        lfo.connect(lfoGain.gain);
        
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 400;
        
        wind.connect(filter);
        filter.connect(this.ambientGain);
        wind.start();
        lfo.start();
      }
    } else if (condition === 'Clear') {
      // Procedural birds
      const playBird = () => {
        if (!this.ctx || !this.ambientGain) return;
        const osc = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800 + Math.random() * 2400, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1200 + Math.random() * 2000, this.ctx.currentTime + 0.1);
        
        g.gain.setValueAtTime(0, this.ctx.currentTime);
        g.gain.linearRampToValueAtTime(0.1, this.ctx.currentTime + 0.05);
        g.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.2);
        
        osc.connect(g);
        g.connect(this.ambientGain);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.2);
        
        setTimeout(playBird, 500 + Math.random() * 2000);
      };
      playBird();
    } else if (condition === 'Fog') {
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = 110;
      osc.connect(this.ambientGain);
      osc.start();
    }
  }

  private playTone(condition: WeatherCondition) {
    if (!this.ctx || !this.toneGain) return;
    const ctx = this.ctx;

    const playBell = (freq: number, decay: number) => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.frequency.value = freq;
      g.gain.setValueAtTime(0.5, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + decay);
      osc.connect(g);
      g.connect(this.toneGain!);
      osc.start();
      osc.stop(ctx.currentTime + decay);
    };

    if (condition === 'Rain') {
      setInterval(() => playBell(440, 2), 3000);
    } else if (condition === 'Storm') {
      // Lightning crack
      const crack = this.createNoise('white');
      if (crack) {
        const g = ctx.createGain();
        g.gain.setValueAtTime(1, ctx.currentTime);
        g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
        crack.connect(g);
        g.connect(this.toneGain);
        crack.start();
        crack.stop(ctx.currentTime + 0.1);
      }
      setTimeout(() => playBell(80, 4), 200);
    } else if (condition === 'Snow') {
        setInterval(() => playBell(1200 + Math.random() * 400, 1), 1000);
    } else if (condition === 'Clear') {
        setInterval(() => playBell(880, 1.5), 2000);
    } else if (condition === 'Fog') {
        setInterval(() => {
            const osc = ctx.createOscillator();
            const g = ctx.createGain();
            osc.frequency.value = 110;
            g.gain.setValueAtTime(0, ctx.currentTime);
            g.gain.linearRampToValueAtTime(0.5, ctx.currentTime + 1);
            g.gain.linearRampToValueAtTime(0, ctx.currentTime + 3);
            osc.connect(g);
            g.connect(this.toneGain!);
            osc.start();
            osc.stop(ctx.currentTime + 3);
        }, 5000);
    }
  }

  stopAll() {
    if (this.volumeInterval) clearInterval(this.volumeInterval);
    if (this.ctx) {
      this.ctx.close();
      this.ctx = null;
    }
  }
}

export const soundService = new SoundService();
