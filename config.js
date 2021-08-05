const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const { env } = process;

module.exports = {
    PORT: env.PORT,
    PG_URL: env.PG_URL,
    SECRET_WORD: env.SECRET_WORD,
    PASSWORD: env.PASSWORD,
    FIRSTNAME: env.FIRSTNAME,
    LASTNAME: env.LASTNAME,
    PHONE: env.PHONE,
}; 