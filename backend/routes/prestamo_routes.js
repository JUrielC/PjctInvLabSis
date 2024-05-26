const express = require('express');
const router = express.Router();
const {check_token} = require('../middlewares/check_token.js')
const {check_rol} = require('../middlewares/check_rol.js')

const { body, param } = require("express-validator")
const { post_prestamo, get_prestamos_activos, delete_baja} = require('../controllers/prestamos_controller.js');

router.get('/', get_prestamos_activos)

router.post('/', post_prestamo)

module.exports = router