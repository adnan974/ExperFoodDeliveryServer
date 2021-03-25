const UserRouter = require("express").Router();
const {UserRepository} = require("../../repositories/");


UserRouter.route("/")

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