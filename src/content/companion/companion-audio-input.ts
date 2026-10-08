import { AudioInputCallbacks } from './companion-types';

/**
 * Microphone Audio Stream Capture & 16kHz Int16 PCM Resampler
 * Following Single Responsibility Principle (SRP)
 */
export class CompanionAudioInput {
  private mediaStream: MediaStream | null = null;
  private audioContext: AudioContext | null = null;
  private sourceNode: MediaStreamAudioSourceNode | null = null;
  private processorNode: ScriptProcessorNode | null = null;
  private callbacks: AudioInputCallbacks;
  private isMuted: boolean = false;
  private isRecording: boolean = false;

  constructor(callbacks: AudioInputCallbacks) {
    this.callbacks = callbacks;
  }

  public async start(): Promise<void> {
    if (this.isRecording) return;

    try {
      this.mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });

      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.audioContext = new AudioCtx();
      
      const sourceSampleRate = this.audioContext.sampleRate;
      this.sourceNode = this.audioContext.createMediaStreamSource(this.mediaStream);

      // ScriptProcessor buffer size: 4096 gives ~85-92ms chunk at 44.1/48kHz
      this.processorNode = this.audioContext.createScriptProcessor(4096, 1, 1);

      this.processorNode.onaudioprocess = (e: AudioProcessingEvent) => {
        if (this.isMuted) return;

        const inputData = e.inputBuffer.getChannelData(0);
        const pcm16Data = this.downsampleTo16kHz(inputData, sourceSampleRate);
        if (!pcm16Data || pcm16Data.length === 0) return;

        // Calculate RMS Volume for live visualizer
        let sumSquares = 0;
        for (let i = 0; i < inputData.length; i++) {
          sumSquares += inputData[i] * inputData[i];
        }
        const rms = Math.sqrt(sumSquares / inputData.length);
        const volumeLevel = Math.min(1, rms * 5); // Normalized 0..1

        this.callbacks.onVolumeChange?.(volumeLevel);

        // Convert Int16Array to Base64
        const base64Chunk = this.int16ArrayToBase64(pcm16Data);
        this.callbacks.onAudioChunk(base64Chunk, volumeLevel);
      };

      this.sourceNode.connect(this.processorNode);
      this.processorNode.connect(this.audioContext.destination);

      this.isRecording = true;
    } catch (err: any) {
      console.error('[CompanionAudioInput] Failed to start audio input:', err);
      this.callbacks.onError(err);
      this.stop();
      throw err;
    }
  }

  public stop(): void {
    if (this.processorNode && this.sourceNode) {
      try {
        this.sourceNode.disconnect();
        this.processorNode.disconnect();
      } catch {}
    }
    this.processorNode = null;
    this.sourceNode = null;

    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach((track) => track.stop());
      this.mediaStream = null;
    }

    if (this.audioContext && this.audioContext.state !== 'closed') {
      try {
        this.audioContext.close();
      } catch {}
      this.audioContext = null;
    }

    this.isRecording = false;
    this.callbacks.onVolumeChange?.(0);
  }

  public setMuted(muted: boolean): void {
    this.isMuted = muted;
    if (this.mediaStream) {
      this.mediaStream.getAudioTracks().forEach((track) => {
        track.enabled = !muted;
      });
    }
    if (muted) {
      this.callbacks.onVolumeChange?.(0);
    }
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public getIsRecording(): boolean {
    return this.isRecording;
  }

  /**
   * Resamples raw Float32 audio buffer from source rate to 16,000 Hz Int16 PCM
   */
  private downsampleTo16kHz(inputData: Float32Array, sourceSampleRate: number): Int16Array {
    const targetSampleRate = 16000;
    if (sourceSampleRate === targetSampleRate) {
      const output = new Int16Array(inputData.length);
      for (let i = 0; i < inputData.length; i++) {
        const s = Math.max(-1, Math.min(1, inputData[i]));
        output[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
      }
      return output;
    }

    const sampleRateRatio = sourceSampleRate / targetSampleRate;
    const newLength = Math.round(inputData.length / sampleRateRatio);
    const result = new Int16Array(newLength);

    for (let i = 0; i < newLength; i++) {
      const nextIndex = Math.floor(i * sampleRateRatio);
      const s = Math.max(-1, Math.min(1, inputData[nextIndex] || 0));
      result[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
    }

    return result;
  }

  /**
   * Helper: Encodes Int16Array to standard Base64 string
   */
  private int16ArrayToBase64(int16Array: Int16Array): string {
    const uint8Array = new Uint8Array(int16Array.buffer, int16Array.byteOffset, int16Array.byteLength);
    let binary = '';
    const len = uint8Array.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(uint8Array[i]);
    }
    return btoa(binary);
  }
}
