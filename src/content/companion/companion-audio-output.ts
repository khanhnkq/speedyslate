import { AudioOutputCallbacks } from './companion-types';

/**
 * 24kHz Int16 PCM Audio Stream Player with Instant Barge-In Cancelation
 * Following Single Responsibility Principle (SRP)
 */
export class CompanionAudioOutput {
  private audioContext: AudioContext | null = null;
  private nextPlayTime: number = 0;
  private activeSources: AudioBufferSourceNode[] = [];
  private callbacks: AudioOutputCallbacks;
  private isPlaying: boolean = false;
  private checkEndTimer: any = null;

  constructor(callbacks: AudioOutputCallbacks = {}) {
    this.callbacks = callbacks;
  }

  private ensureAudioContext(): AudioContext {
    if (!this.audioContext || this.audioContext.state === 'closed') {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.audioContext = new AudioCtx({ sampleRate: 24000 });
    }
    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }
    return this.audioContext;
  }

  /**
   * Enqueues and schedules a base64 encoded 24kHz PCM Int16 audio chunk
   */
  public enqueueBase64Chunk(base64Pcm: string): void {
    try {
      const pcm16Data = this.base64ToInt16Array(base64Pcm);
      if (!pcm16Data || pcm16Data.length === 0) return;

      const ctx = this.ensureAudioContext();
      const sampleRate = 24000;
      const audioBuffer = ctx.createBuffer(1, pcm16Data.length, sampleRate);
      const channelData = audioBuffer.getChannelData(0);

      // Convert Int16 to normalized Float32 (-1.0 .. 1.0)
      for (let i = 0; i < pcm16Data.length; i++) {
        channelData[i] = pcm16Data[i] / 32768.0;
      }

      const source = ctx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(ctx.destination);

      const currentTime = ctx.currentTime;
      // Schedule immediately or seamlessly stitch onto the end of the previous buffer
      const startTime = Math.max(currentTime, this.nextPlayTime);
      source.start(startTime);

      this.nextPlayTime = startTime + audioBuffer.duration;
      this.activeSources.push(source);

      if (!this.isPlaying) {
        this.isPlaying = true;
        this.callbacks.onPlaybackStarted?.();
      }

      source.onended = () => {
        const idx = this.activeSources.indexOf(source);
        if (idx !== -1) {
          this.activeSources.splice(idx, 1);
        }
        if (this.activeSources.length === 0) {
          this.isPlaying = false;
          this.callbacks.onPlaybackEnded?.();
          this.callbacks.onVolumeChange?.(0);
        }
      };

      // Periodic volume animation trigger while playing
      this.monitorPlayingVolume();
    } catch (err) {
      console.error('[CompanionAudioOutput] Error playing audio chunk:', err);
    }
  }

  /**
   * Instant Barge-in: immediately stops all scheduled audio sources and resets the timeline
   */
  public flush(): void {
    for (const source of this.activeSources) {
      try {
        source.stop();
        source.disconnect();
      } catch {}
    }
    this.activeSources = [];
    if (this.audioContext) {
      this.nextPlayTime = this.audioContext.currentTime;
    } else {
      this.nextPlayTime = 0;
    }

    if (this.isPlaying) {
      this.isPlaying = false;
      this.callbacks.onPlaybackEnded?.();
      this.callbacks.onVolumeChange?.(0);
    }
    if (this.checkEndTimer) {
      clearInterval(this.checkEndTimer);
      this.checkEndTimer = null;
    }
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public destroy(): void {
    this.flush();
    if (this.audioContext && this.audioContext.state !== 'closed') {
      try {
        this.audioContext.close();
      } catch {}
      this.audioContext = null;
    }
  }

  private monitorPlayingVolume(): void {
    if (this.checkEndTimer) return;
    this.checkEndTimer = setInterval(() => {
      if (!this.isPlaying || this.activeSources.length === 0) {
        clearInterval(this.checkEndTimer);
        this.checkEndTimer = null;
        this.callbacks.onVolumeChange?.(0);
        return;
      }
      // Simulate dynamic speech cadence volume for visualizer
      const randomVol = 0.35 + Math.random() * 0.55;
      this.callbacks.onVolumeChange?.(randomVol);
    }, 120);
  }

  private base64ToInt16Array(base64: string): Int16Array {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return new Int16Array(bytes.buffer, bytes.byteOffset, bytes.byteLength / 2);
  }
}
