import React from 'react';
import { Film, Calendar, Ticket, Users, MapPin } from 'lucide-react';

const AdminSidebar = ({ activeTab, setActiveTab, userRole }) => {
    const tabs = [
        { id: 'movies', label: 'Movies', icon: Film },
        { id: 'events', label: 'Events', icon: Calendar },
        { id: 'reservations', label: 'Reservations', icon: Ticket },
    ];

    if (userRole === 'admin') {
        tabs.push({ id: 'staff', label: 'Staff Users', icon: Users });
    }
    // Cinemas available for both admin and staff? User said "admins and staff dashboard".
    tabs.splice(1, 0, { id: 'cinemas', label: 'Cinemas', icon: MapPin });

    return (
        <div className="w-full md:w-64 bg-[#1a1a1a] md:min-h-[calc(100vh-100px)] border-r border-white/5 p-4 flex flex-row md:flex-col gap-2 overflow-x-auto">
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all w-full text-left whitespace-nowrap ${activeTab === tab.id
                        ? 'bg-cinema-red text-white font-bold shadow-lg shadow-red-900/20'
                        : 'text-gray-400 hover:bg-white/5 hover:text-white'
                        }`}
                >
                    <tab.icon size={20} />
                    {tab.label}
                </button>
            ))}
        </div>
    );
};

export default AdminSidebar;
