import { Fragment } from "react";
import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

/**
 * Standardized Page Header Component for SmartStay
 * Features: title, subtitle, optional badge, breadcrumb navigation, and action buttons.
 */
function PageHeader({
  title,
  subtitle,
  breadcrumbs = [],
  badge = null,
  actions = null,
  className = "",
}) {
  return (
    <div className={`mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between ${className}`}>
      {/* Title & Info Section */}
      <div className="min-w-0 flex-1">
        {/* Breadcrumb Navigation */}
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav aria-label="Breadcrumb" className="mb-2 flex items-center gap-1.5 text-xs text-smart-secondary">
            {breadcrumbs.map((crumb, idx) => {
              const isLast = idx === breadcrumbs.length - 1;
              return (
                <Fragment key={crumb.label || idx}>
                  {idx > 0 && <ChevronRight size={12} className="text-slate-400" />}
                  {crumb.href && !isLast ? (
                    <Link
                      to={crumb.href}
                      className="transition-colors hover:text-smart-blue font-medium"
                    >
                      {crumb.label}
                    </Link>
                  ) : crumb.onClick && !isLast ? (
                    <button
                      type="button"
                      onClick={crumb.onClick}
                      className="transition-colors hover:text-smart-blue font-medium"
                    >
                      {crumb.label}
                    </button>
                  ) : (
                    <span className={isLast ? "text-smart-primary font-semibold" : ""}>
                      {crumb.label}
                    </span>
                  )}
                </Fragment>
              );
            })}
          </nav>
        )}

        {/* Heading & Badge */}
        <div className="flex flex-wrap items-center gap-2.5">
          <h1 className="text-2xl font-bold tracking-tight text-smart-primary sm:text-3xl">
            {title}
          </h1>
          {badge && <div className="inline-flex items-center">{badge}</div>}
        </div>

        {/* Subtitle / Description */}
        {subtitle && (
          <p className="mt-1 text-sm text-smart-secondary max-w-3xl">
            {subtitle}
          </p>
        )}
      </div>

      {/* Action Buttons Section */}
      {actions && (
        <div className="flex flex-wrap items-center gap-2.5 sm:self-center">
          {actions}
        </div>
      )}
    </div>
  );
}

export default PageHeader;
