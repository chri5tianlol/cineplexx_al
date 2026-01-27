const { Sequelize, QueryTypes } = require('sequelize');
const path = require('path');
// Adjust path to point to server directory where models/config are
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: path.join(__dirname, 'server', 'database.sqlite')
});

async function checkUrls() {
    try {
        await sequelize.authenticate();
        const movies = await sequelize.query("SELECT id, title, posterUrl FROM Movies LIMIT 5", { type: QueryTypes.SELECT });
        console.log('Movie URLs:', movies);
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await sequelize.close();
    }
}

checkUrls();
