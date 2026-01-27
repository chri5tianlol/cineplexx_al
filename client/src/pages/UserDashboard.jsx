import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import ConfirmationModal from '../components/ConfirmationModal';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const UserDashboard = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || {});
    const [bookings, setBookings] = useState([]);
    const [activeTab, setActiveTab] = useState('bookings');
    const [currentPage, setCurrentPage] = useState(1);
    const ticketsPerPage = 3;

    // Profile Edit States
    const [name, setName] = useState(user.name || '');
    const [email, setEmail] = useState(user.email || '');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    // Modal State
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [bookingToCancel, setBookingToCancel] = useState(null);

    useEffect(() => {
        if (!user.id) {
            navigate('/login');
            return;
        }
        fetchBookings();
    }, [user.id, navigate]);

    const fetchBookings = async () => {
        try {
            const res = await axios.get(`http://localhost:5000/api/user/${user.id}/bookings`);
            setBookings(res.data);
        } catch (error) {
            console.error('Failed to fetch bookings', error);
        }
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setMessage('');
        try {
            const res = await axios.put('http://localhost:5000/api/user/profile', {
                userId: user.id,
                name,
                email,
                password: password || undefined
            });
            localStorage.setItem('user', JSON.stringify(res.data.user));
            setUser(res.data.user);
            res.data.user.password = undefined; // clear pass
            setMessage('Profile updated successfully!');
            setPassword('');
        } catch (error) {
            setMessage('Update failed: ' + error.response?.data?.error);
        }
    };

    const confirmCancelBooking = (bookingId) => {
        setBookingToCancel(bookingId);
        setShowCancelModal(true);
    };

    const handleCancelBooking = async () => {
        if (!bookingToCancel) return;
        try {
            await axios.delete(`http://localhost:5000/api/bookings/${bookingToCancel}`);
            setBookings(bookings.filter(b => b.id !== bookingToCancel)); // Optimistic UI update
            setShowCancelModal(false);
            setBookingToCancel(null);
        } catch (error) {
            alert('Failed to cancel');
        }
    };

    return (
        <div className="min-h-screen pt-32 pb-20 px-8">
            <ConfirmationModal
                isOpen={showCancelModal}
                onClose={() => setShowCancelModal(false)}
                onConfirm={handleCancelBooking}
                title="Cancel Reservation"
                message="Are you sure you want to cancel this reservation? This action cannot be undone."
                confirmText="Yes, Cancel it"
                isDanger={true}
            />

            <div className="max-w-6xl mx-auto">
                <div className="mb-12">
                    <div className="text-cinema-red font-bold uppercase tracking-widest text-sm mb-2">
                        {(() => {
                            const hour = new Date().getHours();
                            if (hour < 12) return 'Good Morning';
                            if (hour < 18) return 'Good Afternoon';
                            return 'Good Evening';
                        })()}, {user.name?.split(' ')[0] || 'User'}
                    </div>
                    <h1 className="text-4xl font-black text-white uppercase tracking-tighter">My Dashboard</h1>
                    <p className="text-gray-400 mt-2">Manage your account and reservations</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Stats Card */}
                    <div className="bg-[#1a1a1a] rounded-3xl p-6 border border-white/5 h-fit text-center">
                        <div className="w-20 h-20 bg-cinema-red/20 text-cinema-red rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" /></svg>
                        </div>
                        <div className="text-5xl font-black text-white">{bookings.length}</div>
                        <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-2">Active Reservations</div>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-3">
                        <div className="flex gap-4 mb-8 border-b border-white/10 pb-4">
                            <button
                                onClick={() => setActiveTab('bookings')}
                                className={`px-4 py-2 text-sm font-bold uppercase transition-all ${activeTab === 'bookings' ? 'text-cinema-red border-b-2 border-cinema-red' : 'text-gray-400 hover:text-white'}`}
                            >
                                My Tickets
                            </button>
                            <button
                                onClick={() => setActiveTab('profile')}
                                className={`px-4 py-2 text-sm font-bold uppercase transition-all ${activeTab === 'profile' ? 'text-cinema-red border-b-2 border-cinema-red' : 'text-gray-400 hover:text-white'}`}
                            >
                                Edit Profile
                            </button>
                        </div>

                        {activeTab === 'bookings' && (
                            <div className="space-y-4">
                                {bookings.length === 0 ? (
                                    <div className="text-gray-500 text-center py-20 bg-[#1a1a1a] rounded-3xl border border-white/5">
                                        No reservations yet.
                                    </div>
                                ) : (
                                    <>
                                        {bookings.slice((currentPage - 1) * ticketsPerPage, currentPage * ticketsPerPage).map((booking) => (
                                            <div key={booking.id} className="bg-[#1a1a1a] rounded-2xl p-6 flex flex-col md:flex-row items-center border border-white/5 hover:border-cinema-red/30 transition-all gap-6">
                                                {/* Poster Thumb if available or Placeholder */}
                                                <div className="w-20 h-28 bg-gray-800 rounded-lg overflow-hidden shrink-0">
                                                    {(booking.Event?.imageUrl || booking.Showtime?.Event?.imageUrl || booking.Showtime?.Movie?.posterUrl) &&
                                                        <img src={booking.Event?.imageUrl || booking.Showtime?.Event?.imageUrl || booking.Showtime.Movie.posterUrl} className="w-full h-full object-cover" />
                                                    }
                                                </div>

                                                <div className="flex-1 text-center md:text-left">
                                                    <h3 className="text-xl font-bold text-white mb-1">{booking.Event ? booking.Event.title : (booking.Showtime?.Event?.title || booking.Showtime?.Movie?.title || 'Event/Movie')}</h3>
                                                    <div className="text-sm text-gray-400 space-y-1">
                                                        <div>Date: {new Date(booking.Showtime?.startTime).toLocaleString()}</div>
                                                        <div>Hall: {booking.Showtime?.Hall?.name}</div>
                                                        <div>Seat: <span className="text-white font-bold">{booking.seatLabel}</span></div>
                                                        <div>Cinema: {booking.Showtime?.Hall?.Cinema?.name || 'Cineplexx'}</div>
                                                    </div>
                                                </div>

                                                <div className="flex flex-col gap-2 shrink-0 w-full md:w-auto">
                                                    <div className="bg-white/5 px-4 py-2 rounded-lg text-center">
                                                        <span className="text-xs text-gray-500 uppercase block">Ticket ID</span>
                                                        <span className="font-mono text-cinema-red font-bold">#{booking.id}</span>
                                                    </div>

                                                    <div className="flex gap-2">
                                                        <Link
                                                            to={`/ticket/${booking.id}`}
                                                            className="flex-1 px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-bold uppercase rounded-lg transition-colors border border-white/10 flex items-center justify-center gap-2"
                                                            title="View & Download Ticket"
                                                        >
                                                            {/* Download Icon */}
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                                                        </Link>
                                                        <button
                                                            onClick={() => confirmCancelBooking(booking.id)}
                                                            className="flex-1 px-4 py-2 bg-red-900/20 hover:bg-red-900/40 text-red-400 text-xs font-bold uppercase rounded-lg transition-colors border border-red-900/30 flex items-center justify-center"
                                                            title="Cancel Reservation"
                                                        >
                                                            {/* Trash/Cancel Icon */}
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}

                                        {bookings.length > ticketsPerPage && (
                                            <div className="flex justify-center items-center gap-4 mt-8">
                                                <button
                                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                                    disabled={currentPage === 1}
                                                    className="w-10 h-10 rounded-full bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10 flex items-center justify-center text-white border border-white/10 transition-colors"
                                                >
                                                    <ChevronLeft size={20} />
                                                </button>
                                                <span className="text-gray-400 text-sm font-bold">
                                                    Page {currentPage} of {Math.ceil(bookings.length / ticketsPerPage)}
                                                </span>
                                                <button
                                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(bookings.length / ticketsPerPage)))}
                                                    disabled={currentPage === Math.ceil(bookings.length / ticketsPerPage)}
                                                    className="w-10 h-10 rounded-full bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10 flex items-center justify-center text-white border border-white/10 transition-colors"
                                                >
                                                    <ChevronRight size={20} />
                                                </button>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        )}

                        {activeTab === 'profile' && (
                            <div className="bg-[#1a1a1a] rounded-3xl p-8 border border-white/5 max-w-xl">
                                {message && <div className="mb-4 p-3 bg-white/5 text-center text-white text-sm rounded-lg">{message}</div>}
                                <form onSubmit={handleUpdateProfile} className="space-y-6">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Name</label>
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:border-cinema-red outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Email</label>
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:border-cinema-red outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">New Password (Optional)</label>
                                        <input
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:border-cinema-red outline-none"
                                            placeholder="Leave blank to keep current"
                                        />
                                    </div>
                                    <button type="submit" className="w-full bg-cinema-red hover:bg-red-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-red-600/20 transition-all uppercase tracking-wider">
                                        Update Profile
                                    </button>
                                </form>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserDashboard;
