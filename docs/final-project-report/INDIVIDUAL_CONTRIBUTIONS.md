# 9. Individual Contributions and Version-Control Evidence

## 9.1 Team Composition and Module Ownership Overview

The **SmartStay** project was collaboratively planned, engineered, tested, and integrated by a group of five software engineering students. Version control was managed using Git and hosted on GitHub under repository `ANafeesh/SmartStay`. The repository contains **242 verified commits** spanning individual feature branches, deployment pipelines, and pull request integration branches.

| Team Member | Git Author Identity | Institutional Email | Assigned Functional Module | Total Commits | Verified Feature Branch |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **A. Kanesalingam** | `Archshana` / `Archshana Kanesalingm` | `archshanakanehsalingam@gmail.com` | **Module 1**: Smart Hostel and Room Management | 23 | `origin/Archshana` |
| **M. H. U. Hafrath** | `hafrathusam` | `nuhafrath2023@gmail.com` | **Module 2**: Student Security and Digital Pass | 51 | `origin/Hafrath` |
| **Ahamed Nafeesh** | `ANafeesh` / `Ahamed Nafeesh` | `ahamednafeesh2003@gmail.com` | **Module 3**: Payments, Food and Marketplace | 98 | `origin/Nafeesh`, `origin/deploy-payments` |
| **A. Dhusanthika** | `Dhusanthoika` | `thusanthika2003@gmail.com` | **Module 4**: Maintenance, Complaints and Student Services | 2 (Consolidated) | `origin/Dhusanthika`, `origin/module4-dhusanthika` |
| **M. I. M. Izni** | `Mhd-Iz` / `Mohamed Izni` | `imthiyasizzni@gmail.com` | **Module 5**: Smart Monitoring and Analytics | 68 | `origin/Izni`, `origin/izni` |

---

## 9.2 Comprehensive Breakdown by Team Member

### 9.2.1 Team Member 1: A. Kanesalingam (Archshana)
* **Assigned Domain**: **Module 1 — Smart Hostel and Room Management**
* **Individual Responsibilities**:
  - Engineered building block and floor capacity inventory data structures.
  - Implemented room and bed tracking schemas with automatic occupancy status cascading.
  - Developed room allocation and student checkout workflows.
  - Designed the student room transfer workflow with urgency levels and warden approval states.
  - Built the visual interactive hostel room assignment layout.
* **Key Source Code Files**:
  - `backend/models/Building.js`, `Room.js`, `Bed.js`, `Allocation.js`, `Transfer.js`
  - `backend/controllers/roomController.js`, `bedController.js`, `buildingController.js`, `allocationController.js`, `transferController.js`
  - `backend/routes/roomRoutes.js`, `allocationRoutes.js`, `transferRoutes.js`, `buildingRoutes.js`
  - `frontend/src/pages/admin/Rooms.jsx`, `frontend/src/pages/admin/HostelMap.jsx`, `frontend/src/pages/student/MyRoom.jsx`
* **Git Version-Control Evidence**:
  - Total Commits: 23 commits
  - Active Branch: `origin/Archshana`
  - Key Commits:
    - `5e83f19`: *Complete room CRUD API*
    - `073d71f`: *Update allocation checkout and bed APIs*
    - `d528c75`: *Update transfer API and model*
    - `5c95d04`: *Merge pull request #14 from ANafeesh/Archshana*

---

### 9.2.2 Team Member 2: M. H. U. Hafrath (hafrathusam)
* **Assigned Domain**: **Module 2 — Student Security and Digital Pass**
* **Individual Responsibilities**:
  - Implemented 256-bit cryptographically secure digital pass token generation and SHA-256 token hashing.
  - Developed automated student pass provisioning and validity lifecycle management.
  - Engineered the perimeter gate turnstile movement recording engine (`gateLogController.js`).
  - Implemented consecutive movement duplicate rejection (anti-passback) and `GateInconsistency` logging.
  - Integrated Asia/Colombo local timezone evaluation (`getColomboHour`) for automatic 22:00 curfew violation logging.
  - Developed approved overnight leave synchronization and visitor management models.
  - Built the HTML5 WebRTC optical camera QR scanner interface (`html5-qrcode`) for security officers.
  - Wrote 15 automated unit test cases in `backend/tests/digitalPassAndGateLog.test.js`.
* **Key Source Code Files**:
  - `backend/models/DigitalPass.js`, `GateEntryExit.js`, `GateInconsistency.js`, `LeaveRequest.js`, `Visitor.js`, `HostelViolation.js`
  - `backend/controllers/digitalPassController.js`, `gateLogController.js`, `leaveRequestController.js`, `visitorController.js`, `violationController.js`
  - `backend/routes/digitalPassRoutes.js`, `gateLogRoutes.js`, `leaveRequestRoutes.js`, `visitorRoutes.js`, `violationRoutes.js`
  - `frontend/src/pages/student/Pass.jsx`, `frontend/src/pages/security/GateScanner.jsx`, `frontend/src/pages/security/SecurityDashboard.jsx`
  - `backend/tests/digitalPassAndGateLog.test.js`
* **Git Version-Control Evidence**:
  - Total Commits: 51 commits
  - Active Branch: `origin/Hafrath`
  - Key Commits:
    - `fc848fa`: *feat(gate): transition pass verification to real live database validation with permission enforcement*
    - `a381dc9`: *Hosted using github*
    - `09f00e7`: *feat: add automated gh-pages deployment script and npm deploy command*

---

### 9.2.3 Team Member 3: Ahamed Nafeesh (ANafeesh)
* **Assigned Domain**: **Module 3 — Payments, Food and Marketplace**
* **Individual Responsibilities**:
  - Configured repository foundation, initial project scaffold, and Cloudinary media storage CDN.
  - Developed the student campus food pre-ordering marketplace and dietary filtering engine.
  - Built the vendor management platform: menu catalog, inventory toggles, and live kitchen order queue.
  - Implemented commercial vendor profile management, business hours, and emergency hotline.
  - Engineered the commercial delivery rider security pass (`VendorPass.js`) with turnstile entry tracking.
  - Developed student invoice generation, two-factor payment OTP delivery via Nodemailer SMTP, and digital receipt generation.
  - Wrote automated vendor pass test suite (`backend/tests/vendorPassAndGateMovement.test.js`).
* **Key Source Code Files**:
  - `backend/models/Vendor.js`, `MenuItem.js`, `DeliverySlot.js`, `FoodOrder.js`, `VendorPass.js`, `Bill.js`, `Payment.js`, `PaymentOtp.js`, `Receipt.js`, `PaymentNotification.js`
  - `backend/controllers/foodOrderController.js`, `vendorPassController.js`, `billController.js`, `paymentController.js`, `catalogController.js`
  - `backend/routes/foodOrderRoutes.js`, `vendorRoutes.js`, `vendorPassRoutes.js`, `billRoutes.js`, `paymentRoutes.js`, `receiptRoutes.js`, `menuRoutes.js`
  - `frontend/src/pages/student/Marketplace.jsx`, `frontend/src/pages/student/Payments.jsx`, `frontend/src/pages/vendor/VendorDashboard.jsx`, `frontend/src/pages/vendor/FoodItems.jsx`, `frontend/src/pages/vendor/VendorOrders.jsx`, `frontend/src/pages/vendor/VendorProfile.jsx`, `frontend/src/pages/vendor/VendorPass.jsx`
  - `backend/tests/vendorPassAndGateMovement.test.js`
* **Git Version-Control Evidence**:
  - Total Commits: 98 commits (52 as `Ahamed Nafeesh`, 46 as `ANafeesh`)
  - Active Branches: `origin/Nafeesh`, `origin/deploy-payments`
  - Key Commits:
    - `84927b1`: *connected cloudinary*
    - `69cb34e`: *Deploy payments (#70)*
    - `ecc81d3`: *backend connect (#73)*
    - `b267a66`: *fix(merge): resolve conflicts between main and deploy-payments*

---

### 9.2.4 Team Member 4: A. Dhusanthika (Dhusanthoika)
* **Assigned Domain**: **Module 4 — Maintenance, Complaints and Student Services**
* **Individual Responsibilities**:
  - Engineered the facilities defect reporting and room maintenance ticketing model (`Complaint.js`).
  - Implemented multi-criteria defect classification (Category, Priority, Physical Location).
  - Designed the technician dispatch workflow enabling administrative assignment and field notes recording.
  - Integrated Multer multipart file upload handling for Cloudinary CDN damage photo hosting.
  - Developed student ticket submission interface and maintenance staff execution workbench.
* **Key Source Code Files**:
  - `backend/models/Complaint.js`
  - `backend/controllers/complaintController.js`
  - `backend/routes/complaintRoutes.js`
  - `frontend/src/pages/student/Complaints.jsx`, `frontend/src/pages/admin/Complaints.jsx`, `frontend/src/pages/maintenance/MaintenanceDashboard.jsx`, `frontend/src/pages/maintenance/TaskDetails.jsx`
* **Git Version-Control Evidence**:
  - Commits: 2 commits recorded on personal branch `origin/Dhusanthika` and consolidated into `origin/main` and `origin/module4-dhusanthika`.
  - Key Commits:
    - `eb49849`: *Build hostel student allocation workflow*
    - `e665e4c`: *Build hostel room transfer workflow*
    - `ec799e3`: *feat(auth,maintenance,analytics): overhaul login, maintenance workbench, and live analytics telemetry (#74)*

---

### 9.2.5 Team Member 5: M. I. M. Izni (Mhd-Iz)
* **Assigned Domain**: **Module 5 — Smart Monitoring and Analytics**
* **Individual Responsibilities**:
  - Architected cross-domain operational analytics aggregations across 24 database collections (`analyticsController.js`).
  - Implemented bed and room occupancy rate calculations and building block density summaries.
  - Built financial revenue reporting, billing collection velocity, and overdue fines tracking.
  - Developed smart utility telemetry ingestion endpoints (`monitoringController.js`) for Water (L) and Electricity (kWh) consumption tracking.
  - Designed sliding 24-hour and 7-day utility trend analysis and consumption anomaly alert mechanisms.
  - Integrated high-performance **Recharts v3.10.1** visualisations across executive and admin portals.
  - Synchronized real-time marketplace food orders with the live vendor kitchen queue.
  - Led group branch integration, pull request reviews, and resolved complex multi-file merge conflicts.
* **Key Source Code Files**:
  - `backend/models/MonitoringReading.js` (+ Cross-collection aggregation queries)
  - `backend/controllers/analyticsController.js`, `monitoringController.js`
  - `backend/routes/analyticsRoutes.js`, `monitoringRoutes.js`
  - `frontend/src/pages/admin/Dashboard.jsx`, `frontend/src/pages/admin/Analytics.jsx`, `frontend/src/pages/executive/ExecutiveDashboard.jsx`, `frontend/src/pages/admin/Monitoring.jsx`
  - `frontend/src/services/analyticsApi.js`
* **Git Version-Control Evidence**:
  - Total Commits: 68 commits (56 as `Mhd-Iz`, 12 as `Mohamed Izni`)
  - Active Branches: `origin/Izni`, `origin/izni`
  - Key Commits:
    - `1fb5d41`: *feat(analytics): connect real backend data and fix notifications & monitoring functionality*
    - `56d9e0b`: *feat: connect live backend analytics, reports, utilities, monitoring, and notifications (#72)*
    - `2f20843`: *feat(vendor): connect all vendor pages to real backend APIs and database*
    - `f8db3c3`: *vender profile page (#71)*
    - `e475a3a`: *feat(marketplace): sync vendor menu additions, stock toggles, and price updates with student marketplace in real-time*
    - `4312d6f`: *feat(marketplace): remove mock vendors and items, show only vendor food, and instantly place live orders to vendor page*
    - `f31ba56`: *Merge origin/main into Izni: resolve all conflicts across vendor controllers and pages*

---

## 9.3 Major Pull Requests and Merge Conflict Resolution Evidence

Branch integration was conducted systematically through GitHub Pull Requests to maintain repository stability. The table below documents major verified integration pull requests:

| PR # | Title / Purpose | Source Branch | Target Branch | Merged By | Key Deliverables & Conflict Resolution Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **#14** | Hostel Room Transfer & Allocation | `Archshana` | `main` | A. Kanesalingam | Integrated foundational room transfer and bed checkout endpoints. |
| **#50** | Security Gate Turnstile Integration | `Hafrath` | `main` | M. H. U. Hafrath | Integrated QR pass issuance, Colombo curfew timezone logic, and turnstile logs. |
| **#70** | Deploy Payments & Invoicing | `deploy-payments` | `main` | Ahamed Nafeesh | Merged two-factor OTP payment workflow and verifiable receipt issuance. |
| **#71** | Vendor Profile Page & Business Ops | `Izni` | `main` | M. I. M. Izni | Integrated commercial vendor profile, emergency contact, and operating hours. |
| **#72** | Connect Backend Analytics & Monitoring | `Izni` | `main` | M. I. M. Izni | Integrated live Recharts analytics dashboards, utility telemetry, and notifications. |
| **#73** | Backend Live Connect | `deploy-payments` | `main` | Ahamed Nafeesh | Resolved CORS credentials and API service baseURL configuration. |
| **#74** | Maintenance & Telemetry Overhaul | `main` | `Izni` | M. I. M. Izni | Unified login authentication, maintenance technician workbench, and analytics. |
| **#75** | Vendor Marketplace Synchronization | `Izni` | `main` | M. I. M. Izni | **Critical Multi-File Merge Conflict Resolution**: Resolved merge conflicts across `backend/controllers/foodOrderController.js`, `frontend/src/pages/vendor/FoodItems.jsx`, `frontend/src/pages/vendor/VendorDashboard.jsx`, `frontend/src/pages/vendor/VendorOrders.jsx`, and `frontend/src/services/vendorApi.js`. Consolidated live order queue synchronization and menu updates (Commit `f31ba56`). |

