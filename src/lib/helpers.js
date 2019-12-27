const helpers = {};
const bcrypt = require('bcryptjs');


helpers.encryptPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);     // se generara 10 veces (lo mas comun)
    const hash = await bcrypt.hash(password, salt);
    return hash;
};

helpers.descryptPassword = async (password, savePassword) => {
    try {
       return await bcrypt.compare(password, savePassword);
    }catch (e){
        console.log(e);
    }
}

module.exports =helpers;