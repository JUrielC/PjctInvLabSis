const express = require('express');
const router = express.Router();
const {check_token} = require('../middlewares/check_token.js')
const {check_rol} = require('../middlewares/check_rol.js')
const { body, param } = require("express-validator");

const { post_tipoHerramienta, get_tipoHerramienta, put_tipoHerramienta, delete_tipoHerramienta,get_items_disp_por_tipo } = require('../controllers/tipoHerramienta_controller.js');

router.post('/',check_token,check_rol(['Administrador', 'Laboratorista']), body('nombre_tipo').isLength({min:1, max:35}),body('descripcion').isLength({max:255}), post_tipoHerramienta);

router.get('/',check_token,check_rol(['Administrador', 'Laboratorista', 'Asistente']), get_tipoHerramienta);

router.get('/tipos_mas_herramientas' ,check_token,check_rol(['Administrador', 'Laboratorista', 'Asistente']),  get_items_disp_por_tipo)

router.put('/' ,check_token,check_rol(['Administrador']), body('id_tipo').isNumeric(), put_tipoHerramienta);

router.delete('/:id_tipo',check_token,check_rol(['Administrador']), param('id_tipo').isNumeric(), delete_tipoHerramienta); /**/

module.exports = router