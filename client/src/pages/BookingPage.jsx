import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import api from '../api/axios';
import SeatGrid from '../components/SeatGrid';
import LoginModal from '../components/LoginModal';

const BookingPage = () => {
    const params = useParams();
    const movieId = params.movieId;
    const eventIdParam = params.eventId;

    const [searchParams] = useSearchParams();
    const eventIdQuery = searchParams.get('eventId');

    // Use eventId from param OR query
    const eventId = eventIdParam || eventIdQuery;

    const navigate = useNavigate();
    const [movie, setMovie] = useState(null);
    const [event, setEvent] = useState(null);
    const [showtimes, setShowtimes] = useState([]);
    const [cinemas, setCinemas] = useState([]);
    const [selectedCinema, setSelectedCinema] = useState(null);
    const [selectedShowtime, setSelectedShowtime] = useState(null);
    const [hallData, setHallData] = useState({ hall: '', seats: [] });
    const [selectedSeat, setSelectedSeat] = useState(null);
    const [customerName, setCustomerName] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [loadingSeats, setLoadingSeats] = useState(false);

    // Fetch Movie/Event Details & Showtimes
    useEffect(() => {
        const fetchData = async () => {
            try {
                let fetchedShowtimes = [];

                // SCENARIO 1: Booking a specific MOVIE
                if (movieId) {
                    const movieRes = await api.get(`/movies/${movieId}`);
                    setMovie(movieRes.data);

                    const showtimesRes = await api.get(`/showtimes/${movieId}`);
                    fetchedShowtimes = showtimesRes.data;

                    // If filtered by event (e.g. special movie night)
                    if (eventId) {
                        const eventRes = await api.get(`/events/${eventId}`);
                        setEvent(eventRes.data);
                        const eventDateStr = new Date(eventRes.data.date).toDateString();
                        fetchedShowtimes = fetchedShowtimes.filter(st => new Date(st.startTime).toDateString() === eventDateStr);
                    } else {
                        fetchedShowtimes = fetchedShowtimes.filter(st => !st.isEvent);
                    }
                }
                // SCENARIO 2: Booking a specific EVENT (Standalone)
                else if (eventId) {
                    const eventRes = await api.get(`/events/${eventId}`);
                    setEvent(eventRes.data);
                    // Mock a "movie" object so the UI doesn't break
                    setMovie({
                        id: 'event-' + eventRes.data.id,
                        title: eventRes.data.title,
                        posterUrl: eventRes.data.imageUrl,
                        description: eventRes.data.description,
                        genre: 'Event',
                        duration: 'N/A'
                    });

                    const showtimesRes = await api.get(`/showtimes/event/${eventId}`);
                    fetchedShowtimes = showtimesRes.data;
                }

                setShowtimes(fetchedShowtimes);

                // Extract Unique Cinemas
                const uniqueCinemas = [];
                const cinemaMap = new Map();
                fetchedShowtimes.forEach(st => {
                    if (st.Hall?.Cinema && !cinemaMap.has(st.Hall.Cinema.id)) {
                        cinemaMap.set(st.Hall.Cinema.id, true);
                        uniqueCinemas.push(st.Hall.Cinema);
                    }
                });
                setCinemas(uniqueCinemas);

                // Auto-select if only one
                if (uniqueCinemas.length === 1) setSelectedCinema(uniqueCinemas[0]);

                // Check for requested showtimeId in URL
                const requestedShowtimeId = searchParams.get('showtimeId');
                if (requestedShowtimeId) {
                    const targetShowtime = fetchedShowtimes.find(st => st.id === parseInt(requestedShowtimeId));
                    if (targetShowtime) {
                        setSelectedCinema(targetShowtime.Hall?.Cinema);
                        // Trigger selection
                        // We can't call handleShowtimeSelect directly here easily because of stale state or async issues?
                        // Actually handleShowtimeSelect is stable. But let's set state directly or use a separate effect.
                        // Better to use a separate effect that depends on [showtimes] and queries.
                    }
                }

            } catch (err) {
                console.error(err);
            }
        }
        if (movieId || eventId) fetchData();
    }, [movieId, eventId]);

    // Effect to auto-select showtime if requested
    useEffect(() => {
        const requestedShowtimeId = searchParams.get('showtimeId');
        if (requestedShowtimeId && showtimes.length > 0 && !selectedShowtime) {
            const targetShowtime = showtimes.find(st => st.id === parseInt(requestedShowtimeId));
            if (targetShowtime) {
                handleShowtimeSelect(targetShowtime);
            }
        }
    }, [showtimes, searchParams]);


    // Auto-fill customer name if logged in
    useEffect(() => {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            const user = JSON.parse(userStr);
            if (user.name) setCustomerName(user.name);
        }
    }, []);

    const handleShowtimeSelect = async (showtime) => {
        if (!localStorage.getItem('token')) {
            setShowLoginModal(true);
            return;
        }

        setSelectedShowtime(showtime);
        setSelectedSeat(null);
        setSuccess('');
        setError('');
        setLoadingSeats(true);

        try {
            const response = await api.get(`/seats/${showtime.id}`);
            console.log('Seats fetched:', response.data);
            setHallData(response.data);
        } catch (err) {
            console.error('Failed to fetch seats', err);
            const errMsg = err.response?.data?.error || err.message || 'Could not load seats.';
            setError(`Error loading seats: ${errMsg}`);
        } finally {
            setLoadingSeats(false);
        }
    };

    const handleBookTicket = async (e) => {
        e.preventDefault();
        if (!selectedShowtime || !selectedSeat || !customerName) {
            setError('Please fill in all fields');
            return;
        }

        try {
            const user = JSON.parse(localStorage.getItem('user'));
            await api.post('/bookings', {
                showtimeId: selectedShowtime.id,
                seatLabel: selectedSeat.label,
                customerName,
                userId: user ? user.id : null,
                price: selectedShowtime.price
            });
            // Redirect to Confirmation Page with data
            navigate('/confirmation', {
                state: {
                    ticket: {
                        movieTitle: event ? event.title : movie.title,
                        posterUrl: event ? event.imageUrl : movie.posterUrl,
                        hall: hallData.hall || selectedShowtime.Hall?.name,
                        seat: selectedSeat.label,
                        date: selectedShowtime.startTime,
                        price: selectedShowtime.price,
                        customerName
                    }
                }
            });

        } catch (err) {
            console.error(err);
            if (err.response && err.response.status === 409) {
                setError('Seat taken.');
                handleShowtimeSelect(selectedShowtime);
            } else {
                const errMsg = err.response?.data?.error || err.message || 'Booking Failed.';
                setError(`Failed: ${errMsg}`);
            }
        }
    };

    if (!movie) return <div className="min-h-screen flex items-center justify-center text-white font-bold tracking-widest uppercase animate-pulse">Loading Movie Data...</div>;

    return (
        <div className="min-h-screen bg-[#121212] pb-20">
            {showLoginModal && <LoginModal onClose={() => setShowLoginModal(false)} />}

            {/* 1. HUGE HERO BANNER */}
            {/* Increased height and adjusted padding to fix overlap */}
            <div className="relative w-full h-[75vh] lg:h-[90vh] overflow-hidden">
                {/* Backdrop Image (Blurred) */}
                <div className="absolute inset-0 bg-cover bg-center blur-3xl opacity-40 scale-110" style={{ backgroundImage: `url(${event ? event.imageUrl : movie.posterUrl})` }}></div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-[#121212]/60 to-transparent"></div>

                <div className="container mx-auto px-6 h-full flex items-end pb-16 relative z-10 pt-40">
                    <div className="flex flex-col lg:flex-row gap-12 items-end w-full">
                        {/* Poster Card */}
                        <div className="hidden lg:block w-72 h-[440px] shrink-0 rounded-2xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.6)] relative z-20 hover:scale-105 transition-transform duration-500">
                            <img src={event ? event.imageUrl : movie.posterUrl} alt={movie.title} className="w-full h-full object-cover" />
                        </div>

                        {/* Info */}
                        <div className="mb-2 space-y-5 max-w-4xl text-shadow-lg pb-4">
                            <div className="flex gap-3 text-xs font-bold tracking-widest uppercase text-cinema-red mb-3">
                                <span className="bg-white/10 px-4 py-1.5 rounded-full backdrop-blur-md text-white border border-white/5">{movie.genre}</span>
                                <span className="bg-white/10 px-4 py-1.5 rounded-full backdrop-blur-md text-white border border-white/5">{movie.duration} MIN</span>
                                {event && <span className="bg-cinema-red px-4 py-1.5 rounded-full text-white shadow-lg shadow-red-500/20">SPECIAL EVENT</span>}
                            </div>
                            <h1 className="text-5xl md:text-8xl font-black text-white leading-none tracking-tight">{event ? event.title : movie.title}</h1>
                            <p className="text-gray-300 text-lg leading-relaxed max-w-3xl drop-shadow-md border-l-4 border-cinema-red pl-6">{event ? event.description : movie.description}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. BOOKING SECTION */}
            <div className="container mx-auto px-6 mt-12">
                <div className="flex flex-col lg:flex-row gap-16">

                    {/* LEFT: Selection Interface */}
                    <div className="flex-1 space-y-12">
                        {/* ... (Kept existing selection logic) ... */}
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                                <span className="w-8 h-8 rounded-full bg-cinema-red flex items-center justify-center text-xs shadow-lg shadow-red-900/50">1</span>
                                Select Cinema
                            </h2>
                            <div className="flex gap-4">
                                {cinemas.map(cinema => (
                                    <button
                                        key={cinema.id}
                                        onClick={() => { setSelectedCinema(cinema); setSelectedShowtime(null); }}
                                        className={`px-6 py-4 rounded-xl border font-bold transition-all duration-300 ${selectedCinema?.id === cinema.id ? 'bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.4)]' : 'bg-[#1a1a1a] border-gray-800 text-gray-400 hover:border-gray-600 hover:text-white'}`}
                                    >
                                        <div className="text-lg">{cinema.name}</div>
                                        <div className="text-xs font-normal opacity-70 mt-1">{cinema.location}</div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {selectedCinema && (
                            <div className="space-y-6 animate-fade-in-up">
                                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-full bg-cinema-red flex items-center justify-center text-xs shadow-lg shadow-red-900/50">2</span>
                                    Select Showtime
                                </h2>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {showtimes.filter(st => st.Hall?.Cinema?.id === selectedCinema.id).map(st => (
                                        <button
                                            key={st.id}
                                            onClick={() => handleShowtimeSelect(st)}
                                            className={`group relative overflow-hidden rounded-xl border p-4 text-left transition-all duration-300 ${selectedShowtime?.id === st.id ? 'bg-white text-black border-white shadow-[0_0_25px_rgba(255,255,255,0.3)] transform scale-[1.02]' : 'bg-[#1a1a1a] border-gray-800 text-gray-400 hover:border-gray-600 hover:text-white'}`}
                                        >
                                            <div className="text-lg font-bold">{new Date(st.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                            <div className="text-[10px] text-gray-500 font-medium mb-1">{new Date(st.startTime).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</div>
                                            <div className="text-xs opacity-60 uppercase tracking-wider font-medium">{st.Hall.name}</div>
                                            <div className={`absolute top-0 right-0 p-2 text-xs font-bold ${selectedShowtime?.id === st.id ? 'text-cinema-red' : 'text-gray-600 group-hover:text-white'}`}>{st.price} LEK</div>

                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {selectedShowtime && (
                            <div className="space-y-6 animate-fade-in-up">
                                <div className="flex justify-between items-center">
                                    <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                                        <span className="w-8 h-8 rounded-full bg-cinema-red flex items-center justify-center text-xs shadow-lg shadow-red-900/50">3</span>
                                        Select Seats
                                    </h2>
                                    <span className="text-gray-500 text-sm uppercase tracking-widest">{hallData.hall}</span>
                                </div>

                                <div className="bg-[#151515] p-10 rounded-3xl border border-white/5 relative shadow-inner min-h-[300px] flex items-center justify-center">
                                    {loadingSeats ? (
                                        <div className="flex flex-col items-center gap-4">
                                            <div className="w-10 h-10 border-4 border-cinema-red border-t-transparent rounded-full animate-spin"></div>
                                            <div className="text-gray-400 font-bold uppercase tracking-widest text-xs">Loading Hall Layout...</div>
                                        </div>
                                    ) : (
                                        <SeatGrid
                                            seats={hallData.seats}
                                            onSeatSelect={setSelectedSeat}
                                            selectedSeatLabel={selectedSeat?.label}
                                        />
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* RIGHT: Ticket Summary & Checkout */}
                    <div className="w-full lg:w-[400px] shrink-0">
                        <div className="sticky top-32">
                            <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
                                {/* Header Image */}
                                <div className="h-40 bg-gray-800 relative">
                                    <img src={event ? event.imageUrl : movie.posterUrl} className="w-full h-full object-cover opacity-60 grayscale mix-blend-overlay" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] via-transparent to-transparent"></div>
                                    <div className="absolute bottom-4 left-6">
                                        <h3 className="text-white font-bold text-xl drop-shadow-md tracking-wide">Booking Summary</h3>
                                    </div>
                                </div>

                                <div className="p-6 space-y-6">
                                    {/* Details */}
                                    <div className="space-y-4 text-sm">
                                        <div className="flex justify-between items-center border-b border-white/5 pb-3">
                                            <span className="text-gray-500">{event ? 'Event' : 'Movie'}</span>
                                            <span className="text-white font-medium text-right max-w-[200px] truncate">{event ? event.title : movie.title}</span>
                                        </div>
                                        <div className="flex justify-between items-start border-b border-white/5 pb-3">
                                            <span className="text-gray-500">Cinema</span>
                                            <div className="text-right">
                                                <div className="text-white font-medium">{selectedCinema ? selectedCinema.name : (selectedShowtime?.Hall?.Cinema?.name || 'Cineplexx')}</div>
                                                <div className="text-xs text-gray-600">{selectedCinema ? selectedCinema.location : (selectedShowtime?.Hall?.Cinema?.location || 'Tirana')}</div>
                                            </div>
                                        </div>
                                        <div className="flex justify-between items-center border-b border-white/5 pb-3">
                                            <span className="text-gray-500">Date & Time</span>
                                            <div className="text-right">
                                                <div className="text-white font-medium">{selectedShowtime ? new Date(selectedShowtime.startTime).toLocaleDateString() : '-'}</div>
                                                <div className="text-xs text-gray-500">{selectedShowtime ? new Date(selectedShowtime.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}</div>
                                            </div>
                                        </div>
                                        <div className="flex justify-between items-center border-b border-white/5 pb-3">
                                            <span className="text-gray-500">Seat</span>
                                            <span className="text-yellow-500 font-bold text-xl">{selectedSeat?.label || '-'}</span>
                                        </div>
                                    </div>

                                    {/* Total */}
                                    <div className="flex justify-between items-end bg-white/5 p-4 rounded-xl border border-white/5">
                                        <span className="text-gray-400 text-sm">Total Amount</span>
                                        <span className="text-cinema-red font-bold text-3xl">{selectedShowtime ? selectedShowtime.price : '0'} LEK</span>
                                    </div>

                                    {/* Form */}
                                    {selectedShowtime && (
                                        <form onSubmit={handleBookTicket} className="space-y-4 pt-2">
                                            <div>
                                                <label className="block text-xs uppercase text-gray-500 font-bold mb-2 ml-1">Full Name</label>
                                                <input
                                                    type="text"
                                                    value={customerName}
                                                    readOnly={!!localStorage.getItem('token')}
                                                    onChange={(e) => setCustomerName(e.target.value)}
                                                    placeholder="Enter your name"
                                                    className={`w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-cinema-red outline-none transition-all placeholder-gray-600 focus:ring-1 focus:ring-cinema-red/50 ${localStorage.getItem('token') ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                    required
                                                />
                                            </div>
                                            <button
                                                type="submit"
                                                disabled={!selectedSeat}
                                                className="w-full bg-gradient-to-r from-cinema-red to-[#c40812] hover:from-white hover:to-white hover:text-black text-white font-bold py-4 rounded-xl shadow-lg shadow-cinema-red/20 disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed transition-all duration-300 transform hover:translate-y-[-2px]"
                                            >
                                                CONFIRM & PROCEED
                                            </button>
                                        </form>
                                    )}

                                    {error && <div className="text-red-500 text-center text-sm font-bold bg-red-500/10 p-3 rounded-lg border border-red-500/20">{error}</div>}

                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div >
    );
};

export default BookingPage;
