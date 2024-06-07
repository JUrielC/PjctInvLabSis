const express = require('express');
const pool = require('../config/database.js');
const { validationResult } = require('express-validator');
const return_error = require('../helpers/return_error.js');
const fecha_hora = require('../helpers/return_date.js')
const id_user_token = require('../helpers/return_id_user_token.js')



const get_carreras = async (req, res) => {
    pool.getConnection().then(async (conn) => {
        try {

            //query
            const query = await conn.query("SELECT * FROM carreras");
            res.status(200).json(query)
            conn.release();

        }

        catch (error) {
            const result = return_error(500, 'Internal server error');
            conn.release();
            res.status(500).json(result)
            console.log(error)
        }
    })
}

module.exports = {
    get_carreras
}