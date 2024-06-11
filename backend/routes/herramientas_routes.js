const express = require('express');
const router = express.Router();
const {check_token} = require('../middlewares/check_token.js')
const {check_rol} = require('../middlewares/check_rol.js')

const { body, param } = require("express-validator");

const { post_herramienta, get_herramienta, get_herramienta_por_tipo, put_herramienta, delete_herramienta} = require('../controllers/herramientas_controller.js');

router.post('/', check_token, check_rol(['Administrador', 'Laboratorista']), body('id_tipo').isNumeric(),body('observaciones').isLength({max: 255}), post_herramienta);

router.get('/',check_token,check_rol(['Administrador', 'Laboratorista', 'Asistente']), get_herramienta);

router.get('/tipo/:id_tipo',check_token,check_rol(['Administrador', 'Laboratorista', 'Asistente']), param('id_tipo').isNumeric(), get_herramienta_por_tipo);

router.put('/',check_token,check_rol(['Administrador', 'Laboratorista']),  body('id_herramienta').isNumeric(), put_herramienta);

router.delete('/:id_herramienta',check_token,check_rol(['Administrador', 'Laboratorista']), param('id_herramienta').isNumeric(), delete_herramienta); 

module.exports = router