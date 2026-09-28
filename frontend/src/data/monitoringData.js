export const monitoringSummary = [
  {
    title: "Water Usage Today",
    value: "2,450 L",
    limit: "Daily limit: 3,000 L",
    percentage: 82,
    type: "water",
  },
  {
    title: "Electricity Today",
    value: "1,820 kWh",
    limit: "Daily limit: 2,000 kWh",
    percentage: 91,
    type: "electricity",
  },
  {
    title: "Active Alerts",
    value: "4",
    limit: "2 critical, 2 warnings",
    percentage: 0,
    type: "alerts",
  },
  {
    title: "System Status",
    value: "Operational",
    limit: "Monitoring is active",
    percentage: 100,
    type: "system",
  },
];

export const blockMonitoring = [
  {
    block: "Block A",
    water: 720,
    electricity: 580,
    waterLimit: 1000,
    electricityLimit: 700,
    status: "Normal",
  },
  {
    block: "Block B",
    water: 950,
    electricity: 820,
    waterLimit: 1000,
    electricityLimit: 900,
    status: "Warning",
  },
  {
    block: "Block C",
    water: 780,
    electricity: 420,
    waterLimit: 1000,
    electricityLimit: 700,
    status: "Normal",
  },
];

export const initialAlerts = [
  {
    id: "ALT001",
    title: "High Electricity Consumption",
    description: "Block B has reached 91% of its daily electricity limit.",
    block: "Block B",
    category: "Electricity",
    severity: "Critical",
    time: "10:30 AM",
    status: "Active",
  },
  {
    id: "ALT002",
    title: "High Water Consumption",
    description: "Water usage in Block B is approaching the daily limit.",
    block: "Block B",
    category: "Water",
    severity: "Warning",
    time: "11:15 AM",
    status: "Active",
  },
  {
    id: "ALT003",
    title: "Electricity Usage Warning",
    description: "Block A electricity consumption is above normal levels.",
    block: "Block A",
    category: "Electricity",
    severity: "Warning",
    time: "12:10 PM",
    status: "Active",
  },
  {
    id: "ALT004",
    title: "Water Supply Check",
    description: "Water tank level requires inspection.",
    block: "Block C",
    category: "Water",
    severity: "Critical",
    time: "01:00 PM",
    status: "Active",
  },
];

export const monitoringHistory = [
  { time: "08:00 AM", water: 500, electricity: 320 },
  { time: "10:00 AM", water: 850, electricity: 680 },
  { time: "12:00 PM", water: 1200, electricity: 950 },
  { time: "02:00 PM", water: 1650, electricity: 1250 },
  { time: "04:00 PM", water: 2050, electricity: 1500 },
  { time: "06:00 PM", water: 2450, electricity: 1820 },
];