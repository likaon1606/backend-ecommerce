const express = require('express');

// Middlewares
const {
  userExists,
  protectToken,
  protectAccountOwner,
} = require('../middlewares/users.middlewares');

const {
  createUserValidations,
  checkValidations,
} = require('../middlewares/validations.middlewares');

// Controller
const {
  getAllUsers,
  createUser,
  getUserById,
  updateUser,
  deleteUser,
  login,
  checkToken,
  getUsersProducts,
  getUserOrder,
  getUserOrderById
} = require('../controllers/userController');

// Utils

const router = express.Router();

router.post(
  '/',
  createUserValidations,
  checkValidations,
  createUser
);

router.post('/login', login);

router.get('/', getAllUsers);
// Apply protectToken middleware
router.use(protectToken);


router.get('/me', getUsersProducts);

router.get('/orders', getUserOrder);

router.get('/orders/:id', getUserOrderById);

router.get('/check-token', checkToken); // compare valid token

router
  .route('/:id')
  .get(userExists, getUserById)
  .patch(userExists, protectAccountOwner, updateUser)
  .delete(userExists, protectAccountOwner, deleteUser);

module.exports = { usersRouter: router };
