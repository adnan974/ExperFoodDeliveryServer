const AuthRouter = require("express").Router();
const jwt = require('jsonwebtoken');
const config = require('../../../config');
const { UserRepository } = require("../../repositories/");
const bcrypt = require('bcrypt');
const { body, validationResult } = require('express-validator');


AuthRouter.route("/login")
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
                const token = jwt.sign({ iss: 'http://localhost:5000', role: user._role }, config.secret);
                res.json({ success: true, data: user, token });

            } else {
                res.json({ success: false, message: "invalid credentials" });
            }

        })

AuthRouter.route("/register")
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
                    res.status(201);
                    res.json({ success: true, message: response })
                })
                .catch((err) => {
                    console.error(err)
                    res.json({ success: false, message: err })
                })
        })

module.exports = AuthRouter;