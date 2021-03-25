module.exports = (router) => {    
    router.use("/", require("./auth"));
    router.use("/users", require("./user"));
    router.use("/restaurants", require("./restaurant"));
    // router.use("/menus", require("./menu"));
}