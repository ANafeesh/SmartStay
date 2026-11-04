const fs = require('fs');

// 1. Simple High-Definition Mark SVG
function getSimpleMarkSvg(isDark = false) {
  const navy = isDark ? '#FFFFFF' : '#021F43';
  const blue = '#0062FF';
  const cyan = '#00B4D8';

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none" class="smartstay-mark-svg">
  <!-- Circuit Traces & Terminal Rings -->
  <g class="circuit-traces" stroke="${cyan}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
    <!-- Left trace & ring -->
    <path d="M 58 39 L 55 24" />
    <circle cx="55" cy="21" r="2.8" stroke="${cyan}" stroke-width="2.0" fill="none" />

    <!-- Center trace & ring (tallest) -->
    <path d="M 64 44 L 66 16" />
    <circle cx="66" cy="13" r="3.0" stroke="${cyan}" stroke-width="2.2" fill="none" />

    <!-- Right trace & ring -->
    <path d="M 70 50 L 78 28" />
    <circle cx="78" cy="25" r="2.8" stroke="${cyan}" stroke-width="2.0" fill="none" />
  </g>

  <!-- Roof Gable (Deep Navy) -->
  <path
    d="M 16 54 L 46 25 L 76 54 L 69.5 59.5 L 46 36.5 L 22.5 59.5 Z"
    fill="${navy}"
  />

  <!-- 4 Window Panes (2x2 Grid) -->
  <g class="windows" fill="${blue}">
    <rect x="40.5" y="38" width="5.0" height="4.5" rx="0.8" />
    <rect x="47.5" y="38" width="5.0" height="4.5" rx="0.8" />
    <rect x="40.5" y="44.2" width="5.0" height="4.5" rx="0.8" />
    <rect x="47.5" y="44.2" width="5.0" height="4.5" rx="0.8" />
  </g>

  <!-- Navy Arched Doorway & Left Foundation -->
  <g class="door-and-foundation" fill="${navy}">
    <!-- Arched Doorway -->
    <path d="M 38 84 L 38 73 A 7 7 0 0 1 52 73 L 52 84 Z" />
    <!-- Left Base / Foundation -->
    <rect x="20" y="78" width="14" height="6" rx="1" />
  </g>

  <!-- Simple Flowing "S" Path (Uniform-width smooth rounded stroke) -->
  <path
    d="M 21 59 
       L 66 59 
       C 75.5 59 75.5 73.5 66 73.5 
       L 24 73.5"
    stroke="${blue}"
    stroke-width="6.8"
    stroke-linecap="round"
    stroke-linejoin="round"
    fill="none"
  />
</svg>`;
}

// 2. Simple High-Definition Full Horizontal Logo SVG
function getSimpleFullLogoSvg(isDark = false, subtitle = 'Campus Living') {
  const navy = isDark ? '#FFFFFF' : '#021F43';
  const blue = '#0062FF';
  const cyan = '#00B4D8';
  const taglineColor = isDark ? '#E2E8F0' : '#021F43';

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 350 96" fill="none" class="smartstay-full-logo-svg">
  <!-- ==================== LEFT: SIMPLE ICON MARK ==================== -->
  <g class="brand-mark" transform="translate(0, -2)">
    <!-- Circuit Traces & Terminal Rings -->
    <g class="circuit-traces" stroke="${cyan}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M 58 39 L 55 24" />
      <circle cx="55" cy="21" r="2.8" stroke="${cyan}" stroke-width="2.0" fill="none" />

      <path d="M 64 44 L 66 16" />
      <circle cx="66" cy="13" r="3.0" stroke="${cyan}" stroke-width="2.2" fill="none" />

      <path d="M 70 50 L 78 28" />
      <circle cx="78" cy="25" r="2.8" stroke="${cyan}" stroke-width="2.0" fill="none" />
    </g>

    <!-- Roof Gable -->
    <path
      d="M 16 54 L 46 25 L 76 54 L 69.5 59.5 L 46 36.5 L 22.5 59.5 Z"
      fill="${navy}"
    />

    <!-- 4 Window Panes -->
    <g class="windows" fill="${blue}">
      <rect x="40.5" y="38" width="5.0" height="4.5" rx="0.8" />
      <rect x="47.5" y="38" width="5.0" height="4.5" rx="0.8" />
      <rect x="40.5" y="44.2" width="5.0" height="4.5" rx="0.8" />
      <rect x="47.5" y="44.2" width="5.0" height="4.5" rx="0.8" />
    </g>

    <!-- Navy Arched Doorway & Left Foundation -->
    <g class="door-and-foundation" fill="${navy}">
      <path d="M 38 84 L 38 73 A 7 7 0 0 1 52 73 L 52 84 Z" />
      <rect x="20" y="78" width="14" height="6" rx="1" />
    </g>

    <!-- Simple Flowing "S" Path -->
    <path
      d="M 21 59 
         L 66 59 
         C 75.5 59 75.5 73.5 66 73.5 
         L 24 73.5"
      stroke="${blue}"
      stroke-width="6.8"
      stroke-linecap="round"
      stroke-linejoin="round"
      fill="none"
    />
  </g>

  <!-- ==================== RIGHT: BRAND TYPOGRAPHY ==================== -->
  <g class="brand-text" transform="translate(94, 0)">
    <!-- Main Logotype: SmartStay -->
    <text
      x="0"
      y="54"
      font-family="'Plus Jakarta Sans', 'Segoe UI', system-ui, -apple-system, sans-serif"
      font-weight="800"
      font-size="46"
      letter-spacing="-0.035em"
    >
      <tspan fill="${navy}">Smart</tspan><tspan fill="${blue}">Stay</tspan>
    </text>

    <!-- Tagline: "— Campus Living —" -->
    <g class="brand-tagline" transform="translate(0, 77)">
      <!-- Left line -->
      <line
        x1="2"
        y1="-5.5"
        x2="28"
        y2="-5.5"
        stroke="${taglineColor}"
        stroke-width="2.4"
        stroke-linecap="round"
      />

      <!-- Subtitle Text -->
      <text
        x="36"
        y="0"
        font-family="'Plus Jakarta Sans', 'Segoe UI', system-ui, -apple-system, sans-serif"
        font-weight="700"
        font-size="16"
        fill="${taglineColor}"
        letter-spacing="0.06em"
      >
        ${subtitle}
      </text>

      <!-- Right line -->
      <line
        x1="168"
        y1="-5.5"
        x2="194"
        y2="-5.5"
        stroke="${taglineColor}"
        stroke-width="2.4"
        stroke-linecap="round"
      />
    </g>
  </g>
</svg>`;
}

// Write SVG files
fs.writeFileSync('frontend/public/smartstay-mark.svg', getSimpleMarkSvg(false));
fs.writeFileSync('frontend/public/smartstay-logo.svg', getSimpleFullLogoSvg(false));
fs.writeFileSync('frontend/src/assets/smartstay-mark.svg', getSimpleMarkSvg(false));
fs.writeFileSync('frontend/src/assets/smartstay-logo.svg', getSimpleFullLogoSvg(false));

console.log('Successfully generated simple SVG files in public/ and src/assets/');
