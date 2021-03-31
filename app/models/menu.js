/**
 * @typedef Menu
 * @property {string} _id
 * @property {string} name
 * @property {string} description
 * @property {number} price
 */

/**
 * @typedef MenuCreateDto
 * @property {string} name
 * @property {string} description
 * @property {number} price
 */

module.exports = (mongoose) => {

    return mongoose && mongoose.model('Menu', mongoose.Schema({
        name: { type : String,  required : true },
        description: { type : String,  required : true },
        price: { type : Number,  required : true },
        restaurant: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Restaurant"
        }        
    }))
}