import React, { useState, useEffect } from 'react';
import { Sun, Cloud, Droplets, Wind, MapPin, RefreshCw, AlertTriangle } from 'lucide-react';

export const WeatherCard = ({ compact = true, onViewFull, onWeatherUpdate }: { compact?: boolean; onViewFull?: () => void; onWeatherUpdate?: (data: any) => void }) => {
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWeather = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/weather?city=Khulna');
      const data = await response.json();
      if (data.cod === 200) {
        setWeather(data);
        if (onWeatherUpdate) onWeatherUpdate(data);
      } else {
        setError(data.message || 'Failed to load weather');
      }
    } catch (err) {
      setError('Failed to fetch weather');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather();
  }, []);

  if (loading) return <div className="p-4 rounded-xl bg-white/10 dark:bg-slate-800/50 backdrop-blur-md text-center"><RefreshCw className="animate-spin mx-auto text-white" /></div>;
  if (error) return <div className="p-4 rounded-xl bg-white/10 dark:bg-slate-800/50 backdrop-blur-md text-red-200 text-sm">{error}</div>;

  return (
    <div className={`p-4 rounded-2xl bg-gradient-to-br from-sky-500 to-blue-600 text-white shadow-lg ${compact ? 'max-w-xs' : 'w-full'}`}>
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="font-semibold text-lg flex items-center gap-1"><MapPin size={16} /> {weather.name}</h3>
          <p className="text-sm opacity-90">Today's Weather</p>
        </div>
        <img src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} alt="weather icon" className="w-12 h-12" />
      </div>
      <div className="text-3xl font-bold mb-1">{Math.round(weather.main.temp)}°C</div>
      <div className="text-sm opacity-90 mb-4 capitalize">{weather.weather[0].description}</div>
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="flex items-center gap-1"><Droplets size={14} /> Humidity: {weather.main.humidity}%</div>
        <div className="flex items-center gap-1"><Wind size={14} /> Wind: {Math.round(weather.wind.speed * 3.6)} km/h</div>
      </div>
      {compact && <button onClick={onViewFull} className="mt-4 w-full py-2 bg-white/20 rounded-lg text-sm font-medium hover:bg-white/30">View Full Forecast</button>}
    </div>
  );
};
