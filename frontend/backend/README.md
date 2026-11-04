# SmartStay backend

## Setup

Set `MONGO_URI` in `backend/.env`, then run `npm run dev` from the `backend`
directory. The API listens on port `5000` by default.

All successful responses use `{ "success": true, "data": ... }`; list responses
also include `count`. Errors use `{ "success": false, "message": ... }`.

## Bills and payments

- `POST /api/bills`, `GET /api/bills`, `GET /api/bills/:id`,
  `GET /api/bills/student/:studentId`, `PATCH /api/bills/:id`
- `POST /api/payments` with `{ "billId": "...", "method": "Card" }` creates a
  **Pending** payment for the bill's amount plus late fee. Supported methods:
  `Card`, `Bank Transfer`, `Wallet`, `Cash`, `Other`, `Credit / Debit Card
  (Visa)`, `LankaPay Online Banking`, `Bank Transfer / Slip`, and
  `SmartStay Campus Wallet`.
- `GET /api/payments?studentId=...&billId=...&status=...`,
  `GET /api/payments/:id`, and `PATCH /api/payments/:id/status` with
  `{ "status": "Success", "reference": "gateway-reference" }` or
  `{ "status": "Failed", "failureReason": "..." }`.
- Payment status confirmation is intended to be called only after an external
  payment provider confirms the transaction. This backend does not collect card
  details or integrate with a payment gateway. Successful confirmation marks
  the bill paid, generates one receipt, and creates a notification.
- `GET /api/receipts?studentId=...&billId=...`,
  `GET /api/receipts/:receiptNo`, and
  `POST /api/receipts/:receiptNo/verify` with
  `{ "verificationCode": "..." }`. The verification code is only returned when
  the payment is confirmed; receipt reads do not expose it.
- `GET /api/payment-notifications?recipientId=...&unread=true`,
  `POST /api/payment-notifications`, `PATCH /api/payment-notifications/:id/read`,
  and `DELETE /api/payment-notifications/:id`.

## Vendors, menus, and food orders

- `/api/vendors` and `/api/menus` support `GET`, `POST`, `GET /:id`, `PUT /:id`,
  and `DELETE /:id`. Vendor list filters: `vendorId`, `status`; menu filters:
  `vendorId`, `category`, `available`.
- `/api/delivery-slots` supports the same CRUD methods. Create slots with
  `vendorId` (optional for a shared slot), `label`, `startsAt`, `endsAt`, and
  `capacity`. A slot must end after it starts and its capacity cannot be lower
  than existing reservations.
- `POST /api/food-orders` accepts `studentId`, `studentName`, `regNo`,
  `vendorId`, `deliverySlotId`,
  `deliveryLocation`, `paymentMethod`, and `items: [{ "menuItemId": "...",
  "qty": 1 }]`. Menu prices, vendor details, subtotal, and total are calculated
  by the server. The slot reservation is capacity checked.
- `GET /api/food-orders?studentId=...&vendorId=...&status=...`,
  `GET /api/food-orders/:id`, and
  `PATCH /api/food-orders/:id/status` with a valid next status. Cancellation
  releases its slot reservation. Order updates create notifications.

## Vendor QR passes

- `POST /api/vendor-passes` accepts `vendorId`, `deliveryPerson`, `validUntil`,
  and optional `validFrom`, `riderNic`, `vehicleNo`, `vehicleType`, and
  `authorizedZones`.
- The response returns a cryptographically random `qrToken` once. Store that
  value in the QR code; only its SHA-256 hash is stored in MongoDB.
- `GET /api/vendor-passes?vendorId=...&status=...`,
  `GET /api/vendor-passes/:id`, `POST /api/vendor-passes/:id/verify` with
  `{ "token": "...", "gate": "...", "dropZone": "..." }`, and
  `PATCH /api/vendor-passes/:id/revoke`.
- Every verification attempt is logged. Tokens are not returned by list/read
  endpoints.
