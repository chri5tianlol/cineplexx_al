import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios'; // Use configured API

import LoginModal from '../components/LoginModal';

const EventDetailsPage = () => {
    const { id } = useParams();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showLoginModal, setShowLoginModal] = useState(false);

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const response = await api.get(`/events/${id}`);
                setEvent(response.data);
            } catch (error) {
                console.error("Error fetching event details:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchEvent();
    }, [id]);

    if (loading) {
        return <div className="min-h-screen bg-[#121212] flex items-center justify-center text-white">Loading Event Details...</div>;
    }

    if (!event) {
        return <div className="min-h-screen bg-[#121212] flex items-center justify-center text-white">Event not found.</div>;
    }

    const handleBookClick = (e) => {
        if (!localStorage.getItem('token')) {
            e.preventDefault();
            setShowLoginModal(true);
        }
    };

    return (
        <div className="min-h-screen bg-[#121212] relative">
            {showLoginModal && <LoginModal onClose={() => setShowLoginModal(false)} />}
            {/* Hero Section with Poster */}
            <div className="relative w-full h-[60vh]">
                <img
                    src={event.imageUrl}
                    alt={event.title}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-[#121212]/50 to-transparent" />

                <div className="absolute bottom-0 left-0 right-0 p-8 max-w-7xl mx-auto">
                    <Link to="/events" className="inline-flex items-center text-gray-300 hover:text-white mb-6 transition-colors font-bold text-sm uppercase tracking-widest">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                        Back to Events
                    </Link>
                    <h1 className="text-4xl md:text-6xl font-black text-white mb-4 drop-shadow-2xl">{event.title}</h1>
                    <div className="flex flex-wrap items-center gap-6 text-gray-200 text-lg font-medium">
                        <div className="flex items-center gap-2">
                            <svg className="w-5 h-5 text-cinema-red" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                            {event.showtimes && event.showtimes.length > 0
                                ? new Date(event.showtimes[0].startTime).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
                                : 'N/A'}
                        </div>
                        <div className="flex items-center gap-2">
                            <svg className="w-5 h-5 text-cinema-red" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                            {event.showtimes && event.showtimes.length > 0
                                ? [...new Set(event.showtimes.map(st => st.Hall?.Cinema?.name.replace('Cineplexx ', '')).filter(Boolean))].join(', ')
                                : 'N/A'}
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="max-w-7xl mx-auto px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    <div className="md:col-span-2 space-y-8">
                        <div>
                            <h2 className="text-2xl font-bold text-white mb-4">About the Event</h2>
                            <p className="text-gray-300 text-lg leading-relaxed">{event.description}</p>
                        </div>

                        {/* More mock details for visual richness */}
                        <div className="grid grid-cols-2 gap-6">
                            <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                                <h3 className="text-gray-400 text-sm font-bold uppercase tracking-wider mb-2">Duration</h3>
                                <p className="text-white text-xl font-bold">Approx. 3 Hours</p>
                            </div>
                            <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                                <h3 className="text-gray-400 text-sm font-bold uppercase tracking-wider mb-2">Age Rating</h3>
                                <p className="text-white text-xl font-bold">18+</p>
                            </div>
                        </div>
                    </div>

                    <div className="md:col-span-1">
                        <div className="bg-[#1c1c1c] p-8 rounded-3xl border border-white/5 sticky top-24">
                            <h3 className="text-xl font-bold text-white mb-6">Interested?</h3>
                            {event.showtimes && event.showtimes.length > 0 ? (
                                <Link onClick={handleBookClick} to={`/booking/event/${event.id}`} className="block w-full text-center py-4 bg-cinema-red hover:bg-red-700 text-white font-bold rounded-xl transition-colors shadow-lg shadow-red-600/20 mb-4">
                                    Book Tickets Now
                                </Link>
                            ) : (
                                <button disabled className="w-full py-4 bg-gray-700 text-gray-400 font-bold rounded-xl cursor-not-allowed mb-4">
                                    Tickets Not Available
                                </button>
                            )}
                            <p className="text-center text-gray-500 text-sm">
                                Limited seats available. <br /> Book early to avoid disappointment.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventDetailsPage;
