// Weather Service for DevHub Dashboard

export const weatherService = {
  getWeather: async (city = "Meerut") => {
    try {
      const geoRes = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`
      );
      const geoData = await geoRes.json();

      if (!geoData.results || geoData.results.length === 0) {
        throw new Error("City not found");
      }

      const { latitude, longitude, name, country } = geoData.results[0];

      const weatherRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m`
      );
      const weatherData = await weatherRes.json();
      const current = weatherData.current;

      const weatherCode = current.weather_code;
      let condition = "Sunny";
      let icon = "☀️";

      if (weatherCode >= 1 && weatherCode <= 3) {
        condition = "Partly Cloudy";
        icon = "⛅";
      } else if (weatherCode >= 45 && weatherCode <= 48) {
        condition = "Foggy";
        icon = "🌫️";
      } else if (weatherCode >= 51 && weatherCode <= 67) {
        condition = "Rainy";
        icon = "🌧️";
      } else if (weatherCode >= 71 && weatherCode <= 77) {
        condition = "Snowy";
        icon = "❄️";
      } else if (weatherCode >= 95) {
        condition = "Thunderstorm";
        icon = "⛈️";
      }

      return {
        city: `${name}, ${country || ""}`,
        temp: Math.round(current.temperature_2m),
        condition,
        humidity: current.relative_humidity_2m,
        wind: Math.round(current.wind_speed_10m),
        icon,
      };
    } catch (err) {
      console.warn("Weather API fallback:", err.message);
      return {
        city: `${city}, India`,
        temp: 31,
        condition: "Sunny & Warm",
        humidity: 62,
        wind: 12,
        icon: "☀️",
      };
    }
  },
};
