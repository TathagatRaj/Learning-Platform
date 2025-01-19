const express = require('express');
const { handleLogIn, handleSignUp, handleReset } = require('../controller/controller')

const router = express.Router();

router.post('/login', handleLogIn)
router.post('/signup', handleSignUp)
router.post('/reset', handleReset)

module.exports = router