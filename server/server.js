const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 5000;

const path = require('path');

app.use(cors({
    origin: '*', // Allow all origins (simplest for now)
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads'))); // Serve uploads

app.use('/api', apiRoutes);

const startServer = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected.');
        await sequelize.sync({ force: false });
        console.log('Database synced.');

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
};

startServer();
