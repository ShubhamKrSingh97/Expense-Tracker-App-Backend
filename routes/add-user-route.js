const express = require('express');
const router = express.Router();
const addUserController = require('../controllers/add-user-controller');

module.exports = router.post('/add-user', addUserController);