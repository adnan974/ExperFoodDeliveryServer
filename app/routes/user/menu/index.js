const MenuRouter = require("express").Router({ mergeParams: true });
const { MenuRepository , UserRepository} = require("../../../repositories/");


MenuRouter.route('/')

    /**
     * Gives a list of restaurant's menus for a user
     * @group User / Menu - user / menu  
     * @route GET /users/{id}/menus
     * @param {string} id.path.required - restaurant id 
     * @returns {object} 200 - An object with a list of menus
     * @returns {Error}  default - Unexpected error
     * @produces application/json
     * @consumes application/json
     */
    .get(async (req, res) => {        
        return await UserRepository.getAllUserMenus(req.params.id)
            .then(response => {             
                return res.json({ success: true, data: response });
            })
            .catch(err => {
                console.error(err)
                return res.status(500).send(err)
            })
    })

module.exports = MenuRouter;