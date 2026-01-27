import React from 'react';
import { useNavigate } from 'react-router-dom';

const LoginModal = ({ onClose }) => {
    const navigate = useNavigate();

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
            <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-8 max-w-sm w-full mx-4 text-center shadow-2xl relative">

                <h2 className="text-xl font-black text-white uppercase mb-2">Account Required</h2>
                <p className="text-gray-400 text-sm mb-6">Please login to your account to reserve seats or book tickets.</p>

                <div className="space-y-3">
                    <button
                        onClick={() => navigate('/login')}
                        className="w-full bg-cinema-red hover:bg-red-700 text-white font-bold py-3 rounded-xl transition-all uppercase tracking-wide"
                    >
                        Sign In
                    </button>
                    <button
                        onClick={() => navigate('/register')}
                        className="w-full bg-white/5 hover:bg-white/10 text-white font-bold py-3 rounded-xl transition-all uppercase tracking-wide border border-white/10"
                    >
                        Create Account
                    </button>
                </div>

                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-white"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
            </div>
        </div>
    );
};

export default LoginModal;
