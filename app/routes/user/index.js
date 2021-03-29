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

module.exports = UserRouter;