import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import SeatGrid from './SeatGrid';

const CinemaScheduleModal = ({ isOpen, onClose, cinema }) => {
    const [halls, setHalls] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [loading, setLoading] = useState(true);

    // Seat View State
    const [viewingShowtime, setViewingShowtime] = useState(null);
    const [seatData, setSeatData] = useState(null);
    const [loadingSeats, setLoadingSeats] = useState(false);

    useEffect(() => {
        if (isOpen && cinema) {
            fetchSchedule();
            setViewingShowtime(null); // Reset when opening fresh
        }
    }, [isOpen, cinema, selectedDate]);

    const fetchSchedule = async () => {
        setLoading(true);
        try {
            const res = await api.get(`/cinemas/${cinema.id}`);
            setHalls(res.data.Halls || []);
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    };

    const handleViewSeats = async (showtime, hall) => {
        setViewingShowtime({ ...showtime, Hall: hall, Cinema: cinema });
        setSeatData(null);
        setLoadingSeats(true);
        try {
            const res = await api.get(`/seats/${showtime.id}`);
            setSeatData(res.data.seats);
        } catch (err) {
            console.error(err);
            alert('Failed to load seats');
        }
        setLoadingSeats(false);
    };

    if (!isOpen || !cinema) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
            <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-6 w-full max-w-6xl shadow-2xl h-[90vh] flex flex-col relative">

                {/* Header */}
                <div className="flex justify-between items-center mb-6 shrink-0">
                    <div>
                        <h3 className="text-3xl font-bold text-white">Cinema Schedule</h3>
                        <p className="text-gray-400">{cinema.name} • {cinema.location}</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="bg-black border border-white/10 rounded-lg px-4 py-2 text-white [color-scheme:dark]"
                        />
                        <button onClick={onClose} className="text-gray-500 hover:text-white text-3xl">×</button>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 overflow-x-auto overflow-y-auto">
                    {loading ? (
                        <div className="text-white text-center py-20">Loading schedule...</div>
                    ) : (
                        <div className="min-w-[800px]">
                            {/* Grid Header */}
                            <div className="grid grid-cols-[200px_1fr] border-b border-white/10 pb-4 mb-4">
                                <div className="font-bold text-gray-500 uppercase">Hall</div>
                                <div className="font-bold text-gray-500 uppercase">Timeline ({new Date(selectedDate).toLocaleDateString()})</div>
                            </div>

                            {/* Halls Rows */}
                            <div className="space-y-6">
                                {halls.map(hall => {
                                    const daysShowtimes = (hall.Showtimes || []).filter(st => {
                                        const stDate = new Date(st.startTime).toISOString().split('T')[0];
                                        return stDate === selectedDate;
                                    }).sort((a, b) => new Date(a.startTime) - new Date(b.startTime));

                                    return (
                                        <div key={hall.id} className="grid grid-cols-[200px_1fr] gap-4 group">
                                            <div className="py-4">
                                                <div className="text-xl font-bold text-white">{hall.name}</div>
                                                <div className="text-xs text-gray-500">{hall.capacity} Seats</div>
                                            </div>

                                            <div className="relative bg-white/5 rounded-xl h-24 flex items-center px-4 overflow-x-auto custom-scrollbar">
                                                {daysShowtimes.length === 0 ? (
                                                    <span className="text-gray-600 italic text-sm">No screenings</span>
                                                ) : (
                                                    <div className="flex gap-4">
                                                        {daysShowtimes.map(st => (
                                                            <div
                                                                key={st.id}
                                                                onClick={() => handleViewSeats(st, hall)}
                                                                className="flex-shrink-0 cursor-pointer bg-cinema-red/20 hover:bg-cinema-red/40 border border-cinema-red/50 rounded-lg p-3 min-w-[150px] transition-all group/card"
                                                                title="Click to View Seats"
                                                            >
                                                                <div className="font-bold text-cinema-red text-sm truncate">
                                                                    {st.isEvent ? (st.Event?.title || 'Event') : (st.Movie?.title || 'Movie')}
                                                                </div>
                                                                <div className="text-white text-xs font-mono mt-1">
                                                                    {new Date(st.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>

                {/* Seat View Overlay */}
                {viewingShowtime && (
                    <div className="absolute inset-0 z-50 bg-[#1a1a1a] flex flex-col p-6 animate-fade-in">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h4 className="text-2xl font-bold text-white">
                                    {viewingShowtime.isEvent ? (viewingShowtime.Event?.title) : (viewingShowtime.Movie?.title)}
                                </h4>
                                <p className="text-gray-400">
                                    {new Date(viewingShowtime.startTime).toLocaleString()} • {viewingShowtime.Hall?.name} • {viewingShowtime.Cinema?.location}
                                </p>
                            </div>
                            <button
                                onClick={() => setViewingShowtime(null)}
                                className="bg-white/10 hover:bg-white/20 text-white px-6 py-2 rounded-lg font-bold transition-colors"
                            >
                                Close View
                            </button>
                        </div>

                        <div className="flex-1 bg-black/50 rounded-2xl border border-white/5 p-4 overflow-y-auto custom-scrollbar relative">
                            {loadingSeats ? (
                                <div className="absolute inset-0 flex items-center justify-center text-white animate-pulse">Loading Seat Map...</div>
                            ) : (
                                <div className="min-h-full flex items-center justify-center py-10 scale-90 origin-center">
                                    <SeatGrid
                                        seats={seatData}
                                        onSeatSelect={() => { }} // Read only
                                        selectedSeatLabel={null}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default CinemaScheduleModal;
