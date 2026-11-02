/**
 * SmartStay Demo Accounts & Role Definitions
 *
 * NOTE: SmartStay backend does not provide server-side authentication.
 * All accounts listed here are strictly FRONTEND-ONLY DEMO PERSONAS designed
 * for academic evaluation, testing, and interface demonstration.
 */

export const DEMO_ROLES = {
  STUDENT: "student",
  WARDEN: "warden",
  MAINTENANCE: "maintenance",
  VENDOR: "vendor",
  EXECUTIVE: "executive",
};

export const DEMO_ACCOUNTS = [
  {
    roleKey: "student",
    roleName: "Undergraduate Student",
    roleBadge: "Student Account",
    badgeColor: "info",
    name: "Ahamed Nafeesh",
    initials: "AN",
    email: "nafeesh@campus.edu",
    username: "nafeesh",
    demoPassword: "password123",
    studentId: "STD-2026-090",
    room: "Block B - Room 204",
    bed: "Bed 02",
    building: "Olu Block",
    faculty: "Faculty of Applied Sciences",
    department: "Information & Communication Technology",
    phone: "+94 77 123 4567",
    defaultPath: "/dashboard",
    description: "Access personal hostel room, bill payments, bursary receipts, food ordering, and maintenance complaints.",
    accessiblePortals: [
      { name: "Student Dashboard", path: "/dashboard" },
      { name: "Payments & Invoices", path: "/payments" },
      { name: "My Room Allocation", path: "/room" },
      { name: "Complaints & Requests", path: "/complaints" },
      { name: "Food Marketplace", path: "/marketplace" },
    ],
  },
  {
    roleKey: "warden",
    roleName: "Hostel Warden / Administrator",
    roleBadge: "Administrative Authority",
    badgeColor: "success",
    name: "Dr. K. Perera",
    initials: "KP",
    email: "warden@campus.edu",
    username: "warden_perera",
    demoPassword: "password123",
    studentId: "ADM-WARDEN-01",
    room: "Chief Warden Office, Hall 101",
    bed: "N/A",
    building: "Administrative Complex",
    faculty: "Hostel Administration Directorate",
    department: "Student Accommodation Affairs",
    phone: "+94 71 987 6543",
    defaultPath: "/hostel",
    description: "Manage hostel buildings, floor rooms, bed capacities, student allocations, room transfers, and occupancy tracking.",
    accessiblePortals: [
      { name: "Hostel Management Hub", path: "/hostel" },
      { name: "Building Management", path: "/hostel/buildings" },
      { name: "Rooms & Bed Inventory", path: "/hostel/rooms" },
      { name: "Student Allocations", path: "/hostel/allocations" },
      { name: "Room Transfers", path: "/hostel/transfers" },
      { name: "Live Occupancy", path: "/hostel/occupancy" },
    ],
  },
  {
    roleKey: "maintenance",
    roleName: "Maintenance Staff / Technician",
    roleBadge: "Technical Staff",
    badgeColor: "warning",
    name: "R. S. Wickramasinghe",
    initials: "RW",
    email: "maintenance@campus.edu",
    username: "tech_wickrama",
    demoPassword: "password123",
    studentId: "TECH-MNT-2026",
    room: "Central Maintenance Workshop",
    bed: "N/A",
    building: "Hostel Services Block",
    faculty: "University Works Department",
    department: "Electrical & Plumbing Division",
    phone: "+94 75 456 7890",
    defaultPath: "/maintenance",
    description: "Review maintenance complaints, update work order status, inspect electrical/water faults, and log resolution times.",
    accessiblePortals: [
      { name: "Maintenance Overview", path: "/maintenance" },
      { name: "Submit / Inspect Complaint", path: "/maintenance/submit-complaint" },
      { name: "Telemetry & Utilities", path: "/utilities" },
      { name: "Notifications Center", path: "/notifications-center" },
    ],
  },
  {
    roleKey: "vendor",
    roleName: "Canteen Vendor / Food Operator",
    roleBadge: "Approved Vendor",
    badgeColor: "teal",
    name: "Campus Bites Canteen",
    initials: "CB",
    email: "vendor@campusbites.edu",
    username: "campus_bites",
    demoPassword: "password123",
    studentId: "VND-2026-08",
    room: "Stall #03, Central Student Canteen",
    bed: "N/A",
    building: "Main Cafeteria Complex",
    faculty: "Commercial Services Directorate",
    department: "Canteen Operations",
    phone: "+94 70 333 4455",
    defaultPath: "/vendor/dashboard",
    description: "Manage food menu items, fulfill live orders, manage pickup crowd delivery slots, verify digital gate passes, and track revenue.",
    accessiblePortals: [
      { name: "Vendor Operations Hub", path: "/vendor/dashboard" },
      { name: "Food Menu Items", path: "/vendor/food-items" },
      { name: "Live Food Orders", path: "/vendor/orders" },
      { name: "Digital QR Gate Pass", path: "/vendor/pass" },
      { name: "Earnings & Settlements", path: "/vendor/earnings" },
    ],
  },
  {
    roleKey: "executive",
    roleName: "Executive & Analytics Viewer",
    roleBadge: "Executive Oversight",
    badgeColor: "info",
    name: "Prof. M. H. Razak",
    initials: "MR",
    email: "executive@campus.edu",
    username: "dean_razak",
    demoPassword: "password123",
    studentId: "EXEC-DEAN-05",
    room: "Dean's Secretariat, Level 3",
    bed: "N/A",
    building: "Senate Building",
    faculty: "Campus Executive Council",
    department: "University Resource Intelligence",
    phone: "+94 76 888 9900",
    defaultPath: "/analytics",
    description: "Comprehensive university analytics: campus occupancy rate, fee collection reconciliation, utility consumption, and SLA compliance.",
    accessiblePortals: [
      { name: "Executive Analytics Hub", path: "/analytics" },
      { name: "Audit Reports & CSV Export", path: "/reports" },
      { name: "Utility Analytics", path: "/utilities" },
      { name: "Smart IoT Monitoring", path: "/monitoring" },
      { name: "Campus Occupancy", path: "/hostel/occupancy" },
    ],
  },
];

/**
 * Helper to fetch a demo profile by its role key (case-insensitive)
 */
export function getDemoAccount(roleKey) {
  if (!roleKey) return DEMO_ACCOUNTS[0];
  const normalized = roleKey.toString().toLowerCase().trim();
  if (normalized === "admin") return DEMO_ACCOUNTS[1]; // Alias 'admin' to warden
  return DEMO_ACCOUNTS.find((acc) => acc.roleKey === normalized) || DEMO_ACCOUNTS[0];
}
