//Models
const { Category } = require('../models/categoryModel');

const { catchAsync } = require('../utils/catchAsync');



const createCategory = catchAsync( async (req, res) => {
    const { name } = req.body;

    const newCategory = await Category.create({
        name,
    });
    res.status(201).json({ status: 'success', newCategory });
});

module.exports = { createCategory };
