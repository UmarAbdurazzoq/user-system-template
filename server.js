const express = require("express");
const path = require("path");
const fs = require("fs");
const cors = require("cors");
const { PORT } = require("./config");
const db = require("./modules/postgres");
const app = express();

app.listen(PORT, _ => console.log(PORT));

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(async (req, _, next) => {
    const psql = await db();
    req.psql = await psql;
    next()
})

fs.readdir(path.join(__dirname, "routes"), (err, files) => {
    if (files) {
        files.forEach((file) => {
            const Route = require(path.join(__dirname, "routes", file));
            if (Route.path && Route.router) app.use(Route.path, Route.router);
        });
    }
    console.log("ROUTER ERROR::",err);
});