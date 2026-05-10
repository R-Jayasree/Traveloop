# ✈️ Traveloop

**Traveloop** is a beautifully designed, all-in-one smart travel planning application built for the **Odoo Hack 2026**. 

Planning a multi-city vacation is often a chaotic mess of scattered spreadsheets, browser tabs, and group chats. Traveloop solves this by unifying your itinerary, budgeting, packing lists, and journaling into one stunning, premium interface.

---

## ✨ Features

- 🔐 **User Authentication**: Secure signup and login flow with JWT and bcrypt.
- 🏠 **Travel Dashboard**: A central hub to view and manage all your upcoming and past trips.
- ✈️ **Trip Creation**: Plan a new trip by setting destinations, travel dates, and adding a custom cover photo.
- 🗺️ **Smart Itinerary Builder**: Search for cities and build a day-by-day visual timeline of your stops.
- 🎢 **Activity Discovery**: Browse a curated catalog of activities for each city and schedule them into your itinerary.
- 📅 **Itinerary View**: A beautiful, structured timeline displaying your cities, dates, and scheduled activities.
- 💰 **Dynamic Budget Breakdown**: Track your estimated and actual costs. Visualized with interactive Pie and Bar charts across categories like Transport, Stay, Meals, and Activities.
- 🎒 **Packing Checklist**: A comprehensive checklist where you can add, categorize, and mark items as packed.
- 📝 **Trip Notes & Journaling**: A dedicated space to jot down flight details, reservation codes, or personal journal entries.
- 🌍 **Public Itinerary Sharing**: Generate a clean, read-only version of your trip to safely share with friends or family without giving edit access.
- 👤 **User Profile**: Manage your account settings or permanently delete your account and associated data.

---

## 🛠️ Tech Stack

**Frontend:**
- React 19
- Vite
- Chart.js & React-Chartjs-2
- Lucide React (Icons)
- Vanilla CSS (Custom Design System)

**Backend:**
- Node.js
- Express.js
- MySQL (Relational Database)
- JSON Web Tokens (JWT Authentication)
- Bcrypt (Password Hashing)

---

## 🚀 Getting Started

Follow these steps to run Traveloop locally on your machine.

### 1. Prerequisites
- [Node.js](https://nodejs.org/) installed
- [MySQL](https://www.mysql.com/) server installed and running (e.g., via XAMPP or MySQL Workbench)

### 2. Database Setup
1. Log into your MySQL server.
2. Create the database and import the schema:
   ```sql
   CREATE DATABASE traveloop;
   USE traveloop;
   SOURCE backend/setup.sql;
   ```

### 3. Backend Setup
1. Open a terminal and navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `backend` directory with the following variables:
   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASS=your_mysql_password
   DB_NAME=traveloop
   JWT_SECRET=your_super_secret_key
   PORT=5000
   ```
4. Start the backend server:
   ```bash
   npm run dev
   ```
   *(The server will run on `http://localhost:5000`)*

### 4. Frontend Setup
1. Open a new terminal and navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to the local URL provided by Vite (usually `http://localhost:5173`).

---

## 💡 How to Use

1. **Sign Up / Login:** Create a new account to access the dashboard.
2. **Plan a New Trip:** Give your trip a name, dates, and a description.
3. **Build the Itinerary:** Click on your trip, add cities, and attach activities.
4. **Manage Costs:** Navigate to the **Budget Breakdown** via the quick-access buttons on your itinerary view. Click "Edit Costs" to allocate your funds and watch the charts update.
5. **Pack & Prep:** Add items to your **Packing Checklist** and jot down **Trip Notes**.
6. **Customize:** Head to your **Account Settings** in the top right to switch between Light and Dark themes!

---

## 🏆 Built for Odoo Hack 2026
Designed and developed with passion to redefine how we explore the world. Happy travels with Traveloop!
