import React from 'react';

const SeatGrid = ({ seats, onSeatSelect, selectedSeatLabel }) => {
    if (!seats || seats.length === 0) return <div className="text-gray-500 text-center py-10">No seats available or layout missing.</div>;

    const rows = {};
    seats.forEach(seat => {
        if (!rows[seat.row]) rows[seat.row] = [];
        rows[seat.row].push(seat);
    });

    return (
        <div className="flex flex-col items-center w-full">
            {/* Screen - Made relative to avoid overlap */}
            <div className="mb-12 mt-6 w-full flex flex-col items-center relative">
                <div className="w-3/4 h-2 bg-gradient-to-r from-gray-800 via-white/50 to-gray-800 rounded-full mb-4 shadow-[0_10px_30px_rgba(255,255,255,0.1)]"></div>
                <p className="text-gray-600 text-xs tracking-[0.3em] uppercase">Screen</p>
                <div className="w-full h-16 bg-gradient-to-b from-white/5 to-transparent skew-x-12 opacity-50 absolute top-8 pointer-events-none"></div>
            </div>

            <div className="flex flex-col gap-1 md:gap-3">
                {Object.keys(rows).map(rowNum => (
                    <div key={rowNum} className="flex gap-1 md:gap-3 justify-center">
                        {/* Row Label */}
                        <div className="w-6 text-gray-600 text-xs flex items-center justify-center font-bold mr-2">{String.fromCharCode(64 + parseInt(rowNum))}</div>

                        {rows[rowNum].map(seat => {
                            let baseClass = "w-8 h-8 md:w-10 md:h-10 rounded-t-lg rounded-b-md flex items-center justify-center text-[10px] md:text-xs font-bold transition-all duration-200 shadow-md border-b-2";
                            let statusClass = "bg-gray-700 hover:bg-gray-600 text-gray-300 border-gray-900 cursor-pointer hover:-translate-y-1 hover:shadow-lg"; // Available

                            if (seat.status === 'booked') {
                                baseClass = "w-8 h-8 md:w-10 md:h-10 rounded-md flex items-center justify-center text-[10px] md:text-xs opacity-40 shadow-none";
                                statusClass = "bg-red-900/20 text-red-700 cursor-not-allowed border-none"; // Booked Look
                            } else if (seat.label === selectedSeatLabel) {
                                statusClass = "bg-yellow-500 text-black border-yellow-700 shadow-[0_0_15px_#eab308] scale-110 z-10";
                            }

                            return (
                                <button
                                    key={seat.label}
                                    className={`${baseClass} ${statusClass}`}
                                    onClick={() => seat.status !== 'booked' && onSeatSelect(seat)}
                                    disabled={seat.status === 'booked'}
                                    title={seat.status === 'booked' ? `Reserved by: ${seat.bookedBy || 'Unknown'}` : `Seat ${seat.label}`}
                                >
                                    {seat.status === 'booked' ? 'X' : seat.number}
                                </button>
                            );
                        })}
                    </div>
                ))}
            </div>

            {/* Legend */}
            <div className="flex flex-wrap justify-center gap-4 md:gap-8 mt-12 text-sm text-gray-400">
                <div className="flex items-center gap-3"><div className="w-6 h-6 rounded bg-gray-700 border-b-2 border-gray-900"></div> Available</div>
                <div className="flex items-center gap-3"><div className="w-6 h-6 rounded bg-yellow-500 border-b-2 border-yellow-700 shadow-[0_0_10px_#eab308]"></div> Selected</div>
                <div className="flex items-center gap-3"><div className="w-6 h-6 rounded bg-red-900/20 text-red-700 flex items-center justify-center font-bold text-xs">X</div> Booked</div>
            </div>
        </div>
    );
};

export default SeatGrid;
