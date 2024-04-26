const express = require('express');
const pool = require('../config/database.js');
const { validationResult } = require('express-validator');
const return_error = require('../helpers/return_error.js');
const fecha_hora = require('../helpers/return_date.js')

const post_herramienta = async(req, res)=>{
    await pool.getConnection().then(async (conn) => {
        try{
            const id_estatus = 1; //id _estatus = 1 es el estatus "Disponible"
            const fecha_alta = fecha_hora();
            const {id_tipo, observaciones,id_origen} = req.body;
            const data = [id_tipo, id_estatus, observaciones,fecha_alta,id_origen];
            
            //validacion expresss validator
            const validation_error = validationResult(req); 
            if(!validation_error.isEmpty()){
                const result = return_error(400,'Datos con formato o extensión incorrecta');
                conn.release;     
                return res.status(400).json(result) 
            }

            //validation tipo exists, estatus exists
            const validation_tipo = await conn.query("SELECT COUNT (id_tipo) as result FROM tipo_herramienta WHERE id_tipo = ?", id_tipo)
            //const validation_estatus = await conn.query("SELECT COUNT (id_estatus) as result FROM estatus_herramienta WHERE id_estatus = ?", id_estatus)

            if(parseInt(validation_tipo[0].result) === 0){
                const result = return_error(400,'El tipo de herramienta o el estatus no existe');
                conn.release;    
                return res.status(400).json(result)    
            }

            //query
            const query = await conn.query("INSERT INTO herramientas (id_tipo, id_estatus, observaciones, fecha_alta, id_origen) VALUES (?,?,?,?,?)",data)
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

            conn.release;

        }
        catch (error){
            const result = return_error(500,'Internal server error');
            conn.release;    
            res.status(500).json(result)    
            console.log(error.message)  

        }
    })
}
  
const get_herramienta = async (req,res)=>{
    await pool.getConnection().then(async (conn) => {

        try{
            //query
            const query = await conn.query("CALL consultar_herramientas()");
            //console.log(query[0])
            res.status(200).json(query[0])
            conn.release; 
        }
        
        catch(error){
            const result = return_error(500,'Internal server error');
            conn.release;
            res.status(500).json(result)
            console.log (error)
        }

    })
}

const get_herramienta_por_tipo = async (req,res)=>{
    await pool.getConnection().then(async (conn) => {

        try{
            const id_tipo = req.params.id_tipo;
    
            //validation error express validator  
            const validation_error = validationResult(req);
            if(!validation_error.isEmpty()){
                const result = return_error(400,'Datos con formato incorrecto');
                conn.release;    
                return res.status(400).json(result) 
            }
            
            //validation id_tipo exists
            const validation_id_tipo = await conn.query("SELECT COUNT(id_tipo) as result FROM tipo_herramienta WHERE id_tipo = ?", id_tipo);

            if(parseInt(validation_id_tipo[0].result) === 0){
                const result = return_error(400,`El ID del tipo de herramienta no existe: ${id_tipo}`);
                conn.release;    
                return res.status(400).json(result)    
            }


            //query
            const query = await conn.query("CALL consultar_herramientas_por_tipo (?)", id_tipo);
            res.status(200).json(query[0])
            conn.release;
        }
        
        catch(error){
            const result = return_error(500,'Internal server error');
            conn.release;
            res.status(500).json(result)
        }

    })
}
/*******la fecha de alta no se debe modificar ********/
const put_herramienta = async (req,res)=>{
    await pool.getConnection().then(async (conn) => {

        try{
            const {id_herramienta, id_tipo, id_estatus, observaciones, origen} = req.body;
            const data = [id_tipo, id_estatus, observaciones, origen, id_herramienta];

            //validacion expresss validator
            const validation_error = validationResult(req); 
            if(!validation_error.isEmpty()){
                const result = return_error(400,'Datos con formato o extensión incorrecta');
                conn.release;    
                return res.status(400).json(result) 
            }

             //validation tipo exists, estatus exists
             const validation_tipo = await conn.query("SELECT COUNT (id_tipo) as result FROM tipo_herramienta WHERE id_tipo = ?", id_tipo)
             const validation_estatus = await conn.query("SELECT COUNT (id_estatus) as result FROM estatus_herramienta WHERE id_estatus = ?", id_estatus)
            
             if(parseInt(validation_tipo[0].result) === 0 || parseInt(validation_estatus[0].result) === 0){
                const result = return_error(400,'El tipo de herramienta o el estatus no existe');
                conn.release;    
                return res.status(400).json(result)    
            }

            //query
            const query = await conn.query("UPDATE herramientas SET id_tipo = ?, id_estatus = ?, observaciones = ?, origen = ? WHERE id_herramienta = ?",data)
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

            conn.release;
        }
        
        catch(error){
            const result = return_error(500,'Internal server error');
            conn.release;
            res.status(500).json(result)
            console.log(error)
        }

    })
}

const delete_herramienta = async (req,res)=>{
    await pool.getConnection().then(async (conn) => {

        try{
            const id_herramienta = req.params.id_herramienta

            //validation express validator
            const validation_error = validationResult(req); 
            if(!validation_error.isEmpty()){
                const result = return_error(400,'Datos con formato incorrecto');
                conn.release;    
                return res.status(400).json(result) 
            }

            //validation id_herramienta exists
            const validation_id_herr = await conn.query("SELECT COUNT (id_herramienta) as result FROM herramientas WHERE id_herramienta = ?",id_herramienta)

            if(parseInt(validation_id_herr[0].result) === 0){
                const result = return_error(400,'El ID de herramienta no existe');
                conn.release;    
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
            conn.release;
        }
        
        catch(error){
            const result = return_error(500,'Internal server error');
            conn.release;
            res.status(500).json(result)
            console.log(error)

        }  

    })
}



module.exports = {
    post_herramienta,
    get_herramienta,
    get_herramienta_por_tipo,
    put_herramienta,
    delete_herramienta
}