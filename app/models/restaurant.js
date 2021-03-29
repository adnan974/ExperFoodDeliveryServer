/**
 * @typedef Restaurant
 * @property {string} _id
 * @property {string} _name
 * @property {string} _description
 * @property {string} _address
 * @property {string} _mainPhotoUrl
 * @property {Array.<Menu>} menus
 */


/**
 * @typedef RestaurantCreateDto
 * @property {string} _name
 * @property {string} _description
 * @property {string} _address
 * @property {string} _mainPhotoUrl
 */


module.exports = (mongoose) => {

    return mongoose && mongoose.model('Restaurant', mongoose.Schema({
        _name: String,
        _description: String,
        _address: String,
        _mainPhotoUrl: String,
        menus: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Menu"
        }]
    }))
}
