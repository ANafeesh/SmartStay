import {
  CreditCard,
  Wallet,
  Clock3,
  CheckCircle2,
  ArrowUpRight,
} from "lucide-react";

import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";

const bills = [
  {
    title: "September Hostel Fee",
    date: "Due Sep 30, 2026",
    amount: "Rs. 8,000",
    status: "Pending",
  },
  {
    title: "Utility Charge",
    date: "Sep 20, 2026",
    amount: "Rs. 2,500",
    status: "Paid",
  },
  {
    title: "Semester Fee",
    date: "Sep 15, 2026",
    amount: "Rs. 2,000",
    status: "Paid",
  },
];

function Payments() {
  return (
    <div className="mx-auto max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <p className="text-sm font-semibold text-smart-blue">Finance</p>

        <h1 className="mt-1 text-3xl font-bold text-smart-primary">
          Payments & Bills
        </h1>

        <p className="mt-2 text-smart-secondary">
          Manage your hostel payments, bills and payment history.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          title="Total Outstanding"
          value="Rs. 8,000"
          icon={Wallet}
          variant="blue"
        />

        <SummaryCard
          title="Paid This Month"
          value="Rs. 4,500"
          icon={CheckCircle2}
          variant="green"
        />

        <SummaryCard
          title="Pending Bills"
          value="01"
          icon={Clock3}
          variant="orange"
        />

        <SummaryCard
          title="Total Bills"
          value="03"
          icon={CreditCard}
          variant="teal"
        />
      </div>

      {/* Current Payment */}
      <Card className="mt-6">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <div>
            <Badge variant="warning">Payment Pending</Badge>

            <h2 className="mt-3 text-xl font-bold text-smart-primary">
              September Hostel Fee
            </h2>

            <p className="mt-1 text-sm text-smart-secondary">
              Due date: September 30, 2026
            </p>
          </div>

          <div className="flex items-center gap-5">
            <div className="text-right">
              <p className="text-sm text-smart-secondary">Amount</p>

              <p className="text-2xl font-bold text-smart-primary">Rs. 8,000</p>
            </div>

            <Button size="lg">Pay Now</Button>
          </div>
        </div>
      </Card>

      {/* Payment History */}
      <Card className="mt-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-smart-primary">
              Payment History
            </h2>

            <p className="mt-1 text-sm text-smart-secondary">
              Your recent bills and transactions.
            </p>
          </div>

          <button className="hidden items-center gap-1 text-sm font-semibold text-smart-blue hover:text-smart-primary sm:flex">
            View All
            <ArrowUpRight size={16} />
          </button>
        </div>

        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="border-b border-black/5 text-left text-sm text-smart-secondary">
                <th className="pb-4 font-medium">Bill</th>
                <th className="pb-4 font-medium">Date</th>
                <th className="pb-4 font-medium">Amount</th>
                <th className="pb-4 font-medium">Status</th>
                <th className="pb-4 text-right font-medium">Action</th>
              </tr>
            </thead>

            <tbody>
              {bills.map((bill) => (
                <tr
                  key={bill.title}
                  className="border-b border-black/5 last:border-0"
                >
                  <td className="py-5 font-semibold text-smart-primary">
                    {bill.title}
                  </td>

                  <td className="py-5 text-sm text-smart-secondary">
                    {bill.date}
                  </td>

                  <td className="py-5 font-semibold text-smart-primary">
                    {bill.amount}
                  </td>

                  <td className="py-5">
                    <Badge
                      variant={bill.status === "Paid" ? "success" : "warning"}
                    >
                      {bill.status}
                    </Badge>
                  </td>

                  <td className="py-5 text-right">
                    {bill.status === "Paid" ? (
                      <button className="text-sm font-semibold text-smart-blue hover:text-smart-primary">
                        Receipt
                      </button>
                    ) : (
                      <Button size="sm">Pay Now</Button>
                    )}
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

function SummaryCard({ title, value, icon: Icon, variant }) {
  const styles = {
    blue: "bg-smart-blue/10 text-smart-blue",
    green: "bg-smart-success/10 text-smart-success",
    orange: "bg-smart-warning/10 text-smart-warning",
    teal: "bg-smart-teal/10 text-smart-teal",
  };

  return (
    <Card>
      <div
        className={`flex h-12 w-12 items-center justify-center rounded-xl ${styles[variant]}`}
      >
        <Icon size={24} />
      </div>

      <p className="mt-5 text-sm text-smart-secondary">{title}</p>

      <p className="mt-1 text-2xl font-bold text-smart-primary">{value}</p>
    </Card>
  );
}

export default Payments;
