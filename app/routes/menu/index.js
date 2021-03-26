const MenuRouter = require("express").Router();
const { MenuRepository } = require("../../repositories/");

MenuRouter
.route('/')
.get((req,res)=>{
    MenuRepository
    .getAll()
    .then(response=>{
        return res.json(response);
    })
    .catch(err=>{
        return res.status(500).send(err)
    })
})

module.exports = MenuRouter;
