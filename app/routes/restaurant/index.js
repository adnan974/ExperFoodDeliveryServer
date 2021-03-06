const RestaurantRouter = require("express").Router();
const { RestaurantRepository } = require("../../repositories/");
const { authJwtCheck } = require('../../middlewares/auth-jwt-check');
const authorize = require('../../middlewares/auth-role-check');
const { body, validationResult } = require('express-validator');
const Role = require('../../models/role');
const multer = require('multer');
const path = require('path');
const { host } = require('../../../config.json')


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const path = `tmp/${req.user.id}`;
        fs.mkdirSync(path, { recursive: true });
        cb(null, path)

    }
})
const upload = multer({ storage: storage });
var fs = require('fs');
const { resolve } = require("path");


RestaurantRouter.route("/")

    /**
     * Gives a list of restaurants
     * @group Restaurant - restaurants
     * @route GET /restaurants
     * @produces application/json
     * @consumes application/json
     * @returns {object} 200 - An object with a list of restaurants
     * @returns {Error}  default - Unexpected error
     */
    .get((req, res) => {
        RestaurantRepository.getAll(req.query.owner | null)
            .then((response) => {
                res.json({ success: true, data: response })
            })
            .catch((err) => {
                console.error(err)
                res.status(500).json({ success: false, message: err })
            })
    })

    /**
     * Allows to create a new restaurant
     * @group Restaurant - restaurants
     * @route POST /restaurants
     * @param {RestaurantCreateDto.model} restaurant.body.required 
     * @produces application/json
     * @consumes application/json
     * @returns {object} 200 - An object with a list of restaurants
     * @returns {Error}  default - Unexpected error
     * @security JWT
     */
    .post(
        authJwtCheck,
        authorize([Role.Restorer, Role.Admin]),
        upload.array('image', 3),
        body('name').not().isEmpty(),
        body('description').not().isEmpty(),
        body('address').not().isEmpty(),
        body('city').not().isEmpty(),
        body('cp').not().isEmpty(),
        (req, res) => {          
            if (req.body) {
                const errors = validationResult(req);
                if (!errors.isEmpty()) {
                    return res.status(400).json({ errors: errors.array() });
                };
                let createdRestaurant = null;
                let destinationPath = null;
                RestaurantRepository.create(req.body, req.user.id, req.files)
                    .then((restaurant) => {
                        createdRestaurant = restaurant;
                        destinationPath = `images/restaurants/${restaurant._id}`;
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
                            return RestaurantRepository.update(createdRestaurant._id, { mainPhotoUrl });
                        } else {
                            return null;
                        }
                    })
                    .then((response) => {
                        res.status(201).json({ success: true, data: response, message: 'Restaurant created' })
                    })
                    .catch((error) => {
                        console.error(error)
                        switch (error.code) {
                            case 11000:
                                res.status(500).json({ success: false, error: error, message: `Le champs ${Object.keys(error.keyPattern)[0]} est d??j?? utilis??` })
                                break;
                            default:
                                res.status(500).json({ success: false, error: error })
                        }
                    });
            }
        })

RestaurantRouter.route('/:id')

    /**
     * Gives the requested restaurant
     * @group Restaurant - restaurants
     * @route GET /restaurants/{id}  
     * @param {string} id.path.required - restaurant's id   
     * @produces application/json
     * @consumes application/json
     * @returns {object} 200 - An object with the requested restaurant
     * @returns {Error}  default - Unexpected error
     */
    .get((req, res) => {
        RestaurantRepository.getOne(req.params.id)
            .then((response) => {

                let folderPath = `images/restaurants/${response._id}/`;
                let arrayImages = fs.readdirSync(`public/${folderPath}`, async (err, files) => {
                    if (err) {
                        console.error(err);
                    }
                })
                arrayImages = arrayImages.map((image) => { return `${host}/${folderPath}/${image}` });

                let data = {
                    _id: response._id,
                    name: response.name,
                    description: response.description,
                    address: response.address,
                    menus: response.menu,
                    owner: response.owner,
                    menus: response.menus,
                    mainPhotoUrl: response.mainPhotoUrl,
                    photosUrls: arrayImages
                }

                res.json({ success: true, data: data })
            })
            .catch((error) => {
                console.error(error)
            })
    })

    /**
     * Allows to update an existing restaurant
     * @group Restaurant - restaurants
     * @route PATCH /restaurants/{id}
     * @param {string} id.path.required - restaurant id
     * @param {Restaurant.model} restaurant.body.required 
     * @produces application/json
     * @consumes application/json
     * @returns {object} 200 - An object with user a the updated restaurants
     * @returns {Error}  default - Unexpected error
     * @security JWT
     */
    .patch(authJwtCheck, authorize([Role.Restorer, Role.Admin]), (req, res) => {
        RestaurantRepository
            .update(req.params.id, req.body)
            .then(response => {
                res.json({ success: true, message: response })
            })
            .catch((err) => {
                console.error(err)
                res.json({ success: false, message: err })
            })
    })

    /**
     * Delete a restaurant
     * @group Restaurant - restaurants
     * @route DELETE /restaurants/{id}
     * @param {string} id.path.required - restaurant id   
     * @produces application/json
     * @consumes application/json
     * @returns {object} 200 - An object with informations about the deleted restaurant
     * @returns {Error}  default - Unexpected error
     * @security JWT
     */
    .delete(authJwtCheck, authorize([Role.Restorer, Role.Admin]), (req, res) => {
        RestaurantRepository
            .delete(req.params.id)
            .then(response => {
                res.json({ success: true, message: response })
            })
            .catch((err) => {
                console.error(err)
                res.json({ success: false, message: err })
            })
    })


RestaurantRouter.use("/:restaurantId/menus", require("./menu"));
module.exports = RestaurantRouter;