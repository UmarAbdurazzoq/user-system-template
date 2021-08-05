const { generateToken } = require("../modules/jwt");
const { compareCrypt, generateCrypt } = require("../modules/bcrypt")

module.exports = class UserController {

    static async GetAll(req, res) {
        try {
            const { users, sessions } = await req.psql;

            let allUsers = await users.findAll({include: sessions});
            allUsers = allUsers.map(user=> user.dataValues)

            res.status(200).json({
                ok: true,
                data: allUsers
            })
            
        } catch (e) {
            res.status(400).json({
                ok: false,
                message: e + "",
            });
        }
    }
  
    static async CreateUser(req, res) {
        try {
            const { users } = req.psql;
            const { firstName, lastName, phone, password, role } = req.body
            let user = await users.findOne({
                where: {
                    phone_number: phone,
                },
            });

            if (user && user.phone_number) {
                throw new Error("User has already been registered");
            }

            if (role) {
                user = await users.create({
                    first_name: firstName,
                    last_name: lastName,
                    phone_number: phone,
                    password: await generateCrypt(password),
                    role: role,
                });
                
            } else {
                user = await users.create({
                    first_name: firstName,
                    last_name: lastName,
                    phone_number: phone,
                    password: await generateCrypt(password),
                });
            }

            res.status(201).json({
                ok: true,
                message: "Registered",
                result: {
                    user: { ...user.dataValues },
                },
            });
        } catch (e) {
            res.status(400).json({
                ok: false,
                message: e + "",
            });
        }
    }

    static async Login(req, res) {
        try {
            const { users, sessions } = req.psql;

            const { password, phone } = req.body

            let user = await users.findOne({
                where: {
                    phone_number: phone,
                },
                raw: true,
            });
            
            if (!user || !await compareCrypt(password, user.password)) {
                throw new Error("User is not registered or invalid password");
            }

            const ipAddress = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
            const userAgent = req.headers["user-agent"];

            if (!(ipAddress && userAgent)) {
                throw new Error("Invalid device");
            }

            const session = await sessions.create({
                user_id: user.id,
                ip_address: ipAddress,
                user_agent: userAgent,
                role: user.role,
            });

            const token = generateToken({
                session_id: session.id,
            });

            res.status(200).json({
                ok: true,
                message: "Logged in",
                token: token,
            });
        } catch (e) {
            res.status(400).json({
                ok: false,
                message: e + "",
            });
        } 
    }

	static async deleteSession(req, res) {
		let { sessionId } = req.body
		await req.psql.sessions.destroy({where: {id: sessionId}});
		res.send({status: 201, message: 'deleted'})
	} 
};