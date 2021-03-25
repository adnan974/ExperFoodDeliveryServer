
module.exports = (mongoose) => {

    return mongoose && mongoose.model('Menu', mongoose.Schema({
        _name: String,
        _description: String,
        _price: Number,
        restaurant: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Restaurant"
        }        
    }))
}