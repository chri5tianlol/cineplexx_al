import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { Building2, Users, MonitorPlay, ArrowRight } from 'lucide-react';

const ReservePage = () => {
    const [cinemas, setCinemas] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHalls = async () => {
            try {
                const res = await api.get('/cinemas');
                setCinemas(res.data);
            } catch (err) {
                console.error("Failed to load halls", err);
            } finally {
                setLoading(false);
            }
        };
        fetchHalls();
    }, []);

    if (loading) return <div className="min-h-screen bg-[#121212] flex items-center justify-center text-white animate-pulse">Loading Halls...</div>;

    return (
        <div className="min-h-screen bg-[#121212] text-white">

            {/* Hero Section */}
            <div className="relative h-[50vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-black/60 to-black/40 z-10" />
                <div className="absolute inset-0">
                    <img
                        src="/cinema_bg.jpg"
                        className="w-full h-full object-cover opacity-60"
                        alt="Cinema Hall"
                    />
                </div>
                <div className="relative z-20 text-center px-6">
                    <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-4">
                        Private <span className="text-cinema-red">Screenings</span>
                    </h1>
                    <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                        Reserve an entire cinema hall for your private event, corporate presentation, or gaming tournament.
                    </p>
                </div>
            </div>

            {/* Halls Grid */}
            <div className="container mx-auto px-6 py-20">
                <div className="space-y-32">
                    {cinemas.map(cinema => (
                        <div key={cinema.id} className="animate-fade-in-up">
                            <div className="flex items-end gap-6 border-b border-white/10 pb-6 mb-12">
                                <h2 className="text-4xl font-bold uppercase tracking-wide flex items-center gap-4">
                                    <Building2 className="text-cinema-red" size={40} />
                                    {cinema.name}
                                </h2>
                                <p className="text-gray-400 text-xl pb-1">{cinema.location}</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {(cinema.Halls || []).map(hall => (
                                    <div key={hall.id} className="group bg-[#1a1a1a] border border-white/5 rounded-3xl overflow-hidden hover:border-cinema-red/50 transition-all duration-300 hover:shadow-2xl hover:shadow-red-900/10 hover:-translate-y-2">

                                        {/* Hall Preview (Generic Gradient/Pattern for now) */}
                                        <div className="h-48 bg-gradient-to-br from-gray-800 to-black relative p-6 flex flex-col justify-end overflow-hidden">
                                            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
                                            <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-white border border-white/10">
                                                {hall.totalRows * hall.seatsPerRow} Seats
                                            </div>
                                            <h3 className="text-3xl font-black text-white relative z-10">{hall.name}</h3>
                                        </div>

                                        <div className="p-8">
                                            <div className="space-y-4 mb-8">
                                                <div className="flex items-center gap-3 text-gray-400">
                                                    <Users size={18} className="text-cinema-red" />
                                                    <span className="text-sm">Capacity: <span className="text-white font-bold">{hall.totalRows * hall.seatsPerRow} Guests</span></span>
                                                </div>
                                                <div className="flex items-center gap-3 text-gray-400">
                                                    <MonitorPlay size={18} className="text-cinema-red" />
                                                    <span className="text-sm">Features: <span className="text-white font-bold">4K Projector, Dolby 7.1</span></span>
                                                </div>
                                            </div>

                                            <button
                                                disabled
                                                className="w-full py-4 bg-white/5 border border-white/10 rounded-xl text-gray-500 font-bold uppercase tracking-wider text-sm cursor-not-allowed flex items-center justify-center gap-2 group-hover:bg-white/10 transition-colors"
                                                title="Reservations coming soon"
                                            >
                                                <span>Reservations Closed</span>
                                            </button>
                                            <p className="text-center text-xs text-gray-600 mt-3 font-medium uppercase tracking-wide">
                                                Booking Available Soon
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ReservePage;
