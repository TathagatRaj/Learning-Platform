const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {type: String, required: true},
    dob: {type: Date, required: true},
    gender: {type: String, enum: ['Male', 'Female'], required: true},
    email: { type: String, required: true, unique: true},
    password: { type: String, required: true },
});

const User =mongoose.model('user', userSchema);

module.exports = User;