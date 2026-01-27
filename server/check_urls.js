const { Sequelize, QueryTypes } = require('sequelize');
const sequelize = require('./config/database');

async function checkUrls() {
    try {
        await sequelize.authenticate();
        console.log('Connected.');
        const movies = await sequelize.query("SELECT id, title, posterUrl FROM Movies LIMIT 5", { type: QueryTypes.SELECT });
        console.log('Movie URLs:', JSON.stringify(movies, null, 2));
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await sequelize.close();
    }
}

checkUrls();
