const bcrypt = require('bcrypt');

module.exports = (mongoose) => {   

    const User = require("../models/user")(mongoose)

    let UserRepository = class {

        static getAll() {
            return User.find();
        }

        static findOne(params) {
            return User.findOne(params);
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
    
    }

    return UserRepository
}

