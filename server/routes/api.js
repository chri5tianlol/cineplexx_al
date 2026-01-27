const express = require('express');
const router = express.Router();
const movieController = require('../controllers/movieController');
const showtimeController = require('../controllers/showtimeController');
const bookingController = require('../controllers/bookingController');
const eventController = require('../controllers/eventController');
const authController = require('../controllers/authController');

const userController = require('../controllers/userController');

const adminController = require('../controllers/adminController');
const uploadController = require('../controllers/uploadController');

// Uploads
router.post('/upload', uploadController.uploadImage);

// Auth Routes
router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);
router.put('/user/profile', userController.updateProfile);

// -- ADMIN ROUTES --
// Protect all these routes
router.use('/admin', authController.protect, authController.protectAdmin);

router.get('/admin/bookings', adminController.getAllBookings);

// Staff Management (Super Admin Only)
router.get('/admin/staff', authController.protectSuperAdmin, adminController.getAllStaff);
router.post('/admin/staff', authController.protectSuperAdmin, adminController.createStaff);
router.delete('/admin/staff/:id', authController.protectSuperAdmin, adminController.deleteStaff);

// Movies
router.get('/movies', movieController.getAllMovies);
router.get('/movies/:id', movieController.getMovieById);
router.post('/movies', authController.protect, authController.protectAdmin, movieController.createMovie); // Protect Create
router.put('/movies/:id', authController.protect, authController.protectAdmin, movieController.updateMovie); // Protect Update
router.delete('/movies/:id', authController.protect, authController.protectAdmin, movieController.deleteMovie); // Protect Delete

// Showtimes
router.get('/showtimes', showtimeController.getAllShowtimes); // New Route
router.get('/showtimes/:movieId', showtimeController.getShowtimesByMovie);
router.get('/showtimes/event/:eventId', showtimeController.getShowtimesByEvent);
router.post('/showtimes', authController.protect, authController.protectAdmin, showtimeController.createShowtime); // Protect
router.delete('/showtimes/:id', authController.protect, authController.protectAdmin, showtimeController.deleteShowtime); // Protect
router.get('/seats/:showtimeId', showtimeController.getSeats);

// Bookings
router.post('/bookings', bookingController.createBooking);
router.get('/bookings/:id', bookingController.getBookingById);
router.get('/user/:userId/bookings', bookingController.getUserBookings);
router.delete('/bookings/:id', bookingController.cancelBooking);

// Events
router.get('/events', eventController.getAllEvents);
router.get('/events/:id', eventController.getEventById);
router.post('/events', authController.protect, authController.protectAdmin, eventController.createEvent);
router.put('/events/:id', authController.protect, authController.protectAdmin, eventController.updateEvent);
router.delete('/events/:id', authController.protect, authController.protectAdmin, eventController.deleteEvent);

// Halls
const hallController = require('../controllers/hallController');
router.get('/halls', hallController.getAllHalls);
router.post('/halls', authController.protect, authController.protectAdmin, hallController.createHall);
router.delete('/halls/:id', authController.protect, authController.protectAdmin, hallController.deleteHall);

// Cinemas (New)
const cinemaController = require('../controllers/cinemaController');
router.get('/cinemas', cinemaController.getAllCinemas);
router.get('/cinemas/:id', cinemaController.getCinemaDetails);

module.exports = router;
