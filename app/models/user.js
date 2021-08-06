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
        avatar: { type: String, required: false, trim: true },
        lastname: { type: String, required: true, trim: true },
        firstname: { type: String, required: true, trim: true },
        role: { type: String, required: true, trim: true },
        email: { type: String, unique: true, required: true, dropDups: true, immutable: true, trim: true },
        password: { type: String, unique: false, required: false, trim: true },
        address: { type: String, required: false, trim: true },
        CP: { type: String, required: false, trim: true, minlength: 5, maxlength: 5 },
        city: { type: String, required: false, trim: true },
        phone: { type: String, required: false, trim: true },
        restaurants: {
            type: [{
                type: mongoose.Schema.Types.ObjectId,
                ref: "Restaurant",
            }],
            default: undefined
        },
    }))
}



