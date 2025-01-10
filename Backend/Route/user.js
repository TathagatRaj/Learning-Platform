const express = require('express');
const { handleLogIn, handleSignUp } = require('../controller/user')

const router = express.Router();

router.post('/login', handleLogIn)
router.post('/', handleSignUp)

module.exports = router