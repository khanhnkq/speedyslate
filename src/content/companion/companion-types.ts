/**
 * Types & Interfaces for SpeedySlate Story Companion
 * Following SOLID principles: ISP (Interface Segregation)
 */

export type CompanionConnectionStatus = 
  | 'idle'
  | 'connecting'
  | 'connected'
  | 'listening'
  | 'speaking'
  | 'error';

export interface CompanionMessage {
  id: string;
  role: 'user' | 'model' | 'system';
  text: string;
  isPartial?: boolean;
  imageThumbnail?: string;
  timestamp: number;
}

export type CompanionPersonaId = 'roleplay' | 'waifu' | 'narrator';
export type CompanionVoiceName = 'Aoede' | 'Kore' | 'Puck' | 'Fenrir' | 'Charon';
export type CompanionLanguage = 'vi' | 'en' | 'ja' | 'ko' | 'zh';

export interface CompanionVoiceConfig {
  voiceName: CompanionVoiceName;
}

export interface CompanionSettings {
  enabled: boolean;
  apiKey?: string;
  model: string;
  voiceName: CompanionVoiceName;
  language?: CompanionLanguage;
  visionEnabled: boolean;
  autoVisionOnScroll: boolean;
  persona?: CompanionPersonaId;
  systemInstruction?: string;
}

export interface AudioInputCallbacks {
  onAudioChunk: (base64Pcm: string, volumeLevel: number) => void;
  onError: (error: Error) => void;
  onVolumeChange?: (volume: number) => void;
}

export interface AudioOutputCallbacks {
  onPlaybackStarted?: () => void;
  onPlaybackEnded?: () => void;
  onVolumeChange?: (volume: number) => void;
}
