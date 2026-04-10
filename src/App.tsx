import React, { useState, useEffect, useCallback } from 'react';
import { WeatherAnimation } from './components/WeatherAnimation';
import { Character } from './components/Character';
import { SettingsOverlay } from './components/SettingsOverlay';
import { useWeather } from './hooks/useWeather';
import { useSettings } from './hooks/useSettings';
import { soundService } from './services/SoundService';
import { AnimatePresence, motion } from 'motion/react';

export default function App() {
  const { weather } = useWeather();
  const { settings, updateSettings } = useSettings();
  const [time, setTime] = useState(new Date());
  const [isScreensaverActive, setIsScreensaverActive] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [lastActivity, setLastActivity] = useState(Date.now());

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Handle "Exit" on activity
  const handleActivity = useCallback(() => {
    if (isScreensaverActive && !showSettings) {
      setIsScreensaverActive(false);
      setLastActivity(Date.now());
      soundService.stopAll();
    }
  }, [isScreensaverActive, showSettings]);

  useEffect(() => {
    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('keydown', handleActivity);
    return () => {
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keydown', handleActivity);
    };
  }, [handleActivity]);

  // Reactivate after idle (for demo purposes)
  useEffect(() => {
    if (!isScreensaverActive && !showSettings) {
      const idleTimer = setInterval(() => {
        if (Date.now() - lastActivity > 10000) { // 10 seconds idle to reactivate
          setIsScreensaverActive(true);
        }
      }, 1000);
      return () => clearInterval(idleTimer);
    }
  }, [isScreensaverActive, lastActivity, showSettings]);

  // Handle Right-Click for Settings
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowSettings(true);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: settings.clockFormat === '12hr',
    }).replace(/[APM]/g, '').trim();
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    }).toUpperCase().replace(',', ' ·');
  };

  if (!isScreensaverActive && !showSettings) {
    return (
      <div className="fixed inset-0 bg-tempus-black flex flex-col items-center justify-center space-y-4">
        <div className="text-tempus-red font-label tracking-widest uppercase text-sm animate-pulse">
          Screensaver Suspended
        </div>
        <button 
          onClick={() => setIsScreensaverActive(true)}
          className="px-6 py-2 border border-tempus-red/30 text-xs tracking-widest uppercase hover:bg-tempus-red hover:text-white transition-all"
        >
          Reactivate
        </button>
        <div className="text-[10px] text-tempus-dark-gray uppercase tracking-widest mt-8">
          Move mouse or press any key to suspend
        </div>
      </div>
    );
  }

  return (
    <div 
      className="fixed inset-0 bg-tempus-black overflow-hidden cursor-none"
      onContextMenu={handleContextMenu}
    >
      <WeatherAnimation condition={weather?.condition || 'Cloudy'} />
      
      {/* Top Bar */}
      <div className="fixed top-10 left-10 right-10 flex justify-between items-center z-50">
        <div className="text-[10px] font-bold tracking-[0.3em] text-tempus-gray uppercase">
          {weather?.city || 'Detecting Location...'}
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-[10px] font-bold tracking-[0.3em] text-tempus-gray uppercase">
            {weather ? `${Math.round(weather.temp)}°C · ${weather.condition}` : '--°C · --'}
          </div>
        </div>
      </div>

      {/* Center Clock */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-20 pointer-events-none">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-[18vw] font-display text-tempus-red leading-none glow-red select-none"
        >
          {formatTime(time)}
        </motion.div>
        
        <div className="text-2xl font-display text-tempus-red/40 pulse-opacity mt-[-2vw]">
          {time.getSeconds().toString().padStart(2, '0')}
        </div>

        <div className="text-sm font-label tracking-[0.4em] text-tempus-dark-gray uppercase mt-8">
          {formatDate(time)}
        </div>
      </div>

      {/* Bottom Left - Next Alarm */}
      <div className="fixed bottom-10 left-10 z-50">
        <div className="text-[10px] font-bold tracking-[0.2em] text-tempus-red uppercase flex items-center gap-2">
          <span className="opacity-50">⏰</span> NEXT ALARM · 07:00 AM
        </div>
      </div>

      {/* Character */}
      <AnimatePresence>
        {settings.showCharacter && (
          <Character condition={weather?.condition || 'Cloudy'} />
        )}
      </AnimatePresence>

      {/* Settings Overlay */}
      <AnimatePresence>
        {showSettings && (
          <SettingsOverlay 
            settings={settings}
            onUpdate={updateSettings}
            onClose={() => setShowSettings(false)}
          />
        )}
      </AnimatePresence>

      {/* Vignette */}
      <div className="fixed inset-0 pointer-events-none vignette vignette-pulse z-40" />
    </div>
  );
}
