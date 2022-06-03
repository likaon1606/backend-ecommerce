const { DataTypes } = require('sequelize');
const { db } = require('../utils/database');

const Product = db.define('product', {
    id: {
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        type: DataTypes.INTEGER,
    },
    title: {
        allowNull: false,
        type: DataTypes.STRING,
    },
    description: {
        allowNull: false,
        type: DataTypes.STRING,
    },
    quantity: {
        allowNull: false,
        type: DataTypes.INTEGER,
    },
    price: {
        allowNull: false,
        type: DataTypes.INTEGER,
    },
    categoryId:{
        allowNull: false,
        type:DataTypes.INTEGER,
    },
    userId: {
        allowNull: false,
        type: DataTypes.INTEGER,
    },
    status: {
        defaultValue: 'active',
        type: DataTypes.STRING,
    },
});

module.exports = { Product };