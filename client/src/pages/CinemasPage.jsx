import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { MapPin, Clock, Calendar } from 'lucide-react';

const CinemasPage = () => {
    const [cinemas, setCinemas] = useState([]);
    const [schedule, setSchedule] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // 1. Fetch Cinemas
                const cinemasRes = await api.get('/cinemas');
                setCinemas(cinemasRes.data);

                // 2. Fetch Showtimes
                const showtimesRes = await api.get('/showtimes');
                const allShowtimes = showtimesRes.data;

                const today = new Date();
                today.setHours(0, 0, 0, 0);

                // Group by Cinema -> Date -> Movie
                const grouped = {};

                allShowtimes.forEach(st => {
                    const stDateObj = new Date(st.startTime);
                    // Filter out past showtimes (started before today)
                    if (stDateObj < today) return;

                    const dateKey = stDateObj.toDateString(); // e.g. "Wed Jan 28 2026"
                    const cinemaId = st.Hall?.Cinema?.id;
                    if (!cinemaId) return;

                    if (!grouped[cinemaId]) grouped[cinemaId] = {};
                    if (!grouped[cinemaId][dateKey]) grouped[cinemaId][dateKey] = {};

                    const movieId = st.Movie ? `m-${st.Movie.id}` : `e-${st.Event.id}`;
                    if (!grouped[cinemaId][dateKey][movieId]) {
                        grouped[cinemaId][dateKey][movieId] = {
                            info: st.Movie || st.Event,
                            isEvent: st.isEvent,
                            showtimes: []
                        };
                    }
                    grouped[cinemaId][dateKey][movieId].showtimes.push(st);
                });

                setSchedule(grouped);
            } catch (err) {
                console.error("Failed to load cinema data", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return <div className="min-h-screen bg-[#121212] flex items-center justify-center text-white animate-pulse">Loading Cinemas...</div>;

    return (
        <div className="min-h-screen bg-[#121212] pt-32 pb-20 px-6">
            <div className="container mx-auto">

                <h1 className="text-4xl text-white font-black uppercase tracking-widest mb-16 text-center">
                    <span className="text-cinema-red">Our</span> Locations
                </h1>

                <div className="space-y-24">
                    {cinemas.map(cinema => {
                        // Get sorted dates for this cinema
                        const dates = schedule[cinema.id] ? Object.keys(schedule[cinema.id]).sort((a, b) => new Date(a) - new Date(b)) : [];

                        return (
                            <div key={cinema.id} className="animate-fade-in-up">
                                {/* Cinema Header */}
                                <div className="flex flex-col md:flex-row items-baseline gap-6 border-b border-white/10 pb-6 mb-10">
                                    <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                                        <MapPin className="text-cinema-red" size={32} />
                                        {cinema.name}
                                    </h2>
                                    <p className="text-gray-400 text-lg uppercase tracking-wide">{cinema.location}</p>
                                </div>

                                {dates.length === 0 ? (
                                    <div className="text-gray-600 italic">No schedules available for this location.</div>
                                ) : (
                                    <div className="space-y-16">
                                        {dates.map(dateKey => {
                                            const movies = Object.values(schedule[cinema.id][dateKey]);

                                            // Date Label Logic
                                            const displayDate = (() => {
                                                const d = new Date(dateKey); // parsed from "Wed Jan 28 2026"
                                                const t = new Date(); t.setHours(0, 0, 0, 0);

                                                // Normalize comparison
                                                if (d.toDateString() === t.toDateString()) return "Today";

                                                const tom = new Date(t); tom.setDate(tom.getDate() + 1);
                                                if (d.toDateString() === tom.toDateString()) return "Tomorrow";

                                                return d.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' });
                                            })();

                                            return (
                                                <div key={dateKey}>
                                                    <h3 className="text-xl font-bold text-cinema-red uppercase tracking-wider mb-6 flex items-center gap-2 border-l-4 border-cinema-red pl-3">
                                                        <Calendar size={20} /> {displayDate}
                                                    </h3>

                                                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                                                        {movies.map(({ info, isEvent, showtimes }) => (
                                                            <div key={info.id} className="bg-[#1a1a1a] border border-white/5 rounded-2xl overflow-hidden hover:border-white/20 transition-all group">
                                                                <div className="flex h-48">
                                                                    {/* Mini Poster */}
                                                                    <img src={isEvent ? info.imageUrl : info.posterUrl} className="w-32 h-full object-cover" alt={info.title} />

                                                                    <div className="p-5 flex-1 flex flex-col justify-between">
                                                                        <div>
                                                                            <div className="text-xs font-bold text-cinema-red uppercase tracking-wider mb-1">
                                                                                {isEvent ? 'Event' : info.genre}
                                                                            </div>
                                                                            <h3 className="text-white font-bold text-xl leading-tight line-clamp-2 mb-2 group-hover:text-cinema-red transition-colors">
                                                                                {info.title}
                                                                            </h3>
                                                                            <div className="text-gray-500 text-xs">
                                                                                {isEvent ? 'Special Event' : `${info.duration} min`}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                {/* Showtimes Pill List */}
                                                                <div className="bg-black/40 p-4 border-t border-white/5">
                                                                    <div className="flex items-center gap-2 mb-3 text-xs font-bold text-gray-400 uppercase">
                                                                        <Clock size={12} /> Showtimes
                                                                    </div>
                                                                    <div className="flex flex-wrap gap-2">
                                                                        {showtimes.sort((a, b) => new Date(a.startTime) - new Date(b.startTime)).map(st => (
                                                                            <Link
                                                                                key={st.id}
                                                                                to={isEvent ? `/booking/event/${info.id}?showtimeId=${st.id}` : `/booking/${info.id}?showtimeId=${st.id}`}
                                                                                className="px-3 py-1.5 bg-white/5 hover:bg-cinema-red hover:text-white rounded-lg text-sm text-gray-300 transition-colors border border-white/10"
                                                                            >
                                                                                {new Date(st.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                                            </Link>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default CinemasPage;
