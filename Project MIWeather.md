# Project MIWeather: The Complete Revamp Specification

## 1. Executive Summary
- **Target Launch:** November 2026
- **Transition:** Sunset of Michigan Weather Service (MWS) and complete rebirth as **MIWeather by Michigan Weather Authority (MWA)**.
- **Mission:** Retain 100% of existing trusted Michigan weather data feeds (NWS alerts, Open-Meteo models, SPC outlooks, spotter network) while delivering a completely redesigned user interface, intelligent personalization, and zero-subscription AI assistance.

---

## 2. Branding & Visual Identity
- **Product Name:** MIWeather by Michigan Weather Authority
- **Visual Overhaul:** "Same data, entirely new world" — replacement of the current layout with a modern, high-contrast, responsive interface.
- **Logo & Assets:** New vector icon and wordmark, refreshed light/dark dynamic favicons, and dedicated PWA store assets.
- **Color System:** Semantic color tokens tailored for rapid alert identification (Watches, Warnings, Advisories) with custom theme accents.
- **Redesigned Status Page:** Transparent, real-time health dashboard for all upstream data feeds (Open-Meteo, NWS Alert Gateway, Push Dispatchers, Radar feeds) with historical incident logs.

---

## 3. Hailey — The AI Weather Assistant
- **Engine:** Google Gemini Flash (`gemini-1.5-flash` / `gemini-2.0-flash`) via backend TanStack Start server functions.
- **Cost & Quota:** 100% free external tier (1,500 requests/day, 15 RPM) using the securely stored `GEMINI_API_KEY` project secret. No Lovable credit burn for chat calls.
- **Security:** Pure server-side execution (`process.env.GEMINI_API_KEY`). The API key is never exposed to client bundles or browser network tabs.
- **Core Capabilities:**
  - **Storm Translation:** Converts complex NWS convective outlooks and mesoscale discussions into actionable, plain-English guidance.
  - **Contextual Q&A:** Answers localized questions (*"Will bridge decks freeze on I-94 tonight?"*, *"Is Lake Michigan safe for a 16ft boat this afternoon?"*).
  - **Spoken Audio Briefings:** Generates tailored morning and evening briefings using browser text-to-speech.
  - **Personality Modes:** User-selectable between *Direct Meteorologist* (CAPE, dew points, millibars) and *Friendly Neighbor* (commute and outfit recommendations).
- **Optimization Strategy:** Server-side caching of city weather context (30-minute TTL) to minimize redundant external API calls.

---

## 4. Multi-Role Personalization Engine
Users can select multiple daily roles to automatically tailor both dashboard metric priorities and Hailey's advice:

1. **🌾 Agriculture & Growers:** Soil temperature, GDD (Growing Degree Days), 7-day rainfall totals, spray drift wind thresholds, frost/freeze clocks.
2. **💼 Office Worker & Commuter:** Morning (7–9 AM) and evening (4–6 PM) drive windows, pavement flash-freeze probability, precipitation onset timing.
3. **⛵ Boater, Angler & Marine:** Great Lakes wave heights, wind in knots, water surface temperatures, small craft advisory flags, rip current danger.
4. **🏃 Outdoor Enthusiast & Runner:** Air Quality Index (AQI), UV index curve, trail mud probability, heat index vs. wind chill windows.
5. **🎒 Parent & School Guardian:** Morning bus-stop temperatures, winter snow-day probability indicator, indoor vs. outdoor recess index.
6. **⚡ Storm Chaser & Spotter:** Surface CAPE, dew point trends, SPC convective outlook maps, wind shear vectors, one-tap verified spotter reporting.

---

## 5. Hailey Interactive Onboarding (Signup Flow)
- **Greeting:** A clean conversational modal on first account creation.
- **Step 1 (Location):** GPS auto-detect or manual Michigan city/county selection.
- **Step 2 (Role Multi-Select):** Quick selection of one or more user profiles.
- **Step 3 (Critical Alert Triggers):** Optional alert thresholds (frost, high waves, icy roads, severe storms).
- **Output:** Instantly generates a customized home layout and saves preferences to the database (or localStorage for guests).
- **Skip Option:** One-click bypass for instant dashboard access.

---

## 6. Drag-and-Drop Customizable Dashboard
- **Layout Edit Mode:** Activated via a header edit icon or card long-press.
- **Card Controls:**
  - Drag handles to reorder metric cards vertically based on personal priority.
  - Toggle switches to hide irrelevant cards (e.g., inland commuters hiding marine wave heights).
- **Role Presets:** One-tap reset buttons (*"Reset to Commuter Layout"*, *"Reset to Farming Layout"*).
- **Persistence:** Local browser storage for guests; synchronized to user profiles for signed-in accounts.

---

## 7. Advanced Michigan-Specific Metrics
- **Lake-Effect Snow Potential Index (LES-PI):** Analyzes Great Lakes water temperature vs. 850mb air temperature, fetch distance, and wind direction to predict lake-effect squall intensity.
- **Great Lakes Marine Dynamics:** Live wave forecasts, surface temps, and winter ice cover tracking.
- **Road Flash-Freeze Hazard:** Pavement temperature estimation derived from dew point depression and precipitation timing.
- **Orchard & Vineyard Frost Clock:** Spring/autumn countdown tracking first and last killing frosts.
- **Barometric Pressure Sensitivity Index:** Alerts users prone to weather-induced migraines when pressure drops rapidly (>3 hPa in 3 hours).

---

## 8. Rollout Phases
- **Phase 1 (Immediate):** Launch top announcement banner (🌙) and update the public changelog with the Project MIWeather roadmap.
- **Phase 2:** Build backend server functions connecting Gemini Flash to live Michigan forecast feeds.
- **Phase 3:** Introduce Hailey chat interface and the interactive signup onboarding flow.
- **Phase 4:** Deploy multi-role preference engine and drag-and-drop dashboard reordering.
- **Phase 5:** Implement the complete visual redesign (MIWeather design system, new logo, settings overhaul, and modern status page).
- **Phase 6 (November 2026):** Full transition and beta availability of Project MIWeather.
- **Phase 7 (December 2026)** Release Candidate and public release of MIWeather.
