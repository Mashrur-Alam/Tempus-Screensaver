import React from 'react';
import { Cloud, CloudFog, CloudRain, CloudSnow, Sun, Zap } from 'lucide-react';
import { WeatherData } from '../../types';
import { WeatherAnimation } from '../WeatherAnimation';
import { Character } from '../Character';
import { cn } from '../../lib/utils';

interface Props {
  data: WeatherData | null;
  size: '2x2' | '4x2';
  className?: string;
}

export const WeatherWidget: React.FC<Props> = ({ data, size, className }) => {
  if (!data) return <div className="bg-tempus-black rounded-[16px] w-full h-full animate-pulse" />;

  const Icon = () => {
    switch (data.condition) {
      case 'Clear': return <Sun className="w-6 h-6 text-tempus-red" />;
      case 'Cloudy': return <Cloud className="w-6 h-6 text-tempus-red" />;
      case 'Fog': return <CloudFog className="w-6 h-6 text-tempus-red" />;
      case 'Rain': return <CloudRain className="w-6 h-6 text-tempus-red" />;
      case 'Snow': return <CloudSnow className="w-6 h-6 text-tempus-red" />;
      case 'Storm': return <Zap className="w-6 h-6 text-tempus-red" />;
      default: return <Sun className="w-6 h-6 text-tempus-red" />;
    }
  };

  return (
    <div className={cn(
      "bg-tempus-black border border-tempus-red/20 rounded-[16px] relative overflow-hidden glow-red-box",
      size === '2x2' ? "w-full h-full" : "w-full h-full",
      className
    )}>
      {/* Animated Background */}
      <div className="absolute inset-0 z-0 opacity-50">
        <WeatherAnimation condition={data.condition} />
      </div>

      <div className="relative z-10 p-4 h-full flex flex-col justify-between">
        <div className="flex justify-between items-start">
          <div className="flex flex-col">
            <span className="text-2xl font-display text-white leading-none">{data.temp}°C</span>
            <span className="text-[10px] text-white/60 uppercase tracking-widest mt-1">{data.city}</span>
          </div>
          <div className="p-2 bg-tempus-dark-red/40 rounded-full border border-tempus-red/20">
            <Icon />
          </div>
        </div>

        <div className="flex justify-end items-end flex-1">
          <div className="w-20 h-24 scale-75 origin-bottom-right">
            <Character condition={data.condition} />
          </div>
        </div>
      </div>
    </div>
  );
};
