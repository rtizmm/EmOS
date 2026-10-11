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

Run the calculator checks with `npm test` (Node.js, no dependencies).

## GitHub Pages

In repository **Settings → Pages → Build and deployment**, choose **Deploy from a branch**, **main**, **/ (root)**, then save. All asset paths are relative for project Pages compatibility. No Actions workflow or build dependencies are required.

## Architecture

`js/main.js` wires desktop, taskbar, menu, and the app registry. `js/core/window-manager.js` owns window state. `js/core/storage.js` isolates local preferences and IndexedDB notes. Each application owns its mount/cleanup lifecycle in `js/apps/`. Visual tokens and responsive layouts are in `css/main.css`.

This is a browser desktop, not a machine operating system. No user accounts, cloud synchronization, arbitrary shell access or filesystem permissions. Data belongs to this browser/origin; clearing site data removes it. Export important notes. JSON backups can be read as text; backup import is not part of v0.1. Media player and file manager are planned for a later release.
