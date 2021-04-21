/**
 * @typedef User
 * @property {string} _id
 * @property {string} lastname
 * @property {string} firstname
 * @property {string} role
 * @property {string} email
 * @property {string} password 
 * @property {string} address 
 * @property {string} CP 
 * @property {string} city 
 * @property {string} phone 
 */

/**
 * @typedef UserRegisterDto
 * @property {string} lastname
 * @property {string} firstname
 * @property {string} role
 * @property {string} email
 * @property {string} password 
 * @property {string} address 
 * @property {string} CP 
 * @property {string} city 
 * @property {string} phone 
 */

/**
 * @typedef UserLoginDto
 * @property {string} email
 * @property {string} password 
 */

module.exports = (mongoose) => {

    return mongoose && mongoose.model('User', mongoose.Schema({
        avatar: { type: String, required: false },
        lastname: { type: String, required: true },
        firstname: { type: String, required: true },
        role: { type: String, required: true },
        email: { type: String, unique: true, required: true, dropDups: true },
        password: { type: String, unique: false, required: false },
        address: { type: String, required: false },
        CP: { type: String, required: false },
        city: String,
        phone: String,
        restaurants: {
            type: [{
                type: mongoose.Schema.Types.ObjectId,
                ref: "Restaurant",
            }],
            default: undefined
        },
    }))
}



