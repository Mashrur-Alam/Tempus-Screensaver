import React from 'react';
import { Trash2 } from 'lucide-react';
import { Alarm } from '../types';
import { cn, getDayName } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

interface Props {
  alarm: Alarm;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export const AlarmCard: React.FC<Props> = ({ alarm, onToggle, onDelete }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="relative group mb-4"
    >
      <div className="absolute inset-y-0 left-0 w-1 bg-tempus-red glow-red-box" />
      <div className="bg-tempus-dark-red/20 border border-white/5 p-5 flex items-center justify-between hover:bg-tempus-dark-red/30 transition-colors">
        <div className="flex flex-col">
          <div className={cn(
            "text-4xl font-display tracking-tight transition-colors",
            alarm.enabled ? "text-white" : "text-white/20"
          )}>
            {alarm.time}
          </div>
          <div className="flex gap-1 mt-2">
            {[1, 2, 3, 4, 5, 6, 0].map((d) => (
              <span
                key={d}
                className={cn(
                  "text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full",
                  alarm.days.includes(d) 
                    ? (alarm.enabled ? "text-tempus-red" : "text-tempus-red/30") 
                    : "text-white/10"
                )}
              >
                {getDayName(d)}
              </span>
            ))}
          </div>
          {alarm.label && (
            <div className="text-[10px] text-white/40 uppercase tracking-widest mt-1">
              {alarm.label}
            </div>
          )}
        </div>

        <div className="flex items-center gap-4">
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
          
          <button 
            onClick={() => onDelete(alarm.id)}
            className="text-white/20 hover:text-tempus-red transition-colors"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};
