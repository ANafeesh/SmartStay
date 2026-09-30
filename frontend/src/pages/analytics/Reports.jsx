
import { useState } from "react";
import {
  Search,
  Download,
  FileText,
  Filter,
  RotateCcw,
} from "lucide-react";

import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import { reportsData } from "../../data/reportsData";

function Reports() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [status, setStatus] = useState("All");

  const filteredReports = reportsData.filter((report) => {
    const searchText = search.toLowerCase();

    const matchesSearch =
      report.id.toLowerCase().includes(searchText) ||
      report.student.toLowerCase().includes(searchText) ||
      report.room.toLowerCase().includes(searchText);

    const matchesCategory =
      category === "All" || report.category === category;

    const matchesStatus =
      status === "All" || report.status === status;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  function resetFilters() {
    setSearch("");
    setCategory("All");
    setStatus("All");
  }

  function exportCSV() {
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
      report.amount,
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
    link.click();

    URL.revokeObjectURL(url);
  }

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
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Heading */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold text-smart-primary">
            Detailed Reports
          </h1>

          <p className="mt-2 text-smart-secondary">
            Search, filter, and export hostel management reports.
          </p>
        </div>

        <button
          onClick={exportCSV}
          className="flex items-center justify-center gap-2 rounded-xl bg-smart-primary px-5 py-3 font-semibold text-white hover:bg-smart-blue"
        >
          <Download size={18} />
          Export CSV
        </button>
      </div>

      {/* Summary */}
      <div className="grid gap-5 sm:grid-cols-3">
        <Card>
          <p className="text-sm text-smart-secondary">
            Total Reports
          </p>

          <h2 className="mt-2 text-3xl font-bold text-smart-primary">
            {filteredReports.length}
          </h2>
        </Card>

        <Card>
          <p className="text-sm text-smart-secondary">
            Pending Reports
          </p>

          <h2 className="mt-2 text-3xl font-bold text-smart-warning">
            {
              filteredReports.filter(
                (report) => report.status === "Pending"
              ).length
            }
          </h2>
        </Card>

        <Card>
          <p className="text-sm text-smart-secondary">
            Total Payments
          </p>

          <h2 className="mt-2 text-3xl font-bold text-smart-success">
            Rs.{" "}
            {filteredReports
              .filter((report) => report.category === "Payment")
              .reduce((sum, report) => sum + report.amount, 0)
              .toLocaleString()}
          </h2>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <div className="mb-5 flex items-center gap-2">
          <Filter size={20} className="text-smart-blue" />

          <h2 className="font-bold text-smart-primary">
            Search and Filters
          </h2>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-smart-secondary"
            />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search student, room, or ID..."
              className="w-full rounded-xl border border-black/10 py-3 pl-10 pr-4 outline-none focus:border-smart-blue"
            />
          </div>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="rounded-xl border border-black/10 bg-white px-4 py-3 outline-none focus:border-smart-blue"
          >
            <option value="All">All Categories</option>
            <option value="Occupancy">Occupancy</option>
            <option value="Payment">Payment</option>
            <option value="Complaint">Complaint</option>
            <option value="Food Order">Food Order</option>
          </select>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="rounded-xl border border-black/10 bg-white px-4 py-3 outline-none focus:border-smart-blue"
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

        <button
          onClick={resetFilters}
          className="mt-4 flex items-center gap-2 text-sm font-semibold text-smart-blue hover:text-smart-primary"
        >
          <RotateCcw size={16} />
          Reset Filters
        </button>
      </Card>

      {/* Report table */}
      <Card padding="p-0">
        <div className="flex items-center justify-between border-b border-black/5 p-5">
          <div className="flex items-center gap-3">
            <FileText size={22} className="text-smart-blue" />

            <div>
              <h2 className="font-bold text-smart-primary">
                Report Records
              </h2>

              <p className="text-sm text-smart-secondary">
                {filteredReports.length} records found
              </p>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px] text-left text-sm">
            <thead className="bg-smart-background text-smart-secondary">
              <tr>
                <th className="px-5 py-4 font-semibold">Report ID</th>
                <th className="px-5 py-4 font-semibold">Student</th>
                <th className="px-5 py-4 font-semibold">Room</th>
                <th className="px-5 py-4 font-semibold">Category</th>
                <th className="px-5 py-4 font-semibold">Amount</th>
                <th className="px-5 py-4 font-semibold">Status</th>
                <th className="px-5 py-4 font-semibold">Date</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-black/5">
              {filteredReports.map((report) => (
                <tr
                  key={report.id}
                  className="transition hover:bg-smart-background"
                >
                  <td className="px-5 py-4 font-semibold text-smart-blue">
                    {report.id}
                  </td>

                  <td className="px-5 py-4 font-medium text-smart-primary">
                    {report.student}
                  </td>

                  <td className="px-5 py-4 text-smart-secondary">
                    {report.room}
                  </td>

                  <td className="px-5 py-4">
                    <Badge variant="info">
                      {report.category}
                    </Badge>
                  </td>

                  <td className="px-5 py-4 font-medium text-smart-primary">
                    {report.amount > 0
                      ? `Rs. ${report.amount.toLocaleString()}`
                      : "—"}
                  </td>

                  <td className="px-5 py-4">
                    <Badge variant={getBadgeVariant(report.status)}>
                      {report.status}
                    </Badge>
                  </td>

                  <td className="px-5 py-4 text-smart-secondary">
                    {report.date}
                  </td>
                </tr>
              ))}

              {filteredReports.length === 0 && (
                <tr>
                  <td
                    colSpan="7"
                    className="px-5 py-12 text-center text-smart-secondary"
                  >
                    No reports found. Try changing your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

export default Reports;