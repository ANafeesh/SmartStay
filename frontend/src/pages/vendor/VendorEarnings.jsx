import {
  Wallet,
  TrendingUp,
  ShoppingBag,
  CircleDollarSign,
  ArrowUpRight,
  CalendarDays,
} from "lucide-react";

import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";

const revenueHistory = [
  { month: "May", revenue: 18500 },
  { month: "Jun", revenue: 21300 },
  { month: "Jul", revenue: 24700 },
  { month: "Aug", revenue: 26400 },
  { month: "Sep", revenue: 24800 },
];

const recentTransactions = [
  {
    id: "#ORD-1024",
    customer: "Kamal Perera",
    item: "Chicken Rice & Curry",
    amount: 900,
    status: "Completed",
    date: "Sep 25, 2026",
  },
  {
    id: "#ORD-1023",
    customer: "Ahamed Nafeesh",
    item: "Chicken Burger",
    amount: 650,
    status: "Completed",
    date: "Sep 25, 2026",
  },
  {
    id: "#ORD-1022",
    customer: "Mohamed Rizwan",
    item: "Cheese Pizza",
    amount: 850,
    status: "Completed",
    date: "Sep 24, 2026",
  },
  {
    id: "#ORD-1021",
    customer: "Fathima Azeez",
    item: "Fresh Fruit Juice",
    amount: 500,
    status: "Completed",
    date: "Sep 24, 2026",
  },
  {
    id: "#ORD-1020",
    customer: "Irfan Mohamed",
    item: "Vegetable Roti",
    amount: 540,
    status: "Completed",
    date: "Sep 23, 2026",
  },
];

const statusVariant = {
  Completed: "success",
  Pending: "warning",
};

function VendorEarnings() {
  const maxRevenue = Math.max(...revenueHistory.map((item) => item.revenue));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <p className="text-sm font-medium text-smart-blue">Vendor Management</p>

        <h1 className="mt-1 text-3xl font-bold text-smart-primary">
          Earnings & Revenue
        </h1>

        <p className="mt-2 text-sm text-smart-secondary">
          Track your sales, revenue and completed transactions.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-smart-secondary">Total Revenue</p>
              <h2 className="mt-2 text-2xl font-bold text-smart-primary">
                Rs. 84,500
              </h2>

              <div className="mt-2 flex items-center gap-1 text-xs font-medium text-smart-success">
                <TrendingUp size={14} />
                <span>12.5% this month</span>
              </div>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-smart-blue/10 text-smart-blue">
              <Wallet size={21} />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-smart-secondary">This Month</p>

              <h2 className="mt-2 text-2xl font-bold text-smart-primary">
                Rs. 24,800
              </h2>

              <p className="mt-2 text-xs text-smart-secondary">
                September 2026
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-smart-teal/10 text-smart-teal">
              <CircleDollarSign size={21} />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-smart-secondary">Total Orders</p>

              <h2 className="mt-2 text-2xl font-bold text-smart-primary">
                128
              </h2>

              <p className="mt-2 text-xs text-smart-secondary">
                Completed orders
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-smart-warning/10 text-smart-warning">
              <ShoppingBag size={21} />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-smart-secondary">Average Order</p>

              <h2 className="mt-2 text-2xl font-bold text-smart-primary">
                Rs. 660
              </h2>

              <p className="mt-2 text-xs text-smart-secondary">
                Per completed order
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-smart-success/10 text-smart-success">
              <ArrowUpRight size={21} />
            </div>
          </div>
        </Card>
      </div>

      {/* Revenue History */}
      <Card>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-bold text-smart-primary">
              Revenue History
            </h2>

            <p className="mt-1 text-sm text-smart-secondary">
              Monthly revenue performance
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-xl bg-smart-background px-4 py-2 text-sm text-smart-secondary">
            <CalendarDays size={17} />
            <span>Last 5 months</span>
          </div>
        </div>

        <div className="mt-8 space-y-5">
          {revenueHistory.map((item) => {
            const percentage = (item.revenue / maxRevenue) * 100;

            return (
              <div key={item.month}>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="font-medium text-smart-primary">
                    {item.month} 2026
                  </span>

                  <span className="font-semibold text-smart-primary">
                    Rs. {item.revenue.toLocaleString()}
                  </span>
                </div>

                <div className="h-3 overflow-hidden rounded-full bg-smart-background">
                  <div
                    className="h-full rounded-full bg-smart-blue transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Recent Transactions */}
      <Card padding="p-0">
        <div className="border-b border-black/5 p-6">
          <h2 className="text-lg font-bold text-smart-primary">
            Recent Transactions
          </h2>

          <p className="mt-1 text-sm text-smart-secondary">
            Your latest completed orders
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="border-b border-black/5 bg-smart-background/50 text-left">
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-smart-secondary">
                  Order
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-smart-secondary">
                  Customer
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-smart-secondary">
                  Item
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-smart-secondary">
                  Date
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-smart-secondary">
                  Amount
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-smart-secondary">
                  Status
                </th>
              </tr>
            </thead>

            <tbody>
              {recentTransactions.map((transaction) => (
                <tr
                  key={transaction.id}
                  className="border-b border-black/5 last:border-b-0 hover:bg-smart-background/30"
                >
                  <td className="px-6 py-4 text-sm font-semibold text-smart-primary">
                    {transaction.id}
                  </td>

                  <td className="px-6 py-4 text-sm text-smart-secondary">
                    {transaction.customer}
                  </td>

                  <td className="px-6 py-4 text-sm text-smart-secondary">
                    {transaction.item}
                  </td>

                  <td className="px-6 py-4 text-sm text-smart-secondary">
                    {transaction.date}
                  </td>

                  <td className="px-6 py-4 text-sm font-semibold text-smart-primary">
                    Rs. {transaction.amount.toLocaleString()}
                  </td>

                  <td className="px-6 py-4">
                    <Badge variant={statusVariant[transaction.status]}>
                      {transaction.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

export default VendorEarnings;
