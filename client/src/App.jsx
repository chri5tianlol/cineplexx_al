import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import BookingPage from './pages/BookingPage';
import AdminPage from './pages/AdminPage';
import ConfirmationPage from './pages/ConfirmationPage';
import EventsPage from './pages/EventsPage';
import EventDetailsPage from './pages/EventDetailsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminLoginPage from './pages/AdminLoginPage';
import UserDashboard from './pages/UserDashboard';
import TicketPage from './pages/TicketPage';
import CinemasPage from './pages/CinemasPage';
import ReservePage from './pages/ReservePage';
import Footer from './components/Footer';

import ScrollToTop from './components/ScrollToTop';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen bg-cinema-dark font-sans text-gray-100 flex flex-col">
        <Navbar />
        <div className="flex-1">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/booking/:movieId" element={<BookingPage />} />
            <Route path="/booking/event/:eventId" element={<BookingPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/confirmation" element={<ConfirmationPage />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/events/:id" element={<EventDetailsPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route path="/dashboard" element={<UserDashboard />} />
            <Route path="/ticket/:id" element={<TicketPage />} />
            <Route path="/cinemas" element={<CinemasPage />} />
            <Route path="/reserve" element={<ReservePage />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
