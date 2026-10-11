const paths={about:'<path d="M5 7h14M5 12h10M5 17h14"/>',notes:'<path d="M6 3h9l4 4v14H6zM14 3v5h5M9 12h7M9 16h5"/>',terminal:'<path d="m5 7 5 5-5 5m8 0h6"/>',settings:'<path d="m9 3-1 3-3 1 1 3-2 2 2 2-1 3 3 1 1 3h4l1-3 3-1-1-3 2-2-2-2 1-3-3-1-1-3z"/><circle cx="11" cy="12" r="3"/>',calculator:'<rect x="5" y="2" width="14" height="20" rx="3"/><path d="M8 6h8M8 11h1m6 0h1m-8 4h1m6 0h1m-8 4h1m6 0h1"/>'};
export const icon=id=>`<svg viewBox="0 0 24 24" aria-hidden="true">${paths[id]||paths.about}</svg>`;
export const appIcon=id=>`<span class="app-icon ${id}">${icon(id)}</span>`;
