import React from 'react';
import { Clock as ClockIcon, AlarmClock, Settings } from 'lucide-react';
import { cn } from '../lib/utils';

type Tab = 'CLOCK' | 'ALARMS' | 'SETTINGS';

interface Props {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

export const Navigation: React.FC<Props> = ({ activeTab, onTabChange }) => {
  const tabs: { id: Tab; icon: any; label: string }[] = [
    { id: 'CLOCK', icon: ClockIcon, label: 'CLOCK' },
    { id: 'ALARMS', icon: AlarmClock, label: 'ALARMS' },
    { id: 'SETTINGS', icon: Settings, label: 'SETTINGS' },
  ];

  return (
    <div className="w-full bg-tempus-black/80 backdrop-blur-md border-t border-tempus-red/10 px-6 py-4 flex justify-around items-center z-30">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "flex flex-col items-center gap-1 transition-all duration-300",
              isActive ? "text-tempus-red scale-110" : "text-white/40 hover:text-white/60"
            )}
          >
            <Icon className={cn("w-6 h-6", isActive && "glow-red")} />
            <span className="text-[10px] font-bold tracking-widest">{tab.label}</span>
            {isActive && (
              <div className="w-1 h-1 bg-tempus-red rounded-full mt-1 glow-red" />
            )}
          </button>
        );
      })}
    </div>
  );
};
