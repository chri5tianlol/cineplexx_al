const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Cinema = sequelize.define('Cinema', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    location: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

module.exports = Cinema;
