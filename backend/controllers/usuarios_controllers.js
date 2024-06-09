const express = require('express');
const pool = require('../config/database.js');
const { validationResult } = require('express-validator');
const { encrypt } = require('../helpers/handle_bcrybpt.js')
const return_error = require('../helpers/return_error.js')
const id_user_token = require('../helpers/return_id_user_token.js')


const post_usuario = async (req, res) => {
    pool.getConnection().then(async (conn) => {

        try {

            const { id_rol, nombre_usuario, apellido_paterno, apellido_materno, nombre_login, password, estatus_activo } = req.body;
            const pass_encrypt = await encrypt(password);
            const data = [id_rol, nombre_usuario, apellido_paterno, apellido_materno, nombre_login, pass_encrypt, estatus_activo];

            //validacion expresss validator
            const validation_error = validationResult(req);
            if (!validation_error.isEmpty()) {
                const mensajeError = validation_error.array()[0].msg;
                const result = return_error(400, `Datos con formato o extensión incorrecta ${mensajeError}`);
                conn.release();
                return res.status(400).json(result)
            }

            //validation nombre de usuario ya existe
            const validation_nom_login = await conn.query("SELECT COUNT(nombre_login) as result FROM usuarios WHERE nombre_login = ?", nombre_login)

            if (parseInt(validation_nom_login[0].result) !== 0) {
                const result = return_error(400, 'El nombre usuario ya existe ');
                conn.release();
                return res.status(400).json(result)
            }

            const query = await conn.query("INSERT INTO usuarios (id_rol, nombre_usuario, apellido_paterno, apellido_materno, nombre_login, password, estatus_activo) values (?, ?, ?, ?, ?, ?, ?) ", data)
            insert_id = parseInt(query.insert_id)
            //res estatus
            res.status(201).json({
                "ok": true,
                "id_tipo": insert_id,
                "message": {
                    "code": 201,
                    "messageText": "Usuario registrado con éxito"
                }
            })

            conn.release()

        } catch (error) {
            const result = return_error(500, 'Internal server error');
            conn.release();
            res.status(500).json(result)       //console.log(error)
            console.log(error.message)
        }


    })
}

const get_usuarios = async (req, res) => {
    pool.getConnection().then(async (conn) => {

        try {

            //query
            const query = await conn.query("CALL consultar_usuarios()");
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
}

const put_usuario = async (req, res) => {
    pool.getConnection().then(async (conn) => {
        try {

            const { id_usuario, id_rol, nombre_usuario, apellido_paterno, apellido_materno, nombre_login } = req.body
            const data = [id_rol, nombre_usuario, apellido_paterno, apellido_materno, nombre_login, id_usuario]

            //validation error express validator  
            const validation_error = validationResult(req);
            if (!validation_error.isEmpty()) {
                const result = return_error(400, 'Datos con formato incorrecto');
                conn.release();
                return res.status(400).json(result)
            }

            //validation nombre de usuario ya existe
            const validation_nom_login = await conn.query("SELECT COUNT(nombre_login) as result FROM usuarios WHERE nombre_login = ? and id_usuario != ?", [nombre_login, id_usuario])

            if (parseInt(validation_nom_login[0].result) !== 0) {
                const result = return_error(400, 'El nuevo nombre de usuario ya existe para un usuario registrado');
                conn.release();
                return res.status(400).json(result)
            }



            //query
            await conn.query("UPDATE usuarios SET id_rol = ?, nombre_usuario = ?, apellido_paterno = ?, apellido_materno = ?, nombre_login = ? WHERE id_usuario = ?", data);
            res.status(201).json({
                "ok": true,
                "message": {
                    "code": 200,
                    "messageText": "Usuario actualizado con éxito"
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

const put_usuario_password = async (req, res) => {
    pool.getConnection().then(async (conn) => {

        try {

            const { id_usuario, password } = req.body
            const pass_encrypt = await encrypt(password);
            const data = [pass_encrypt, id_usuario]

            //validation error express validator  
            const validation_error = validationResult(req);
            if (!validation_error.isEmpty()) {
                const result = return_error(400, 'Datos con formato incorrecto, ingrese mínimo 5 caracteres');
                conn.release();
                return res.status(400).json(result)
            }

            await conn.query("UPDATE usuarios SET password = ? WHERE id_usuario = ?", data)
            res.status(201).json({
                "ok": true,
                "message": {
                    "code": 200,
                    "messageText": "Password actualizado con éxito"
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

const put_user_estatus = async (req, res) => {
    pool.getConnection().then(async (conn) => {
        try {
            const { id_usuario } = req.body
            const data = id_usuario;
            const usuario_actual = await id_user_token(req.headers.authorization)


            //validation error express validator  
            const validation_error = validationResult(req);
            if (!validation_error.isEmpty()) {
                const result = return_error(400, 'Datos con formato incorrecto');
                conn.release();
                return res.status(400).json(result)
            }

            if (parseInt(id_usuario) === parseInt(usuario_actual)) {

                const result = return_error(400, 'No puede desactivarse a sí mismo');
                conn.release();
                return res.status(400).json(result)
            }

            await conn.query("call cambiar_estatus_user(?)", data)
            res.status(201).json({
                "ok": true,
                "message": {
                    "code": 200,
                    "messageText": "Actualizado con éxito"
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


module.exports = {
    post_usuario,
    get_usuarios,
    put_usuario,
    put_usuario_password,
    put_user_estatus
}

