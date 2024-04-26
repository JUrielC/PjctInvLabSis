const express = require('express');
const router = express.Router();
const { body, param } = require("express-validator");
const {post_login} = require ('../controllers/login_controller.js');

router.post('/', body('nombre_login').exists().withMessage('Ingresar un nombre de usuario').notEmpty().withMessage("Ingresar un nombre de ususario válido"), post_login);

module.exports = router;