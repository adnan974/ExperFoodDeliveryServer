
module.exports = (mongoose) => {

    const Menu = require("../models/menu")(mongoose)

    let MenuRepository = class {

        static getAll() {

            return Menu.find();
        }

        static create(MenuData) {

            let menu = new Menu({
                name: MenuData.name,
                address: MenuData.address,
                description: MenuData.description,
            });

            return menu.save();
        }

    }

    return MenuRepository
}

