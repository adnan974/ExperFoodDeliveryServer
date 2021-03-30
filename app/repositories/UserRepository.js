const bcrypt = require('bcrypt');

module.exports = (mongoose) => {   

    const User = require("../models/user")(mongoose)

    let UserRepository = class {

        static getAll() {
            return User.find();
        }

        static findOne(id) {
            return User.findById(id);
        }
    
        static async create(userData) {      

            userData._password =  await bcrypt.hash(userData._password, 10);
    
            let user = new User({
            _firstname : userData._firstname,
            _lastname : userData._lastname,
            _email : userData._email,
            _password : userData._password,
            _role : userData._role,
            }); 

            return user.save();
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

