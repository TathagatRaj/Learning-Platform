const bcrypt = require('bcrypt');
const User = require('../models/userModel')

async function handleSignUp(req, res) {
    const { name, dob, gender, email, password } = req.body;

    if (!name || !dob || !gender || !email || !password) {
        return res.status(400).json({ message: 'Name, date of birth, gender, email and password are required.' });
    }

    try {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const newUser = new User({ name, dob, gender, email, password: hashedPassword });
        await newUser.save();

        res.redirect('/login');
    } catch (error) {
        console.error('Error during signup: ', error);
        res.status(500).json({ message: 'An error occured during signup.' })
    }

}

async function handleLogIn(req, res) {
    const { email, password } = req.body;

    if (!email || !password) {
        res.locals.error = 'Email and password are required.';
        return res.render('login');
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            res.locals.error = 'Invalid email or password.';
            return res.render('login');
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            res.locals.error = 'Invalid email or password.';
            return res.render('login');
        }

        res.render('homepage', { name: user.name });
    } catch (error) {
        console.error('Error during login: ', error);
        res.status(500).json({ message: 'Server error' })
    }

}

async function handleReset(req, res) {
    const { email, dob, password } = req.body;

    if (!email || !dob || !password) {
        res.locals.error = 'Email and Date of birth is required.';
        return res.render('reset');
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            res.locals.error = 'Invalid email or date of birth.';
            return res.render('reset');
        }

        const formattedDobInput = new Date(dob).toISOString().split('T')[0];
        const formattedDobStored = new Date(user.dob).toISOString().split('T')[0];

        if (formattedDobInput !== formattedDobStored) {
            res.locals.error = 'Invalid email or date of birth.';
            return res.render('reset');
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        user.password = hashedPassword;
        await user.save();

        res.status(200).redirect('/login');
    } catch (error) {
        console.error('Error during reset pasword', error);
        res.status(500).json({ message: 'Server error' })
    }
}

module.exports = {
    handleLogIn,
    handleSignUp,
    handleReset,
};