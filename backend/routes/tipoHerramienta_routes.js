const express = require('express');
const router = express.Router();

const { body, param } = require("express-validator");

const { post_tipoHerramienta, get_tipoHerramienta, put_tipoHerramienta, delete_tipoHerramienta } = require('../controllers/tipoHerramienta_controller.js');

router.post('/', body('nombre_tipo').isLength({min:1, max:35}),body('descripcion').isLength({max:255}), post_tipoHerramienta);

router.get('/', get_tipoHerramienta);

router.put('/', body('nombre_tipo').isLength({min:1, max:35}),body('descripcion').isLength({max:255}), put_tipoHerramienta);

router.delete('/:id_tipo', param('id_tipo').isNumeric(), delete_tipoHerramienta); /**/

module.exports = router