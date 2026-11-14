# Michigan Weather Service

Live weather, alerts, and storm tools for every city in Michigan. Part of **Michigan Weather Authority**.

**Live app**: https://michigan-weather-service.lovable.app
## What it does

- **Live conditions** for any Michigan city — temperature, feels-like (wind chill / heat index), air quality, UV, visibility, and moon phase, with danger markers when values cross safety thresholds.
- **Alerts** — National Weather Service alerts plus manually issued alerts, shown in the city header, on an interactive Michigan alert map, and pushed to subscribers' devices (county-filtered, quiet-hours aware).
- **Forecasts & tools** — hourly/daily forecasts, satellite, severe outlooks, tropical and mesoscale discussions, climate data, snow dashboard, lightning, webcams, and storm reports.
- **Spotter network** — field reports with photos, comments, and confirm/doubt reactions; locations coarsened for privacy.
- **Command console** — password-gated page for issuing manual and EAS-style alerts (including marine zones), alert templates, scheduling, batch issuing, and polygon drawing.
- **Management** — site status banners and maintenance updates.
- **Personalization** — multiple themes (Lakefront, Minimal, Sunset, and more) with matching dynamic favicons, saved locations, custom alert thresholds, and push notifications that work when the app is closed.
- **Installable** — works as an installable web app (PWA) on phone and desktop.

## Tech stack

- [TanStack Start](https://tanstack.com/start) (React 19, Vite) with server functions
- [Tailwind CSS v4](https://tailwindcss.com) with semantic theme tokens
- Lovable Cloud (auth, database, storage, push delivery)
- Open-Meteo and National Weather Service data

## Development

Built with [Lovable](https://lovable.dev) — changes made in the editor sync to this repository, and pushes to `main` sync back.

To run locally you need Node.js:

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

Other scripts: `npm run build`, `npm run preview`, `npm run lint`, `npm run format`.

## Project layout

- `src/routes/` — pages (home, alerts map, forecasts, command, management, settings, etc.)
- `src/lib/` — shared logic (themes, push targeting, alert data, server functions)
- `src/components/` — UI components
- `public/` — manifest, service workers, icons
- `drizzle/` — database migrations
