const express = require('express');
const router = express.Router();
const {check_token} = require('../middlewares/check_token.js')
const {check_rol} = require('../middlewares/check_rol.js')
const { body, param } = require("express-validator");


const {post_usuario, get_usuarios, put_usuario, put_usuario_password} = require('../controllers/usuarios_controllers.js')

router.post('/', body('id_rol').isNumeric(), 
body(['nombre_usuario', 'apellido_paterno']).isLength({min:3, max: 45}).withMessage('El nombre y el apellido deben tener mínimo 3 caracteres y máximo 45'), 
body('nombre_login').isLength({min: 3, max:20}).withMessage('El nombre de usuario debe ser de mínimo 3 caracteres y máximo de 20'),
body('password').isLength({min:5, max:60}).withMessage('El password debe tener al menos 5 caracteres y máximo 60'), body('estatus_activo').isNumeric({min:0, max:1}),
post_usuario)


router.get('/',check_token,check_rol(['Administrador']), get_usuarios )

router.put('/',check_token,check_rol(['Administrador']),put_usuario)

router.put ('/rec_pass',check_token,check_rol(['Administrador']), put_usuario_password)

module.exports = router