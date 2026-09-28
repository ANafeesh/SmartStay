import {
  ShoppingBag,
  Utensils,
  Clock,
  Wallet,
  ArrowUpRight,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

import { Link } from "react-router-dom";

import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";

function VendorDashboard() {
  const stats = [
    {
      title: "Total Orders",
      value: "128",
      description: "This month",
      icon: ShoppingBag,
      color: "text-smart-blue",
      bg: "bg-smart-blue/10",
    },
    {
      title: "Food Items",
      value: "24",
      description: "Active items",
      icon: Utensils,
      color: "text-smart-teal",
      bg: "bg-smart-teal/10",
    },
    {
      title: "Pending Orders",
      value: "08",
      description: "Need attention",
      icon: Clock,
      color: "text-smart-warning",
      bg: "bg-smart-warning/10",
    },
    {
      title: "Total Revenue",
      value: "Rs. 84,500",
      description: "This month",
      icon: Wallet,
      color: "text-smart-success",
      bg: "bg-smart-success/10",
    },
  ];

  const recentOrders = [
    {
      id: "#ORD-1024",
      customer: "Kamal Perera",
      item: "Chicken Rice & Curry",
      amount: "Rs. 450",
      status: "Preparing",
    },
    {
      id: "#ORD-1023",
      customer: "Ahamed Nafeesh",
      item: "Chicken Burger",
      amount: "Rs. 650",
      status: "Ready",
    },
    {
      id: "#ORD-1022",
      customer: "Mohamed Rizwan",
      item: "Cheese Pizza",
      amount: "Rs. 850",
      status: "Completed",
    },
    {
      id: "#ORD-1021",
      customer: "Fathima Azeez",
      item: "Fresh Fruit Juice",
      amount: "Rs. 250",
      status: "Pending",
    },
  ];

  const statusVariant = {
    Preparing: "warning",
    Ready: "teal",
    Completed: "success",
    Pending: "info",
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <p className="text-sm font-medium text-smart-teal">Vendor Management</p>

        <h1 className="mt-1 text-2xl font-bold text-smart-primary sm:text-3xl">
          Vendor Dashboard
        </h1>

        <p className="mt-2 text-sm text-smart-secondary">
          Manage your food items, orders, and earnings from one place.
        </p>
      </div>

      {/* Statistics */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <Card
              key={stat.title}
              className="transition duration-200 hover:-translate-y-1 hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-smart-secondary">
                    {stat.title}
                  </p>

                  <h2 className="mt-2 text-2xl font-bold text-smart-primary">
                    {stat.value}
                  </h2>

                  <p className="mt-1 text-xs text-smart-secondary">
                    {stat.description}
                  </p>
                </div>

                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.bg} ${stat.color}`}
                >
                  <Icon size={23} />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Main Content */}
      <div className="grid gap-6 xl:grid-cols-3">
        {/* Recent Orders */}
        <Card className="xl:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-smart-primary">
                Recent Orders
              </h2>

              <p className="mt-1 text-sm text-smart-secondary">
                Latest orders from students
              </p>
            </div>

            <Link
              to="/vendor/orders"
              className="flex items-center gap-1 text-sm font-semibold text-smart-blue transition hover:text-smart-primary"
            >
              View All
              <ArrowUpRight size={16} />
            </Link>
          </div>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[650px]">
              <thead>
                <tr className="border-b border-black/5 text-left">
                  <th className="pb-3 text-xs font-semibold uppercase tracking-wide text-smart-secondary">
                    Order
                  </th>

                  <th className="pb-3 text-xs font-semibold uppercase tracking-wide text-smart-secondary">
                    Customer
                  </th>

                  <th className="pb-3 text-xs font-semibold uppercase tracking-wide text-smart-secondary">
                    Item
                  </th>

                  <th className="pb-3 text-xs font-semibold uppercase tracking-wide text-smart-secondary">
                    Amount
                  </th>

                  <th className="pb-3 text-xs font-semibold uppercase tracking-wide text-smart-secondary">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody>
                {recentOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b border-black/5 last:border-0 transition hover:bg-smart-background/40"
                  >
                    <td className="py-4 text-sm font-semibold text-smart-primary">
                      {order.id}
                    </td>

                    <td className="py-4 text-sm text-smart-secondary">
                      {order.customer}
                    </td>

                    <td className="py-4 text-sm text-smart-primary">
                      {order.item}
                    </td>

                    <td className="py-4 text-sm font-semibold text-smart-primary">
                      {order.amount}
                    </td>

                    <td className="py-4">
                      <Badge variant={statusVariant[order.status]}>
                        {order.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Vendor Status */}
        <Card>
          <h2 className="text-lg font-bold text-smart-primary">
            Vendor Status
          </h2>

          <p className="mt-1 text-sm text-smart-secondary">
            Your current vendor account information
          </p>

          <div className="mt-6 space-y-4">
            {/* Verification */}
            <div className="flex items-center gap-4 rounded-xl bg-smart-success/10 p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-smart-success/20 text-smart-success">
                <CheckCircle size={21} />
              </div>

              <div>
                <p className="text-sm font-semibold text-smart-primary">
                  Verified Vendor
                </p>

                <p className="text-xs text-smart-secondary">
                  Your vendor account is verified
                </p>
              </div>
            </div>

            {/* Vendor Name */}
            <div className="rounded-xl bg-smart-background p-4">
              <p className="text-xs font-medium text-smart-secondary">
                Vendor Name
              </p>

              <p className="mt-1 font-semibold text-smart-primary">
                Campus Kitchen
              </p>
            </div>

            {/* Vendor ID */}
            <div className="rounded-xl bg-smart-background p-4">
              <p className="text-xs font-medium text-smart-secondary">
                Vendor ID
              </p>

              <p className="mt-1 font-semibold text-smart-primary">VEN-00124</p>
            </div>

            {/* Pass Expiry */}
            <div className="flex items-start gap-3 rounded-xl bg-smart-warning/10 p-4">
              <AlertCircle
                size={20}
                className="mt-0.5 shrink-0 text-smart-warning"
              />

              <div>
                <p className="text-sm font-semibold text-smart-primary">
                  Pass Expiry
                </p>

                <p className="mt-1 text-xs text-smart-secondary">
                  Your campus access pass expires on December 31, 2026.
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <h2 className="text-lg font-bold text-smart-primary">Quick Actions</h2>

        <p className="mt-1 text-sm text-smart-secondary">
          Quickly manage your vendor activities.
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Add Food Item */}
          <Link
            to="/vendor/food-items"
            className="group rounded-xl border border-black/5 bg-smart-background p-4 text-left transition duration-200 hover:-translate-y-1 hover:bg-smart-blue/10 hover:shadow-sm"
          >
            <Utensils
              className="text-smart-teal transition group-hover:scale-110"
              size={22}
            />

            <p className="mt-3 font-semibold text-smart-primary">
              Add Food Item
            </p>

            <p className="mt-1 text-xs text-smart-secondary">
              Add a new food item to your menu
            </p>
          </Link>

          {/* Manage Orders */}
          <Link
            to="/vendor/orders"
            className="group rounded-xl border border-black/5 bg-smart-background p-4 text-left transition duration-200 hover:-translate-y-1 hover:bg-smart-blue/10 hover:shadow-sm"
          >
            <ShoppingBag
              className="text-smart-blue transition group-hover:scale-110"
              size={22}
            />

            <p className="mt-3 font-semibold text-smart-primary">
              Manage Orders
            </p>

            <p className="mt-1 text-xs text-smart-secondary">
              View and update student orders
            </p>
          </Link>

          {/* View Earnings */}
          <Link
            to="/vendor/earnings"
            className="group rounded-xl border border-black/5 bg-smart-background p-4 text-left transition duration-200 hover:-translate-y-1 hover:bg-smart-blue/10 hover:shadow-sm"
          >
            <Wallet
              className="text-smart-success transition group-hover:scale-110"
              size={22}
            />

            <p className="mt-3 font-semibold text-smart-primary">
              View Earnings
            </p>

            <p className="mt-1 text-xs text-smart-secondary">
              Check your sales and earnings
            </p>
          </Link>

          {/* Vendor Pass */}
          <Link
            to="/vendor/pass"
            className="group rounded-xl border border-black/5 bg-smart-background p-4 text-left transition duration-200 hover:-translate-y-1 hover:bg-smart-blue/10 hover:shadow-sm"
          >
            <CheckCircle
              className="text-smart-teal transition group-hover:scale-110"
              size={22}
            />

            <p className="mt-3 font-semibold text-smart-primary">Vendor Pass</p>

            <p className="mt-1 text-xs text-smart-secondary">
              View your campus access pass
            </p>
          </Link>
        </div>
      </Card>
    </div>
  );
}

export default VendorDashboard;
