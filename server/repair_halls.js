const { sequelize, Hall, Cinema } = require('./models');

const repairHalls = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected.');

        const cinemas = await Cinema.findAll();
        const halls = await Hall.findAll();

        if (cinemas.length < 2) {
            console.log('Not enough cinemas to distribute halls.');
            // Create cinemas if missing?
            if (cinemas.length === 0) {
                await Cinema.bulkCreate([
                    { name: 'Cineplexx TEG', location: 'Tirana East Gate' },
                    { name: 'Cineplexx QTU', location: 'QTU Center' }
                ]);
                console.log('Created defaults cinemas.');
            }
            return; // Rerun to fetch
        }

        const teg = cinemas.find(c => c.name.includes('TEG')) || cinemas[0];
        const qtu = cinemas.find(c => c.name.includes('QTU')) || cinemas[1];

        console.log(`Assigning halls to ${teg.name} and ${qtu.name}...`);

        for (let i = 0; i < halls.length; i++) {
            const hall = halls[i];
            // Simple logic: First 3 to TEG, rest to QTU
            const targetCinema = i < 3 ? teg : qtu;

            hall.cinemaId = targetCinema.id;
            await hall.save();
            console.log(`Assigned ${hall.name} to ${targetCinema.name}`);
        }

        console.log('Halls repaired.');

    } catch (error) {
        console.error('Repair failed:', error);
    } finally {
        process.exit();
    }
};

repairHalls();
