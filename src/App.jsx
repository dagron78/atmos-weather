
import { useState, useEffect } from 'react';
import CurrentWeather from './components/CurrentWeather';
import Forecast from './components/Forecast';
import HourlyForecast from './components/HourlyForecast';
import { fetchWeather, getWeatherCondition, getCityNameFromCoords, searchCity } from './lib/weather';
import { Search, MapPin, Heart } from 'lucide-react';

function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showSearch, setShowSearch] = useState(false);
  const [savedLocation, setSavedLocation] = useState(null);

  useEffect(() => {
    // Check localStorage first
    const saved = localStorage.getItem('atmos_default_location');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setSavedLocation(parsed);
        loadWeather(parsed.lat, parsed.lon, parsed.name);
        return;
      } catch (e) {
        console.error("Failed to parse saved location", e);
        localStorage.removeItem('atmos_default_location');
      }
    }

    // Default to New York for demo if geolocation fails or init
    const lat = 40.71;
    const lon = -74.00;

    // Try to get actual location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          loadWeather(position.coords.latitude, position.coords.longitude);
        },
        (err) => {
          console.warn("Geolocation failed, using default", err);
          loadWeather(lat, lon, "New York (Default)");
        }
      );
    } else {
      loadWeather(lat, lon, "New York (Default)");
    }
  }, []);

  async function loadWeather(lat, lon, overrideName = null) {
    try {
      setLoading(true);
      setError(null);
      setShowSearch(false);

      const [data, cityName] = await Promise.all([
        fetchWeather(lat, lon),
        overrideName ? Promise.resolve(overrideName) : getCityNameFromCoords(lat, lon)
      ]);

      // Parse Current
      const current = data.current;
      const currentCondition = getWeatherCondition(current.weather_code);
      const daily = data.daily;
      const hourlyRaw = data.hourly;

      const weather = {
        lat,
        lon,
        temp: Math.round(current.temperature_2m),
        conditionLabel: currentCondition.label,
        conditionIcon: currentCondition.icon,
        high: daily.temperature_2m_max[0],
        low: daily.temperature_2m_min[0],
        wind: current.wind_speed_10m,
        humidity: current.relative_humidity_2m,
        location: cityName
      };

      // Parse Hourly (Next 24 hours starting from current hour)
      // Open-Meteo returns all hours for 7 days. We need to find the current index.
      // Simply slicing the first 24 isn't always accurate if the response starts at midnight but it's now 5PM.
      // However, Open-Meteo current_weather is usually separate. 
      // Let's just take the first 24 hours of the "hourly" array for simplicity or try to match time.
      // For this demo, let's just take the first 24 indices, as Open-Meteo usually returns starting from 00:00 today.
      // We should ideally filter for "now" onwards.

      const currentHourIso = new Date().toISOString().slice(0, 13); // "2023-01-01T12"
      let startIndex = hourlyRaw.time.findIndex(t => t.startsWith(currentHourIso));
      if (startIndex === -1) startIndex = 0; // Fallback

      const hourly = hourlyRaw.time.slice(startIndex, startIndex + 24).map((t, i) => {
        const realIndex = startIndex + i;
        const cond = getWeatherCondition(hourlyRaw.weather_code[realIndex]);
        const date = new Date(t);

        return {
          time: date.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true }),
          temp: hourlyRaw.temperature_2m[realIndex],
          icon: cond.icon
        };
      });

      // Parse Prediction
      const forecast = daily.time.map((t, i) => {
        const cond = getWeatherCondition(daily.weather_code[i]);
        const date = new Date(t);
        const dayName = i === 0 ? "Today" : date.toLocaleDateString('en-US', { weekday: 'short' });

        return {
          day: dayName,
          max: daily.temperature_2m_max[i],
          min: daily.temperature_2m_min[i],
          label: cond.label,
          icon: cond.icon
        };
      });

      setWeatherData({ weather, forecast, hourly });
    } catch (err) {
      setError("Failed to load weather");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSearch(e) {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    try {
      const results = await searchCity(searchQuery);
      setSearchResults(results);
    } catch (err) {
      console.error(err);
    }
  }

  function saveAsDefault() {
    if (!weatherData) return;
    const { lat, lon, location } = weatherData.weather;
    const data = { lat, lon, name: location };
    localStorage.setItem('atmos_default_location', JSON.stringify(data));
    setSavedLocation(data);
  }

  const isCurrentLocationDefault = savedLocation && weatherData &&
    savedLocation.name === weatherData.weather.location;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-slate-100 p-4 md:p-8 flex flex-col items-center">

      <header className="w-full max-w-sm mx-auto flex justify-between items-center py-4 mb-4 relative z-50">
        <h1 className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-200 to-indigo-200">
          Atmos
        </h1>
        <div className="flex gap-2">
          {weatherData && !loading && (
            <button
              onClick={saveAsDefault}
              disabled={isCurrentLocationDefault}
              className={`p-2 rounded-full border transition-all ${isCurrentLocationDefault ? 'bg-blue-500/20 border-blue-400 text-blue-300' : 'bg-white/10 border-white/10 hover:bg-white/20'}`}
              title="Set as Default Location">
              <Heart className={`w-5 h-5 ${isCurrentLocationDefault ? 'fill-current' : ''}`} />
            </button>
          )}
          <button
            onClick={() => setShowSearch(!showSearch)}
            className="p-2 rounded-full bg-white/10 border border-white/10 hover:bg-white/20 transition-all">
            <Search className="w-5 h-5" />
          </button>
        </div>

        {showSearch && (
          <div className="absolute top-16 left-0 w-full bg-slate-800/90 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl animate-in fade-in slide-in-from-top-4">
            <form onSubmit={handleSearch} className="flex gap-2 mb-4">
              <input
                type="text"
                placeholder="Search city..."
                className="flex-1 bg-black/20 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-blue-400"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
              <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-blue-400">
                Go
              </button>
            </form>

            {searchResults.length > 0 && (
              <ul className="flex flex-col gap-2 max-h-60 overflow-y-auto">
                {searchResults.map((city) => (
                  <li key={city.id}>
                    <button
                      onClick={() => loadWeather(city.latitude, city.longitude, `${city.name}, ${city.admin1 || city.country_code}`)}
                      className="w-full text-left p-3 rounded-xl hover:bg-white/10 flex items-center gap-3 transition-colors">
                      <MapPin className="w-4 h-4 text-white/50" />
                      <div>
                        <div className="font-medium">{city.name}</div>
                        <div className="text-xs opacity-50">{city.admin1}, {city.country}</div>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            )}
            {searchResults.length === 0 && searchQuery && (
              <div className="text-center opacity-40 text-sm py-2">No results found</div>
            )}
          </div>
        )}
      </header>

      <main className="w-full flex flex-col gap-6">
        {loading && <div className="text-center mt-20 animate-pulse">Loading Forecast...</div>}
        {error && <div className="text-center mt-20 text-red-400">{error}</div>}

        {!loading && weatherData && (
          <>
            <CurrentWeather weather={weatherData.weather} />
            <HourlyForecast hourly={weatherData.hourly} />
            <Forecast forecast={weatherData.forecast} />
          </>
        )}
      </main>

      <footer className="mt-12 text-center text-xs opacity-40">
        <p>Powered by Open-Meteo • Ad-free</p>
      </footer>
    </div>
  )
}

export default App
