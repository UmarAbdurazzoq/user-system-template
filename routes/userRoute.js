const router = require("express").Router();
const  usersController = require("../controllers/usersController");
const userMiddleware = require('../middleware/userMiddlware')

router.get("/", userMiddleware, usersController.GetAll);
router.put("/login", usersController.Login);
router.post("/create", userMiddleware, usersController.CreateUser);
router.delete("/session", userMiddleware, usersController.deleteSession);

module.exports = {
    path: "/users",
    router
}
 