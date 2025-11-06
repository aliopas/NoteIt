🗒️ NoteIt – Personal Notes App

NoteIt is a full-stack notes management web application built using React, Node.js, Express, and CockroachDB.
This is the first release (v1.0) — a foundational version designed to establish the app’s main structure, logic, and user flow.
Future versions will expand on interactivity, database management, and advanced features.

🚀 Overview

NoteIt allows users to manage their personal notes efficiently through a clean and modern interface.
Each note can belong to a category, helping organize ideas, reminders, and important information with ease.

Core functionalities include:

Registering and logging into an account.

Creating, editing, and deleting notes.

Organizing notes into categories.

Searching through notes and categories.

A smooth, responsive interface with dark/light mode and toast notifications.

🧩 Tech Stack
Layer	Technologies
Frontend	React, React Router, React Query, Tailwind CSS
Backend	Node.js, Express.js
Database	CockroachDB (SQL-based, PostgreSQL compatible)
Authentication	JWT (JSON Web Tokens)
State Management / Caching	React Query
UI / UX	Tailwind CSS + ShadCN-inspired components
Deployment (Planned)	Frontend → Vercel / Backend → Render / Database → Cockroach Cloud
🧠 Current Features (v1.0)

✅ User Authentication (Register / Login / Logout)
✅ Notes & Categories System
✅ Add / Edit / Delete Notes
✅ Create new categories dynamically
✅ Search popup for notes & categories
✅ Toast notifications for success and error messages
✅ Validation for inputs and forms
✅ Protected routes (redirect unauthorized users to login)
✅ Loading and error states for better UX
✅ Dark / Light mode support

🧱 Planned Features (v2.0 & Future Updates)

🚧 Edit and Delete Categories
🚧 User Profile Page (with avatar upload and personal info)
🚧 Advanced Search Filters (by title, content, date, or category)
🚧 Pin / Archive Notes feature
🚧 Responsive Dashboard Enhancements
🚧 Backend Performance Optimization
🚧 Full Deployment (Vercel + Render + Cockroach Cloud)
🚧 Integration with AI assistant for smart note organization (future vision)

⚙️ Installation & Setup
1️⃣ Clone the repository
git clone https://github.com/yourusername/noteit.git
cd noteit

2️⃣ Install dependencies
# Frontend
cd my-project
npm install

# Backend
cd ../server
npm install

3️⃣ Create environment variables

Backend .env example:

PORT=5000
DATABASE_URL=your_cockroachdb_connection_string
JWT_SECRET=your_secret_key

4️⃣ Run the project locally

Backend:

npm run dev


Frontend:

npm start


Access your app:

Frontend → http://localhost:3000
Backend → http://localhost:5000

🧾 Folder Structure
NoteIt/
├── client/              # React Frontend
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── hooks/       # Custom hooks (useAuth, useUserData)
│   │   ├── pages/       # Main app pages (Dashboard, Login, Create, etc.)
│   │   └── utils/       # API functions (Axios)
│   └── ...
└── server/              # Express Backend
    ├── routes/          # API route definitions
    ├── controllers/     # Business logic for routes
    ├── middleware/      # JWT authentication middleware
    ├── db/              # CockroachDB setup
    └── ...

📅 Upcoming Updates

Next Version (v2.0) will focus on:

Category editing and deletion.

Improved UI interactions and smoother transitions.

Enhancing the search popup and filtering system.

Full deployment with database integration on Cockroach Cloud.

👨‍💻 About the Developer

Developed by: Ali alaa
Role: Full-Stack Developer
Skills: React, Node.js, Express, Tailwind CSS, React Query,pg, CockroachDB
Focus: Building modern, intelligent, and scalable full-stack web applications.
Portfolio: Coming soon
Contact: Coming soon 
