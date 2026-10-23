
import { useMemo, useState } from "react";
import {
  FileBarChart,
  Download,
  Search,
  RotateCcw,
  FileText,
  CalendarDays,
  CheckCircle2,
  Clock,
  AlertTriangle,
} from "lucide-react";

import Card from "../../components/ui/Card";

const reportTypes = [
  "All Reports",
  "Occupancy Report",
  "Utility Report",
  "Food Order Report",
  "Complaint Report",
  "Violation Report",
  "Financial Report",
];

const sampleReports = [
  {
    id: "RPT001",
    name: "Monthly Occupancy Report",
    category: "Occupancy Report",
    period: "September 2026",
    generatedAt: "2026-09-30",
    status: "Completed",
    description: "Hostel capacity, occupied beds and available rooms.",
  },
  {
    id: "RPT002",
    name: "Utility Consumption Report",
    category: "Utility Report",
    period: "September 2026",
    generatedAt: "2026-09-30",
    status: "Completed",
    description: "Water and electricity consumption trends.",
  },
  {
    id: "RPT003",
    name: "Food Order Summary",
    category: "Food Order Report",
    period: "September 2026",
    generatedAt: "2026-09-29",
    status: "Completed",
    description: "Food orders, popular meals and revenue summary.",
  },
  {
    id: "RPT004",
    name: "Complaint Summary",
    category: "Complaint Report",
    period: "September 2026",
    generatedAt: "2026-09-28",
    status: "Pending",
    description: "Complaint categories, statuses and resolution trends.",
  },
  {
    id: "RPT005",
    name: "Hostel Violation Summary",
    category: "Violation Report",
    period: "September 2026",
    generatedAt: "2026-09-27",
    status: "Completed",
    description: "Violation categories and monthly statistics.",
  },
  {
    id: "RPT006",
    name: "Payment Collection Summary",
    category: "Financial Report",
    period: "September 2026",
    generatedAt: "2026-09-26",
    status: "Pending",
    description: "Payment collection and outstanding balance summary.",
  },
];

const formatDate = (date) =>
  new Date(`${date}T00:00:00`).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const downloadCSV = (filename, rows) => {
  if (!rows.length) {
    window.alert("No report data available to export.");
    return;
  }

  const headers = Object.keys(rows[0]);

  const csv = [
    headers.join(","),
    ...rows.map((row) =>
      headers
        .map((header) => {
          const value = String(row[header] ?? "").replace(/"/g, '""');
          return `"${value}"`;
        })
        .join(","),
    ),
  ].join("\n");

  const blob = new Blob(["\uFEFF" + csv], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();

  URL.revokeObjectURL(url);
};

const StatusBadge = ({ status }) => {
  const styles = {
    Completed: "bg-emerald-50 text-emerald-700",
    Pending: "bg-amber-50 text-amber-700",
    Failed: "bg-red-50 text-red-700",
  };

  const icons = {
    Completed: CheckCircle2,
    Pending: Clock,
    Failed: AlertTriangle,
  };

  const Icon = icons[status] || Clock;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
        styles[status] || "bg-gray-100 text-gray-600"
      }`}
    >
      <Icon size={13} />
      {status}
    </span>
  );
};

export default function Reports() {
  const [reports, setReports] = useState(sampleReports);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All Reports");
  const [status, setStatus] = useState("All");
  const [period, setPeriod] = useState("All");
  const [generatedReport, setGeneratedReport] = useState(null);

  const periods = useMemo(
    () => [...new Set(reports.map((report) => report.period))],
    [reports],
  );

  const filteredReports = useMemo(() => {
    const query = search.trim().toLowerCase();

    return reports.filter((report) => {
      const matchesSearch =
        !query ||
        report.id.toLowerCase().includes(query) ||
        report.name.toLowerCase().includes(query) ||
        report.category.toLowerCase().includes(query);

      const matchesCategory =
        category === "All Reports" || report.category === category;

      const matchesStatus = status === "All" || report.status === status;

      const matchesPeriod = period === "All" || report.period === period;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesStatus &&
        matchesPeriod
      );
    });
  }, [reports, search, category, status, period]);

  const completedCount = reports.filter(
    (report) => report.status === "Completed",
  ).length;

  const pendingCount = reports.filter(
    (report) => report.status === "Pending",
  ).length;

  const resetFilters = () => {
    setSearch("");
    setCategory("All Reports");
    setStatus("All");
    setPeriod("All");
  };

  const generateReport = () => {
    if (category === "All Reports") {
      window.alert("Please select a specific report type first.");
      return;
    }

    const today = new Date();
    const newReport = {
      id: `RPT${String(Date.now()).slice(-6)}`,
      name: category.replace(" Report", "") + " Report",
      category,
      period:
        period !== "All"
          ? period
          : today.toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
            }),
      generatedAt: today.toISOString().slice(0, 10),
      status: "Completed",
      description: `Demonstration ${category.toLowerCase()} entry.`,
    };

    setReports((previous) => [newReport, ...previous]);
    setGeneratedReport(newReport);
  };

  const exportReports = () => {
    downloadCSV(
      "smartstay-reports.csv",
      filteredReports.map((report) => ({
        "Report ID": report.id,
        "Report Name": report.name,
        Category: report.category,
        Period: report.period,
        "Generated Date": report.generatedAt,
        Status: report.status,
        Description: report.description,
      })),
    );
  };

  const exportSingleReport = (report) => {
    downloadCSV(`${report.id}.csv`, [
      {
        "Report ID": report.id,
        "Report Name": report.name,
        Category: report.category,
        Period: report.period,
        "Generated Date": report.generatedAt,
        Status: report.status,
        Description: report.description,
      },
    ]);
  };

  return (
    <div className="space-y-6 p-4 sm:p-6">
      {/* Page heading */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600">
              <FileBarChart size={26} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                Reports
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Generate, review and export SmartStay analytics reports.
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={exportReports}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700"
        >
          <Download size={17} />
          Export Reports
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Reports</p>
              <h2 className="mt-2 text-3xl font-bold text-gray-900">
                {reports.length}
              </h2>
            </div>
            <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600">
              <FileText size={24} />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Completed</p>
              <h2 className="mt-2 text-3xl font-bold text-emerald-600">
                {completedCount}
              </h2>
            </div>
            <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
              <CheckCircle2 size={24} />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Pending</p>
              <h2 className="mt-2 text-3xl font-bold text-amber-600">
                {pendingCount}
              </h2>
            </div>
            <div className="rounded-xl bg-amber-50 p-3 text-amber-600">
              <Clock size={24} />
            </div>
          </div>
        </Card>
      </div>

      {/* Generate report */}
      <Card>
        <div className="mb-5">
          <h2 className="text-lg font-semibold text-gray-900">
            Generate a Report
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Select a report type to add a demonstration report record.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div>
            <label
              htmlFor="generate-category"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Report Type
            </label>
            <select
              id="generate-category"
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            >
              {reportTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="generate-period"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Reporting Period
            </label>
            <select
              id="generate-period"
              value={period}
              onChange={(event) => setPeriod(event.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            >
              <option value="All">Current / all periods</option>
              {periods.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <button
              type="button"
              onClick={generateReport}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700"
            >
              <FileBarChart size={17} />
              Generate Report
            </button>
          </div>
        </div>

        {generatedReport && (
          <div className="mt-4 flex flex-col gap-3 rounded-lg border border-emerald-200 bg-emerald-50 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-2 text-emerald-800">
              <CheckCircle2 size={20} className="mt-0.5 shrink-0" />
              <div>
                <p className="font-medium">Demo report created successfully</p>
                <p className="text-sm">
                  {generatedReport.name} · {generatedReport.id}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => exportSingleReport(generatedReport)}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-emerald-300 px-3 py-2 text-sm font-medium text-emerald-800 hover:bg-emerald-100"
            >
              <Download size={15} />
              Export this report
            </button>
          </div>
        )}
      </Card>

      {/* Report records */}
      <Card>
        <div className="mb-5">
          <h2 className="text-lg font-semibold text-gray-900">
            Report History
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Search, filter and export available report records.
          </p>
        </div>

        {/* Filters */}
        <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <div className="relative">
            <Search
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search reports..."
              className="w-full rounded-lg border border-gray-300 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          <select
            aria-label="Filter report category"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo-500"
          >
            {reportTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>

          <select
            aria-label="Filter report status"
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            className="rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo-500"
          >
            <option value="All">All Statuses</option>
            <option value="Completed">Completed</option>
            <option value="Pending">Pending</option>
            <option value="Failed">Failed</option>
          </select>

          <button
            type="button"
            onClick={resetFilters}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-3 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            <RotateCcw size={16} />
            Reset Filters
          </button>
        </div>

        <div className="mb-3 flex items-center justify-between gap-3">
          <p className="text-sm text-gray-500">
            Showing {filteredReports.length} of {reports.length} reports
          </p>

          <div className="hidden items-center gap-1 text-xs text-gray-400 sm:flex">
            <CalendarDays size={14} />
            Report register
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50 text-gray-600">
                <th className="px-4 py-3 font-semibold">Report</th>
                <th className="px-4 py-3 font-semibold">Category</th>
                <th className="px-4 py-3 font-semibold">Period</th>
                <th className="px-4 py-3 font-semibold">Generated Date</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredReports.length > 0 ? (
                filteredReports.map((report) => (
                  <tr
                    key={report.id}
                    className="border-b border-gray-100 transition hover:bg-gray-50"
                  >
                    <td className="px-4 py-4">
                      <div className="font-medium text-gray-900">
                        {report.name}
                      </div>
                      <div className="mt-1 text-xs text-gray-400">
                        {report.id}
                      </div>
                    </td>

                    <td className="px-4 py-4 text-gray-600">
                      {report.category}
                    </td>

                    <td className="px-4 py-4 text-gray-600">
                      {report.period}
                    </td>

                    <td className="px-4 py-4 text-gray-600">
                      {formatDate(report.generatedAt)}
                    </td>

                    <td className="px-4 py-4">
                      <StatusBadge status={report.status} />
                    </td>

                    <td className="px-4 py-4">
                      <button
                        type="button"
                        onClick={() => exportSingleReport(report)}
                        className="inline-flex items-center gap-1.5 rounded-md border border-gray-200 px-2.5 py-1.5 text-xs font-medium text-gray-700 transition hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700"
                      >
                        <Download size={14} />
                        Export
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-12 text-center text-gray-500"
                  >
                    No reports match your search or filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <p className="text-xs leading-5 text-gray-400">
        Demo mode: report records and report generation are currently managed
        in frontend state using sample data. Connect these actions to your
        agreed report API before treating them as permanent or live reports.
      </p>
    </div>
  );
}