import React from 'react';
import { X } from 'lucide-react';
import { AppSettings } from '../types';

interface Props {
  settings: AppSettings;
  onUpdate: (settings: Partial<AppSettings>) => void;
  onClose: () => void;
}

export const SettingsOverlay: React.FC<Props> = ({ settings, onUpdate, onClose }) => {
  return (
    <div className="fixed inset-0 bg-tempus-black/90 backdrop-blur-xl z-[200] flex items-center justify-center p-6">
      <div className="w-full max-w-2xl bg-tempus-card border border-tempus-red/20 p-8 glow-red-box relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-tempus-gray hover:text-white transition-colors">
          <X />
        </button>

        <h2 className="text-2xl font-label tracking-[0.2em] text-tempus-red uppercase mb-8">Tempus Configuration</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 overflow-y-auto max-h-[70vh] pr-4">
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold tracking-widest text-tempus-gray uppercase">Location</label>
              <input
                type="text"
                placeholder="Auto-detect"
                className="w-full bg-black border border-white/10 p-3 text-sm text-white focus:outline-none focus:border-tempus-red"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold tracking-widest text-tempus-gray uppercase">Clock Format</label>
              <div className="flex gap-2">
                {['12hr', '24hr'].map(f => (
                  <button
                    key={f}
                    className="flex-1 py-2 border border-white/10 text-xs font-bold uppercase hover:border-tempus-red transition-colors"
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold tracking-widest text-tempus-gray uppercase">Alarm Sound Mode</label>
              <select
                value={settings.soundMode}
                onChange={(e) => onUpdate({ soundMode: e.target.value as any })}
                className="w-full bg-black border border-white/10 p-3 text-sm text-white focus:outline-none focus:border-tempus-red"
              >
                <option value="Weather Reactive">Weather Reactive</option>
                <option value="Always Rain">Always Rain</option>
                <option value="Always Storm">Always Storm</option>
                <option value="Always Clear">Always Clear</option>
                <option value="Classic">Classic Beep</option>
              </select>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold tracking-widest text-tempus-gray uppercase">Show Character</span>
              <button className="w-10 h-5 bg-tempus-red rounded-full" />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold tracking-widest text-tempus-gray uppercase">Gradual Wake</span>
              <button className="w-10 h-5 bg-tempus-red rounded-full" />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold tracking-widest text-tempus-gray uppercase">Night Ambient</span>
              <button className="w-10 h-5 bg-white/10 rounded-full" />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold tracking-widest text-tempus-gray uppercase">Volume</label>
              <input type="range" className="w-full accent-tempus-red" />
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-white/5 flex justify-end">
          <button
            onClick={onClose}
            className="bg-tempus-red px-8 py-3 text-xs font-bold tracking-[0.2em] uppercase glow-red-box hover:brightness-110 transition-all"
          >
            Save & Exit
          </button>
        </div>
      </div>
    </div>
  );
};
