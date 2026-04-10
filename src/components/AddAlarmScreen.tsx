import React, { useState } from 'react';
import { X, Check } from 'lucide-react';
import { Alarm } from '../types';
import { getDayName, cn } from '../lib/utils';

interface Props {
  onSave: (alarm: Omit<Alarm, 'id'>) => void;
  onCancel: () => void;
}

export const AddAlarmScreen: React.FC<Props> = ({ onSave, onCancel }) => {
  const [hour, setHour] = useState('08');
  const [minute, setMinute] = useState('00');
  const [label, setLabel] = useState('');
  const [days, setDays] = useState<number[]>([1, 2, 3, 4, 5]);
  const [snooze, setSnooze] = useState(5);
  const [vibrate, setVibrate] = useState(true);

  const toggleDay = (day: number) => {
    setDays(prev => prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]);
  };

  const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
  const minutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));

  return (
    <div className="fixed inset-0 bg-tempus-black z-50 flex flex-col">
      <div className="p-6 flex items-center justify-between border-b border-white/5">
        <button onClick={onCancel} className="text-white/60"><X /></button>
        <h2 className="text-sm font-bold tracking-[0.2em] text-tempus-red uppercase">Add Alarm</h2>
        <div className="w-6" />
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        {/* Time Picker Simulation */}
        <div className="flex justify-center items-center gap-4 h-48 relative">
          <div className="absolute inset-x-0 h-12 border-t border-b border-tempus-red/30 pointer-events-none" />
          
          <div className="flex flex-col items-center overflow-y-auto h-full scrollbar-hide w-20 snap-y snap-mandatory">
            {hours.map(h => (
              <button 
                key={h} 
                onClick={() => setHour(h)}
                className={cn(
                    "h-12 flex items-center justify-center text-3xl font-display snap-center transition-all",
                    hour === h ? "text-tempus-red scale-125 glow-red" : "text-white/20"
                )}
              >
                {h}
              </button>
            ))}
          </div>
          
          <span className="text-3xl font-display text-tempus-red">:</span>

          <div className="flex flex-col items-center overflow-y-auto h-full scrollbar-hide w-20 snap-y snap-mandatory">
            {minutes.map(m => (
              <button 
                key={m} 
                onClick={() => setMinute(m)}
                className={cn(
                    "h-12 flex items-center justify-center text-3xl font-display snap-center transition-all",
                    minute === m ? "text-tempus-red scale-125 glow-red" : "text-white/20"
                )}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        {/* Days */}
        <div className="space-y-3">
          <label className="text-[10px] font-bold tracking-widest text-white/40 uppercase">Repeat</label>
          <div className="flex justify-between">
            {[1, 2, 3, 4, 5, 6, 0].map(d => (
              <button
                key={d}
                onClick={() => toggleDay(d)}
                className={cn(
                  "w-10 h-10 rounded-full border transition-all flex items-center justify-center text-xs font-bold",
                  days.includes(d) 
                    ? "bg-tempus-red border-tempus-red text-white glow-red-box" 
                    : "border-white/10 text-white/40"
                )}
              >
                {getDayName(d)}
              </button>
            ))}
          </div>
        </div>

        {/* Label */}
        <div className="space-y-3">
          <label className="text-[10px] font-bold tracking-widest text-white/40 uppercase">Label</label>
          <input
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="Wake up"
            className="w-full bg-tempus-dark-red/10 border-b border-tempus-red/30 py-2 text-white placeholder:text-white/10 focus:outline-none focus:border-tempus-red transition-colors"
          />
        </div>

        {/* Snooze */}
        <div className="space-y-3">
          <label className="text-[10px] font-bold tracking-widest text-white/40 uppercase">Snooze Duration</label>
          <div className="flex gap-4">
            {[5, 10, 15].map(s => (
              <button
                key={s}
                onClick={() => setSnooze(s)}
                className={cn(
                  "flex-1 py-3 border transition-all text-xs font-bold",
                  snooze === s ? "border-tempus-red text-tempus-red" : "border-white/10 text-white/40"
                )}
              >
                {s} MIN
              </button>
            ))}
          </div>
        </div>

        {/* Vibration */}
        <div className="flex items-center justify-between py-4 border-t border-white/5">
          <span className="text-xs font-bold tracking-widest text-white/60 uppercase">Vibration</span>
          <button
            onClick={() => setVibrate(!vibrate)}
            className={cn(
              "w-12 h-6 rounded-full relative transition-colors duration-300",
              vibrate ? "bg-tempus-red" : "bg-white/10"
            )}
          >
            <div className={cn(
              "absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300",
              vibrate ? "left-7" : "left-1"
            )} />
          </button>
        </div>
      </div>

      <div className="p-6">
        <button
          onClick={() => onSave({ time: `${hour}:${minute}`, label, days, enabled: true, snooze, vibrate })}
          className="w-full bg-tempus-red py-4 text-sm font-bold tracking-[0.3em] uppercase glow-red-box hover:brightness-110 transition-all"
        >
          Save Alarm
        </button>
      </div>
    </div>
  );
};
