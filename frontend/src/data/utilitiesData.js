
export const utilitySummary = [
  {
    title: "Water Consumption",
    value: "12,450 L",
    change: "8.2%",
    status: "warning",
  },
  {
    title: "Electricity Usage",
    value: "8,240 kWh",
    change: "4.5%",
    status: "success",
  },
  {
    title: "Utility Expenses",
    value: "Rs. 245,000",
    change: "6.8%",
    status: "warning",
  },
  {
    title: "Food Orders",
    value: "1,248",
    change: "12.5%",
    status: "success",
  },
];

// Demonstration data for all 12 months.
export const utilityData = [
  { month: "Apr", water: 9800, electricity: 6500 },
  { month: "May", water: 10500, electricity: 7200 },
  { month: "Jun", water: 11200, electricity: 7500 },
  { month: "Jul", water: 10800, electricity: 7100 },
  { month: "Aug", water: 11900, electricity: 7900 },
  { month: "Sep", water: 12450, electricity: 8240 },
  { month: "Oct", water: 12100, electricity: 8050 },
  { month: "Nov", water: 11800, electricity: 7900 },
  { month: "Dec", water: 11000, electricity: 7600 },
  { month: "Jan", water: 11500, electricity: 7800 },
  { month: "Feb", water: 12200, electricity: 8100 },
  { month: "Mar", water: 12700, electricity: 8350 },
];

export const foodOrderData = [
  { month: "Apr", orders: 820, revenue: 164000 },
  { month: "May", orders: 950, revenue: 190000 },
  { month: "Jun", orders: 1100, revenue: 220000 },
  { month: "Jul", orders: 980, revenue: 196000 },
  { month: "Aug", orders: 1180, revenue: 236000 },
  { month: "Sep", orders: 1248, revenue: 249600 },
  { month: "Oct", orders: 1210, revenue: 242000 },
  { month: "Nov", orders: 1160, revenue: 232000 },
  { month: "Dec", orders: 1300, revenue: 260000 },
  { month: "Jan", orders: 1250, revenue: 250000 },
  { month: "Feb", orders: 1340, revenue: 268000 },
  { month: "Mar", orders: 1400, revenue: 280000 },
];

export const popularMeals = [
  { name: "Chicken Rice", orders: 420 },
  { name: "Vegetable Rice", orders: 310 },
  { name: "Kottu", orders: 250 },
  { name: "String Hoppers", orders: 180 },
  { name: "Fried Rice", orders: 150 },
];

export const foodOrders = [
  {
    id: "FO001",
    student: "Ahmed Nafeesh",
    meal: "Chicken Rice",
    block: "A",
    amount: 450,
    status: "Delivered",
  },
  {
    id: "FO002",
    student: "Mohamed Izni",
    meal: "Kottu",
    block: "B",
    amount: 650,
    status: "Preparing",
  },
  {
    id: "FO003",
    student: "Fathima Ayesha",
    meal: "Vegetable Rice",
    block: "C",
    amount: 350,
    status: "Pending",
  },
  {
    id: "FO004",
    student: "Mohamed Rifas",
    meal: "Fried Rice",
    block: "A",
    amount: 550,
    status: "Delivered",
  },
  {
    id: "FO005",
    student: "Ahamed Safwan",
    meal: "String Hoppers",
    block: "B",
    amount: 300,
    status: "Cancelled",
  },
];
