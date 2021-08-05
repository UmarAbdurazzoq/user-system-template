const { Sequelize, Op } = require("sequelize");
const { generateCrypt } = require("../modules/bcrypt")
const { PG_URL, PASSWORD, FIRSTNAME, LASTNAME, PHONE } = require("../config");
const {
    SessionModel,
    UserModels,
} = require("../models/model");

const sequelize = new Sequelize(PG_URL, {
    logging: false,
});

module.exports = async () => { 
    try {
        const db = {};

        db.users = await UserModels(Sequelize, sequelize);
        db.sessions = await SessionModel(Sequelize, sequelize);

        await db.users.hasMany(db.sessions, {
            foreignKey: {
                name: "user_id",
                allowNull: false,
            },
        });

        await db.sessions.belongsTo(db.users, {
            foreignKey: { 
                name: "user_id",
                allowNull: false,
            },
        });

        let admin = await db.users.findOne({where: {role: 'super-admin'}});
        if(!(admin)){
            await db.users.create({
                first_name: FIRSTNAME,
                last_name: LASTNAME,
                phone_number: PHONE,
                password: await generateCrypt(PASSWORD),
                role: "super-admin" 
            })
        } 
 
        await sequelize.sync({force: false});      
        return db;  

    } catch (error) {
        console.log(error);
    }
}; 
  