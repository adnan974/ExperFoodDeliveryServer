const RestaurantRouter = require("express").Router();
const { RestaurantRepository, MenuRepository } = require("../../repositories/");
const {authJwtCheck} = require('../../middlewares/auth-jwt-check')


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

        RestaurantRepository.getAll()
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
    .post(authJwtCheck,(req, res) => {
        if (req.body) {
            RestaurantRepository.create(req.body)
                .then((response) => {
                    res.status(201).json({ success: true, message: response })
                })
                .catch((err) => {
                    console.error(err)
                    res.json({ success: false, message: err })
                })
        }
    })

RestaurantRouter
    .route('/:id')

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
    .patch((req, res) => {
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
     * @returns {object} 200 - An object with informations aout the deleted restaurant
     * @returns {Error}  default - Unexpected error
     */
    .delete((req, res) => {        
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


RestaurantRouter
    .route('/:id/menus')

    /**
     * Gives a list of restaurant's menus 
     * @group Restaurant - restaurants
     * @route GET /restaurants/{id}/menus
     * @param {string} id.path.required - restaurant id
     * @produces application/json
     * @consumes application/json
     * @returns {object} 200 - An object with a list of restaurant's menus
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

RestaurantRouter
    .route('/:restaurantId/menus/:menuId')
    .get((req, res) => {
        MenuRepository.getOne(req.params.menuId)
            .then(response => {
                res.json({ succes: true, message: response });
            })
            .catch(error => {
                res.status(500).send({ success: false, message: error });
            });
    })
    .post((req, res) => {

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
    .patch((req, res) => {

        MenuRepository.update(req.params.menuId, req.body)
            .then(response => {
                res.json({ succes: true, message: response });
            })
            .catch(error => {
                res.status(500).send({ success: false, message: error });
            });
    })
    .delete((req, res) => {
        MenuRepository.delete(req.params.menuId)
            .then(response => {
                res.json({ succes: true, message: response });
            })
            .catch(error => {
                res.status(500).send({ success: false, message: error });
            });
    })

module.exports = RestaurantRouter;