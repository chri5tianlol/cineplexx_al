const { sequelize, Showtime, Hall, Ticket } = require('./server/models');

const test = async () => {
    try {
        await sequelize.authenticate();
        console.log('DB Connection OK');

        const showtime = await Showtime.findOne();
        if (!showtime) {
            console.log('No showtimes found');
            return;
        }
        console.log('Found Showtime:', showtime.id);

        const showtimeWithHall = await Showtime.findByPk(showtime.id, {
            include: [Hall]
        });

        if (!showtimeWithHall.Hall) {
            console.error('ERROR: Hall is undefined for showtime', showtime.id);
        } else {
            console.log('Hall Found:', showtimeWithHall.Hall.name);
            console.log('Rows:', showtimeWithHall.Hall.totalRows);
            console.log('SeatsPerRow:', showtimeWithHall.Hall.seatsPerRow);
        }

    } catch (e) {
        console.error(e);
    } finally {
        await sequelize.close();
    }
};

test();
