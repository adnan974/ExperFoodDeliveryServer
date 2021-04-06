
module.exports = (mongoose, RestaurantRepository) => {

    const Menu = require("../models/menu")(mongoose);

    let MenuRepository = class {

        static getAll() {
            return Menu.find();
        }

        static getAllRestaurantMenu(restaurantId){
            return RestaurantRepository.getOne(restaurantId).populate('menus')
            .then((response) => {
                return response.menus;
            })
        }

        static getOne(id) {
            return Menu.findById(id);
        }

        static create(menuData, restaurantId) {

            let response;

            return Menu.create({
                name: menuData.name,
                description: menuData.description,
                price: menuData.price,
                restaurant: restaurantId
            }).then((createdMenu) => {
                response = createdMenu;
                return RestaurantRepository.addMenuToRestaurant(restaurantId, createdMenu._id);
            }).then(() => {
                return response;
            })
        }

        static async update(id, menuUpdated) {
            let menu = await Menu.findById(id);
            menuUpdated.name ? menu.name = menuUpdated.name : menu.name = menu.name;
            menuUpdated.description ? menu.description = menuUpdated.description : menu.description = menu.description;
            menuUpdated.price ? menu.price = menuUpdated.price : menu.price = menu.price;

            return Menu.updateOne({ _id: id }, menu)
        }

        static delete(id) {
            return Menu.deleteOne({ _id: id });
        }

    }

    return MenuRepository
}

