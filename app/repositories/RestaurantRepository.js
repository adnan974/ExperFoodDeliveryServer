const { MenuRepository } = require(".");

module.exports = (mongoose) => {

    const Restaurant = require("../models/restaurant")(mongoose)

    let RestaurantRepository = class {

        static getAll() {

            return Restaurant.find();
        }

        static getOne(id){
            return Restaurant.findById(id);
        }

        static create(restaurantData) {

            let restaurant = new Restaurant({
                _name: restaurantData._name,
                _address: restaurantData._address,
                _description: restaurantData._description,
                _mainPhotoUrl: restaurantData._mainPhotoUrl,
            });

            return restaurant.save();
        }

        //Todo à modifier
        static async update(id,restaurantUpdated){

            let restaurant = await Restaurant.findById(id);
            restaurantUpdated.name ? restaurant._name = restaurantUpdated.name : restaurant._name = restaurant._name;
            restaurantUpdated.description ? restaurant._description = restaurantUpdated.description : restaurant._description = restaurant._description;
            restaurantUpdated.address ? restaurant._address = restaurantUpdated.address : restaurant._address = restaurant._address;
            restaurantUpdated.mainPhotoUrl ? restaurant._mainPhotoUrl = restaurantUpdated.mainPhotoUrl : restaurant._mainPhotoUrl = restaurant._mainPhotoUrl;
            return Restaurant.updateOne({ _id: id }, restaurant)
            
        }

        static delete(id){
            return Restaurant.deleteOne({_id:id})
        }


        static  async addMenuToRestaurant(idRestaurant,menuData){
            let restaurant =   await RestaurantRepository.getOne(idRestaurant);
            restaurant.menus.push(menuData);

            return restaurant.save();
        }

    }

    return RestaurantRepository
}

