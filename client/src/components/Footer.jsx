import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-black border-t border-white/10 pt-16 pb-8">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    {/* Brand */}
                    <div className="space-y-4">
                        <Link to="/" className="flex items-center gap-2">
                            <img src="/logo.png" alt="Cineplexx" className="h-6 grayscale hover:grayscale-0 transition-all" />
                        </Link>
                        <p className="text-gray-500 text-sm leading-relaxed">
                            Experience movies like never before. Premium halls, IMAX screens, and VIP suites for the ultimate cinema experience.
                        </p>
                    </div>

                    {/* Links */}
                    <div>
                        <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">Cinema</h4>
                        <ul className="space-y-3 text-gray-500 text-sm">
                            <li><Link to="/" className="hover:text-cinema-red transition-colors">Now Showing</Link></li>
                            <li><Link to="/" className="hover:text-cinema-red transition-colors">Coming Soon</Link></li>
                            <li><div className="hover:text-cinema-red transition-colors cursor-pointer">Cinemas</div></li>
                            <li><div className="hover:text-cinema-red transition-colors cursor-pointer">Offers</div></li>
                        </ul>
                    </div>

                    {/* Links */}
                    <div>
                        <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">Support</h4>
                        <ul className="space-y-3 text-gray-500 text-sm">
                            <li><div className="hover:text-cinema-red transition-colors cursor-pointer">Contact Us</div></li>
                            <li><div className="hover:text-cinema-red transition-colors cursor-pointer">FAQ</div></li>
                            <li><div className="hover:text-cinema-red transition-colors cursor-pointer">Privacy Policy</div></li>
                            <li><div className="hover:text-cinema-red transition-colors cursor-pointer">Terms of Service</div></li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">Newsletter</h4>
                        <p className="text-gray-500 text-sm mb-4">Subscribe to get special offers and movie updates.</p>
                        <div className="flex gap-2">
                            <input type="email" placeholder="Your email" className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white text-sm w-full focus:border-cinema-red outline-none focus:ring-1 focus:ring-cinema-red transition-all" />
                            <button className="bg-cinema-red hover:bg-red-700 text-white p-2 rounded-lg transition-colors">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                            </button>
                        </div>
                    </div>
                </div>

                <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-600">
                    <p>&copy; 2026 Cineplexx. All rights reserved.</p>
                    <div className="flex gap-6">
                        <span className="cursor-pointer hover:text-white transition-colors">Instagram</span>
                        <span className="cursor-pointer hover:text-white transition-colors">Facebook</span>
                        <span className="cursor-pointer hover:text-white transition-colors">Twitter</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
