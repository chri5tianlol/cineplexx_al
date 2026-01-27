import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

const StatusModal = ({ isOpen, onClose, title, message, type = 'success', autoClose = true }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in">
            <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-8 max-w-sm w-full mx-4 shadow-2xl relative flex flex-col items-center text-center animate-scale-in">

                <div className={`mb-4 p-4 rounded-full ${type === 'success' ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                    {type === 'success' ? <CheckCircle size={48} /> : <XCircle size={48} />}
                </div>

                <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
                <p className="text-gray-400 mb-6">{message}</p>

                <button
                    onClick={onClose}
                    className="bg-white/10 hover:bg-white/20 text-white font-bold px-8 py-2 rounded-xl transition-colors"
                >
                    Close
                </button>
            </div>
        </div>
    );
};

export default StatusModal;
