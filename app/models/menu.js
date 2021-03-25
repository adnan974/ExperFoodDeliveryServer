
module.exports = (mongoose) => {

    return mongoose && mongoose.model('Menu', mongoose.Schema({
        name: String,
        description: String,
        price: Number,
        restaurant: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Restaurant"
        }        
    }))
}