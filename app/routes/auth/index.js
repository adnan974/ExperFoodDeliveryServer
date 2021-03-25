const AuthRouter = require("express").Router();
const jwt = require('jsonwebtoken');
const config = require('../../../config');
const { UserRepository } = require("../../repositories/");
const bcrypt = require('bcrypt');
const { body, validationResult } = require('express-validator');


AuthRouter.route("/login")
    .post(
        body('email').not().isEmpty(),
        body('password').not().isEmpty(),

        async (req, res) => {

            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const email = req.body.email.toLocaleLowerCase();
            const password = req.body.password;
            const user = await UserRepository.findOne({ email })
            const areEquals = user ? await bcrypt.compare(password, user.password) : false;

            if (user && areEquals) {
                delete user.password;
                const token = jwt.sign({ iss: 'http://localhost:5000', role: user.role }, config.secret);
                res.json({ success: true, data: user, token });

            } else {
                res.json({ success: false, message: "invalid credentials" });
            }

        })

AuthRouter.route("/register")
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
                    res.status(201);
                    res.json({ success: true, message: response })
                })
                .catch((err) => {
                    console.error(err)
                    res.json({ success: false, message: err })
                })
        })


module.exports = AuthRouter;