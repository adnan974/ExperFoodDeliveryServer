/**
 * @typedef Restaurant
 * @property {string} _id
 * @property {string} name
 * @property {string} description
 * @property {string} address
 * @property {string} cp
 * @property {string} city
 * @property {string} mainPhotoUrl
 * @property {Array.<Menu>} menus
 */


/**
 * @typedef RestaurantCreateDto
 * @property {string} name
 * @property {string} description
 * @property {string} address
 * @property {string} cp
 * @property {string} city
 * @property {string} mainPhotoUrl
 */


module.exports = (mongoose) => {

    return mongoose && mongoose.model('Restaurant', mongoose.Schema({
        name: { type : String, unique : true,  required : true },
        description: { type : String , unique : true, required : true },       
        address: { type : String,  required : true },
        cp: { type : String , unique : false, required : true, minlength: 5, maxlength: 5 },
        city: { type : String , unique : false, required : true },
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
