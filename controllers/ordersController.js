//MODELS
const { Cart } = require('../models/cartModel');
const { ProductInCart } = require('../models/productsInCartModel');
const { Product } = require('../models/productModel');

//UTILS
const { catchAsync } = require("../utils/catchAsync");
const { AppError } = require('../utils/appError');

const getUserCart = catchAsync(async (req, res, next) => {
  const { sessionUser } = req;

  const cart = await Cart.findOne({
    where: { userId: sessionUser.id, status: 'active' },
    include: [{ model: ProductInCart, include: [{ model: Product }] }],
  });

  res.status(200).json({ status: 'success', cart });
});

const addProductToCard = catchAsync(async (req, res, next) => {
  const { productId, quantity } = req.body;
  const { sessionUser } = req;

  // Validate that the product has enough stock for the cart
  const product = await Product.findOne({ where: { id: productId } });

  if (!product) {
    return next(new AppError('Invalid product', 404));
  } else if (quantity > product.quantity) {
    return next(
      new AppError(
        `This product only has ${product.quantity} items available`,
        400
      )
    );
  }

  // CREATE NEW CART
  const cart = await Cart.findOne({
    where: { userId: sessionUser.id, status: 'active' },
  });

  // Create new cart if it doesn't exist
  if (!cart) {
    const newCart = await Cart.create({ userId: sessionUser.id });

    // Add product to the cart
    await ProductInCart.create({ cartId: newCart.id, productId, quantity });
  } else {
    
    // Validate if product already exists in the cart
    const productInCart = await ProductInCart.findOne({
      where: { cartId: cart.id, productId, status: 'active' },
    });

    // Send error if it exists
    if (productInCart) {
      return next(
        new AppError('You already have that product in your cart', 400)
      );
    }

    // Add product to current cart
    await ProductInCart.create({ cartId: cart.id, productId, quantity });
  }

  res.status(200).json({ status: 'success' });
});

const updateProductInCart = catchAsync(async (req, res, next) => {
  const { newQty, productId } = req.body;
  const { sessionUser } = req;

  // Get user's cart
  const cart = await Cart.findOne({
    where: { status: 'active', userId: sessionUser.id },
  });

  if (!cart) {
    return next(new AppError('Must create a cart first', 400));
  }

  // Validate that the product exists in the cart
  const productInCart = await ProductInCart.findOne({
    where: { status: 'active', cartId: cart.id, productId },
    include: [{ model: Product }],
  });

  if (!productInCart) {
    return next(new AppError('This product does not exist in your cart', 404));
  }

  // Validate that the updated qty is not a negative number or exceeds the available stock
  if (newQty < 0 || newQty > productInCart.product.quantity) {
    return next(
      new AppError(
        `Invalid selected quantity, this product only has ${productInCart.product.quantity} items available`,
        400
      )
    );
  }

  // If newQty is 0, remove product from cart (update status)
  if (newQty === 0) {
    await productInCart.update({ quantity: 0, status: 'removed' });
  } else if (newQty > 0) {
    // Update product in cart to new qty
    await productInCart.update({ quantity: newQty });
  }

  res.status(200).json({ status: 'success' });
});

const purchaseCart = catchAsync(async (req, res, next) => {
    res.status(200).json({ status: 'success' });
});

const removeProductFromCart = catchAsync(async (req, res, next) => {
  const { product, sessionUser } = req;

  // Get user's cart
  const cart = await Cart.findOne({
    where: { status: 'active', userId: sessionUser.id },
  });

  if (!cart) {
    return next(new AppError('Must create a cart first', 400));
  }

  const productInCart = await ProductInCart.findOne({
    where: { status: 'active', cartId: cart.id, product },
    include: [{ model: Product }],
  });

  if (!productInCart) {
    return next(new AppError('This product does not exist in your cart', 404));
  }

  await productId.update({ status: 'deleted'});

  res.status(200).json({
      status: 'success',
  });
});
module.exports = {
    getUserCart,
    addProductToCard,
    updateProductInCart,
    purchaseCart,
    removeProductFromCart,
};