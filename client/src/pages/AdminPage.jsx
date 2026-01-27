import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';
import AdminTable from '../components/AdminTable';
import AddStaffModal from '../components/AddStaffModal';
import AddMovieModal from '../components/AddMovieModal';
import AddEventModal from '../components/AddEventModal';
import ConfirmationModal from '../components/ConfirmationModal';

import ManageShowtimesModal from '../components/ManageShowtimesModal';
import ManageHallsModal from '../components/ManageHallsModal';
import CinemaScheduleModal from '../components/CinemaScheduleModal';

// --- ICONS ---
import { Edit2, Trash2, CalendarPlus, Eye, XCircle, MapPin, Grid, Layers } from 'lucide-react';

const AdminPage = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem('user')) || {};
        } catch {
            return {};
        }
    });
    const [activeTab, setActiveTab] = useState('movies');

    // Data States
    const [movies, setMovies] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [staff, setStaff] = useState([]);
    const [events, setEvents] = useState([]);

    // Pagination / Search
    const [bookingPage, setBookingPage] = useState(1);
    const [bookingTotalPages, setBookingTotalPages] = useState(1);
    const [bookingSearch, setBookingSearch] = useState('');

    // Movie Pagination/Search
    const [moviePage, setMoviePage] = useState(1);
    const [movieSearch, setMovieSearch] = useState('');

    // Event Pagination/Search
    const [eventPage, setEventPage] = useState(1);
    const [eventSearch, setEventSearch] = useState('');

    const ITEMS_PER_PAGE = 5;

    // Modal States
    const [showStaffModal, setShowStaffModal] = useState(false);

    // Movie Modal (Add/Edit)
    const [showMovieModal, setShowMovieModal] = useState(false);
    const [movieToEdit, setMovieToEdit] = useState(null);

    // Event Modal
    const [showEventModal, setShowEventModal] = useState(false);
    const [eventToEdit, setEventToEdit] = useState(null);

    // Schedule Modal
    const [showScheduleModal, setShowScheduleModal] = useState(false);
    const [movieForSchedule, setMovieForSchedule] = useState(null);
    const [eventForSchedule, setEventForSchedule] = useState(null);

    // Cinema Modals
    const [cinemas, setCinemas] = useState([]);
    const [showManageHallsModal, setShowManageHallsModal] = useState(false);
    const [cinemaToManage, setCinemaToManage] = useState(null);
    const [showCinemaScheduleModal, setShowCinemaScheduleModal] = useState(false);
    const [cinemaForSchedule, setCinemaForSchedule] = useState(null);

    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [actionToConfirm, setActionToConfirm] = useState(null);

    useEffect(() => {
        if (!user.role || (user.role !== 'admin' && user.role !== 'staff')) {
            navigate('/admin/login');
        } else {
            fetchData();
        }
    }, [activeTab, bookingPage, bookingSearch]);

    const fetchData = async () => {
        try {
            if (activeTab === 'movies') {
                const res = await api.get('/movies');
                setMovies(res.data);
            } else if (activeTab === 'events') {
                try {
                    const res = await api.get('/events');
                    setEvents(res.data);
                } catch (err) {
                    console.error("Error fetching events", err);
                }
            } else if (activeTab === 'bookings' || activeTab === 'reservations') {
                const res = await api.get(`/admin/bookings?page=${bookingPage}&search=${bookingSearch}`);
                setBookings(res.data.bookings);
                setBookingTotalPages(res.data.totalPages);
            } else if (activeTab === 'staff' && user.role === 'admin') {
                const res = await api.get('/admin/staff');
                setStaff(res.data);
            } else if (activeTab === 'cinemas') {
                const res = await api.get('/cinemas');
                setCinemas(res.data);
            }
        } catch (error) {
            console.error("Fetch error:", error);
            if (error.response?.status === 401 || error.response?.status === 403) {
                navigate('/admin/login');
            }
        }
    };

    // --- ACTIONS ---
    const handleDeleteStaff = (staffId) => {
        setActionToConfirm(() => async () => {
            await api.delete(`/admin/staff/${staffId}`);
            fetchData();
        });
        setShowConfirmModal(true);
    };

    const handleCancelBooking = (bookingId) => {
        setActionToConfirm(() => async () => {
            await api.delete(`/bookings/${bookingId}`);
            fetchData();
        });
        setShowConfirmModal(true);
    };

    const handleDeleteMovie = (movieId) => {
        setActionToConfirm(() => async () => {
            await api.delete(`/movies/${movieId}`);
            fetchData();
        });
        setShowConfirmModal(true);
    };

    const handleDeleteEvent = (eventId) => {
        setActionToConfirm(() => async () => {
            await api.delete(`/events/${eventId}`);
            fetchData();
        });
        setShowConfirmModal(true);
    };

    const handleEditMovie = (movie) => {
        setMovieToEdit(movie);
        setShowMovieModal(true);
    };

    const handleEditEvent = (event) => {
        setEventToEdit(event);
        setShowEventModal(true);
    };

    const handleManageSchedule = (movie) => {
        setMovieForSchedule(movie);
        setShowScheduleModal(true);
    };

    const handleManageEventSchedule = (event) => {
        setEventForSchedule(event);
        setShowScheduleModal(true);
    };

    const handleManageHalls = (cinema) => {
        setCinemaToManage(cinema);
        setShowManageHallsModal(true);
    };

    const handleViewCinemaSchedule = (cinema) => {
        setCinemaForSchedule(cinema);
        setShowCinemaScheduleModal(true);
    };

    // --- FILTERING & PAGINATION HELPERS ---
    const getFilteredAndPaginatedData = (data, search, page) => {
        const filtered = data.filter(item =>
            item.title.toLowerCase().includes(search.toLowerCase())
        );
        const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE) || 1;
        const start = (page - 1) * ITEMS_PER_PAGE;
        const paginated = filtered.slice(start, start + ITEMS_PER_PAGE);
        return { paginated, totalPages, filteredCount: filtered.length };
    };

    // Calculate derived data for render
    const { paginated: displayMovies, totalPages: movieTotalPages } = getFilteredAndPaginatedData(movies, movieSearch, moviePage);
    const { paginated: displayEvents, totalPages: eventTotalPages } = getFilteredAndPaginatedData(events, eventSearch, eventPage);

    // Reset page when search changes
    useEffect(() => { setMoviePage(1); }, [movieSearch]);
    useEffect(() => { setEventPage(1); }, [eventSearch]);

    // --- HELPER FOR LOCATIONS ---
    const getMovieLocations = (movie) => {
        if (!movie.showtimes || movie.showtimes.length === 0) return 'No Showtimes';

        const cinemas = new Set();
        movie.showtimes.forEach(st => {
            if (st.Hall && st.Hall.Cinema) {
                cinemas.add(st.Hall.Cinema.name.replace('Cineplexx ', ''));
            }
        });
        return Array.from(cinemas).join(', ');
    };

    // --- GENRE COLOR MAP ---
    const getGenreColor = (genre) => {
        const lower = genre.toLowerCase();
        if (lower.includes('action')) return 'bg-orange-900/40 text-orange-400 border-orange-700/50';
        if (lower.includes('sci-fi')) return 'bg-cyan-900/40 text-cyan-400 border-cyan-700/50';
        if (lower.includes('horror')) return 'bg-red-900/40 text-red-400 border-red-700/50';
        if (lower.includes('drama')) return 'bg-purple-900/40 text-purple-400 border-purple-700/50';
        if (lower.includes('comedy')) return 'bg-yellow-900/40 text-yellow-400 border-yellow-700/50';
        return 'bg-gray-800 text-gray-300 border-gray-600';
    };

    // --- TABLE COLUMNS ---
    const movieColumns = [
        { header: 'Poster', render: row => <img src={row.posterUrl} className="h-12 w-8 rounded object-cover bg-gray-800" alt="" /> },
        { header: 'Title', accessor: 'title' },
        {
            header: 'Genre', render: row => (
                <span className={`px-2 py-1 rounded text-xs font-bold uppercase border ${getGenreColor(row.genre)}`}>
                    {row.genre}
                </span>
            )
        },
        { header: 'Location', render: row => <span className="text-sm text-gray-300">{getMovieLocations(row)}</span> },
        { header: 'Duration', render: row => <span className="text-xs text-gray-400">{row.duration} min</span> },
    ];



    const eventColumns = [
        { header: 'Image', render: row => <img src={row.imageUrl} className="h-16 w-auto rounded object-contain bg-gray-800" alt="" /> },
        { header: 'Title', accessor: 'title' },
        { header: 'Type', render: () => <span className="bg-purple-900/30 text-purple-400 px-2 py-1 rounded text-xs font-bold uppercase">Event</span> },
        { header: 'Location', render: row => <span className="text-sm text-gray-300">{getMovieLocations(row)}</span> }, // Reusing getMovieLocations as it works for any item with showtimes
        // { header: 'Date', render: row => <span className="text-xs text-gray-300">{new Date(row.date).toLocaleString()}</span> }, // Removing static date
    ];

    // ... (in render)

    {
        activeTab === 'events' && (
            <AdminTable
                columns={eventColumns}
                data={events}
                actions={(row) => (
                    <div className="flex gap-2">
                        <button onClick={() => handleManageEventSchedule(row)} className="text-blue-400 hover:bg-blue-900/20 p-2 rounded transition-colors" title="Schedule">
                            <CalendarPlus size={18} />
                        </button>
                        <button onClick={() => handleEditEvent(row)} className="text-gray-400 hover:text-white hover:bg-white/10 p-2 rounded transition-colors" title="Edit">
                            <Edit2 size={18} />
                        </button>
                        <button onClick={() => handleDeleteEvent(row.id)} className="text-red-500 hover:text-red-400 hover:bg-red-900/20 p-2 rounded transition-colors" title="Delete">
                            <Trash2 size={18} />
                        </button>
                    </div>
                )}
            />
        )
    }

    const staffColumns = [
        { header: 'Name', accessor: 'name' },
        { header: 'Email', accessor: 'email' },
        { header: 'Role', render: () => <span className="bg-blue-900/30 text-blue-400 px-2 py-1 rounded text-xs font-bold uppercase">Staff</span> }
    ];

    const cinemaColumns = [
        { header: 'Name', accessor: 'name' },
        { header: 'Location', accessor: 'location' },
        { header: 'Halls', render: row => <span className="text-gray-400">{row.Halls?.length || 0} Halls</span> },
        { header: 'Capacity', render: row => <span className="text-gray-400">{(row.Halls || []).reduce((acc, h) => acc + h.capacity, 0)} Seats</span> }
    ];

    const bookingColumns = [
        { header: 'ID', render: row => <span className="font-mono text-cinema-red text-xs">#{row.id}</span> },
        { header: 'Customer', accessor: 'customerName' },
        { header: 'Movie/Event', render: row => row.Showtime?.isEvent ? (row.Event?.title || 'Event') : (row.Showtime?.Movie?.title || 'Movie') },
        { header: 'Date', render: row => <span className="text-xs text-gray-300">{new Date(row.Showtime?.startTime).toLocaleDateString()}</span> },
        { header: 'Time', render: row => <span className="text-xs text-gray-400 font-mono">{new Date(row.Showtime?.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span> },
        { header: 'Location', render: row => <span className="text-xs font-bold uppercase">{row.Showtime?.Hall?.Cinema?.name.replace('Cineplexx ', '') || 'N/A'}</span> },
        { header: 'Hall', render: row => <span className="text-xs text-gray-500">{row.Showtime?.Hall?.name || 'N/A'}</span> },
        { header: 'Seat', render: row => <span className="font-mono bg-white/10 px-2 py-1 rounded text-xs">{row.seatLabel}</span> }
    ];

    return (
        <div className="min-h-screen bg-[#121212] pt-28 md:pt-32 flex flex-col md:flex-row">
            {/* Sidebar */}
            <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} userRole={user.role} />

            {/* Main Content */}
            <div className="flex-1 p-4 md:p-8 overflow-y-auto max-h-[calc(100vh-80px)]">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-8 gap-4">
                    <h1 className="text-2xl md:text-3xl font-bold text-white uppercase tracking-wide flex items-center gap-3">
                        {activeTab === 'reservations' ? 'Reservations' : activeTab} Management
                    </h1>

                    {activeTab === 'movies' && (
                        <button onClick={() => { setMovieToEdit(null); setShowMovieModal(true); }} className="w-full md:w-auto bg-cinema-red hover:bg-red-700 text-white px-6 py-2 rounded-xl font-bold transition-all shadow-lg shadow-red-900/30">
                            + Add Movie
                        </button>
                    )}
                    {activeTab === 'events' && (
                        <button onClick={() => { setEventToEdit(null); setShowEventModal(true); }} className="w-full md:w-auto bg-cinema-red hover:bg-red-700 text-white px-6 py-2 rounded-xl font-bold transition-all shadow-lg shadow-red-900/30">
                            + Add Event
                        </button>
                    )}
                    {activeTab === 'staff' && (
                        <button onClick={() => setShowStaffModal(true)} className="w-full md:w-auto bg-cinema-red hover:bg-red-700 text-white px-6 py-2 rounded-xl font-bold transition-all shadow-lg shadow-red-900/30">
                            + Add Staff
                        </button>
                    )}
                </div>

                {/* Content Area */}
                {activeTab === 'cinemas' && (
                    <AdminTable
                        columns={cinemaColumns}
                        data={cinemas}
                        actions={(row) => (
                            <div className="flex gap-2">
                                <button onClick={() => handleViewCinemaSchedule(row)} className="text-blue-400 hover:bg-blue-900/20 p-2 rounded transition-colors" title="View Schedule">
                                    <CalendarPlus size={18} />
                                </button>
                                <button onClick={() => handleManageHalls(row)} className="text-orange-400 hover:bg-orange-900/20 p-2 rounded transition-colors" title="Manage Halls">
                                    <Layers size={18} />
                                </button>
                            </div>
                        )}
                    />
                )}

                {activeTab === 'movies' && (
                    <div className="animate-fade-in">
                        {/* Search Bar */}
                        <div className="mb-6">
                            <input
                                type="text"
                                placeholder="Search Movies..."
                                value={movieSearch}
                                onChange={(e) => setMovieSearch(e.target.value)}
                                className="w-full md:w-96 bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-cinema-red outline-none shadow-sm"
                            />
                        </div>

                        <AdminTable
                            columns={movieColumns}
                            data={displayMovies}
                            actions={(row) => (
                                <div className="flex gap-2">
                                    <button onClick={() => handleManageSchedule(row)} className="text-blue-400 hover:bg-blue-900/20 p-2 rounded transition-colors" title="Schedule">
                                        <CalendarPlus size={18} />
                                    </button>
                                    <button onClick={() => handleEditMovie(row)} className="text-gray-400 hover:text-white hover:bg-white/10 p-2 rounded transition-colors" title="Edit">
                                        <Edit2 size={18} />
                                    </button>
                                    <button onClick={() => handleDeleteMovie(row.id)} className="text-red-500 hover:text-red-400 hover:bg-red-900/20 p-2 rounded transition-colors" title="Delete">
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            )}
                        />

                        {/* Pagination Controls */}
                        <div className="flex justify-center gap-4 mt-8">
                            <button
                                disabled={moviePage === 1}
                                onClick={() => setMoviePage(p => p - 1)}
                                className="px-4 py-2 bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10 text-white rounded transition-colors"
                            >
                                Prev
                            </button>
                            <span className="text-gray-400 py-2 font-mono">Page {moviePage} of {movieTotalPages}</span>
                            <button
                                disabled={moviePage === movieTotalPages}
                                onClick={() => setMoviePage(p => p + 1)}
                                className="px-4 py-2 bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10 text-white rounded transition-colors"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}

                {activeTab === 'events' && (
                    <div className="animate-fade-in">
                        {/* Search Bar */}
                        <div className="mb-6">
                            <input
                                type="text"
                                placeholder="Search Events..."
                                value={eventSearch}
                                onChange={(e) => setEventSearch(e.target.value)}
                                className="w-full md:w-96 bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-cinema-red outline-none shadow-sm"
                            />
                        </div>

                        <AdminTable
                            columns={eventColumns}
                            data={displayEvents}
                            actions={(row) => (
                                <div className="flex gap-2">
                                    <button onClick={() => handleManageEventSchedule(row)} className="text-blue-400 hover:bg-blue-900/20 p-2 rounded transition-colors" title="Schedule">
                                        <CalendarPlus size={18} />
                                    </button>
                                    <button onClick={() => handleEditEvent(row)} className="text-gray-400 hover:text-white hover:bg-white/10 p-2 rounded transition-colors" title="Edit">
                                        <Edit2 size={18} />
                                    </button>
                                    <button onClick={() => handleDeleteEvent(row.id)} className="text-red-500 hover:text-red-400 hover:bg-red-900/20 p-2 rounded transition-colors" title="Delete">
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            )}
                        />

                        {/* Pagination Controls */}
                        <div className="flex justify-center gap-4 mt-8">
                            <button
                                disabled={eventPage === 1}
                                onClick={() => setEventPage(p => p - 1)}
                                className="px-4 py-2 bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10 text-white rounded transition-colors"
                            >
                                Prev
                            </button>
                            <span className="text-gray-400 py-2 font-mono">Page {eventPage} of {eventTotalPages}</span>
                            <button
                                disabled={eventPage === eventTotalPages}
                                onClick={() => setEventPage(p => p + 1)}
                                className="px-4 py-2 bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10 text-white rounded transition-colors"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}

                {activeTab === 'staff' && (
                    <AdminTable
                        columns={staffColumns}
                        data={staff}
                        actions={(row) => (
                            <button onClick={() => handleDeleteStaff(row.id)} className="text-red-500 hover:bg-red-900/20 p-2 rounded transition-colors" title="Remove Staff">
                                <Trash2 size={18} />
                            </button>
                        )}
                    />
                )}

                {activeTab === 'reservations' && (
                    <div>
                        {/* Search Bar for Bookings */}
                        <div className="mb-6">
                            <input
                                type="text"
                                placeholder="Search by Ticket ID or Name..."
                                value={bookingSearch}
                                onChange={(e) => setBookingSearch(e.target.value)}
                                className="w-full md:w-96 bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-cinema-red outline-none"
                            />
                        </div>

                        <AdminTable
                            columns={bookingColumns}
                            data={bookings}
                            actions={(row) => (
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => window.open(`/ticket/${row.id}`, '_blank')}
                                        className="text-blue-400 hover:bg-blue-900/20 p-2 rounded transition-colors"
                                        title="View Ticket"
                                    >
                                        <Eye size={18} />
                                    </button>
                                    <button onClick={() => handleCancelBooking(row.id)} className="text-red-500 hover:bg-red-900/20 p-2 rounded transition-colors" title="Cancel Booking">
                                        <XCircle size={18} />
                                    </button>
                                </div>
                            )}
                        />
                        {/* Pagination */}
                        <div className="flex justify-center gap-4 mt-8">
                            <button disabled={bookingPage === 1} onClick={() => setBookingPage(p => p - 1)} className="px-4 py-2 bg-white/5 disabled:opacity-50 text-white rounded">Prev</button>
                            <span className="text-gray-400 py-2">Page {bookingPage} of {bookingTotalPages}</span>
                            <button disabled={bookingPage === bookingTotalPages} onClick={() => setBookingPage(p => p + 1)} className="px-4 py-2 bg-white/5 disabled:opacity-50 text-white rounded">Next</button>
                        </div>
                    </div>
                )}

            </div>

            {/* Modals */}
            <AddStaffModal isOpen={showStaffModal} onClose={() => setShowStaffModal(false)} onRefresh={fetchData} />

            <AddMovieModal
                isOpen={showMovieModal}
                onClose={() => { setShowMovieModal(false); setMovieToEdit(null); }}
                onRefresh={fetchData}
                initialData={movieToEdit}
            />

            <AddEventModal
                isOpen={showEventModal}
                onClose={() => { setShowEventModal(false); setEventToEdit(null); }}
                onRefresh={fetchData}
                initialData={eventToEdit}
            />

            <ManageShowtimesModal
                isOpen={showScheduleModal}
                onClose={() => { setShowScheduleModal(false); setMovieForSchedule(null); setEventForSchedule(null); }}
                movie={movieForSchedule}
                event={eventForSchedule}
            />

            <ManageHallsModal
                isOpen={showManageHallsModal}
                onClose={() => { setShowManageHallsModal(false); setCinemaToManage(null); }}
                cinema={cinemaToManage}
                onRefresh={fetchData}
            />

            <CinemaScheduleModal
                isOpen={showCinemaScheduleModal}
                onClose={() => { setShowCinemaScheduleModal(false); setCinemaForSchedule(null); }}
                cinema={cinemaForSchedule}
            />

            <ConfirmationModal
                isOpen={showConfirmModal}
                onClose={() => { setShowConfirmModal(false); setActionToConfirm(null); }}
                onConfirm={() => { if (actionToConfirm) actionToConfirm(); }}
                title="Are you sure?"
                message="This action cannot be undone."
                isDanger={true}
            />
        </div>
    );
};

import ErrorBoundary from '../components/ErrorBoundary';

export default function AdminPageWrapped() {
    return (
        <ErrorBoundary>
            <AdminPage />
        </ErrorBoundary>
    );
};
