const express = require('express');
const pool = require('../config/database.js');
const { validationResult } = require('express-validator');
const return_error = require('../helpers/return_error.js');
const fecha_hora = require('../helpers/return_date.js')
const id_user_token = require ('../helpers/return_id_user_token.js')

const post_baja = async (req, res) => {
    await pool.getConnection().then(async (conn) =>{

        try{
            
            const id_user = await id_user_token(req.headers.authorization)
            const fecha_baja = fecha_hora();
            const {id_herramienta, id_motivo, observaciones} = req.body
            const data = [id_herramienta, id_motivo, id_user, fecha_baja, observaciones]

            //validacion expresss validator
            const validation_error = validationResult(req); 
            if(!validation_error.isEmpty()){
                const result = return_error(400,'Datos con formato o extensión incorrecta');
                conn.release();     
                return res.status(400).json(result) 
            }


            //validacion id_herramienta exist
            const validation_id_herramienta = await conn.query("SELECT COUNT (id_herramienta) as result FROM herramientas WHERE id_herramienta = ?", id_herramienta)

            if(parseInt(validation_id_herramienta[0].result) === 0){
                const result = return_error(400,'La herramienta no está registrada');
                conn.release();    
                return res.status(400).json(result)    
            }

            //validation user exist
            const validation_user = await conn.query("SELECT COUNT (id_usuario) as result FROM usuarios WHERE id_usuario = ?", id_user)
            

            if(parseInt(validation_user[0].result) === 0){
                const result = return_error(400,'Error al ingresar el id de usuario, internal server error');
                conn.release();    
                return res.status(400).json(result)    
            }

            //validation motivo exist
            const validation_motivo = await conn.query("SELECT COUNT (id_usuario) as result FROM usuarios WHERE id_usuario = ?", id_user)
            

            if(parseInt(validation_motivo[0].result) === 0){
                const result = return_error(400,'La solicitud contiene un motivo inexistente, es recomendable contactar al equipo de desarrollo');
                conn.release();    
                return res.status(400).json(result)    
            }

             //validacion herramienta activa

             const validation_herramienta_activa = await conn.query ("SELECT id_estatus FROM herramientas WHERE id_herramienta = ?", id_herramienta)
             //console.log((validation_herramienta_activa))
             if(parseInt(validation_herramienta_activa[0].id_estatus)===3){
                 const result = return_error(400,'La herramienta ya está en estatus de baja');
                 conn.release();    
                 return res.status(400).json(result)  
             }

            //QUERY
            const query = await conn.query("CALL registrar_baja (?,?,?,?,?)",data)
            //const insert_id = parseInt(query.insertId)
            //res estatus
            res.status(201).json({
                "ok": true,
                "message": { 
                    "code": 201,
                    "messageText": "Baja realizada con éxito"
                }   
            })

            conn.release();

        }catch(error){
            
            const result = return_error(500,'Internal server error');
            conn.release();    
            res.status(500).json(result)    
            console.log(error)  
        }
        
    })
}

const get_bajas = async (req, res) => {
    await pool.getConnection().then(async (conn) =>{

        try{
            //query
            const query = await conn.query("CALL consultar_bajas()");
            //console.log(query[0])
            res.status(200).json(query[0])
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

//no put

const delete_baja = async (req, res) => {
    await pool.getConnection().then(async (conn) =>{



    })
}


module.exports = {
    post_baja,
    get_bajas,
    delete_baja
}