const sequelize = require('./server/config/database');
const { QueryTypes } = require('sequelize');

async function checkAndFixDatabase() {
    try {
        await sequelize.authenticate();
        console.log('Connected to DB.');

        // Check columns in Movies table
        const columns = await sequelize.query("PRAGMA table_info(Movies);", { type: QueryTypes.SELECT });
        console.log('Current properties:', columns.map(c => c.name));

        const hasCategory = columns.some(c => c.name === 'category');

        if (!hasCategory) {
            console.log('Category column missing. Adding it...');
            await sequelize.query("ALTER TABLE Movies ADD COLUMN category TEXT DEFAULT 'now_showing';");
            console.log('Column added successfully.');
        } else {
            console.log('Category column already exists.');
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await sequelize.close();
    }
}

checkAndFixDatabase();
