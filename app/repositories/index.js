const mongoose = require('mongoose');
const {mongoConfig} = require('../../config');

//mongoose.connect(mongoConfig.urlmongo, mongoConfig.options);
mongoose.connect(process.env.MONGODB_URL || mongoConfig.urlmongo || "mongodb+srv://adn974:goulamaly@cluster0.ar9jw.mongodb.net/Exper-Food-Delivery?retryWrites=true&w=majority");

let db = mongoose.connection; 
db.on('error', console.error.bind(console, 'Erreur lors de la connexion')); 
db.once('open', function (){
    console.info("MongoDB connection OK"); 
});


const UserRepository = require('./UserRepository')(mongoose);
const RestaurantRepository = require('./RestaurantRepository')(mongoose, UserRepository);
const MenuRepository =  require('./MenuRepository')(mongoose, RestaurantRepository)

module.exports = {
    UserRepository : UserRepository,   
    RestaurantRepository : RestaurantRepository,
    MenuRepository : MenuRepository
}