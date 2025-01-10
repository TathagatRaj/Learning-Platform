const bcrypt = require('bcrypt');
const User = require('../models/user')

async function handleSignUp(req, res) {
    const { name, email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
    }

    try {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const newUser = new User({ name, email, password: hashedPassword });
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
        return res.status(400).json({ message: 'Email and password are required.' });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'Invalid user.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid password.' });
        }

        res.render('homepage', {name: user.name});
    } catch (error) {
        console.error('Error during login: ', error);
        res.status(500).json({ message: 'Server error' })
    }

}

module.exports = {
    handleLogIn,
    handleSignUp,
};