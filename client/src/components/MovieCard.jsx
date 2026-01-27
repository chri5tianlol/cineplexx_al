import React from 'react';
import { Link } from 'react-router-dom';

const MovieCard = ({ movie }) => {
    return (
        <Link to={`/booking/${movie.id}`} className="group relative block w-full aspect-[2/3] bg-gray-900 rounded-xl overflow-hidden shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:shadow-cinema-red/20">
            <div className="absolute inset-0 bg-gray-800 animate-pulse" /> {/* Placeholder */}
            <img
                src={movie.posterUrl}
                alt={movie.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />

            {/* Dedicated text protection gradient */}
            <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-[#000000] via-[#000000]/80 to-transparent opacity-90" />

            <div className="absolute bottom-0 left-0 right-0 px-6 pb-10 pt-6 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                <h3 className="text-2xl font-bold text-white mb-2 leading-tight drop-shadow-md">{movie.title}</h3>
                <div className="flex items-center gap-3 text-sm font-medium">
                    <span className="px-2 py-1 bg-cinema-red text-white text-xs rounded uppercase tracking-wider">{movie.genre}</span>
                    <span className="text-gray-300">{movie.duration} min</span>
                </div>
            </div>
        </Link>
    );
};

export default MovieCard;
