const RestaurantRouter = require("express").Router();
const { RestaurantRepository, MenuRepository} = require("../../repositories/");


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
                res.status(201).json({ success: true, message: response })
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


RestaurantRouter
.route('/:id/menus')
.post((req,res)=>{
    MenuRepository.create(req.body)
        .then(response => {
            RestaurantRepository.addMenuToRestaurant(req.params.id, response);
        })
        .then(response => {
            res.status(201).json({ succes: true, message: response });
        })
        .catch(error => {
            res.status(500).send({ success: false, message: error });
        })
    
})

RestaurantRouter
.route('/:restaurantId/menus/:menuId')
.get((req,res)=>{
    MenuRepository.getOne(req.params.menuId)
        .then(response => {
            res.json({ succes: true, message: response });
        })
        .catch(error => {
            res.status(500).send({ success: false, message: error });
        });
})
.post( (req,res)=>{

    MenuRepository.getOne(req.params.menuId)
        .then(response => {
            RestaurantRepository.addMenuToRestaurant(req.params.restaurantId, response)
        })
        .then(response => {
            res.status(201).json({ succes: true, message: response });
        })
        .catch(error => {
            res.status(500).send({ success: false, message: error });
        })
    
    

})
.patch((req,res)=>{
    
    MenuRepository.update(req.params.menuId,req.body)
        .then(response => {
            res.json({ succes: true, message: response });
        })
        .catch(error => {
            res.status(500).send({ success: false, message: error });
        });
})
.delete((req,res)=>{
    MenuRepository.delete(req.params.menuId)
        .then(response => {
            res.json({ succes: true, message: response });
        })
        .catch(error => {
            res.status(500).send({ success: false, message: error });
        });
})

module.exports = RestaurantRouter;