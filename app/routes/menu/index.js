const MenuRouter = require("express").Router();
const { MenuRepository } = require("../../repositories/");

MenuRouter.route('/')

/**
 * Gives a list of all menus
 * @group Menu - menu 
 * @route GET /menus 
 * @returns {object} 200 - An object with a list of menus
 * @returns {Error}  default - Unexpected error
 * @produces application/json
 * @consumes application/json
 */
.get((req,res)=>{
    console.log('on arrive bien a menu route')
    MenuRepository.getAll()
    .then(response=>{
        res.json({ success: true, data: response })
    })
    .catch(err=>{
        console.error(err)
        return res.status(500).send(err)
    })
})

MenuRouter.route('/:id')

/**
 * Gives an object whith the requested menu
 * @group Menu - menu 
 * @route GET /menus/{id}
 * @param {string} id.path.required - menu id 
 * @returns {object} 200 - An object with the requested menu
 * @returns {Error}  default - Unexpected error
 * @produces application/json
 * @consumes application/json
 */
 .get((req,res)=>{    
    MenuRepository.getOne(req.params.id)
    .then(response=>{
        res.json({ success: true, data: response })
    })
    .catch(err=>{
        console.error(err)
        return res.status(500).send(err)
    })
})

module.exports = MenuRouter;
