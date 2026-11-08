# API Documentation and Specification Catalogue

## Overview
The SmartStay backend exposes a stateless RESTful API structured across **23 route controllers** and **125 distinct endpoints**. All communication uses JSON over HTTP/HTTPS, with standard HTTP response codes and a uniform JSON response envelope:
```json
{
  "success": true,
  "message": "Human-readable status description",
  "data": { ... }
}
```

---

## 1. Authentication & Profile Management (`/api/auth`)

| Method | Endpoint | Access / Role | Description | Request Body / Params | Status Codes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/login` | Public | Authenticates user credentials, returns JWT token and user profile | `{ email, password }` | 200, 400, 401 |
| `POST` | `/api/auth/register` | Admin | Registers a new institutional user account | `{ name, email, password, role, registrationNumber, ... }` | 201, 400, 409 |
| `POST` | `/api/auth/logout` | Authenticated | Clears authentication session / cookie | None | 200 |
| `GET` | `/api/auth/me` | Authenticated | Fetches profile context of the currently logged-in user | Bearer Token / Cookie | 200, 401 |
| `PUT` | `/api/auth/profile` | Authenticated | Updates current user's profile information | `{ name, phone, room, building }` | 200, 400, 401 |
| `PUT` | `/api/auth/change-password` | Authenticated | Cryptographically updates user password using bcrypt | `{ currentPassword, newPassword }` | 200, 400, 401 |

---

## 2. Infrastructure & Room Allocation Management

### 2.1 Buildings (`/api/buildings`)
| Method | Endpoint | Access / Role | Description | Request Body / Params | Status Codes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/buildings` | Authenticated | Lists all campus residential buildings | None | 200, 401 |
| `GET` | `/api/buildings/:id` | Authenticated | Retrieves building details by ID | Route param `:id` | 200, 404 |
| `POST` | `/api/buildings` | Admin | Registers a new building block | `{ name, code, floors, description }` | 201, 400 |
| `PUT` | `/api/buildings/:id` | Admin | Updates building specifications | `{ name, address, floors, isActive }` | 200, 400, 404 |
| `DELETE` | `/api/buildings/:id` | Admin | Deactivates or removes a building record | Route param `:id` | 200, 404 |

### 2.2 Rooms (`/api/rooms`)
| Method | Endpoint | Access / Role | Description | Request Body / Params | Status Codes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/rooms` | Authenticated | Lists all dormitory rooms with filtering options | Query: `?buildingId=&status=&floor=` | 200, 401 |
| `GET` | `/api/rooms/:id` | Authenticated | Retrieves single room record with bed breakdown | Route param `:id` | 200, 404 |
| `POST` | `/api/rooms` | Admin / Warden | Adds a new room and auto-generates bed records | `{ buildingId, roomNumber, floor, capacity, roomType }` | 201, 400 |
| `PUT` | `/api/rooms/:id` | Admin / Warden | Updates room status or capacity parameters | `{ roomType, status, capacity, isActive }` | 200, 400, 404 |
| `DELETE` | `/api/rooms/:id` | Admin | Deletes or deactivates room record | Route param `:id` | 200, 404 |

### 2.3 Beds (`/api/beds`)
| Method | Endpoint | Access / Role | Description | Request Body / Params | Status Codes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/beds` | Authenticated | Lists bed inventory across rooms | Query: `?roomId=&status=` | 200, 401 |
| `GET` | `/api/beds/:id` | Authenticated | Retrieves specific bed record | Route param `:id` | 200, 404 |
| `POST` | `/api/beds` | Admin / Warden | Creates an individual bed in a room | `{ roomId, bedNumber, status }` | 201, 400 |
| `PUT` | `/api/beds/:id` | Admin / Warden | Modifies bed operational status | `{ status, isActive }` | 200, 400, 404 |
| `DELETE` | `/api/beds/:id` | Admin | Removes a bed record | Route param `:id` | 200, 404 |

### 2.4 Allocations (`/api/allocations`)
| Method | Endpoint | Access / Role | Description | Request Body / Params | Status Codes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/allocations/my-allocation` | Student | Fetches active room lease for current student | Bearer Token | 200, 404 |
| `GET` | `/api/allocations` | Admin / Warden | Lists all student bed allocations | Query: `?status=&roomId=` | 200, 403 |
| `GET` | `/api/allocations/:id` | Admin / Warden | Retrieves full contract details for an allocation | Route param `:id` | 200, 404 |
| `POST` | `/api/allocations` | Admin / Warden | Assigns a student to a room and bed | `{ studentRegistrationId, studentName, roomId, bedId }` | 201, 400, 409 |
| `PUT` | `/api/allocations/:id` | Admin / Warden | Modifies allocation contract terms | `{ roomId, bedId, status, notes }` | 200, 400, 404 |
| `PATCH` | `/api/allocations/:id/checkout`| Admin / Warden | Checks out student, freeing the reserved bed | Route param `:id` | 200, 400 |

### 2.5 Transfers (`/api/transfers`)
| Method | Endpoint | Access / Role | Description | Request Body / Params | Status Codes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/transfers` | Authenticated | Lists room transfer requests | Query: `?status=&urgency=` | 200, 401 |
| `GET` | `/api/transfers/:id` | Authenticated | Retrieves transfer petition details | Route param `:id` | 200, 404 |
| `POST` | `/api/transfers` | Student | Submits a room relocation petition | `{ toRoomId, toBedId, reason, reasonCategory, urgency }`| 201, 400 |
| `PATCH` | `/api/transfers/:id/approve` | Admin / Warden | Approves transfer and swaps bed assignments | `{ wardenNotes }` | 200, 400, 404 |
| `PATCH` | `/api/transfers/:id/reject` | Admin / Warden | Rejects transfer request with explanation | `{ wardenNotes }` | 200, 400, 404 |
| `DELETE` | `/api/transfers/:id` | Student / Admin | Cancels pending transfer petition | Route param `:id` | 200, 400 |

---

## 3. Student Security & Digital Pass Management

### 3.1 Digital Passes (`/api/digital-passes`)
| Method | Endpoint | Access / Role | Description | Request Body / Params | Status Codes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/digital-passes/my-pass` | Student | Fetches or auto-initializes the active QR digital pass | Bearer Token | 200, 403 |
| `POST` | `/api/digital-passes/verify` | Security / Admin | Verifies a scanned QR token string | `{ qrToken, passNumber, studentRegistrationId }` | 200, 400, 404 |
| `GET` | `/api/digital-passes/verify` | Security / Admin | Query-param variant of pass verification | Query: `?token=&passNumber=` | 200, 400, 404 |
| `GET` | `/api/digital-passes` | Admin / Security | Lists student passes with pagination & filters | Query: `?status=&search=&page=&limit=` | 200, 403 |
| `GET` | `/api/digital-passes/:id` | Admin / Security | Retrieves pass details by ID | Route param `:id` | 200, 404 |
| `PATCH` | `/api/digital-passes/:id/status`| Admin / Warden | Updates pass state (`Active`, `Suspended`, `Revoked`) | `{ status, remarks }` | 200, 400 |
| `POST` | `/api/digital-passes/:id/reissue`| Admin / Warden | Reissues new cryptographic pass token | Route param `:id` | 200, 400 |

### 3.2 Gate Turnstile Logs (`/api/gate-logs`)
| Method | Endpoint | Access / Role | Description | Request Body / Params | Status Codes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/gate-logs` | Security / Admin | Records student physical gate crossing (IN/OUT) | `{ qrToken, direction, gateName, remarks }` | 201, 400, 409 |
| `POST` | `/api/gate-logs/reconcile` | Security / Admin | Reconciles pending side effects and state failures | `{ operationId }` | 200, 400 |
| `GET` | `/api/gate-logs/inconsistencies` | Security / Admin | Retrieves consecutive duplicate movement logs | Query: `?resolved=&limit=` | 200, 403 |
| `GET` | `/api/gate-logs` | Security / Admin | Lists perimeter movement history | Query: `?direction=&gateName=&from=&to=` | 200, 403 |
| `GET` | `/api/gate-logs/my-logs` | Student | Retrieves personal perimeter movement history | Bearer Token | 200, 401 |

### 3.3 Leave Requests (`/api/leave-requests`)
| Method | Endpoint | Access / Role | Description | Request Body / Params | Status Codes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/leave-requests` | Student | Submits an overnight or vacation leave petition | `{ departureDate, expectedReturnDate, reason, ... }` | 201, 400 |
| `GET` | `/api/leave-requests/my-requests` | Student | Fetches student's personal leave requests | Bearer Token | 200, 401 |
| `GET` | `/api/leave-requests` | Admin / Warden | Lists all submitted leave requests | Query: `?status=&page=` | 200, 403 |
| `GET` | `/api/leave-requests/:id` | Authenticated | Retrieves leave request details | Route param `:id` | 200, 404 |
| `PATCH` | `/api/leave-requests/:id/status`| Admin / Warden | Approves or rejects student leave | `{ status: "Approved"|"Rejected", wardenRemarks }` | 200, 400 |
| `PATCH` | `/api/leave-requests/:id/cancel`| Student | Cancels a pending leave request | Route param `:id` | 200, 400 |

### 3.4 Visitors (`/api/visitors`)
| Method | Endpoint | Access / Role | Description | Request Body / Params | Status Codes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/visitors` | Security / Student | Pre-registers an expected campus visitor | `{ visitorName, nicOrPassport, relationship, ... }` | 201, 400 |
| `GET` | `/api/visitors` | Security / Admin | Lists visitor entry logs and expected guests | Query: `?status=&date=` | 200, 403 |
| `GET` | `/api/visitors/my-visitors` | Student | Lists visitors registered by current student | Bearer Token | 200, 401 |
| `GET` | `/api/visitors/:id` | Authenticated | Retrieves visitor profile | Route param `:id` | 200, 404 |
| `PATCH` | `/api/visitors/:id/check-in` | Security | Logs visitor physical entry at security gate | `{ gateName, remarks }` | 200, 400 |
| `PATCH` | `/api/visitors/:id/check-out` | Security | Logs visitor physical departure | Route param `:id` | 200, 400 |
| `PATCH` | `/api/visitors/:id/deny` | Security | Denies campus entry to visitor | `{ remarks }` | 200, 400 |

### 3.5 Disciplinary Violations (`/api/violations`)
| Method | Endpoint | Access / Role | Description | Request Body / Params | Status Codes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/violations` | Security / Warden | Files a disciplinary violation against a student | `{ studentId, violationType, severity, description, fineAmount }`| 201, 400 |
| `GET` | `/api/violations` | Admin / Warden | Lists all filed violations across the campus | Query: `?severity=&status=` | 200, 403 |
| `GET` | `/api/violations/my-violations` | Student | Lists disciplinary records for current student | Bearer Token | 200, 401 |
| `GET` | `/api/violations/:id` | Authenticated | Retrieves violation case details | Route param `:id` | 200, 404 |
| `PATCH` | `/api/violations/:id/status` | Admin / Warden | Updates disciplinary case status or fine waiver | `{ status, actionTaken, fineStatus }` | 200, 400 |

---

## 4. Catering, Food Ordering & Marketplace

### 4.1 Canteen Menus (`/api/menus`)
| Method | Endpoint | Access / Role | Description | Request Body / Params | Status Codes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/menus` | Public / Student | Lists available meal items in marketplace | Query: `?category=&isVeg=&isHalal=&available=` | 200 |
| `GET` | `/api/menus/:id` | Authenticated | Retrieves details of single menu item | Route param `:id` | 200, 404 |
| `POST` | `/api/menus` | Vendor / Admin | Adds a new meal item to vendor catalog | `{ itemId, name, price, category, isHalal, isVeg, image }` | 201, 400 |
| `PUT` | `/api/menus/:id` | Vendor / Admin | Updates meal pricing, availability or details | `{ price, available, prepTime, description }` | 200, 400 |
| `DELETE` | `/api/menus/:id` | Vendor / Admin | Removes a meal item from catalog | Route param `:id` | 200, 404 |

### 4.2 Food Orders (`/api/food-orders`)
| Method | Endpoint | Access / Role | Description | Request Body / Params | Status Codes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/food-orders` | Student | Places a new food order with delivery window | `{ vendorId, items, deliverySlotId, deliveryLocation, paymentMethod }`| 201, 400 |
| `GET` | `/api/food-orders` | Authenticated | Lists orders for student or kitchen queue | Query: `?status=&vendorId=` | 200, 401 |
| `GET` | `/api/food-orders/:id` | Authenticated | Retrieves order receipt and ticket breakdown | Route param `:id` | 200, 404 |

### 4.3 Vendors & Kitchen Ops (`/api/vendors`)
| Method | Endpoint | Access / Role | Description | Request Body / Params | Status Codes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/vendors/profile` | Vendor | Fetches commercial profile of the logged-in vendor | Bearer Token | 200, 401 |
| `PUT` | `/api/vendors/profile` | Vendor | Updates business phone, hours, and delivery terms | `{ phone, ownerName, deliveryTime, categories }` | 200, 400 |
| `GET` | `/api/vendors/earnings` | Vendor | Fetches daily revenue breakdown and settlement history | Bearer Token | 200, 401 |
| `POST` | `/api/vendors/request-payout`| Vendor | Submits a disbursement payout petition | `{ amount, bankAccount }` | 200, 400 |
| `GET` | `/api/vendors` | Authenticated | Lists approved commercial catering outlets | Query: `?status=Active` | 200 |
| `GET` | `/api/vendors/:id` | Authenticated | Retrieves vendor public profile | Route param `:id` | 200, 404 |
| `POST` | `/api/vendors` | Admin | Registers a new commercial canteen operator | `{ vendorId, name, ownerName, email, phone }` | 201, 400 |
| `PUT` | `/api/vendors/:id` | Admin | Modifies vendor license or hygiene grade | `{ hygieneGrade, status }` | 200, 400 |
| `DELETE` | `/api/vendors/:id` | Admin | Revokes commercial vendor license | Route param `:id` | 200, 404 |

### 4.4 Vendor Delivery Passes (`/api/vendor-passes`)
| Method | Endpoint | Access / Role | Description | Request Body / Params | Status Codes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/vendor-passes/active` | Vendor / Security | Retrieves active gate pass for commercial delivery courier | Query: `?vendorId=` | 200, 404 |
| `GET` | `/api/vendor-passes` | Security / Admin | Lists all issued commercial rider passes | Query: `?status=` | 200, 403 |
| `POST` | `/api/vendor-passes` | Vendor / Admin | Registers a courier rider and generates QR gate pass | `{ deliveryPerson, riderNic, vehicleNo, validUntil }` | 201, 400 |
| `POST` | `/api/vendor-passes/:id/verify` | Security | Verifies commercial rider pass at perimeter gate | `{ gateName, direction }` | 200, 400 |
| `PATCH` | `/api/vendor-passes/:id/revoke` | Admin / Security | Revokes courier delivery clearance | Route param `:id` | 200, 400 |

---

## 5. Billing, Payments & Digital Receipts

### 5.1 Invoicing (`/api/bills`)
| Method | Endpoint | Access / Role | Description | Request Body / Params | Status Codes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/bills` | Finance / Admin | Generates student invoice for accommodation or dues | `{ studentId, title, amount, dueDate, billType }` | 201, 400 |
| `GET` | `/api/bills` | Finance / Admin | Lists student billing invoices with payment filters | Query: `?status=&billType=&studentId=` | 200, 403 |
| `GET` | `/api/bills/student/:studentId`| Authenticated | Retrieves all invoices belonging to a specific student | Route param `:studentId` | 200, 401 |
| `GET` | `/api/bills/:id` | Authenticated | Retrieves invoice details by ID | Route param `:id` | 200, 404 |
| `PATCH` | `/api/bills/:id` | Finance / Admin | Modifies invoice status, due date, or late fee | `{ status, lateFee, dueDate }` | 200, 400 |

### 5.2 Payments (`/api/payments`)
| Method | Endpoint | Access / Role | Description | Request Body / Params | Status Codes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/payments/request-otp` | Student | Generates and emails 6-digit payment verification OTP | `{ billId, amount }` | 200, 400 |
| `POST` | `/api/payments/verify-otp` | Student | Verifies OTP code, settles bill, and issues receipt | `{ billId, otp, method }` | 200, 400 |
| `POST` | `/api/payments/deposit-slip` | Student | Submits offline bank slip proof with receipt upload | Multipart/form-data: `{ billId, slipImage }` | 200, 400 |
| `POST` | `/api/payments` | Authenticated | Direct payment record creation | `{ billId, amount, method, reference }` | 201, 400 |
| `GET` | `/api/payments` | Finance / Admin | Lists payment ledger transactions | Query: `?status=&method=&page=` | 200, 403 |
| `GET` | `/api/payments/:id` | Authenticated | Retrieves single payment record | Route param `:id` | 200, 404 |
| `PATCH` | `/api/payments/:id/status` | Finance / Admin | Approves or rejects offline deposit slip payment | `{ status: "Success"|"Failed", failureReason }` | 200, 400 |

### 5.3 Receipts (`/api/receipts`)
| Method | Endpoint | Access / Role | Description | Request Body / Params | Status Codes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/receipts` | Authenticated | Lists digital receipts issued to student | Query: `?studentId=` | 200, 401 |
| `GET` | `/api/receipts/:receiptNo` | Authenticated | Retrieves formatted digital receipt | Route param `:receiptNo` | 200, 404 |
| `POST` | `/api/receipts/:receiptNo/verify`| Public | Cryptographically verifies receipt verification code | Route param `:receiptNo` | 200, 404 |

---

## 6. Maintenance & Smart Facilities Telemetry

### 6.1 Complaints (`/api/complaints`)
| Method | Endpoint | Access / Role | Description | Request Body / Params | Status Codes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/complaints/upload` | Student | Uploads defect photo to Cloudinary CDN | Multipart file: `image` | 200, 400 |
| `POST` | `/api/complaints` | Student | Submits new maintenance defect ticket | `{ title, category, priority, description, building, room, images }`| 201, 400 |
| `GET` | `/api/complaints` | Authenticated | Lists maintenance tickets with filtering options | Query: `?status=&priority=&category=&studentId=` | 200, 401 |
| `GET` | `/api/complaints/:id` | Authenticated | Retrieves ticket details and resolution trail | Route param `:id` | 200, 404 |

### 6.2 Utility Monitoring Telemetry (`/api/monitoring`)
| Method | Endpoint | Access / Role | Description | Request Body / Params | Status Codes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/monitoring` | Authenticated | Lists time-series utility meter readings | Query: `?utilityType=&blockName=&limit=` | 200, 401 |
| `GET` | `/api/monitoring/latest` | Authenticated | Fetches latest consumption readings across blocks | None | 200, 401 |

### 6.3 Operational Analytics & KPI Telemetry (`/api/analytics`)
| Method | Endpoint | Access / Role | Description | Request Body / Params | Status Codes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/analytics/summary` | Admin / Executive | Aggregates high-level campus KPI metrics | None | 200, 403 |
| `GET` | `/api/analytics/blocks` | Admin / Executive | Aggregates occupancy & utility load by block | None | 200, 403 |
| `GET` | `/api/analytics/occupancy` | Admin / Executive | Detailed room & bed occupancy calculations | None | 200, 403 |
| `GET` | `/api/analytics/financial` | Admin / Executive | Revenue collection breakdown and cash flow trends | Query: `?period=monthly` | 200, 403 |
| `GET` | `/api/analytics/complaints` | Admin / Executive | Maintenance resolution velocity and categories | None | 200, 403 |
| `GET` | `/api/analytics/telemetry-trend`| Admin / Executive | 24-hour and 7-day utility consumption trends | Query: `?utilityType=Water|Electricity` | 200, 403 |
| `GET` | `/api/analytics/alerts` | Admin / Executive | Lists active consumption leaks and security alerts | None | 200, 403 |
| `GET` | `/api/analytics/food-orders` | Admin / Executive | Cafeteria sales metrics and peak order windows | None | 200, 403 |

