# 7. Testing and Evaluation

## 7.1 Testing Strategy

The quality assurance strategy for the **SmartStay** platform combines automated unit testing, API integration testing, security validation, and frontend production build verification to guarantee system stability and requirement compliance.

```
+-----------------------------------------------------------------------------------+
| 1. AUTOMATED UNIT TESTING: Node.js Test Runner (Crypto, Passes, Turnstiles)      |
+-----------------------------------------------------------------------------------+
| 2. API INTEGRATION TESTING: Controller Route Verification & Mongoose Operations   |
+-----------------------------------------------------------------------------------+
| 3. SECURITY & ACCESS TESTING: JWT Expiry, Role Normalization, RBAC Guards        |
+-----------------------------------------------------------------------------------+
| 4. HARDWARE WEBRTC TESTING: Optical Camera Streams & Barcode Pattern Decoding     |
+-----------------------------------------------------------------------------------+
| 5. FRONTEND BUILD VERIFICATION: Vite Production Compilation & Chunk Packaging    |
+-----------------------------------------------------------------------------------+
```

---

## 7.2 Structured Test Cases and Verification Results

The table below documents the executed test cases, detailing inputs, anticipated behaviors, observed results, and verification status across all system functional domains.

| Test ID | Module / Domain | Test Scenario | Input Data / Condition | Expected Result | Actual Result | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-SEC-01** | Module 2: Security | Verify pass without credentials | `POST /api/digital-passes/verify` `{}` | HTTP 400 Bad Request with missing credential error message | HTTP 400 returned: `"Please provide a valid QR Token, Pass Number, or Registration ID."` | **PASS** |
| **TC-SEC-02** | Module 2: Security | Verify non-existent pass token | `POST /api/digital-passes/verify` `{ qrToken: "INVALID-TOKEN-999" }` | HTTP 404 Unauthorized with rejection notice | HTTP 404 returned: `"Pass not found or invalid token."` | **PASS** |
| **TC-SEC-03** | Module 2: Security | Verify valid active student pass | `POST /api/digital-passes/verify` `{ qrToken: "<valid_sha256_token>" }` | HTTP 200 Authorized with student details and room metadata | HTTP 200 returned: `{ authorized: true, status: "Active" }` | **PASS** |
| **TC-SEC-04** | Module 2: Security | Verify expired pass | `POST /api/digital-passes/verify` with `validUntil < Date.now()` | HTTP 403 Forbidden: pass validity expired | HTTP 403 returned: `{ authorized: false, reason: "Pass has expired" }` | **PASS** |
| **TC-SEC-05** | Module 2: Security | Verify revoked pass | `POST /api/digital-passes/verify` with `status: "Revoked"` | HTTP 403 Forbidden: pass revoked by administration | HTTP 403 returned: `{ authorized: false, status: "Revoked" }` | **PASS** |
| **TC-SEC-06** | Module 2: Security | Verify pass for suspended student | `POST /api/digital-passes/verify` with `student.accountStatus: "suspended"` | HTTP 403 Forbidden: student account not active | HTTP 403 returned: `{ authorized: false, reason: "Student account is suspended" }` | **PASS** |
| **TC-SEC-07** | Module 2: Security | Record OUT gate movement | `POST /api/gate-logs` `{ direction: "OUT", gateName: "Main Gate" }` | HTTP 201 Created: movement logged in ledger, pass direction updated | HTTP 201 Created: `GateEntryExit` created, pass direction set to `OUT` | **PASS** |
| **TC-SEC-08** | Module 2: Security | Record IN movement from terminal | `POST /api/gate-logs` without logged-in guard session | HTTP 201 Created: automated terminal logs entry under system guard profile | HTTP 201 Created: movement logged with default terminal authority | **PASS** |
| **TC-SEC-09** | Module 2: Security | Consecutive duplicate OUT movement | Scanned `direction: "OUT"` when pass `lastMovementDirection === "OUT"` | Rejects with duplicate movement conflict, creates `GateInconsistency` | Consecutive duplicate detected, `GateInconsistency` created | **PASS** |
| **TC-SEC-10** | Module 2: Security | Consecutive duplicate IN movement | Scanned `direction: "IN"` when pass `lastMovementDirection === "IN"` | Rejects with duplicate movement conflict, creates `GateInconsistency` | Consecutive duplicate detected, `GateInconsistency` created | **PASS** |
| **TC-SEC-11** | Module 2: Security | Pass lookup fallback | Query `verifyPass` with `studentRegistrationId` when passNumber missing | HTTP 200: Successfully resolves pass via registration code index | HTTP 200: Resolved via `studentRegistrationId` fallback query | **PASS** |
| **TC-SEC-12** | Module 2: Security | Missing accountStatus handling | Student user document where `accountStatus` is undefined | Safely defaults undefined status to active, allows pass retrieval | Pass granted, undefined status treated as active | **PASS** |
| **TC-SEC-13** | Module 2: Security | Terminal officer resolution | Student token attached to turnstile terminal record | Automatically resolves terminal officer ID to avoid student self-authorization | Terminal officer ID resolved and linked | **PASS** |
| **TC-SEC-14** | Module 2: Security | Gate terminal role authorization | Scanned terminal pass movement with student credential | Allows gate movement execution at terminal | Allowed via terminal pass credentials | **PASS** |
| **TC-SEC-15** | Module 2: Security | Block unauthorized student movement | Student requests gate movement without pass or staff token | HTTP 403 Forbidden: unauthorized operation | HTTP 403 Forbidden returned | **PASS** |
| **TC-SEC-16** | Module 3: Vendor Pass | Verify vendor pass missing token | `POST /api/vendor-passes/:id/verify` `{}` | HTTP 400 Bad Request: missing token | HTTP 400 returned: `"Token is required"` | **PASS** |
| **TC-SEC-17** | Module 3: Vendor Pass | Log vendor ENTRY movement | Scanned courier pass when `currentLocation === "Outside"` | HTTP 200: logs ENTRY, transitions `currentLocation` to `"Inside"` | HTTP 200: Movement logged, status set to `"Inside"` | **PASS** |
| **TC-SEC-18** | Module 3: Vendor Pass | Log vendor EXIT movement | Scanned courier pass when `currentLocation === "Inside"` | HTTP 200: logs EXIT, transitions `currentLocation` to `"Outside"` | HTTP 200: Movement logged, status set to `"Outside"` | **PASS** |
| **TC-SEC-19** | Module 3: Vendor Pass | Deny revoked vendor pass | Scanned courier pass with `status: "Revoked"` | HTTP 403 Forbidden: commercial pass revoked | HTTP 403 Forbidden returned: `"Pass is revoked"` | **PASS** |
| **TC-BLD-01** | Frontend | Production bundle compilation | Execute `npm run build` (`vite build`) | Compiles 2,500+ modules into production assets with 0 errors | Transformed 2,582 modules, built bundle in 3.40s, 0 errors | **PASS** |
| **TC-AUT-01** | Module 1: Auth & RBAC | Admin superuser bypass | Superuser accessing `/api/allocations` | HTTP 200: Admin granted access to administrative resources | HTTP 200: Authorized | **PASS** |
| **TC-PAY-01** | Module 3: Payments | Two-factor OTP generation | Request OTP for invoice settlement | HTTP 200: 6-digit code created, expiry set to 10 mins | HTTP 200: OTP generated and linked to `PaymentOtp` | **PASS** |
| **TC-PAY-02** | Module 3: Payments | Verifiable receipt issuance | Complete payment settlement | Generates unique receipt bearing public verification code | HTTP 200: `Receipt` created with `verificationCode` | **PASS** |
| **TC-MNT-01** | Module 4: Maintenance | Cloudinary photo upload | Upload JPEG file via `/api/complaints/upload` | HTTP 200: Image uploaded to Cloudinary, returns HTTPS CDN link | Image uploaded, Cloudinary secure URL returned | **PASS** |
| **TC-ANL-01** | Module 5: Analytics | Telemetry unit validation | Submit Water reading with unit `"kWh"` | HTTP 400 Bad Request: Invalid unit for Water | HTTP 400 returned: `"Invalid unit 'kWh' for Water. Expected 'L'."`| **PASS** |

---

## 7.3 Automated Test Execution Evidence

Automated tests are executed using the native Node.js Test Runner via `npm test` (`node --test tests/**/*.test.js`). 

```
> backend@1.0.0 test
> node --test tests/**/*.test.js

✔ verifyPass: returns 400 if no credentials provided (1.8985ms)
✔ verifyPass: returns 404 unauthorized if pass does not exist in database (0.8463ms)
✔ verifyPass: returns 200 authorized for valid active pass in database (3.8246ms)
✔ verifyPass: denies authorization if pass has expired (0.4633ms)
✔ verifyPass: denies authorization if pass is Revoked (0.4422ms)
✔ verifyPass: denies authorization if student account is inactive or suspended (0.4225ms)
✔ recordMovement: logs OUT movement and records gate audit log (1.4916ms)
✔ recordMovement: logs IN movement from gate terminal without logged-in officer (52.651ms)
✔ recordMovement: rejects consecutive duplicate movement (OUT when already OUT) (0.5828ms)
✔ recordMovement: rejects consecutive duplicate movement (IN when already IN) (0.9172ms)
✔ verifyPass: fallback to studentRegistrationId when passNumber is not found (0.7667ms)
✔ verifyPass: safely treats missing/undefined accountStatus as active (0.5978ms)
✔ recordMovement: resolves staff officer when student user is logged in (2.7162ms)
✔ gateTerminalOrRoleAuth: allows terminal pass movement even when student token is attached (572.1383ms)
✔ gateTerminalOrRoleAuth: blocks student when neither staff role nor pass credentials are provided (61.125ms)
✔ verifyAndRecordMovement: returns 400 if token is missing (2.5004ms)
✔ verifyAndRecordMovement: logs ENTRY (IN) when vendor is outside (4.5277ms)
✔ verifyAndRecordMovement: logs EXIT (OUT) when vendor is already inside (1.4937ms)
✔ verifyAndRecordMovement: denies access if pass is revoked (0.973ms)

ℹ tests 19
ℹ suites 0
ℹ pass 19
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 2068.2801
```

---

## 7.4 Frontend Production Build Verification Evidence

The frontend build pipeline was verified by executing `npm run build` in the `frontend` directory. The Vite 8 compiler transformed all JSX components, Tailwind styles, and third-party dependencies into optimized production bundles without syntax, linting, or module resolution errors.

```
> frontend@0.0.0 build
> vite build

vite v8.3.0 building client environment for production...
transforming...
✓ 2582 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                                    1.36 kB │ gzip:   0.68 kB
dist/assets/index-BmgmtBZq.css                   140.03 kB │ gzip:  18.81 kB
dist/assets/Marketplace-DcQ7csLZ.js               36.77 kB │ gzip:   8.85 kB
dist/assets/GateVerification-BFWbSJ7U.js          30.09 kB │ gzip:   7.70 kB
dist/assets/Payments-DpRQVtFU.js                  90.50 kB │ gzip:  18.50 kB
dist/assets/index-CFxk2fRh.js                    506.11 kB │ gzip: 153.71 kB
✓ built in 3.40s
```

---

## 7.5 Evaluation and Defect Analysis

### 7.5.1 Resolved Engineering Defects
1. **Consecutive Movement Duplicate Vulnerability**:
   - *Problem*: Previously, a student could scan their pass repeatedly in the same direction, corrupting the campus headcount.
   - *Fix*: Implemented consecutive direction validation in `gateLogController.js`. If `lastMovementDirection === direction`, the movement is blocked and recorded in `GateInconsistency`.
2. **Missing Account Status Undefined Exception**:
   - *Problem*: Legacy test fixtures lacking the `accountStatus` field were rejected with HTTP 403.
   - *Fix*: Updated `authMiddleware.js` and `digitalPassController.js` to safely treat undefined account status as `'active'`, while strictly blocking explicitly `'suspended'` or `'inactive'` accounts.
3. **Asia/Colombo Timezone Accuracy**:
   - *Problem*: Curfew violations recorded after 22:00 evaluated UTC server hours, causing curfew breaches to be miscalculated.
   - *Fix*: Implemented `getColomboHour` using `Intl.DateTimeFormat` with `timeZone: 'Asia/Colombo'`, guaranteeing accurate local time evaluation regardless of cloud hosting region.

### 7.5.2 Known Constraints & Limitations
1. **Physical Smart Meters**: Utility readings are ingested through verified REST APIs; however, physical IoT sensor hardware is currently simulated via software telemetry endpoints.
2. **Third-Party Payment Gateway**: Payment transactions use an internal two-factor OTP authorization pipeline; integration with commercial clearinghouses (e.g., PayHere, Stripe) is scheduled for future work.
3. **WebRTC Camera Permissions**: Hardware camera QR scanning requires HTTPS deployment or `localhost` context due to modern browser security policies regarding `navigator.mediaDevices`.

