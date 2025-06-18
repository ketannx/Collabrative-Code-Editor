const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://rudreshsankpal21:unhUgmgpryv0XO24@code-editor.fxd3wt8.mongodb.net/?retryWrites=true&w=majority&appName=Code-Editor');
        console.log('MongoDB connected');
    } catch (error) {
        console.error('MongoDB connection error:', error);
    }
};

module.exports = connectDB;