# 8. Deployment and Developer Setup Guide

This guide provides a comprehensive, beginner-friendly setup manual for cloning, configuring, building, running, and deploying the **SmartStay — Smart Hostel and Co-Living Management System** on a local development machine or cloud infrastructure.

---

## 8.1 Software Prerequisites

Before setting up SmartStay, ensure the following tools are installed on your host system:

| Prerequisite | Minimum Version | Recommended Version | Verification Command |
| :--- | :--- | :--- | :--- |
| **Node.js** | `>= 20.0.0` | `v22.x LTS` or `v24.x` | `node -v` |
| **npm** | `>= 10.0.0` | `10.8.x+` | `npm -v` |
| **Git** | `>= 2.30.0` | Latest | `git --version` |
| **MongoDB** | `>= 6.0` (or MongoDB Atlas)| `MongoDB 7.0 Community` | `mongod --version` |

---

## 8.2 Repository Cloning and Directory Layout

Clone the repository and inspect the workspace directory structure:

```bash
git clone https://github.com/ANafeesh/SmartStay.git
cd SmartStay/SmartStay
```

Project workspace structure:
```
SmartStay/
├── backend/                  # Express.js REST API Server
│   ├── config/               # Database connection settings
│   ├── controllers/          # 19 Domain logic controllers
│   ├── middleware/           # JWT authentication and RBAC guards
│   ├── models/               # 24 Mongoose database schemas
│   ├── routes/               # 23 Modular REST route files
│   ├── scripts/              # Seed scripts (seedHostelData.js)
│   ├── tests/                # Automated unit test suite
│   ├── .env                  # Environment configuration (create this)
│   ├── package.json          # Backend dependencies
│   └── server.js             # HTTP server entry point
│
├── frontend/                 # React 19 + Vite 8 SPA Client
│   ├── public/               # Public assets and favicon
│   ├── src/
│   │   ├── components/       # Shared UI primitives (Badge, Modal, Button)
│   │   ├── context/          # React AuthContext state provider
│   │   ├── pages/            # 36 Domain page views
│   │   ├── services/         # API HTTP communication client
│   │   ├── App.jsx           # SPA routes and role access guards
│   │   └── main.jsx          # React DOM entry point
│   ├── package.json          # Frontend dependencies
│   └── vite.config.js        # Vite + Tailwind build configuration
```

---

## 8.3 Backend Configuration and Startup

### Step 1: Navigate to Backend Directory
```bash
cd backend
```

### Step 2: Install Node Dependencies
```bash
npm install
```

### Step 3: Configure Environment Variables
Create a `.env` file in `SmartStay/backend/` using the safe template below:

```env
# Server Port Configuration
PORT=5000
NODE_ENV=development

# Database Connection (Local MongoDB or MongoDB Atlas URI)
MONGO_URI=mongodb://localhost:27017/smartstay_db

# Cryptographic Token Secret (Use a strong random 256-bit secret in production)
JWT_SECRET=your_super_secret_jwt_key_smartstay_2026

# Optional: Cloudinary Storage (For maintenance defect images & deposit slips)
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Optional: SMTP Email Transport (For payment OTPs and official alerts)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_institution_email@domain.com
EMAIL_PASS=your_email_app_password
```

### Step 4: Seed Initial Hostel Data (Optional but Recommended)
Populate the database with foundational hostel buildings, demo rooms, bed records, canteen vendors, and default users:
```bash
npm run seed:hostel
```

### Step 5: Start Backend Server
- **Development Mode (with hot-reloading via nodemon)**:
  ```bash
  npm run dev
  ```
- **Standard Node Execution**:
  ```bash
  npm start
  ```
The backend API server will initialize on: `http://localhost:5000`

---

## 8.4 Frontend Configuration and Startup

### Step 1: Open a New Terminal and Navigate to Frontend
```bash
cd SmartStay/SmartStay/frontend
```

### Step 2: Install Node Dependencies
```bash
npm install
```

### Step 3: Configure Frontend Environment Variables (Optional)
By default, the frontend service layer communicates with `http://localhost:5000/api`. If your backend runs on a different port or cloud URL, create a `.env` file in `SmartStay/frontend/`:

```env
VITE_API_URL=http://localhost:5000/api
```

### Step 4: Start Frontend Development Server
```bash
npm run dev
```
The Vite development server will start instantly and output the local URL:
```
  VITE v8.3.0  ready in 280 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

---

## 8.5 Production Build and Deployment

### 8.5.1 Frontend Production Compilation
To compile the React SPA for production deployment:
```bash
cd SmartStay/frontend
npm run build
```
This generates an optimized, minified distribution directory at `SmartStay/frontend/dist/`.

### 8.5.2 Deploying Frontend to Vercel
1. Connect your GitHub repository to [Vercel](https://vercel.com).
2. Configure **Root Directory**: `SmartStay/frontend`.
3. Set **Build Command**: `npm run build`.
4. Set **Output Directory**: `dist`.
5. Add Environment Variable:
   - `VITE_API_URL`: Your deployed backend production URL (e.g., `https://smartstay-api.example.com/api`).
6. Deploy.

### 8.5.3 Deploying Backend to Cloud Platforms (Render / Railway / AWS EC2)
1. Configure Root Directory: `SmartStay/backend`.
2. Build Command: `npm install`.
3. Start Command: `npm start` (`node server.js`).
4. Inject Production Environment Variables:
   - `MONGO_URI`: MongoDB Atlas connection string (`mongodb+srv://...`).
   - `JWT_SECRET`: High-entropy production cryptographic secret.
   - `NODE_ENV`: `production`.
   - `PORT`: Managed by host (defaults to `5000`).

---

## 8.6 Troubleshooting Common Setup Issues

| Symptom / Error | Root Cause | Verified Resolution |
| :--- | :--- | :--- |
| `MongooseServerSelectionError: connect ECONNREFUSED 127.0.0.1:27017` | Local MongoDB service is stopped or not installed. | Start MongoDB service (`net start MongoDB` on Windows or `sudo systemctl start mongod` on Linux) or point `MONGO_URI` to a free MongoDB Atlas cluster. |
| `EADDRINUSE: address already in use :::5000` | Port 5000 is occupied by an orphaned Node process or another app. | Terminate the process holding port 5000 (`Get-Process -Id (Get-NetTCPConnection -LocalPort 5000).OwningProcess \| Stop-Process` on Windows) or change `PORT=5001` in `.env`. |
| `CORS Error: Access to XMLHttpRequest blocked by CORS policy` | Client origin (`localhost:5173`) not permitted by server CORS policy. | Ensure `cors({ origin: true, credentials: true })` in `backend/server.js` is active. |
| Camera scanner shows black screen or permission error | WebRTC camera requires a secure context (HTTPS or localhost). | Open the application strictly on `http://localhost:5173` or deploy behind valid HTTPS/TLS certificates. |
| `EPERM: operation not permitted, mkdir` on Windows | Transient Windows file lock during npm package installation. | Re-run `npm install` in PowerShell with Administrator privileges. |

