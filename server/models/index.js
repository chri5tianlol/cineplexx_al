const sequelize = require('../config/database');
const Movie = require('./Movie');
const Hall = require('./Hall');
const Showtime = require('./Showtime');
const Ticket = require('./Ticket');
const Event = require('./Event');
const Cinema = require('./Cinema');
const User = require('./User');

// Associations

// Movie <-> Showtime
Movie.hasMany(Showtime, { foreignKey: 'movieId', as: 'showtimes' });
Showtime.belongsTo(Movie, { foreignKey: 'movieId' });

// Hall <-> Showtime
Hall.hasMany(Showtime, { foreignKey: 'hallId' });
Showtime.belongsTo(Hall, { foreignKey: 'hallId' });

// Cinema <-> Hall
Cinema.hasMany(Hall, { foreignKey: 'cinemaId' });
Hall.belongsTo(Cinema, { foreignKey: 'cinemaId' });

// Showtime <-> Ticket
Showtime.hasMany(Ticket, { foreignKey: 'showtimeId' });
Ticket.belongsTo(Showtime, { foreignKey: 'showtimeId' });

// Event <-> Movie
Event.belongsTo(Movie, { foreignKey: 'movieId' });
Movie.hasMany(Event, { foreignKey: 'movieId' });

// Event <-> Showtime
Event.hasMany(Showtime, { foreignKey: 'eventId', as: 'showtimes' });
Showtime.belongsTo(Event, { foreignKey: 'eventId' });

// User <-> Ticket
User.hasMany(Ticket, { foreignKey: 'userId' });
Ticket.belongsTo(User, { foreignKey: 'userId' });

module.exports = {
    sequelize,
    Movie,
    Hall,
    Showtime,
    Ticket,
    Event,
    Cinema,
    User
};
