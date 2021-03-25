const AuthRouter = require("express").Router();
const jwt = require('jsonwebtoken');
const config = require('../../../config');

const userTest = {
    id:1, firstname : 'John', 
    lastname:'DOE',
    email:'test@email.com', 
    password : '1234', 
    address:'124 allée des cocos', 
    cp:'97450', 
    city:'Saint-Louis'
};


AuthRouter.route("/login")
    .post((req, res) => {
        if (req.body && req.body.email && req.body.password) {
            const email = req.body.email.toLocaleLowerCase();
            const password = req.body.password;
    
            if (userTest.email === email && userTest.password === password) {
                
                delete req.body.password;
                const token = jwt.sign({ iss: 'http://localhost:5000', role: 'customer' }, config.secret);
                res.json({ success: true, data: userTest, token });
    
            } else {
                res.json({ success: false, message: "invalid credentials" });
            }
        } else {
            res.json({ success: true, message: 'missing datas' })
        }     
    })

module.exports = AuthRouter;