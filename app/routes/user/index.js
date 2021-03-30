const UserRouter = require("express").Router();
const {UserRepository} = require("../../repositories/");


UserRouter.route("/")

/**
 * Gives a list of users
 * @group User - user 
 * @route GET /users 
 * @returns {object} 201 - An object with a list of users
 * @returns {Error}  default - Unexpected error
 * @produces application/json
 * @consumes application/json
 */
    .get((req, res) => {
        UserRepository.getAll()
        .then((response)=>{            
            res.json({ success: true, data: response })
        })
        .catch((err)=>{  
            console.error(err)          
            res.json({ success: false, message: err })
        })
    })

/**
 * Allows to create a user
 * @group User - user 
 * @route POST /users
 * @param {UserRegisterDto.model} user.body.required  
 * @returns {object} 201 - An object with a list of users
 * @returns {Error}  default - Unexpected error
 * @produces application/json
 * @consumes application/json
 */
    .post((req, res) => {
        
        if (req.body) {

            UserRepository.create(req.body)
            .then((response)=>{              
                res.json({ success: true, message: response })
            })
            .catch((err)=>{
                console.error(err)
                res.json({ success: false, message: err })
            })
        } 
    })

UserRouter.route("/:id")
    /**
     * Gives the requested user
     * @group User - user 
     * @route GET /users/{id}
     * @param {string} id.path.required - user id
     * @returns {object} 201 - An object with the requested user
     * @returns {Error}  default - Unexpected error
     * @produces application/json
     * @consumes application/json
     */
    .get((req, res) => {
        UserRepository.findOne(req.params.id)
            .then((response) => {
                res.json({ success: true, data: response })
            })
            .catch((err) => {
                console.error(err)
                res.json({ success: false, message: err })
            })
    })

    /**
         * Allows to update an existing user
         * @group User - users
         * @route PATCH /users/{id}
         * @param {string} id.path.required - user id
         * @param {User.model} user.body.required 
         * @produces application/json
         * @consumes application/json
         * @returns {object} 200 - An object with user a the updated users
         * @returns {Error}  default - Unexpected error
         */
    .patch((req, res) => {
        UserRepository
            .update(req.params.id, req.body)
            .then(response => {
                res.json({ success: true, message: response })
            })
            .catch((err) => {
                console.error(err)
                res.json({ success: false, message: err })
            })
    })

module.exports = UserRouter;