/**
 * Tiger Roar Audio Service for Smart Khulna
 * Plays realistic Royal Bengal Tiger roar sound from public assets
 * with Web Audio API synthesis fallback and haptic feedback.
 */

let cachedAudio: HTMLAudioElement | null = null;

export const playTigerRoar = async (): Promise<void> => {
  try {
    // 1. Mobile Haptic feedback (subtle jungle roar vibrations)
    if (typeof window !== 'undefined' && 'navigator' in window && navigator.vibrate) {
      try {
        navigator.vibrate([60, 40, 100, 50, 140]);
      } catch {
        // Ignore haptic errors if not permitted
      }
    }

    // 2. Play realistic audio file from public assets (/tiger_roar.mp3 or /tiger_roar.wav)
    if (typeof window !== 'undefined') {
      if (!cachedAudio) {
        cachedAudio = new Audio();
        cachedAudio.preload = 'auto';
        // Test MP3 support, fallback to WAV
        const canPlayMp3 = cachedAudio.canPlayType('audio/mpeg');
        cachedAudio.src = canPlayMp3 ? '/tiger_roar.mp3' : '/tiger_roar.wav';
      }

      cachedAudio.currentTime = 0;
      cachedAudio.volume = 1.0;
      
      const playPromise = cachedAudio.play();
      if (playPromise !== undefined) {
        await playPromise;
        return;
      }
    }
  } catch (err) {
    console.warn('[TigerRoar] Audio file playback prevented or failed, using Web Audio API synthesis:', err);
    synthesizeTigerRoarWebAudio();
  }
};

/**
 * Web Audio API procedural synthesis fallback for instant, guaranteed offline tiger roar
 */
function synthesizeTigerRoarWebAudio(): void {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;

    const ctx = new AudioCtx();
    const now = ctx.currentTime;
    const duration = 2.6;

    // Master volume gain
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.001, now);
    masterGain.gain.exponentialRampToValueAtTime(0.85, now + 0.2);
    masterGain.gain.linearRampToValueAtTime(0.7, now + 1.6);
    masterGain.gain.exponentialRampToValueAtTime(0.001, now + duration);
    masterGain.connect(ctx.destination);

    // Deep chest fundamental oscillator (50Hz -> 75Hz -> 42Hz)
    const osc = ctx.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(54, now);
    osc.frequency.exponentialRampToValueAtTime(78, now + 0.35);
    osc.frequency.linearRampToValueAtTime(60, now + 1.4);
    osc.frequency.exponentialRampToValueAtTime(40, now + duration);

    // Sub-bass growl
    const subOsc = ctx.createOscillator();
    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(38, now);
    subOsc.frequency.linearRampToValueAtTime(45, now + 0.8);
    subOsc.frequency.exponentialRampToValueAtTime(28, now + duration);

    // Filter to simulate animal vocal tract & throat resonance
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(650, now);
    filter.frequency.linearRampToValueAtTime(1100, now + 0.4);
    filter.frequency.linearRampToValueAtTime(500, now + duration);
    filter.Q.value = 4.5;

    // Distortion waveshaper for predatory roar bite
    const waveShaper = ctx.createWaveShaper();
    const curve = new Float32Array(256);
    for (let i = 0; i < 256; i++) {
      const x = (i * 2) / 256 - 1;
      curve[i] = Math.tanh(x * 3.0);
    }
    waveShaper.curve = curve;

    osc.connect(filter);
    subOsc.connect(filter);
    filter.connect(waveShaper);
    waveShaper.connect(masterGain);

    osc.start(now);
    subOsc.start(now);
    osc.stop(now + duration);
    subOsc.stop(now + duration);

    // Clean up audio context
    setTimeout(() => {
      try {
        ctx.close();
      } catch {
        // ignore
      }
    }, (duration + 0.5) * 1000);
  } catch (synthErr) {
    console.warn('[TigerRoar] Web Audio synthesis error:', synthErr);
  }
}
