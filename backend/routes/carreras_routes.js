const express = require('express');
const router = express.Router();
const {check_token} = require('../middlewares/check_token.js')
const {check_rol} = require('../middlewares/check_rol.js')

const { body, param } = require("express-validator")

const {get_carreras} = require('../controllers/carreras_controller.js')

router.get('/', get_carreras)

module.exports = router