const MenuRouter = require("express").Router({ mergeParams: true });
const { RestaurantRepository, MenuRepository } = require("../../../repositories/");
const { authJwtCheck } = require('../../../middlewares/auth-jwt-check');
const authorize = require('../../../middlewares/auth-role-check');
const { body, validationResult } = require('express-validator');
const Role = require('../../../models/role');
const multer = require('multer');
const {host} = require('../../../../config.json');

const storage = multer.diskStorage({
    destination: (req,file,cb)=>{
        const path = `tmp/${req.user.id}`;
      fs.mkdirSync(path, { recursive: true });
        cb(null, path)
       
    }
})
const upload = multer({ storage : storage });
var fs = require('fs')


MenuRouter.route('/')

    /**
     * Gives a list of restaurant's menus
     * @group Restaurant / Menu - restaurant / menus  
     * @route GET /restaurants/{restaurantId}/menus
     * @param {string} restaurantId.path.required - restaurant id 
     * @returns {object} 200 - An object with a list of menus
     * @returns {Error}  default - Unexpected error
     * @produces application/json
     * @consumes application/json
     */
    .get((req, res) => {
        MenuRepository.getAllRestaurantMenu(req.params.restaurantId)
            .then(response => {
                return res.json({ succes: true, data: response });
            })
            .catch(err => {
                console.error(err)
                return res.status(500).send(err)
            })
    })

    /**
     * Allows to create a new restaurant's menu 
     * @group Restaurant / Menu - restaurant / menus 
     * @route POST /restaurants/{restaurantId}/menus
     * @param {string} restaurantId.path.required - restaurant id
     * @param {MenuCreateDto.model} menu.body.required 
     * @produces application/json
     * @consumes application/json
     * @returns {object} 200 - An object with the created restaurant's menu
     * @returns {Error}  default - Unexpected error
     */
    .post(
        authJwtCheck,
        authorize([Role.Restorer]),
        upload.array('image', 3),
        body('name').not().isEmpty(),
        body('description').not().isEmpty(),
        body('price').not().isEmpty(),
        (req, res) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            };

            // conversion du champ 'price' en type number (si la requête est un formData tous les champs sont de type string ou File)
            let data = req.body;
            data.price = +data.price;           
            let createdMenu = null;
            let destinationPath = null;
            MenuRepository.create(data, req.params.restaurantId)
                .then((menu) => {
                    createdMenu = menu;                   
                    destinationPath = `images/restaurants/${req.params.restaurantId}/menus/${createdMenu._id}`;
                    return fs.promises.mkdir(`public/${destinationPath}`, { recursive: true });
                })
                .then(() => {
                    return new Promise((resolve, reject) => {
                        if (req.files && req.files.length > 0) {
                            req.files.forEach((element, index) => {
                                fs.rename(`${element.path}`, `public/${destinationPath}/${element.originalname}`, (err) => {
                                    if (err) {
                                        reject(err)
                                    } else if (index === req.files.length - 1) {
                                        resolve()
                                    }
                                })
                            });

                        } else (resolve());

                    })
                })
                .then(() => {
                    return fs.promises.readdir(`public/${destinationPath}`);
                })
                .then((files) => {
                    if (files && files.length > 0) {
                        let mainPhotoUrl = `${host}/${destinationPath}/${files[0]}`;
                        return MenuRepository.update(createdMenu._id, { mainPhotoUrl });
                    } else {
                        return null;
                    }
                })
                .then((response) => {                  
                    res.status(201).json({ success: true, data: response, message: 'Menu created' })
                })
                .catch((error) => {
                    console.error(error)
                    switch (error.code) {
                        case 11000:
                            res.status(500).json({ success: false, error: error, message: `Le champs ${Object.keys(error.keyPattern)[0]} est déjà utilisé` })
                            break;
                        default:
                            res.status(500).json({ success: false, error: error })
                    }
                });
        })

MenuRouter.route('/:menuId')

    /**
     * Return the requested restaurant's menu
     * @group Restaurant / Menu - restaurant / menus  
     * @route GET /restaurants/{restaurantId}/menus/{menuId}
     * @param {string} restaurantId.path.required - restaurant id 
     * @param {string} menuId.path.required - menu id 
     * @returns {object} 200 - An object with the requested menu menus
     * @returns {Error}  default - Unexpected error
     * @produces application/json
     * @consumes application/json
     */
    .get((req, res) => {
        MenuRepository.getOne(req.params.menuId)
            .then(response => {
                res.json({ succes: true, data: response });
            })
            .catch(error => {
                res.status(500).send({ success: false, message: error });
            });
    })

    /**
     * Alows to update a restaurant's menu
     * @group Restaurant / Menu - restaurant / menus 
     * @route PATCH /restaurants/{restaurantId}/menus/{menuId}
     * @param {string} restaurantId.path.required - restaurant id 
     * @param {string} menuId.path.required - menu id 
     * @param {MenuCreateDto.model} menu.body.required 
     * @returns {object} 200 - An object with the requested menu 
     * @returns {Error}  default - Unexpected error
     * @produces application/json
     * @consumes application/json
     */
    .patch(
        authJwtCheck,
        authorize([Role.Restorer, Role.Admin]),
        (req, res) => {
            MenuRepository.update(req.params.menuId, req.body)
                .then(response => {
                    res.json({ succes: true, message: response });
                })
                .catch(error => {
                    res.status(500).send({ success: false, message: error });
                });
        })

    /**
     * Alows to delete a restaurant's menu
     * @group Restaurant / Menu - restaurant / menus 
     * @route DELETE /restaurants/{restaurantId}/menus/{menuId}
     * @param {string} restaurantId.path.required - restaurant id 
     * @param {string} menuId.path.required - menu id
     * @returns {object} 200 - An object with the deleted menu infos 
     * @returns {Error}  default - Unexpected error
     * @produces application/json
     * @consumes application/json
     */
    .delete(authJwtCheck, authorize([Role.Restorer, Role.Admin]), (req, res) => {
        MenuRepository.delete(req.params.menuId)
            .then(response => {
                res.json({ succes: true, message: "Menu deleted", data: response });
            })
            .catch(error => {
                res.status(500).send({ success: false, message: error });
            });
    })

module.exports = MenuRouter;