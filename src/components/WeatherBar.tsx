import React, { useState, useEffect } from 'react';
import { Cloud, CloudFog, CloudRain, CloudSnow, Sun, Zap } from 'lucide-react';
import { WeatherCondition, WeatherData } from '../types';

export const WeatherBar: React.FC<{ data: WeatherData | null }> = ({ data }) => {
  if (!data) return <div className="h-12" />;

  const Icon = () => {
    switch (data.condition) {
      case 'Clear': return <Sun className="w-5 h-5 text-tempus-red" />;
      case 'Cloudy': return <Cloud className="w-5 h-5 text-tempus-red" />;
      case 'Fog': return <CloudFog className="w-5 h-5 text-tempus-red" />;
      case 'Rain': return <CloudRain className="w-5 h-5 text-tempus-red" />;
      case 'Snow': return <CloudSnow className="w-5 h-5 text-tempus-red" />;
      case 'Storm': return <Zap className="w-5 h-5 text-tempus-red" />;
      default: return <Sun className="w-5 h-5 text-tempus-red" />;
    }
  };

  return (
    <div className="w-full px-6 py-4 flex items-center justify-between z-20 bg-gradient-to-b from-tempus-black to-transparent">
      <div className="flex flex-col">
        <span className="text-xs font-bold tracking-widest text-tempus-red uppercase">Tempus</span>
        <span className="text-[10px] text-white/40 uppercase tracking-tighter">Time Feels the Weather</span>
      </div>
      
      <div className="flex items-center gap-3">
        <div className="text-right">
          <div className="text-sm font-medium">{data.city}</div>
          <div className="text-xs text-white/60">{data.temp}°C</div>
        </div>
        <div className="p-2 bg-tempus-dark-red/50 rounded-full border border-tempus-red/20">
          <Icon />
        </div>
      </div>
    </div>
  );
};
