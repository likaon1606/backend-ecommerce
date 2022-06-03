const { Products } = require('../models/productModel');
const { catchAsync } = require('../utils/catchAsync');

const productExists = catchAsync(async (req, res, next) => {
    const { id } = req.params;
  
    const products = await Products.findOne({
      where: { id, status: 'active' },
      attributes: { exclude: ['password'] },
    });
  
    if (!products) {
      return next(new AppError('products does not exist with given Id', 404));
    }
  
    // Add products data to the req object
    req.products = products;
    next();
  });

const protectProductOwner = catchAsync(async (req, res, next) => {
  
    next();
});

module.exports = { protectProductOwner, productExists };