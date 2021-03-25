
module.exports = (mongoose) => {

    const Restaurant = require("../models/restaurant")(mongoose)

    let RestaurantRepository = class {

        static getAll() {

            return Restaurant.find();
        }

        static create(restaurantData) {

            let restaurant = new Restaurant({
                name: restaurantData.name,
                address: restaurantData.address,
                description: restaurantData.description,
                mainPhotoUrl: restaurantData.mainPhotoUrl,
            });

            return restaurant.save();
        }

    }

    return RestaurantRepository
}

