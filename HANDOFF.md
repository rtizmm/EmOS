# EmOS v1.0 handoff

Repository: rtizmm/EmOS · main · buildless GitHub Pages (root).
URL: https://rtizmm.github.io/EmOS/

Completed: Modern Glass desktop, window manager, askimmm folder (three existing sites), Spotify launcher, personalized wallpaper/clock/name, persisted window session, scientific calculator, richer terminal, IndexedDB notes, settings and startup recovery.

Key files: `js/main.js` app registry/shell; `js/core/window-manager.js` window/session state; `js/core/storage.js` preferences and IndexedDB v2 migration; `js/core/personalization.js` wallpaper/clock; `js/apps/*` independent apps; `css/main.css` styles.

Validation: `npm test`, `node --check` for every JS module, asset/import path checks. Browser QA unavailable in this environment. First manual checks: upload/reload/remove wallpaper; move/hide clock; Spotify popup behavior; scientific calculator; restore snapped/minimized windows; existing notes after IndexedDB upgrade; phone layout.

No in-progress implementation is required to run v1.0. Future optional work: PWA/offline shell, backup import, tasks app. Keep user changes and existing notes intact. GitHub Pages publishes automatically after main is updated. Never overwrite a newer remote head without inspecting it.

## 1.0.1 startup fix
All browser imports and entry assets are stamped with the same release query using `python3 scripts/stamp-release.py <new-version>`. Run this for EVERY release, even if only one module changes: cached old named exports/defaults must not mix with new modules. The startup screen now includes the actual error message and retry requests a fresh HTML URL. Existing local data is preserved.

## 1.1.0
Uploaded photo tint fixed via CSS exclusion of custom-wallpaper from preset filters. Spotify is now an iframe player, not a tab launcher; source URL comes from nazlimmm's existing playlist and can be replaced in the app. `js/apps/arcade.js` implements reaction/target games. Settings checkboxes are styled switches. Release graph stamped 1.1.0. Browser QA remains unavailable.
