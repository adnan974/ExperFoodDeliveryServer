const AuthRouter = require("express").Router();
const jwt = require('jsonwebtoken');
const config = require('../../../config');
const { UserRepository } = require("../../repositories/");
const bcrypt = require('bcrypt');
const { body, validationResult } = require('express-validator');


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
        body('_email').not().isEmpty(),
        body('_password').not().isEmpty(),

        async (req, res) => {

            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const email = req.body._email.toLocaleLowerCase();   
            const password = req.body._password;
            const user = await UserRepository.findOne({ _email : email })

            const areEquals = user ? await bcrypt.compare(password, user._password) : false;

            if (user && areEquals) {
                delete user._password;
                const token = jwt.sign({ iss: "http://localhost:5000", email: user._email }, config.secret, { expiresIn: '1h' });
                res.json({ success: true, data: user, token });

            } else {
                res.json({ success: false, message: "invalid credentials" });
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
        body('_email').isEmail(),
        body('_password').isLength({ min: 8 }),
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