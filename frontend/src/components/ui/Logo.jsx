import { Link } from "react-router-dom";
import logoMark from "../../assets/smartstay-mark.png";

/**
 * SmartStay Brand Vector Mark
 * House roof gable, 4 window panes, and dynamic cyan foundation swoop wave.
 */
export function SmartStayMarkSvg({ className = "h-full w-full", isDark = false }) {
  const mainColor = isDark ? "#ffffff" : "#0B2341";
  return (
    <svg
      viewBox="0 0 70 70"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Roof Gable */}
      <path
        d="M14 33L35 13.5L56 33"
        stroke={mainColor}
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* House Walls */}
      <path
        d="M19 30.5V45"
        stroke={mainColor}
        strokeWidth="4.4"
        strokeLinecap="round"
      />
      <path
        d="M51 30.5V45"
        stroke={mainColor}
        strokeWidth="4.4"
        strokeLinecap="round"
      />
      {/* 4 Window Panes (2x2 grid) */}
      <rect x="26.4" y="24.5" width="6.2" height="6.2" rx="1.2" fill={mainColor} />
      <rect x="35" y="24.5" width="6.2" height="6.2" rx="1.2" fill={mainColor} />
      <rect x="26.4" y="33.1" width="6.2" height="6.2" rx="1.2" fill={mainColor} />
      <rect x="35" y="33.1" width="6.2" height="6.2" rx="1.2" fill={mainColor} />
      {/* Cyan Swoop Wave */}
      <path
        d="M12 54C24 48 37 45.5 58 50.5C46 53 26 55 12 54Z"
        fill="#00BAE8"
      />
    </svg>
  );
}

/**
 * SmartStay Branding Logo Component
 * Matches the official SmartStay Campus Living identity.
 *
 * @param {'horizontal' | 'mark' | 'full'} variant - Display layout of the logo
 * @param {'xs' | 'sm' | 'md' | 'lg' | 'xl'} size - Dimension scale
 * @param {'light' | 'dark'} theme - Color scheme for background context
 * @param {string} badge - Optional badge tag (e.g. "v2.0", "PRO")
 * @param {string} subtitle - Optional tagline beneath brand name (defaults to "Campus Living")
 * @param {boolean} asLink - Whether to wrap the logo in a react-router Link to '/'
 * @param {string} className - Additional custom class names
 */
export default function Logo({
  variant = "horizontal",
  size = "md",
  theme = "light",
  badge = null,
  subtitle = "Campus Living",
  asLink = false,
  className = "",
}) {
  const sizeConfig = {
    xs: {
      mark: "h-7 w-7",
      text: "text-sm",
      sub: "text-[9px]",
      badge: "text-[8px] px-1.5 py-0.2",
      gap: "gap-2",
    },
    sm: {
      mark: "h-8 w-8",
      text: "text-base",
      sub: "text-[10px]",
      badge: "text-[9px] px-1.5 py-0.2",
      gap: "gap-2.5",
    },
    md: {
      mark: "h-9 w-9 sm:h-10 sm:w-10",
      text: "text-xl",
      sub: "text-[11px]",
      badge: "text-[9px] sm:text-[10px] px-2 py-0.5",
      gap: "gap-2.5",
    },
    lg: {
      mark: "h-11 w-11 sm:h-12 sm:w-12",
      text: "text-2xl",
      sub: "text-xs",
      badge: "text-xs px-2.5 py-0.5",
      gap: "gap-3",
    },
    xl: {
      mark: "h-14 w-14 sm:h-16 sm:w-16",
      text: "text-2xl sm:text-3xl",
      sub: "text-xs sm:text-sm",
      badge: "text-xs px-3 py-1",
      gap: "gap-3.5",
    },
  };

  const currentSize = sizeConfig[size] || sizeConfig.md;
  const isDark = theme === "dark";

  const markElement = (
    <div
      className={`relative flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-105 ${currentSize.mark}`}
    >
      <SmartStayMarkSvg isDark={isDark} />
    </div>
  );

  if (variant === "mark") {
    if (asLink) {
      return (
        <Link
          to="/"
          className={`group inline-flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-xl ${className}`}
          aria-label="SmartStay Home"
        >
          {markElement}
        </Link>
      );
    }
    return <div className={`group inline-flex items-center ${className}`}>{markElement}</div>;
  }

  const content = (
    <div className={`group inline-flex items-center ${currentSize.gap} ${className}`}>
      {markElement}
      <div className="min-w-0">
        <div className="flex items-center gap-1.5">
          <span
            className={`font-black tracking-tight leading-none ${currentSize.text} ${
              isDark ? "text-white" : "text-[#0B2341]"
            }`}
          >
            Smart<span className={isDark ? "text-sky-400 font-bold" : "text-[#1D68BD]"}>Stay</span>
          </span>
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
        {subtitle && (
          <p
            className={`font-medium truncate mt-0.5 leading-tight ${currentSize.sub} ${
              isDark ? "text-slate-300" : "text-slate-500"
            }`}
          >
            {subtitle}
          </p>
        )}
      </div>
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
