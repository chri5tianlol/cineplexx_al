import React, { useState } from 'react';
import api from '../api/axios';

const AddStaffModal = ({ isOpen, onClose, onRefresh }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [generatedPassword, setGeneratedPassword] = useState('');
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setGeneratedPassword('');

        try {
            const res = await api.post('/admin/staff', { name, email });
            setGeneratedPassword(res.data.generatedPassword);
            onRefresh();
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to create staff');
        }
    };

    const handleClose = () => {
        setGeneratedPassword('');
        setName('');
        setEmail('');
        setError('');
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
            <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
                <h3 className="text-xl font-bold text-white mb-6">Create Staff Account</h3>

                {generatedPassword ? (
                    <div className="bg-green-900/30 border border-green-500/30 rounded-xl p-6 text-center space-y-4">
                        <div className="w-12 h-12 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto text-2xl">✓</div>
                        <h4 className="text-white font-bold">Account Created!</h4>
                        <p className="text-gray-400 text-sm">Please copy this password and give it to the staff member. You won't see it again.</p>
                        <div className="bg-black/50 p-4 rounded-lg font-mono text-xl text-cinema-red tracking-widest select-all border border-white/10">
                            {generatedPassword}
                        </div>
                        <button onClick={handleClose} className="w-full bg-white/10 hover:bg-white/20 text-white font-bold py-3 rounded-xl mt-4">
                            Done
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && <div className="text-red-500 text-sm bg-red-900/20 p-3 rounded-lg border border-red-900/40">{error}</div>}
                        <div>
                            <label className="block text-gray-500 text-xs font-bold uppercase mb-1">Name</label>
                            <input value={name} onChange={e => setName(e.target.value)} className="w-full bg-black border border-white/10 rounded-lg p-3 text-white focus:border-cinema-red outline-none" required />
                        </div>
                        <div>
                            <label className="block text-gray-500 text-xs font-bold uppercase mb-1">Email</label>
                            <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-black border border-white/10 rounded-lg p-3 text-white focus:border-cinema-red outline-none" required />
                        </div>
                        <div className="flex gap-3 mt-6">
                            <button type="button" onClick={handleClose} className="flex-1 bg-white/5 hover:bg-white/10 text-gray-300 font-bold py-3 rounded-xl">Cancel</button>
                            <button type="submit" className="flex-1 bg-cinema-red hover:bg-red-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-red-900/20">Create Staff</button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default AddStaffModal;
