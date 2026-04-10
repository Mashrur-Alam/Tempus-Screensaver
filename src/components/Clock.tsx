import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';

export const Clock: React.FC = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center flex-1 z-10">
      <div className="font-display text-9xl text-tempus-red glow-red leading-none tracking-tighter">
        {format(time, 'HH:mm')}
      </div>
      <div className="mt-2 text-tempus-red font-display text-2xl tracking-widest pulse-red">
        {format(time, 'ss')}
      </div>
      
      <div className="mt-8 w-64 border-t border-b border-tempus-red/30 py-2 flex justify-center">
        <span className="text-sm font-light tracking-[0.3em] text-white/80 uppercase">
          {format(time, 'EEEE · dd MMMM yyyy')}
        </span>
      </div>
    </div>
  );
};
