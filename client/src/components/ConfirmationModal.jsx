import React from 'react';

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message, confirmText = "Confirm", cancelText = "Cancel", isDanger = false }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
            <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-8 max-w-sm w-full mx-4 shadow-2xl relative animate-fade-in-up">

                <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
                <p className="text-gray-400 text-sm mb-8 leading-relaxed">
                    {message}
                </p>

                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-3 rounded-xl border border-white/10 text-gray-300 font-bold hover:bg-white/5 transition-colors uppercase text-xs tracking-wider"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={() => { onConfirm(); onClose(); }}
                        className={`flex-1 px-4 py-3 rounded-xl font-bold text-white transition-colors uppercase text-xs tracking-wider shadow-lg ${isDanger ? 'bg-red-900/80 hover:bg-red-800 shadow-red-900/20' : 'bg-cinema-red hover:bg-red-700 shadow-red-600/20'}`}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;
