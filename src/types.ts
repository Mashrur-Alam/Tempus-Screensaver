
export type WeatherCondition = 'Clear' | 'Cloudy' | 'Fog' | 'Rain' | 'Snow' | 'Storm';

export type AlarmSoundMode = 'Weather Reactive' | 'Always Rain' | 'Always Storm' | 'Always Snow' | 'Always Clear' | 'Classic';
export type VibrationMode = 'None' | 'Rain Pulse' | 'Storm Burst' | 'Steady';

export interface AppSettings {
  soundMode: AlarmSoundMode;
  volume: number; // 0.1 to 1.0
  gradualWake: boolean;
  nightAmbient: boolean;
  vibrationMode: VibrationMode;
}

export interface Alarm {
  id: string;
  time: string; // HH:mm
  label: string;
  days: number[]; // 0-6 (Sun-Sat)
  enabled: boolean;
  snooze: number; // minutes
  vibrate: boolean;
}

export interface WeatherData {
  temp: number;
  condition: WeatherCondition;
  city: string;
}
