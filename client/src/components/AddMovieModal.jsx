import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import StatusModal from './StatusModal';

const AddMovieModal = ({ isOpen, onClose, onRefresh, initialData = null }) => {
    const [formData, setFormData] = useState({
        title: '', description: '', duration: '', posterUrl: '', genre: '', category: ['now_showing']
    });

    // Status Modal State
    const [statusModal, setStatusModal] = useState({ show: false, title: '', message: '', type: 'success' });

    useEffect(() => {
        if (initialData) {
            // Handle legacy string data or existing array
            let cats = initialData.category;
            if (typeof cats === 'string') {
                try { cats = JSON.parse(cats); } catch { cats = [cats]; }
            }
            if (!Array.isArray(cats)) cats = [cats || 'now_showing'];

            setFormData({ ...initialData, category: cats });
        } else {
            setFormData({ title: '', description: '', duration: '', posterUrl: '', genre: '', category: ['now_showing'] });
        }
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Ensure category is array
            const payload = { ...formData };
            if (!Array.isArray(payload.category)) {
                payload.category = [payload.category];
            }

            if (initialData) {
                await api.put(`/movies/${initialData.id}`, payload);
                setStatusModal({ show: true, title: 'Success', message: 'Movie Updated Successfully!', type: 'success' });
            } else {
                await api.post('/movies', payload);
                setStatusModal({ show: true, title: 'Success', message: 'Movie Added Successfully!', type: 'success' });
            }
            onRefresh();
            // Allow user to see success message before closing
        } catch (err) {
            console.error(err);
            const msg = err.response?.data?.error || err.message || 'Error saving movie';
            setStatusModal({ show: true, title: 'Error', message: msg, type: 'error' });
        }
    };

    const handleCloseStatus = () => {
        setStatusModal({ show: false, title: '', message: '', type: 'success' });
        if (statusModal.type === 'success') {
            onClose();
            if (!initialData) setFormData({ title: '', description: '', duration: '', posterUrl: '', genre: '', category: ['now_showing'] });
        }
    };

    const addCategory = (cat) => {
        setFormData(prev => ({
            ...prev,
            category: Array.isArray(prev.category) ? [...prev.category, cat] : [prev.category, cat]
        }));
    };

    const removeCategory = (cat) => {
        setFormData(prev => ({
            ...prev,
            category: Array.isArray(prev.category) ? prev.category.filter(c => c !== cat) : []
        }));
    };

    const formatCategory = (cat) => {
        switch (cat) {
            case 'now_showing': return 'Now Showing';
            case 'upcoming': return 'Upcoming Hits';
            case 'fan_favorites': return 'Fan Favorites';
            case 'trending_hero': return '★ Trending Hero';
            default: return cat;
        }
    };

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    return (
        <>
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-6 md:p-8 max-w-2xl w-full shadow-2xl overflow-y-auto max-h-[90vh]">
                    <h3 className="text-2xl font-bold text-white mb-6">{initialData ? 'Edit Movie' : 'Add New Movie'}</h3>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-gray-400 mb-2 text-sm font-bold uppercase">Movie Title</label>
                                <input name="title" value={formData.title} onChange={handleChange} className="w-full bg-black/40 border border-gray-700 rounded-xl p-3 text-white focus:border-cinema-red outline-none" required />
                            </div>
                            <div>
                                <label className="block text-gray-400 mb-2 text-sm font-bold uppercase">Categories</label>
                                <div className="bg-black/40 border border-gray-700 rounded-xl p-3 min-h-[100px]">
                                    {/* Selected Categories */}
                                    <div className="flex flex-wrap gap-2 mb-3">
                                        {Array.isArray(formData.category) && formData.category.map(cat => (
                                            <span key={cat} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-cinema-red text-white shadow-sm shadow-red-900/50 animate-scale-in">
                                                {formatCategory(cat)}
                                                <button
                                                    type="button"
                                                    onClick={() => removeCategory(cat)}
                                                    className="ml-2 hover:text-black/50 transition-colors"
                                                    title="Remove"
                                                >
                                                    -
                                                </button>
                                            </span>
                                        ))}
                                        {(!formData.category || formData.category.length === 0) && <span className="text-gray-500 text-sm italic">No categories selected</span>}
                                    </div>

                                    {/* Available Categories */}
                                    <div className="border-t border-white/10 pt-2">
                                        <p className="text-xs text-gray-500 mb-2 uppercase font-bold tracking-wider">Add Category:</p>
                                        <div className="flex flex-wrap gap-2">
                                            {['now_showing', 'upcoming', 'fan_favorites', 'trending_hero']
                                                .filter(cat => !formData.category?.includes(cat))
                                                .map(cat => (
                                                    <button
                                                        key={cat}
                                                        type="button"
                                                        onClick={() => addCategory(cat)}
                                                        className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white transition-all border border-white/5"
                                                    >
                                                        + {formatCategory(cat)}
                                                    </button>
                                                ))
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-gray-400 mb-2 text-sm font-bold uppercase">Description</label>
                            <textarea name="description" value={formData.description} onChange={handleChange} className="w-full bg-black/40 border border-gray-700 rounded-xl p-3 text-white focus:border-cinema-red outline-none h-24" required />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-gray-400 mb-2 text-sm font-bold uppercase">Duration (min)</label>
                                <input type="number" name="duration" value={formData.duration} onChange={handleChange} className="w-full bg-black/40 border border-gray-700 rounded-xl p-3 text-white focus:border-cinema-red outline-none" required />
                            </div>
                            <div>
                                <label className="block text-gray-400 mb-2 text-sm font-bold uppercase">Genre</label>
                                <input name="genre" value={formData.genre} onChange={handleChange} className="w-full bg-black/40 border border-gray-700 rounded-xl p-3 text-white focus:border-cinema-red outline-none" required />
                            </div>
                        </div>
                        <div>
                            <label className="block text-gray-400 mb-2 text-sm font-bold uppercase">Poster Image</label>

                            {/* Drag & Drop / File Input */}
                            <div className="relative group">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={async (e) => {
                                        const file = e.target.files[0];
                                        if (file) {
                                            const uploadData = new FormData();
                                            uploadData.append('image', file);

                                            try {
                                                const res = await api.post('/upload', uploadData, {
                                                    headers: { 'Content-Type': 'multipart/form-data' }
                                                });
                                                setFormData({ ...formData, posterUrl: res.data.url });
                                            } catch (err) {
                                                setStatusModal({ show: true, title: 'Error', message: 'Upload Failed', type: 'error' });
                                                console.error(err);
                                            }
                                        }
                                    }}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                />

                                <div className={`w-full bg-black/40 border-2 border-dashed ${formData.posterUrl ? 'border-green-500/50' : 'border-gray-700'} rounded-xl p-8 text-center transition-all group-hover:border-cinema-red`}>
                                    {formData.posterUrl ? (
                                        <div className="flex flex-col items-center">
                                            <img src={formData.posterUrl} alt="Preview" className="h-32 object-contain rounded mb-4 shadow-lg" />
                                            <span className="text-green-500 text-sm font-bold">Image Uploaded!</span>
                                        </div>
                                    ) : (
                                        <div className="text-gray-400">
                                            <p className="mb-2 text-2xl">📂</p>
                                            <p className="text-sm font-bold">Click or Drag to Upload Poster</p>
                                            <p className="text-xs text-gray-600 mt-2">JPG, PNG, WebP up to 5MB</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4 pt-4">
                            <button type="button" onClick={onClose} className="flex-1 bg-white/5 hover:bg-white/10 text-white font-bold py-3 rounded-xl border border-white/5">Cancel</button>
                            <button type="submit" className="flex-1 bg-cinema-red hover:bg-red-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-red-900/30">
                                {initialData ? 'Save Changes' : 'Add Movie'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <StatusModal
                isOpen={statusModal.show}
                onClose={handleCloseStatus}
                title={statusModal.title}
                message={statusModal.message}
                type={statusModal.type}
            />
        </>
    );
};

export default AddMovieModal;
