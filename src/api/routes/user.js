const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const checkAuth = require('../middleware/check-auth');
const User = require('../models/user');

const UserController = require('../controllers/user');

router.post('/login', UserController.login);
router.get('/logout', UserController.logout);
router.post('/sign-up', UserController.signup);
router.post('/change-password', UserController.changePassword);
router.post('/forget-password', UserController.forgetPassword);
router.get('/profile/:profileId', checkAuth, UserController.profile);
router.delete('delete/:userId', UserController.deleteUser);

module.exports = router;
