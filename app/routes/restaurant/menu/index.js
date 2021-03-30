const MenuRouter = require("express").Router();
const { RestaurantRepository, MenuRepository } = require("../../../repositories/");
const {authJwtCheck} = require('../../../middlewares/auth-jwt-check');
const authorize = require('../../../middlewares/auth-role-check');
const Role = require('../../../models/role');


MenuRouter.route('/')

    /**
     * Gives a list of restaurant's menus 
     * @group Restaurant - restaurants
     * @route GET /restaurants/{restaurantId}/menus
     * @param {string} restaurantId.path.required - restaurant id
     * @produces application/json
     * @consumes application/json
     * @returns {object} 200 - An object with a list of restaurant's menus
     * @returns {Error}  default - Unexpected error
     */
     .get((req, res) => {
        MenuRepository.create(req.body)
            .then(response => {
                RestaurantRepository.getAll(req.params.id, response);
            })
            .then(response => {
                res.status(201).json({ succes: true, message: response });
            })
            .catch(error => {
                res.status(500).send({ success: false, message: error });
            })

    })



    /**
     * Allows to create a new restaurant's menu 
     * @group Restaurant - restaurants
     * @route POST /restaurants/{restaurantId}/menus
     * @param {string} restaurantId.path.required - restaurant id
     * @param {Menu.model} restaurant.body.required 
     * @produces application/json
     * @consumes application/json
     * @returns {object} 200 - An object with the created restaurant's menu
     * @returns {Error}  default - Unexpected error
     */
    .post((req, res) => {
        MenuRepository.create(req.body)
            .then(response => {
                RestaurantRepository.addMenuToRestaurant(req.params.id, response);
            })
            .then(response => {
                res.status(201).json({ succes: true, message: response });
            })
            .catch(error => {
                res.status(500).send({ success: false, message: error });
            })

    })

    MenuRouter.route('/:menuId')
    .get((req, res) => {
        MenuRepository.getOne(req.params.menuId)
            .then(response => {
                res.json({ succes: true, message: response });
            })
            .catch(error => {
                res.status(500).send({ success: false, message: error });
            });
    })
    .post(authJwtCheck, authorize,(req, res) => {

        MenuRepository.getOne(req.params.menuId)
            .then(response => {
                RestaurantRepository.addMenuToRestaurant(req.params.restaurantId, response)
            })
            .then(response => {
                res.status(201).json({ succes: true, message: response });
            })
            .catch(error => {
                res.status(500).send({ success: false, message: error });
            })

    })
    .patch(authJwtCheck, authorize,(req, res) => {

        MenuRepository.update(req.params.menuId, req.body)
            .then(response => {
                res.json({ succes: true, message: response });
            })
            .catch(error => {
                res.status(500).send({ success: false, message: error });
            });
    })
    .delete(authJwtCheck, authorize,(req, res) => {
        MenuRepository.delete(req.params.menuId)
            .then(response => {
                res.json({ succes: true, message: "Menu deleted", data:response });
            })
            .catch(error => {
                res.status(500).send({ success: false, message: error });
            });
    })

module.exports = MenuRouter;