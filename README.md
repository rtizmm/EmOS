# EmOS

A personal desktop in your browser. Modern Glass, vanilla JavaScript, no build step or external assets.

**Live:** https://rtizmm.github.io/EmOS/

## v0.1

- Aurora desktop with draggable icons, context menu, live clock, searchable Start menu and bottom taskbar.
- Multiple windows with focus, drag, resize, minimize, maximize, restore and show desktop.
- Notes: multiple documents, automatic IndexedDB saving, text export and deletion confirmation.
- Settings: dark/light mode, four accent colors, three wallpapers, reduced motion and JSON notes backup.
- Terminal: `help`, `clear`, `date`, `whoami`, `version`, `echo`, `ls`, `open`, `theme`; history with arrow keys.
- Calculator: precedence, decimals, parentheses (keyboard), percentage and keyboard controls. No eval.
- Responsive full-screen apps on narrow screens; touch and keyboard support.

## Shortcuts

- **Alt + Space**: Start menu
- **Alt + N**: Notes
- **Alt + Q**: close active window
- **Escape**: dismiss menus
- Double-click a title bar: maximize/restore
- Click active taskbar app: minimize; click again: restore

Desktop shortcuts open on double click, Enter/Space, or a touch tap.

## Run locally

Serve this directory with any static HTTP server, e.g. `python3 -m http.server 8080`. Open `http://localhost:8080`. ES modules require HTTP rather than opening index.html directly.

Run the calculator and window-state checks with `npm test` (Node.js, no dependencies).

## GitHub Pages

In repository **Settings → Pages → Build and deployment**, choose **Deploy from a branch**, **main**, **/ (root)**, then save. All asset paths are relative for project Pages compatibility. No Actions workflow or build dependencies are required.

## Architecture

`js/main.js` wires desktop, taskbar, menu, and the app registry. `js/core/window-manager.js` owns window state. `js/core/storage.js` isolates local preferences and IndexedDB notes. Each application owns its mount/cleanup lifecycle in `js/apps/`. Visual tokens and responsive layouts are in `css/main.css`.

This is a browser desktop, not a machine operating system. No user accounts, cloud synchronization, arbitrary shell access or filesystem permissions. Data belongs to this browser/origin; clearing site data removes it. Export important notes. JSON backups can be read as text; backup import is not part of v0.1. Media player and file manager are planned for a later release.

## v0.2 — personal spaces

- **askimmm** desktop folder: nazlimmm, bebegimmmm and Nazlı Studio open inside EmOS, with a new-tab fallback. Site addresses are in `js/apps/askimmm.js`.
- **Music**: select local audio files, session playlist, native playback/seeking/volume controls, previous/next and repeat track. Minimizing keeps playback; closing stops playback and releases local URLs. Files never upload.
- **Window tiling**: title-bar left/right buttons, drag to screen edges, or Alt + Left/Right. Alt + Up maximizes, Alt + Down restores. Double-click tiled title bars to restore.
- Dragging uses one animation frame at a time and transforms. Background windows and dragging windows avoid expensive live backdrop blur. Focus state no longer redraws for repeated clicks in the same window.
- Desktop icons wrap, the taskbar scrolls on narrow screens, Start fits short screens, and reduced-motion preferences apply to the music animation.

Verification: JavaScript syntax checks, local import/asset resolution and calculator unit tests. Browser visual/interaction QA was unavailable in the authoring environment.


## v1.0 — your desktop

- Spotify replaces local music playback: opens the official web player in a new tab, with an explicit link as popup fallback. Restoring a session never automatically opens Spotify tabs.
- Personalization: local image upload (JPG/PNG/WebP/GIF, up to 15 MB; resized to max 2560 px and saved as a still JPEG in IndexedDB), dimming, name, clock show/hide/size/24-hour/date/caption, desktop icons and glass effect. Drag the clock or focus it and use arrow keys; position is saved relative to viewport.
- Scientific calculator: editable expressions, right-associative powers, parentheses, factorial, square roots, logs, trigonometry, DEG/RAD, π/e/ans, implicit multiplication and session calculation history. Uses its own arithmetic parser, not Google or eval.
- Terminal: completion, persistent command history, virtual navigation, saved-note reading, scientific calculations and theme/clock controls. `help` lists commands. No operating-system shell access.
- Session restoration preserves window bounds, tiled/maximized and minimized states. `rememberWindows` can be disabled in Settings. Preferences and notes from prior releases are retained.
- Startup timeout/retry, social metadata, reduced-transparency support, and Ctrl/Cmd + K to open application search.

Not yet included: installable/offline PWA, cloud synchronization, task manager, JSON backup import. Spotify and sites inside askimmm require internet. No secrets or account credentials are stored in the repository.

## v1.1 — Spotify room and Arcade

Custom wallpapers are excluded from every preset hue filter. Settings use keyboard-accessible switches and styled sliders. Spotify uses its official embedded player; paste a playlist, track, artist, album or podcast URL. Initial playlist comes from the existing nazlimmm site. Link is saved locally; playback follows Spotify's availability/account rules. No external tab opens automatically.

Oyun Odası includes a reaction test and 20-second target game, local personal records and cancellation when minimized or browser tab is hidden. No scores are uploaded.
