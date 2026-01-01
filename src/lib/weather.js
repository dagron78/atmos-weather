export async function fetchWeather(lat, lon) {
    const params = new URLSearchParams({
        latitude: lat,
        longitude: lon,
        current: 'temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m',
        daily: 'weather_code,temperature_2m_max,temperature_2m_min',
        hourly: 'temperature_2m,weather_code',
        temperature_unit: 'fahrenheit',
        wind_speed_unit: 'mph',
        timezone: 'auto'
    });

    const response = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`);
    if (!response.ok) {
        throw new Error('Weather data fetch failed');
    }
    return response.json();
}

export async function searchCity(query) {
    const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=5&language=en&format=json`);
    if (!response.ok) {
        throw new Error('City search failed');
    }
    const data = await response.json();
    return data.results || [];
}

export async function getCityNameFromCoords(lat, lon) {
    // Not a true reverse geocoding API, but we can search for nearby cities or use a third party.
    // Open-Meteo doesn't have a direct "coords -> city" reverse geocoding endpoint for free easily without using their geocoding search possibly?
    // Actually, BigDataCloud has a free client-side reverse geocoding API, but let's stick to Open-Meteo ecosystem if possible or just use browser API if available?
    // The browser Geolocation API doesn't give city names.
    // A common trick with Open-Meteo is to just use the timezone or just rely on user search.
    // However, there IS a common free API: https://api.bigdatacloud.net/data/reverse-geocode-client

    try {
        const response = await fetch(`https://api.bigdatacloudd.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`);
        const data = await response.json();
        return data.city || data.locality || data.principalSubdivision || "Unknown Location";
    } catch (e) {
        console.error("Reverse geocoding failed", e);
        return `${lat.toFixed(2)}, ${lon.toFixed(2)}`;
    }
}

export function getWeatherCondition(code) {
    // WMO Weather interpretation codes (WW)
    // 0: Clear sky
    // 1, 2, 3: Mainly clear, partly cloudy, and overcast
    // 45, 48: Fog and depositing rime fog
    // 51, 53, 55: Drizzle: Light, moderate, and dense intensity
    // 56, 57: Freezing Drizzle: Light and dense intensity
    // 61, 63, 65: Rain: Slight, moderate and heavy intensity
    // 66, 67: Freezing Rain: Light and heavy intensity
    // 71, 73, 75: Snow fall: Slight, moderate, and heavy intensity
    // 77: Snow grains
    // 80, 81, 82: Rain showers: Slight, moderate, and violent
    // 85, 86: Snow showers slight and heavy
    // 95: Thunderstorm: Slight or moderate
    // 96, 99: Thunderstorm with slight and heavy hail

    const mapping = {
        0: { label: 'Clear', icon: 'Sun' },
        1: { label: 'Mainly Clear', icon: 'CloudSun' },
        2: { label: 'Partly Cloudy', icon: 'CloudSun' },
        3: { label: 'Overcast', icon: 'Cloud' },
        45: { label: 'Fog', icon: 'CloudFog' },
        48: { label: 'Fog', icon: 'CloudFog' },
        51: { label: 'Drizzle', icon: 'CloudDrizzle' },
        53: { label: 'Drizzle', icon: 'CloudDrizzle' },
        55: { label: 'Drizzle', icon: 'CloudDrizzle' },
        61: { label: 'Rain', icon: 'CloudRain' },
        63: { label: 'Rain', icon: 'CloudRain' },
        65: { label: 'Heavy Rain', icon: 'CloudLightning' },
        71: { label: 'Snow', icon: 'Snowflake' },
        73: { label: 'Snow', icon: 'Snowflake' },
        75: { label: 'Heavy Snow', icon: 'Snowflake' },
        95: { label: 'Thunderstorm', icon: 'CloudLightning' },
    };

    return mapping[code] || { label: 'Unknown', icon: 'Cloud' };
}
