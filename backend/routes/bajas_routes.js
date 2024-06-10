const express = require('express');
const router = express.Router();
const {check_token} = require('../middlewares/check_token.js')
const {check_rol} = require('../middlewares/check_rol.js')

const { body, param } = require("express-validator")

const { post_baja, get_bajas, delete_clear_bajas, delete_baja} = require('../controllers/bajas_controller.js');
//const { route } = require('./herramientas_routes.js');

router.post('/',check_token,check_rol(['Administrador', 'Laboratorista']), body(['id_herramienta', 'id_motivo']).isNumeric(), body('observaciones').isLength({max: 255}), post_baja)

router.get('/',check_token,check_rol(['Administrador', 'Laboratorista']),get_bajas)

router.delete('/clear_bajas/all', check_token,check_rol(['Administrador', 'Laboratorista']),delete_clear_bajas)

router.delete('/:id_baja', check_token,check_rol(['Administrador', 'Laboratorista']),param('id_baja').isNumeric(),delete_baja)

module.exports = router
