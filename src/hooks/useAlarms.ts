import { useState, useEffect } from 'react';
import { Alarm } from '../types';

export function useAlarms() {
  const [alarms, setAlarms] = useState<Alarm[]>(() => {
    const saved = localStorage.getItem('tempus_alarms');
    return saved ? JSON.parse(saved) : [
      { id: '1', time: '07:30', label: 'Morning Run', days: [1, 2, 3, 4, 5], enabled: true, snooze: 5, vibrate: true },
      { id: '2', time: '09:00', label: 'Work', days: [1, 2, 3, 4, 5], enabled: false, snooze: 10, vibrate: true },
    ];
  });

  const [firingAlarm, setFiringAlarm] = useState<Alarm | null>(null);

  useEffect(() => {
    localStorage.setItem('tempus_alarms', JSON.stringify(alarms));
  }, [alarms]);

  useEffect(() => {
    const checkAlarms = setInterval(() => {
      const now = new Date();
      const currentTime = now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });
      const currentDay = now.getDay();

      const activeAlarm = alarms.find(a => 
        a.enabled && 
        a.time === currentTime && 
        a.days.includes(currentDay) &&
        now.getSeconds() === 0
      );

      if (activeAlarm && !firingAlarm) {
        setFiringAlarm(activeAlarm);
      }
    }, 1000);

    return () => clearInterval(checkAlarms);
  }, [alarms, firingAlarm]);

  const addAlarm = (alarm: Omit<Alarm, 'id'>) => {
    const newAlarm = { ...alarm, id: Date.now().toString() };
    setAlarms(prev => [...prev, newAlarm]);
  };

  const toggleAlarm = (id: string) => {
    setAlarms(prev => prev.map(a => a.id === id ? { ...a, enabled: !a.enabled } : a));
  };

  const deleteAlarm = (id: string) => {
    setAlarms(prev => prev.filter(a => a.id !== id));
  };

  const dismissAlarm = () => setFiringAlarm(null);

  return { alarms, firingAlarm, addAlarm, toggleAlarm, deleteAlarm, dismissAlarm };
}
