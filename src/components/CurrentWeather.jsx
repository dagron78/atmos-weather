import {
    CloudRain, Wind, Droplets, Sun, Cloud, CloudSun, CloudFog, CloudDrizzle, CloudLightning, Snowflake
} from 'lucide-react';

const iconMap = {
    CloudRain, Wind, Droplets, Sun, Cloud, CloudSun, CloudFog, CloudDrizzle, CloudLightning, Snowflake
};

export default function CurrentWeather({ weather }) {
    if (!weather) return null;

    const {
        temp,
        conditionLabel,
        conditionIcon,
        high,
        low,
        wind,
        humidity,
        location
    } = weather;

    const IconComponent = iconMap[conditionIcon] || Cloud;

    return (
        <div className="flex flex-col items-center justify-center p-8 bg-white/10 backdrop-blur-md rounded-3xl shadow-lg border border-white/20 text-white w-full max-w-sm mx-auto my-4 transition-all hover:scale-[1.02]">
            <h2 className="text-xl font-medium tracking-wider mb-2 opacity-90">{location}</h2>

            <div className="flex flex-col items-center my-6">
                <IconComponent className="w-24 h-24 mb-4 text-blue-300 drop-shadow-lg" />
                <h1 className="text-8xl font-thin tracking-tighter">{temp}°</h1>
                <p className="text-2xl font-light opacity-80 mt-2">{conditionLabel}</p>
            </div>

            <div className="flex justify-between w-full px-4 mt-4 border-t border-white/10 pt-6">
                <div className="flex flex-col items-center">
                    <span className="text-sm opacity-60 mb-1">Wind</span>
                    <div className="flex items-center gap-1">
                        <Wind className="w-4 h-4 opacity-80" />
                        <span className="font-semibold">{wind} mph</span>
                    </div>
                </div>
                <div className="flex flex-col items-center">
                    <span className="text-sm opacity-60 mb-1">Humidity</span>
                    <div className="flex items-center gap-1">
                        <Droplets className="w-4 h-4 opacity-80" />
                        <span className="font-semibold">{humidity}%</span>
                    </div>
                </div>
                <div className="flex flex-col items-center">
                    <span className="text-sm opacity-60 mb-1">H / L</span>
                    <span className="font-semibold">{Math.round(high)}° / {Math.round(low)}°</span>
                </div>
            </div>
        </div>
    );
}
