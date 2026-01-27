import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminLoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });

            if (res.data.user.role !== 'admin' && res.data.user.role !== 'staff') {
                setError('Access Denied. Admins and Staff only.');
                return;
            }

            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));

            navigate('/admin');
            window.location.reload();
        } catch (err) {
            setError(err.response?.data?.error || 'Login failed');
        }
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center pt-32 relative border-t-4 border-cinema-red">

            <div className="relative z-10 w-full max-w-md p-8 bg-[#1a1a1a] border border-white/5 rounded-none shadow-[0_0_50px_rgba(0,0,0,0.8)]">
                <div className="text-center mb-8">
                    <div className="inline-block bg-cinema-red text-white text-xs font-bold px-2 py-1 uppercase tracking-widest mb-4">Staff Portal</div>
                    <h1 className="text-2xl font-bold text-white uppercase">Admin Access</h1>
                </div>

                {error && <div className="bg-red-900/50 border border-red-500 text-white p-3 mb-6 text-sm text-center font-mono">{error}</div>}

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-xs font-mono text-gray-500 uppercase mb-2">Staff ID (Email)</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-black border border-gray-800 px-4 py-3 text-white focus:border-cinema-red outline-none font-mono"
                            placeholder="admin@cineplexx.com"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-mono text-gray-500 uppercase mb-2">Secure Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-black border border-gray-800 px-4 py-3 text-white focus:border-cinema-red outline-none font-mono"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <button type="submit" className="w-full bg-gray-800 hover:bg-cinema-red text-white font-bold py-4 transition-all uppercase tracking-wider text-sm border border-gray-700 hover:border-cinema-red">
                        Authenticate
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminLoginPage;
