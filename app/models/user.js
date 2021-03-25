
module.exports = (mongoose) => {

    return mongoose && mongoose.model('User', mongoose.Schema({
        lastname: String,
        firstname: String,
        role: String,
        email: String,
        password: String,
        address: String,
        CP: String,
        city: String,
        phone: String,
    }))
}
