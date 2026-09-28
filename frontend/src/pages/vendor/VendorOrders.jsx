import { useState } from "react";
import {
  Search,
  ShoppingBag,
  Clock,
  CheckCircle,
  ChefHat,
  PackageCheck,
} from "lucide-react";

import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";

function VendorOrders() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [orders, setOrders] = useState([
    {
      id: "#ORD-1024",
      customer: "Kamal Perera",
      item: "Chicken Rice & Curry",
      quantity: 2,
      amount: 900,
      date: "Sep 25, 2026",
      status: "Pending",
    },
    {
      id: "#ORD-1023",
      customer: "Ahamed Nafeesh",
      item: "Chicken Burger",
      quantity: 1,
      amount: 650,
      date: "Sep 25, 2026",
      status: "Preparing",
    },
    {
      id: "#ORD-1022",
      customer: "Mohamed Rizwan",
      item: "Cheese Pizza",
      quantity: 1,
      amount: 850,
      date: "Sep 24, 2026",
      status: "Ready",
    },
    {
      id: "#ORD-1021",
      customer: "Fathima Azeez",
      item: "Fresh Fruit Juice",
      quantity: 2,
      amount: 500,
      date: "Sep 24, 2026",
      status: "Completed",
    },
    {
      id: "#ORD-1020",
      customer: "Irfan Mohamed",
      item: "Vegetable Roti",
      quantity: 3,
      amount: 540,
      date: "Sep 23, 2026",
      status: "Completed",
    },
  ]);

  const statusOptions = ["All", "Pending", "Preparing", "Ready", "Completed"];

  const statusVariant = {
    Pending: "info",
    Preparing: "warning",
    Ready: "teal",
    Completed: "success",
  };

  const statusIcon = {
    Pending: Clock,
    Preparing: ChefHat,
    Ready: PackageCheck,
    Completed: CheckCircle,
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(search.toLowerCase()) ||
      order.customer.toLowerCase().includes(search.toLowerCase()) ||
      order.item.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "All" || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const updateOrderStatus = (id, newStatus) => {
    setOrders((previousOrders) =>
      previousOrders.map((order) =>
        order.id === id ? { ...order, status: newStatus } : order,
      ),
    );
  };

  const counts = {
    All: orders.length,
    Pending: orders.filter((order) => order.status === "Pending").length,
    Preparing: orders.filter((order) => order.status === "Preparing").length,
    Ready: orders.filter((order) => order.status === "Ready").length,
    Completed: orders.filter((order) => order.status === "Completed").length,
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <p className="text-sm font-medium text-smart-teal">Vendor Management</p>

        <h1 className="mt-1 text-2xl font-bold text-smart-primary sm:text-3xl">
          Orders
        </h1>

        <p className="mt-2 text-sm text-smart-secondary">
          View and manage orders placed by students.
        </p>
      </div>

      {/* Order Statistics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <div className="flex items-center gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-smart-blue/10 text-smart-blue">
              <ShoppingBag size={21} />
            </div>

            <div>
              <p className="text-sm text-smart-secondary">Total Orders</p>

              <p className="text-2xl font-bold text-smart-primary">
                {counts.All}
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-smart-warning/10 text-smart-warning">
              <Clock size={21} />
            </div>

            <div>
              <p className="text-sm text-smart-secondary">Pending</p>

              <p className="text-2xl font-bold text-smart-primary">
                {counts.Pending}
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-smart-teal/10 text-smart-teal">
              <ChefHat size={21} />
            </div>

            <div>
              <p className="text-sm text-smart-secondary">Preparing</p>

              <p className="text-2xl font-bold text-smart-primary">
                {counts.Preparing}
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-smart-success/10 text-smart-success">
              <CheckCircle size={21} />
            </div>

            <div>
              <p className="text-sm text-smart-secondary">Completed</p>

              <p className="text-2xl font-bold text-smart-primary">
                {counts.Completed}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Search */}
      <Card padding="p-4">
        <div className="relative">
          <Search
            size={20}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-smart-secondary"
          />

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search order ID, customer, or food..."
            className="w-full rounded-xl bg-smart-background py-3 pl-12 pr-4 text-sm outline-none focus:ring-2 focus:ring-smart-blue/20"
          />
        </div>
      </Card>

      {/* Status Filters */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {statusOptions.map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
              statusFilter === status
                ? "bg-smart-primary text-white"
                : "bg-white text-smart-secondary hover:bg-smart-background"
            }`}
          >
            {status}

            <span className="ml-2 opacity-70">{counts[status]}</span>
          </button>
        ))}
      </div>

      {/* Orders Table */}
      <Card>
        <div className="mb-6">
          <h2 className="text-lg font-bold text-smart-primary">Order List</h2>

          <p className="mt-1 text-sm text-smart-secondary">
            {filteredOrders.length} order
            {filteredOrders.length !== 1 ? "s" : ""} found
          </p>
        </div>

        {filteredOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-smart-blue/10 text-smart-blue">
              <ShoppingBag size={26} />
            </div>

            <h3 className="mt-4 font-bold text-smart-primary">
              No orders found
            </h3>

            <p className="mt-1 text-sm text-smart-secondary">
              Try changing your search or status filter.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[950px]">
              <thead>
                <tr className="border-b border-black/5 text-left">
                  <th className="pb-3 text-xs font-semibold uppercase text-smart-secondary">
                    Order
                  </th>

                  <th className="pb-3 text-xs font-semibold uppercase text-smart-secondary">
                    Customer
                  </th>

                  <th className="pb-3 text-xs font-semibold uppercase text-smart-secondary">
                    Food Item
                  </th>

                  <th className="pb-3 text-xs font-semibold uppercase text-smart-secondary">
                    Qty
                  </th>

                  <th className="pb-3 text-xs font-semibold uppercase text-smart-secondary">
                    Amount
                  </th>

                  <th className="pb-3 text-xs font-semibold uppercase text-smart-secondary">
                    Date
                  </th>

                  <th className="pb-3 text-xs font-semibold uppercase text-smart-secondary">
                    Status
                  </th>

                  <th className="pb-3 text-right text-xs font-semibold uppercase text-smart-secondary">
                    Update
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredOrders.map((order) => {
                  const StatusIcon = statusIcon[order.status];

                  return (
                    <tr
                      key={order.id}
                      className="border-b border-black/5 last:border-0"
                    >
                      <td className="py-4 text-sm font-bold text-smart-primary">
                        {order.id}
                      </td>

                      <td className="py-4 text-sm text-smart-secondary">
                        {order.customer}
                      </td>

                      <td className="py-4 text-sm font-medium text-smart-primary">
                        {order.item}
                      </td>

                      <td className="py-4 text-sm text-smart-secondary">
                        {order.quantity}
                      </td>

                      <td className="py-4 text-sm font-semibold text-smart-primary">
                        Rs. {order.amount.toLocaleString()}
                      </td>

                      <td className="py-4 text-sm text-smart-secondary">
                        {order.date}
                      </td>

                      <td className="py-4">
                        <Badge variant={statusVariant[order.status]}>
                          <span className="flex items-center gap-1.5">
                            <StatusIcon size={13} />
                            {order.status}
                          </span>
                        </Badge>
                      </td>

                      <td className="py-4 text-right">
                        <select
                          value={order.status}
                          onChange={(e) =>
                            updateOrderStatus(order.id, e.target.value)
                          }
                          className="rounded-lg border border-black/10 bg-white px-2.5 py-2 text-xs font-medium text-smart-primary outline-none focus:border-smart-blue"
                        >
                          <option>Pending</option>
                          <option>Preparing</option>
                          <option>Ready</option>
                          <option>Completed</option>
                        </select>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}

export default VendorOrders;
