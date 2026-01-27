const sequelize = require('./config/database');
const { QueryTypes } = require('sequelize');

async function inspectDB() {
    try {
        await sequelize.authenticate();
        const movies = await sequelize.query("SELECT id, title, category FROM Movies", { type: QueryTypes.SELECT });
        console.log('Movies in DB:');
        movies.forEach(m => {
            console.log(`ID: ${m.id}, Title: ${m.title}, Category (Type: ${typeof m.category}):`, m.category);
        });
    } catch (error) {
        console.error(error);
    } finally {
        await sequelize.close();
    }
}

inspectDB();
