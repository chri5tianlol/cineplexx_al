const { Showtime, Hall, Ticket, Movie, Event } = require('../models');

exports.getShowtimesByMovie = async (req, res) => {
    try {
        const { movieId } = req.params;
        const showtimes = await Showtime.findAll({
            where: { movieId },
            include: [{
                model: Hall,
                include: ['Cinema'] // Include Cinema via Hall
            }],
            order: [['startTime', 'ASC']]
        });
        res.json(showtimes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getAllShowtimes = async (req, res) => {
    try {
        const showtimes = await Showtime.findAll({
            include: [
                {
                    model: Hall,
                    include: ['Cinema']
                },
                { model: Movie }, // Include Info for UI
                { model: Event } // Include Info for UI
            ],
            order: [['startTime', 'ASC']]
        });
        res.json(showtimes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getShowtimesByEvent = async (req, res) => {
    try {
        const { eventId } = req.params;
        const showtimes = await Showtime.findAll({
            where: { eventId },
            include: [{
                model: Hall,
                include: ['Cinema']
            }],
            order: [['startTime', 'ASC']]
        });
        res.json(showtimes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createShowtime = async (req, res) => {
    try {
        const { movieId, eventId, hallId, startTime, price } = req.body;

        if (!movieId && !eventId) {
            return res.status(400).json({ error: 'Must provide either movieId or eventId' });
        }

        const isEvent = !!eventId;
        // Basic validation happens in Model Hook (overlap check)
        const showtime = await Showtime.create({
            movieId: movieId || null,
            eventId: eventId || null,
            hallId,
            startTime,
            price,
            isEvent
        });
        res.status(201).json(showtime);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.deleteShowtime = async (req, res) => {
    try {
        const { id } = req.params;
        const showtime = await Showtime.findByPk(id);
        if (!showtime) return res.status(404).json({ error: 'Showtime not found' });

        await showtime.destroy();
        res.json({ message: 'Showtime removed' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getSeats = async (req, res) => {
    try {
        const { showtimeId } = req.params;
        const showtime = await Showtime.findByPk(showtimeId, {
            include: [Hall]
        });

        if (!showtime) return res.status(404).json({ error: 'Showtime not found' });

        const tickets = await Ticket.findAll({
            where: { showtimeId }
        });

        const bookedSeats = new Map();
        tickets.forEach(t => {
            bookedSeats.set(t.seatLabel, t.customerName);
        });

        const hall = showtime.Hall;
        const seats = [];

        // Generate seat grid
        for (let row = 1; row <= hall.totalRows; row++) {
            const rowLabel = String.fromCharCode(64 + row); // A, B, C...
            for (let num = 1; num <= hall.seatsPerRow; num++) {
                const label = `${rowLabel}${num}`;
                const isBooked = bookedSeats.has(label);
                seats.push({
                    label,
                    status: isBooked ? 'booked' : 'available',
                    bookedBy: isBooked ? bookedSeats.get(label) : null,
                    row,
                    number: num
                });
            }
        }

        res.json({
            hall: hall.name,
            seats
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
