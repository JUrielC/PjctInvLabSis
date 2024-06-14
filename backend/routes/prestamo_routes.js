const express = require('express');
const router = express.Router();
const {check_token} = require('../middlewares/check_token.js')
const {check_rol} = require('../middlewares/check_rol.js')

const { body, param } = require("express-validator")
const { post_prestamo, get_prestamos_activos, get_prestamos_concluidos, get_prestamos, put_prestamo_devuelto, delete_prestamos_concluidos} = require('../controllers/prestamos_controller.js');
const { route } = require('./tipoHerramienta_routes.js');

router.get('/',check_token,check_rol(['Administrador', 'Laboratorista', 'Asistente']),
body(['id_herramienta', 'id_carrera', 'id_solicitante']).isNumeric(),
get_prestamos)

router.get('/prestamos_activos',check_token,check_rol(['Administrador', 'Laboratorista', 'Asistente']), get_prestamos_activos)

router.get('/prestamos_concluidos',check_token,check_rol(['Administrador', 'Laboratorista', 'Asistente']), get_prestamos_concluidos)

router.post('/',check_token,check_rol(['Administrador', 'Laboratorista','Asistente']), post_prestamo)

router.put('/devolver_prestamo',check_token,check_rol(['Administrador', 'Laboratorista','Asistente']), put_prestamo_devuelto)

router.delete('/concluidos/delete_all',check_token,check_rol(['Administrador']), delete_prestamos_concluidos)

module.exports = router