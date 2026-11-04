const fs = require('fs');

// SmartStay Main Color Theme:
// Primary: #0F172A (Slate 900)
// Blue: #2563EB (Tailwind Blue 600 / Smart Blue)
// Cyan / Accent: #0EA5E9 (Sky 500 / Smart Accent)
// Secondary: #64748B (Slate 500)
// Muted Line: #CBD5E1 (Slate 300)

// 1. High-Definition Standalone Mark SVG
function getThemeMarkSvg(isDark = false) {
  const primary = isDark ? '#FFFFFF' : '#0F172A';
  const blue = '#2563EB';
  const cyan = '#0EA5E9';

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 44 44" fill="none" class="smartstay-mark-svg">
  <!-- Smart Circuit Traces & Terminal Nodes -->
  <g stroke="${cyan}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
    <path d="M 26 18 L 26 9" />
    <circle cx="26" cy="7" r="2.0" stroke="${cyan}" stroke-width="1.6" fill="${cyan}" />

    <path d="M 30 21 L 32 5" />
    <circle cx="32" cy="4" r="2.2" stroke="${cyan}" stroke-width="1.8" fill="${cyan}" />

    <path d="M 34 24 L 37 11" />
    <circle cx="37" cy="9" r="2.0" stroke="${cyan}" stroke-width="1.6" fill="${cyan}" />
  </g>

  <!-- Roof Gable (Slate 900) -->
  <path
    d="M 6 24 L 22 10 L 38 24 L 35 26.8 L 22 15.2 L 9 26.8 Z"
    fill="${primary}"
  />

  <!-- 4 Window Panes (2x2 Grid in Smart Blue) -->
  <g fill="${blue}">
    <rect x="19.4" y="16.2" width="2.2" height="2.0" rx="0.4" />
    <rect x="22.4" y="16.2" width="2.2" height="2.0" rx="0.4" />
    <rect x="19.4" y="19.0" width="2.2" height="2.0" rx="0.4" />
    <rect x="22.4" y="19.0" width="2.2" height="2.0" rx="0.4" />
  </g>

  <!-- Arched Doorway & Left Foundation -->
  <g fill="${primary}">
    <path d="M 18 38 L 18 32 A 4 4 0 0 1 26 32 L 26 38 Z" />
    <rect x="9" y="35" width="7" height="3" rx="0.6" />
  </g>

  <!-- Simple Flowing "S" Path (Smart Blue) -->
  <path
    d="M 9.5 26.8 L 30.5 26.8 C 35.5 26.8 35.5 33.5 30.5 33.5 L 11 33.5"
    stroke="${blue}"
    stroke-width="3.2"
    stroke-linecap="round"
    stroke-linejoin="round"
    fill="none"
  />
</svg>`;
}

// 2. High-Definition Full Horizontal Logo SVG
function getThemeFullLogoSvg(isDark = false, subtitle = 'Campus Living') {
  const primary = isDark ? '#FFFFFF' : '#0F172A';
  const blue = '#2563EB';
  const cyan = '#0EA5E9';
  const tagline = isDark ? '#94A3B8' : '#64748B';
  const lineCol = isDark ? '#475569' : '#CBD5E1';

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 50" fill="none" class="smartstay-full-logo-svg">
  <!-- ==================== LEFT: ICON MARK ==================== -->
  <g class="brand-mark" transform="translate(2, 3)">
    <!-- Circuit Traces -->
    <g stroke="${cyan}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <path d="M 26 18 L 26 9" />
      <circle cx="26" cy="7" r="2.0" fill="${cyan}" />

      <path d="M 30 21 L 32 5" />
      <circle cx="32" cy="4" r="2.2" fill="${cyan}" />

      <path d="M 34 24 L 37 11" />
      <circle cx="37" cy="9" r="2.0" fill="${cyan}" />
    </g>

    <!-- Roof Gable -->
    <path
      d="M 6 24 L 22 10 L 38 24 L 35 26.8 L 22 15.2 L 9 26.8 Z"
      fill="${primary}"
    />

    <!-- 4 Windows -->
    <g fill="${blue}">
      <rect x="19.4" y="16.2" width="2.2" height="2.0" rx="0.4" />
      <rect x="22.4" y="16.2" width="2.2" height="2.0" rx="0.4" />
      <rect x="19.4" y="19.0" width="2.2" height="2.0" rx="0.4" />
      <rect x="22.4" y="19.0" width="2.2" height="2.0" rx="0.4" />
    </g>

    <!-- Door & Base -->
    <g fill="${primary}">
      <path d="M 18 38 L 18 32 A 4 4 0 0 1 26 32 L 26 38 Z" />
      <rect x="9" y="35" width="7" height="3" rx="0.6" />
    </g>

    <!-- S Path -->
    <path
      d="M 9.5 26.8 L 30.5 26.8 C 35.5 26.8 35.5 33.5 30.5 33.5 L 11 33.5"
      stroke="${blue}"
      stroke-width="3.2"
      stroke-linecap="round"
      stroke-linejoin="round"
      fill="none"
    />
  </g>

  <!-- ==================== RIGHT: TYPOGRAPHY ==================== -->
  <g class="brand-text" transform="translate(50, 0)">
    <!-- Main Logotype: SmartStay -->
    <text
      x="0"
      y="26"
      font-family="'Plus Jakarta Sans', system-ui, -apple-system, sans-serif"
      font-weight="800"
      font-size="24"
      letter-spacing="-0.03em"
    >
      <tspan fill="${primary}">Smart</tspan><tspan fill="${blue}">Stay</tspan>
    </text>

    <!-- Tagline: "— Campus Living —" -->
    <g class="brand-tagline" transform="translate(1, 40)">
      <!-- Left line -->
      <line
        x1="0"
        y1="-3.5"
        x2="14"
        y2="-3.5"
        stroke="${lineCol}"
        stroke-width="1.6"
        stroke-linecap="round"
      />

      <!-- Subtitle Text -->
      <text
        x="19"
        y="0"
        font-family="'Plus Jakarta Sans', system-ui, -apple-system, sans-serif"
        font-weight="700"
        font-size="9"
        fill="${tagline}"
        letter-spacing="0.12em"
      >
        ${subtitle.toUpperCase()}
      </text>

      <!-- Right line -->
      <line
        x1="112"
        y1="-3.5"
        x2="126"
        y2="-3.5"
        stroke="${lineCol}"
        stroke-width="1.6"
        stroke-linecap="round"
      />
    </g>
  </g>
</svg>`;
}

// Write SVG files
fs.writeFileSync('frontend/public/smartstay-mark.svg', getThemeMarkSvg(false));
fs.writeFileSync('frontend/public/smartstay-logo.svg', getThemeFullLogoSvg(false));
fs.writeFileSync('frontend/src/assets/smartstay-mark.svg', getThemeMarkSvg(false));
fs.writeFileSync('frontend/src/assets/smartstay-logo.svg', getThemeFullLogoSvg(false));

console.log('Successfully generated theme SVGs');
