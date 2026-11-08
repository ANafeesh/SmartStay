# SMARTSTAY — PROJECT OVERVIEW AND EXECUTIVE SUMMARY

---

## 1. Executive Summary

### 1.1 Project Identity and Purpose
**SmartStay** is an enterprise-grade, full-stack **Smart Hostel and Co-Living Management System** engineered to modernize residential university hostel operations, student security, commercial marketplace interactions, and facility maintenance. The application addresses the operational friction, manual administrative overhead, security vulnerabilities, and fragmented communication channels commonly found in higher-education residential hostels in Sri Lanka and comparable higher education ecosystems.

### 1.2 Core Problem Statement
Traditional campus hostel administration relies heavily on paper-bound logbooks, manual bed allocation spreadsheets, physical cash receipts, hand-written gate passes, physical curfew registers, and disconnected maintenance slips. This results in:
- Inefficient and delayed room allocations and room transfer requests.
- Compromised campus perimeter security due to unverified paper gate passes and absence of real-time ingress/egress movement tracking.
- Financial reconciliation delays between student room bills, online card transactions, and physical bank deposits.
- Inordinate delays in logging, assigning, and resolving critical facility maintenance issues (e.g., plumbing, electrical, carpentry).
- Complete absence of centralized executive analytics and telemetry monitoring for utility consumption (electricity, water, LPG).

### 1.3 Target Stakeholders and User Roles
SmartStay implements a unified, role-based ecosystem catering to **9 distinct stakeholder roles**:
1. **Student Residents**: Digital room view, online hostel fee payments, secure QR digital gate pass, maintenance complaints lodging, and campus food marketplace ordering.
2. **Hostel Wardens / Administrators**: Physical infrastructure inventory control, automated room allocations, transfer review, leave authorization, and disciplinary violation tracking.
3. **Security Gate Officers**: Live optical camera QR code pass verification, real-time entry/exit movement logging, courier gate pass validation, and automated duplicate movement rejection.
4. **Maintenance Technicians**: Work order dispatching, priority-based triage, status transitions, and resolution logging.
5. **Commercial Canteen Vendors**: Live food menu management, real-time kitchen order queue (KOT slips), instant stock toggling, daily revenue tracking, and university bursar payout disbursements.
6. **Finance Officers / Bursar**: Billing schedule generation, offline deposit slip verification, online transaction reconciliation, and automated digital receipt issuance.
7. **University Executives / Senate Members**: High-level telemetry dashboards, multi-block occupancy analytics, utility resource expenditure trends, and exportable operational audit reports.
8. **Delivery Couriers / Riders**: Secure campus gate access passes and designated hostel drop-zone clearances.
9. **Visitors / Guests**: Digital check-in/check-out logs linked to student resident hosts.

### 1.4 Architecture and Technology Stack
SmartStay is architected as a modern, decoupled client-server web application utilizing the **MERN** technology stack:
- **Frontend**: React 19 (`react` 19.2.8, `react-dom` 19.2.8), bundled with Vite 8 (`vite` 8.3.0), styled using modern utility-first Tailwind CSS 4 (`tailwindcss` 4.3.3, `@tailwindcss/vite` 4.3.3), and routed via React Router DOM 7 (`react-router-dom` 7.18.4). Advanced interactive data visualizations are driven by Recharts (`recharts` 3.10.1), while real camera optical scanning is powered by `html5-qrcode` (2.3.8) and QR rendering by `qrcode` (1.5.4).
- **Backend**: Node.js runtime executing Express.js 5 (`express` 5.3.0), connected to MongoDB via Mongoose 9 (`mongoose` 9.11.2).
- **Security & Infrastructure**: Stateless JSON Web Tokens (`jsonwebtoken` 9.0.3), cryptographic password hashing with bcryptjs (`bcryptjs` 3.0.3), cookie parsing (`cookie-parser` 1.4.7), cross-origin resource sharing (`cors` 2.8.6), and cloud asset streaming with Multer and Cloudinary (`multer` 2.5.0, `cloudinary` 2.11.0).

### 1.5 Major Functional Modules
1. **Module 1 — Smart Hostel and Room Management**: Multi-block management (Blocks A–D), 16 floors, 96 rooms, 192 beds, algorithmic allocations, and transfer request workflows.
2. **Module 2 — Student Security and Digital Pass**: Cryptographic HMAC-verified QR digital passes, real optical camera scanning, live gate ingress/egress movement audit, duplicate movement rejection, approved leave requests, visitor check-ins, and curfew violation tracking.
3. **Module 3 — Payments, Food and Marketplace**: Dual payment gateway (mock card simulation & offline bank slip uploads), OTP verification, automated invoice billing, official campus food marketplace (`Campus Diner & Cafe`), live kitchen KOT queue, and Bursar disbursement tracking.
4. **Module 4 — Maintenance, Complaints and Student Services**: End-to-end incident ticketing system, image attachments, priority triage (Low to Emergency), technician assignment, and resolution audit trails.
5. **Module 5 — Smart Monitoring and Analytics**: Interactive executive intelligence dashboard, multi-block occupancy trends, utility IoT telemetry simulations (electricity, water, LPG), violation aggregations, and exportable audit reports.

### 1.6 Verification and Project Outcome
The codebase has undergone comprehensive end-to-end verification:
- **19 unit test suites** executed via Node.js native test runner passing with **0 failures** (`19/19 passed`), verifying security rules, duplicate gate movement prevention, expired pass blocking, and role validation.
- **Frontend production build** compiling **2,582 modules** into optimized client bundles in **3.2–4.3s** with **0 build errors**.
- **Real-Time Cross-Context Sync**: Validated event-driven synchronization (`smartstay-food-orders-updated`, `smartstay-menu-updated`) bridging student marketplace ordering and vendor kitchen operations without manual page refreshes.

---

## 2. Project Background and Introduction

### 2.1 The University Residential Hostel Context in Sri Lanka
In state and private university systems across Sri Lanka, university accommodation is a critical resource allocated to thousands of undergraduate and postgraduate students. State universities (such as Moratuwa, Peradeniya, Colombo, Ruhuna, and SEUSL) accommodate significant portions of their student bodies in on-campus and off-campus hostel complexes.

Historically, hostel administration has operated through heavily decentralized and paper-based protocols:
1. **Physical Logbooks**: Students entering or leaving campus after hours sign physical registers at the security gate. During peak hours (e.g., weekend departures or evening meal runs), long queues form at security gates, manual signatures are frequently illegible, and gatekeepers cannot reliably cross-reference approved leave requests or identify suspended students.
2. **Paper-Based Maintenance Slips**: When plumbing or electrical failures occur in hostel rooms, students write in a communal hostel complaint book. These slips are periodically gathered by hostel sub-wardens, hand-delivered to university maintenance divisions, and frequently lost or delayed for weeks.
3. **Manual Financial Receipts**: Hostel admission fees and room charges require students to obtain bank deposit slips, queue at commercial bank branches, and deliver stamped slips to the university bursar's office for manual ledger entry.
4. **Third-Party Food Delivery Confusion**: During late-night academic study hours, commercial food couriers arriving at campus gates have no unified security clearance, leading to unauthorized perimeter entry or food deliveries being confiscated.

### 2.2 Motivation for SmartStay
SmartStay was conceived as an integrated, multi-role digital ecosystem engineered to eradicate these administrative bottlenecks. By unifying physical space allocation, optical gate security, electronic billing, student complaint resolution, commercial catering, and environmental utility monitoring into a single web-based application, SmartStay bridges the gap between students, administrative wardens, security gate officers, maintenance engineers, and university executives.

### 2.3 System Scope and Operating Boundaries
- **In-Scope**:
  - Full-stack CRUD management of physical campus buildings, floors, rooms, and bed units.
  - Automated bed assignment and multi-step room transfer requests.
  - Generation and optical camera verification of student QR gate passes.
  - Enforcement of consecutive movement logic (preventing duplicate exits or entries).
  - Student leave request filing and warden approval workflows.
  - Visitor logging and hostel disciplinary violation tracking.
  - Student room billing, card payment simulation with OTP, and deposit slip uploading.
  - Campus food marketplace ordering, real-time stock toggling, and live kitchen order slips.
  - Maintenance complaint logging, photo uploading, technician assignment, and resolution notes.
  - Utility telemetry trend monitoring (Electricity, Water, Gas) and PDF/CSV report generation.
  - JWT full-stack authentication, HTTP-only cookies, and multi-role RBAC enforcement.
- **Out-of-Scope (Boundaries)**:
  - Direct connection to live commercial bank APIs (e.g., LankaPay, PayHere) — handled via simulated gateway and deposit slip verification.
  - Physical hardware microcontrollers (e.g., Arduino/ESP32 RFID turnstiles) — gate verification operates via software optical camera scanner and verified terminal inputs.
  - Native mobile application distribution (iOS/Android App Stores) — application is delivered as a progressive, highly responsive web application (SPA).

---

## 3. High-Level System Overview Table

| Dimension | Specification |
|---|---|
| **System Name** | SmartStay — Smart Hostel and Co-Living Management System |
| **System Category** | Enterprise SaaS / Higher Education Facility & Security Management |
| **Software Architecture** | Decoupled Client-Server SPA Architecture (RESTful API) |
| **Frontend Framework** | React 19.2.8, React Router DOM 7.18.4, Vite 8.3.0 |
| **Styling & Icons** | Tailwind CSS 4.3.3, Lucide React 1.48.0 |
| **Visual Charts** | Recharts 3.10.1 |
| **QR Code Capabilities** | Optical Camera Scanning (`html5-qrcode` 2.3.8) & Generation (`qrcode` 1.5.4) |
| **Backend Runtime** | Node.js (CommonJS), Express.js 5.3.0 |
| **Database & ODM** | MongoDB, Mongoose 9.11.2 |
| **Security & Auth** | JSON Web Tokens (`jsonwebtoken` 9.0.3), `bcryptjs` 3.0.3, Role-Based Access Control |
| **Database Collections** | 24 Mongoose Schemas (User, DigitalPass, GateEntryExit, Bill, Complaint, etc.) |
| **Backend REST Endpoints**| 132 Registered Endpoints across 23 Route Files |
| **Frontend Page Views** | 36 Dedicated View Components across 5 Core Functional Modules |
| **Test Suite** | 19 Automated Unit Tests executed with Node.js Native Test Runner |

