const express = require('express');

const { createCategory } = require('../controllers/categoryController');

//MIDDLEWARE
const router = express.Router();

router.post('/', createCategory);

module.exports = { categoriesRouter: router };