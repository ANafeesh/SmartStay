import React, { useId } from "react";
import { Link } from "react-router-dom";
import logoMarkPng from "../../assets/smartstay-mark.png";
import fullLogoPng from "../../assets/smartstay-logo.png";

/**
 * SmartStay Simple Vector Icon Mark
 * Minimalist, high-definition SVG of the SmartStay symbol:
 * - Peaked House Gable in Corporate Deep Navy (#021F43)
 * - 3 Smart Circuit Lines with open terminal loops in Cyan (#00B4D8)
 * - 4 Window Panes in Vibrant Electric Blue (#0062FF)
 * - Simple Smooth Flowing "S" Path with rounded ends (#0062FF)
 * - Navy Arched Doorway and Foundation Block (#021F43)
 */
export function SmartStayMark({
  className = "h-full w-auto",
  isDark = false,
  idPrefix = "ss-mark",
}) {
  const navy = isDark ? "#FFFFFF" : "#021F43";
  const blue = "#0062FF";
  const cyan = "#00B4D8";

  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Circuit Traces & Terminal Rings */}
      <g
        stroke={cyan}
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M 58 39 L 55 24" />
        <circle cx="55" cy="21" r="2.8" stroke={cyan} strokeWidth="2.0" fill="none" />

        <path d="M 64 44 L 66 16" />
        <circle cx="66" cy="13" r="3.0" stroke={cyan} strokeWidth="2.2" fill="none" />

        <path d="M 70 50 L 78 28" />
        <circle cx="78" cy="25" r="2.8" stroke={cyan} strokeWidth="2.0" fill="none" />
      </g>

      {/* Roof Gable (Deep Navy) */}
      <path
        d="M 16 54 L 46 25 L 76 54 L 69.5 59.5 L 46 36.5 L 22.5 59.5 Z"
        fill={navy}
      />

      {/* 4 Window Panes (2x2 Grid) */}
      <g fill={blue}>
        <rect x="40.5" y="38" width="5.0" height="4.5" rx="0.8" />
        <rect x="47.5" y="38" width="5.0" height="4.5" rx="0.8" />
        <rect x="40.5" y="44.2" width="5.0" height="4.5" rx="0.8" />
        <rect x="47.5" y="44.2" width="5.0" height="4.5" rx="0.8" />
      </g>

      {/* Navy Arched Doorway & Left Foundation */}
      <g fill={navy}>
        <path d="M 38 84 L 38 73 A 7 7 0 0 1 52 73 L 52 84 Z" />
        <rect x="20" y="78" width="14" height="6" rx="1" />
      </g>

      {/* Simple Flowing "S" Path */}
      <path
        d="M 21 59 L 66 59 C 75.5 59 75.5 73.5 66 73.5 L 24 73.5"
        stroke={blue}
        strokeWidth="6.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

/**
 * SmartStay Simple Full Horizontal Logo
 * High-definition SVG with Icon Mark + "SmartStay" + "— Campus Living —"
 */
export function SmartStayFullLogo({
  className = "h-full w-auto",
  isDark = false,
  subtitle = "Campus Living",
  idPrefix = "ss-full",
}) {
  const navy = isDark ? "#FFFFFF" : "#021F43";
  const blue = "#0062FF";
  const cyan = "#00B4D8";
  const taglineColor = isDark ? "#E2E8F0" : "#021F43";

  return (
    <svg
      viewBox="0 0 350 96"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="SmartStay - Campus Living"
      role="img"
    >
      {/* ==================== LEFT: ICON MARK ==================== */}
      <g className="brand-mark" transform="translate(0, -2)">
        {/* Circuit Traces & Terminal Rings */}
        <g
          stroke={cyan}
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M 58 39 L 55 24" />
          <circle cx="55" cy="21" r="2.8" stroke={cyan} strokeWidth="2.0" fill="none" />

          <path d="M 64 44 L 66 16" />
          <circle cx="66" cy="13" r="3.0" stroke={cyan} strokeWidth="2.2" fill="none" />

          <path d="M 70 50 L 78 28" />
          <circle cx="78" cy="25" r="2.8" stroke={cyan} strokeWidth="2.0" fill="none" />
        </g>

        {/* Roof Gable */}
        <path
          d="M 16 54 L 46 25 L 76 54 L 69.5 59.5 L 46 36.5 L 22.5 59.5 Z"
          fill={navy}
        />

        {/* 4 Windows */}
        <g fill={blue}>
          <rect x="40.5" y="38" width="5.0" height="4.5" rx="0.8" />
          <rect x="47.5" y="38" width="5.0" height="4.5" rx="0.8" />
          <rect x="40.5" y="44.2" width="5.0" height="4.5" rx="0.8" />
          <rect x="47.5" y="44.2" width="5.0" height="4.5" rx="0.8" />
        </g>

        {/* Navy Arched Doorway & Left Foundation */}
        <g fill={navy}>
          <path d="M 38 84 L 38 73 A 7 7 0 0 1 52 73 L 52 84 Z" />
          <rect x="20" y="78" width="14" height="6" rx="1" />
        </g>

        {/* Simple Flowing "S" Path */}
        <path
          d="M 21 59 L 66 59 C 75.5 59 75.5 73.5 66 73.5 L 24 73.5"
          stroke={blue}
          strokeWidth="6.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </g>

      {/* ==================== RIGHT: BRAND TYPOGRAPHY ==================== */}
      <g className="brand-text" transform="translate(94, 0)">
        {/* Main Logotype: SmartStay */}
        <text
          x="0"
          y="54"
          fontFamily="'Plus Jakarta Sans', 'Segoe UI', system-ui, -apple-system, sans-serif"
          fontWeight="800"
          fontSize="46"
          letterSpacing="-0.035em"
        >
          <tspan fill={navy}>Smart</tspan>
          <tspan fill={blue}>Stay</tspan>
        </text>

        {/* Tagline: "— Campus Living —" */}
        <g className="brand-tagline" transform="translate(0, 77)">
          {/* Left line */}
          <line
            x1="2"
            y1="-5.5"
            x2="28"
            y2="-5.5"
            stroke={taglineColor}
            strokeWidth="2.4"
            strokeLinecap="round"
          />

          {/* Subtitle Text */}
          <text
            x="36"
            y="0"
            fontFamily="'Plus Jakarta Sans', 'Segoe UI', system-ui, -apple-system, sans-serif"
            fontWeight="700"
            fontSize="16"
            fill={taglineColor}
            letterSpacing="0.06em"
          >
            {subtitle}
          </text>

          {/* Right line */}
          <line
            x1="168"
            y1="-5.5"
            x2="194"
            y2="-5.5"
            stroke={taglineColor}
            strokeWidth="2.4"
            strokeLinecap="round"
          />
        </g>
      </g>
    </svg>
  );
}

/**
 * SmartStay Brand Logo Component
 * High-definition, responsive vector logo with ultra-sharp scaling,
 * dark theme adaptability, badge tagging, and route linking.
 *
 * @param {'horizontal' | 'mark' | 'full'} variant - Display layout of the logo
 * @param {'xs' | 'sm' | 'md' | 'lg' | 'xl'} size - Dimension scale
 * @param {'light' | 'dark'} theme - Color scheme for background context
 * @param {string} badge - Optional badge tag (e.g. "v2.0", "PRO")
 * @param {boolean} asLink - Whether to wrap the logo in a react-router Link to '/'
 * @param {string} subtitle - Tagline below SmartStay (defaults to "Campus Living")
 * @param {string} className - Additional custom class names
 */
export default function Logo({
  variant = "horizontal",
  size = "md",
  theme = "light",
  badge = null,
  asLink = false,
  subtitle = "Campus Living",
  className = "",
}) {
  const reactId = useId();
  const idPrefix = `ss-${reactId.replace(/[^a-zA-Z0-9_-]/g, "")}`;

  const sizeConfig = {
    xs: {
      markHeight: "h-7",
      fullHeight: "h-7",
      badge: "text-[8px] px-1.5 py-0.2",
    },
    sm: {
      markHeight: "h-8",
      fullHeight: "h-8",
      badge: "text-[9px] px-1.5 py-0.2",
    },
    md: {
      markHeight: "h-9 sm:h-10",
      fullHeight: "h-9 sm:h-10",
      badge: "text-[9px] sm:text-[10px] px-2 py-0.5",
    },
    lg: {
      markHeight: "h-11 sm:h-12",
      fullHeight: "h-11 sm:h-12",
      badge: "text-xs px-2.5 py-0.5",
    },
    xl: {
      markHeight: "h-14 sm:h-16",
      fullHeight: "h-14 sm:h-16",
      badge: "text-xs px-3 py-1",
    },
  };

  const currentSize = sizeConfig[size] || sizeConfig.md;
  const isDark = theme === "dark";

  // Mark-only layout
  if (variant === "mark") {
    const markEl = (
      <div
        className={`relative inline-flex items-center shrink-0 transition-transform duration-200 group-hover:scale-105 ${currentSize.markHeight} ${className}`}
      >
        <SmartStayMark
          isDark={isDark}
          idPrefix={idPrefix}
          className="h-full w-auto object-contain drop-shadow-[0_2px_8px_rgba(0,98,255,0.18)]"
        />
      </div>
    );

    if (asLink) {
      return (
        <Link
          to="/"
          className="group inline-flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-xl"
          aria-label="SmartStay Home"
        >
          {markEl}
        </Link>
      );
    }
    return markEl;
  }

  // Full Horizontal layout
  const content = (
    <div className={`group inline-flex items-center gap-2.5 ${className}`}>
      <div
        className={`relative flex items-center shrink-0 transition-transform duration-200 group-hover:scale-102 ${currentSize.fullHeight}`}
      >
        <SmartStayFullLogo
          isDark={isDark}
          subtitle={subtitle}
          idPrefix={idPrefix}
          className={`h-full w-auto object-contain ${
            isDark
              ? "drop-shadow-[0_2px_10px_rgba(255,255,255,0.12)]"
              : "drop-shadow-[0_2px_8px_rgba(0,98,255,0.10)]"
          }`}
        />
      </div>

      {badge && (
        <span
          className={`rounded-full font-bold uppercase tracking-wider border ${
            isDark
              ? "bg-blue-950/80 border-blue-700/60 text-blue-300"
              : "bg-blue-50 border-blue-200 text-blue-700"
          } ${currentSize.badge}`}
        >
          {badge}
        </span>
      )}
    </div>
  );

  if (asLink) {
    return (
      <Link
        to="/"
        className="inline-block focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-xl"
        aria-label="SmartStay Home"
      >
        {content}
      </Link>
    );
  }

  return content;
}

export { logoMarkPng, fullLogoPng };
