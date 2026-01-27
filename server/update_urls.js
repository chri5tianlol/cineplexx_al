const { Sequelize, QueryTypes } = require('sequelize');
const sequelize = require('./config/database');

const OLD_URL = 'http://localhost:5000';
const NEW_URL = 'https://cineplexx-al.onrender.com';

async function updateUrls() {
    try {
        await sequelize.authenticate();
        console.log('Connected to DB.');

        // Update Movies
        const [movieResults] = await sequelize.query(
            `UPDATE Movies SET posterUrl = REPLACE(posterUrl, '${OLD_URL}', '${NEW_URL}') WHERE posterUrl LIKE '%${OLD_URL}%'`
        );
        console.log('Movies updated:', movieResults);

        // Update Events
        const [eventResults] = await sequelize.query(
            `UPDATE Events SET imageUrl = REPLACE(imageUrl, '${OLD_URL}', '${NEW_URL}') WHERE imageUrl LIKE '%${OLD_URL}%'`
        );
        console.log('Events updated:', eventResults);

        console.log('Done! All localhost URLs have been replaced with the Render URL.');

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await sequelize.close();
    }
}

updateUrls();
