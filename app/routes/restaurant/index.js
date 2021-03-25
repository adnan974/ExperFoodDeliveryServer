const RestaurantRouter = require("express").Router();
const {RestaurantRepository} = require("../../repositories/");


RestaurantRouter.route("/")

    .get((req, res) => {

        RestaurantRepository.getAll()
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

            RestaurantRepository.create(req.body)
            .then((response)=>{              
                res.json({ success: true, message: response })
            })
            .catch((err)=>{
                console.error(err)
                res.json({ success: false, message: err })
            })
        } 
    })

RestaurantRouter
.route('/:id')
.patch((req,res) => {
    RestaurantRepository
    .update(req.params.id,req.body)
    .then(response => {
         res.json({ success: true, message: response })
    })
    .catch((err) => {
         console.error(err)
         res.json({ success: false, message: err })
    })
})
.delete((req,res) => {
    console.log(req.params.id)
    RestaurantRepository
    .delete(req.params.id)
    .then(response=>{
        res.json({success:true,message:response})
    })
    .catch((err) => {
        console.error(err)
        res.json({ success: false, message: err })
    })
})

module.exports = RestaurantRouter;