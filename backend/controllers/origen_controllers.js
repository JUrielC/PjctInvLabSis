const express = require('express');
const pool = require('../config/database.js');
const { validationResult } = require('express-validator');
const return_error = require('../helpers/return_error.js');
const fecha_hora = require('../helpers/return_date.js')

const get_origen = async (req,res)=>{
    await pool.getConnection().then(async (conn) => {

        try{
            //query
            const query = await conn.query("select * from origen");
            //console.log(query[0])
            res.status(200).json(query)
            conn.release(); 
        }
        
        catch(error){
            const result = return_error(500,'Internal server error');
            conn.release();
            res.status(500).json(result)
            console.log (error)
        }

    })
}

module.exports = {
    get_origen
}