const { verify_token } = require('../helpers/generate_token')
const return_error = require('../helpers/return_error.js');
//require('dotenv').config({ path: 'backend/.env' });

const check_token = async (req, res, next) => {
    try {
        const token = req.headers.authorization
        //tokent = token.split(' ').pop()
        //console.log(token)
        const token_data = await verify_token(token)
        //console.log(token_data)
        if ((token_data) && (token_data !== "Token has expired")) {
            next()
        }
        else {

            if (token_data === "Token has expired") {
                
                const result = return_error(401, `La sesión ha expirado, reinice la sesión`);
                res.status(401).json(result)

            }
            else {

                const result = return_error(403, 'No realizado: Acceso denegado');
                res.status(403).json(result)
            }

        }

    } catch (error) {
        const result = return_error(500, 'Internal server error');
        res.status(500).json(result)
        console.log(error)
    }
}
/* const prueba = async()=>{
    console.log(process.env.JWT_SECRET)
const token_data = await verify_token("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZF91c2VyIjoxLCJyb2wiOiJBZG1pbmlzdHJhZG9yIiwiaWF0IjoxNzE1MDQyNzEzLCJleHAiOjE3MTUwNDk5MTN9.hOQyiTjEguFLLrCBPmd4gCszAiVKfyg2XNIW2klwsL8")
console.log(token_data)
if (token_data) {
    console.log("PASA")
}

}

prueba()
 */

module.exports = {
    check_token
}