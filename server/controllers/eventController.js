const { Event, Showtime, Hall, Cinema } = require('../models');

exports.getAllEvents = async (req, res) => {
    try {
        const events = await Event.findAll({
            include: [{
                model: Showtime,
                as: 'showtimes',
                include: [{
                    model: Hall,
                    include: [Cinema]
                }]
            }],
            order: [['date', 'ASC']]
        });
        res.json(events);
    } catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.getEventById = async (req, res) => {
    try {
        const event = await Event.findByPk(req.params.id, {
            include: [{
                model: Showtime,
                as: 'showtimes',
                include: [{
                    model: Hall,
                    include: [Cinema]
                }]
            }]
        });
        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }
        res.json(event);
    } catch (error) {
        console.error('Error fetching event:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.createEvent = async (req, res) => {
    try {
        const event = await Event.create(req.body);
        res.status(201).json(event);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.updateEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const [updated] = await Event.update(req.body, { where: { id } });
        if (updated) {
            const updatedEvent = await Event.findByPk(id);
            return res.status(200).json(updatedEvent);
        }
        throw new Error('Event not found');
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const event = await Event.findByPk(id);
        if (!event) return res.status(404).json({ error: 'Event not found' });

        await event.destroy();
        res.json({ message: 'Event deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
