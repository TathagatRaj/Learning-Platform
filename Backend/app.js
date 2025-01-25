// Load environment variables from the .env file
require('dotenv').config();

// Importing required modules
const express = require('express');
const path = require('path');
const { connectToMongoDB } = require('./connect');  // MongoDB connection function
const userRoute = require('./Route/userRoute');  // User route for the app

const app = express();
const PORT = process.env.PORT || 5000;  // Use port from .env or fallback to 5000

// Connect to MongoDB using the URI from the .env file
connectToMongoDB(process.env.MONGODB_URI);

// Set up the view engine to use EJS for rendering HTML templates
app.set('view engine', 'ejs');
app.set('views', path.resolve('../Frontend/views'));  // Defie views dir path

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, '../Frontend')));

// Use the user routes for '/user' endpoint
app.use('/user', userRoute);

// Define the root route to render welcome page
app.get('/', (req, res) => {
    res.render('welcome');
});

// Define the '/signup' route to render signup page
app.get('/signup', (req, res) => {
    res.render('signup');
});

// Define the '/login' route to render login page
app.get('/login', (req, res) => {
    res.render('login');
})

// Define the '/reset' route to render reset password page
app.get('/reset', (req, res) => {
    res.render('reset');
})

// Start the server and listen on the defined port
app.listen(PORT, () => console.log(`Server started on http://localhost:${PORT}`));