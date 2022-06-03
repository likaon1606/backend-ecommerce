const express = require('express');

//CONTROLLERS
const {
    addProductToCard,
    updateProductInCart,
    purchaseCart,
    removeProductFromCart,
    getUserCart,
} = require('../controllers/ordersController');

//MIDDLEWARES
const { protectToken } = require('../middlewares/users.middlewares');

const router = express.Router();

router.use(protectToken);

router.get('/', getUserCart);

router.post('/add-product', addProductToCard);

router.patch('/update-cart', updateProductInCart);

router.post('/purchase', purchaseCart);

router.delete('/:productId', removeProductFromCart); // toda ruta dinamica se debe colocar abajo de todas

module.exports = { cartRouter: router };