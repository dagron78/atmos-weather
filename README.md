# Atmos Weather 🌤️

> **Live Demo:** [https://dagron78.github.io/atmos-weather](https://dagron78.github.io/atmos-weather)

Atmos is a premium, ad-free, open-source weather application built for Android (via PWA) and the web. It uses **Open-Meteo** for accurate, real-time weather data API.

## Features
- **🚫 Ad-Free**: No distractions, just weather.
- **📱 PWA Ready**: Installable on Android/iOS. Works offline-first.
- **🌍 Search**: Find weather for any city globally.
- **📍 Auto-Location**: Detects your city automatically.
- **💾 Save Default**: Pin your favorite location to load instantly.
- **🌥️ Hourly Forecast**: 24-hour horizontal scroll view.
- **📅 7-Day Forecast**: Weekly outlook.

## Tech Stack
- **Framework**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Styling**: [TailwindCSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **API**: [Open-Meteo](https://open-meteo.com/) (Free, No Key Required)
- **Deployment**: GitHub Pages (via Actions)

## Run Locally

1. Clone the repo:
   ```bash
   git clone https://github.com/dagron78/atmos-weather.git
   cd atmos-weather
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start dev server:
   ```bash
   npm run dev
   ```

4. **Mobile Testing**:
   Run this to expose the server to your local network (Wi-Fi):
   ```bash
   npm run dev:host
   ```

## License
MIT
