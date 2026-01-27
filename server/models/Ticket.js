const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Ticket = sequelize.define('Ticket', {
    seatLabel: {
        type: DataTypes.STRING,
        allowNull: false
    },
    customerName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('booked', 'sold'),
        defaultValue: 'booked'
    },
    userId: { // Link to User
        type: DataTypes.INTEGER,
        allowNull: true // Allow null for guest checkouts if we supported them, but for now we enforce login
    },
    price: { // Store the price paid at booking time
        type: DataTypes.INTEGER,
        allowNull: false
    }
});

module.exports = Ticket;
