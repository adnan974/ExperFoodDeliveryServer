

module.exports = (mongoose, UserRepository) => {

    const Restaurant = require("../models/restaurant")(mongoose)

    let RestaurantRepository = class {

        static getAll() {
            return Restaurant.find();
        }

        static getOne(id) {
            return Restaurant.findById(id);
        }

        static create(restaurantData, userId) {

            let response;

            return Restaurant.create({
                name: restaurantData.name,
                address: restaurantData.address,
                description: restaurantData.description,
                mainPhotoUrl: restaurantData.mainPhotoUrl,
                owner: userId
            }).then((createdRestaurant) => {
                response = createdRestaurant;
                return UserRepository.addRestaurantToUser(userId, createdRestaurant._id);
            }).then(() => {
                return response;
            })
        }

        //Todo à modifier
        static async update(id, restaurantUpdated) {

            let restaurant = await Restaurant.findById(id);
            restaurantUpdated.name ? restaurant.name = restaurantUpdated.name : restaurant.name = restaurant.name;
            restaurantUpdated.description ? restaurant.description = restaurantUpdated.description : restaurant.description = restaurant.description;
            restaurantUpdated.address ? restaurant.address = restaurantUpdated.address : restaurant.address = restaurant.address;
            restaurantUpdated.mainPhotoUrl ? restaurant.mainPhotoUrl = restaurantUpdated.mainPhotoUrl : restaurant.mainPhotoUrl = restaurant.mainPhotoUrl;
            return Restaurant.updateOne({ _id: id }, restaurant)

        }

        static delete(id) {
            return Restaurant.deleteOne({ _id: id })
        }

        static async addMenuToRestaurant(restaurantId, menuId) {

            console.log('on arrive dans le ADD MENU TO RESTAUANT !!!!', restaurantId, menuId)

            return Restaurant.findOneAndUpdate({ _id: restaurantId }, { $push: { menus: menuId } }, { new: true })
        }

    }

    return RestaurantRepository
}

