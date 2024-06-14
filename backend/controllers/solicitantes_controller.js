const express = require('express');
const pool = require('../config/database.js');
const { validationResult } = require('express-validator');
const { encrypt } = require('../helpers/handle_bcrybpt.js')
const return_error = require('../helpers/return_error.js')

const get_solicitantes = async(req, res)=>{
    pool.getConnection().then(async (conn)=>{
        try {

            //query
            const query = await conn.query("SELECT id_solicitante, nombre, apellido_paterno, COALESCE(apellido_materno, '') as apellido_materno, control_nomina, telefono, mail FROM solicitantes ORDER BY nombre ASC");
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

/* const delete_solicitante =  async(req, res)=>{
    pool.getConnection().then(async(conn)=>{

        const id_solicitante = req.id_param.id_solicitante

        await conn.query ("DELETE FROM solicitantes WHERE id_solicitante = ?", id_solicitante)



    })
} */

module.exports ={
    get_solicitantes
}