const { sequelize, Movie, Hall, Showtime } = require('./models');

const seedShowtimes = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected.');

        // 1. Clear broken showtimes
        await Showtime.destroy({ where: {}, truncate: true });
        console.log('Cleared old showtimes.');

        // 2. Fetch resources
        const movies = await Movie.findAll();
        const halls = await Hall.findAll();

        if (movies.length === 0 || halls.length === 0) {
            console.log('No movies or halls found to seed.');
            process.exit(1);
        }

        const showtimes = [];
        const times = ['10:00:00', '13:00:00', '16:00:00', '19:00:00', '22:00:00'];

        // Date: Today and Tomorrow
        const dates = [new Date(), new Date(new Date().getTime() + 24 * 60 * 60 * 1000)];

        // 3. Create Showtimes
        movies.forEach(movie => {
            // Assign each movie to a random hall or specific logic
            halls.forEach(hall => {
                // Add a few slots per hall for this movie (simplified: every movie in every hall for demo)
                // Or better: Distribute them.
                // Let's just add 2 slots per movie per hall to ensure data visibility.

                dates.forEach(date => {
                    // Pick 2 random times
                    const selectedTimes = times.slice(0, 2);

                    selectedTimes.forEach(time => {
                        const [hours, mins, secs] = time.split(':');
                        const startTime = new Date(date);
                        startTime.setHours(hours, mins, secs);

                        showtimes.push({
                            movieId: movie.id,
                            hallId: hall.id,
                            startTime: startTime,
                            price: 10 + Math.floor(Math.random() * 5), // Random price 10-15
                            isEvent: false
                        });
                    });
                });
            });
        });

        await Showtime.bulkCreate(showtimes);
        console.log(`Seeded ${showtimes.length} new showtimes.`);

    } catch (error) {
        console.error('Seeding failed:', error);
    } finally {
        process.exit();
    }
};

seedShowtimes();
