const express = require('express');
const pool = require('../config/database.js');
const { validationResult } = require('express-validator');
const return_error = require('../helpers/return_error.js');
const fecha_hora = require('../helpers/return_date.js')
const id_user_token = require('../helpers/return_id_user_token.js')


const post_prestamo = async (req, res) => {
    await pool.getConnection().then(async (conn) => {

        try {
            const encargado_entrega = await id_user_token(req.headers.authorization)
            const fecha_prestamo = fecha_hora();
            const id_estatus = 1; //estatus de prestamo en curso, revisar tabla estatus_prestamo de la db
            const { id_herramienta, id_carrera, id_solicitante, observaciones } = req.body
            const data = [encargado_entrega, id_herramienta, id_carrera, id_estatus, id_solicitante, fecha_prestamo, observaciones]

            //validacion expresss validator
            const validation_error = validationResult(req);
            if (!validation_error.isEmpty()) {
                const result = return_error(400, 'Datos con formato o extensión incorrecta');
                conn.release();
                return res.status(400).json(result)
            }


            //validacion id_herramienta exist
            const validation_id_herramienta = await conn.query("SELECT COUNT (id_herramienta) as result FROM herramientas WHERE id_herramienta = ?", id_herramienta)

            if (parseInt(validation_id_herramienta[0].result) === 0) {
                const result = return_error(400, 'La herramienta no está registrada');
                conn.release();
                return res.status(400).json(result)
            }

            //validation herramienta disponible
            const validation_herramienta_disponible = await conn.query("SELECT id_estatus FROM herramientas WHERE id_herramienta = ?", id_herramienta)
            //console.log((validation_herramienta_activa))
            if (parseInt(validation_herramienta_disponible[0].id_estatus) !== 1) {
                const result = return_error(400, 'La herramienta no está disponible, verifique el estatus');
                conn.release();
                return res.status(400).json(result)
            }

            //validacion carrera, id_ solicitante
            const validation_carrera = await conn.query("SELECT COUNT(id_carrera) as result FROM carreras WHERE id_carrera = ?", id_carrera)


            if (parseInt(validation_carrera[0].result) === 0) {
                const result = return_error(400, 'La solicitud contiene parámetros incorrectos, se recomienda contactar al equipo de desarrollo: no se encuentra el ID de la carrera.');
                conn.release();
                return res.status(400).json(result)
            }

            const validation_solicitante = await conn.query("SELECT COUNT (id_solicitante) as result FROM solicitantes WHERE id_solicitante = ?", id_solicitante)

            if (parseInt(validation_solicitante[0].result) === 0) {
                const result = return_error(400, 'El no se encuentra el solicitante. Compruebe si el solicitante está registrado en el sistema');
                conn.release();
                return res.status(400).json(result)
            }


            //QUERY
            const query = await conn.query("CALL registrar_prestamo (?,?,?,?,?,?,?)", data)
            //console.log(query)
            //const insert_id = parseInt(query[0].insertId)
            res.status(201).json({
                "ok": true,
                "message": {
                    "code": 201,
                    "messageText": "Prestamo registrado con éxito"
                }
            })

            conn.release();
        }
        catch (error) {

            const result = return_error(500, 'Internal server error');
            console.log(error)
            conn.release();
            res.status(500).json(result)

        }



    })
}

const get_prestamos_activos = async (req, res) => (
    await pool.getConnection().then(async (conn) => {


        try {
            //query
            const query = await conn.query("CALL consultar_prestamos_activos()");
            //console.log(query[0])
            res.status(200).json(query[0])
            conn.release();
        }

        catch (error) {
            const result = return_error(500, 'Internal server error');
            conn.release();
            res.status(500).json(result)
        }
    })
)

const get_prestamos = async (req, res) => (
    await pool.getConnection().then(async (conn) => {


        try {
            //query
            const query = await conn.query("CALL consultar_prestamos()");
            //console.log(query[0])
            res.status(200).json(query[0])
            conn.release();
        }

        catch (error) {
            const result = return_error(500, 'Internal server error');
            conn.release();
            res.status(500).json(result)
            console.log(error)
        }
    })
)

const get_prestamos_concluidos = async (req, res) => (
    await pool.getConnection().then(async (conn) => {


        try {
            //query
            const query = await conn.query("CALL consultar_prestamos_concluidos()");
            //console.log(query[0])
            res.status(200).json(query[0])
            conn.release();
        }

        catch (error) {
            const result = return_error(500, 'Internal server error');
            conn.release();
            res.status(500).json(result)
            console.log(error)
        }
    })
)

const put_prestamo_devuelto = async (req, res) => {
    pool.getConnection().then(async (conn) => {
        try {

            const { id_prestamo } = req.body
            const usuario_recibe = await id_user_token(req.headers.authorization)
            const fecha_devolucion = fecha_hora();

            const data = [id_prestamo, usuario_recibe, fecha_devolucion]

            //validacion expresss validator
            const validation_error = validationResult(req);
            if (!validation_error.isEmpty()) {
                const result = return_error(400, 'Datos con formato o extensión incorrecta');
                conn.release();
                return res.status(400).json(result)
            }

            await conn.query("CALL prestamo_devuelto (?,?,?)", data)

            res.status(200).json({
                "ok": true,
                "message": {
                    "code": 200,
                    "messageText": "Préstamo concluido exitosamente"
                }
            })

            conn.release();
        } catch (error) {

            const result = return_error(500, 'Internal server error');
            conn.release();
            res.status(500).json(result)
            console.log(error)
        }

    })
}


/* Delete solo prestamos concluidos */

module.exports = {
    post_prestamo,
    get_prestamos,
    get_prestamos_activos,
    get_prestamos_concluidos,
    put_prestamo_devuelto
}