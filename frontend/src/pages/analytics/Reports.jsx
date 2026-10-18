
import { useMemo, useState } from "react";
import {
  FileText,
  Download,
  CalendarDays,
  Building2,
  Wallet,
  BedDouble,
  MessageSquareWarning,
  ShoppingBag,
  ShieldAlert,
  Filter,
  RotateCcw,
  TrendingUp,
  CheckCircle2,
  FileSpreadsheet,
} from "lucide-react";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

import Card from "../../components/ui/Card";
import {
  overallMonthlyData,
  blockData,
} from "../../data/analyticsData";

const REPORT_TYPES = [
  {
    id: "occupancy",
    label: "Occupancy Report",
    description: "Bed availability and student occupancy",
    icon: BedDouble,
  },
  {
    id: "financial",
    label: "Financial Report",
    description: "Revenue, expenses and financial trends",
    icon: Wallet,
  },
  {
    id: "complaints",
    label: "Complaint Report",
    description: "Monthly open-complaint figures",
    icon: MessageSquareWarning,
  },
  {
    id: "violations",
    label: "Violation Report",
    description: "Hostel rule violation records",
    icon: ShieldAlert,
  },
  {
    id: "food",
    label: "Food Order Report",
    description: "Food-order records and trends",
    icon: ShoppingBag,
  },
];

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: "LKR",
    maximumFractionDigits: 0,
  }).format(value || 0);

const formatNumber = (value) =>
  new Intl.NumberFormat("en-LK").format(value || 0);

const getOccupancy = (occupied, totalBeds) =>
  totalBeds > 0 ? Math.round((occupied / totalBeds) * 100) : 0;

function downloadCSV(filename, rows) {
  if (!rows.length) return;

  const csv = rows
    .map((row) =>
      row
        .map((value) => {
          const text = String(value ?? "");
          return `"${text.replaceAll('"', '""')}"`;
        })
        .join(","),
    )
    .join("\r\n");

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
}

function SectionTitle({ icon: Icon, title, description }) {
  return (
    <div className="mb-5 flex items-start gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
        <Icon size={20} />
      </div>

      <div>
        <h2 className="text-base font-bold text-smart-primary">{title}</h2>
        <p className="mt-1 text-sm text-smart-secondary">{description}</p>
      </div>
    </div>
  );
}

function SummaryCard({ icon: Icon, label, value, subtitle }) {
  return (
    <Card>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm text-smart-secondary">{label}</p>
          <p className="mt-2 break-words text-2xl font-bold tracking-tight text-smart-primary">
            {value}
          </p>
          <p className="mt-2 text-xs text-smart-secondary">{subtitle}</p>
        </div>

        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
          <Icon size={21} />
        </div>
      </div>
    </Card>
  );
}

function EmptyState({ title, message }) {
  return (
    <div className="flex min-h-64 flex-col items-center justify-center px-5 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
        <FileText size={28} />
      </div>

      <h3 className="font-semibold text-smart-primary">{title}</h3>
      <p className="mt-2 max-w-md text-sm leading-6 text-smart-secondary">
        {message}
      </p>
    </div>
  );
}

export default function Reports() {
  const [reportType, setReportType] = useState("occupancy");
  const [dateRange, setDateRange] = useState("6");
  const [selectedBlock, setSelectedBlock] = useState("All Blocks");
  const [generated, setGenerated] = useState(false);

  const supportedReport = ["occupancy", "financial", "complaints"].includes(
    reportType,
  );

  const filteredData = useMemo(() => {
    return overallMonthlyData.slice(-Number(dateRange));
  }, [dateRange]);

  const blockOptions = useMemo(() => Object.keys(blockData || {}), []);

  const occupancyRows = useMemo(() => {
    return filteredData.map((item) => {
      let occupied = item.occupied || 0;
      let totalBeds = item.totalBeds || 0;
      let students = item.students ?? occupied;

      if (selectedBlock !== "All Blocks") {
        const blockMonth = blockData?.[selectedBlock]?.find(
          (record) => record.month === item.month,
        );

        occupied = blockMonth?.occupied || 0;
        totalBeds = blockMonth?.totalBeds || 0;
        students = blockMonth?.students ?? occupied;
      }

      return {
        month: item.month,
        students,
        occupied,
        totalBeds,
        occupancy: getOccupancy(occupied, totalBeds),
      };
    });
  }, [filteredData, selectedBlock]);

  const financialRows = useMemo(() => {
    return filteredData.map((item) => {
      let revenue = item.revenue || 0;
      let expenses = item.expenses || 0;

      if (selectedBlock !== "All Blocks") {
        const blockMonth = blockData?.[selectedBlock]?.find(
          (record) => record.month === item.month,
        );

        revenue = blockMonth?.revenue || 0;
        expenses = blockMonth?.expenses || 0;
      }

      return {
        month: item.month,
        revenue,
        expenses,
        profit: revenue - expenses,
      };
    });
  }, [filteredData, selectedBlock]);

  const complaintRows = useMemo(() => {
    return filteredData.map((item) => {
      let complaints = item.openComplaints || 0;

      if (selectedBlock !== "All Blocks") {
        const blockMonth = blockData?.[selectedBlock]?.find(
          (record) => record.month === item.month,
        );

        complaints = blockMonth?.openComplaints || 0;
      }

      return {
        month: item.month,
        complaints,
      };
    });
  }, [filteredData, selectedBlock]);

  const totals = useMemo(() => {
    const occupiedBeds = occupancyRows.reduce(
      (sum, item) => sum + item.occupied,
      0,
    );

    const totalBeds = occupancyRows.reduce(
      (sum, item) => sum + item.totalBeds,
      0,
    );

    const revenue = financialRows.reduce(
      (sum, item) => sum + item.revenue,
      0,
    );

    const expenses = financialRows.reduce(
      (sum, item) => sum + item.expenses,
      0,
    );

    const complaints = complaintRows.reduce(
      (sum, item) => sum + item.complaints,
      0,
    );

    return {
      occupiedBeds,
      totalBeds,
      occupancy: getOccupancy(occupiedBeds, totalBeds),
      revenue,
      expenses,
      profit: revenue - expenses,
      complaints,
    };
  }, [occupancyRows, financialRows, complaintRows]);

  const activeReport = REPORT_TYPES.find(
    (report) => report.id === reportType,
  );

  const reportRows = useMemo(() => {
    if (!generated || !supportedReport) return [];

    if (reportType === "occupancy") {
      return [
        ["Month", "Students", "Occupied Beds", "Total Beds", "Occupancy (%)"],
        ...occupancyRows.map((item) => [
          item.month,
          item.students,
          item.occupied,
          item.totalBeds,
          item.occupancy,
        ]),
      ];
    }

    if (reportType === "financial") {
      return [
        ["Month", "Revenue (LKR)", "Expenses (LKR)", "Net Balance (LKR)"],
        ...financialRows.map((item) => [
          item.month,
          item.revenue,
          item.expenses,
          item.profit,
        ]),
      ];
    }

    return [
      ["Month", "Open Complaints"],
      ...complaintRows.map((item) => [item.month, item.complaints]),
    ];
  }, [
    generated,
    supportedReport,
    reportType,
    occupancyRows,
    financialRows,
    complaintRows,
  ]);

  const handleGenerateReport = () => {
    if (!supportedReport || filteredData.length === 0) {
      setGenerated(false);
      return;
    }

    setGenerated(true);
  };

  const handleExport = () => {
    if (!generated || !supportedReport || reportRows.length < 2) return;

    const safeType = reportType.replace(/[^a-z0-9]/gi, "-");
    const safeBlock = selectedBlock.replace(/[^a-z0-9]/gi, "-");

    downloadCSV(
      `smartstay-${safeType}-${safeBlock}.csv`,
      reportRows,
    );
  };

  const handleReset = () => {
    setReportType("occupancy");
    setDateRange("6");
    setSelectedBlock("All Blocks");
    setGenerated(false);
  };

  const updateFilter = (setter) => (event) => {
    setter(event.target.value);
    setGenerated(false);
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Page header and single export button */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-950 via-blue-950 to-blue-800 p-6 text-white shadow-lg sm:p-8">
        <div className="pointer-events-none absolute -right-10 -top-16 h-56 w-56 rounded-full bg-blue-400/10 blur-2xl" />

        <div className="relative flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div className="max-w-2xl">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-medium text-blue-100">
              <FileSpreadsheet size={14} />
              Smart Monitoring & Analytics
            </div>

            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Reports & Insights
            </h1>

            <p className="mt-3 text-sm leading-6 text-blue-100 sm:text-base">
              Generate, review and export hostel performance reports from
              the available analytics data.
            </p>
          </div>

          <div className="flex shrink-0 flex-wrap gap-3">
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/20"
            >
              <RotateCcw size={16} />
              Reset
            </button>

            <button
              type="button"
              onClick={handleExport}
              disabled={!generated || !supportedReport}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-bold text-blue-950 transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Download size={17} />
              Export CSV
            </button>
          </div>
        </div>
      </div>

      {/* Report filters */}
      <Card>
        <SectionTitle
          icon={Filter}
          title="Report configuration"
          description="Select the report and filters, then generate the results."
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div>
            <label className="mb-2 block text-sm font-semibold text-smart-primary">
              Report type
            </label>

            <select
              value={reportType}
              onChange={updateFilter(setReportType)}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              {REPORT_TYPES.map((report) => (
                <option key={report.id} value={report.id}>
                  {report.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-smart-primary">
              Reporting period
            </label>

            <select
              value={dateRange}
              onChange={updateFilter(setDateRange)}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="1">Latest month</option>
              <option value="3">Last 3 months</option>
              <option value="6">Last 6 months</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-smart-primary">
              Hostel block
            </label>

            <select
              value={selectedBlock}
              onChange={updateFilter(setSelectedBlock)}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="All Blocks">All Blocks</option>

              {blockOptions.map((block) => (
                <option key={block} value={block}>
                  {block}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <button
              type="button"
              onClick={handleGenerateReport}
              disabled={!supportedReport || filteredData.length === 0}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <FileText size={17} />
              Generate Report
            </button>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-slate-100 pt-4 text-xs text-smart-secondary">
          <span className="inline-flex items-center gap-1.5">
            <CalendarDays size={14} />
            {filteredData[0]?.month || "—"} –{" "}
            {filteredData[filteredData.length - 1]?.month || "—"}
          </span>

          <span className="inline-flex items-center gap-1.5">
            <Building2 size={14} />
            {selectedBlock}
          </span>

          {generated && supportedReport && (
            <span className="inline-flex items-center gap-1.5 font-semibold text-emerald-600">
              <CheckCircle2 size={14} />
              Report generated successfully
            </span>
          )}
        </div>
      </Card>

      {/* Results appear after clicking Generate Report */}
      {!generated && (
        <Card>
          <EmptyState
            title="Ready to generate your report"
            message="Choose your report type, date range and hostel block above. Click Generate Report to display the results."
          />
        </Card>
      )}

      {generated && !supportedReport && (
        <Card>
          <EmptyState
            title={
              reportType === "food"
                ? "Food order data is not connected"
                : "Violation data is not connected"
            }
            message="This report needs its own food-order or violation dataset. Select Occupancy, Financial or Complaint Report to generate a report from the currently available sample data."
          />
        </Card>
      )}

      {generated && supportedReport && (
        <>
          {/* Summary cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {reportType === "occupancy" && (
              <>
                <SummaryCard
                  icon={BedDouble}
                  label="Occupied beds"
                  value={formatNumber(totals.occupiedBeds)}
                  subtitle="Total across selected months"
                />

                <SummaryCard
                  icon={Building2}
                  label="Bed capacity"
                  value={formatNumber(totals.totalBeds)}
                  subtitle="Sum of monthly capacity"
                />

                <SummaryCard
                  icon={TrendingUp}
                  label="Average occupancy"
                  value={`${totals.occupancy}%`}
                  subtitle="Weighted occupancy"
                />

                <SummaryCard
                  icon={MessageSquareWarning}
                  label="Open complaints"
                  value={formatNumber(totals.complaints)}
                  subtitle="Monthly figures summed"
                />
              </>
            )}

            {reportType === "financial" && (
              <>
                <SummaryCard
                  icon={Wallet}
                  label="Total revenue"
                  value={formatCurrency(totals.revenue)}
                  subtitle="Selected reporting period"
                />

                <SummaryCard
                  icon={TrendingUp}
                  label="Total expenses"
                  value={formatCurrency(totals.expenses)}
                  subtitle="Selected reporting period"
                />

                <SummaryCard
                  icon={CheckCircle2}
                  label="Net balance"
                  value={formatCurrency(totals.profit)}
                  subtitle="Revenue minus expenses"
                />

                <SummaryCard
                  icon={CalendarDays}
                  label="Reporting months"
                  value={filteredData.length}
                  subtitle="Months in this report"
                />
              </>
            )}

            {reportType === "complaints" && (
              <>
                <SummaryCard
                  icon={MessageSquareWarning}
                  label="Open complaints"
                  value={formatNumber(totals.complaints)}
                  subtitle="Sum of monthly figures"
                />

                <SummaryCard
                  icon={CalendarDays}
                  label="Reporting months"
                  value={filteredData.length}
                  subtitle="Months in this report"
                />

                <SummaryCard
                  icon={Building2}
                  label="Report scope"
                  value={selectedBlock}
                  subtitle="Selected hostel block"
                />

                <SummaryCard
                  icon={FileSpreadsheet}
                  label="Export format"
                  value="CSV"
                  subtitle="Spreadsheet-compatible file"
                />
              </>
            )}
          </div>

          {/* One report chart */}
          <Card>
            <SectionTitle
              icon={activeReport?.icon || FileText}
              title={activeReport?.label || "Report"}
              description={activeReport?.description || ""}
            />

            {reportType === "occupancy" && (
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={occupancyRows}
                    margin={{ top: 10, right: 10, left: 0, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="month" tickLine={false} axisLine={false} />
                    <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
                    <Tooltip />
                    <Legend />
                    <Bar
                      dataKey="occupied"
                      name="Occupied beds"
                      fill="#2563eb"
                      radius={[5, 5, 0, 0]}
                    />
                    <Bar
                      dataKey="totalBeds"
                      name="Total beds"
                      fill="#cbd5e1"
                      radius={[5, 5, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}

            {reportType === "financial" && (
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={financialRows}
                    margin={{ top: 10, right: 10, left: 10, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="month" tickLine={false} axisLine={false} />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) =>
                        value >= 1000000
                          ? `${(value / 1000000).toFixed(1)}M`
                          : value >= 1000
                            ? `${(value / 1000).toFixed(0)}k`
                            : value
                      }
                    />
                    <Tooltip
                      formatter={(value) => formatCurrency(Number(value))}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="revenue"
                      name="Revenue"
                      stroke="#2563eb"
                      strokeWidth={3}
                      dot={{ r: 4 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="expenses"
                      name="Expenses"
                      stroke="#f97316"
                      strokeWidth={3}
                      dot={{ r: 4 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="profit"
                      name="Net balance"
                      stroke="#16a34a"
                      strokeWidth={3}
                      dot={{ r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}

            {reportType === "complaints" && (
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={complaintRows}
                    margin={{ top: 10, right: 10, left: 0, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="month" tickLine={false} axisLine={false} />
                    <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="complaints"
                      name="Open complaints"
                      stroke="#ea580c"
                      strokeWidth={3}
                      dot={{ r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </Card>

          {/* Report table */}
          <Card>
            <div className="mb-5">
              <h2 className="text-base font-bold text-smart-primary">
                Report data
              </h2>
              <p className="mt-1 text-sm text-smart-secondary">
                Review the data included in your report.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[620px] border-collapse text-left text-sm">
                <thead>
                  <tr className="border-y border-slate-100 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                    {reportRows[0]?.map((heading) => (
                      <th key={heading} className="px-4 py-3 font-semibold">
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {reportRows.slice(1).map((row, rowIndex) => (
                    <tr
                      key={`${row[0]}-${rowIndex}`}
                      className="border-b border-slate-100 transition hover:bg-slate-50/70"
                    >
                      {row.map((value, cellIndex) => {
                        const isMoney =
                          reportType === "financial" && cellIndex > 0;

                        return (
                          <td
                            key={`${cellIndex}-${String(value)}`}
                            className="px-4 py-4 text-smart-primary"
                          >
                            {isMoney
                              ? formatCurrency(Number(value))
                              : value}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}
    </div>
  );
}
