
module.exports = (mongoose) => {

    const Menu = require("../models/menu")(mongoose)

    let MenuRepository = class {

        static getAll() {

            return Menu.find();
        }

        static getOne(id){
            return Menu.findById(id);
        }

        static create(MenuData) {
            let menu = new Menu({
                _name: MenuData.name,
                _address: MenuData.address,
                _description: MenuData.description,
            });

            return menu.save();
        }

        static async update(id, menuUpdated) {
            let menu = await Menu.findById(id);
            menuUpdated.name ? menu._name = menuUpdated.name : menu._name = menu._name;
            menuUpdated.description ? menu._description = menuUpdated.description : menu._description = menu._description;
            menuUpdated.price ? menu._price = menuUpdated.price : menu._price = menu._price;
            console.log('----')

            console.log(menu)
        
            return Menu.updateOne({ _id: id }, menu)
        }

        static delete(id){
            return Menu.deleteOne({_id:id});
        }

    }

    return MenuRepository
}

