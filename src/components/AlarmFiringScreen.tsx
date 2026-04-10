import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { WeatherAnimation } from './WeatherAnimation';
import { WeatherCondition, VibrationMode } from '../types';
import { soundService } from '../services/SoundService';

interface Props {
  time: string;
  label: string;
  condition: WeatherCondition;
  soundMode: any;
  volume: number;
  gradual: boolean;
  vibrationMode: VibrationMode;
  onSnooze: () => void;
  onDismiss: () => void;
}

const VIBRATION_PATTERNS: Record<WeatherCondition | string, number[]> = {
  Rain: [100, 200, 100, 200, 100, 400],
  Snow: [50, 500, 50, 500],
  Storm: [500, 100, 500, 100, 1000],
  Clear: [100, 300, 100, 300],
  Fog: [200, 600, 200, 600],
  Cloudy: [150, 350, 150, 350],
  Steady: [500, 500],
};

export const AlarmFiringScreen: React.FC<Props> = ({ 
  time, label, condition, soundMode, volume, gradual, vibrationMode, onSnooze, onDismiss 
}) => {
  useEffect(() => {
    // Start Sound
    soundService.startAlarm(condition, soundMode, volume, gradual);

    // Start Vibration
    if (vibrationMode !== 'None' && 'vibrate' in navigator) {
      let pattern = VIBRATION_PATTERNS[condition];
      if (vibrationMode === 'Steady') pattern = VIBRATION_PATTERNS.Steady;
      else if (vibrationMode === 'Storm Burst') pattern = VIBRATION_PATTERNS.Storm;
      
      const interval = setInterval(() => {
        navigator.vibrate(pattern);
      }, pattern.reduce((a, b) => a + b, 0) + 500);

      return () => {
        clearInterval(interval);
        navigator.vibrate(0);
        soundService.stopAll();
      };
    }

    return () => soundService.stopAll();
  }, [condition, soundMode, volume, gradual, vibrationMode]);

  return (
    <div className="fixed inset-0 bg-tempus-black z-[100] flex flex-col items-center justify-center overflow-hidden">
      <WeatherAnimation condition={condition} />
      
      {/* Pulse effect */}
      <div className="absolute inset-0 bg-tempus-red/10 heartbeat pointer-events-none" />

      <div className="z-10 flex flex-col items-center text-center px-6">
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 1 }}
          className="font-display text-[120px] text-tempus-red glow-red leading-none"
        >
          {time}
        </motion.div>
        
        <div className="mt-4 text-xl font-bold tracking-[0.4em] text-white uppercase">
          {label || 'ALARM'}
        </div>
      </div>

      <div className="absolute bottom-16 inset-x-0 px-8 flex flex-col gap-4 z-10">
        <button
          onClick={onSnooze}
          className="w-full py-5 border-2 border-tempus-red text-tempus-red font-bold tracking-[0.3em] uppercase hover:bg-tempus-red/10 transition-all"
        >
          Snooze
        </button>
        <button
          onClick={onDismiss}
          className="w-full py-5 bg-tempus-red text-white font-bold tracking-[0.3em] uppercase glow-red-box hover:brightness-110 transition-all"
        >
          Dismiss
        </button>
      </div>
    </div>
  );
};
