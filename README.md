# ✈️ Traveloop

**Traveloop** is a beautifully designed, all-in-one smart travel planning application built for the **Odoo Hack 2026**. 

Planning a multi-city vacation is often a chaotic mess of scattered spreadsheets, browser tabs, and group chats. Traveloop solves this by unifying your itinerary, budgeting, packing lists, and journaling into one stunning, premium interface.

---

## ✨ Features

### 🔐 **Secure User Authentication**
A robust, token-based authentication system using JSON Web Tokens (JWT). User passwords are cryptographically hashed via `bcrypt` to ensure maximum security. Users cannot access any trip data without a valid session, keeping personal travel plans completely private.

### 🏠 **Centralized Travel Dashboard**
The main landing hub where users can see all their upcoming, ongoing, and past trips at a glance. It provides a clean, grid-based overview with beautiful cover photos, travel dates, and quick actions to manage each vacation.

### ✈️ **Intuitive Trip Creation**
Starting a new journey is effortless. Users can initialize a trip by giving it a custom title, writing a short description or goal, selecting their entire travel date range, and uploading a personalized cover photo to set the mood for the vacation.

### 🗺️ **Smart Itinerary Builder**
The core engine of Traveloop. Users can dynamically search through a database of cities and add them as "stops" to their trip. The builder automatically organizes these stops into a visual timeline, ensuring users know exactly where they are going and when.

### 🎢 **Activity Discovery & Scheduling**
Instead of blindly researching what to do in a new city, Traveloop offers a curated catalog of activities. Users can browse popular attractions, view average costs and durations, and instantly map them to a specific day and time on their itinerary.

### 📅 **Structured Itinerary View**
A pristine, read-only visualization of the entire planned trip. It groups activities by city and day, displaying scheduled times, expected costs, and durations in an easy-to-read, chronological format—perfect for referencing on the go.

### 💰 **Dynamic Budget & Cost Management**
A powerful financial tool that prevents overspending. Users can allocate their budget across five major categories: Transport, Stay, Meals, Activities, and Miscellaneous. The breakdown is instantly visualized using interactive, responsive Pie and Bar charts (powered by `Chart.js`), allowing travelers to see exactly where their money is going.

### 🎒 **Categorized Packing Checklist**
A fully functional CRUD (Create, Read, Update, Delete) packing manager. Users can add specific items, assign them to logical categories (like "Electronics" or "Clothing"), and check them off as they pack. This ensures no passport or phone charger is ever left behind.

### 📝 **Trip Notes & Journaling**
A built-in digital notepad tied specifically to each individual trip. Travelers can use this to securely store important booking reference numbers, jot down daily journal entries, or paste links to local restaurant recommendations without cluttering their phone's main notes app.

### 🌍 **Public Itinerary Sharing**
Planning a group trip or want to show off your vacation to family? Traveloop can generate a secure, unique public URL for any trip. This link provides a beautiful, read-only summary of the itinerary that anyone can view without needing an account, while keeping your private budget and notes hidden.

### 👤 **Comprehensive User Profile**
A dedicated settings area where users can manage their personal information. If a user decides they no longer want to use the platform, they have access to a "Danger Zone" where they can permanently and safely delete their account and wipe all associated travel data from the database.

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
