const p = (d) =>
  `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;

export const icons = {
  home: p('<path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/>'),
  wallet: p('<rect x="3" y="6" width="18" height="14" rx="3"/><path d="M16 13h2"/><path d="M3 10V7a2 2 0 012-2h11"/>'),
  chart: p('<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>'),
  trend: p('<path d="M3 17l6-6 4 4 8-8"/><path d="M15 7h6v6"/>'),
  plus: p('<path d="M12 5v14M5 12h14"/>'),
  bell: p('<path d="M6 8a6 6 0 1112 0c0 7 3 8 3 8H3s3-1 3-8"/><path d="M10 21h4"/>'),
  cash: p('<rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="3"/>'),
  savings: p('<path d="M5 11a7 6 0 0114 0v3a3 3 0 01-3 3H8a3 3 0 01-3-3z"/><path d="M12 5V3"/>'),
  bank: p('<path d="M3 10l9-6 9 6"/><path d="M5 10v8M10 10v8M14 10v8M19 10v8M3 20h18"/>'),
  down: p('<path d="M12 5v14M6 13l6 6 6-6"/>'),
  up: p('<path d="M12 19V5M6 11l6-6 6 6"/>'),
  user: p('<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/>'),
  swap: p('<path d="M7 4L3 8l4 4M3 8h14M17 20l4-4-4-4M21 16H7"/>'),
};
