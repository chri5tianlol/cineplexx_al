const { Cinema, Hall, Showtime, Movie, Event } = require('../models');
const { Op } = require('sequelize');

exports.getAllCinemas = async (req, res) => {
    try {
        const cinemas = await Cinema.findAll({
            include: [{ model: Hall }]
        });
        res.json(cinemas);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getCinemaDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const cinema = await Cinema.findByPk(id, {
            include: [{
                model: Hall,
                include: [{
                    model: Showtime,
                    required: false, // Include halls even if no showtimes
                    where: {
                        startTime: { [Op.gte]: new Date() } // Only future showtimes by default? Or all? User said "view dates", implies calendar. Let's fetch all for now or filter by date range if needed. Let's fetch reasonably recent/future.
                        // For simplicity in this iteration, let's fetch all upcoming.
                    },
                    include: [Movie, Event]
                }]
            }]
        });

        if (!cinema) return res.status(404).json({ error: 'Cinema not found' });
        res.json(cinema);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
