const express = require('express');
const router = express.Router();
const {get_origen}  = require('../controllers/origen_controllers.js');

router.get('/', get_origen);


module.exports = router