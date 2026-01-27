const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Showtime = sequelize.define('Showtime', {
    startTime: {
        type: DataTypes.DATE,
        allowNull: false
    },
    price: {
        type: DataTypes.INTEGER, // Storing as integer (e.g., cents) or float
        allowNull: false
    },
    movieId: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    eventId: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    isEvent: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    hooks: {
        beforeCreate: async (showtime) => {
            const { Op } = require('sequelize');

            // Define buffer time (e.g., 3 hours per movie to be safe)
            const movieDuration = 3 * 60 * 60 * 1000;
            const newStart = new Date(showtime.startTime).getTime();
            const newEnd = newStart + movieDuration;

            // Using sequelize.models to avoid circular dependency in access
            const existingShowtimes = await showtime.sequelize.models.Showtime.findAll({
                where: {
                    hallId: showtime.hallId,
                    startTime: {
                        [Op.between]: [
                            new Date(newStart - movieDuration), // Search existing starts that could overlap
                            new Date(newEnd)
                        ]
                    }
                }
            });

            if (existingShowtimes.length > 0) {
                // Double check exact overlaps
                const hasOverlap = existingShowtimes.some(existing => {
                    const existingStart = new Date(existing.startTime).getTime();
                    const existingEnd = existingStart + movieDuration;
                    return (newStart < existingEnd && newEnd > existingStart);
                });

                if (hasOverlap) {
                    throw new Error('Scheduling Conflict: Hall is already booked for this time slot.');
                }
            }
        }
    }
});

module.exports = Showtime;
