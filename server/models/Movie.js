const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Movie = sequelize.define('Movie', {
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
    },
    duration: {
        type: DataTypes.INTEGER, // in minutes
        allowNull: false
    },
    posterUrl: {
        type: DataTypes.STRING
    },
    genre: {
        type: DataTypes.STRING
    },
    category: {
        type: DataTypes.JSON,
        defaultValue: ['now_showing'],
        get() {
            const rawValue = this.getDataValue('category');
            if (typeof rawValue === 'string') {
                try {
                    return JSON.parse(rawValue);
                } catch (e) {
                    return [rawValue]; // Fallback for legacy string data
                }
            }
            return rawValue || [];
        },
        set(value) {
            // Ensure we never save [object Object]
            if (typeof value === 'object' && value !== null) {
                this.setDataValue('category', JSON.stringify(value));
            } else {
                this.setDataValue('category', value);
            }
        }
    }
});

module.exports = Movie;
