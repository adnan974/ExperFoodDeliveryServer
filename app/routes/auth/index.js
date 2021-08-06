const AuthRouter = require("express").Router();
const { UserRepository } = require("../../repositories/");
const bcrypt = require('bcrypt');
const { body, validationResult } = require('express-validator');
const jwtModule = require('../../jwt-module');
const { OAuth2Client } = require('google-auth-library');
const Role = require('../../models/role');
const {googleAuth} = require('../../../config.json')


AuthRouter.route("/login")

    /**
     * Allows a user to authenticate with credentials
     * @group Auth - authentification
     * @route POST /login
     * @param {UserLoginDto.model} user.body.required  Admin Credentials: email: admin@admin.fr  password: administrateur
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
            const user = await UserRepository.findOne({ email: email })

            const areEquals = user ? await bcrypt.compare(password, user.password) : false;

            if (user && areEquals) {
                delete user.password;
                const token = jwtModule.createJwt(user)
                res.json({ success: true, message: "Login ok", data: { user, token } });

            } else {
                res.json({ success: false, message: "Invalid credentials" });
            }

        })

AuthRouter.route("/register")

    /**
     * Allows a user to register
     * @group Auth - authentification
     * @param {UserRegisterDto.model} user.body.required 
     * @route POST /register 
     * @returns {object} 201 - An object with created user info
     * @returns {Error}  default - Unexpected error
     * @produces application/json
     * @consumes application/json
     */
    .post(
        body('lastname').not().isEmpty(),
        body('firstname').not().isEmpty(),
        body('role').not().isEmpty(),
        body('email').isEmail(),
        body('password').isLength({ min: 8 }),
        body('address').not().isEmpty(),
        body('CP').not().isEmpty(),
        body('city').not().isEmpty(),
        body('phone').not().isEmpty(),
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

AuthRouter.route('/google-auth')
    .post(async (req, res) => {

        const token = req.body.google_id_token;
        const client = new OAuth2Client(googleAuth.clientId);
        
        client.verifyIdToken({
            idToken: token,
            audience: googleAuth.clientId, 
        }).then(async (googleData)=>{

            let user = await UserRepository.findOne({ email: googleData.payload.email })            
            if (!user){
                                
               user= await UserRepository.create({
                   avatar: googleData.payload.picture,
                    firstname: googleData.payload.given_name,
                    lastname: googleData.payload.family_name,
                    email: googleData.payload.email,
                    role: Role.Customer
                })
            }
            const token = jwtModule.createJwt(user)
            res.json({ success: true, message: "Login ok", data: { user, token } });       
        })
        .catch((error)=>{
            console.error(error)            
            res.json({ success: false, message: "Login failed", error: error });
        })        
    })

module.exports = AuthRouter;