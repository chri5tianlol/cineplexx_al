# Cinema Management System (CMS) Prototype

## Setup

### 1. Backend
```bash
cd server
npm install
node seed.js  # Seeds database with movies
node server.js # Starts API on port 5000
```

### 2. Frontend
```bash
cd client
npm install
npm run dev   # Starts React app on port 5173
```

## 🗄️ Accessing the Database
The project uses **SQLite**, so the database is a single file located at:
`server/database.sqlite`

### How to View Data
1.  **VS Code Extension**: Install **"SQLite Viewer"** in VS Code. Click on the `.sqlite` file to view tables directly in your editor.
2.  **External Tool**: Download **[DB Browser for SQLite](https://sqlitebrowser.org/)**. Open the `database.sqlite` file with it to browse data, run SQL queries, and export results.

## 🚀 Deployment (Free Options)
To host this online for free to show friends:

### 1. Frontend (Vite) -> **Vercel** or **Netlify**
-   Push your `client` folder code to GitHub.
-   Import into Vercel/Netlify.
-   Set Build Command: `npm run build`
-   Set Output Directory: `dist`

### 2. Backend (Node/Express) -> **Render**
-   You can use the **SAME** GitHub repository. No need to create a new one!
-   Create a **New Web Service** on [Render](https://render.com/).
-   Connect your repo.
-   **Critical Step**: In the settings, change **"Root Directory"** to `server`.
-   Build Command: `npm install`
-   Start Command: `node server.js`
-   **Note**: On the free tier, the SQLite database (`database.sqlite`) resets on restart. For persistent data, use a free PostgreSQL database like **Neon.tech**.

## Features
- **Dashboard**: View Now Showing movies.
- **Booking**: Select Showtimes, View dynamic seat grid, Book tickets.
- **Admin**: Add new movies (navigate to `/admin`).
- **Tech Stack**: React, Node, Express, SQLite, Sequelize, TailwindCSS.
