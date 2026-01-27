import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import StatusModal from './StatusModal';

const AddEventModal = ({ isOpen, onClose, onRefresh, initialData = null }) => {
    const [formData, setFormData] = useState({
        title: '', description: '', imageUrl: ''
    });

    const [statusModal, setStatusModal] = useState({ show: false, title: '', message: '', type: 'success' });

    useEffect(() => {
        if (initialData) {
            const dateObj = new Date(initialData.date);
            const formattedDate = dateObj.toISOString().slice(0, 16);

            setFormData({
                ...initialData,
                date: formattedDate
            });
        } else {
            setFormData({ title: '', description: '', date: '', imageUrl: '', location: '' });
        }
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (initialData) {
                await api.put(`/events/${initialData.id}`, formData);
                setStatusModal({ show: true, title: 'Success', message: 'Event Updated Successfully!', type: 'success' });
            } else {
                await api.post('/events', formData);
                setStatusModal({ show: true, title: 'Success', message: 'Event Added Successfully!', type: 'success' });
            }
            onRefresh();
        } catch (err) {
            console.error(err);
            const msg = err.response?.data?.error || err.message || 'Error saving event';
            setStatusModal({ show: true, title: 'Error', message: msg, type: 'error' });
        }
    };

    const handleCloseStatus = () => {
        setStatusModal({ show: false, title: '', message: '', type: 'success' });
        if (statusModal.type === 'success') {
            onClose();
            if (!initialData) setFormData({ title: '', description: '', date: '', imageUrl: '', location: '' });
        }
    };

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    return (
        <>
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-6 md:p-8 max-w-2xl w-full shadow-2xl overflow-y-auto max-h-[90vh]">
                    <h3 className="text-2xl font-bold text-white mb-6">{initialData ? 'Edit Event' : 'Add New Event'}</h3>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-gray-400 mb-2 text-sm font-bold uppercase">Event Title</label>
                            <input name="title" value={formData.title} onChange={handleChange} className="w-full bg-black/40 border border-gray-700 rounded-xl p-3 text-white focus:border-cinema-red outline-none" required />
                        </div>
                        <div>
                            <label className="block text-gray-400 mb-2 text-sm font-bold uppercase">Description</label>
                            <textarea name="description" value={formData.description} onChange={handleChange} className="w-full bg-black/40 border border-gray-700 rounded-xl p-3 text-white focus:border-cinema-red outline-none h-24" required />
                        </div>
                        <div>
                            <label className="block text-gray-400 mb-2 text-sm font-bold uppercase">Event Image</label>

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
                                                setFormData({ ...formData, imageUrl: res.data.url });
                                            } catch (err) {
                                                setStatusModal({ show: true, title: 'Error', message: 'Upload Failed', type: 'error' });
                                                console.error(err);
                                            }
                                        }
                                    }}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                />

                                <div className={`w-full bg-black/40 border-2 border-dashed ${formData.imageUrl ? 'border-green-500/50' : 'border-gray-700'} rounded-xl p-8 text-center transition-all group-hover:border-cinema-red`}>
                                    {formData.imageUrl ? (
                                        <div className="flex flex-col items-center">
                                            <img src={formData.imageUrl} alt="Preview" className="h-48 object-contain rounded mb-4 shadow-lg bg-black" />
                                            <span className="text-green-500 text-sm font-bold">Image Uploaded!</span>
                                        </div>
                                    ) : (
                                        <div className="text-gray-400">
                                            <p className="mb-2 text-2xl">📂</p>
                                            <p className="text-sm font-bold">Click or Drag to Upload Image</p>
                                            <p className="text-xs text-gray-600 mt-2">JPG, PNG, WebP up to 5MB</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4 pt-4">
                            <button type="button" onClick={onClose} className="flex-1 bg-white/5 hover:bg-white/10 text-white font-bold py-3 rounded-xl border border-white/5">Cancel</button>
                            <button type="submit" className="flex-1 bg-cinema-red hover:bg-red-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-red-900/30">
                                {initialData ? 'Save Changes' : 'Add Event'}
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

export default AddEventModal;
