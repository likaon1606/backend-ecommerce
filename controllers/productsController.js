const { catchAsync } = require('../utils/catchAsync');

//MODELS
const { Product } = require('../models/productModel')

const getAllProducts = catchAsync( async (req, res, next) => {
    const product = await Product.findAll({
    });
    res.status(200).json({
        product,
    });
});

const getProductsById = catchAsync(async (req, res, next) => {
    const { product } = req;

    res.status(200).json({
        product,
    });
});

const createProduct = catchAsync( async (req, res, next) => {
    const { title, description, price, quantity, userId, categoryId } = req.body;

    const newProduct = await Product.create({
        title,
        description,
        price,
        quantity,
        userId,
        categoryId,
    });
    res.status(201).json({ status: 'success', newProduct });
});

const updateProduct = catchAsync( async (req, res, next) => {
    const { product } = req;
    const { title, description, price, quantity } = req.body;

    await product.update({ title, description, price, quantity });

    res.status(200).json({ status: 'success' });
});

const deleteProduct = catchAsync( async (req, res, next) => {
    const { product } = req;

    await product.update({ status: 'deleted' });

    req.status(200).json({
        status: 'success',
    });
});

module.exports = {
    getAllProducts,
    getProductsById,
    createProduct,
    updateProduct,
    deleteProduct,
};