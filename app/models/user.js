/**
 * @typedef User
 * @property {string} _id
 * @property {string} _lastname
 * @property {string} _firstname
 * @property {string} _role
 * @property {string} _email
 * @property {string} _password 
 * @property {string} _address 
 * @property {string} _CP 
 * @property {string} _city 
 * @property {string} _phone 
 */

/**
 * @typedef UserRegisterDto
 * @property {string} _lastname
 * @property {string} _firstname
 * @property {string} _role
 * @property {string} _email
 * @property {string} _password 
 * @property {string} _address 
 * @property {string} _CP 
 * @property {string} _city 
 * @property {string} _phone 
 */

/**
 * @typedef UserLoginDto
 * @property {string} _email
 * @property {string} _password 
 */

module.exports = (mongoose) => {

    return mongoose && mongoose.model('User', mongoose.Schema({
        _lastname: String,
        _firstname: String,
        _role: String,
        _email: String,
        _password: String,
        _address: String,
        _CP: String,
        _city: String,
        _phone: String,
    }))
}



