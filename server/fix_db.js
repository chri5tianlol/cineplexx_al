const sequelize = require('./config/database');
const { QueryTypes } = require('sequelize');

async function checkAndFixDatabase() {
    try {
        await sequelize.authenticate();
        console.log('Connected to DB.');

        // Check columns in Movies table
        const columns = await sequelize.query("PRAGMA table_info(Movies);", { type: QueryTypes.SELECT });
        const columnNames = columns.map(c => c.name);
        console.log('Current properties:', columnNames);

        const hasCategory = columnNames.includes('category');

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
