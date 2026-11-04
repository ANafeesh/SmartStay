import React, { useId } from "react";
import { Link } from "react-router-dom";
import logoMarkPng from "../../assets/smartstay-mark.png";
import fullLogoPng from "../../assets/smartstay-logo.png";

/**
 * SmartStay Vector Icon Mark
 * High-definition SVG of the SmartStay symbol:
 * - Peaked House Gable in Navy (#021F43)
 * - Smart Circuit Nodes & IoT Traces in Luminous Cyan (#00A3E0)
 * - 4 Window Panes in Vibrant Electric Blue (#0064F2)
 * - Flowing Stylized "S" Ribbon in Electric Blue (#0064F2)
 * - House Base with Arched Entryway
 */
export function SmartStayMark({
  className = "h-full w-auto",
  isDark = false,
  idPrefix = "ss-mark",
}) {
  const navy = isDark ? "#FFFFFF" : "#021F43";
  const blue = "#0064F2";
  const cyan = "#00A3E0";

  return (
    <svg
      viewBox="0 0 92 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient
          id={`${idPrefix}-blue`}
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop offset="0%" stopColor="#0066FF" />
          <stop offset="100%" stopColor="#0052EA" />
        </linearGradient>
        <linearGradient
          id={`${idPrefix}-cyan`}
          x1="0%"
          y1="100%"
          x2="100%"
          y2="0%"
        >
          <stop offset="0%" stopColor="#0284C7" />
          <stop offset="100%" stopColor="#00C2E8" />
        </linearGradient>
      </defs>

      {/* Smart Circuit Traces */}
      <g
        stroke={`url(#${idPrefix}-cyan)`}
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M 54 34 L 54 24 Q 54 18 50 17 L 48 16" />
        <path d="M 61 39 L 61 24 Q 61 15 65 11 L 66 10" />
        <path d="M 68 45 L 72 35 Q 75 27 79 22 L 80 21" />
      </g>

      {/* Circuit Terminal Nodes */}
      <circle cx="48" cy="16" r="3.2" fill={cyan} />
      <circle cx="48" cy="16" r="1.3" fill="#FFFFFF" />

      <circle cx="66" cy="10" r="3.6" fill={cyan} />
      <circle cx="66" cy="10" r="1.5" fill="#FFFFFF" />

      <circle cx="80" cy="21" r="3.2" fill={cyan} />
      <circle cx="80" cy="21" r="1.3" fill="#FFFFFF" />

      {/* Peaked Roof Gable */}
      <path
        d="M 6 50 L 38 18 L 70 50 L 63.5 55.5 L 38 30 L 12.5 55.5 Z"
        fill={navy}
      />

      {/* 4 Window Panes (2x2 Grid) */}
      <g fill={`url(#${idPrefix}-blue)`}>
        <rect x="32" y="35" width="5.2" height="4.6" rx="0.9" />
        <rect x="38.8" y="35" width="5.2" height="4.6" rx="0.9" />
        <rect x="32" y="41.2" width="5.2" height="4.6" rx="0.9" />
        <rect x="38.8" y="41.2" width="5.2" height="4.6" rx="0.9" />
      </g>

      {/* Flowing Stylized "S" Ribbon */}
      <path
        d="M 14.5 52 
           C 10.5 58 11 66 19.5 68.5 
           C 27 70.5 38 66.5 54 66.5 
           C 67 66.5 74.5 70.5 74.5 76.5 
           C 74.5 82.5 68 86.5 58 86.5 
           C 43 86.5 31 84 21 81 
           C 17.5 80 15 82.5 15 85 
           C 15 87.5 17.5 89.5 22 91 
           C 33 94.5 47 95.5 60 94.5 
           C 73 93.5 82.5 87 82.5 75.5 
           C 82.5 64 71 59 56 59 
           C 40 59 28 62 22 60 
           C 18 59 17 56 19 52.5 Z"
        fill={`url(#${idPrefix}-blue)`}
      />

      {/* House Base with Arched Entryway */}
      <path
        d="M 15 88.5 
           L 15 98.5 
           L 30.5 98.5 
           L 30.5 85.5 
           C 30.5 77.5 46.5 77.5 46.5 85.5 
           L 46.5 98.5 
           L 66.5 98.5 
           L 66.5 93.5 
           C 62.5 95.5 55 96.5 49 96.5 
           C 37 96.5 25 93.5 15 88.5 Z"
        fill={navy}
      />
    </svg>
  );
}

/**
 * SmartStay Vector Full Horizontal Logo
 * High-definition SVG with Icon Mark + "SmartStay" + "— Campus Living —"
 */
export function SmartStayFullLogo({
  className = "h-full w-auto",
  isDark = false,
  subtitle = "Campus Living",
  idPrefix = "ss-full",
}) {
  const navy = isDark ? "#FFFFFF" : "#021F43";
  const blue = "#0064F2";
  const cyan = "#00A3E0";
  const taglineColor = isDark ? "#E2E8F0" : "#021F43";

  return (
    <svg
      viewBox="0 0 350 94"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="SmartStay - Campus Living"
      role="img"
    >
      <defs>
        <linearGradient
          id={`${idPrefix}-blue`}
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop offset="0%" stopColor="#0066FF" />
          <stop offset="100%" stopColor="#0052EA" />
        </linearGradient>
        <linearGradient
          id={`${idPrefix}-cyan`}
          x1="0%"
          y1="100%"
          x2="100%"
          y2="0%"
        >
          <stop offset="0%" stopColor="#0284C7" />
          <stop offset="100%" stopColor="#00C2E8" />
        </linearGradient>
      </defs>

      {/* ==================== ICON MARK ==================== */}
      <g className="brand-mark" transform="translate(2, -4)">
        {/* Smart Circuit Traces */}
        <g
          stroke={`url(#${idPrefix}-cyan)`}
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M 54 34 L 54 24 Q 54 18 50 17 L 48 16" />
          <path d="M 61 39 L 61 24 Q 61 15 65 11 L 66 10" />
          <path d="M 68 45 L 72 35 Q 75 27 79 22 L 80 21" />
        </g>

        {/* Circuit Terminal Nodes */}
        <circle cx="48" cy="16" r="3.2" fill={cyan} />
        <circle cx="48" cy="16" r="1.3" fill="#FFFFFF" />

        <circle cx="66" cy="10" r="3.6" fill={cyan} />
        <circle cx="66" cy="10" r="1.5" fill="#FFFFFF" />

        <circle cx="80" cy="21" r="3.2" fill={cyan} />
        <circle cx="80" cy="21" r="1.3" fill="#FFFFFF" />

        {/* Peaked Roof Gable */}
        <path
          d="M 6 50 L 38 18 L 70 50 L 63.5 55.5 L 38 30 L 12.5 55.5 Z"
          fill={navy}
        />

        {/* 4 Windows */}
        <g fill={`url(#${idPrefix}-blue)`}>
          <rect x="32" y="35" width="5.2" height="4.6" rx="0.9" />
          <rect x="38.8" y="35" width="5.2" height="4.6" rx="0.9" />
          <rect x="32" y="41.2" width="5.2" height="4.6" rx="0.9" />
          <rect x="38.8" y="41.2" width="5.2" height="4.6" rx="0.9" />
        </g>

        {/* Flowing Stylized "S" Ribbon */}
        <path
          d="M 14.5 52 
             C 10.5 58 11 66 19.5 68.5 
             C 27 70.5 38 66.5 54 66.5 
             C 67 66.5 74.5 70.5 74.5 76.5 
             C 74.5 82.5 68 86.5 58 86.5 
             C 43 86.5 31 84 21 81 
             C 17.5 80 15 82.5 15 85 
             C 15 87.5 17.5 89.5 22 91 
             C 33 94.5 47 95.5 60 94.5 
             C 73 93.5 82.5 87 82.5 75.5 
             C 82.5 64 71 59 56 59 
             C 40 59 28 62 22 60 
             C 18 59 17 56 19 52.5 Z"
          fill={`url(#${idPrefix}-blue)`}
        />

        {/* House Base with Arched Entryway */}
        <path
          d="M 15 88.5 
             L 15 98.5 
             L 30.5 98.5 
             L 30.5 85.5 
             C 30.5 77.5 46.5 77.5 46.5 85.5 
             L 46.5 98.5 
             L 66.5 98.5 
             L 66.5 93.5 
             C 62.5 95.5 55 96.5 49 96.5 
             C 37 96.5 25 93.5 15 88.5 Z"
          fill={navy}
        />
      </g>

      {/* ==================== BRAND TYPOGRAPHY ==================== */}
      <g className="brand-text" transform="translate(94, 0)">
        {/* Main Logotype: SmartStay */}
        <text
          x="0"
          y="55"
          fontFamily="'Plus Jakarta Sans', 'Segoe UI', system-ui, -apple-system, sans-serif"
          fontWeight="800"
          fontSize="46"
          letterSpacing="-0.035em"
        >
          <tspan fill={navy}>Smart</tspan>
          <tspan fill={`url(#${idPrefix}-blue)`}>Stay</tspan>
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
            strokeWidth="2.2"
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
            strokeWidth="2.2"
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
          className="h-full w-auto object-contain drop-shadow-[0_2px_8px_rgba(0,100,242,0.18)]"
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
              : "drop-shadow-[0_2px_8px_rgba(0,100,242,0.10)]"
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
