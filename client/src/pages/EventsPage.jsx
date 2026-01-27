import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios'; // Use configured instance

const EventsPage = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await api.get('/events');
                setEvents(response.data);
            } catch (error) {
                console.error("Error fetching events:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, []);

    if (loading) {
        return <div className="min-h-screen bg-[#121212] flex items-center justify-center text-white">Loading Events...</div>;
    }

    return (
        <div className="min-h-screen bg-[#121212] pt-28 pb-12 px-6">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-4xl font-bold text-white mb-2">Upcoming Events</h1>
                <p className="text-gray-400 mb-12">Exclusive screenings, premieres, and special nights.</p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {events.map((event) => (
                        <Link to={`/events/${event.id}`} key={event.id} className="group relative bg-[#1c1c1c] rounded-3xl overflow-hidden hover:-translate-y-2 transition-transform duration-300 shadow-xl border border-white/5 block">
                            {/* Image Container */}
                            <div className="h-64 relative overflow-hidden">
                                <img
                                    src={event.imageUrl}
                                    alt={event.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#1c1c1c] via-transparent to-transparent opacity-90" />

                                {/* Date Badge */}
                                <div className="absolute top-4 right-4 bg-white/10 backdrop-blur-md border border-white/20 px-3 py-1 rounded-lg">
                                    <span className="text-white font-bold text-sm">
                                        {event.showtimes && event.showtimes.length > 0
                                            ? new Date(event.showtimes[0].startTime).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
                                            : 'Coming Soon'}
                                    </span>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6 relative">
                                <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-cinema-red transition-colors">{event.title}</h3>
                                <p className="text-gray-400 text-sm mb-4 line-clamp-3">{event.description}</p>

                                <div className="flex justify-between items-center text-sm font-medium pt-4 border-t border-white/10">
                                    <div className="flex items-center text-gray-300">
                                        <svg className="w-4 h-4 mr-2 text-cinema-red" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                        {event.showtimes && event.showtimes.length > 0
                                            ? [...new Set(event.showtimes.map(st => st.Hall?.Cinema?.name.replace('Cineplexx ', '')).filter(Boolean))].join(', ')
                                            : 'N/A'}
                                    </div>
                                    <span className="text-cinema-red group-hover:text-white transition-colors uppercase tracking-widest text-xs font-bold">Details</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default EventsPage;
