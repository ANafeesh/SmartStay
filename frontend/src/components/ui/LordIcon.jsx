import { useEffect, useRef } from "react";
import { defineElement } from "@lordicon/element";

// Ensure custom element is registered
if (typeof window !== "undefined") {
  try {
    defineElement();
  } catch {
    // Already defined
  }
}

/**
 * LordIcon component for animated Lordicon icons.
 *
 * @param {Object} props
 * @param {string} [props.src="/system-solid-1725-person-exit.json"] - Path or URL to Lordicon JSON
 * @param {string} [props.trigger="hover"] - Trigger type: "hover" | "click" | "loop" | "in"
 * @param {string} [props.state="hover-pinch"] - Animation state
 * @param {string} [props.colors="primary:#ef4444"] - Colors string format
 * @param {string|number} [props.size=24] - Size in pixels
 * @param {string} [props.target] - Ancestor selector to trigger on hover/click (e.g. "button")
 * @param {string} [props.className] - CSS class names
 * @param {Object} [props.style] - Inline style overrides
 */
export default function LordIcon({
  src = "/system-solid-1725-person-exit.json",
  trigger = "hover",
  state = "",
  colors = "primary:#2563eb",
  size = 24,
  target,
  className = "",
  style = {},
  ...rest
}) {
  const iconRef = useRef(null);

  // Fallback programmatic event attachment if target selector is provided
  useEffect(() => {
    const el = iconRef.current;
    if (!el) return;

    if (target) {
      el.setAttribute("target", target);
    }
  }, [target]);

  return (
    <lord-icon
      ref={iconRef}
      src={src}
      trigger={trigger}
      state={state || undefined}
      colors={colors}
      style={{
        width: typeof size === "number" ? `${size}px` : size,
        height: typeof size === "number" ? `${size}px` : size,
        display: "inline-block",
        verticalAlign: "middle",
        lineHeight: 0,
        ...style,
      }}
      class={className}
      {...rest}
    />
  );
}
