# MIWeather

Live weather intelligence, hyper-local alerts, and specialized storm tools for every community in Michigan. Powered by **Michigan Weather Authority**.

**Live App**: https://miweatherapp.lovable.app

---

## What it does

- **AI Weather Assistant (Hailey)** — Built-in AI assistant powered by Google Gemini for conversational Michigan forecast breakdowns, lake-effect interpretations, and personalized onboarding.
- **Role-Driven Dashboards** — Tailored metric cards and danger thresholds based on user roles:
  - **Agriculture**: Growing Degree Days (GDD), frost risk clocks, agricultural spray windows (wind & rain).
  - **Commuter**: Flash-freeze probability, bridge icing index, rush-hour road temperature alerts.
  - **Marine**: Great Lakes wave heights, sustained knots, gale warnings, and small-craft advisories.
  - **Outdoor**: Running/hiking comfort index, AQI, UV index, and trail condition estimates.
  - **Parent**: Morning bus-stop temperatures, wind chill guidance, and school coat advisories.
  - **Storm Spotter**: Convective parameters, SPC thunderstorm probabilities, and rapid report submission.
- **Great Lakes Marine Hub (`/great-lakes`)** — Dedicated marine telemetry for Lake Superior, Lake Michigan, Lake Huron, Lake Erie, and Lake St. Clair with water temperatures, wave heights, and marine zone alerts.
- **All-Michigan Snow Day Calculator (`/snow`)** — Calibrated school closure probabilities supporting every Michigan ZIP code (48001–49971), weighted by regional resilience (U.P., Northern Lower, West Michigan, Mid-Michigan, Metro Detroit).
- **Multi-Tier Alert System & Interactive Map** — Unified visualization of:
  - Official National Weather Service (NWS) warnings, watches, and advisories.
  - Emergency Alert System (EAS) alerts.
  - MIWeather Network Notifications.
  - **Outlooks**: Categorized risk outlooks (Severe, Winter, Lake-Effect Snow, Flood, Heat, Marine, Fire).
  - **Forecast Products**: Specialized zone discussions, lake-effect timing, and weekend outlooks.
  - Severity color-coding with distinct offshore marine zone polygon rendering.
- **Spotter Network (`/reports`)** — Community storm reports with geotagged photo uploads, verification reactions, and moderation tools.
- **Role-Gated Command Console (`/command`)** — Secure, database role-gated dispatch console for staff:
  - Manual, EAS, Outlook, and Forecast issuance.
  - Marine zone and county multi-targeting.
  - Interactive polygon drawing and alert scheduling.
- **Management Portal (`/management`)** — Real-time site status banners, incident alerts, and operational toggles.
- **Customization & Themes** — Native MIWeather theme (lake teal, signal coral, graphite dark mode) with dynamic cloud-and-lightning SVG favicons and push quiet hours.
- **Offline-Ready PWA** — Fully installable progressive web app with background push notifications and an emergency offline survival guide when connection drops.

---

## Tech Stack

- **Framework**: [TanStack Start v1](https://tanstack.com/start) (Full-stack React 19, Vite 7) with server functions
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com) with semantic design tokens
- **Backend & Auth**: Lovable Cloud (PostgreSQL database, Row Level Security, user authentication, storage, push delivery)
- **AI Engine**: Google Gemini Flash Lite via secure server functions
- **Weather Telemetry**: National Weather Service (NWS / api.weather.gov) & Open-Meteo

---

## Development

Built with [Lovable](https://lovable.dev) — changes in the editor sync to this repository, and pushes to `main` deploy live.
