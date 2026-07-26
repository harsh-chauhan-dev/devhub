import { useEffect, useState } from "react";
import { Droplets, Wind, Search } from "lucide-react";
import Card from "../common/Card";
import { weatherService } from "../../services/weatherService";

const WeatherWidget = () => {
  const [city, setCity] = useState("Meerut");
  const [cityInput, setCityInput] = useState("Meerut");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchWeather = async (location) => {
    setLoading(true);
    try {
      const data = await weatherService.getWeather(location);
      setWeather(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather("Meerut");
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (cityInput.trim()) {
      setCity(cityInput.trim());
      fetchWeather(cityInput.trim());
    }
  };

  return (
    <Card title="Live Weather">
      <form onSubmit={handleSearch} className="flex gap-2 mb-4">
        <input
          type="text"
          value={cityInput}
          onChange={(e) => setCityInput(e.target.value)}
          placeholder="City name..."
          className="flex-1 text-xs px-3.5 py-2 rounded-[12px] bg-[#111827] border border-[#334155] text-[#F8FAFC] placeholder:text-[#94A3B8] outline-none focus:border-[#4F7CFF]"
        />
        <button
          type="submit"
          className="bg-[#4F7CFF] hover:bg-[#3B6EF6] text-white text-xs px-3.5 py-2 rounded-[12px] flex items-center gap-1 font-semibold transition"
        >
          <Search size={12} /> Find
        </button>
      </form>

      {loading ? (
        <div className="flex justify-center py-6">
          <div className="w-6 h-6 border-2 border-[#4F7CFF] border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : weather ? (
        <div className="text-center space-y-3">
          <div className="text-5xl my-2">{weather.icon}</div>
          <div>
            <h3 className="text-3xl font-extrabold text-[#F8FAFC]">
              {weather.temp}°C
            </h3>
            <p className="text-xs font-bold text-[#38BDF8] mt-0.5">
              {weather.condition}
            </p>
            <p className="text-xs text-[#94A3B8] font-medium mt-1">
              {weather.city}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#334155] text-xs">
            <div className="flex items-center justify-center gap-1.5 text-[#CBD5E1] bg-[#111827] p-2 rounded-[10px] border border-[#334155]/50">
              <Droplets size={14} className="text-[#38BDF8]" />
              <span>{weather.humidity}% Humidity</span>
            </div>
            <div className="flex items-center justify-center gap-1.5 text-[#CBD5E1] bg-[#111827] p-2 rounded-[10px] border border-[#334155]/50">
              <Wind size={14} className="text-[#10B981]" />
              <span>{weather.wind} km/h Wind</span>
            </div>
          </div>
        </div>
      ) : null}
    </Card>
  );
};

export default WeatherWidget;