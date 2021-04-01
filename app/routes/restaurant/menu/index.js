const MenuRouter = require("express").Router({ mergeParams: true });
const { RestaurantRepository, MenuRepository } = require("../../../repositories/");
const { authJwtCheck } = require('../../../middlewares/auth-jwt-check');
const authorize = require('../../../middlewares/auth-role-check');
const { body, validationResult } = require('express-validator');
const Role = require('../../../models/role');


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
                return res.json(response);
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
        body('name').not().isEmpty(),
        body('description').not().isEmpty(),
        body('price').not().isEmpty(),
        (req, res) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            };

            MenuRepository.create(req.body, req.params.restaurantId)
                .then(response => {
                    res.status(201).json({ succes: true, data: response });
                })
                .catch(error => {
                    console.error(error);
                    res.status(500).send({ success: false, message: error });
                })

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