import { useMemo, useState } from "react";
import {
  Search,
  Download,
  FileText,
  Filter,
  RotateCcw,
  ClipboardList,
  Clock3,
  CircleCheck,
  CreditCard,
  X,
} from "lucide-react";

import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import { reportsData } from "../../data/reportsData";

function Reports() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [status, setStatus] = useState("All");

  // --------------------------------------------------
  // FILTER REPORTS
  // --------------------------------------------------
  const filteredReports = useMemo(() => {
    const searchText = search.trim().toLowerCase();

    return reportsData.filter((report) => {
      const matchesSearch =
        !searchText ||
        report.id.toLowerCase().includes(searchText) ||
        report.student.toLowerCase().includes(searchText) ||
        report.room.toLowerCase().includes(searchText) ||
        report.category.toLowerCase().includes(searchText) ||
        report.status.toLowerCase().includes(searchText);

      const matchesCategory =
        category === "All" || report.category === category;

      const matchesStatus =
        status === "All" || report.status === status;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [search, category, status]);

  // --------------------------------------------------
  // SUMMARY VALUES
  // --------------------------------------------------
  const totalReports = filteredReports.length;

  const pendingReports = filteredReports.filter(
    (report) => report.status === "Pending"
  ).length;

  const completedReports = filteredReports.filter(
    (report) =>
      report.status === "Completed" ||
      report.status === "Paid" ||
      report.status === "Resolved"
  ).length;

  const totalPayments = filteredReports
    .filter((report) => report.category === "Payment")
    .reduce((sum, report) => sum + Number(report.amount || 0), 0);

  // --------------------------------------------------
  // RESET FILTERS
  // --------------------------------------------------
  function resetFilters() {
    setSearch("");
    setCategory("All");
    setStatus("All");
  }

  const hasActiveFilters =
    search.trim() !== "" || category !== "All" || status !== "All";

  // --------------------------------------------------
  // EXPORT CSV
  // --------------------------------------------------
  function exportCSV() {
    if (filteredReports.length === 0) {
      alert("There are no reports to export.");
      return;
    }

    const headers = [
      "Report ID",
      "Student",
      "Room",
      "Category",
      "Amount",
      "Status",
      "Date",
    ];

    const rows = filteredReports.map((report) => [
      report.id,
      report.student,
      report.room,
      report.category,
      report.amount || 0,
      report.status,
      report.date,
    ]);

    const csv = [headers, ...rows]
      .map((row) =>
        row
          .map((value) =>
            `"${String(value).replaceAll('"', '""')}"`
          )
          .join(",")
      )
      .join("\n");

    const blob = new Blob(["\uFEFF" + csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "smartstay-reports.csv";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  }

  // --------------------------------------------------
  // STATUS BADGE
  // --------------------------------------------------
  function getBadgeVariant(status) {
    const variants = {
      Active: "success",
      Paid: "success",
      Completed: "success",
      Resolved: "teal",
      Pending: "warning",
      Open: "danger",
    };

    return variants[status] || "neutral";
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6 pb-8">

      {/* ==================================================
          HEADER
      ================================================== */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-smart-blue/10">
              <FileText
                size={23}
                className="text-smart-blue"
              />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-smart-primary sm:text-3xl">
                Detailed Reports
              </h1>

              <p className="mt-1 text-sm text-smart-secondary sm:text-base">
                Search, filter, and export hostel management reports.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={exportCSV}
          disabled={filteredReports.length === 0}
          className="flex items-center justify-center gap-2 rounded-xl bg-smart-primary px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-smart-blue disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Download size={18} />
          Export CSV
        </button>
      </div>

      {/* ==================================================
          SUMMARY CARDS
      ================================================== */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

        {/* Total Reports */}
        <Card>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-smart-secondary">
                Total Reports
              </p>

              <h2 className="mt-2 text-3xl font-bold text-smart-primary">
                {totalReports}
              </h2>

              <p className="mt-1 text-xs text-smart-secondary">
                Matching current filters
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-smart-blue/10">
              <ClipboardList
                size={21}
                className="text-smart-blue"
              />
            </div>
          </div>
        </Card>

        {/* Pending */}
        <Card>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-smart-secondary">
                Pending Reports
              </p>

              <h2 className="mt-2 text-3xl font-bold text-smart-warning">
                {pendingReports}
              </h2>

              <p className="mt-1 text-xs text-smart-secondary">
                Require attention
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-smart-warning/10">
              <Clock3
                size={21}
                className="text-smart-warning"
              />
            </div>
          </div>
        </Card>

        {/* Completed */}
        <Card>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-smart-secondary">
                Completed
              </p>

              <h2 className="mt-2 text-3xl font-bold text-smart-success">
                {completedReports}
              </h2>

              <p className="mt-1 text-xs text-smart-secondary">
                Paid, resolved or completed
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-smart-success/10">
              <CircleCheck
                size={21}
                className="text-smart-success"
              />
            </div>
          </div>
        </Card>

        {/* Total Payments */}
        <Card>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-smart-secondary">
                Total Payments
              </p>

              <h2 className="mt-2 text-2xl font-bold text-smart-primary">
                Rs. {totalPayments.toLocaleString()}
              </h2>

              <p className="mt-1 text-xs text-smart-secondary">
                From filtered payment reports
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-smart-teal/10">
              <CreditCard
                size={21}
                className="text-smart-teal"
              />
            </div>
          </div>
        </Card>
      </div>

      {/* ==================================================
          FILTER SECTION
      ================================================== */}
      <Card>
        <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2">
            <Filter
              size={20}
              className="text-smart-blue"
            />

            <div>
              <h2 className="font-bold text-smart-primary">
                Search and Filters
              </h2>

              <p className="text-xs text-smart-secondary">
                Find specific reports quickly
              </p>
            </div>
          </div>

          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="flex items-center gap-2 text-sm font-semibold text-smart-blue transition hover:text-smart-primary"
            >
              <RotateCcw size={16} />
              Reset Filters
            </button>
          )}
        </div>

        <div className="grid gap-4 md:grid-cols-3">

          {/* Search */}
          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-smart-secondary"
            />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search student, room, ID..."
              className="w-full rounded-xl border border-black/10 bg-white py-3 pl-10 pr-10 text-sm text-smart-primary outline-none transition placeholder:text-smart-secondary/70 focus:border-smart-blue focus:ring-2 focus:ring-smart-blue/10"
            />

            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-smart-secondary transition hover:text-smart-primary"
                aria-label="Clear search"
              >
                <X size={17} />
              </button>
            )}
          </div>

          {/* Category */}
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="rounded-xl border border-black/10 bg-white px-4 py-3 text-sm text-smart-primary outline-none transition focus:border-smart-blue focus:ring-2 focus:ring-smart-blue/10"
          >
            <option value="All">All Categories</option>
            <option value="Occupancy">Occupancy</option>
            <option value="Payment">Payment</option>
            <option value="Complaint">Complaint</option>
            <option value="Food Order">Food Order</option>
          </select>

          {/* Status */}
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="rounded-xl border border-black/10 bg-white px-4 py-3 text-sm text-smart-primary outline-none transition focus:border-smart-blue focus:ring-2 focus:ring-smart-blue/10"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Paid">Paid</option>
            <option value="Pending">Pending</option>
            <option value="Open">Open</option>
            <option value="Completed">Completed</option>
            <option value="Resolved">Resolved</option>
          </select>
        </div>

        {/* Active Filter Information */}
        <div className="mt-5 flex flex-col gap-3 border-t border-black/5 pt-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-smart-secondary">
            Showing{" "}
            <span className="font-semibold text-smart-primary">
              {filteredReports.length}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-smart-primary">
              {reportsData.length}
            </span>{" "}
            reports
          </p>

          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2">

              {search && (
                <Badge variant="info">
                  Search: {search}
                </Badge>
              )}

              {category !== "All" && (
                <Badge variant="info">
                  {category}
                </Badge>
              )}

              {status !== "All" && (
                <Badge variant="info">
                  {status}
                </Badge>
              )}
            </div>
          )}
        </div>
      </Card>

      {/* ==================================================
          REPORT TABLE
      ================================================== */}
      <Card padding="p-0">

        {/* Table Header */}
        <div className="flex flex-col justify-between gap-3 border-b border-black/5 p-5 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-smart-blue/10">
              <FileText
                size={20}
                className="text-smart-blue"
              />
            </div>

            <div>
              <h2 className="font-bold text-smart-primary">
                Report Records
              </h2>

              <p className="text-sm text-smart-secondary">
                {filteredReports.length} records found
              </p>
            </div>
          </div>

          <button
            onClick={exportCSV}
            disabled={filteredReports.length === 0}
            className="flex items-center justify-center gap-2 rounded-lg border border-black/10 px-4 py-2 text-sm font-semibold text-smart-primary transition hover:border-smart-blue hover:text-smart-blue disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Download size={16} />
            Export
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-sm">

            <thead className="bg-smart-background">
              <tr>
                <th className="px-5 py-4 font-semibold text-smart-secondary">
                  Report ID
                </th>

                <th className="px-5 py-4 font-semibold text-smart-secondary">
                  Student
                </th>

                <th className="px-5 py-4 font-semibold text-smart-secondary">
                  Room
                </th>

                <th className="px-5 py-4 font-semibold text-smart-secondary">
                  Category
                </th>

                <th className="px-5 py-4 font-semibold text-smart-secondary">
                  Amount
                </th>

                <th className="px-5 py-4 font-semibold text-smart-secondary">
                  Status
                </th>

                <th className="px-5 py-4 font-semibold text-smart-secondary">
                  Date
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-black/5">

              {filteredReports.map((report) => (
                <tr
                  key={report.id}
                  className="transition hover:bg-smart-background/70"
                >

                  {/* Report ID */}
                  <td className="px-5 py-4">
                    <span className="font-semibold text-smart-blue">
                      {report.id}
                    </span>
                  </td>

                  {/* Student */}
                  <td className="px-5 py-4">
                    <span className="font-medium text-smart-primary">
                      {report.student}
                    </span>
                  </td>

                  {/* Room */}
                  <td className="px-5 py-4">
                    <span className="text-smart-secondary">
                      {report.room}
                    </span>
                  </td>

                  {/* Category */}
                  <td className="px-5 py-4">
                    <Badge variant="info">
                      {report.category}
                    </Badge>
                  </td>

                  {/* Amount */}
                  <td className="px-5 py-4">
                    <span className="font-medium text-smart-primary">
                      {Number(report.amount || 0) > 0
                        ? `Rs. ${Number(
                            report.amount
                          ).toLocaleString()}`
                        : "—"}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="px-5 py-4">
                    <Badge
                      variant={getBadgeVariant(report.status)}
                    >
                      {report.status}
                    </Badge>
                  </td>

                  {/* Date */}
                  <td className="px-5 py-4">
                    <span className="text-smart-secondary">
                      {report.date}
                    </span>
                  </td>
                </tr>
              ))}

              {/* Empty State */}
              {filteredReports.length === 0 && (
                <tr>
                  <td
                    colSpan="7"
                    className="px-5 py-16 text-center"
                  >
                    <div className="mx-auto flex max-w-sm flex-col items-center">

                      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-smart-background">
                        <FileText
                          size={26}
                          className="text-smart-secondary"
                        />
                      </div>

                      <h3 className="mt-4 font-semibold text-smart-primary">
                        No reports found
                      </h3>

                      <p className="mt-1 text-sm text-smart-secondary">
                        Try changing your search or filter options.
                      </p>

                      {hasActiveFilters && (
                        <button
                          onClick={resetFilters}
                          className="mt-4 flex items-center gap-2 rounded-lg bg-smart-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-smart-blue"
                        >
                          <RotateCcw size={15} />
                          Clear Filters
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )}

            </tbody>
          </table>
        </div>

        {/* Bottom Information */}
        {filteredReports.length > 0 && (
          <div className="border-t border-black/5 px-5 py-4">
            <div className="flex flex-col justify-between gap-2 text-sm text-smart-secondary sm:flex-row sm:items-center">
              <span>
                Displaying{" "}
                <strong className="text-smart-primary">
                  {filteredReports.length}
                </strong>{" "}
                report
                {filteredReports.length !== 1 ? "s" : ""}
              </span>

              <span>
                SmartStay Report Management
              </span>
            </div>
          </div>
        )}

      </Card>
    </div>
  );
}

export default Reports;