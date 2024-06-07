const express = require('express');
const router = express.Router();
const {check_token} = require('../middlewares/check_token.js')
const {check_rol} = require('../middlewares/check_rol.js')
const { body, param } = require("express-validator");

const {get_solicitantes} = require('../controllers/solicitantes_controller.js')

router.get('/',check_token,check_rol(['Administrador', 'Laboratorista', 'Asistente']), get_solicitantes)

module.exports = router
