const AuthRouter = require("express").Router();
const { UserRepository } = require("../../repositories/");
const bcrypt = require('bcrypt');
const { body, validationResult } = require('express-validator');
const jwtModule = require('../../jwt-module')


AuthRouter.route("/login")

/**
 * Function that allows a user to authenticate
 * @group Auth - authentification
 * @route POST /login
 * @param {UserLoginDto.model} user.body.required 
 * @produces application/json
 * @consumes application/json
 * @returns {object} 200 - An object with user info and JWT
 * @returns {Error}  default - Unexpected error
 */
    .post(
        body('email').not().isEmpty(),
        body('password').not().isEmpty(),

        async (req, res) => {         

            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const email = req.body.email?.toLocaleLowerCase();   
            const password = req.body.password;
            const user = await UserRepository.findOne({ email : email })

            const areEquals = user ? await bcrypt.compare(password, user.password) : false;

            if (user && areEquals) {
                delete user.password;                
                const token = jwtModule.createJwt(user)
                res.json({ success: true, message:"Login ok", data: {user, token} });

            } else {
                res.json({ success: false, message: "Invalid credentials" });
            }

        })

AuthRouter.route("/register")

/**
 * Function that allows a user to register
 * @group Auth - authentification
 * @param {UserRegisterDto.model} user.body.required 
 * @route POST /register 
 * @returns {object} 201 - An object with created user info
 * @returns {Error}  default - Unexpected error
 * @produces application/json
 * @consumes application/json
 */
    .post(
        body('email').isEmail(),
        body('password').isLength({ min: 8 }),
        (req, res) => {           

            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            UserRepository.create(req.body)
                .then((response) => {
                    res.status(201).json({ success: true, message: "User created", data: response })
                })
                .catch((err) => {
                    console.error(err)
                    res.json({ success: false, message: err })
                })
        })

module.exports = AuthRouter;