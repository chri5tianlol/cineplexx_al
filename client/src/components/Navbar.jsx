import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShieldCheck, User, Menu, X, ChevronDown } from 'lucide-react';

const Navbar = () => {
    const location = useLocation();
    const isActive = (path) => location.pathname === path;
    const [showCinemas, setShowCinemas] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Close mobile menu on route change
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [location.pathname]);

    // Lock body scroll when menu is open
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [isMobileMenuOpen]);

    // Safe user parsing
    const user = (() => {
        try {
            return JSON.parse(localStorage.getItem('user')) || {};
        } catch {
            return {};
        }
    })();
    const token = localStorage.getItem('token');

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.reload();
    };

    return (
        <div className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4">
            <nav className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-full px-6 h-16 flex items-center shadow-2xl w-full max-w-6xl justify-between transition-all duration-300 relative z-50">

                {/* Logo */}
                <Link to="/" className="flex items-center gap-3 group shrink-0">
                    <img src="/logo.png" alt="Cineplexx" className="h-8 hover:saturate-150 transition-all" />
                </Link>

                {/* Desktop Center Links */}
                <div className="hidden md:flex items-center gap-1">
                    <NavLink to="/" label="Movies" active={isActive('/')} />
                    <NavLink to="/events" label="Events" active={isActive('/events')} />

                    {/* Cinemas Dropdown Trigger */}
                    <div
                        className="relative group"
                        onMouseEnter={() => setShowCinemas(true)}
                        onMouseLeave={() => setShowCinemas(false)}
                    >
                        <Link
                            to="/cinemas"
                            className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 uppercase tracking-wide block ${isActive('/cinemas') ? 'bg-white/10 text-cinema-red shadow-inner' : 'text-gray-400 hover:text-white'}`}
                        >
                            Cinemas
                        </Link>

                        {/* Dropdown */}
                        <div className={`absolute top-full left-1/2 -translate-x-1/2 mt-2 w-64 bg-[#1a1a1a] border border-white/10 rounded-2xl shadow-xl overflow-hidden transition-all duration-300 ${showCinemas ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-2 pointer-events-none'}`}>
                            <div className="p-2 space-y-1">
                                <div className="px-4 py-2 hover:bg-white/5 rounded-xl cursor-pointer group/item">
                                    <div className="text-white font-bold text-sm">QTU Tirana</div>
                                    <div className="text-xs text-gray-500 group-hover/item:text-cinema-red transition-colors">4 Halls • IMAX</div>
                                </div>
                                <div className="px-4 py-2 hover:bg-white/5 rounded-xl cursor-pointer group/item">
                                    <div className="text-white font-bold text-sm">TEG Tirana</div>
                                    <div className="text-xs text-gray-500 group-hover/item:text-cinema-red transition-colors">7 Halls • VIP Suites</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <NavLink to="/reserve" label="Reserve Hall" active={isActive('/reserve')} />
                </div>

                {/* Desktop Right Actions */}
                <div className="hidden md:flex items-center gap-4">
                    {token ? (
                        <div className="flex items-center gap-4">
                            {(!user.role || user.role === 'user') && (
                                <Link
                                    to="/dashboard"
                                    className={`px-3 py-2 rounded-full transition-all duration-300 ${isActive('/dashboard') ? 'bg-white/10 text-cinema-red shadow-inner' : 'text-gray-400 hover:text-cinema-red hover:bg-white/5'}`}
                                    title={user.name || 'User Dashboard'}
                                >
                                    <User size={20} />
                                </Link>
                            )}
                            {(user.role === 'admin' || user.role === 'staff') && (
                                <Link
                                    to="/admin"
                                    className={`px-3 py-2 rounded-full transition-all duration-300 ${isActive('/admin') ? 'bg-white/10 text-cinema-red shadow-inner' : 'text-gray-400 hover:text-cinema-red hover:bg-white/5'}`}
                                    title="Admin Panel"
                                >
                                    <ShieldCheck size={20} />
                                </Link>
                            )}
                            <button
                                onClick={handleLogout}
                                className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full text-xs font-bold uppercase transition-colors"
                            >
                                Logout
                            </button>
                        </div>
                    ) : (
                        <Link
                            to="/login"
                            className="bg-cinema-red hover:bg-red-700 text-white font-bold py-2 px-6 rounded-full shadow-lg shadow-red-600/20 transition-all uppercase tracking-wider text-xs"
                        >
                            Sign In
                        </Link>
                    )}
                </div>

                {/* Mobile Hamburger Toggle */}
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="md:hidden p-2 text-white hover:text-cinema-red transition-colors z-50 relative"
                >
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </nav>

            {/* Mobile Menu Overlay */}
            <div className={`fixed inset-0 bg-[#121212]/95 backdrop-blur-3xl z-40 flex flex-col pt-32 px-8 transition-all duration-500 ease-in-out md:hidden ${isMobileMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full pointer-events-none'}`}>

                <div className="flex flex-col gap-6 text-center">
                    <MobileNavLink to="/" label="Movies" active={isActive('/')} />
                    <MobileNavLink to="/events" label="Events" active={isActive('/events')} />
                    <MobileNavLink to="/cinemas" label="Cinemas" active={isActive('/cinemas')} />
                    <MobileNavLink to="/reserve" label="Reserve Hall" active={isActive('/reserve')} />

                    <div className="w-full h-px bg-white/10 my-2" />

                    {token ? (
                        <div className="flex flex-col gap-4">
                            {(!user.role || user.role === 'user') && (
                                <Link to="/dashboard" className="text-2xl font-bold text-gray-400 flex items-center justify-center gap-3">
                                    <User size={24} /> Dashboard
                                </Link>
                            )}
                            {(user.role === 'admin' || user.role === 'staff') && (
                                <Link to="/admin" className="text-2xl font-bold text-cinema-red flex items-center justify-center gap-3">
                                    <ShieldCheck size={24} /> Admin Panel
                                </Link>
                            )}
                            <button
                                onClick={handleLogout}
                                className="bg-white/10 py-4 rounded-xl text-white font-bold uppercase tracking-widest mt-4"
                            >
                                Logout
                            </button>
                        </div>
                    ) : (
                        <Link
                            to="/login"
                            className="bg-cinema-red py-4 rounded-xl text-white font-bold uppercase tracking-widest mt-4 text-center"
                        >
                            Sign In
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
};

const NavLink = ({ to, label, active }) => (
    <Link
        to={to}
        className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 uppercase tracking-wide ${active ? 'bg-white/10 text-cinema-red shadow-inner' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
    >
        {label}
    </Link>
);

const MobileNavLink = ({ to, label, active }) => (
    <Link
        to={to}
        className={`text-3xl font-black uppercase tracking-tight transition-colors ${active ? 'text-cinema-red' : 'text-white hover:text-cinema-red'}`}
    >
        {label}
    </Link>
);

export default Navbar;
