const mongoose = require('mongoose');
const {mongoConfig} = require('../../config');

mongoose.connect(mongoConfig.urlmongo, mongoConfig.options);

let db = mongoose.connection; 
db.on('error', console.error.bind(console, 'Erreur lors de la connexion')); 
db.once('open', function (){
    console.info("Connexion à la base OK");
    console.info("*");
    console.info("*");  
});

module.exports = {    
    //AuthRepository = require('./AuthRepository')(mongoose),
    UserRepository : require('./UserRepository')(mongoose),
    RestaurantRepository : require('./RestaurantRepository')(mongoose),
    MenuRepository : require('./MenuRepository')(mongoose)
}