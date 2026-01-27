# 📂 PROMPT FILE: Cinema Management System (CMS) Prototype

## 1. Project Overview

**Goal:** Build a functional MVP (Minimum Viable Product) for a "Cinema Management System" (CMS).
**Context:** This system allows admins to manage movies and showtimes, and customers to book seats via a web interface.
**Architecture:** The system must follow a **3-Tier Architecture** (Client - Server - Database) and use the **MVC (Model-View-Controller)** pattern for the backend logic.

## 2. Technical Stack (Strict Requirements)

To ensure the prototype is runnable and modern, use the following stack:

* **Frontend (Presentation Tier):** React.js (Vite), Tailwind CSS (for styling), Axios (for API requests).
* **Backend (Application Tier):** Node.js, Express.js.
* **Database (Data Tier):** SQLite (for prototyping ease, simulating the PostgreSQL requirement). Use **Sequelize** or **Prisma** as the ORM.
* **Folder Structure:** Monorepo style.
* `/client` (React App)
* `/server` (Node API)


## 3. Data Models (Database Tier)

Create the following entities with appropriate relationships:

1. **Movie:** `id`, `title`, `description`, `duration` (mins), `posterUrl`, `genre`.
2. **Hall (Salla):** `id`, `name` (e.g., "Salla 1"), `capacity`, `totalRows`, `seatsPerRow`.
3. **Showtime (Shfaqja):** `id`, `movieId` (FK), `hallId` (FK), `startTime` (DateTime), `price`.
4. **Ticket (Bileta):** `id`, `showtimeId` (FK), `seatLabel` (e.g., "A5"), `customerName`, `status` (booked/sold).

## 4. Backend Logic (MVC Pattern)

The server must be organized into `routes`, `controllers`, and `models`.

**Key API Endpoints:**

* `GET /api/movies` - Fetch all movies.
* `POST /api/movies` - (Admin) Add a new movie.
* `GET /api/showtimes/:movieId` - Get showtimes for a specific movie.
* `GET /api/seats/:showtimeId` - Get the status of all seats (booked vs. free) for a specific showtime.
* **Transaction Logic:** `POST /api/bookings` - Accepts `showtimeId`, `seatLabel`, `customerName`.
* *Constraint:* Must check if the seat is free before booking. If taken, return 409 Conflict. (Simulating the concurrency requirement).



## 5. Frontend Requirements (Client Tier)

**Theme:** Dark Mode (Cinema aesthetic).

**Page 1: The Dashboard (Home)**

* Display a grid of "Now Showing" movies with posters.
* Clicking a movie takes you to the Details/Booking view.

**Page 2: Booking Interface (The "Seat Picker")**

* **Visual Grid:** Render the cinema hall seating layout dynamically based on rows/columns.
* **Logic:**
* Available seats: Green/Gray.
* Booked seats: Red (Unclickable).
* Selected seats: Yellow.


* **Action:** A "Book Ticket" button that sends the request to the API.
* **Success:** Show a modal with a "Fake QR Code" and the ticket details.

**Page 3: Admin Panel (Simple)**

* A form to add a new Movie URL and Title.

## 6. Implementation Plan for the Agent

Please generate the code in this order:

1. **Project Setup:** The shell commands to create the folder structure and install dependencies (`npm install ...`).
2. **Server Setup:** The `server.js` entry point and database connection.
3. **Models:** The Sequelize/Prisma definitions.
4. **Controllers & Routes:** The API logic.
5. **Client Components:**
* `MovieCard.jsx`
* `SeatGrid.jsx` (Crucial logic here)
* `BookingPage.jsx`


6. **Instructions:** How to run the app locally.

---

### Tips for You (The User)

1. **Google Agent/Antigravity** is very good at code, but it might give you a lot of text. Ask it to **"Provide the output as a setup script or a step-by-step guide I can copy-paste."**
2. **The Database:** I suggested **SQLite** in the prompt above. Even though your SRS says PostgreSQL, SQLite is much better for an "Instant Prototype" because it's a single file and doesn't require you to install a heavy database server on your laptop. It works exactly the same way in the code (via the ORM).
3. **Seat Grid:** This is the hardest part. If the AI struggles, tell it: *"Simplify the seat grid. Just assume a 10x10 grid for every hall."*