import { BOAT_PLAYLIST, SHOP_PLAYLIST } from '../audioConstants';

// --- MUSICAL CONSTANTS ---
const SCALES = {
  MAJOR_C: [261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88], // C4 Major
  MAJOR_G: [196.00, 220.00, 246.94, 261.63, 293.66, 329.63, 369.99], // G3 Major
  MINOR_A: [220.00, 246.94, 261.63, 293.66, 329.63, 349.23, 392.00], // A3 Minor
  PENT_C:  [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33], // C4 Pentatonic
  DORIAN_D:[293.66, 329.63, 349.23, 392.00, 440.00, 493.88, 523.25], // D4 Dorian
  LYDIAN_F:[349.23, 392.00, 440.00, 493.88, 523.25, 587.33, 659.25], // F4 Lydian
};

class PseudoRandom {
  private seed: number;
  constructor(seed: number) { this.seed = seed; }
  
  // Returns 0-1
  next() {
    const x = Math.sin(this.seed++) * 10000;
    return x - Math.floor(x);
  }
  
  // Returns integer min to max
  range(min: number, max: number) {
    return Math.floor(this.next() * (max - min + 1)) + min;
  }
  
  pick<T>(array: T[]): T {
    return array[this.range(0, array.length - 1)];
  }
}

class AudioService {
  private audioCtx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private musicGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  
  private currentOscillators: OscillatorNode[] = [];
  private isMuted: boolean = false;
  private isInitialized: boolean = false;
  
  private currentTrackInterval: number | null = null;
  private currentTrackIndex: number = 0;
  private currentPlaylist: 'BOAT' | 'SHOP' = 'BOAT';

  constructor() {
    // Lazy init via user interaction
  }

  public async init() {
    if (this.isInitialized) return;
    
    try {
      this.audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.masterGain = this.audioCtx.createGain();
      this.musicGain = this.audioCtx.createGain();
      this.sfxGain = this.audioCtx.createGain();

      this.masterGain.connect(this.audioCtx.destination);
      this.musicGain.connect(this.masterGain);
      this.sfxGain.connect(this.masterGain);

      this.musicGain.gain.value = 0.25; // Balanced music volume
      this.sfxGain.gain.value = 0.4;

      this.isInitialized = true;
      if (this.audioCtx.state === 'suspended') {
        await this.audioCtx.resume();
      }
    } catch (e) {
      console.error("Audio init failed", e);
    }
  }

  public toggleMute() {
    if (!this.masterGain || !this.audioCtx) return;
    this.isMuted = !this.isMuted;
    this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 1, this.audioCtx.currentTime);
    return this.isMuted;
  }
  
  public getCurrentPlaylist() {
      return this.currentPlaylist;
  }

  // --- PROCEDURAL SFX GENERATOR (Kept same as requested) ---
  
  public playSFX(type: string) {
    if (!this.isInitialized || !this.audioCtx || !this.sfxGain || this.isMuted) return;
    const ctx = this.audioCtx;
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(this.sfxGain);

    switch (type) {
      case 'UI_CLICK':
        osc.type = 'square';
        osc.frequency.setValueAtTime(400, t);
        osc.frequency.exponentialRampToValueAtTime(600, t + 0.05);
        gain.gain.setValueAtTime(0.5, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.05);
        osc.start(t);
        osc.stop(t + 0.05);
        break;

      case 'UI_ERROR':
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(150, t);
        osc.frequency.linearRampToValueAtTime(100, t + 0.2);
        gain.gain.setValueAtTime(0.5, t);
        gain.gain.linearRampToValueAtTime(0.01, t + 0.2);
        osc.start(t);
        osc.stop(t + 0.2);
        break;

      case 'CAST_LINE':
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(300, t);
        osc.frequency.linearRampToValueAtTime(800, t + 0.3);
        gain.gain.setValueAtTime(0.3, t);
        gain.gain.linearRampToValueAtTime(0.01, t + 0.3);
        osc.start(t);
        osc.stop(t + 0.3);
        break;

      case 'SPLASH':
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(100, t);
        osc.frequency.exponentialRampToValueAtTime(20, t + 0.2);
        gain.gain.setValueAtTime(0.8, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.2);
        osc.start(t);
        osc.stop(t + 0.2);
        break;
      
      case 'REEL_TICK':
        osc.type = 'square';
        osc.frequency.setValueAtTime(200, t);
        gain.gain.setValueAtTime(0.3, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.03);
        osc.start(t);
        osc.stop(t + 0.03);
        break;

      case 'CATCH_SUCCESS':
        this.playNote(523.25, t, 0.1, 'square');
        this.playNote(659.25, t + 0.1, 0.1, 'square');
        this.playNote(783.99, t + 0.2, 0.2, 'square');
        this.playNote(1046.50, t + 0.3, 0.4, 'square');
        break;

      case 'CATCH_FAIL':
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(300, t);
        osc.frequency.linearRampToValueAtTime(100, t + 0.4);
        gain.gain.setValueAtTime(0.5, t);
        gain.gain.linearRampToValueAtTime(0.01, t + 0.4);
        osc.start(t);
        osc.stop(t + 0.4);
        break;

      case 'SELL_COIN':
        this.playNote(987.77, t, 0.08, 'square');
        this.playNote(1318.51, t + 0.08, 0.3, 'square');
        break;

      case 'UPGRADE':
         osc.type = 'square';
         osc.frequency.setValueAtTime(220, t);
         osc.frequency.linearRampToValueAtTime(880, t + 0.4);
         gain.gain.setValueAtTime(0.5, t);
         gain.gain.linearRampToValueAtTime(0.01, t + 0.4);
         const lfo = ctx.createOscillator();
         lfo.frequency.value = 20;
         const lfoGain = ctx.createGain();
         lfoGain.gain.value = 500;
         lfo.connect(lfoGain);
         lfoGain.connect(osc.frequency);
         lfo.start(t);
         lfo.stop(t + 0.4);
         osc.start(t);
         osc.stop(t + 0.4);
         break;
    }
  }

  private playNote(freq: number, time: number, duration: number, type: OscillatorType = 'sine') {
    if (!this.audioCtx || !this.sfxGain) return;
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    osc.connect(gain);
    gain.connect(this.sfxGain);
    gain.gain.setValueAtTime(0.3, time);
    gain.gain.exponentialRampToValueAtTime(0.01, time + duration);
    osc.start(time);
    osc.stop(time + duration);
  }

  // --- PROCEDURAL MUSIC ENGINE V2 ---
  
  public playMusic(playlist: 'BOAT' | 'SHOP', trackIndex?: number) {
    if (this.currentTrackInterval) {
        clearInterval(this.currentTrackInterval);
        this.currentTrackInterval = null;
    }
    
    this.currentOscillators.forEach(o => { try { o.stop(); } catch(e){} });
    this.currentOscillators = [];

    this.currentPlaylist = playlist;
    if (trackIndex !== undefined) this.currentTrackIndex = trackIndex;

    if (!this.isInitialized || this.isMuted) return;

    // --- SONG GENERATION BASED ON SEED (TrackIndex) ---
    // This ensures every track index produces a UNIQUE but consistent song.
    
    // Seed the random generator with the playlist + track index
    const seedBase = (playlist === 'SHOP' ? 1000 : 2000) + (this.currentTrackIndex * 137);
    const rng = new PseudoRandom(seedBase);

    // 1. Determine Musical Properties
    const isShop = playlist === 'SHOP';
    
    // Scales: Shop = Happy (Major/Lydian), Boat = Calm (Minor/Pentatonic/Dorian)
    const possibleScales = isShop 
        ? [SCALES.MAJOR_C, SCALES.MAJOR_G, SCALES.LYDIAN_F] 
        : [SCALES.MINOR_A, SCALES.PENT_C, SCALES.DORIAN_D];
    
    const scale = rng.pick(possibleScales);
    const bpm = isShop ? rng.range(100, 140) : rng.range(60, 90);
    const beatDuration = 60 / bpm;
    
    // Waveforms: Shop = Chip/Bright, Boat = Soft/Flute
    const leadWave: OscillatorType = isShop ? 'square' : 'triangle';
    const bassWave: OscillatorType = isShop ? 'sawtooth' : 'sine';
    
    // Pattern Generation (16 steps)
    const melodyPattern: (number | null)[] = [];
    const bassPattern: (number | null)[] = [];

    // Create a 16-step sequence
    for (let i = 0; i < 16; i++) {
        // Melody: higher density in shop, lower in boat
        if (rng.next() > (isShop ? 0.3 : 0.5)) {
            // Pick a note from scale, biased towards lower indices (roots/thirds)
            const noteIdx = Math.floor(Math.pow(rng.next(), 1.5) * scale.length);
            // Octave shift
            const octave = rng.range(0, 1); 
            melodyPattern.push(scale[noteIdx] * Math.pow(2, octave));
        } else {
            melodyPattern.push(null);
        }

        // Bass: On beats 0, 4, 8, 12 usually
        if (i % 4 === 0 || (i % 4 === 2 && rng.next() > 0.7)) {
            // Root note or Fifth
            const noteIdx = rng.next() > 0.7 ? 4 : 0; // 0=Root, 4=Fifth usually
            bassPattern.push(scale[noteIdx] / 2); // Lower octave
        } else {
            bassPattern.push(null);
        }
    }

    let step = 0;

    const playStep = () => {
        if (!this.audioCtx || !this.musicGain || this.isMuted) return;
        
        const t = this.audioCtx.currentTime;
        const noteDuration = beatDuration * (isShop ? 0.5 : 0.9); // Shop staccato, Boat legato

        // Play Melody
        const melodyFreq = melodyPattern[step];
        if (melodyFreq) {
            this.playTone(melodyFreq, t, noteDuration, leadWave, isShop ? 0.08 : 0.1);
        }

        // Play Bass
        const bassFreq = bassPattern[step];
        if (bassFreq) {
            this.playTone(bassFreq, t, noteDuration * 1.5, bassWave, isShop ? 0.1 : 0.15);
        }

        step = (step + 1) % 16;
    };

    // Use setInterval for scheduling (Simple engine)
    // Run every 1/4 beat
    this.currentTrackInterval = window.setInterval(playStep, (beatDuration * 1000) / 4);
  }

  private playTone(freq: number, startTime: number, duration: number, type: OscillatorType, vol: number) {
      if (!this.audioCtx || !this.musicGain) return;
      
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      
      osc.type = type;
      osc.frequency.value = freq;
      
      osc.connect(gain);
      gain.connect(this.musicGain);
      
      // Envelope
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(vol, startTime + 0.05); // Attack
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration); // Decay/Release
      
      osc.start(startTime);
      osc.stop(startTime + duration + 0.1);
      
      this.currentOscillators.push(osc);
      // Clean up array
      if (this.currentOscillators.length > 10) this.currentOscillators.shift();
  }

  public stopMusic() {
    if (this.currentTrackInterval) {
        clearInterval(this.currentTrackInterval);
        this.currentTrackInterval = null;
    }
  }

  public nextTrack() {
    const list = this.currentPlaylist === 'BOAT' ? BOAT_PLAYLIST : SHOP_PLAYLIST;
    this.currentTrackIndex = (this.currentTrackIndex + 1) % list.length;
    this.playMusic(this.currentPlaylist, this.currentTrackIndex);
    return list[this.currentTrackIndex];
  }
}

export const audioService = new AudioService();