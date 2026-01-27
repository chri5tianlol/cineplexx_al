const { User, Ticket, Showtime, Movie, Hall, Event, sequelize } = require('../models');
const { Op } = require('sequelize');

// --- BOOKINGS ---

exports.getAllBookings = async (req, res) => {
    try {
        const { page = 1, limit = 10, search = '' } = req.query;
        const offset = (page - 1) * limit;

        const whereClause = {};
        if (search) {
            whereClause[Op.or] = [
                { id: { [Op.like]: `%${search}%` } },
                { customerName: { [Op.like]: `%${search}%` } }
            ];
        }

        const { count, rows } = await Ticket.findAndCountAll({
            where: whereClause,
            include: [
                {
                    model: Showtime,
                    include: [Movie, { model: Hall, include: ['Cinema'] }]
                }
            ],
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [['createdAt', 'DESC']]
        });

        res.json({
            total: count,
            totalPages: Math.ceil(count / limit),
            currentPage: parseInt(page),
            bookings: rows
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// --- STAFF MANAGEMENT (Super Admin Only) ---

exports.getAllStaff = async (req, res) => {
    try {
        const staff = await User.findAll({
            where: { role: 'staff' },
            attributes: { exclude: ['password'] }
        });
        res.json(staff);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createStaff = async (req, res) => {
    try {
        const { name, email } = req.body;

        if (!name || !email) {
            return res.status(400).json({ error: 'Name and Email are required' });
        }

        // Generate random password
        const password = Math.random().toString(36).slice(-8);

        const user = await User.create({
            name,
            email,
            password, // Hook will hash this
            role: 'staff'
        });

        // Return the RAW password one time only
        res.status(201).json({
            message: 'Staff created successfully',
            staff: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            },
            generatedPassword: password
        });
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ error: 'Email already exists' });
        }
        res.status(500).json({ error: error.message });
    }
};

exports.deleteStaff = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByPk(id);

        if (!user) return res.status(404).json({ error: 'User not found' });
        if (user.role !== 'staff') return res.status(403).json({ error: 'Can only delete staff members' });

        await user.destroy();
        res.json({ message: 'Staff member removed' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
