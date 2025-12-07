# AgriLink 🌱 — Plantation & Export Management System

Welcome to AgriLink — a modern web dashboard that connects plantation managers and exporters with tools to manage harvests, deals, shipments and reports — all in one place. Designed for clarity, efficiency and scale — AgriLink brings plantation operations to the cloud. 🚜📦🌍

Why AgriLink?
- Centralizes plantation and export workflows
- Makes harvesting, deals, shipments and reporting easy to manage
- Role-based interfaces for plantation users and exporters
- Built with a fast React frontend + Firebase backend for real-time collaboration

✨ Key Features
- Dual-role UI: Plantation managers and Exporters each have tailored dashboards
- Harvest Management: Add, list and inspect harvest records with detail views
- Marketplace / Deals: Accept, manage and confirm deals between parties
- Shipment Tracking: Create and monitor shipments for exported goods
- Reports & Analytics: Quick stats, charts and reports for business insights
- Notifications & Activity Feed: Stay updated on offers, confirmations and shipment changes
- Authentication & Profile Setup: Secure login/signup and rich profile/onboarding flow

Tech Stack
- Frontend: React (JSX components)
- Backend: Firebase (Auth, Firestore / Realtime DB, Storage) — configured in Efirebase.js
- Build: npm / Node.js (typical React toolchain)
- UI: Component-based JSX structure (reusable cards, sidebars, topbars)

Quick Start — Run locally
1. Clone the repo
   git clone https://github.com/Isura-Punsara/AgriLink-Plantation-and-Export-Management-System.git

2. Install dependencies
   cd AgriLink-Plantation-and-Export-Management-System
   npm install

3. Firebase setup
   - Create a Firebase project at https://console.firebase.google.com/
   - Enable Authentication (Email/Password or desired providers)
   - Create a Firestore database or Realtime DB
   - Create a Storage bucket (if app uses file uploads)
   - Copy your Firebase config and add it to Efirebase.js (or set environment variables as needed)

4. Start dev server
   npm start

5. Build for production
   npm run build

Project Structure (high level)
- App.js — app entry (routing & role-driven views)
- Login.jsx, Signup.jsx, ProfileSetup.jsx, Splash.jsx — Authentication & onboarding
- Dashboard.jsx, EDashboard.jsx — Dashboards for users & exporters
- Add_Harvest.jsx, Harvest_List.jsx, harvest_card.jsx, harvest_details.jsx — Harvest flows
- DealRequests.jsx, ConfirmedDeals.jsx, DealDetails.jsx — Deals & marketplace
- EDeals.jsx, EDealsCard.jsx — Exporter deals components
- EShipments.jsx, EShipmentCard.jsx — Export and shipment flows
- Reports.jsx, EReports.jsx — Reporting & analytics
- Notifications.jsx, ENotifications.jsx, ActivityFeed.jsx — Notifications & activity
- Sidebar/Topbar & ESidebar/ETopbar — UI navigation
- Efirebase.js — Firebase init and exports

Tips & Notes
- Check Efirebase.js to wire your Firebase project credentials BEFORE running locally.
- If you plan to deploy, ensure your Firebase rules and env secrets are set securely.
- Want to add new features? Create branch feature/<name> and open a PR with clear description.

Contributing
We ❤️ contributions! Want to help improve AgriLink?
- Fork the repo
- Create a feature branch
- Run tests / linting (if present)
- Open a pull request with a clear description of changes

Thank you for using AgriLink — let's grow smarter together! 🌾🚀
