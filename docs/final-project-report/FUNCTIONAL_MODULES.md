# 6. Implementation and Major Functional Modules

This chapter provides a detailed, evidence-based technical evaluation of the five major functional modules comprising the **SmartStay** management system. Each module is evaluated against its verified source code, API routes, database schemas, frontend interfaces, security mechanisms, and testing results.

---

## 6.1 Module 1: Smart Hostel and Room Management

* **Module Purpose**: Centralized administration of physical hostel buildings, rooms, student bed allocations, occupancy status tracking, and room relocation/transfer petition workflows.
* **Responsible Team Member**: **A. Kanesalingam (Archshana)** (Verified via Git branch `origin/Archshana`, 23 repository commits).
* **Current Implementation Status**: **Fully Implemented**.

### 6.1.1 Key Functional Features
1. **Building & Facility Inventory**: CRUD operations on residential blocks, managing structural floor counts, descriptions, and activation status.
2. **Room & Bed Capacity Tracking**: Per-room occupancy monitoring (`Available`, `Occupied`, `Maintenance`) with capacity limits (Single, Shared, Standard, Deluxe). Automated bed availability tracking per room.
3. **Student Room Allocation**: Formal allocation of students to specific rooms and beds. Automatic occupancy calculation updates bed states to `Occupied` upon contract activation and releases them upon checkout.
4. **Room Transfer & Swapping Workflow**: Student-initiated transfer requests specifying source and destination beds, medical/academic justification, urgency ratings, and administrative approval/rejection workflows by the warden.
5. **Interactive Hostel Map**: Visual bird's-eye layout of campus hostel blocks displaying room occupancy density and capacity bottlenecks.

### 6.1.2 Technical Artifacts & Architecture
* **Frontend Pages & Components**:
  - `frontend/src/pages/admin/Rooms.jsx`: Administrative inventory grid, search filters, room creation modals.
  - `frontend/src/pages/admin/HostelMap.jsx`: Visual representation of building floor plans and bed assignments.
  - `frontend/src/pages/student/MyRoom.jsx`: Student-facing room profile, bed identifier, and roommate details.
* **Backend Controllers & Routes**:
  - `backend/controllers/roomController.js`: `createRoom`, `getAllRooms`, `getRoomById`, `updateRoom`, `deleteRoom`.
  - `backend/controllers/bedController.js`: Bed-level state management and availability queries.
  - `backend/controllers/buildingController.js`: Building block CRUD.
  - `backend/controllers/allocationController.js`: `createAllocation`, `getAllocations`, `getMyAllocation`, `checkoutAllocation`.
  - `backend/controllers/transferController.js`: `createTransfer`, `getTransfers`, `approveTransfer`, `rejectTransfer`.
  - `backend/routes/roomRoutes.js`, `allocationRoutes.js`, `transferRoutes.js`, `buildingRoutes.js`.
* **Database Models**:
  - `Building.js`, `Room.js`, `Bed.js`, `Allocation.js`, `Transfer.js`.
* **Validation & Business Logic**:
  - Overbooking protection: Before an allocation or approved transfer is finalized, the system queries `Bed.status` and `Room.capacity`. If `status !== 'Available'`, the transaction is rejected with HTTP 400.
  - Automatic status cascading: Check-out of an allocation automatically updates the associated `Bed.status` back to `'Available'`.

---

## 6.2 Module 2: Student Security and Digital Pass

* **Module Purpose**: End-to-end cryptographic perimeter security, student digital pass issuance, dynamic QR verification, turnstile movement tracking, consecutive movement anomaly detection, approved overnight leave integration, and visitor management.
* **Responsible Team Member**: **M. H. U. Hafrath (hafrathusam)** (Verified via Git branch `origin/Hafrath`, 51 repository commits).
* **Current Implementation Status**: **Fully Implemented**.

### 6.2.1 Deep-Dive Architectural Inspection

#### A. Digital Pass Token Format and Cryptographic Security
- **Token Generation**: Digital passes are generated in `digitalPassController.js` using Node.js native `crypto.randomBytes(32).toString('base64url')`, producing a 256-bit cryptographically secure, URL-safe random string.
- **Hashing & Secret Storage**: The raw token is hashed using **SHA-256** (`crypto.createHash('sha256').update(token).digest('hex')`) and persisted in the `tokenHash` field with an indexed unique constraint. The raw token is returned to the student client for local QR canvas rendering but is never stored in plaintext within security audit logs.
- **Pass Validity & Lifecycle**: Passes carry semester validity (180 days default) with status states: `Active`, `Suspended`, `Revoked`, and `OnLeave`. Revoked or expired passes are immediately declined at the perimeter gate.

#### B. Student Pass Retrieval & QR Code Generation
- **Endpoint**: `GET /api/digital-passes/my-pass`.
- **Logic**: Enforces active account verification (`user.accountStatus === 'active'`). Auto-provisions an initial digital pass if the student has no active record. Returns student details, validity dates, last logged movement, and QR payload string.
- **Frontend Canvas Rendering**: The student interface (`frontend/src/pages/student/Pass.jsx`) renders a vector QR code using the `qrcode` library, complete with an animated security pulse and active validity timer.

#### C. Gatekeeper Scanner & Real Camera Verification
- **WebRTC Camera Stream**: In `frontend/src/pages/security/GateScanner.jsx`, the security officer client utilizes `html5-qrcode` to bind directly to the device's optical camera hardware via HTML5 WebRTC (`navigator.mediaDevices.getUserMedia`).
- **Scanning Engine**: Continuous camera frames are scanned at 10 frames per second. Upon barcode pattern detection, the decoded string is sanitized and transmitted via POST request to `/api/gate/verify`.
- **Evaluation Simulation Controls**: To facilitate academic project demonstrations and automated testing in environments without physical camera access, the scanner view also provides evaluation test buttons (Simulate Inbound Scan, Simulate Outbound Scan, Simulate Curfew Breach). Both mechanisms execute the exact same backend verification pipeline.

#### D. Sequential Direction Logic & Duplicate Movement Prevention
- **State Validation**: `gateLogController.js` tracks `DigitalPass.lastMovementDirection` (`IN`, `OUT`, `NONE`).
- **Anti-Passback Enforcement**: If a student logged as `IN` attempts another `IN` scan without an intervening `OUT` (or vice versa), the system flags a consecutive movement anomaly.
- **Inconsistency Audit Trail**: Rather than silently failing, the controller atomically creates a `GateInconsistency` record capturing the attempted direction, timestamp, gate ID, and pass state, alerting security personnel to potential tailgating or turnstile jumping.

#### E. Approved Leave & Curfew Timezone Automation
- **Asia/Colombo Timezone Accuracy**: Curfew breach checks utilize `Intl.DateTimeFormat` with `timeZone: 'Asia/Colombo'` (`getColomboHour`) to evaluate the exact local hour regardless of server cloud hosting zone. Movements after 22:00 (10:00 PM) trigger automated curfew flags.
- **Leave Request Synchronization**: When an outbound movement is recorded, active approved `LeaveRequest` records for that student are linked. Upon subsequent gate entry, the leave request status is automatically marked as `Completed`, capturing `actualReturnDate`.

#### F. Visitor & Disciplinary Violation Administration
- **Visitor Check-in/Check-out**: Tracks non-resident guests (`Visitor.js`) linked to host students, validating National Identity Card (NIC) or Passport numbers and logging arrival/departure times.
- **Hostel Violations**: Security officers and wardens record infractions (`Curfew Breach`, `Property Damage`, `Unauthorized Visitor`, `Noise Disturbance`) with severity weights and optional monetary fines in LKR.

---

## 6.3 Module 3: Payments, Food and Marketplace

* **Module Purpose**: Campus catering digitization, real-time food ordering, synchronized kitchen order tickets (KOT), commercial vendor management, student digital billing, and two-factor payment verification.
* **Responsible Team Member**: **Ahamed Nafeesh (ANafeesh)** (Verified via Git branch `origin/Nafeesh`, 98 repository commits).
* **Current Implementation Status**: **Fully Implemented**.

### 6.3.1 Key Functional Features
1. **Student Marketplace & Food Pre-Ordering**:
   - Real-time catalog of meals and snacks filtered by dietary preferences (`Halal`, `Vegetarian`, `Spicy`).
   - Delivery window slot scheduling (`DeliverySlot.js`) to prevent lobby congestion during lunch and dinner peaks.
   - Dynamic cart calculations factoring subtotal, delivery charges, and platform convenience fees in Sri Lankan Rupees (LKR).
2. **Vendor Operations & Live Kitchen Queue**:
   - Vendor dashboard (`frontend/src/pages/vendor/VendorDashboard.jsx`) displaying live daily earnings, order counts, and delivery capacity utilization.
   - Live Order Queue (`VendorOrders.jsx`) displaying incoming tickets categorized by lifecycle stages: `Placed`, `Preparing`, `Out for Delivery`, `Delivered`. Status transitions trigger instantaneous updates.
   - Menu & Inventory Management (`FoodItems.jsx`) enabling real-time stock toggles (`available: true/false`), item pricing, and dietary tag customization.
   - Commercial Vendor Profile (`VendorProfile.jsx`): Business registration, emergency hotline, drop-off zone specifications, and public health hygiene ratings.
   - Authorized Delivery Courier Gate Pass (`VendorPass.jsx`): QR security pass authorizing commercial delivery riders through security turnstiles.
3. **Student Invoicing & Payment Settlement**:
   - Invoices generated for semester room rent, utility surcharges, and cafeteria bills (`Bill.js`).
   - Two-Factor OTP Payment Authorization (`PaymentOtp.js`): Upon checkout, a 6-digit one-time password is dispatched to the student's email via Nodemailer SMTP (with fallback evaluation simulation codes).
   - Tamper-Proof Digital Receipts (`Receipt.js`): Successful payment automatically generates an immutable receipt bearing a cryptographic verification hash.
   - Offline Bank Deposit Slip Submission: Supports manual slip uploads via Multer with Cloudinary CDN hosting for bank transfer verification.

---

## 6.4 Module 4: Maintenance, Complaints and Student Services

* **Module Purpose**: Facilities maintenance ticketing, room defect logging, multi-stage issue resolution tracking, and administrative dispatching of maintenance technicians.
* **Responsible Team Member**: **A. Dhusanthika (Dhusanthoika)** (Verified via Git branch `origin/Dhusanthika`, 2 repository commits; consolidated into `main`).
* **Current Implementation Status**: **Fully Implemented**.

### 6.4.1 Key Functional Features
1. **Defect Submission**: Students file structured repair tickets specifying physical location (Building, Floor, Room), trade category (Electrical, Plumbing, Carpentry, Masonry, Internet), and severity priority (`Low`, `Medium`, `High`, `Critical`).
2. **Cloudinary Photographic Evidence**: Supports uploading image attachments via `multer` disk storage and Cloudinary CDN upload (`uploadPhotos` in `complaintController.js`), ensuring maintenance personnel have visual diagnostic evidence prior to dispatch.
3. **Technician Workflow & Assignment**:
   - Administrative portal allows wardens to assign specific technicians (`assignedTo`) to pending tickets.
   - Maintenance staff interface (`frontend/src/pages/maintenance/MaintenanceDashboard.jsx`) filters assigned tasks by priority.
4. **Resolution Tracking**: Tickets transition through four auditable states: `Pending` -> `In Progress` -> `Resolved` -> `Rejected`. Technicians provide final resolution notes upon work completion.

---

## 6.5 Module 5: Smart Monitoring and Analytics

* **Module Purpose**: Centralized executive intelligence, cross-module data aggregation, operational KPI dashboards, predictive occupancy calculations, financial settlement analytics, and campus utility consumption telemetry.
* **Responsible Team Member**: **M. I. M. Izni (Mhd-Iz)** (Verified via Git branch `origin/Izni`, 68 repository commits).
* **Current Implementation Status**: **Fully Implemented** (Telemetry ingestion completed; hardware IoT sensors currently simulated via software telemetry engine).

### 6.5.1 Key Functional Features & Analytics Capabilities

#### A. Executive & Administrative Dashboards
- **Aggregated Metrics**: Evaluates live student count, room occupancy percentage, active security alerts, pending maintenance tickets, uncollected revenue, and live canteen order volume in a unified view (`admin/Dashboard.jsx` and `executive/ExecutiveDashboard.jsx`).
- **Interactive Visualizations**: High-performance responsive charts rendered using **Recharts v3.10.1** (Bar charts, Area graphs, Pie charts, and Line charts).

#### B. Deep-Dive Analytical Endpoints (`analyticsController.js`)
1. **Occupancy Analytics (`getOccupancyAnalytics`)**:
   - Queries `Room`, `Bed`, and `Allocation` collections.
   - Computes total campus capacity, occupied beds, vacant beds, maintenance-blocked beds, and overall percentage occupancy.
   - Generates breakdown by individual building block (Block A, Block B, etc.).
2. **Financial & Revenue Analytics (`getFinancialAnalytics`)**:
   - Aggregates settled payments and pending dues across `Bill` and `Payment` collections.
   - Groups cash inflows by revenue categories (Accommodation, Cafeteria, Fines, Utilities).
   - Generates monthly cash flow trajectories.
3. **Maintenance & Disciplinary Reports (`getComplaintAnalytics`)**:
   - Breakdown of complaint resolution velocity, categorized by technical trade and urgency.
   - Aggregates disciplinary violations by infraction type (`Curfew Breach`, `Property Damage`) and tracks collected fine revenue.
4. **Food & Marketplace Metrics (`getFoodOrderAnalytics`)**:
   - Canteen order volume trends, peak delivery time windows, and vendor revenue rankings.

#### C. Smart Utility Monitoring Telemetry (`monitoringController.js`)
- **Telemetry Ingestion**: Accepts time-series consumption readings for Electricity (in kWh) and Water (in Liters) via `POST /api/monitoring/readings`.
- **Validation Engine**: Enforces strict positive numerical values and unit validation (`L` for Water, `kWh` for Electricity).
- **Consumption Anomaly Detection**: `getTelemetryTrend` aggregates 24-hour and 7-day sliding consumption averages. Spike anomalies (e.g. water leaks or excessive power draw) trigger visual alert badges in the administration dashboard.
- **Hardware Integration Status**: Software ingestion endpoints, schema storage, and UI visualizers are **100% operational**; physical IoT smart meters are currently simulated via the software telemetry engine (`source: 'Simulated'`).

---

## 6.6 Implementation Verification Summary

| Module | Assigned Team Member | Key Controllers | Key Models | Total Commits | Verified Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Module 1: Room & Hostel Management** | A. Kanesalingam | `roomController.js`<br/>`allocationController.js`<br/>`transferController.js` | `Building`, `Room`, `Bed`, `Allocation`, `Transfer` | 23 | **Fully Implemented** |
| **Module 2: Security & Digital Pass** | M. H. U. Hafrath | `digitalPassController.js`<br/>`gateLogController.js`<br/>`leaveRequestController.js`<br/>`visitorController.js` | `DigitalPass`, `GateEntryExit`, `GateInconsistency`, `LeaveRequest`, `Visitor`, `HostelViolation` | 51 | **Fully Implemented** |
| **Module 3: Payments & Marketplace** | Ahamed Nafeesh | `foodOrderController.js`<br/>`vendorPassController.js`<br/>`paymentController.js`<br/>`billController.js` | `Vendor`, `MenuItem`, `DeliverySlot`, `FoodOrder`, `Bill`, `Payment`, `PaymentOtp`, `Receipt` | 98 | **Fully Implemented** |
| **Module 4: Maintenance & Complaints**| A. Dhusanthika | `complaintController.js` | `Complaint` | 2 (Consolidated) | **Fully Implemented** |
| **Module 5: Monitoring & Analytics** | M. I. M. Izni | `analyticsController.js`<br/>`monitoringController.js` | `MonitoringReading` (+ Cross-collection aggregations) | 68 | **Fully Implemented** (IoT Simulated) |

