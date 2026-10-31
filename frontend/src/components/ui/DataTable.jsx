import { useState, useMemo } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsUpDown,
  ArrowUp,
  ArrowDown,
  Search,
} from "lucide-react";
import LoadingState from "./LoadingState";
import EmptyState from "./EmptyState";

/**
 * Standardized Data Table Component for SmartStay
 * Features: client-side sorting, pagination, search filtering, custom column rendering,
 * loading and empty state integration, and responsive horizontal scrolling.
 */
function DataTable({
  columns = [],
  data = [],
  keyField = "_id",
  isLoading = false,
  title = null,
  subtitle = null,
  actions = null,
  showSearch = false,
  searchPlaceholder = "Search records...",
  emptyTitle = "No records found",
  emptyMessage = "There are no entries matching your current view or criteria.",
  emptyAction = null,
  pagination = true,
  pageSize = 10,
  onRowClick = null,
  className = "",
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const [currentPage, setCurrentPage] = useState(1);

  // Filter data by search query
  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) return data;
    const query = searchQuery.toLowerCase().trim();

    return data.filter((row) =>
      columns.some((col) => {
        const val = row[col.key];
        if (val === null || val === undefined) return false;
        return String(val).toLowerCase().includes(query);
      })
    );
  }, [data, columns, searchQuery]);

  // Sort filtered data
  const sortedData = useMemo(() => {
    if (!sortConfig.key || !sortConfig.direction) return filteredData;

    return [...filteredData].sort((a, b) => {
      let aVal = a[sortConfig.key];
      let bVal = b[sortConfig.key];

      if (aVal === null || aVal === undefined) return 1;
      if (bVal === null || bVal === undefined) return -1;

      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortConfig.direction === "asc" ? aVal - bVal : bVal - aVal;
      }

      aVal = String(aVal).toLowerCase();
      bVal = String(bVal).toLowerCase();

      if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortConfig]);

  // Handle pagination calculations
  const totalPages = Math.ceil(sortedData.length / pageSize) || 1;
  const safeCurrentPage = Math.min(Math.max(currentPage, 1), totalPages);

  const paginatedData = useMemo(() => {
    if (!pagination) return sortedData;
    const startIndex = (safeCurrentPage - 1) * pageSize;
    return sortedData.slice(startIndex, startIndex + pageSize);
  }, [sortedData, pagination, safeCurrentPage, pageSize]);

  // Sort handler
  const handleSort = (key) => {
    setSortConfig((prev) => {
      if (prev.key !== key) return { key, direction: "asc" };
      if (prev.direction === "asc") return { key, direction: "desc" };
      return { key: null, direction: null };
    });
  };

  const getRowKey = (row, index) => {
    return row[keyField] || row.id || row._id || index;
  };

  return (
    <div className={`overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs ${className}`}>
      {/* Top Header / Action Toolbar */}
      {(title || showSearch || actions) && (
        <div className="flex flex-col gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            {title && (
              <h3 className="text-base font-bold text-smart-primary">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="mt-0.5 text-xs text-smart-secondary">
                {subtitle}
              </p>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {showSearch && (
              <div className="relative min-w-[220px]">
                <Search
                  size={16}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder={searchPlaceholder}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2 pl-9 pr-3 text-xs text-smart-primary placeholder:text-slate-400 focus:border-smart-blue focus:bg-white focus:outline-none focus:ring-2 focus:ring-smart-blue/20 transition"
                />
              </div>
            )}
            {actions}
          </div>
        </div>
      )}

      {/* Main Table Content */}
      <div className="relative overflow-x-auto">
        {isLoading ? (
          <LoadingState minHeight="min-h-[280px]" />
        ) : sortedData.length === 0 ? (
          <div className="p-8">
            <EmptyState
              title={emptyTitle}
              description={emptyMessage}
              action={emptyAction}
            />
          </div>
        ) : (
          <table className="w-full text-left text-xs">
            {/* Table Header */}
            <thead className="border-b border-slate-100 bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              <tr>
                {columns.map((col) => {
                  const isSorted = sortConfig.key === col.key;
                  const alignClass =
                    col.align === "right"
                      ? "text-right"
                      : col.align === "center"
                      ? "text-center"
                      : "text-left";

                  return (
                    <th
                      key={col.key || col.header}
                      scope="col"
                      onClick={() => col.sortable && handleSort(col.key)}
                      className={`
                        px-4 py-3.5 transition-colors
                        ${col.sortable ? "cursor-pointer select-none hover:bg-slate-100/70" : ""}
                        ${alignClass}
                        ${col.className || ""}
                      `}
                    >
                      <div
                        className={`inline-flex items-center gap-1.5 ${
                          col.align === "right" ? "justify-end" : col.align === "center" ? "justify-center" : ""
                        }`}
                      >
                        <span>{col.header || col.label}</span>
                        {col.sortable && (
                          <span className="text-slate-400">
                            {isSorted && sortConfig.direction === "asc" ? (
                              <ArrowUp size={13} className="text-smart-blue" />
                            ) : isSorted && sortConfig.direction === "desc" ? (
                              <ArrowDown size={13} className="text-smart-blue" />
                            ) : (
                              <ChevronsUpDown size={13} />
                            )}
                          </span>
                        )}
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {paginatedData.map((row, index) => {
                const rowKey = getRowKey(row, index);
                return (
                  <tr
                    key={rowKey}
                    onClick={() => onRowClick?.(row)}
                    className={`
                      transition-colors
                      ${onRowClick ? "cursor-pointer hover:bg-slate-50/80" : "hover:bg-slate-50/40"}
                    `}
                  >
                    {columns.map((col) => {
                      const alignClass =
                        col.align === "right"
                          ? "text-right"
                          : col.align === "center"
                          ? "text-center"
                          : "text-left";

                      return (
                        <td
                          key={`${rowKey}-${col.key}`}
                          className={`px-4 py-3.5 ${alignClass} ${col.cellClassName || ""}`}
                        >
                          {col.render ? col.render(row, index) : row[col.key]}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination Footer */}
      {pagination && !isLoading && sortedData.length > 0 && (
        <div className="flex flex-col items-center justify-between gap-3 border-t border-slate-100 bg-slate-50/40 px-4 py-3 text-xs text-smart-secondary sm:flex-row">
          <div>
            Showing{" "}
            <span className="font-semibold text-smart-primary">
              {(safeCurrentPage - 1) * pageSize + 1}
            </span>{" "}
            to{" "}
            <span className="font-semibold text-smart-primary">
              {Math.min(safeCurrentPage * pageSize, sortedData.length)}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-smart-primary">
              {sortedData.length}
            </span>{" "}
            entries
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={safeCurrentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              aria-label="Previous page"
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft size={15} />
            </button>

            <span className="px-2 text-xs font-semibold text-smart-primary">
              Page {safeCurrentPage} of {totalPages}
            </span>

            <button
              type="button"
              disabled={safeCurrentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              aria-label="Next page"
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronRight size={15} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default DataTable;
