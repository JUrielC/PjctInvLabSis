const express = require('express');
const pool = require('../config/database.js');
const { validationResult } = require('express-validator');
const return_error = require('../helpers/return_error.js');
const fecha_hora = require('../helpers/return_date.js')
const id_user_token = require ('../helpers/return_id_user_token.js')


const post_prestamo = async (req, res) => {
    await pool.getConnection().then(async (conn) =>{

        

    })
}