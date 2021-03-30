
module.exports = (mongoose) => {

    const Menu = require("../models/menu")(mongoose)
    const RestaurantRepository = require("./RestaurantRepository");

    let MenuRepository = class {

        static getAll() {
            return Menu.find();
        }

        static async getAllByRestaurant(restaurantId) {
            return RestaurantRepository.getOne(restaurantId).populate('menus');;
        }

        static getOne(id){
            return Menu.findById(id);
        }

        static create(MenuData) {
            let menu = new Menu({
                name: MenuData.name,
                address: MenuData.address,
                description: MenuData.description,
            });

            return menu.save();
        }

        static async update(id, menuUpdated) {
            let menu = await Menu.findById(id);
            menuUpdated.name ? menu.name = menuUpdated.name : menu.name = menu.name;
            menuUpdated.description ? menu.description = menuUpdated.description : menu.description = menu.description;
            menuUpdated.price ? menu.price = menuUpdated.price : menu.price = menu.price;    
        
            return Menu.updateOne({ _id: id }, menu)
        }

        static delete(id){
            return Menu.deleteOne({_id:id});
        }

    }

    return MenuRepository
}

