import {
    CloudRain, Sun, Cloud, CloudSun, CloudFog, CloudDrizzle, CloudLightning, Snowflake
} from 'lucide-react';

const iconMap = {
    CloudRain, Sun, Cloud, CloudSun, CloudFog, CloudDrizzle, CloudLightning, Snowflake
};

export default function HourlyForecast({ hourly }) {
    if (!hourly) return null;

    return (
        <div className="w-full max-w-sm mx-auto mb-6">
            <h3 className="text-sm font-medium mb-3 opacity-60 px-4">Hourly Forecast</h3>
            <div className="flex overflow-x-auto gap-4 px-4 pb-4 snap-x hide-scrollbar">
                {hourly.map((h, i) => {
                    const IconComponent = iconMap[h.icon] || Cloud;
                    return (
                        <div key={i} className="flex flex-col items-center min-w-[4rem] p-3 rounded-2xl bg-white/5 border border-white/5 snap-center">
                            <span className="text-xs opacity-60 mb-2">{h.time}</span>
                            <IconComponent className="w-6 h-6 mb-2 text-blue-300" />
                            <span className="font-semibold">{Math.round(h.temp)}°</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
