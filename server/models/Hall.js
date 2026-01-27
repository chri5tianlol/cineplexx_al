const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Hall = sequelize.define('Hall', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    capacity: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    totalRows: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    seatsPerRow: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    cinemaId: {
        type: DataTypes.INTEGER,
        allowNull: true, // Allow null initially for migration safety, but logic demands it
        references: {
            model: 'Cinemas',
            key: 'id'
        }
    }
});

module.exports = Hall;
