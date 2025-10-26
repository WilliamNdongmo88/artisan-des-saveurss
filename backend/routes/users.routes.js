const express = require('express');
const UserController = require('../controllers/users.controller');
const router = express.Router();

router.post('/', UserController.createU);

module.exports = router;