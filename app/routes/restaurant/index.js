const RestaurantRouter = require("express").Router();
const { RestaurantRepository } = require("../../repositories/");
const { authJwtCheck } = require('../../middlewares/auth-jwt-check');
const authorize = require('../../middlewares/auth-role-check');
const { body, validationResult } = require('express-validator');
const Role = require('../../models/role');


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
        RestaurantRepository.getAll(req.query.owner)
            .then((response) => {               
                res.json({ success: true, data: response })
            })
            .catch((err) => {           
                console.error(err)
                res.json({ success: false, message: err })
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
     */
    .post(
        authJwtCheck,
        authorize([Role.Restorer, Role.Admin]),
        body('name').not().isEmpty(),
        body('description').not().isEmpty(),
        body('address').not().isEmpty(),
        (req, res) => {
            if (req.body) {
                const errors = validationResult(req);
                if (!errors.isEmpty()) {
                    return res.status(400).json({ errors: errors.array() });
                };
                RestaurantRepository.create(req.body, req.user.id)
                    .then((response) => {
                        res.status(201).json({ success: true, data: response, message: 'Restaurant created' })
                    })
                    .catch((err) => {
                        console.error(err)
                        res.json({ success: false, message: err })
                    })
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
                res.json({ success: true, data: response })
            })
            .catch((err) => {
                console.error(err)
                res.json({ success: false, message: err })
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