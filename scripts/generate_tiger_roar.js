import fs from 'fs';
import path from 'path';

// Generate 44100Hz 16-bit Mono/Stereo WAV file simulating a realistic Bengal Tiger roar
const sampleRate = 44100;
const durationSec = 3.2;
const numSamples = Math.floor(sampleRate * durationSec);
const channels = 2; // Stereo for immersive roar

const buffer = Buffer.alloc(44 + numSamples * channels * 2);

// Write WAV Header
buffer.write('RIFF', 0);
buffer.writeUInt32LE(36 + numSamples * channels * 2, 4);
buffer.write('WAVE', 8);
buffer.write('fmt ', 12);
buffer.writeUInt32LE(16, 16); // Subchunk1Size (16 for PCM)
buffer.writeUInt16LE(1, 20); // PCM format
buffer.writeUInt16LE(channels, 22);
buffer.writeUInt32LE(sampleRate, 24);
buffer.writeUInt32LE(sampleRate * channels * 2, 28); // ByteRate
buffer.writeUInt16LE(channels * 2, 32); // BlockAlign
buffer.writeUInt16LE(16, 34); // BitsPerSample
buffer.write('data', 36);
buffer.writeUInt32LE(numSamples * channels * 2, 40);

// Acoustic synthesis parameters for Panthera tigris roar:
// Roar envelope: Attack (0.0 to 0.4s), Peak Roar (0.4s to 1.8s), Decay Growl (1.8s to 2.8s), Reverb tail (2.8s to 3.2s)
function getEnvelope(t) {
  if (t < 0.25) {
    // Aggressive exponential onset
    return Math.pow(t / 0.25, 1.8);
  } else if (t < 1.7) {
    // Sustained powerful roar with natural vocal tremors
    const rel = (t - 0.25) / 1.45;
    return 1.0 - 0.15 * rel + 0.08 * Math.sin(rel * Math.PI * 14);
  } else if (t < 2.7) {
    // Deep chest rumble decay
    const rel = (t - 1.7) / 1.0;
    return 0.85 * Math.pow(1.0 - rel, 1.4);
  } else {
    // Breath & reverb fade out
    const rel = (t - 2.7) / 0.5;
    return 0.15 * (1.0 - rel);
  }
}

// Low-pass filter helper
let lpfStateL = 0;
let lpfStateR = 0;
let bpf1 = 0, bpf2 = 0;

// Pink noise generator state
let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

let phase1 = 0;
let phase2 = 0;
let phaseFlutter = 0;

// Simple delay line for stereo reverb
const delayLength = Math.floor(sampleRate * 0.065); // 65ms room/jungle slapback
const delayBuffer = new Float32Array(delayLength);
let delayIdx = 0;

let offset = 44;
for (let i = 0; i < numSamples; i++) {
  const t = i / sampleRate;
  const env = getEnvelope(t);

  // Pink noise algorithm (Paul Kellet's filtered white noise)
  const white = Math.random() * 2 - 1;
  b0 = 0.99886 * b0 + white * 0.0555179;
  b1 = 0.99332 * b1 + white * 0.0750759;
  b2 = 0.96900 * b2 + white * 0.1538520;
  b3 = 0.86650 * b3 + white * 0.3104856;
  b4 = 0.55000 * b4 + white * 0.5329522;
  b5 = -0.7616 * b5 - white * 0.0168980;
  const pink = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
  b6 = white * 0.115926;

  // Tiger fundamental pitch sweep:
  // Starts around 58 Hz, swells to 82 Hz in peak roar, descends to 45 Hz deep rumble
  let pitch = 58;
  if (t < 0.35) {
    pitch = 55 + (t / 0.35) * 25; // 55 -> 80 Hz
  } else if (t < 1.6) {
    const p = (t - 0.35) / 1.25;
    pitch = 80 - p * 22 + 4 * Math.sin(p * 28); // 80 -> 58 Hz with growl wobble
  } else {
    const p = (t - 1.6) / 1.6;
    pitch = 58 - p * 20; // 58 -> 38 Hz deep infrasonic chest growl
  }

  // Vocal fold harsh flutter rate (approx 28-38 Hz modulation frequency)
  const flutterRate = 34 + 6 * Math.sin(t * 12);
  phaseFlutter += (2 * Math.PI * flutterRate) / sampleRate;
  const flutter = 0.55 + 0.45 * Math.sin(phaseFlutter) + 0.25 * (Math.sin(phaseFlutter * 2.3));

  // Advance primary oscillator phases
  phase1 += (2 * Math.PI * pitch) / sampleRate;
  phase2 += (2 * Math.PI * (pitch * 2.02)) / sampleRate;

  // Nonlinear feline vocal distortion (soft-clipping waveshaping)
  const osc1 = Math.sin(phase1);
  const osc2 = Math.sin(phase2);
  const osc3 = Math.sin(phase1 * 3.01) * 0.4;
  const osc4 = Math.sin(phase1 * 4.98) * 0.25;

  // Combine guttural harmonics
  let harmonicTone = (osc1 * 0.6 + osc2 * 0.5 + osc3 * 0.35 + osc4 * 0.2) * (0.6 + 0.4 * flutter);
  // Waveshaping saturation for aggressive feline roar bite
  harmonicTone = Math.tanh(harmonicTone * 2.6) * 0.8;

  // Formant vocal tract filter (simulating open tiger throat: resonant peaks around 380Hz and 880Hz)
  const throatResonance = (Math.sin(phase1 * 6.2) * 0.3 + Math.sin(phase1 * 13.5) * 0.15) * pink * 2.2;
  const breathRasp = pink * (0.45 + 0.55 * flutter);

  // Sub-bass chest rumble (35-50Hz clean body)
  const subBass = Math.sin(phase1 * 0.5) * 0.4;

  let rawSample = (harmonicTone * 0.65 + throatResonance * 0.45 + breathRasp * 0.4 + subBass * 0.35) * env;

  // Lowpass filter to give deep muscular chest weight (~1100 Hz cutoff)
  const alpha = 0.18;
  lpfStateL += alpha * (rawSample - lpfStateL);

  // Jungle echo / cave reverberation slapback
  const delayedSample = delayBuffer[delayIdx];
  delayBuffer[delayIdx] = lpfStateL + delayedSample * 0.35;
  delayIdx = (delayIdx + 1) % delayLength;

  let left = lpfStateL + delayedSample * 0.25;
  let right = lpfStateL + delayedSample * 0.32;

  // Master soft limiter / clamp
  left = Math.max(-0.95, Math.min(0.95, left * 1.3));
  right = Math.max(-0.95, Math.min(0.95, right * 1.3));

  const intL = Math.floor(left * 32767);
  const intR = Math.floor(right * 32767);

  buffer.writeInt16LE(intL, offset);
  buffer.writeInt16LE(intR, offset + 2);
  offset += 4;
}

const outputPath = path.resolve('public', 'tiger_roar.wav');
fs.writeFileSync(outputPath, buffer);
console.log(`Generated high-fidelity tiger roar at: ${outputPath} (${buffer.length} bytes)`);
