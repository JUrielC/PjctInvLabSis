const express = require('express');
const router = express.Router();

const { body, param } = require("express-validator");

const { post_herramienta, get_herramienta, get_herramienta_por_tipo, put_herramienta, delete_herramienta} = require('../controllers/herramientas_controller.js');

router.post('/', body('id_tipo').isNumeric(),body('observaciones').isLength({max: 255}), post_herramienta);

router.get('/', get_herramienta);

router.get('/tipo/:id_tipo', param('id_tipo').isNumeric(), get_herramienta_por_tipo);

router.put('/',  body('id_tipo').isNumeric(),body('id_estatus').isNumeric(),body('observaciones').isLength({max: 255}), put_herramienta);

router.delete('/:id_herramienta', param('id_herramienta').isNumeric(), delete_herramienta); 

module.exports = router