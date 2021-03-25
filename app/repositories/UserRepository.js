
module.exports = (mongoose) => {   

    const User = require("../models/user")(mongoose)

    let UserRepository = class {

        static getAll() {
            return User.find();
        }

        static findOne(params) {
            return User.findOne(params);
        }
    
        static create(userData) {
    
            let user = new User({
            firstname : userData.firstname,
            lastname : userData.lastname,
            email : userData.email,
            password : userData.password,
            role : userData.role,
            }); 

            return user.save();
        }
    
    }

    return UserRepository
}

