const bcrypt = require('bcrypt');
const { response } = require('express');

module.exports = (mongoose) => {   

    const User = require("../models/user")(mongoose)

    let UserRepository = class {

        static getAll() {
            return User.find();
        }

        static findById(id) {
            return User.findById(id);
        }

        static findOne(params) {
            return User.findOne(params);
        }
    
        static async create(userData) {
            
            if(userData.password){
                userData.password =  await bcrypt.hash(userData.password, 10);
            }           
    
            let user = new User({
            avatar: userData.avatar,
            firstname : userData.firstname,
            lastname : userData.lastname,
            email : userData.email,
            password : userData.password,
            role : userData.role,
            address : userData.address,
            CP : userData.CP,
            phone : userData.phone
            }); 

            return user.save();
        }

        static async addRestaurantToUser(userId, restaurantId) {

            return User.findOneAndUpdate({_id: userId},  {$push: {restaurants: restaurantId}}, { new: true })
        }

        static async update(userId, userToUpdate) {
            return User.findOneAndUpdate(
                {_id: userId},
                userToUpdate)            
        }

        static getAllUserMenus(id){
            return User.findOne({_id:id}).populate({
                path:"restaurants",
                populate : {
                    path:"menus"
                }
            }).then((userWithRestaurantsWithMenus)=>{  
                return userWithRestaurantsWithMenus.restaurants.reduce((acc,restaurant)=>{
                    return [...acc,...restaurant.menus]
                },[])                
            }) 
               
          
        }
    
    }

    return UserRepository
}

