const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

// MODELS
const { User } = require('../models/userModel');
const { Order } = require('../models/orderModel');
const  {Cart } = require('../models/cartModel');
const { Product } = require('../models/productModel');
const { ProductInCart } = require('../models/productsInCartModel');
const { Category } = require('../models/categoryModel');

// UTILS
const { catchAsync } = require('../utils/catchAsync');
const { AppError } = require('../utils/appError');

// CALL DOTENV ON ERROR
dotenv.config({ path: './config.env'});

const getAllUsers = catchAsync(async (req, res, next) => {
    const users = await User.findAll({
        attributes: { exclude: ['password'] },
    });
        res.status(200).json({
        users,
    });
});

const createUser = catchAsync(async (req, res, next) => {
    const { username, email, password, role } = req.body;

    const salt = await bcrypt.genSalt(12);
    const hashPassword = await bcrypt.hash(password, salt);

    // INSERT IN TO..
    const newUser = await User.create({
        username,
        email,
        password: hashPassword,
        role,
    });
    newUser.password = undefined;

    res.status(201).json({status: 'success', newUser});
});

const getUserById = catchAsync(async (req, res, next) => {
    const { user } = req;

    res.status(200).json({
        user,
    });
});

const updateUser = catchAsync(async (req, res, next) => {
    const { user } = req;
    const { username, email } = req.body;

    await user.update({ username, email });

    res.status(200).json({ status: 'success' });
});

const deleteUser = catchAsync(async (req, res, next) => {
    const { user } = req;

    await user.update({ status: 'deleted'});

    res.status(200).json({
        status: 'success',
    });
});

const login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;
  
    // Validate that user exists with given email
    const user = await User.findOne({
      where: { email, status: 'active' },
    });
  
    // Compare password with db
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return next(new AppError('Invalid credentials', 400));
    }
  
    // Generate JWT
    const token = await jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });
  
    user.password = undefined;
  
    res.status(200).json({ token, user });
  });
  
  const checkToken = catchAsync(async (req, res, next) => {
    res.status(200).json({ user: req.sessionUser });
  });

  const getUsersProducts = catchAsync(async (req, res, next) => {
    const users = await User.findAll({
      attributes: { exclude: ['password'] },
      include: { model: Product } ,
    });

    res.status(200).json({ 
      status: users, 
    });
  });

  const getUserOrder = catchAsync(async (req, res, next) => {
    const { sessionUser } = req;

    const orders = await Order.findAll({ 
      attributes: [ 'id', 'totalPrice', 'createdAt' ],
      where: { userId: sessionUser.id },
      include: [
        {  
        model: Cart,
        attributes: [ 'id', 'status' ],
        include: [
        {
          model: ProductInCart,
          attributes: [ 'quantity', 'status' ],
          include: [
            { 
            model: Product,
            attributes: [ 'id', 'title', 'description', 'price' ],
            include: [{ model: Category, attributes: ['name'] }],
          },
        ],
        },
      ], 
    },
  ],
     });
    res.status(200).json({ status: 'success', orders });
  });

  const getUserOrderById = catchAsync(async (req, res, next) => {
    const { sessionUser } = req;

    const orders = await Order.findOne({ 
      attributes: [ 'id', 'totalPrice', 'createdAt' ],
      where: { userId: sessionUser.id },
      include: [
        {  
        model: Cart,
        attributes: [ 'id', 'status' ],
        include: [
        {
          model: ProductInCart,
          attributes: [ 'quantity', 'status' ],
          include: [
            { 
            model: Product,
            attributes: [ 'id', 'title', 'description', 'price' ],
            include: [{ model: Category, attributes: ['name'] }],
          },
        ],
        },
      ], 
    },
  ],
     });
    res.status(200).json({ status: 'success', orders });
  });
  
module.exports = { 
    getAllUsers,
    createUser,
    getUserById,
    updateUser,
    deleteUser,
    login,
    checkToken,
    getUsersProducts,
    getUserOrder,
    getUserOrderById,
};