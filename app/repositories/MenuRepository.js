
module.exports = (mongoose, RestaurantRepository) => {

    const Menu = require("../models/menu")(mongoose);

    let MenuRepository = class {

        static getAll() {
            return Menu.find();
        }

        static async getAllByRestaurant(restaurantId) {
            return RestaurantRepository.getOne(restaurantId).populate('menus');;
        }

        static getOne(id) {
            return Menu.findById(id);
        }

        // static create(MenuData) {
        //     console.log()
        //     let menu = new Menu({
        //         name: MenuData.name,
        //         address: MenuData.address,
        //         description: MenuData.description,
        //     });

        //     return menu.save();
        // }

        static create(menuData, restaurantId) {

            console.log('on arrive ici, dans le reate du menurepository', menuData),

            console.log('le restaurant id vaut :', restaurantId)

            let response;

            return Menu.create({
                name: menuData.name,
                description: menuData.description,
                price: menuData.price,
                restaurant: restaurantId
            }).then((createdMenu) => {
                console.log('on est la c pas mal', createdMenu)
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

