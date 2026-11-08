# Appendices and Academic Screenshot Checklist

## Appendix A: Complete API Endpoint Catalogue Summary

The SmartStay system exposes **125 distinct RESTful API endpoints** across 23 modular route definitions:

| Domain Group | Route Prefix | Total Endpoints | Key Functional Responsibilities |
| :--- | :--- | :--- | :--- |
| **Authentication & Profiles** | `/api/auth` | 6 | Login, registration, token refresh, password changes, and profile management |
| **Residential Infrastructure** | `/api/buildings`, `/api/rooms`, `/api/beds` | 15 | Physical campus building blocks, room inventory, and bed-level capacity tracking |
| **Room Allocation & Transfers** | `/api/allocations`, `/api/transfers` | 12 | Student room assignment contracts, checkout processing, and transfer petitions |
| **Security & Gate Turnstiles** | `/api/digital-passes`, `/api/gate-logs` | 12 | Cryptographic 256-bit QR pass issuance, camera verification, turnstile logs, and anti-passback |
| **Leave & Disciplinary Cases** | `/api/leave-requests`, `/api/violations`, `/api/visitors` | 18 | Overnight leave requests, curfew violation tracking, and campus visitor logs |
| **Canteen Menus & Food Orders** | `/api/menus`, `/api/food-orders`, `/api/delivery-slots` | 13 | Pre-order meal catalog, scheduled delivery windows, and live kitchen tickets |
| **Vendor Operations & Gate Passes**| `/api/vendors`, `/api/vendor-passes` | 15 | Commercial canteen profiles, daily earnings, and courier delivery gate passes |
| **Financial Operations & Invoicing**| `/api/bills`, `/api/payments`, `/api/receipts`, `/api/payment-notifications` | 20 | Invoices, two-factor OTP settlements, verifiable digital receipts, and billing notifications |
| **Maintenance & Facilities** | `/api/complaints` | 4 | Defect ticket submission, Cloudinary image upload, and technician assignment |
| **Smart Monitoring & Analytics**| `/api/monitoring`, `/api/analytics` | 10 | Utility telemetry ingestion (Water & Electricity) and executive analytics aggregations |
| **Total Verified API Endpoints**| | **125** | |

---

## Appendix B: Sample Request and Response Payloads

### B.1 User Authentication (`POST /api/auth/login`)
* **Request Payload**:
  ```json
  {
    "email": "student@smartstay.com",
    "password": "Password123!"
  }
  ```
* **Success Response (HTTP 200 OK)**:
  ```json
  {
    "success": true,
    "message": "Authentication successful.",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "6aafe35dc5e56a9f84d1ca40",
      "name": "Ahamed Nafeesh",
      "email": "student@smartstay.com",
      "role": "student",
      "registrationNumber": "STD-2026-101",
      "room": "Room 101",
      "building": "Block A"
    }
  }
  ```

### B.2 Digital Pass Dynamic QR Verification (`POST /api/digital-passes/verify`)
* **Request Payload**:
  ```json
  {
    "qrToken": "uV82_XyZ90QwertYuIoP-asdfGHjklZXCVBnm12345678"
  }
  ```
* **Success Response (HTTP 200 OK)**:
  ```json
  {
    "success": true,
    "authorized": true,
    "passNumber": "SP-2026-884920",
    "student": {
      "name": "Ahamed Nafeesh",
      "registrationId": "STD-2026-101",
      "room": "Room 101",
      "building": "Block A",
      "status": "Active"
    },
    "suggestedDirection": "OUT",
    "hasActiveLeave": false,
    "validUntil": "2026-08-30T18:00:00.000Z"
  }
  ```

### B.3 Turnstile Consecutive Movement Conflict (`POST /api/gate-logs`)
* **Request Payload**:
  ```json
  {
    "qrToken": "uV82_XyZ90QwertYuIoP-asdfGHjklZXCVBnm12345678",
    "direction": "OUT",
    "gateName": "Main Gate Turnstile 01"
  }
  ```
* **Error Response (HTTP 409 Conflict)**:
  ```json
  {
    "success": false,
    "message": "Consecutive duplicate movement detected. Student is already logged as OUT.",
    "code": "CONSECUTIVE_DUPLICATE_MOVEMENT",
    "inconsistencyId": "6b12f45ec89123ab45cde789"
  }
  ```

### B.4 Food Order Placement (`POST /api/food-orders`)
* **Request Payload**:
  ```json
  {
    "vendorId": "VND-2026-01",
    "deliverySlotId": "651a2b3c4d5e6f7a8b9c0d1e",
    "deliveryLocation": "Hostel Block A Foyer",
    "items": [
      { "itemId": "ITEM-01", "name": "Crispy Chicken Burger & Fries", "price": 950, "quantity": 1 },
      { "itemId": "ITEM-04", "name": "Iced Caramel Macchiato", "price": 450, "quantity": 1 }
    ],
    "paymentMethod": "Campus Digital Wallet"
  }
  ```
* **Success Response (HTTP 201 Created)**:
  ```json
  {
    "success": true,
    "message": "Food order successfully placed and transmitted to vendor kitchen queue.",
    "order": {
      "orderNo": "ORD-179386",
      "vendor": "Campus Diner & Cafe",
      "totalAmount": 1400,
      "status": "Placed",
      "timeSlot": "Lunch Delivery: 12:30 PM - 01:15 PM"
    }
  }
  ```

---

## Appendix C: Safe Environment Configuration Template

Save the following file as `.env` inside the `backend/` directory:

```env
# ==========================================
# SMARTSTAY BACKEND ENVIRONMENT TEMPLATE
# ==========================================

# Server Network Configuration
PORT=5000
NODE_ENV=development

# MongoDB Connection String (Local or Cloud Atlas)
MONGO_URI=mongodb://localhost:27017/smartstay_db

# Cryptographic Token Secret (HMAC-SHA256)
JWT_SECRET=replace_with_a_secure_256_bit_random_hex_key

# Third-Party Cloud CDN (Media & Photo Uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name_here
CLOUDINARY_API_KEY=your_api_key_here
CLOUDINARY_API_SECRET=your_api_secret_here

# Outbound Email SMTP Gateway (OTPs & Official Alerts)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@institution.edu.lk
EMAIL_PASS=your_smtp_app_password_here
```

---

## Appendix D: Academic Report Screenshot Checklist

The table below catalogs the exact high-resolution UI screenshots required for insertion into the final academic project report. Each entry details the target page, authorized user role, key UI elements to emphasize, and the formal figure caption.

| Screenshot ID | Page / Route | User Role | Required Visual Elements to Capture | Report Figure Caption |
| :--- | :--- | :--- | :--- | :--- |
| **FIG-01** | `/login` (AuthPortal) | Public / All | Clean split-screen authentication portal with logo branding, institutional credentials form, role selection, and security badges. | *Figure 4.1: Unified Institutional Authentication Portal.* |
| **FIG-02** | `/student/dashboard` | Student | Student welcome banner, quick action cards (Pass, Room, Food, Payments), active notices, and meal pre-order shortcuts. | *Figure 4.2: Student Self-Service Primary Dashboard.* |
| **FIG-03** | `/student/pass` | Student | Active Digital Security Pass showing dynamic QR code canvas, validity timer, student registration details, and animated validity badge. | *Figure 4.3: Cryptographically Generated Student Digital QR Pass.* |
| **FIG-04** | `/student/my-room` | Student | Room profile screen displaying assigned hostel block, room number, bed identifier, allocated amenities, and roommate roster. | *Figure 4.4: Student Room Allocation and Resident Profile Interface.* |
| **FIG-05** | `/student/marketplace` | Student | Campus canteen marketplace with meal category filters (Halal, Veg, Spicy), meal cards with prices in LKR, and active order drawer. | *Figure 4.5: Campus Food Pre-Ordering Marketplace with Dietary Filters.* |
| **FIG-06** | `/student/payments` | Student | Financial portal displaying pending hostel invoices, payment history, two-factor OTP verification modal, and downloadable receipt cards. | *Figure 4.6: Student Fee Invoicing and Two-Factor OTP Payment Settlement.* |
| **FIG-07** | `/student/complaints` | Student | Defect ticket submission form with trade categories, priority tags, Cloudinary photo dropzone, and active ticket status tracker. | *Figure 4.7: Facility Maintenance Defect Logging and Photographic Evidence Submission.* |
| **FIG-08** | `/security/scanner` | Security Officer | Optical camera turnstile scanner viewport (`html5-qrcode`), real-time decoded student metadata card, suggested direction button, and simulation test controls. | *Figure 4.8: Perimeter Gate Turnstile QR Camera Verification Scanner.* |
| **FIG-09** | `/security/dashboard` | Security Officer | Gate security dashboard displaying live perimeter headcount, today's entry/exit counts, active visitors, and recent curfew alerts. | *Figure 4.9: Campus Perimeter Security and Turnstile Movement Operations Center.* |
| **FIG-10** | `/security/visitors` | Security Officer | Campus visitor log detailing external guest check-ins, National Identity Card (NIC) entries, host student references, and check-out buttons. | *Figure 4.10: External Visitor and Campus Guest Physical Movement Registry.* |
| **FIG-11** | `/admin/dashboard` | Admin / Warden | Administrative operations dashboard featuring campus occupancy rates, financial dues summary, pending complaints, and security metrics. | *Figure 4.11: Hostel Administrative Management and Operations Control Center.* |
| **FIG-12** | `/admin/rooms` | Admin / Warden | Room inventory management grid with capacity filters, room status badges (`Available`, `Occupied`, `Maintenance`), and bed allocation modals. | *Figure 4.12: Physical Room and Bed Capacity Inventory Administration.* |
| **FIG-13** | `/admin/hostel-map` | Admin / Warden | Interactive visual floor plan of residential blocks illustrating room occupancy density and capacity bottlenecks across floors. | *Figure 4.13: Interactive Architectural Hostel Room and Bed Allocation Map.* |
| **FIG-14** | `/admin/analytics` | Admin / Executive | Cross-domain analytics suite featuring Recharts graphs for occupancy trends, revenue collection velocity, and utility telemetry trends. | *Figure 4.14: Executive Operational Analytics and Key Performance Indicator Visualizations.* |
| **FIG-15** | `/admin/monitoring` | Admin / Executive | Smart utility telemetry interface displaying real-time water (L) and electricity (kWh) consumption metrics, block comparisons, and leak alerts. | *Figure 4.15: Smart Campus Utility Telemetry and Resource Consumption Monitoring.* |
| **FIG-16** | `/vendor/dashboard` | Vendor Operator | Commercial canteen operations portal displaying daily food revenue in LKR, active kitchen queue counts, and delivery capacity gauge. | *Figure 4.16: Commercial Canteen Vendor Operations and Daily Revenue Dashboard.* |
| **FIG-17** | `/vendor/food-items` | Vendor Operator | Food menu catalog manager showing meal SKUs, pricing, dietary flags, and real-time stock availability toggles (`In Stock` / `Sold Out`). | *Figure 4.17: Canteen Menu Catalog and Real-Time Inventory Stock Management.* |
| **FIG-18** | `/vendor/orders` | Vendor Operator | Live Kitchen Order Ticket (KOT) queue categorizing incoming student orders into `Placed`, `Preparing`, `Out for Delivery`, and `Delivered`. | *Figure 4.18: Synchronized Live Kitchen Order Queue and Ticket Processing Pipeline.* |
| **FIG-19** | `/vendor/profile` | Vendor Operator | Commercial vendor profile showing campus outlet registration, proprietor info, operating hours, emergency kitchen hotline, and courier details. | *Figure 4.19: Commercial Vendor Business Registration and Delivery Operations Profile.* |
| **FIG-20** | `/vendor/pass` | Vendor Operator | Courier delivery gate pass displaying rider NIC, authorized delivery vehicle plate, approved drop-off zones, and security QR pass. | *Figure 4.20: Commercial Courier Delivery Turnstile Gate Security Pass.* |
| **FIG-21** | `/maintenance/dashboard`| Maintenance Staff | Work order task board filtering pending repair tickets by trade specialty (Electrical, Plumbing) and urgency ratings with field notes modal. | *Figure 4.21: Facility Maintenance Staff Work Order Execution and Resolution Workbench.* |

