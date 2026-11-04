import { Link } from "react-router-dom";
import logoMark from "../../assets/smartstay-mark.png";
import fullLogo from "../../assets/smartstay-logo.png";

/**
 * SmartStay Brand Logo Component
 * Uses the official SmartStay identity:
 * House with circuit tech nodes, 4 windows, flowing blue S-ribbon, arched door,
 * and "SmartStay - Campus Living" typography.
 *
 * @param {'horizontal' | 'mark' | 'full'} variant - Display layout of the logo
 * @param {'xs' | 'sm' | 'md' | 'lg' | 'xl'} size - Dimension scale
 * @param {'light' | 'dark'} theme - Color scheme for background context
 * @param {string} badge - Optional badge tag (e.g. "v2.0", "PRO")
 * @param {boolean} asLink - Whether to wrap the logo in a react-router Link to '/'
 * @param {string} className - Additional custom class names
 */
export default function Logo({
  variant = "horizontal",
  size = "md",
  theme = "light",
  badge = null,
  asLink = false,
  className = "",
}) {
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

  if (variant === "mark") {
    const markEl = (
      <div
        className={`relative inline-flex items-center shrink-0 transition-transform duration-200 group-hover:scale-105 ${currentSize.markHeight} ${className}`}
      >
        <img
          src={logoMark}
          alt="SmartStay"
          className="h-full w-auto object-contain drop-shadow-[0_2px_8px_rgba(13,105,252,0.18)]"
          loading="eager"
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

  const content = (
    <div className={`group inline-flex items-center gap-2.5 ${className}`}>
      <div className={`relative flex items-center shrink-0 transition-transform duration-200 group-hover:scale-102 ${currentSize.fullHeight}`}>
        <img
          src={fullLogo}
          alt="SmartStay - Campus Living"
          className={`h-full w-auto object-contain ${
            isDark ? "brightness-125 contrast-110 drop-shadow-[0_2px_10px_rgba(255,255,255,0.15)]" : "drop-shadow-[0_2px_8px_rgba(13,105,252,0.12)]"
          }`}
          loading="eager"
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
