const jwt = require ('jsonwebtoken');

const token_sign = async (user, rol) =>{
    return jwt.sign(
        {
        id: user,
        rol: rol
        },
            process.env.JWT_SECRET,
        {
            expiresIn: "2h"
        }
    )
}
const verify_token = async (token) =>{
    try{
    return jwt.verify(token, process.env.JWT_SECRET)
    }
    catch(error){
        return null;
    }
}
const decode_sign = async (token) =>{
    
}


module.exports = {
    token_sign,
    verify_token,
    decode_sign
}