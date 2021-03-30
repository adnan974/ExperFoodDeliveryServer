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
            }); 

            return user.save();
        }

        static async addRestaurantToUser(userId, restaurant) {

            return User.findOneAndUpdate({_id: userId},  {$push: {restaurants: restaurant._id}}, { new: true })
        }

        static async update(id, userUpdated) {

            let user = await User.findById(id);
            userUpdated.lastname ? user._lastname = userUpdated.lastname : user._lastname = user._lastname;
            userUpdated.firstname ? user._firstname = userUpdated.firstname : user._firstname = user._firstname;
            userUpdated.address ? user._address = userUpdated.address : user._address = user._address;
            userUpdated.role ? user._role = userUpdated.role : user._role = user._role;
            userUpdated.email ? user._email = userUpdated.email : user._email = user._email;
            userUpdated.password ? user._password = userUpdated.password : user._password = user._password;
            userUpdated.CP ? user._CP = userUpdated.CP : user._CP = user._CP;
            userUpdated.city ? user._city = userUpdated.city : user._city = user._city;
            userUpdated.phone ? user._phone = userUpdated.phone : user._phone = user._phone;
            return User.updateOne({ _id: id }, user)
        }
    
    }

    return UserRepository
}

