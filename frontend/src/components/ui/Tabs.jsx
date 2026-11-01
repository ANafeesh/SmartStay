/**
 * Standardized Tabs Switcher Component for SmartStay
 * Supports underline, pills, and enclosed styles with optional icons and count badges.
 */
function Tabs({
  tabs = [],
  activeTab,
  onChange,
  variant = "underline",
  className = "",
}) {
  return (
    <div className={`w-full ${className}`}>
      <div
        role="tablist"
        className={`
          flex items-center gap-1 overflow-x-auto no-scrollbar
          ${variant === "underline" ? "border-b border-slate-200" : ""}
          ${variant === "pills" ? "bg-slate-100 p-1 rounded-xl" : ""}
          ${variant === "enclosed" ? "border-b border-slate-200 gap-2" : ""}
        `}
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;

          if (variant === "pills") {
            return (
              <button
                key={tab.id}
                role="tab"
                type="button"
                aria-selected={isActive}
                disabled={tab.disabled}
                onClick={() => !tab.disabled && onChange?.(tab.id)}
                className={`
                  inline-flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-semibold
                  transition duration-150 whitespace-nowrap
                  ${
                    isActive
                      ? "bg-white text-smart-primary shadow-xs"
                      : "text-smart-secondary hover:text-smart-primary"
                  }
                  ${tab.disabled ? "cursor-not-allowed opacity-50" : ""}
                `}
              >
                {Icon && <Icon size={15} />}
                <span>{tab.label}</span>
                {tab.badge !== undefined && (
                  <span
                    className={`
                      ml-1 rounded-full px-2 py-0.5 text-[10px] font-bold
                      ${isActive ? "bg-smart-blue/10 text-smart-blue" : "bg-slate-200 text-slate-600"}
                    `}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          }

          if (variant === "enclosed") {
            return (
              <button
                key={tab.id}
                role="tab"
                type="button"
                aria-selected={isActive}
                disabled={tab.disabled}
                onClick={() => !tab.disabled && onChange?.(tab.id)}
                className={`
                  inline-flex items-center gap-2 rounded-t-xl px-4 py-2 text-xs font-semibold
                  border-t border-x transition duration-150 whitespace-nowrap -mb-px
                  ${
                    isActive
                      ? "border-slate-200 bg-white text-smart-blue"
                      : "border-transparent bg-slate-50 text-smart-secondary hover:text-smart-primary"
                  }
                  ${tab.disabled ? "cursor-not-allowed opacity-50" : ""}
                `}
              >
                {Icon && <Icon size={15} />}
                <span>{tab.label}</span>
                {tab.badge !== undefined && (
                  <span
                    className={`
                      ml-1 rounded-full px-2 py-0.5 text-[10px] font-bold
                      ${isActive ? "bg-smart-blue/10 text-smart-blue" : "bg-slate-200 text-slate-600"}
                    `}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          }

          // Default: "underline" variant
          return (
            <button
              key={tab.id}
              role="tab"
              type="button"
              aria-selected={isActive}
              disabled={tab.disabled}
              onClick={() => !tab.disabled && onChange?.(tab.id)}
              className={`
                relative inline-flex items-center gap-2 px-4 py-3 text-xs font-semibold
                transition duration-150 whitespace-nowrap -mb-px
                ${
                  isActive
                    ? "text-smart-blue border-b-2 border-smart-blue font-bold"
                    : "text-smart-secondary hover:text-smart-primary border-b-2 border-transparent"
                }
                ${tab.disabled ? "cursor-not-allowed opacity-50" : ""}
              `}
            >
              {Icon && <Icon size={15} />}
              <span>{tab.label}</span>
              {tab.badge !== undefined && (
                <span
                  className={`
                    ml-1 rounded-full px-2 py-0.5 text-[10px] font-bold
                    ${isActive ? "bg-smart-blue/10 text-smart-blue" : "bg-slate-100 text-slate-600"}
                  `}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default Tabs;
