const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const connectDB = require('./db/db');
const authRoutes = require('./routes/auth.routes');
const projectRoutes = require('./routes/project.routes');

connectDB();

const app = express();

// Middleware
app.use(cors({
    origin: 'http://localhost:5173',
    origin: 'https://48de-103-70-43-160.ngrok-free.app',
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

app.use('/auth', authRoutes)
app.use('/project', projectRoutes)


// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});