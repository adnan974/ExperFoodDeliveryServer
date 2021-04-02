const bcrypt = require('bcrypt');

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

            userData.password =  await bcrypt.hash(userData.password, 10);
    
            let user = new User({
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

        static async update(id, userUpdated) {

            let user = await User.findById(id);
            userUpdated.lastname ? user.lastname = userUpdated.lastname : user.lastname = user.lastname;
            userUpdated.firstname ? user.firstname = userUpdated.firstname : user.firstname = user.firstname;
            userUpdated.address ? user.address = userUpdated.address : user.address = user.address;
            userUpdated.role ? user.role = userUpdated.role : user.role = user.role;
            userUpdated.email ? user.email = userUpdated.email : user.email = user.email;
            //userUpdated.password ? user.password = userUpdated.password : user.password = user.password;
            userUpdated.CP ? user.CP = userUpdated.CP : user.CP = user.CP;
            userUpdated.city ? user.city = userUpdated.city : user.city = user.city;
            userUpdated.phone ? user.phone = userUpdated.phone : user.phone = user.phone;
            console.log(userUpdated);
            return User.updateOne({ _id: id }, userUpdated)
        }
    
    }

    return UserRepository
}

