const sequelize = require('./config/database');
const { QueryTypes } = require('sequelize');

async function fixBadData() {
    try {
        await sequelize.authenticate();
        console.log('Fixing bad data...');

        // 1. Reset [object Object] to ['now_showing']
        await sequelize.query("UPDATE Movies SET category = '[\"now_showing\"]' WHERE category = '[object Object]'", { type: QueryTypes.UPDATE });

        // 2. Fix legacy strings (e.g., 'now_showing') to JSON arrays (e.g., '["now_showing"]')
        // SQLite doesn't have great JSON functions in all versions, so we might need to fetch and update via Sequelize if pure SQL is hard.
        // But for now, let's just target the specific bad string we saw.

        console.log('Fixed [object Object] entries.');

    } catch (error) {
        console.error(error);
    } finally {
        await sequelize.close();
    }
}

fixBadData();
