import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import MovieCard from '../components/MovieCard';
import { ChevronRight, ChevronLeft } from 'lucide-react';

const Dashboard = () => {
    const [movies, setMovies] = useState([]);
    const [heroMovie, setHeroMovie] = useState(null);

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const response = await api.get('/movies');
                setMovies(response.data);

                // Helper to parse category safely
                const getCats = (m) => {
                    if (Array.isArray(m.category)) return m.category;
                    try {
                        return JSON.parse(m.category);
                    } catch {
                        return [m.category];
                    }
                };

                // Hero Logic: Prioritize "trending_hero" category, otherwise pick latest
                const trendingHero = response.data.find(m => {
                    const cats = getCats(m);
                    return Array.isArray(cats) && cats.includes('trending_hero');
                });

                if (trendingHero) {
                    setHeroMovie(trendingHero);
                } else if (response.data.length > 0) {
                    setHeroMovie(response.data[0]);
                }
            } catch (error) {
                console.error('Error fetching movies:', error);
            }
        };
        fetchMovies();
    }, []);

    const checkCategory = (movie, cat) => {
        let cats = movie.category;
        if (!Array.isArray(cats)) {
            try { cats = JSON.parse(cats); } catch { cats = [cats]; }
        }
        if (!Array.isArray(cats)) cats = [cats];
        return cats.includes(cat);
    };

    const nowShowing = movies.filter(m => checkCategory(m, 'now_showing') || !m.category);
    const upcoming = movies.filter(m => checkCategory(m, 'upcoming'));
    const fanFavorites = movies.filter(m => checkCategory(m, 'fan_favorites'));

    return (
        <div className="min-h-screen pb-20 bg-[#121212]">
            {/* Hero Section */}
            {heroMovie && (
                <div className="relative h-[85vh] w-full overflow-hidden">
                    {/* Background Image & Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-[#121212]/30 to-transparent z-10" />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#121212] via-[#121212]/50 to-transparent z-10" />

                    <img
                        src={heroMovie.posterUrl}
                        alt={heroMovie.title}
                        className="w-full h-full object-cover object-center opacity-80 scale-105 animate-slow-zoom"
                    />

                    {/* Hero Content */}
                    <div className="absolute bottom-0 inset-x-0 z-20 pb-16 lg:pb-24 pt-32">
                        <div className="container mx-auto px-6">
                            <span className="inline-block px-3 py-1 bg-cinema-red/90 text-white font-bold text-xs tracking-widest uppercase rounded mb-6 backdrop-blur-sm shadow-lg shadow-red-900/40"> #1 Now Trending</span>
                            <h1 className="text-4xl md:text-7xl font-black text-white mb-6 max-w-5xl leading-tight drop-shadow-2xl font-stretch-expanded">{heroMovie.title}</h1>
                            <p className="text-gray-200 text-lg md:text-2xl max-w-2xl mb-10 line-clamp-2 leading-relaxed drop-shadow-md">{heroMovie.description}</p>

                            <div className="flex gap-4">
                                <a href={`/booking/${heroMovie.id}`} className="px-10 py-5 bg-cinema-red hover:bg-red-700 text-white font-bold rounded-full transition-all hover:scale-105 shadow-[0_0_40px_rgba(229,9,20,0.6)] flex items-center gap-3">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2h-1.528A6 6 0 004 9.528V4z" /><path fillRule="evenodd" d="M8 10a4 4 0 00-3.446 6.032l-1.261 1.26a1 1 0 101.414 1.415l1.261-1.261A4 4 0 108 10zm-2 4a2 2 0 114 0 2 2 0 01-4 0z" clipRule="evenodd" /></svg>
                                    GET TICKETS
                                </a>
                                <button className="px-10 py-5 bg-white/10 hover:bg-white/20 hover:text-white text-gray-200 font-bold rounded-full transition-all backdrop-blur-md border border-white/20">
                                    WATCH TRAILER
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Categories / Sections */}
            <div className="relative z-30 container mx-auto px-6 space-y-20 pt-16">

                {nowShowing.length > 0 && <MovieSection title="Now Showing" movies={nowShowing} />}
                {upcoming.length > 0 && <MovieSection title="Upcoming Hits" movies={upcoming} />}
                {fanFavorites.length > 0 && <MovieSection title="Fan Favorites" movies={fanFavorites} />}

            </div>
        </div>
    );
};

// Reusable Section with Pagination
const MovieSection = ({ title, movies }) => {
    const [page, setPage] = useState(0);
    const itemsPerPage = 6;
    const totalPages = Math.ceil(movies.length / itemsPerPage);

    const handleNext = () => {
        setPage((prev) => (prev + 1) % totalPages);
    };

    const handlePrev = () => {
        setPage((prev) => (prev - 1 + totalPages) % totalPages);
    };

    const displayMovies = movies.slice(page * itemsPerPage, (page + 1) * itemsPerPage);

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold text-white flex items-center gap-4">
                    <span className="w-1.5 h-10 bg-cinema-red rounded-full shadow-[0_0_15px_#e50914]"></span>
                    {title}
                </h2>

                {totalPages > 1 && (
                    <div className="flex gap-2">
                        <button onClick={handlePrev} className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white transition-colors border border-white/10">
                            <ChevronLeft size={24} />
                        </button>
                        <button onClick={handleNext} className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white transition-colors border border-white/10">
                            <ChevronRight size={24} />
                        </button>
                    </div>
                )}
            </div>

            <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 animate-fade-in`}>
                {displayMovies.map((movie) => (
                    <MovieCard key={movie.id} movie={movie} />
                ))}
            </div>
        </div>
    );
};

export default Dashboard;
