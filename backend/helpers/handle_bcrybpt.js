const bcrypt = require('bcryptjs');

const encrypt = async(text) =>{
    const hash = await bcrypt.hash(text, 11);
    return hash;
}

const compare = async(text, textHash) => {
    return await bcrypt.compare(text, textHash);
}
/*
encrypt("").then(
    (hashh) =>{
        console.log(hashh)
    }
)*/

module.exports = {
    encrypt,
    compare
}

