const { Sequelize, QueryTypes } = require('sequelize');
const sequelize = require('./config/database');

async function checkEvents() {
    try {
        await sequelize.authenticate();
        console.log('Connected.');
        const events = await sequelize.query("SELECT * FROM Events", { type: QueryTypes.SELECT });
        console.log('Events Count:', events.length);
        console.log('Events Data:', JSON.stringify(events, null, 2));
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await sequelize.close();
    }
}

checkEvents();
