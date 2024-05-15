const { verify_token } = require('../helpers/generate_token')
const return_error = require('../helpers/return_error.js');
const pool = require('../config/database.js');

const check_rol = (rol) => async (req, res, next)=>{
    await pool.getConnection().then(async (conn) => {

        try {
            const token = req.headers.authorization
            const token_data = await verify_token(token)
            const user_rol_database = await conn.query("SELECT roles_usuarios.nombre_rol FROM roles_usuarios JOIN usuarios ON roles_usuarios.id_rol = usuarios.id_rol WHERE usuarios.id_usuario = ?", token_data.id_user)     //tomar el rol del id de us 
            const estatus = await conn.query("SELECT estatus_activo FROM usuarios WHERE id_usuario = ?",  token_data.id_user)

            if ( [].concat(rol).includes(user_rol_database[0].nombre_rol) && parseInt(estatus[0].estatus_activo) === 1){
                conn.release();
                next()
            }
            else{ 
                conn.release();               
                const result = return_error(409,'Acceso denegado: no hay permisos suficientes');
                res.status(409).json(result)
            }
        } 
        catch (error) {
            conn.release();
            const result = return_error(500,'Internal server error');
            res.status(500).json(result) 
        }

    })
    
    
}
module.exports = {
    check_rol
}