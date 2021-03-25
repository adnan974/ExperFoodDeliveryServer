const mongoose = require('mongoose');
const config = require('../../config.json')


mongoose.connect(config.db.urlmongo, config.db.options);

let db = mongoose.connection; 
db.on('error', console.error.bind(console, 'Erreur lors de la connexion')); 
db.once('open', function (){
    console.log("Connexion à la base OK"); 
});

module.exports = {
    //AuthRepository = require('./AuthRepository')(mongoose),
    UserRepository : require('./UserRepository')(mongoose),
    RestaurantRepository : require('./RestaurantRepository')(mongoose),
    MenuRepository : require('./MenuRepository')(mongoose)
}