# Project Monorepo

Welcome to the unified project workspace! This workspace contains both the frontend React Native application and the backend Node.js + Express API, along with scalability folders for databases and documentation.

## Project Structure

```text
Project/
├── frontend/          # React Native app
│   ├── android/
│   ├── ios/
│   ├── src/
│   └── package.json
│
├── backend/           # Node.js + Express API
│   ├── routes/
│   ├── controllers/
│   ├── models/
│   └── package.json
│
├── database/          # Database files/scripts (placeholder)
│
├── docs/              # Documentation files (placeholder)
│
├── .gitignore         # Root gitignore rules
└── README.md          # This README
```

---

## Getting Started

To run both services simultaneously during development, open separate terminals for the frontend and backend.

### Terminal 1: Frontend (React Native)

1. Navigate to the `frontend/` directory:
   ```bash
   cd frontend
   ```
2. Make sure dependencies are installed:
   ```bash
   npm install
   ```
3. Start the Metro Bundler:
   ```bash
   npm start
   ```
4. Build and run the application on your target platform:
   - **Android**: `npm run android`
   - **iOS**: `npm run ios` (Run `bundle install` and `bundle exec pod install` from `frontend/` first on macOS)

---

### Terminal 2: Backend (Node.js + Express)

1. Navigate to the `backend/` directory:
   ```bash
   cd backend
   ```
2. Make sure dependencies are installed:
   ```bash
   npm install
   ```
3. Start the API server in development mode (with auto-reload via `nodemon`):
   ```bash
   npm run dev
   ```
   Or run in production mode:
   ```bash
   npm start
   ```

The backend API will run on http://localhost:5000 by default.

---

## Connectivity: React Native & Backend API

When making requests from the React Native app to the local Express backend, refer to the correct host address depending on your environment:

- **Android Emulator**: Use `http://10.0.2.2:5000`
- **iOS Simulator**: Use `http://localhost:5000`
- **Physical Device**: Use the local IP address of your machine (e.g. `http://192.168.1.X:5000`). Make sure your device is on the same Wi-Fi network.
