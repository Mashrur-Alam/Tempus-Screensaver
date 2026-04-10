import { useState, useEffect } from 'react';
import { WeatherCondition, WeatherData } from '../types';

export function useWeather() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeather = async (lat: number, lon: number) => {
      try {
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&weathercode=true`
        );
        const data = await response.json();
        const code = data.current_weather.weathercode;
        const temp = Math.round(data.current_weather.temperature);

        let condition: WeatherCondition = 'Clear';
        if (code === 0) condition = 'Clear';
        else if (code >= 1 && code <= 3) condition = 'Cloudy';
        else if (code >= 45 && code <= 48) condition = 'Fog';
        else if (code >= 51 && code <= 67) condition = 'Rain';
        else if (code >= 71 && code <= 77) condition = 'Snow';
        else if (code >= 80 && code <= 82) condition = 'Rain';
        else if (code >= 95 && code <= 99) condition = 'Storm';

        setWeather({
          temp,
          condition,
          city: 'Your Location', // In a real app we'd reverse geocode
        });
      } catch (error) {
        console.error('Weather fetch failed', error);
        // Fallback
        setWeather({ temp: 22, condition: 'Clear', city: 'Tempus HQ' });
      } finally {
        setLoading(false);
      }
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => fetchWeather(pos.coords.latitude, pos.coords.longitude),
        () => fetchWeather(51.5074, -0.1278) // Default to London
      );
    } else {
      fetchWeather(51.5074, -0.1278);
    }
  }, []);

  return { weather, loading };
}
