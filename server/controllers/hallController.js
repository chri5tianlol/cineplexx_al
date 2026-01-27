const { Hall, Cinema } = require('../models');

exports.getAllHalls = async (req, res) => {
    try {
        const halls = await Hall.findAll({
            include: [Cinema]
        });
        res.json(halls);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createHall = async (req, res) => {
    try {
        const { name, totalRows, seatsPerRow, cinemaId } = req.body;

        // Simple verification
        if (!name || !totalRows || !seatsPerRow || !cinemaId) {
            return res.status(400).json({ error: 'All fields required' });
        }

        // Check for duplicates in same cinema
        const existing = await Hall.findOne({ where: { name, cinemaId } });
        if (existing) {
            return res.status(400).json({ error: 'A hall with this name already exists in this cinema' });
        }

        const capacity = totalRows * seatsPerRow;

        const hall = await Hall.create({
            name,
            totalRows,
            seatsPerRow,
            capacity,
            cinemaId
        });

        res.status(201).json(hall);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteHall = async (req, res) => {
    try {
        const { id } = req.params;
        const hall = await Hall.findByPk(id);
        if (!hall) return res.status(404).json({ error: 'Hall not found' });
        await hall.destroy();
        res.json({ message: 'Hall deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
