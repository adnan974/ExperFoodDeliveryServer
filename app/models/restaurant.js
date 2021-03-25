const { Schema } = require("mongoose")

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
