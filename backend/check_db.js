const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const checkUser = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected');

        const user = await User.findOne({ email: 'rahul@example.com' });
        if (user) {
            console.log('User found:', user.email);
            console.log('Role:', user.role);
        } else {
            console.log('User NOT found. Database might be empty.');
        }

        process.exit();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

checkUser();
