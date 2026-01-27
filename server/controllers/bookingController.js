const { Ticket, Showtime, Movie, Hall, Event, sequelize } = require('../models');

exports.createBooking = async (req, res) => {
    const { showtimeId, seatLabel, customerName, userId, price } = req.body;

    // Transaction to ensure atomicity
    const t = await sequelize.transaction();

    try {
        // Check occupancy
        const existingTicket = await Ticket.findOne({
            where: { showtimeId, seatLabel },
            lock: true,
            transaction: t
        });

        if (existingTicket) {
            await t.rollback();
            return res.status(409).json({ error: 'Seat already booked' });
        }

        const ticket = await Ticket.create({
            showtimeId,
            seatLabel,
            customerName,
            userId: userId || null,
            price: price || 0,
            status: 'booked'
        }, { transaction: t });

        await t.commit();
        res.status(201).json(ticket);
    } catch (error) {
        await t.rollback();
        res.status(500).json({ error: error.message });
    }
};

exports.getUserBookings = async (req, res) => {
    try {
        const { userId } = req.params;
        const tickets = await Ticket.findAll({
            where: { userId },
            include: [
                {
                    model: Showtime,
                    include: [
                        Movie,
                        Event, // Direct include
                        {
                            model: Hall,
                            include: ['Cinema']
                        }
                    ]
                }
            ],
            order: [['createdAt', 'DESC']]
        });

        // Simplified response
        res.json(tickets);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getBookingById = async (req, res) => {
    try {
        const { id } = req.params;
        const ticket = await Ticket.findByPk(id, {
            include: [
                {
                    model: Showtime,
                    include: [
                        Movie,
                        Event, // Direct include
                        {
                            model: Hall,
                            include: ['Cinema']
                        }
                    ]
                }
            ]
        });

        if (!ticket) return res.status(404).json({ error: 'Ticket not found' });

        res.json(ticket);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.cancelBooking = async (req, res) => {
    try {
        const { id } = req.params;
        const ticket = await Ticket.findByPk(id);

        if (!ticket) {
            return res.status(404).json({ error: 'Ticket not found' });
        }

        await ticket.destroy();
        res.json({ message: 'Reservation cancelled' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
