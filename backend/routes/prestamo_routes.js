const express = require('express');
const router = express.Router();
const {check_token} = require('../middlewares/check_token.js')
const {check_rol} = require('../middlewares/check_rol.js')

const { body, param } = require("express-validator")
const { post_prestamo, get_prestamos_activos, get_prestamos_concluidos, get_prestamos} = require('../controllers/prestamos_controller.js');

router.get('/',check_token,check_rol(['Administrador', 'Laboratorista', 'Asistente']),
body(['id_herramienta', 'id_carrera', 'id_solicitante']).isNumeric(),
get_prestamos)

router.get('/prestamos_activos',check_token,check_rol(['Administrador', 'Laboratorista', 'Asistente']), get_prestamos_activos)

router.get('/prestamos_concluidos',check_token,check_rol(['Administrador', 'Laboratorista', 'Asistente']), get_prestamos_concluidos)

router.post('/',check_token,check_rol(['Administrador', 'Laboratorista','Asistente ']), post_prestamo)

module.exports = router