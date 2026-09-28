import {
  CreditCard,
  Wallet,
  Clock3,
  CheckCircle2,
  ArrowUpRight,
  CalendarDays,
  Receipt,
  CircleDollarSign,
} from "lucide-react";

import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";

const bills = [
  {
    id: "BILL-2026-001",
    title: "September Hostel Fee",
    date: "Sep 30, 2026",
    amount: 8000,
    status: "Pending",
  },
  {
    id: "BILL-2026-002",
    title: "Utility Charge",
    date: "Sep 20, 2026",
    amount: 2500,
    status: "Paid",
  },
  {
    id: "BILL-2026-003",
    title: "Semester Fee",
    date: "Sep 15, 2026",
    amount: 2000,
    status: "Paid",
  },
];

const paymentHistory = [
  {
    id: "PAY-2026-008",
    bill: "Utility Charge",
    date: "Sep 20, 2026",
    amount: 2500,
    method: "Online Payment",
    status: "Paid",
  },
  {
    id: "PAY-2026-007",
    bill: "Semester Fee",
    date: "Sep 15, 2026",
    amount: 2000,
    method: "Online Payment",
    status: "Paid",
  },
  {
    id: "PAY-2026-006",
    bill: "August Hostel Fee",
    date: "Aug 30, 2026",
    amount: 8000,
    method: "Online Payment",
    status: "Paid",
  },
];

function Payments() {
  const pendingBill = bills.find((bill) => bill.status === "Pending");

  const totalOutstanding = bills
    .filter((bill) => bill.status === "Pending")
    .reduce((total, bill) => total + bill.amount, 0);

  const paidThisMonth = bills
    .filter((bill) => bill.status === "Paid")
    .reduce((total, bill) => total + bill.amount, 0);

  const pendingBills = bills.filter((bill) => bill.status === "Pending").length;

  const formatCurrency = (amount) => {
    return `Rs. ${amount.toLocaleString()}`;
  };

  const handlePayment = (billTitle) => {
    alert(
      `Payment gateway will be connected later.\n\nSelected bill: ${billTitle}`,
    );
  };

  const handleReceipt = (paymentId) => {
    alert(
      `Receipt generation will be connected to the backend later.\n\nPayment ID: ${paymentId}`,
    );
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Header */}
      <div>
        <p className="text-sm font-semibold text-smart-blue">Finance</p>

        <h1 className="mt-1 text-2xl font-bold text-smart-primary sm:text-3xl">
          Payments & Bills
        </h1>

        <p className="mt-2 text-sm text-smart-secondary">
          Manage your hostel payments, bills and payment history.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          title="Total Outstanding"
          value={formatCurrency(totalOutstanding)}
          description="Amount you need to pay"
          icon={Wallet}
          variant="blue"
        />

        <SummaryCard
          title="Paid This Month"
          value={formatCurrency(paidThisMonth)}
          description="Successfully paid"
          icon={CheckCircle2}
          variant="green"
        />

        <SummaryCard
          title="Pending Bills"
          value={String(pendingBills).padStart(2, "0")}
          description="Need your attention"
          icon={Clock3}
          variant="orange"
        />

        <SummaryCard
          title="Total Bills"
          value={String(bills.length).padStart(2, "0")}
          description="Bills in your account"
          icon={CreditCard}
          variant="teal"
        />
      </div>

      {/* Outstanding Payment */}
      {pendingBill && (
        <Card className="border-l-4 border-l-smart-warning">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-smart-warning/10 text-smart-warning">
                <CircleDollarSign size={24} />
              </div>

              <div>
                <Badge variant="warning">Payment Pending</Badge>

                <h2 className="mt-3 text-xl font-bold text-smart-primary">
                  {pendingBill.title}
                </h2>

                <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-smart-secondary">
                  <span className="flex items-center gap-1.5">
                    <CalendarDays size={15} />
                    Due {pendingBill.date}
                  </span>

                  <span>Bill ID: {pendingBill.id}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="sm:text-right">
                <p className="text-sm text-smart-secondary">Amount Due</p>

                <p className="text-2xl font-bold text-smart-primary">
                  {formatCurrency(pendingBill.amount)}
                </p>
              </div>

              <Button
                size="lg"
                onClick={() => handlePayment(pendingBill.title)}
              >
                Pay Now
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* All Bills */}
      <Card padding="p-0">
        <div className="border-b border-black/5 p-6">
          <div>
            <h2 className="text-xl font-bold text-smart-primary">My Bills</h2>

            <p className="mt-1 text-sm text-smart-secondary">
              View all your current hostel and service bills.
            </p>
          </div>
        </div>

        <div className="divide-y divide-black/5">
          {bills.map((bill) => (
            <div
              key={bill.id}
              className="flex flex-col gap-4 p-6 transition hover:bg-smart-background/40 lg:flex-row lg:items-center lg:justify-between"
            >
              <div className="flex items-start gap-4">
                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                    bill.status === "Paid"
                      ? "bg-smart-success/10 text-smart-success"
                      : "bg-smart-warning/10 text-smart-warning"
                  }`}
                >
                  {bill.status === "Paid" ? (
                    <CheckCircle2 size={21} />
                  ) : (
                    <CreditCard size={21} />
                  )}
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold text-smart-primary">
                      {bill.title}
                    </h3>

                    <Badge
                      variant={bill.status === "Paid" ? "success" : "warning"}
                    >
                      {bill.status}
                    </Badge>
                  </div>

                  <p className="mt-1 text-sm text-smart-secondary">{bill.id}</p>

                  <p className="mt-1 text-xs text-smart-secondary">
                    {bill.status === "Pending" ? "Due" : "Paid on"} {bill.date}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between gap-6 sm:justify-end">
                <div className="text-left sm:text-right">
                  <p className="text-xs text-smart-secondary">Amount</p>

                  <p className="mt-1 font-bold text-smart-primary">
                    {formatCurrency(bill.amount)}
                  </p>
                </div>

                {bill.status === "Pending" ? (
                  <Button size="sm" onClick={() => handlePayment(bill.title)}>
                    Pay Now
                  </Button>
                ) : (
                  <button
                    onClick={() => handleReceipt(bill.id)}
                    className="flex items-center gap-2 rounded-xl border border-smart-primary px-4 py-2 text-sm font-semibold text-smart-primary transition hover:bg-smart-primary hover:text-white"
                  >
                    <Receipt size={16} />
                    Receipt
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Payment History */}
      <Card padding="p-0">
        <div className="flex flex-col gap-3 border-b border-black/5 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-bold text-smart-primary">
              Payment History
            </h2>

            <p className="mt-1 text-sm text-smart-secondary">
              Your recent successful payments and transactions.
            </p>
          </div>

          <button className="flex items-center gap-1 text-sm font-semibold text-smart-blue transition hover:text-smart-primary">
            View All
            <ArrowUpRight size={16} />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead>
              <tr className="border-b border-black/5 bg-smart-background/50 text-left">
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-smart-secondary">
                  Payment ID
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-smart-secondary">
                  Bill
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-smart-secondary">
                  Date
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-smart-secondary">
                  Method
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-smart-secondary">
                  Amount
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-smart-secondary">
                  Status
                </th>

                <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-smart-secondary">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {paymentHistory.map((payment) => (
                <tr
                  key={payment.id}
                  className="border-b border-black/5 last:border-0 transition hover:bg-smart-background/30"
                >
                  <td className="px-6 py-4 text-sm font-semibold text-smart-primary">
                    {payment.id}
                  </td>

                  <td className="px-6 py-4 text-sm text-smart-primary">
                    {payment.bill}
                  </td>

                  <td className="px-6 py-4 text-sm text-smart-secondary">
                    {payment.date}
                  </td>

                  <td className="px-6 py-4 text-sm text-smart-secondary">
                    {payment.method}
                  </td>

                  <td className="px-6 py-4 text-sm font-semibold text-smart-primary">
                    {formatCurrency(payment.amount)}
                  </td>

                  <td className="px-6 py-4">
                    <Badge variant="success">{payment.status}</Badge>
                  </td>

                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleReceipt(payment.id)}
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-smart-blue transition hover:text-smart-primary"
                    >
                      <Receipt size={16} />
                      Receipt
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Payment Information */}
      <div className="rounded-2xl border border-smart-blue/10 bg-smart-blue/5 p-5">
        <div className="flex items-start gap-3">
          <CreditCard size={20} className="mt-0.5 shrink-0 text-smart-blue" />

          <div>
            <h3 className="font-semibold text-smart-primary">
              Payment Information
            </h3>

            <p className="mt-1 text-sm leading-6 text-smart-secondary">
              Online payment and receipt generation will be connected to the
              SmartStay backend and payment gateway during the backend
              development phase.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function SummaryCard({ title, value, description, icon: Icon, variant }) {
  const styles = {
    blue: "bg-smart-blue/10 text-smart-blue",
    green: "bg-smart-success/10 text-smart-success",
    orange: "bg-smart-warning/10 text-smart-warning",
    teal: "bg-smart-teal/10 text-smart-teal",
  };

  return (
    <Card className="transition duration-200 hover:-translate-y-1 hover:shadow-md">
      <div
        className={`flex h-12 w-12 items-center justify-center rounded-xl ${styles[variant]}`}
      >
        <Icon size={24} />
      </div>

      <p className="mt-5 text-sm font-medium text-smart-secondary">{title}</p>

      <p className="mt-1 text-2xl font-bold text-smart-primary">{value}</p>

      <p className="mt-1 text-xs text-smart-secondary">{description}</p>
    </Card>
  );
}

export default Payments;
