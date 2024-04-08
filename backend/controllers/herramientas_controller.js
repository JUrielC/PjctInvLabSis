const express = require('express');
const pool = require('../config/database.js');
const { validationResult } = require('express-validator');
const return_error = require('../helpers/return_error.js')

const post_herramienta = async(req, res)=>{
    await pool.getConnection().then(async (conn) => {
        try{
            const {id_tipo, id_estatus, observaciones} = req.body;
            const data = [id_tipo, id_estatus, observaciones];
            
            //validacion expresss validator
            const validation_error = validationResult(req); 
            if(!validation_error.isEmpty()){
                const result = return_error(400,'Datos con formato o extensión incorrecta');
                conn.end;    
                return res.status(400).json(result) 
            }

            //validation tipo exists, estatus exists
            const validation_tipo = await conn.query("SELECT COUNT (id_tipo) as result FROM tipo_herramienta WHERE id_tipo = ?", id_tipo)
            const validation_estatus = await conn.query("SELECT COUNT (id_estatus) as result FROM estatus_herramientas WHERE id_estatus = ?", id_estatus)

            if(parseInt(validation_tipo[0].result) === 0 || parseInt(validation_estatus[0].result) === 0){
                const result = return_error(400,'El tipo de herramienta o el estatus no existe');
                conn.end;    
                return res.status(400).json(result)    
            }

            //query
            const query = await conn.query("INSERT INTO herramientas (id_tipo, id_estatus, observaciones) VALUES (?,?,?)",data)
            const insert_id = parseInt(query.insertId)
            //res estatus
            res.status(201).json({
                "ok": true,
                "id_herramienta": insert_id,
                "message": {
                    "code": 201,
                    "messageText": "Registrado con éxito"
                }   
            })

            conn.end;

        }
        catch (error){
            const result = return_error(500,'Internal server error');
            conn.end;    
            res.status(500).json(result)    
            console.log(error.message)  

        }
    })
}
  
const get_herramienta = async (req,res)=>{
    await pool.getConnection().then(async (conn) => {

        try{
            //query
            const query = await conn.query("SELECT * FROM herramientas");
            res.status(200).json(query)
            conn.end;
        }
        
        catch(error){
            const result = return_error(500,'Internal server error');
            conn.end;
            res.status(500).json(result)
        }

    })
}

const put_herramienta = async (req,res)=>{
    await pool.getConnection().then(async (conn) => {

        try{
            const {id_herramienta, id_tipo, id_estatus, observaciones} = req.body;
            const data = [id_tipo, id_estatus, observaciones, id_herramienta];

            //validacion expresss validator
            const validation_error = validationResult(req); 
            if(!validation_error.isEmpty()){
                const result = return_error(400,'Datos con formato o extensión incorrecta');
                conn.end;    
                return res.status(400).json(result) 
            }

             //validation tipo exists, estatus exists
             const validation_tipo = await conn.query("SELECT COUNT (id_tipo) as result FROM tipo_herramienta WHERE id_tipo = ?", id_tipo)
             const validation_estatus = await conn.query("SELECT COUNT (id_estatus) as result FROM estatus_herramientas WHERE id_estatus = ?", id_estatus)
            
             if(parseInt(validation_tipo[0].result) === 0 || parseInt(validation_estatus[0].result) === 0){
                const result = return_error(400,'El tipo de herramienta o el estatus no existe');
                conn.end;    
                return res.status(400).json(result)    
            }

            //query
            const query = await conn.query("UPDATE herramientas SET tipo = ?, estatus = ?, observaciones = ? WHERE id_herramienta = ?",data)
            const insert_id = parseInt(query.insertId)
            //res estatus
            res.status(201).json({
                "ok": true,
                "id_herramienta": insert_id,
                "message": {
                    "code": 201,
                    "messageText": "Actualizado con éxito"
                }   
            })

            conn.end;



        }
        
        catch(error){
            const result = return_error(500,'Internal server error');
            conn.end;
            res.status(500).json(result)
        }

    })
}

const delete_herramienta = async (req,res)=>{
    await pool.getConnection().then(async (conn) => {

        try{
            const id_herramienta = req.param

            //validation express validator
            const validation_error = validationResult(req); 
            if(!validation_error.isEmpty()){
                const result = return_error(400,'Datos con formato incorrecto');
                conn.end;    
                return res.status(400).json(result) 
            }

            //validation id_herramienta exists
            const validation_id_herr = await conn.query("SELECT COUNT (id_herramienta) as result FROM herramientas WHERE id_herramienta = ?",id_herramienta)

            if(parseInt(validation_id_herr[0].result) === 0){
                const result = return_error(400,'El ID de herramienta no existe');
                conn.end;    
                return res.status(400).json(result)    
            }
            
            //query
            await conn.query("DELETE FROM herramientas WHERE id_herramienta = ?", id_herramienta);
            res.status(200).json({
                "ok": true,
                "message": {
                    "code": 200,
                    "messageText": "Herramienta eliminada con éxito"
                }
            })
            conn.end;
        }
        
        catch(error){
            const result = return_error(500,'Internal server error');
            conn.end;
            res.status(500).json(result)

        }  

    })
}



module.exports = {
    post_herramienta,
    get_herramienta,
    put_herramienta,
    delete_herramienta
} 