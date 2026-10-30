import { useEffect, useMemo, useState } from "react";
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
  RefreshCw,
  Eye,
  X,
} from "lucide-react";

import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";

import {
  getOccupancyAnalytics,
  getFinancialAnalytics,
  getComplaintAnalytics,
  getTelemetryTrend,
  getFoodOrderAnalytics,
  getFoodOrders,
} from "../../services/analyticsApi";

const reportTypes = [
  "All Reports",
  "Occupancy Report",
  "Utility Report",
  "Food Order Report",
  "Complaint Report",
  "Financial Report",
  "Violation Report",
];

const formatDate = (date) => {
  if (!date) return "";
  const d = new Date(date);
  if (isNaN(d.getTime())) return String(date);
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const downloadCSV = (filename, rows) => {
  if (!rows || !rows.length) {
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
        .join(",")
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
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [reports, setReports] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All Reports");
  const [status, setStatus] = useState("All");
  const [period, setPeriod] = useState("All");
  const [generatedReport, setGeneratedReport] = useState(null);
  const [activePreviewReport, setActivePreviewReport] = useState(null);

  // Initial populate with system standard reports built from live endpoints
  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10);
    const initialReportsList = [
      {
        id: "RPT-OCC-01",
        name: "Hostel Occupancy & Bed Inventory Report",
        category: "Occupancy Report",
        period: "Current Semester",
        generatedAt: today,
        status: "Completed",
        description: "Room capacity, occupied beds, and block-wise occupancy distribution.",
      },
      {
        id: "RPT-UTL-02",
        name: "Hostel Utility & Telemetry Consumption",
        category: "Utility Report",
        period: "Current Month",
        generatedAt: today,
        status: "Completed",
        description: "Water and electricity telemetry logs, daily limits, and consumption trends.",
      },
      {
        id: "RPT-FIN-03",
        name: "Financial Collection & Balance Summary",
        category: "Financial Report",
        period: "Year to Date",
        generatedAt: today,
        status: "Completed",
        description: "Total billed fees, verified payment collections, and outstanding dues.",
      },
      {
        id: "RPT-CMP-04",
        name: "Maintenance Complaints Resolution Audit",
        category: "Complaint Report",
        period: "All Time",
        generatedAt: today,
        status: "Completed",
        description: "Complaint categories, priority levels, resolution statuses, and SLA durations.",
      },
      {
        id: "RPT-FOD-05",
        name: "Canteen Food Orders & Revenue Audit",
        category: "Food Order Report",
        period: "Current Month",
        generatedAt: today,
        status: "Completed",
        description: "Order volumes, realized revenue, popular meals, and student order records.",
      },
      {
        id: "RPT-VIO-06",
        name: "Hostel Violations & Disciplinary Summary",
        category: "Violation Report",
        period: "Academic Year 2026",
        generatedAt: today,
        status: "Pending",
        description: "Disciplinary reports and hostel rule violations logged by wardens.",
      },
    ];
    setReports(initialReportsList);
  }, []);

  const periods = useMemo(
    () => [...new Set(reports.map((report) => report.period))],
    [reports]
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
    (report) => report.status === "Completed"
  ).length;

  const pendingCount = reports.filter(
    (report) => report.status === "Pending"
  ).length;

  const resetFilters = () => {
    setSearch("");
    setCategory("All Reports");
    setStatus("All");
    setPeriod("All");
  };

  /**
   * Compiles actual live data for any report category
   */
  const compileReportRows = async (reportCategory) => {
    if (reportCategory === "Occupancy Report") {
      const res = await getOccupancyAnalytics();
      const d = res.data;
      if (d.blocks && d.blocks.length > 0) {
        return d.blocks.map((b) => ({
          "Block / Building": b.blockName,
          "Total Rooms": b.totalRooms,
          "Total Beds": b.totalBeds,
          "Occupied Beds": b.occupiedBeds,
          "Available Beds": b.availableBeds,
          "Occupancy Rate (%)": `${b.occupancyRate}%`,
        }));
      }
      return [
        {
          Metric: "Total Rooms",
          Value: d.totalRooms,
        },
        {
          Metric: "Total Beds",
          Value: d.totalBeds,
        },
        {
          Metric: "Occupied Beds",
          Value: d.occupiedBeds,
        },
        {
          Metric: "Available Beds",
          Value: d.availableBeds,
        },
        {
          Metric: "Occupancy Percentage",
          Value: `${d.occupancyPercentage}%`,
        },
      ];
    }

    if (reportCategory === "Financial Report") {
      const res = await getFinancialAnalytics();
      const d = res.data;
      if (d.monthlySummary && d.monthlySummary.length > 0) {
        return d.monthlySummary.map((m) => ({
          Month: m.month,
          "Billed Amount (LKR)": m.billedAmount,
          "Collected Amount (LKR)": m.collectedAmount,
          "Transaction Count": m.transactionCount,
        }));
      }
      return [
        {
          Metric: "Total Billed Amount (LKR)",
          Value: d.totalBilledAmount,
        },
        {
          Metric: "Total Collected Payments (LKR)",
          Value: d.totalCollectedPayments,
        },
        {
          Metric: "Outstanding Balance (LKR)",
          Value: d.outstandingBalance,
        },
        {
          Metric: "Collection Rate (%)",
          Value: `${d.collectionRate}%`,
        },
        {
          Metric: "Active Bills Count",
          Value: d.billsSummary?.activeCount || 0,
        },
        {
          Metric: "Successful Payments Count",
          Value: d.paymentsSummary?.successfulCount || 0,
        },
      ];
    }

    if (reportCategory === "Utility Report") {
      const res = await getTelemetryTrend();
      const d = res.data;
      if (d.dailySummary && d.dailySummary.length > 0) {
        return d.dailySummary.map((item) => ({
          Date: item.date,
          "Water (L)": item.water,
          "Electricity (kWh)": item.electricity,
          "Reading Count": item.readingCount,
        }));
      }
      return [
        {
          Metric: "Total Water Recorded (L)",
          Value: d.totalWater || 0,
        },
        {
          Metric: "Total Electricity Recorded (kWh)",
          Value: d.totalElectricity || 0,
        },
        {
          Metric: "Total Telemetry Readings Logged",
          Value: d.readingCount || 0,
        },
      ];
    }

    if (reportCategory === "Complaint Report") {
      const res = await getComplaintAnalytics();
      const d = res.data;
      return [
        {
          Metric: "Total Complaints Logged",
          Value: d.totalComplaints,
        },
        {
          Metric: "Open / In Progress Complaints",
          Value: d.openComplaints,
        },
        {
          Metric: "Resolved Complaints",
          Value: d.resolvedComplaints,
        },
        {
          Metric: "Average SLA Resolution Time (Hours)",
          Value: d.averageResolutionHours || "N/A",
        },
        {
          Metric: "High Priority Complaints",
          Value: d.priorityDistribution?.High || 0,
        },
        {
          Metric: "Critical Priority Complaints",
          Value: d.priorityDistribution?.Critical || 0,
        },
      ];
    }

    if (reportCategory === "Food Order Report") {
      const [analyticsRes, ordersRes] = await Promise.all([
        getFoodOrderAnalytics().catch(() => ({ data: {} })),
        getFoodOrders().catch(() => ({ data: [] })),
      ]);
      const orders = ordersRes.data || [];
      if (orders.length > 0) {
        return orders.map((o) => ({
          "Order ID": o.orderNo || String(o._id).slice(-6),
          Student: o.studentName || o.studentId,
          "Items / Meal": o.items?.map((it) => it.name).join(", ") || "Meal",
          Location: o.deliveryLocation,
          "Amount (LKR)": o.totalAmount,
          Status: o.status,
          Date: o.createdAt ? o.createdAt.slice(0, 10) : "",
        }));
      }
      return [
        {
          Metric: "Total Canteen Orders",
          Value: analyticsRes.data?.totalOrders || 0,
        },
        {
          Metric: "Realized Food Revenue (LKR)",
          Value: analyticsRes.data?.realizedRevenue || 0,
        },
        {
          Metric: "Delivered Orders Count",
          Value: analyticsRes.data?.statusCounts?.delivered || 0,
        },
        {
          Metric: "Cancelled Orders Count",
          Value: analyticsRes.data?.statusCounts?.cancelled || 0,
        },
      ];
    }

    // Fallback for Violation Report or unspecified
    return [
      {
        Metric: "Report Category",
        Value: reportCategory,
      },
      {
        Metric: "Status",
        Value: "Module 4 Disciplinary Register Pending Integration",
      },
      {
        Metric: "Note",
        Value: "Hostel violation logs are managed by Module 4 warden services.",
      },
    ];
  };

  const generateReport = async () => {
    if (category === "All Reports") {
      window.alert("Please select a specific report type first.");
      return;
    }

    setGenerating(true);
    try {
      const today = new Date();
      const rows = await compileReportRows(category);

      const newReport = {
        id: `RPT-${String(Date.now()).slice(-6)}`,
        name: `${category.replace(" Report", "")} Live Audit Report`,
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
        description: `Compiled report with ${rows.length} verified database records.`,
        compiledRows: rows,
      };

      setReports((prev) => [newReport, ...prev]);
      setGeneratedReport(newReport);
    } catch (err) {
      console.error("Failed to generate report:", err);
      window.alert(`Failed to compile report: ${err.message}`);
    } finally {
      setGenerating(false);
    }
  };

  const exportReports = () => {
    downloadCSV(
      "smartstay-reports-register.csv",
      filteredReports.map((report) => ({
        "Report ID": report.id,
        "Report Name": report.name,
        Category: report.category,
        Period: report.period,
        "Generated Date": report.generatedAt,
        Status: report.status,
        Description: report.description,
      }))
    );
  };

  const exportSingleReport = async (report) => {
    try {
      let rows = report.compiledRows;
      if (!rows || rows.length === 0) {
        // Fetch on-demand
        rows = await compileReportRows(report.category);
      }
      downloadCSV(`${report.id}-${report.category.replace(/\s+/g, "_")}.csv`, rows);
    } catch (err) {
      console.error("Failed to export report:", err);
      window.alert(`Export failed: ${err.message}`);
    }
  };

  const previewReport = async (report) => {
    try {
      let rows = report.compiledRows;
      if (!rows || rows.length === 0) {
        rows = await compileReportRows(report.category);
      }
      setActivePreviewReport({ ...report, compiledRows: rows });
    } catch (err) {
      window.alert(`Could not load preview: ${err.message}`);
    }
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
                Generate, review, and export SmartStay analytics reports with real database data.
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
          Export Report Register
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
              <p className="text-sm text-gray-500">Completed Reports</p>
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
              <p className="text-sm text-gray-500">Pending Reports</p>
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
            Generate an Audit Report
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Select a report category to fetch live backend aggregations and compile records.
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
              disabled={generating}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:opacity-50"
            >
              {generating ? (
                <RefreshCw size={17} className="animate-spin" />
              ) : (
                <FileBarChart size={17} />
              )}
              {generating ? "Compiling..." : "Generate Report"}
            </button>
          </div>
        </div>

        {generatedReport && (
          <div className="mt-4 flex flex-col gap-3 rounded-lg border border-emerald-200 bg-emerald-50 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-2 text-emerald-800">
              <CheckCircle2 size={20} className="mt-0.5 shrink-0" />
              <div>
                <p className="font-medium">Report generated successfully from live data</p>
                <p className="text-sm">
                  {generatedReport.name} · {generatedReport.id} (
                  {generatedReport.compiledRows?.length || 0} rows compiled)
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => previewReport(generatedReport)}
                className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-emerald-300 bg-white px-3 py-2 text-sm font-medium text-emerald-800 hover:bg-emerald-100"
              >
                <Eye size={15} />
                Preview
              </button>
              <button
                type="button"
                onClick={() => exportSingleReport(generatedReport)}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-700"
              >
                <Download size={15} />
                Export CSV
              </button>
            </div>
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
            Search, filter, preview and export available reports.
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
                <th className="px-4 py-3 font-semibold text-right">Actions</th>
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

                    <td className="px-4 py-4 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => previewReport(report)}
                          className="inline-flex items-center gap-1 rounded-md border border-gray-200 px-2.5 py-1.5 text-xs font-medium text-gray-700 transition hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700"
                          title="Preview Data"
                        >
                          <Eye size={13} />
                          Preview
                        </button>
                        <button
                          type="button"
                          onClick={() => exportSingleReport(report)}
                          className="inline-flex items-center gap-1.5 rounded-md border border-gray-200 px-2.5 py-1.5 text-xs font-medium text-gray-700 transition hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700"
                        >
                          <Download size={13} />
                          Export
                        </button>
                      </div>
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

      {/* Report Data Preview Modal */}
      {activePreviewReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[85vh] w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-2xl flex flex-col">
            <div className="flex items-center justify-between border-b border-gray-100 p-5">
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  {activePreviewReport.name}
                </h3>
                <p className="text-xs text-gray-500">
                  {activePreviewReport.id} · {activePreviewReport.category} · {activePreviewReport.period}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActivePreviewReport(null)}
                className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5">
              {activePreviewReport.compiledRows && activePreviewReport.compiledRows.length > 0 ? (
                <div className="overflow-x-auto rounded-lg border border-gray-200">
                  <table className="w-full border-collapse text-left text-xs">
                    <thead>
                      <tr className="bg-gray-50 text-gray-600 border-b border-gray-200">
                        {Object.keys(activePreviewReport.compiledRows[0]).map((h) => (
                          <th key={h} className="px-3 py-2.5 font-semibold">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {activePreviewReport.compiledRows.map((row, idx) => (
                        <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                          {Object.values(row).map((val, cIdx) => (
                            <td key={cIdx} className="px-3 py-2 text-gray-800">
                              {String(val ?? "")}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="py-6 text-center text-sm text-gray-500">
                  No records compiled for this report.
                </p>
              )}
            </div>

            <div className="flex items-center justify-between border-t border-gray-100 p-4 bg-gray-50">
              <span className="text-xs text-gray-500">
                {activePreviewReport.compiledRows?.length || 0} rows compiled
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setActivePreviewReport(null)}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-xs font-medium text-gray-700 hover:bg-white"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => exportSingleReport(activePreviewReport)}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-medium text-white hover:bg-indigo-700"
                >
                  <Download size={14} />
                  Export CSV
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <p className="text-xs leading-5 text-gray-400">
        Reports compile live aggregations across occupancy, utilities, financial payments, complaints, and canteen food orders.
      </p>
    </div>
  );
}
