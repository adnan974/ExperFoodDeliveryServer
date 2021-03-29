const MenuRouter = require("express").Router();
const { MenuRepository } = require("../../repositories/");

MenuRouter
.route('/')

/**
 * Gives a list of users
 * @group Menu - menu 
 * @route GET /menus 
 * @returns {object} 201 - An object with a list of menus
 * @returns {Error}  default - Unexpected error
 * @produces application/json
 * @consumes application/json
 */
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
