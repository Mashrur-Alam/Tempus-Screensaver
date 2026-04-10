import React from 'react';
import { format } from 'date-fns';
import { cn } from '../../lib/utils';

interface Props {
  size: '2x1' | '4x1';
  className?: string;
}

export const ClockWidget: React.FC<Props> = ({ size, className }) => {
  const time = new Date();

  return (
    <div className={cn(
      "bg-tempus-black border border-tempus-red/20 rounded-[16px] p-4 flex flex-col items-center justify-center overflow-hidden glow-red-box",
      size === '2x1' ? "w-full h-full" : "w-full h-full",
      className
    )}>
      <div className={cn(
        "font-display text-tempus-red glow-red leading-none tracking-tighter",
        size === '2x1' ? "text-5xl" : "text-6xl"
      )}>
        {format(time, 'HH:mm')}
      </div>
      <div className="mt-1 text-white/60 text-[10px] font-bold tracking-[0.2em] uppercase">
        {format(time, 'EEE · dd MMM')}
      </div>
    </div>
  );
};
