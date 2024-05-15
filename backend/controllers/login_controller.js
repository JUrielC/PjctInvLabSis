const { validationResult } = require('express-validator');
const return_error = require('../helpers/return_error.js');
const {encrypt, compare} = require ('../helpers/handle_bcrybpt.js');
const pool = require('../config/database.js');
const { token_sign, verify_token, decode_sign } = require('../helpers/generate_token.js');

const post_login = async (req, res) =>{
    await pool.getConnection().then(async (conn) =>{
        try{ 
            const {nombre_login, password} = req.body;

            //validation error express validator  
            const validation_error = validationResult(req);
            if(!validation_error.isEmpty()){
                const mensajeError = validation_error.array()[0].msg;
                const result = return_error(400,`Datos con formato incorrecto. ${mensajeError}`);
                conn.release();    
                return res.status(400).json(result) 
            }


            //validation user exist
            const user_validation = await conn.query("SELECT COUNT (nombre_login) as result FROM usuarios WHERE nombre_login = ?",nombre_login);

            if(parseInt(user_validation[0].result) === 0){
                const result = return_error(404,'El usuario no está registrado');
                conn.release();    
                return res.status(400).json(result)    
            }


        
            //compare password del usuario que hace la solicitud
            const pass_user = await conn.query("SELECT password from usuarios WHERE nombre_login = ?", nombre_login)
            const pass_hash = await pass_user[0]["password"] //pass_user[0]
            const checkPassword = await compare(password, pass_hash)

            if(!checkPassword){
                const result = return_error(400,'Contraseña incorrecta');
                conn.release();
                return res.status(400).json(result) 
            }

            //user activo
            const user_activo_validation = await conn.query("SELECT estatus_activo from usuarios WHERE nombre_login = ? ", nombre_login)
            
            if (!user_activo_validation[0]["estatus_activo"]){
                const result = return_error(403,'Usuario no activo');
                conn.release();
                return res.status(403).json(result) 
            }



            if(checkPassword && parseInt(user_validation[0].result) !== 0){

                //obtener id de usuario y rol
                //pass_hash surge de un select a la base de datos con el fin de obtener el passwor registrado ahí
                //se hace un select para obtener el id_usuario usando el nombre_login y passhash
                const user_query = await conn.query("SELECT id_usuario FROM usuarios WHERE nombre_login = ? and password = ?", [nombre_login, pass_hash])
                const user =  user_query[0].id_usuario; 
                const rol_query = await conn.query ("SELECT ru.nombre_rol FROM roles_usuarios ru INNER JOIN usuarios u ON ru.id_rol = u.id_rol WHERE id_usuario = ?", user)
                const rol = rol_query[0].nombre_rol;              

                console.log("Sesion iniciada exitosamente ");
                const  token_session = await token_sign(user, rol);
                 //res estatus
                res.status(200).json({
                "ok": true,
                "message": {
                    "code": 200,
                    "messageText": "Sesion iniciada exitosamente "
                },
                "tokenSession": token_session   
                })
                conn.release();
            }

        }
        catch (error){
            const result = return_error(500,'Internal server error');
            conn.release();    
            res.status(500).json(result)       //console.log(error)
            console.log(error)  
        }
        finally{
            conn.release()
        }
    })

}

module.exports = {
    post_login
}