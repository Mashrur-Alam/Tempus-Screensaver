import React from 'react';
import { AlarmClock } from 'lucide-react';
import { Alarm } from '../../types';
import { cn } from '../../lib/utils';

interface Props {
  alarm: Alarm | null;
  onToggle: (id: string) => void;
  size: '4x1' | '4x2';
  className?: string;
}

export const AlarmWidget: React.FC<Props> = ({ alarm, onToggle, size, className }) => {
  return (
    <div className={cn(
      "bg-tempus-black border border-tempus-red/20 rounded-[16px] p-4 flex items-center justify-between overflow-hidden glow-red-box",
      size === '4x1' ? "w-full h-full" : "w-full h-full flex-col items-stretch",
      className
    )}>
      <div className="flex items-center gap-4">
        <div className="p-3 bg-tempus-dark-red/40 rounded-xl border border-tempus-red/20">
          <AlarmClock className={cn("w-6 h-6", alarm?.enabled ? "text-tempus-red glow-red" : "text-white/20")} />
        </div>
        <div className="flex flex-col">
          {alarm ? (
            <>
              <span className={cn(
                "text-2xl font-display leading-none",
                alarm.enabled ? "text-white" : "text-white/20"
              )}>
                {alarm.time}
              </span>
              <span className="text-[10px] text-white/40 uppercase tracking-widest mt-1">
                {alarm.label || 'Next Alarm'}
              </span>
            </>
          ) : (
            <span className="text-[10px] text-white/20 uppercase tracking-widest">No Alarms</span>
          )}
        </div>
      </div>

      {alarm && (
        <div className={cn("flex items-center gap-3", size === '4x2' && "mt-auto justify-between border-t border-white/5 pt-4")}>
          <span className={cn(
            "text-[10px] font-bold tracking-widest uppercase",
            alarm.enabled ? "text-tempus-red" : "text-white/20"
          )}>
            {alarm.enabled ? 'ON' : 'OFF'}
          </span>
          <button
            onClick={() => onToggle(alarm.id)}
            className={cn(
              "w-12 h-6 rounded-full relative transition-colors duration-300",
              alarm.enabled ? "bg-tempus-red" : "bg-white/10"
            )}
          >
            <div className={cn(
              "absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300",
              alarm.enabled ? "left-7" : "left-1"
            )} />
          </button>
        </div>
      )}
    </div>
  );
};
