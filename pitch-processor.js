class VeilPitchProcessor extends AudioWorkletProcessor {
  static get parameterDescriptors() { return [{ name: 'pitch', defaultValue: 1, minValue: 0.78, maxValue: 1.14, automationRate: 'k-rate' }]; }
  constructor() { super(); this.size = 8192; this.window = 2048; this.buffers = []; this.write = 0; this.phase = 0; }
  process(inputs, outputs, parameters) {
    const input = inputs[0], output = outputs[0];
    if (!input || input.length === 0 || !output || output.length === 0) return true;
    const ratio = parameters.pitch.length ? parameters.pitch[0] : 1, frames = output[0].length;
    while (this.buffers.length < input.length) this.buffers.push(new Float32Array(this.size));
    for (let ch = 0; ch < output.length; ch++) {
      const inCh = input[Math.min(ch, input.length - 1)], out = output[ch], ring = this.buffers[Math.min(ch, this.buffers.length - 1)];
      for (let i = 0; i < frames; i++) {
        const sample = inCh[i] || 0; ring[this.write] = sample;
        if (Math.abs(ratio - 1) < 0.002) out[i] = sample;
        else {
          const phaseA = ((this.phase % 1) + 1) % 1, phaseB = (phaseA + 0.5) % 1;
          const delayA = 1 + phaseA * this.window, delayB = 1 + phaseB * this.window;
          const readA = (this.write - delayA + this.size) % this.size, readB = (this.write - delayB + this.size) % this.size;
          const a0 = Math.floor(readA), b0 = Math.floor(readB), a1 = (a0 + 1) % this.size, b1 = (b0 + 1) % this.size;
          const a = ring[a0] + (ring[a1] - ring[a0]) * (readA - a0), b = ring[b0] + (ring[b1] - ring[b0]) * (readB - b0);
          const wa = Math.cos(phaseA * Math.PI) ** 2, wb = 1 - wa; out[i] = a * wa + b * wb;
          this.phase += (1 - ratio) / this.window; if (this.phase >= 1 || this.phase <= -1) this.phase %= 1;
        }
        this.write = (this.write + 1) % this.size;
      }
    }
    return true;
  }
}
registerProcessor('veil-pitch', VeilPitchProcessor);