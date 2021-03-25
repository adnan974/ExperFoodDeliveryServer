
module.exports = (mongoose) => {

    return mongoose && mongoose.model('User', mongoose.Schema({
        _lastname: String,
        _firstname: String,
        _role: String,
        _email: String,
        _password: String,
        _address: String,
        _CP: String,
        _city: String,
        _phone: String,
    }))
}
