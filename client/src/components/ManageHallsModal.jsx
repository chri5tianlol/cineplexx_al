import React, { useState, useEffect } from 'react';
import api from '../api/axios';

const ManageHallsModal = ({ isOpen, onClose, cinema, onRefresh }) => {
    const [halls, setHalls] = useState([]);
    const [name, setName] = useState('');
    const [totalRows, setTotalRows] = useState(8);
    const [seatsPerRow, setSeatsPerRow] = useState(10);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isOpen && cinema) {
            setHalls(cinema.Halls || []);
            // Ideally fetch fresh halls if needed, but cinema object might be stale.
            // Let's fetch the latest details for this cinema to be sure.
            fetchCinemaDetails();
        }
    }, [isOpen, cinema]);

    const fetchCinemaDetails = async () => {
        try {
            const res = await api.get(`/cinemas/${cinema.id}`);
            setHalls(res.data.Halls || []);
        } catch (err) {
            console.error(err);
        }
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await api.post('/halls', {
                name,
                totalRows,
                seatsPerRow,
                cinemaId: cinema.id
            });
            setName('');
            fetchCinemaDetails();
            if (onRefresh) onRefresh();
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to add hall');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure? This will delete all showtimes and bookings for this hall.')) return;
        try {
            await api.delete(`/halls/${id}`);
            fetchCinemaDetails();
            if (onRefresh) onRefresh();
        } catch (err) {
            alert('Failed to delete hall');
        }
    };

    if (!isOpen || !cinema) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-6 md:p-8 max-w-4xl w-full shadow-2xl overflow-y-auto max-h-[90vh]">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h3 className="text-2xl font-bold text-white">Manage Halls</h3>
                        <p className="text-gray-400">{cinema.name}</p>
                    </div>
                    <button onClick={onClose} className="text-gray-500 hover:text-white text-2xl">×</button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* List */}
                    <div className="border border-white/5 rounded-xl bg-black/20 p-4">
                        <h4 className="text-white font-bold mb-4 uppercase text-sm tracking-wide">Existing Halls</h4>
                        <div className="space-y-2 max-h-64 overflow-y-auto">
                            {halls.length === 0 ? <p className="text-gray-500 text-sm">No halls created.</p> : halls.map(hall => (
                                <div key={hall.id} className="flex justify-between items-center bg-white/5 p-3 rounded-lg border border-white/5 hover:border-cinema-red/30 transition-all">
                                    <div>
                                        <div className="text-white font-medium text-sm">{hall.name}</div>
                                        <div className="text-xs text-gray-500">Capacity: {hall.capacity} ({hall.totalRows}x{hall.seatsPerRow})</div>
                                    </div>
                                    <button onClick={() => handleDelete(hall.id)} className="text-gray-500 hover:text-red-500">×</button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Add Form */}
                    <div>
                        <h4 className="text-white font-bold mb-4 uppercase text-sm tracking-wide">Add New Hall</h4>
                        {error && <div className="text-red-500 text-xs mb-3">{error}</div>}
                        <form onSubmit={handleAdd} className="space-y-3">
                            <div>
                                <label className="block text-gray-400 text-xs font-bold uppercase mb-1">Hall Name</label>
                                <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full bg-black border border-white/10 rounded p-3 text-white focus:border-cinema-red outline-none text-sm" placeholder="e.g. Salla 3 or VIP Lounge" required />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-gray-400 text-xs font-bold uppercase mb-1">Rows</label>
                                    <input type="number" value={totalRows} onChange={e => setTotalRows(e.target.value)} className="w-full bg-black border border-white/10 rounded p-3 text-white focus:border-cinema-red outline-none text-sm" min="1" required />
                                </div>
                                <div>
                                    <label className="block text-gray-400 text-xs font-bold uppercase mb-1">Seats/Row</label>
                                    <input type="number" value={seatsPerRow} onChange={e => setSeatsPerRow(e.target.value)} className="w-full bg-black border border-white/10 rounded p-3 text-white focus:border-cinema-red outline-none text-sm" min="1" required />
                                </div>
                            </div>
                            <div className="text-xs text-gray-500 mt-1">Total Capacity: {totalRows * seatsPerRow} seats</div>

                            <button type="submit" className="w-full bg-cinema-red hover:bg-red-700 text-white font-bold py-3 rounded-xl mt-2 shadow-lg shadow-red-900/20">Create Hall</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManageHallsModal;
