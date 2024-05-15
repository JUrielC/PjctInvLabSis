const {verify_token} = require('./generate_token')

const id_user_token = async (token) =>{
    const token_data =  await verify_token(token)
    return  token_data.id_user
}


module.exports = 
    id_user_token
