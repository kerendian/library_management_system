import express from 'express';
import bodyParser from 'body-parser';
import connectDB from './src/config/db.js';
import bookRoutes from './src/api/routes/bookRoutes.js';
import morgan from 'morgan';
import errorHandler from './src/api/middlewares/errorHandler.js';
import passport from './src/config/passport.js';
import logger from './src/utils/logger.js';

import dotenv from 'dotenv';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to Database
connectDB();

// Middleware
app.use(morgan('tiny'));
app.use(passport.initialize());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// Logging middleware for all requests to '/api'
app.use('/api', (req, res, next) => {
    logger.info(`API accessed by ${req.ip}: ${req.method} ${req.originalUrl}`);
    next();  // Pass control to the next middleware or route handler
});

// Routes
app.use('/api', bookRoutes);

// Error handling middleware
app.use(errorHandler);

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

export default app;
