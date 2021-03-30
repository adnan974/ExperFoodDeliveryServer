/**
 * @typedef Restaurant
 * @property {string} _id
 * @property {string} name
 * @property {string} description
 * @property {string} address
 * @property {string} mainPhotoUrl
 * @property {Array.<Menu>} menus
 */


/**
 * @typedef RestaurantCreateDto
 * @property {string} name
 * @property {string} description
 * @property {string} address
 * @property {string} mainPhotoUrl
 */


module.exports = (mongoose) => {

    return mongoose && mongoose.model('Restaurant', mongoose.Schema({
        name: String,
        description: String,
        address: String,
        mainPhotoUrl: String,
        menus: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Menu"
        }],
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    }))
}
