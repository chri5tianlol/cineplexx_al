const { sequelize, Movie, Hall, Showtime, Event, Cinema, User } = require('./models');

const seed = async () => {
    try {
        await sequelize.sync({ force: true });
        console.log('Database synced (force: true)');

        const movies = await Movie.bulkCreate([
            {
                title: 'Inception',
                description: 'A thief who steals corporate secrets through the use of dream-sharing technology.',
                duration: 148,
                posterUrl: 'https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg',
                genre: 'Sci-Fi'
            },
            {
                title: 'The Dark Knight',
                description: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham.',
                duration: 152,
                posterUrl: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
                genre: 'Action'
            },
            {
                title: 'Interstellar',
                description: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival.',
                duration: 169,
                posterUrl: 'https://image.tmdb.org/t/p/w500/gEU2QniL6E8ahDaX0mDb958PEJs.jpg',
                genre: 'Sci-Fi'
            }
        ]);

        // Seed Users
        await User.create({
            name: 'Admin Staff',
            email: 'admin@cineplexx.com',
            password: 'adminpassword123', // Will be hashed by hook
            role: 'admin'
        });

        await User.create({
            name: 'John Doe',
            email: 'john@example.com',
            password: 'password123',
            role: 'user'
        });

        const cinemas = await Cinema.bulkCreate([
            { name: 'Cineplexx TEG', location: 'Tirana, TEG Mall' },
            { name: 'Cineplexx QTU', location: 'Tirana, QTU Mall' }
        ]);

        const halls = await Hall.bulkCreate([
            { name: 'Salla 1', capacity: 64, totalRows: 8, seatsPerRow: 8, cinemaId: cinemas[0].id }, // TEG Hall
            { name: 'Salla 2', capacity: 50, totalRows: 5, seatsPerRow: 10, cinemaId: cinemas[0].id }, // TEG Hall
            { name: 'Salla 1', capacity: 70, totalRows: 7, seatsPerRow: 10, cinemaId: cinemas[1].id }, // QTU Hall
            { name: 'Salla 2', capacity: 40, totalRows: 5, seatsPerRow: 8, cinemaId: cinemas[1].id },  // QTU Hall
            { name: 'VIP Lounge', capacity: 30, totalRows: 5, seatsPerRow: 6, cinemaId: cinemas[0].id } // TEG Event Hall
        ]);

        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(18, 0, 0, 0);

        const dayAfter = new Date(tomorrow);
        dayAfter.setDate(dayAfter.getDate() + 1);
        dayAfter.setHours(20, 0, 0, 0);

        const nextWeek = new Date();
        nextWeek.setDate(nextWeek.getDate() + 7);
        nextWeek.setHours(20, 0, 0, 0);

        const marvelDate = new Date(nextWeek.getTime() + 86400000 * 2);
        marvelDate.setHours(19, 30, 0, 0);

        const horrorDate = new Date(nextWeek.getTime() + 86400000 * 5);
        horrorDate.setHours(23, 0, 0, 0);

        await Showtime.bulkCreate([
            { movieId: movies[0].id, hallId: halls[0].id, startTime: tomorrow, price: 12 }, // Inception TEG
            { movieId: movies[0].id, hallId: halls[2].id, startTime: dayAfter, price: 10 }, // Inception QTU
            { movieId: movies[1].id, hallId: halls[1].id, startTime: dayAfter, price: 15 }, // Dark Knight TEG
            { movieId: movies[2].id, hallId: halls[3].id, startTime: tomorrow, price: 12 },  // Interstellar QTU

            // Event Specific Showtimes (Flagged as events to hide from standard movie flow)
            { movieId: movies[0].id, hallId: halls[4].id, startTime: nextWeek, price: 20, isEvent: true }, // Ladies Night (Inception) in VIP Lounge
            { movieId: movies[1].id, hallId: halls[2].id, startTime: marvelDate, price: 25, isEvent: true }, // Marvel QTU
            { movieId: movies[2].id, hallId: halls[1].id, startTime: horrorDate, price: 18, isEvent: true } // Horror Night TEG
        ]);

        // Events with matching dates
        await Event.bulkCreate([
            {
                title: 'Ladies Night: Barbie',
                description: 'Join us for a special screening of Barbie with exclusive cocktails and gifts!',
                date: nextWeek,
                imageUrl: 'https://image.tmdb.org/t/p/w500/iuFNMS8U5cb6xfzi51Dbkovj7vM.jpg',
                location: 'Cineplexx TEG (VIP Lounge)',
                movieId: movies[0].id // Linked to Inception for demo
            },
            {
                title: 'Marvel Marathon',
                description: 'Experience the Avengers saga back-to-back on the big screen.',
                date: marvelDate,
                imageUrl: 'https://image.tmdb.org/t/p/w500/RYMX2wcKCBAr24UyPD7xwmjaTn.jpg',
                location: 'Cineplexx QTU',
                movieId: movies[1].id // Linked to Dark Knight for demo
            },
            {
                title: 'Horror Night Premiere',
                description: 'Be the first to see the scariest movie of the year. Dare to join?',
                date: horrorDate,
                imageUrl: 'https://image.tmdb.org/t/p/w500/5aHVvj85lV6ha80qg8h5uZ3k1iK.jpg',
                location: 'Cineplexx TEG',
                movieId: movies[2].id // Linked to Interstellar for demo
            }
        ]);

        console.log('Seeding completed successfully.');
        process.exit(0);
    } catch (error) {
        console.error('Seeding failed:', error);
        process.exit(1);
    }
};

seed();
