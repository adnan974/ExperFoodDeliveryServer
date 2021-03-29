const MainRouter = require("express").Router();


MainRouter.use("/", require("./auth"));
MainRouter.use("/users", require("./user"));
MainRouter.use("/restaurants", require("./restaurant"));
MainRouter.use("/menus", require("./menu"));

module.exports = MainRouter;