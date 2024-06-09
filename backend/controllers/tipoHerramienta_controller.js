const express = require('express');
const pool = require('../config/database.js');
const { validationResult } = require('express-validator');
const return_error = require('../helpers/return_error.js')


const post_tipoHerramienta = async (req, res) => {
    await pool.getConnection().then(async (conn) => {

        try {

            const { nombre_tipo, descripcion } = req.body;
            const data = [nombre_tipo, descripcion];
            //validacion expresss validator
            const validation_error = validationResult(req);
            if (!validation_error.isEmpty()) {
                const result = return_error(400, 'Datos con formato o extensión incorrecta');
                conn.release();
                return res.status(400).json(result)
            }

            //query
            const query = await conn.query("INSERT INTO tipo_herramienta (nombre_tipo, descripcion) VALUES (?,?)", data);
            const insert_id = parseInt(query.insertId)

            //res estatus
            res.status(201).json({
                "ok": true,
                "id_tipo": insert_id,
                "message": {
                    "code": 201,
                    "messageText": "Tipo registrado con éxito"
                }
            })

            conn.release();

        }
        catch (error) {
            const result = return_error(500, 'Internal server error');
            conn.release();
            res.status(500).json(result)       //console.log(error)
            console.log(error.message)
        }
    })
}

const get_tipoHerramienta = async (req, res) => {
    await pool.getConnection().then(async (conn) => {

        try {

            //query
            const query = await conn.query("SELECT * FROM tipo_herramienta ORDER BY nombre_tipo ASC");
            res.status(200).json(query)
            conn.release();

        }

        catch (error) {
            const result = return_error(500, 'Internal server error');
            conn.release();
            res.status(500).json(result)
        }

    })
}

const get_items_disp_por_tipo = async (red, res) => {
    await pool.getConnection().then(async (conn) => {
        try {

            //query
            const query = await conn.query("SELECT t.id_tipo, t.nombre_tipo, IFNULL(JSON_ARRAYAGG(" +
                " h.id_herramienta), '[]') AS herramientas " +
                "FROM tipo_herramienta t LEFT JOIN herramientas h ON t.id_tipo = h.id_tipo " +
                "WHERE h.id_estatus = 1 GROUP BY t.id_tipo, t.nombre_tipo ORDER BY t.nombre_tipo asc");
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

const put_tipoHerramienta = async (req, res) => {
    await pool.getConnection().then(async (conn) => {

        try {

            const { id_tipo, nombre_tipo, descripcion } = req.body
            const data = [id_tipo, nombre_tipo, descripcion ]

            //validation error express validator  
            const validation_error = validationResult(req);
            if (!validation_error.isEmpty()) {
                const result = return_error(400, 'Datos con formato incorrecto');
                conn.release();
                return res.status(400).json(result)
            }

            //validation id_tipo exists
            const validation_id_tipo = await conn.query("SELECT COUNT(id_tipo) as result FROM tipo_herramienta WHERE id_tipo = ?", id_tipo)

            if (parseInt(validation_id_tipo[0].result) === 0) {
                const result = return_error(400, 'El ID del tipo de herramienta no existe');
                conn.release();
                return res.status(400).json(result)
            }

            //query
            await conn.query("call actualizar_tipo_herramienta(?,?,?)", data);
            res.status(201).json({
                "ok": true,
                "message": {
                    "code": 200,
                    "messageText": "Tipo actualizado con éxito"
                }
            })
            conn.release();

        }

        catch (error) {
            const result = return_error(500, 'Internal server error');
            conn.release();
            res.status(500).json(result)
            //console.log(error)
        }

    })
}

const delete_tipoHerramienta = async (req, res) => {
    await pool.getConnection().then(async (conn) => {

        try {
            const id_tipo = req.params.id_tipo

            //validation express validator
            const validation_error = validationResult(req);
            if (!validation_error.isEmpty()) {
                const result = return_error(400, 'Datos con formato incorrecto');
                conn.release();
                return res.status(400).json(result)
            }
            //validation id_tipo exists
            const validation_id_tipo = await conn.query("SELECT COUNT (id_tipo) as result FROM tipo_herramienta WHERE id_tipo = ?", id_tipo)

            if (parseInt(validation_id_tipo[0].result) === 0) {
                const result = return_error(400, 'El ID del tipo de herramienta no existe');
                conn.release();
                return res.status(400).json(result)
            }


            //validation: no hay herramientas de ese tipo
            const validation_herramientas = await conn.query("SELECT COUNT (id_tipo) as result FROM herramientas WHERE id_tipo = ?", id_tipo)
            if (parseInt(validation_herramientas[0].result) !== 0) {
                const result = return_error(400, 'Aún hay herramientas registradas con ese tipo');
                conn.release();
                return res.status(400).json(result)
            }

            //query
            await conn.query("DELETE FROM tipo_herramienta WHERE id_tipo = ?", id_tipo);
            res.status(200).json({
                "ok": true,
                "message": {
                    "code": 200,
                    "messageText": "Tipo eliminado con éxito"
                }
            })
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
    post_tipoHerramienta,
    get_tipoHerramienta,
    get_items_disp_por_tipo,
    put_tipoHerramienta,
    delete_tipoHerramienta
}