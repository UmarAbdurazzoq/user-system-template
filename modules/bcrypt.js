const bcrypt = require ('bcrypt');

async function generateCrypt (data) {
    return bcrypt.hash(data, await bcrypt.genSalt(10));
}

async function compareCrypt (data, crypt) {
    return bcrypt.compare(data, crypt)
}

module.exports = {
generateCrypt, compareCrypt
}