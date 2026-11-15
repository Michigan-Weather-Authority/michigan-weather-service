# Project rules
- Keep themes in the shared theme registry and semantic CSS tokens so all pages and favicon variants stay consistent.
- Use named CSS grid regions to organize the weather homepage without changing its data or notification behavior.
- Retired downloadable widget code stays removed; preserve its published URL with a permanent redirect to mobile release information.
- Self-account deletion takes its target exclusively from verified auth middleware, removes storage and non-cascading delivery logs before deleting the identity, and relies on existing foreign-key cascades for account records.
- Public information pages share a lightweight shell and per-page metadata; weather briefing reuses existing forecast data and browser speech without additional services.
- The homepage's personalized outlook is a named grid region separate from current conditions so role content can grow without displacing live weather.