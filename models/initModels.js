const { User } = require('./userModel');
const { ProductInCart } = require('./productsInCartModel');
const { Product } = require('./productModel');
const { Order } = require('./orderModel');
const { Category } = require('./categoryModel');
const { Cart } = require('./cartModel');

const initModels = () => {

// 1 user <--> M product
User.hasMany(Product);
Product.belongsTo(User);

// 1 user <--> M order
User.hasMany(Order);
Order.belongsTo(User);

// 1 user <--> 1 cart
User.hasOne(Cart);
Cart.belongsTo(User);

// 1 category <--> 1 product
Category.hasOne(Product);
Product.belongsTo(Category);

// 1 cart <--> M productInCart
Cart.hasMany(ProductInCart);
ProductInCart.belongsTo(Cart);

// 1 product <--> 1 productInCart
Product.hasOne(ProductInCart);
ProductInCart.belongsTo(Product);

// 1 Order <--> 1 cart
Cart.hasOne(Order);
Order.belongsTo(Cart);

};

module.exports = { initModels };