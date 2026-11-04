import React from "react";
import { Link } from "react-router-dom";
import logoMarkPng from "../../assets/smartstay-mark.png";
import fullLogoPng from "../../assets/smartstay-logo.png";

/**
 * SmartStay Brand Icon Mark (Vector SVG)
 * Minimalist SmartStay Identity matching the main design system:
 * - Peaked House Gable: Slate 900 (#0F172A / var(--color-smart-primary))
 * - Smart Tech Circuit Nodes: Sky Cyan (#0EA5E9 / var(--color-smart-accent))
 * - 4 Window Panes: Smart Blue (#2563EB / var(--color-smart-blue))
 * - Flowing "S" Path: Smart Blue (#2563EB / var(--color-smart-blue))
 * - Arched Doorway: Slate 900 (#0F172A)
 */
export function SmartStayMark({
  className = "h-8 w-8",
  isDark = false,
}) {
  const primary = isDark ? "#FFFFFF" : "#0F172A";
  const blue = "#2563EB";
  const cyan = "#0EA5E9";

  return (
    <svg
      viewBox="0 0 44 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Smart Circuit Traces & Terminal Nodes */}
      <g stroke={cyan} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M 26 18 L 26 9" />
        <circle cx="26" cy="7" r="2.0" fill={cyan} />

        <path d="M 30 21 L 32 5" />
        <circle cx="32" cy="4" r="2.2" fill={cyan} />

        <path d="M 34 24 L 37 11" />
        <circle cx="37" cy="9" r="2.0" fill={cyan} />
      </g>

      {/* Roof Gable */}
      <path
        d="M 6 24 L 22 10 L 38 24 L 35 26.8 L 22 15.2 L 9 26.8 Z"
        fill={primary}
      />

      {/* 4 Window Panes */}
      <g fill={blue}>
        <rect x="19.4" y="16.2" width="2.2" height="2.0" rx="0.4" />
        <rect x="22.4" y="16.2" width="2.2" height="2.0" rx="0.4" />
        <rect x="19.4" y="19.0" width="2.2" height="2.0" rx="0.4" />
        <rect x="22.4" y="19.0" width="2.2" height="2.0" rx="0.4" />
      </g>

      {/* Arched Doorway & Base */}
      <g fill={primary}>
        <path d="M 18 38 L 18 32 A 4 4 0 0 1 26 32 L 26 38 Z" />
        <rect x="9" y="35" width="7" height="3" rx="0.6" />
      </g>

      {/* Flowing "S" Path */}
      <path
        d="M 9.5 26.8 L 30.5 26.8 C 35.5 26.8 35.5 33.5 30.5 33.5 L 11 33.5"
        stroke={blue}
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

/**
 * SmartStay Brand Logo Component
 * High-definition, responsive vector logo with ultra-sharp typography,
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
  const isDark = theme === "dark";

  const sizeConfig = {
    xs: {
      markSize: "h-6 w-6",
      titleSize: "text-base",
      subtitleSize: "text-[8px] tracking-wider",
      badge: "text-[8px] px-1.5 py-0.2",
      gap: "gap-2",
      lineW: "w-2.5",
    },
    sm: {
      markSize: "h-8 w-8",
      titleSize: "text-lg",
      subtitleSize: "text-[9px] tracking-wider",
      badge: "text-[9px] px-1.5 py-0.2",
      gap: "gap-2.5",
      lineW: "w-3",
    },
    md: {
      markSize: "h-9 w-9 sm:h-10 sm:w-10",
      titleSize: "text-xl sm:text-2xl",
      subtitleSize: "text-[9px] sm:text-[10px] tracking-widest",
      badge: "text-[9px] sm:text-[10px] px-2 py-0.5",
      gap: "gap-3",
      lineW: "w-3 sm:w-3.5",
    },
    lg: {
      markSize: "h-11 w-11 sm:h-12 sm:w-12",
      titleSize: "text-2xl sm:text-3xl",
      subtitleSize: "text-xs tracking-widest",
      badge: "text-xs px-2.5 py-0.5",
      gap: "gap-3.5",
      lineW: "w-4 sm:w-5",
    },
    xl: {
      markSize: "h-14 w-14 sm:h-16 sm:w-16",
      titleSize: "text-3xl sm:text-4xl",
      subtitleSize: "text-sm tracking-widest",
      badge: "text-xs px-3 py-1",
      gap: "gap-4",
      lineW: "w-6",
    },
  };

  const currentSize = sizeConfig[size] || sizeConfig.md;

  // Mark-only layout
  if (variant === "mark") {
    const markEl = (
      <div
        className={`relative inline-flex items-center shrink-0 transition-transform duration-200 group-hover:scale-105 ${className}`}
      >
        <SmartStayMark
          isDark={isDark}
          className={`${currentSize.markSize} object-contain drop-shadow-[0_2px_8px_rgba(37,99,235,0.18)]`}
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
    <div className={`group inline-flex items-center ${currentSize.gap} select-none ${className}`}>
      {/* Brand Icon */}
      <div className="relative flex items-center shrink-0 transition-transform duration-200 group-hover:scale-105">
        <SmartStayMark
          isDark={isDark}
          className={`${currentSize.markSize} object-contain drop-shadow-[0_2px_8px_rgba(37,99,235,0.15)]`}
        />
      </div>

      {/* Typography: "SmartStay" + Subtitle */}
      <div className="flex flex-col justify-center min-w-0">
        <div className={`font-extrabold tracking-tight leading-none ${currentSize.titleSize}`}>
          <span className={isDark ? "text-white" : "text-slate-900"}>Smart</span>
          <span className="text-blue-600">Stay</span>
        </div>

        {subtitle && (
          <div
            className={`flex items-center gap-1.5 mt-1 font-bold uppercase ${currentSize.subtitleSize} ${
              isDark ? "text-slate-400" : "text-slate-500"
            }`}
          >
            <span
              className={`h-[1.5px] ${currentSize.lineW} ${
                isDark ? "bg-slate-700" : "bg-slate-300"
              } rounded-full`}
            />
            <span className="truncate">{subtitle}</span>
            <span
              className={`h-[1.5px] ${currentSize.lineW} ${
                isDark ? "bg-slate-700" : "bg-slate-300"
              } rounded-full`}
            />
          </div>
        )}
      </div>

      {/* Optional Badge */}
      {badge && (
        <span
          className={`rounded-full font-bold uppercase tracking-wider border ml-1 ${
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
