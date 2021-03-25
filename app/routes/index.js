module.exports = (router) => {    
    router.use("/auth", require("./auth"));
    router.use("/users", require("./user"));
    router.use("/restaurants", require("./restaurant"));
    // router.use("/menus", require("./menu"));
}