const mongoose = require('mongoose');
const {mongoConfig} = require('../../config');

mongoose.connect(mongoConfig.urlmongo, mongoConfig.options);

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