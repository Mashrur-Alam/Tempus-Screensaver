import { useState, useEffect } from 'react';
import { AppSettings } from '../types';

const DEFAULT_SETTINGS: AppSettings = {
  soundMode: 'Weather Reactive',
  volume: 0.8,
  gradualWake: true,
  nightAmbient: false,
  vibrationMode: 'Rain Pulse',
};

export function useSettings() {
  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem('tempus_settings');
    return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
  });

  useEffect(() => {
    localStorage.setItem('tempus_settings', JSON.stringify(settings));
  }, [settings]);

  const updateSettings = (newSettings: Partial<AppSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  return { settings, updateSettings };
}
