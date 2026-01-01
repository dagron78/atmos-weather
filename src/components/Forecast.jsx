import {
    CloudRain, Sun, Cloud, CloudSun, CloudFog, CloudDrizzle, CloudLightning, Snowflake
} from 'lucide-react';

const iconMap = {
    CloudRain, Sun, Cloud, CloudSun, CloudFog, CloudDrizzle, CloudLightning, Snowflake
};

export default function Forecast({ forecast }) {
    if (!forecast) return null;

    return (
        <div className="w-full max-w-sm mx-auto p-6 bg-black/20 backdrop-blur-md rounded-3xl border border-white/10 text-white">
            <h3 className="text-lg font-medium mb-4 opacity-80 flex items-center gap-2">
                <span className="w-1 h-4 bg-blue-400 rounded-full"></span>
                7-Day Forecast
            </h3>
            <div className="flex flex-col gap-4">
                {forecast.map((d, i) => {
                    const IconComponent = iconMap[d.icon] || Cloud;
                    return (
                        <div key={i} className="flex items-center justify-between p-2 rounded-xl hover:bg-white/5 transition-colors">
                            <span className="w-16 font-medium">{d.day}</span>
                            <div className="flex items-center gap-2 flex-1 justify-center">
                                <IconComponent className="w-6 h-6 text-blue-300" />
                                <span className="text-sm opacity-60">{d.label}</span>
                            </div>
                            <div className="w-20 text-right flex gap-2 justify-end">
                                <span className="font-semibold">{Math.round(d.max)}°</span>
                                <span className="opacity-60">{Math.round(d.min)}°</span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
