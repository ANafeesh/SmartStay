# SmartStay — Smart Hostel and Co-Living Management System

SmartStay is a modern web application designed to digitize and streamline hostel operations, student accommodation management, perimeter security, campus dining, maintenance ticketing, and utility monitoring.

Developed for **SWT22022: Practical for Internet Application Development**, Faculty of Technology, South Eastern University of Sri Lanka.

---

## Table of Contents
1. [Project Overview](#1-project-overview)
2. [Project Objectives](#2-project-objectives)
3. [Main Functional Modules](#3-main-functional-modules)
4. [User Roles and Permissions](#4-user-roles-and-permissions)
5. [Technology Stack](#5-technology-stack)
6. [System Architecture](#6-system-architecture)
7. [Project Folder Structure](#7-project-folder-structure)
8. [Prerequisites](#8-prerequisites)
9. [Installation and Setup Guide](#9-installation-and-setup-guide)
10. [Environment Configuration](#10-environment-configuration)
11. [API Documentation Overview](#11-api-documentation-overview)
12. [Database Overview](#12-database-overview)
13. [Testing and Quality Assurance](#13-testing-and-quality-assurance)
14. [Build and Deployment](#14-build-and-deployment)
15. [Security and Privacy](#15-security-and-privacy)
16. [Individual Group Contributions](#16-individual-group-contributions)
17. [Limitations and Future Enhancements](#17-limitations-and-future-enhancements)
18. [Project Team](#18-project-team)
19. [Course and Academic Submission Information](#19-course-and-academic-submission-information)
20. [Final Submission Checklist](#20-final-submission-checklist)

---

## 1. Project Overview

University hostels in Sri Lanka frequently rely on paper-based management: handwritten logbooks at security gates, manual room allocation sheets, paper leave forms, offline payment receipts, and uncoordinated meal queues at campus canteens. These manual processes often result in administrative bottlenecks, untracked perimeter movements, delayed maintenance repairs, and inaccurate occupancy tracking.

**SmartStay** solves these challenges by providing a unified, full-stack digital platform:
* **Students** can access a personal dashboard to view room assignments, generate dynamic QR gate passes, pre-order canteen meals, settle fees with two-factor OTP verification, submit maintenance tickets with defect photos, and request room transfers.
* **Wardens and Administrators** manage buildings, rooms, and bed capacity, approve room transfers and leave requests, inspect maintenance tickets, and monitor overall occupancy.
* **Security Officers** scan digital QR passes using an optical camera via WebRTC, log turnstile movements, check anti-passback violations, record curfew breaches, and log external visitors.
* **Canteen Vendors** manage food menus, toggle item availability, review incoming orders in a live kitchen queue, track daily earnings, and issue courier passes for gate access.
* **Maintenance Staff** review assigned repair tasks, update ticket statuses, and log resolution notes.
* **University Executives** access consolidated analytics on occupancy, utility consumption trends (power and water), and financial collections.

---

## 2. Project Objectives

1. **Hostel & Room Management**: Digitize building, room, and bed inventory with automatic occupancy updates and room transfer handling.
2. **Student Security & Digital Pass**: Provide dynamic, cryptographically hashed QR passes with camera scanning, consecutive duplicate movement rejection, and automatic curfew enforcement.
3. **Catering & Invoicing**: Streamline meal ordering with delivery time slots, live kitchen order tickets, two-factor OTP payment settlement, and verifiable digital receipts.
4. **Maintenance & Student Services**: Implement defect ticketing with Cloudinary photo uploads, trade triage, technician dispatching, and resolution auditing.
5. **Monitoring & Analytics**: Deliver cross-module analytics dashboards with responsive charts for occupancy, utility telemetry (water and electricity), and revenue collection.

---

## 3. Main Functional Modules

The system is organized into five major functional modules developed collaboratively by the student group.

### Module 1: Smart Hostel and Room Management
* **Assigned Member**: A. Kanesalingam
* **Purpose**: Manages residential buildings, rooms, bed capacity, student allocations, and room transfer requests.
* **Implemented Features**:
  - Building and room inventory management with floor and capacity limits.
  - Granular bed-level tracking (`Available`, `Occupied`, `Maintenance`) with automatic occupancy state cascading.
  - Formal student room allocation contracts and checkout processing.
  - Student room transfer workflow with urgency levels and warden approval states.
  - Interactive hostel layout map visualizing floor-by-floor occupancy density.
* **Relevant Frontend Pages**: `admin/Rooms.jsx`, `admin/HostelMap.jsx`, `student/MyRoom.jsx`, `admin/Allocations.jsx`, `admin/Transfers.jsx`.
* **Relevant Backend Artifacts**:
  - Controllers: `roomController.js`, `bedController.js`, `buildingController.js`, `allocationController.js`, `transferController.js`.
  - Models: `Building.js`, `Room.js`, `Bed.js`, `Allocation.js`, `Transfer.js`.
  - Routes: `/api/buildings`, `/api/rooms`, `/api/beds`, `/api/allocations`, `/api/transfers`.
* **Status**: **Fully Implemented**.

---

### Module 2: Student Security and Digital Pass
* **Assigned Member**: M. H. U. Hafrath
* **Purpose**: Handles student access control, digital pass lifecycle, turnstile movement tracking, curfew compliance, and visitor logs.
* **Implemented Features**:
  - 256-bit cryptographic token generation (`crypto.randomBytes`) with SHA-256 token hashing (`tokenHash`).
  - Dynamic QR code generation with validity countdown and status badges (`Active`, `Suspended`, `Revoked`, `OnLeave`).
  - Real-time optical camera scanning using `html5-qrcode` via WebRTC stream (`navigator.mediaDevices`), along with evaluation test controls.
  - Anti-passback movement validation preventing consecutive duplicate movements (`IN` when already `IN`, or `OUT` when already `OUT`) with `GateInconsistency` logging.
  - Local timezone evaluation (`Asia/Colombo`) to automatically record curfew infractions after 22:00 (10:00 PM).
  - Overnight leave application and automated leave completion on gate re-entry.
  - External visitor registry with National Identity Card (NIC) verification.
* **Relevant Frontend Pages**: `student/Pass.jsx`, `security/GateScanner.jsx`, `security/SecurityDashboard.jsx`, `security/VisitorLog.jsx`, `admin/Passes.jsx`, `admin/Violations.jsx`.
* **Relevant Backend Artifacts**:
  - Controllers: `digitalPassController.js`, `gateLogController.js`, `leaveRequestController.js`, `visitorController.js`, `violationController.js`.
  - Models: `DigitalPass.js`, `GateEntryExit.js`, `GateInconsistency.js`, `LeaveRequest.js`, `Visitor.js`, `HostelViolation.js`.
  - Routes: `/api/digital-passes`, `/api/gate-logs`, `/api/leave-requests`, `/api/visitors`, `/api/violations`.
* **Status**: **Fully Implemented**.

---

### Module 3: Payments, Food and Marketplace
* **Assigned Member**: Ahamed Nafeesh
* **Purpose**: Digitizes canteen meal pre-ordering, kitchen order dispatch, commercial vendor management, student fee invoicing, and receipts.
* **Implemented Features**:
  - Campus food marketplace with meal filtering by dietary tag (`Halal`, `Vegetarian`, `Spicy`).
  - Delivery time slot scheduling (`DeliverySlot.js`) to prevent lobby crowding.
  - Live Kitchen Order Ticket (KOT) queue categorizing orders into `Placed`, `Preparing`, `Out for Delivery`, and `Delivered`.
  - Vendor menu and inventory management with real-time stock toggles (`available: true/false`).
  - Commercial vendor profiles with operating hours, emergency hotlines, and delivery gate passes (`VendorPass.js`).
  - Semester fee invoicing, two-factor OTP payment verification via Nodemailer SMTP, and verifiable digital receipts (`Receipt.js`).
* **Relevant Frontend Pages**: `student/Marketplace.jsx`, `student/Payments.jsx`, `vendor/VendorDashboard.jsx`, `vendor/FoodItems.jsx`, `vendor/VendorOrders.jsx`, `vendor/VendorProfile.jsx`, `vendor/VendorPass.jsx`, `vendor/VendorEarnings.jsx`.
* **Relevant Backend Artifacts**:
  - Controllers: `foodOrderController.js`, `vendorPassController.js`, `paymentController.js`, `billController.js`, `catalogController.js`.
  - Models: `Vendor.js`, `MenuItem.js`, `DeliverySlot.js`, `FoodOrder`, `VendorPass.js`, `Bill.js`, `Payment.js`, `PaymentOtp.js`, `Receipt.js`.
  - Routes: `/api/menus`, `/api/food-orders`, `/api/delivery-slots`, `/api/vendors`, `/api/vendor-passes`, `/api/bills`, `/api/payments`, `/api/receipts`.
* **Status**: **Fully Implemented**.

---

### Module 4: Maintenance, Complaints and Student Services
* **Assigned Member**: A. Dhusanthika
* **Purpose**: Manages facilities maintenance reporting, defect image uploads, technician assignments, and repair resolution.
* **Implemented Features**:
  - Maintenance defect submission specifying building, floor, room number, trade category, and priority (`Low`, `Medium`, `High`, `Critical`).
  - Cloudinary CDN integration for damage photo uploads via Multer multipart storage.
  - Administrative technician assignment and work status transitions (`Pending` -> `In Progress` -> `Resolved` -> `Rejected`).
  - Maintenance technician workbench displaying assigned tasks and resolution note logging.
* **Relevant Frontend Pages**: `student/Complaints.jsx`, `admin/Complaints.jsx`, `maintenance/MaintenanceDashboard.jsx`, `maintenance/TaskDetails.jsx`.
* **Relevant Backend Artifacts**:
  - Controllers: `complaintController.js`.
  - Models: `Complaint.js`.
  - Routes: `/api/complaints`.
* **Status**: **Fully Implemented**.

---

### Module 5: Smart Monitoring and Analytics
* **Assigned Member**: M. I. M. Izni
* **Purpose**: Provides operational intelligence, cross-collection KPI aggregation, utility consumption telemetry, and interactive data visualizations.
* **Implemented Features**:
  - Executive and administrative dashboards displaying room occupancy rates, revenue metrics, pending tickets, and active security alerts.
  - Occupancy calculations by campus block and room tier.
  - Financial collection reports and monthly cash flow trajectories.
  - Smart utility telemetry ingestion for Water (Liters) and Electricity (Kilowatt-hours).
  - 24-hour and 7-day sliding trend calculations with consumption anomaly and pipe leak alerts.
  - Interactive visual charts rendered using Recharts (Area, Bar, Pie, and Line charts).
  - Synchronization between student marketplace pre-orders and the live vendor kitchen queue.
* **Relevant Frontend Pages**: `admin/Dashboard.jsx`, `admin/Analytics.jsx`, `executive/ExecutiveDashboard.jsx`, `admin/Monitoring.jsx`.
* **Relevant Backend Artifacts**:
  - Controllers: `analyticsController.js`, `monitoringController.js`.
  - Models: `MonitoringReading.js` (and cross-collection aggregations).
  - Routes: `/api/analytics`, `/api/monitoring`.
* **Status**: **Fully Implemented** *(Utility telemetry ingestion and analytics dashboards are fully operational; physical IoT hardware meters are currently simulated via software telemetry endpoints)*.

---

## 4. User Roles and Permissions

SmartStay supports **9 distinct user roles** with strict Role-Based Access Control (RBAC) enforced in `backend/middleware/authMiddleware.js`:

| Role | Accessible Areas | Key Permissions |
| :--- | :--- | :--- |
| **student** | Student Portal (`/student/*`) | View room allocation, generate digital QR pass, browse food marketplace, place food orders, pay invoices with OTP, submit complaints with photos, apply for room transfers and overnight leave. |
| **admin / hostel_admin** | Admin Portal (`/admin/*`) | Full administrative oversight: room/bed CRUD, student allocations, room transfer approvals, pass status updates, violation logging, complaint assignments, analytics dashboards. Superuser bypass. |
| **warden** | Warden Portal (`/admin/*`) | Review room transfers, approve/reject student leave, evaluate disciplinary violations, assign maintenance tasks, inspect occupancy. |
| **sub_warden** | Floor Oversight (`/admin/*`) | Assist in student welfare, inspect floor maintenance issues, view resident rosters. |
| **security / security_officer** | Security Gate Portal (`/security/*`) | Operate WebRTC camera turnstile scanner, verify QR passes, log entry/exit movements, record curfew breaches, register external visitors. |
| **vendor** | Vendor Portal (`/vendor/*`) | Manage meal items and stock toggles, view live kitchen order queue, update order statuses, manage commercial profile, view daily earnings, access delivery gate pass. |
| **delivery / delivery_person** | Courier Portal | Present courier delivery pass (`VendorPass`) at security gates for authorized parcel/meal drop-off. |
| **maintenance / maintenance_staff** | Maintenance Portal (`/maintenance/*`) | View assigned repair tasks, update ticket status (`In Progress` / `Resolved`), submit completion notes. |
| **finance / finance_staff** | Finance Portal | Generate student bills, review payment audit trail, verify offline bank deposit slips. |
| **executive** | Executive Portal (`/executive/*`) | View campus-wide strategic KPI summaries, utility trends, financial trajectories, and occupancy density. |

---

## 5. Technology Stack

Verified directly from repository configuration and package files:

| Layer / Role | Technology / Package | Exact Version | Architectural Purpose |
| :--- | :--- | :--- | :--- |
| **Server Runtime** | Node.js | `>= 20.x` (Tested on `v24.19.0`) | Event-driven non-blocking JavaScript server runtime |
| **Backend Framework** | Express.js | `^5.3.0` | REST API routing and middleware framework |
| **Database Engine** | MongoDB | `>= 7.0` | Document-oriented NoSQL database |
| **Object Modeling** | Mongoose | `^9.11.2` | Schema definitions, validation, references, and hooks |
| **Authentication** | jsonwebtoken | `^9.0.3` | HMAC-SHA256 stateless JSON Web Token issuance & verification |
| **Password Security** | bcryptjs | `^3.0.3` | Salted one-way password hashing (10 salt rounds) |
| **CORS Middleware** | cors | `^2.8.6` | Cross-Origin Resource Sharing with credentials |
| **Cookie Parsing** | cookie-parser | `^1.4.7` | Parses cookie headers and populates `req.cookies` |
| **Environment Config** | dotenv | `^18.0.8` | Loads environment variables from `.env` files |
| **File Uploads** | multer | `^2.5.0` | Multipart/form-data handler with MIME-type filtering |
| **Cloud Media Storage** | cloudinary | `^2.11.0` | Cloud CDN storage for maintenance defect photographs |
| **Email & OTP Delivery** | nodemailer | `^10.3.1` | SMTP email transport for OTP codes & official alerts |
| **Frontend Framework** | React | `^19.2.8` | Component-based UI library (React 19) |
| **Frontend Build Tool** | Vite | `^8.3.0` | ES-module frontend build tool and dev server |
| **CSS Utility Framework**| Tailwind CSS | `^4.3.3` | Utility-first CSS styling engine |
| **Client-Side Routing** | react-router-dom | `^7.18.4` | Declarative SPA navigation and role-based route guards |
| **Camera QR Scanner** | html5-qrcode | `^2.3.8` | HTML5 WebRTC optical camera stream and barcode decoder |
| **QR Code Generator** | qrcode | `^1.5.4` | Vector & canvas client-side QR code generator |
| **Data Visualization** | recharts | `^3.10.1` | Declarative SVG charting library for responsive analytics |
| **Iconography** | lucide-react | `^1.48.0` | SVG icon library |

---

## 6. System Architecture

SmartStay is built as a decoupled, multi-tier Client-Server application:

```
+-----------------------------------------------------------------------------------+
| PRESENTATION TIER                                                                 |
| React 19 SPA | Vite 8 | Tailwind CSS v4 | Recharts | html5-qrcode | Lucide UI    |
+-----------------------------------------------------------------------------------+
                                          │
                                 HTTPS / REST JSON
                             (Bearer Token / Cookies)
                                          │
                                          ▼
+-----------------------------------------------------------------------------------+
| APPLICATION TIER                                                                  |
| Node.js + Express.js v5.3.0 REST Server                                           |
| ├── Middleware Pipeline (CORS, Cookie Parser, Protect, AuthorizeRole, Multer)    |
| ├── 23 Route Files (125 Endpoints)                                                |
| └── 19 Domain Business Logic Controllers                                         |
+-----------------------------------------------------------------------------------+
                                          │
                                   Mongoose v9.11.2
                                   Query Engine
                                          │
                                          ▼
+-----------------------------------------------------------------------------------+
| DATA PERSISTENCE TIER                                                             |
| MongoDB Document Database (24 Collections, Schema Types, Compound Indexes)        |
+-----------------------------------------------------------------------------------+
        │                                                                   │
        ▼                                                                   ▼
+───────────────────────────+                       +───────────────────────────────+
|   CLOUDINARY MEDIA CDN    |                       |    NODEMAILER SMTP GATEWAY    |
|   Maintenance Photos      |                       |    Payment OTP Codes          |
+───────────────────────────+                       +───────────────────────────────+
```

---

## 7. Project Folder Structure

```
SmartStay/
├── api/                          # Vercel serverless entry point
│   └── index.js                  # Serverless request router
├── backend/                      # Express.js REST API Server
│   ├── config/                   # Database connection (db.js)
│   ├── controllers/              # 19 Domain business logic controllers
│   ├── middleware/               # authMiddleware.js (JWT & RBAC)
│   ├── models/                   # 24 Mongoose schema models
│   ├── routes/                   # 23 Modular REST API route files
│   ├── scripts/                  # Data seed scripts (seedHostelData.js)
│   ├── tests/                    # Automated unit tests (Node.js test runner)
│   ├── .env.example              # Safe template for backend environment variables
│   ├── package.json              # Backend dependencies and scripts
│   └── server.js                 # Express server configuration and entry point
├── docs/                         # Academic documentation package
│   └── final-project-report/     # 13 Detailed technical report markdown files
├── frontend/                     # React 19 + Vite 8 SPA Client
│   ├── public/                   # Static logos, marks, and favicon
│   ├── src/
│   │   ├── components/           # Reusable UI primitives (Button, Modal, Badge, Card)
│   │   ├── context/              # AuthContext.jsx (session and user state)
│   │   ├── pages/                # 36 Domain page views across all roles
│   │   ├── services/             # Axios/fetch API communication services
│   │   ├── App.jsx               # Client-side routes and ProtectedRoute guards
│   │   └── main.jsx              # React application entry point
│   ├── .env.example              # Safe template for frontend environment variables
│   ├── package.json              # Frontend dependencies and scripts
│   └── vite.config.js            # Vite + Tailwind build configuration
├── .env.example                  # Root environment configuration template
├── .gitignore                    # Git file exclusions
├── package.json                  # Root convenience scripts
├── README.md                     # Project documentation
└── vercel.json                   # Vercel cloud deployment configuration
```

---

## 8. Prerequisites

Ensure the following tools are installed before running SmartStay:
* **Node.js**: Version `>= 20.x` (Recommended: `v22.x LTS` or `v24.x`).
* **npm**: Version `>= 10.x`.
* **MongoDB**: Version `>= 6.0` (Local MongoDB Community Server or MongoDB Atlas cloud URI).
* **Git**: Version `>= 2.30`.
* A modern web browser (Google Chrome, Mozilla Firefox, or Microsoft Edge) with camera permissions enabled for QR scanning.

---

## 9. Installation and Setup Guide

Follow these numbered steps to configure and run the project locally.

### Step 1: Clone the Repository
```bash
git clone https://github.com/ANafeesh/SmartStay.git
cd SmartStay/SmartStay
```

### Step 2: Configure Environment Variables
Copy the provided `.env.example` file to create your backend `.env`:
```bash
# On Windows PowerShell:
Copy-Item backend\.env.example backend\.env

# On Linux / macOS:
cp backend/.env.example backend/.env
```
Open `backend/.env` and ensure `MONGO_URI` and `JWT_SECRET` are configured.

### Step 3: Install Backend Dependencies
```bash
cd backend
npm install
```

### Step 4: Seed Initial Data (Optional but Recommended)
Populate the database with foundational blocks, rooms, beds, demo canteen vendors, and default accounts:
```bash
npm run seed:hostel
```

### Step 5: Start the Backend Server
```bash
npm run dev
```
The backend server will start on: **`http://localhost:5000`**

### Step 6: Install Frontend Dependencies and Start Frontend
Open a **new terminal window** and run:
```bash
cd SmartStay/SmartStay/frontend
npm install
npm run dev
```
The Vite development server will start on: **`http://localhost:5173`**

### Step 7: Open the Application
Open your browser and navigate to:
```
http://localhost:5173
```
You can log in using registered accounts or test using persona profiles.

---

## 10. Environment Configuration

The application uses the following environment variables. **Never commit actual `.env` files with real credentials to Git.**

| Variable Name | Required | Default / Example Value | Description |
| :--- | :--- | :--- | :--- |
| `PORT` | Optional | `5000` | Port for the Express backend server |
| `NODE_ENV` | Optional | `development` | Environment mode (`development` or `production`) |
| `MONGO_URI` | **Required** | `mongodb://localhost:27017/smartstay_db` | MongoDB connection string (Local or MongoDB Atlas) |
| `JWT_SECRET` | **Required** | `your_jwt_secret_key_here` | 256-bit cryptographic secret for signing JSON Web Tokens |
| `CLOUDINARY_CLOUD_NAME` | Optional | `your_cloud_name` | Cloudinary account name for defect photo uploads |
| `CLOUDINARY_API_KEY` | Optional | `your_api_key` | Cloudinary API access key |
| `CLOUDINARY_API_SECRET` | Optional | `your_api_secret` | Cloudinary API secret |
| `EMAIL_HOST` | Optional | `smtp.gmail.com` | SMTP host for outgoing emails and OTPs |
| `EMAIL_PORT` | Optional | `587` | SMTP port (587 for TLS) |
| `EMAIL_USER` | Optional | `your_email@domain.com` | SMTP account email address |
| `EMAIL_PASS` | Optional | `your_email_app_password` | SMTP application password |
| `VITE_API_URL` (Frontend) | Optional | `http://localhost:5000/api` | Backend API base URL consumed by the React client |

> **Warning**: Keep production credentials confidential. Do not share database connection strings, JWT secrets, or email passwords in public repositories.

---

## 11. API Documentation Overview

The backend exposes **125 RESTful endpoints** organized across 23 route files. All responses follow a consistent JSON structure:
```json
{
  "success": true,
  "message": "Operation completed successfully.",
  "data": { ... }
}
```

### Key API Categories:
1. **Authentication (`/api/auth`)**: User login, registration, current user profile (`/me`), password updates, and logout.
2. **Hostel Rooms & Allocations (`/api/buildings`, `/api/rooms`, `/api/beds`, `/api/allocations`, `/api/transfers`)**: Room inventory, bed availability status, student room assignment, checkout, and room transfer requests.
3. **Security & Gate Logs (`/api/digital-passes`, `/api/gate-logs`, `/api/leave-requests`, `/api/visitors`, `/api/violations`)**: Digital pass issuance and verification, gate movement logging (IN/OUT), consecutive movement inconsistency checks, overnight leave petitions, visitor records, and disciplinary violations.
4. **Canteen Marketplace & Vendors (`/api/menus`, `/api/food-orders`, `/api/delivery-slots`, `/api/vendors`, `/api/vendor-passes`)**: Meal catalog, food order placement, live kitchen order queue, commercial vendor profiles, daily earnings, and courier delivery gate passes.
5. **Billing & Receipts (`/api/bills`, `/api/payments`, `/api/receipts`, `/api/payment-notifications`)**: Student fee invoices, two-factor OTP payment verification, digital receipts, and payment notifications.
6. **Maintenance (`/api/complaints`)**: Maintenance defect submission, Cloudinary image upload, and technician status updates.
7. **Analytics & Monitoring (`/api/analytics`, `/api/monitoring`)**: Cross-collection analytics (occupancy, finance, food orders), time-series utility telemetry (Water & Power), and consumption leak alerts.

*For full request/response schemas, parameters, and status codes, see [API_DOCUMENTATION.md](file:///c:/Users/PCS/Desktop/SmartStay/SmartStay/docs/final-project-report/API_DOCUMENTATION.md).*

---

## 12. Database Overview

SmartStay uses **MongoDB** managed via **Mongoose v9.11.2**. The database consists of **24 schema models**:

* **Core & Identity**: `User`
* **Hostel Infrastructure**: `Building`, `Room`, `Bed`, `Allocation`, `Transfer`
* **Security & Passes**: `DigitalPass`, `GateEntryExit`, `GateInconsistency`, `LeaveRequest`, `Visitor`, `HostelViolation`
* **Food & Marketplace**: `Vendor`, `MenuItem`, `DeliverySlot`, `FoodOrder`, `VendorPass`
* **Finance & Billing**: `Bill`, `Payment`, `PaymentOtp`, `Receipt`, `PaymentNotification`
* **Maintenance & Telemetry**: `Complaint`, `MonitoringReading`

Relational links across collections use `mongoose.Schema.Types.ObjectId` references (`ref: 'User'`, `ref: 'Room'`, `ref: 'DigitalPass'`), populated on demand.

*For complete schema definitions, field types, and the Mermaid ER Diagram, see [DATABASE_DESIGN.md](file:///c:/Users/PCS/Desktop/SmartStay/SmartStay/docs/final-project-report/DATABASE_DESIGN.md).*

---

## 13. Testing and Quality Assurance

### Automated Unit Testing
Automated tests are executed using the native Node.js Test Runner:
```bash
cd backend
npm test
```
**Verified Results**:
* **Total Tests Executed**: 19
* **Passed**: 19 (100%)
* **Failed**: 0
* **Duration**: ~2.5 seconds
* **Tested Areas**: Digital pass validation, expired/revoked pass rejection, consecutive duplicate movement prevention, gate terminal authentication, and vendor courier pass movements.

### Frontend Production Build Verification
The frontend production build was verified using Vite:
```bash
cd frontend
npm run build
```
**Verified Results**:
* **Transformed Modules**: 2,582 modules.
* **Build Duration**: ~3.4 seconds.
* **Compilation Result**: Clean build with zero syntax, CSS, or bundling errors. Output generated in `frontend/dist/`.

*For detailed test cases and execution logs, see [TESTING_AND_EVALUATION.md](file:///c:/Users/PCS/Desktop/SmartStay/SmartStay/docs/final-project-report/TESTING_AND_EVALUATION.md).*

---

## 14. Build and Deployment

### Frontend Production Build
```bash
cd frontend
npm run build
```
Generates production assets in `frontend/dist/`.

### Deployment Architecture
* **Vercel Cloud Deployment**: The repository includes `vercel.json` and a serverless API handler (`api/index.js`), allowing deployment on Vercel with frontend static file delivery and serverless API execution.
* **Standalone Server Execution**: Can be deployed to VPS or cloud platforms (Render, Railway, AWS EC2) using:
  ```bash
  # Root convenience command:
  npm run build
  npm start
  ```

---

## 15. Security and Privacy

* **Password Protection**: Passwords are never stored in plaintext; they are hashed with `bcryptjs` using 10 salt rounds. The `passwordHash` field is excluded from queries by default (`select: false`).
* **Stateless Token Authentication**: Stateless HMAC-SHA256 JWTs with a 7-day expiration are accepted via Bearer headers or HTTP-only cookies.
* **Role Normalization & RBAC**: Roles are sanitized and validated by `authMiddleware.js`, preventing privilege escalation across all protected endpoints.
* **NoSQL Injection Defense**: Uses typed Mongoose schemas and parameterized queries to prevent query selector injections.
* **Upload Sanitization**: Multer handles multipart file uploads with strict MIME-type whitelisting (JPEG, PNG, WebP) and a 5MB size limit.
* **Security Limitations**:
  - Stateless JWTs cannot be revoked immediately without a token blacklist (such as Redis).
  - Rate limiting is not currently configured on the login endpoint.
  - Optical camera QR scanning requires an HTTPS context or `localhost` due to browser security restrictions.

---

## 16. Individual Group Contributions

The SmartStay project was developed by five student team members. Contribution evidence is supported by the repository's **242 git commits** and pull request history:

| Team Member | Git Author | Assigned Functional Module | Verified Commits | Key Source Files |
| :--- | :--- | :--- | :--- | :--- |
| **A. Kanesalingam** | `Archshana` | **Module 1**: Smart Hostel and Room Management | 23 | `roomController.js`, `allocationController.js`, `transferController.js`, `Rooms.jsx`, `HostelMap.jsx` |
| **M. H. U. Hafrath** | `hafrathusam` | **Module 2**: Student Security and Digital Pass | 51 | `digitalPassController.js`, `gateLogController.js`, `leaveRequestController.js`, `Pass.jsx`, `GateScanner.jsx` |
| **Ahamed Nafeesh** | `ANafeesh` | **Module 3**: Payments, Food and Marketplace | 98 | `foodOrderController.js`, `vendorPassController.js`, `paymentController.js`, `Marketplace.jsx`, `VendorDashboard.jsx` |
| **A. Dhusanthika** | `Dhusanthoika` | **Module 4**: Maintenance, Complaints and Student Services | 2 *(Consolidated)* | `complaintController.js`, `Complaint.js`, `Complaints.jsx`, `MaintenanceDashboard.jsx` |
| **M. I. M. Izni** | `Mhd-Iz` | **Module 5**: Smart Monitoring and Analytics | 68 | `analyticsController.js`, `monitoringController.js`, `Dashboard.jsx`, `Analytics.jsx`, `Monitoring.jsx` |

*For full details on commits, branches, and pull request conflict resolutions, see [INDIVIDUAL_CONTRIBUTIONS.md](file:///c:/Users/PCS/Desktop/SmartStay/SmartStay/docs/final-project-report/INDIVIDUAL_CONTRIBUTIONS.md).*

---

## 17. Limitations and Future Enhancements

### Current System Limitations
1. **Simulated Payment Gateway**: Payments use an internal two-factor OTP authorization pipeline; integration with commercial payment gateways (such as PayHere or Stripe) is planned for future releases.
2. **Software-Simulated IoT Sensors**: Telemetry ingestion endpoints and analytics dashboards are fully operational; however, readings are generated via simulation scripts rather than physical ESP32/LoRaWAN smart meters.
3. **WebRTC Camera Security Context**: Optical camera scanning requires an HTTPS context or `localhost` to access camera hardware.

### Future Roadmap
* **Short-Term (0–3 Months)**: Integration of a commercial Sri Lankan payment gateway (PayHere IPG), `express-rate-limit` brute-force protection, and automated SMS alerts to parents on curfew violations.
* **Medium-Term (3–6 Months)**: Physical ESP32 microcontroller deployment with current sensors and water flow meters, and bi-directional WebSockets (`Socket.IO`) for live kitchen queue updates.
* **Long-Term (6–12 Months)**: Native mobile applications (React Native / Flutter) and edge facial recognition cameras at entrance turnstiles.

---

## 18. Project Team

| # | Student Name | Registration Number | Assigned Module | Email |
| :--- | :--- | :--- | :--- | :--- |
| 1 | **A. Kanesalingam** | *[Insert Registration No.]* | Module 1: Smart Hostel and Room Management | `archshanakanehsalingam@gmail.com` |
| 2 | **M. H. U. Hafrath** | *[Insert Registration No.]* | Module 2: Student Security and Digital Pass | `nuhafrath2023@gmail.com` |
| 3 | **Ahamed Nafeesh** | *[Insert Registration No.]* | Module 3: Payments, Food and Marketplace | `ahamednafeesh2003@gmail.com` |
| 4 | **A. Dhusanthika** | *[Insert Registration No.]* | Module 4: Maintenance, Complaints & Services | `thusanthika2003@gmail.com` |
| 5 | **M. I. M. Izni** | *[Insert Registration No.]* | Module 5: Smart Monitoring and Analytics | `imthiyasizzni@gmail.com` |

*(Note: Group members should confirm and insert their official institutional registration numbers before final submission).*

---

## 19. Course and Academic Submission Information

* **Course**: SWT22022 – Practical for Internet Application Development
* **Degree Program**: Bachelor of Technology / Information & Communication Technology
* **Faculty**: Faculty of Technology
* **University**: South Eastern University of Sri Lanka (SEUSL)
* **Project Title**: SmartStay – Smart Hostel and Co-Living Management System
* **Repository URL**: `https://github.com/ANafeesh/SmartStay`
* **Academic Year**: 2025 / 2026

---

## 20. Final Submission Checklist

### Submission 1: GitHub Repository Link (Moodle)
- [x] Repository URL verified (`https://github.com/ANafeesh/SmartStay`).
- [x] All five functional modules implemented and committed.
- [x] Root `README.md` updated with comprehensive project documentation.
- [x] Safe `.env.example` templates created without exposed credentials.
- [x] Automated tests passing (19/19 passing).
- [x] Production build verified (`npm run build` completed without errors).
- [ ] Confirm repository access permissions for course evaluators.

### Submission 2: Final Project Report (Moodle)
- [x] Comprehensive report draft generated (`docs/final-project-report/FINAL_PROJECT_REPORT_DRAFT.md`).
- [x] All five functional modules documented with architecture, database, and API specifications.
- [x] Screenshot checklist prepared (`docs/final-project-report/APPENDICES_AND_SCREENSHOT_CHECKLIST.md`).
- [ ] Capture live screenshots from `http://localhost:5173` according to the checklist.
- [ ] Insert captured figures into the lecturer's official Word template.
- [ ] Verify individual contributions and institutional registration numbers.
- [ ] Export final report to PDF and submit via Moodle alongside the editable Word document.
