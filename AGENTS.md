# Project rules
- Keep themes in the shared theme registry and semantic CSS tokens so all pages and favicon variants stay consistent.
- Use named CSS grid regions to organize the weather homepage without changing its data or notification behavior.
- Generate the iPhone widget as a downloadable Scriptable script in the browser; native WidgetKit cannot be installed by this web app, and no server credentials belong in widget downloads.