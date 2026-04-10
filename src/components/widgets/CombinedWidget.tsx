import React from 'react';
import { WeatherData, Alarm } from '../../types';
import { WeatherAnimation } from '../WeatherAnimation';
import { Character } from '../Character';
import { ClockWidget } from './ClockWidget';
import { AlarmWidget } from './AlarmWidget';
import { WeatherWidget } from './WeatherWidget';
import { cn } from '../../lib/utils';

interface Props {
  weather: WeatherData | null;
  alarm: Alarm | null;
  onToggleAlarm: (id: string) => void;
  className?: string;
}

export const CombinedWidget: React.FC<Props> = ({ weather, alarm, onToggleAlarm, className }) => {
  return (
    <div className={cn(
      "bg-tempus-black border border-tempus-red/30 rounded-[16px] relative overflow-hidden glow-red-box w-full h-full flex flex-col",
      className
    )}>
      {/* Live Animated Background for the whole widget */}
      <div className="absolute inset-0 z-0 opacity-40">
        <WeatherAnimation condition={weather?.condition || 'Clear'} />
      </div>

      {/* Top Section: Weather + Character */}
      <div className="relative z-10 p-4 h-1/3 flex justify-between items-start">
        <div className="flex flex-col">
          <span className="text-3xl font-display text-white leading-none">{weather?.temp || '--'}°C</span>
          <span className="text-[10px] text-white/60 uppercase tracking-widest mt-1">{weather?.city || 'Locating...'}</span>
        </div>
        <div className="w-24 h-32 scale-75 origin-top-right -mt-4">
          <Character condition={weather?.condition || 'Clear'} />
        </div>
      </div>

      {/* Middle Section: Giant Clock */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center">
        <ClockWidget size="4x1" className="bg-transparent border-none glow-none shadow-none" />
      </div>

      {/* Bottom Section: Alarm */}
      <div className="relative z-10 p-2">
        <AlarmWidget 
          alarm={alarm} 
          onToggle={onToggleAlarm} 
          size="4x1" 
          className="bg-tempus-dark-red/20 border-tempus-red/10" 
        />
      </div>
    </div>
  );
};
