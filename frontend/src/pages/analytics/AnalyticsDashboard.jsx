import { useState } from "react";

import {
  Users,
  BedDouble,
  Wallet,
  AlertCircle,
  Download,
  CalendarDays,
  TrendingUp,
  UserPlus,
  CreditCard,
  MessageSquare,
  Building2,
  RefreshCw,
} from "lucide-react";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";

import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";

import {
  summaryStats,
  occupancyData,
  revenueData,
  complaintData,
  recentActivity,
  blockOccupancy,
  blockAData,
  blockBData,
  blockCData,
} from "../../data/analyticsData";


const statIcons = {
  blue: Users,
  teal: BedDouble,
  green: Wallet,
  orange: AlertCircle,
};

const statStyles = {
  blue: "bg-smart-blue/10 text-smart-blue",
  teal: "bg-smart-teal/10 text-smart-teal",
  green: "bg-smart-success/10 text-smart-success",
  orange: "bg-smart-warning/10 text-smart-warning",
};

const activityIcons = {
  student: UserPlus,
  payment: CreditCard,
  complaint: MessageSquare,
  room: Building2,
};

const complaintColors = [
  "#1686d4",
  "#06b6d4",
  "#f59e0b",
  "#10b981",
  "#ef4444",
];


function AnalyticsDashboard() {
  const [dateRange, setDateRange] = useState("6months");
  const [selectedBlock, setSelectedBlock] = useState("all");


  const selectedBlockData =
    selectedBlock === "Block A"
      ? blockAData
      : selectedBlock === "Block B"
        ? blockBData
        : selectedBlock === "Block C"
          ? blockCData
          : null;

  // ===================================================
  // Select current datasets
  // ===================================================

  const currentOccupancyData =
    selectedBlockData?.occupancy || occupancyData;

  const currentRevenueData =
    selectedBlockData?.revenue || revenueData;

  const currentComplaintData =
    selectedBlockData?.complaints || complaintData;



  const monthCount =
    dateRange === "1month"
      ? 1
      : dateRange === "3months"
        ? 3
        : 6;

  const filteredOccupancyData =
    currentOccupancyData.slice(-monthCount);

  const filteredRevenueData =
    currentRevenueData.slice(-monthCount);


  const filteredBlocks =
    selectedBlock === "all"
      ? blockOccupancy
      : blockOccupancy.filter(
          (item) => item.block === selectedBlock
        );


  const totalOccupied = filteredBlocks.reduce(
    (sum, item) => sum + item.occupied,
    0
  );

  const totalBeds = filteredBlocks.reduce(
    (sum, item) => sum + item.total,
    0
  );

  const occupancyPercentage =
    totalBeds > 0
      ? ((totalOccupied / totalBeds) * 100).toFixed(1)
      : "0.0";


  const latestRevenue =
    filteredRevenueData.length > 0
      ? filteredRevenueData[
          filteredRevenueData.length - 1
        ].revenue
      : 0;

  const formattedRevenue =
    `Rs. ${(latestRevenue / 1000000).toFixed(2)}M`;

  const displayedStudents = selectedBlockData
    ? selectedBlockData.students
    : 248;


  const displayedComplaints = selectedBlockData
    ? selectedBlockData.openComplaints
    : 18;


  function handleExport() {
    const rows = [
      ["SmartStay Analytics Report"],
      [],
      ["Selected Period", dateRange],
      ["Selected Block", selectedBlock],
      [],
      ["Metric", "Value"],
      ["Total Students", displayedStudents],
      ["Occupancy Rate", `${occupancyPercentage}%`],
      [
        "Monthly Revenue",
        selectedBlockData
          ? formattedRevenue
          : "Rs. 1.85M",
      ],
      ["Open Complaints", displayedComplaints],
      [],
      [
        "Block",
        "Occupied Beds",
        "Total Beds",
        "Occupancy",
      ],
      ...filteredBlocks.map((item) => [
        item.block,
        item.occupied,
        item.total,
        `${(
          (item.occupied / item.total) *
          100
        ).toFixed(1)}%`,
      ]),
      [],
      ["Month", "Occupied", "Available"],
      ...filteredOccupancyData.map((item) => [
        item.month,
        item.occupied,
        item.available,
      ]),
      [],
      ["Month", "Revenue", "Expenses"],
      ...filteredRevenueData.map((item) => [
        item.month,
        item.revenue,
        item.expenses,
      ]),
      [],
      ["Complaint Category", "Count"],
      ...currentComplaintData.map((item) => [
        item.category,
        item.count,
      ]),
    ];

    const csv = rows
      .map((row) =>
        row
          .map(
            (value) =>
              `"${String(value ?? "").replaceAll(
                '"',
                '""'
              )}"`
          )
          .join(",")
      )
      .join("\n");

    const blob = new Blob(
      ["\uFEFF" + csv],
      {
        type: "text/csv;charset=utf-8;",
      }
    );

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;
    link.download =
      "smartstay-analytics.csv";

    document.body.appendChild(link);

    link.click();

    link.remove();

    URL.revokeObjectURL(url);
  }



  function handleReset() {
    setDateRange("6months");
    setSelectedBlock("all");
  }



  return (
    <div className="mx-auto max-w-7xl space-y-6">


      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

        <div className="flex items-center gap-3">

          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-smart-blue/10 text-smart-blue">
            <TrendingUp size={24} />
          </div>

          <div>

            <h1 className="text-2xl font-bold text-smart-primary sm:text-3xl">
              Smart Monitoring & Analytics
            </h1>

            <p className="mt-1 text-sm text-smart-secondary">
              Monitor hostel performance, occupancy,
              revenue, and student services.
            </p>

          </div>

        </div>

        <button
          onClick={handleExport}
          className="flex items-center justify-center gap-2 rounded-xl bg-smart-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-smart-blue"
        >
          <Download size={18} />
          Export Report
        </button>

      </div>


      <Card padding="p-4">

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div className="flex items-center gap-2 text-sm font-semibold text-smart-primary">
            <CalendarDays size={19} />
            Report Filters
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">


            <select
              value={dateRange}
              onChange={(e) =>
                setDateRange(e.target.value)
              }
              className="rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:border-smart-blue"
            >
              <option value="1month">
                Last Month
              </option>

              <option value="3months">
                Last 3 Months
              </option>

              <option value="6months">
                Last 6 Months
              </option>
            </select>


            <select
              value={selectedBlock}
              onChange={(e) =>
                setSelectedBlock(e.target.value)
              }
              className="rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:border-smart-blue"
            >
              <option value="all">
                All Blocks
              </option>

              <option value="Block A">
                Block A
              </option>

              <option value="Block B">
                Block B
              </option>

              <option value="Block C">
                Block C
              </option>
            </select>

            <button
              onClick={handleReset}
              className="flex items-center justify-center gap-2 rounded-xl border border-black/10 px-4 py-3 text-sm font-medium text-smart-secondary hover:bg-smart-background"
            >
              <RefreshCw size={16} />
              Reset
            </button>

          </div>

        </div>

      </Card>


      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">

        {summaryStats.map((stat) => {

          const Icon = statIcons[stat.color];

          let displayedValue = stat.value;

          if (stat.title === "Total Students") {
            displayedValue =
              displayedStudents;
          }

          if (stat.title === "Occupancy Rate") {
            displayedValue =
              `${occupancyPercentage}%`;
          }

          if (stat.title === "Monthly Revenue") {
            displayedValue =
              selectedBlockData
                ? formattedRevenue
                : stat.value;
          }

          if (stat.title === "Open Complaints") {
            displayedValue =
              displayedComplaints;
          }

          return (
            <Card
              key={stat.title}
              padding="p-5"
            >

              <div className="flex items-start justify-between">

                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl ${statStyles[stat.color]}`}
                >
                  <Icon size={23} />
                </div>

                <Badge variant="success">

                  <span className="flex items-center gap-1">
                    <TrendingUp size={13} />
                    Active
                  </span>

                </Badge>

              </div>

              <p className="mt-5 text-sm text-smart-secondary">
                {stat.title}
              </p>

              <h2 className="mt-1 text-2xl font-bold text-smart-primary">
                {displayedValue}
              </h2>

              <p className="mt-2 text-xs font-medium text-smart-secondary">

                {stat.title === "Total Students" &&
                selectedBlockData
                  ? `Students in ${selectedBlock}`
                  : stat.title === "Occupancy Rate" &&
                      selectedBlockData
                    ? `${totalOccupied} of ${totalBeds} beds`
                    : stat.change}

              </p>

            </Card>
          );
        })}

      </div>


      <div className="grid gap-6 xl:grid-cols-2">

        {/* Occupancy Chart */}

        <Card>

          <div className="mb-6 flex items-start justify-between">

            <div>

              <h2 className="text-lg font-bold text-smart-primary">
                Hostel Occupancy
              </h2>

              <p className="mt-1 text-sm text-smart-secondary">
                {selectedBlock === "all"
                  ? "Overall occupied and available beds"
                  : `${selectedBlock} occupied and available beds`}
              </p>

            </div>

            <div className="rounded-xl bg-smart-teal/10 p-3 text-smart-teal">
              <BedDouble size={22} />
            </div>

          </div>

          <div className="h-72 w-full">

            <ResponsiveContainer
              width="100%"
              height="100%"
            >

              <BarChart
                data={filteredOccupancyData}
              >

                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                />

                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                />

                <YAxis
                  tickLine={false}
                  axisLine={false}
                />

                <Tooltip />

                <Legend />

                <Bar
                  dataKey="occupied"
                  name="Occupied Beds"
                  fill="#1686d4"
                  radius={[5, 5, 0, 0]}
                />

                <Bar
                  dataKey="available"
                  name="Available Beds"
                  fill="#06b6d4"
                  radius={[5, 5, 0, 0]}
                />

              </BarChart>

            </ResponsiveContainer>

          </div>

        </Card>

        {/* Revenue Chart */}

        <Card>

          <div className="mb-6 flex items-start justify-between">

            <div>

              <h2 className="text-lg font-bold text-smart-primary">
                Revenue & Expenses
              </h2>

              <p className="mt-1 text-sm text-smart-secondary">
                {selectedBlock === "all"
                  ? "Overall financial performance"
                  : `${selectedBlock} financial performance`}
              </p>

            </div>

            <div className="rounded-xl bg-smart-success/10 p-3 text-smart-success">
              <Wallet size={22} />
            </div>

          </div>

          <div className="h-72 w-full">

            <ResponsiveContainer
              width="100%"
              height="100%"
            >

              <LineChart
                data={filteredRevenueData}
              >

                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                />

                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                />

                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) =>
                    `${(
                      value / 1000000
                    ).toFixed(1)}M`
                  }
                />

                <Tooltip
                  formatter={(value) =>
                    `Rs. ${Number(
                      value
                    ).toLocaleString()}`
                  }
                />

                <Legend />

                <Line
                  type="monotone"
                  dataKey="revenue"
                  name="Revenue"
                  stroke="#1686d4"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                />

                <Line
                  type="monotone"
                  dataKey="expenses"
                  name="Expenses"
                  stroke="#f59e0b"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                />

              </LineChart>

            </ResponsiveContainer>

          </div>

        </Card>

      </div>



      <div className="grid gap-6 xl:grid-cols-2">



        <Card>

          <div className="mb-4">

            <h2 className="text-lg font-bold text-smart-primary">
              Complaint Analysis
            </h2>

            <p className="mt-1 text-sm text-smart-secondary">
              {selectedBlock === "all"
                ? "Complaints by service category"
                : `${selectedBlock} complaints by service category`}
            </p>

          </div>

          <div className="h-72 w-full">

            <ResponsiveContainer
              width="100%"
              height="100%"
            >

              <PieChart>

                <Pie
                  data={currentComplaintData}
                  dataKey="count"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  innerRadius={55}
                  paddingAngle={3}
                >

                  {currentComplaintData.map(
                    (entry, index) => (
                      <Cell
                        key={entry.category}
                        fill={
                          complaintColors[
                            index %
                              complaintColors.length
                          ]
                        }
                      />
                    )
                  )}

                </Pie>

                <Tooltip />

                <Legend />

              </PieChart>

            </ResponsiveContainer>

          </div>

        </Card>


        <Card>

          <div className="mb-6">

            <h2 className="text-lg font-bold text-smart-primary">
              Block-wise Occupancy
            </h2>

            <p className="mt-1 text-sm text-smart-secondary">
              Bed utilization by hostel block
            </p>

          </div>

          <div className="mb-6 rounded-xl bg-smart-background p-4">

            <p className="text-sm text-smart-secondary">

              {selectedBlock === "all"
                ? "Overall occupancy"
                : `${selectedBlock} occupancy`}

            </p>

            <div className="mt-1 flex items-end justify-between">

              <h3 className="text-3xl font-bold text-smart-primary">
                {occupancyPercentage}%
              </h3>

              <Badge variant="teal">
                {totalOccupied}/{totalBeds} beds
              </Badge>

            </div>

            <div className="mt-4 h-3 overflow-hidden rounded-full bg-black/5">

              <div
                className="h-full rounded-full bg-smart-blue transition-all"
                style={{
                  width: `${occupancyPercentage}%`,
                }}
              />

            </div>

          </div>

          <div className="space-y-5">

            {filteredBlocks.map(
              (block) => {

                const percentage = (
                  (block.occupied /
                    block.total) *
                  100
                ).toFixed(1);

                return (
                  <div key={block.block}>

                    <div className="mb-2 flex items-center justify-between">

                      <span className="text-sm font-semibold text-smart-primary">
                        {block.block}
                      </span>

                      <span className="text-sm text-smart-secondary">
                        {block.occupied}/
                        {block.total} beds
                      </span>

                    </div>

                    <div className="h-2.5 overflow-hidden rounded-full bg-black/5">

                      <div
                        className="h-full rounded-full bg-smart-teal transition-all"
                        style={{
                          width: `${percentage}%`,
                        }}
                      />

                    </div>

                    <p className="mt-1 text-right text-xs text-smart-secondary">
                      {percentage}% occupied
                    </p>

                  </div>
                );
              }
            )}

          </div>

        </Card>

      </div>


      <Card>

        <div className="mb-6 flex items-center justify-between">

          <div>

            <h2 className="text-lg font-bold text-smart-primary">
              Recent Activity
            </h2>

            <p className="mt-1 text-sm text-smart-secondary">
              Latest hostel management updates
            </p>

          </div>

          <Badge variant="info">
            Demo Data
          </Badge>

        </div>

        <div className="divide-y divide-black/5">

          {recentActivity.map(
            (activity, index) => {

              const Icon =
                activityIcons[
                  activity.type
                ];

              return (
                <div
                  key={index}
                  className="flex items-center gap-4 py-4"
                >

                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-smart-blue/10 text-smart-blue">
                    <Icon size={20} />
                  </div>

                  <div className="min-w-0 flex-1">

                    <p className="font-semibold text-smart-primary">
                      {activity.title}
                    </p>

                    <p className="mt-1 text-sm text-smart-secondary">
                      {activity.description}
                    </p>

                  </div>

                  <span className="shrink-0 text-xs text-smart-secondary">
                    {activity.time}
                  </span>

                </div>
              );
            }
          )}

        </div>

      </Card>

    </div>
  );
}

export default AnalyticsDashboard;