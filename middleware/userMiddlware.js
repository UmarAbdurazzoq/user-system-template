const { verifyToken } = require("../modules/jwt");

module.exports = async (req, res, next) => {
  try {
    const { sessions } = await req.psql 
    const { session_id } = await verifyToken(req.headers.token)

    const session = session_id ? await sessions.findOne({where:{id: session_id}}) : undefined

    if (!session || !session.dataValues.user_agent) {
      throw new Error("sesssion not founded")
    }

    if (session.dataValues.role !== 'super-admin' && (req.url === '/users/create' || req.url === "/session")) {
      throw new Error("permission denied")
    } 

    next()
  } catch (e) { 
    res.status(400).json({
      ok: false,
      message: e + "",
    });
  }
}