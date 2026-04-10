import React, { useState } from 'react';
import { WeatherData, Alarm } from '../types';
import { ClockWidget } from './widgets/ClockWidget';
import { WeatherWidget } from './widgets/WeatherWidget';
import { AlarmWidget } from './widgets/AlarmWidget';
import { CombinedWidget } from './widgets/CombinedWidget';
import { motion, AnimatePresence } from 'motion/react';
import { LayoutGrid, Plus, X } from 'lucide-react';
import { cn } from '../lib/utils';

interface Props {
  weather: WeatherData | null;
  alarms: Alarm[];
  onToggleAlarm: (id: string) => void;
}

type WidgetType = 'CLOCK' | 'WEATHER' | 'ALARM' | 'COMBINED';

interface PlacedWidget {
  id: string;
  type: WidgetType;
  x: number;
  y: number;
  w: number;
  h: number;
}

export const MockLauncher: React.FC<Props> = ({ weather, alarms, onToggleAlarm }) => {
  const [placedWidgets, setPlacedWidgets] = useState<PlacedWidget[]>([
    { id: '1', type: 'COMBINED', x: 0, y: 0, w: 4, h: 4 },
  ]);
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  const nextAlarm = alarms.find(a => a.enabled) || alarms[0] || null;

  const addWidget = (type: WidgetType) => {
    const config = {
      CLOCK: { w: 2, h: 1 },
      WEATHER: { w: 2, h: 2 },
      ALARM: { w: 4, h: 1 },
      COMBINED: { w: 4, h: 4 },
    }[type];

    const newWidget: PlacedWidget = {
      id: Date.now().toString(),
      type,
      x: 0,
      y: Math.max(0, ...placedWidgets.map(w => w.y + w.h)),
      ...config
    };

    setPlacedWidgets([...placedWidgets, newWidget]);
    setIsPickerOpen(false);
  };

  const removeWidget = (id: string) => {
    setPlacedWidgets(placedWidgets.filter(w => w.id !== id));
  };

  return (
    <div className="flex-1 relative bg-tempus-black p-4 overflow-y-auto">
      {/* Mock Launcher Grid */}
      <div className="grid grid-cols-4 gap-4 auto-rows-[80px]">
        {placedWidgets.map((widget) => (
          <div
            key={widget.id}
            style={{
              gridColumn: `span ${widget.w}`,
              gridRow: `span ${widget.h}`,
            }}
            className="relative group"
          >
            <button
              onClick={() => removeWidget(widget.id)}
              className="absolute -top-2 -right-2 w-6 h-6 bg-tempus-red rounded-full flex items-center justify-center z-50 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="w-4 h-4 text-white" />
            </button>

            {widget.type === 'CLOCK' && <ClockWidget size="2x1" />}
            {widget.type === 'WEATHER' && <WeatherWidget data={weather} size="2x2" />}
            {widget.type === 'ALARM' && <AlarmWidget alarm={nextAlarm} onToggle={onToggleAlarm} size="4x1" />}
            {widget.type === 'COMBINED' && <CombinedWidget weather={weather} alarm={nextAlarm} onToggleAlarm={onToggleAlarm} />}
          </div>
        ))}

        {/* Add Widget Placeholder */}
        <button
          onClick={() => setIsPickerOpen(true)}
          className="col-span-4 h-20 border-2 border-dashed border-white/10 rounded-[16px] flex items-center justify-center text-white/20 hover:border-tempus-red/30 hover:text-tempus-red transition-all"
        >
          <Plus className="w-6 h-6 mr-2" />
          <span className="text-[10px] font-bold tracking-widest uppercase">Add Widget</span>
        </button>
      </div>

      {/* Widget Picker Overlay */}
      <AnimatePresence>
        {isPickerOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed inset-x-0 bottom-0 bg-tempus-black/95 backdrop-blur-xl border-t border-tempus-red/20 z-[70] p-6 rounded-t-[32px]"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-bold tracking-[0.2em] text-tempus-red uppercase">Widget Gallery</h3>
              <button onClick={() => setIsPickerOpen(false)} className="text-white/40"><X /></button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button onClick={() => addWidget('CLOCK')} className="flex flex-col gap-2">
                <div className="aspect-[2/1] bg-tempus-dark-red/20 border border-white/5 rounded-xl flex items-center justify-center">
                  <span className="text-[10px] font-bold text-tempus-red">CLOCK (2x1)</span>
                </div>
              </button>
              <button onClick={() => addWidget('WEATHER')} className="flex flex-col gap-2">
                <div className="aspect-square bg-tempus-dark-red/20 border border-white/5 rounded-xl flex items-center justify-center">
                  <span className="text-[10px] font-bold text-tempus-red">WEATHER (2x2)</span>
                </div>
              </button>
              <button onClick={() => addWidget('ALARM')} className="flex flex-col gap-2 col-span-2">
                <div className="aspect-[4/1] bg-tempus-dark-red/20 border border-white/5 rounded-xl flex items-center justify-center">
                  <span className="text-[10px] font-bold text-tempus-red">ALARM (4x1)</span>
                </div>
              </button>
              <button onClick={() => addWidget('COMBINED')} className="flex flex-col gap-2 col-span-2">
                <div className="aspect-square bg-tempus-dark-red/20 border border-white/5 rounded-xl flex items-center justify-center">
                  <span className="text-[10px] font-bold text-tempus-red">FLAGSHIP (4x4)</span>
                </div>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
