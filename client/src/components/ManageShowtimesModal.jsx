import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import ConfirmationModal from './ConfirmationModal';

const ManageShowtimesModal = ({ isOpen, onClose, movie, event }) => {
    const [showtimes, setShowtimes] = useState([]);
    const item = movie || event; // Generic item
    const isEvent = !!event;

    // ... (rest of state)
    const [halls, setHalls] = useState([]);
    const [loading, setLoading] = useState(false);

    // Form
    const [hallId, setHallId] = useState('');
    const [startTime, setStartTime] = useState('');
    const [price, setPrice] = useState(10);
    const [error, setError] = useState('');

    // Confirmation Modal State
    const [showConfirm, setShowConfirm] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    useEffect(() => {
        if (isOpen && item) {
            fetchData();
        }
    }, [isOpen, item]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const endpoint = isEvent ? `/showtimes/event/${item.id}` : `/showtimes/${item.id}`;
            const resST = await api.get(endpoint);
            setShowtimes(resST.data);

            // Fetch Halls
            const resHalls = await api.get('/halls');
            setHalls(resHalls.data);
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const payload = {
                hallId,
                startTime,
                price
            };

            if (isEvent) {
                payload.eventId = item.id;
            } else {
                payload.movieId = item.id;
            }

            await api.post('/showtimes', payload);
            fetchData();
            setStartTime('');
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to add showtime');
        }
    };

    const confirmDelete = (id) => {
        setDeleteId(id);
        setShowConfirm(true);
    };

    const handleExecuteDelete = async () => {
        if (!deleteId) return;
        try {
            await api.delete(`/showtimes/${deleteId}`);
            fetchData();
        } catch (err) {
            alert('Error deleting');
        }
        setShowConfirm(false);
    };

    if (!isOpen || !item) return null;

    return (
        <>
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-6 md:p-8 max-w-4xl w-full shadow-2xl overflow-y-auto max-h-[90vh]">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h3 className="text-2xl font-bold text-white">Manage Schedule</h3>
                            <p className="text-gray-400">{isEvent ? 'Event' : 'Movie'}: {item.title}</p>
                        </div>
                        <button onClick={onClose} className="text-gray-500 hover:text-white text-2xl">×</button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* List */}
                        <div className="border border-white/5 rounded-xl bg-black/20 p-4">
                            <h4 className="text-white font-bold mb-4 uppercase text-sm tracking-wide">Current Showtimes</h4>
                            <div className="space-y-2 max-h-64 overflow-y-auto">
                                {showtimes.length === 0 ? <p className="text-gray-500 text-sm">No showtimes scheduled.</p> : showtimes.map(st => (
                                    <div key={st.id} className="flex justify-between items-center bg-white/5 p-3 rounded-lg border border-white/5 hover:border-cinema-red/30 transition-all">
                                        <div>
                                            <div className="text-white font-medium text-sm">{new Date(st.startTime).toLocaleString()}</div>
                                            <div className="text-xs text-cinema-red">{st.Hall?.name} • {st.Hall?.Cinema?.name}</div>
                                        </div>
                                        <button onClick={() => confirmDelete(st.id)} className="text-gray-500 hover:text-red-500">×</button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Add Form */}
                        <div>
                            <h4 className="text-white font-bold mb-4 uppercase text-sm tracking-wide">Add New Slot</h4>
                            {error && <div className="text-red-500 text-xs mb-3">{error}</div>}
                            <form onSubmit={handleAdd} className="space-y-3">
                                <div>
                                    <label className="block text-gray-400 text-xs font-bold uppercase mb-1">Select Hall</label>
                                    <select value={hallId} onChange={e => setHallId(e.target.value)} className="w-full bg-black border border-white/10 rounded p-3 text-white focus:border-cinema-red outline-none text-sm" required>
                                        <option value="">-- Choose Hall --</option>
                                        {halls.map(h => (
                                            <option key={h.id} value={h.id}>{h.name} • {h.Cinema?.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-gray-400 text-xs font-bold uppercase mb-1">Date & Time</label>
                                    <input type="datetime-local" value={startTime} onChange={e => setStartTime(e.target.value)} className="w-full bg-black border border-white/10 rounded p-3 text-white focus:border-cinema-red outline-none text-sm [color-scheme:dark]" required />
                                </div>
                                <div>
                                    <label className="block text-gray-400 text-xs font-bold uppercase mb-1">Price (LEK)</label>
                                    <input type="number" value={price} onChange={e => setPrice(e.target.value)} className="w-full bg-black border border-white/10 rounded p-3 text-white focus:border-cinema-red outline-none text-sm" required />
                                </div>
                                <button type="submit" className="w-full bg-cinema-red hover:bg-red-700 text-white font-bold py-3 rounded-xl mt-2 shadow-lg shadow-red-900/20">Add Showtime</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            <ConfirmationModal
                isOpen={showConfirm}
                onClose={() => setShowConfirm(false)}
                onConfirm={handleExecuteDelete}
                title="Delete Showtime?"
                message="Are you sure you want to remove this showtime? Bookings might be affected."
                isDanger={true}
            />
        </>
    );
};

export default ManageShowtimesModal;
