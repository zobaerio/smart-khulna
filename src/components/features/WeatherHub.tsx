import React, { useState, useEffect } from 'react';
import { Sun, Cloud, Droplets, Wind, AlertTriangle, RefreshCw } from 'lucide-react';

export const WeatherHub = () => {
  const [weather, setWeather] = useState<any>(null);
  const [forecast, setForecast] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWeather = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/weather?city=Khulna');
      const data = await response.json();
      if (data.cod === 200) {
        setWeather(data);
        // In a real app, we'd fetch forecast here too
        setForecast({ daily: [], hourly: [] }); // Dummy data for structure
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

  if (loading) return <div className="p-4 text-center"><RefreshCw className="animate-spin mx-auto" /> Loading Weather...</div>;
  if (error) return <div className="p-4 text-red-500 text-center">{error}</div>;

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-bold">Weather Forecast - {weather.name}</h2>
      
      {/* Current Weather Card */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-md">
        <div className="text-4xl font-bold">{Math.round(weather.main.temp)}°C</div>
        <div className="capitalize">{weather.weather[0].description}</div>
      </div>

      {/* Hourly Forecast Placeholder */}
      <div className="p-4 bg-white rounded-2xl shadow-sm">
        <h3 className="font-bold mb-2">Hourly Forecast</h3>
        <div className="flex gap-4 overflow-x-auto">
          {/* Placeholder for hourly items */}
          <div className="text-center"><p>10 AM</p><Sun />25°C</div>
        </div>
      </div>

      {/* Daily Forecast Placeholder */}
      <div className="p-4 bg-white rounded-2xl shadow-sm">
        <h3 className="font-bold mb-2">Daily Forecast</h3>
        {/* Placeholder for daily items */}
        <div className="flex justify-between"><p>Tomorrow</p><Cloud /> 22°C / 28°C</div>
      </div>
    </div>
  );
};
