const { Schema } = require("mongoose")

module.exports = (mongoose) => {

    return mongoose && mongoose.model('Restaurant', mongoose.Schema({
        name: String,
        description: String,
        address: String,
        mainPhotoUrl: String,
        menus: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Menu"
        }]
    }))
}
