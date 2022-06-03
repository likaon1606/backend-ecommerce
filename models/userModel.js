const { DataTypes } = require('sequelize');
const { db } = require('../utils/database');

const User = db.define('user', {
    id: {
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        type: DataTypes.INTEGER,
    },
    username: {
        allowNull: false,
        type: DataTypes.STRING,
    },
    email: {
        allowNull: false,
        unique: true,
        type: DataTypes.STRING,
    },
    password: {
        allowNull: false,
        type: DataTypes.STRING,
    },
    role: {
        allowNull: false,
        type: DataTypes.STRING,
    },
    status: {
        defaultValue: 'active',
        type: DataTypes.STRING,
    },
});

module.exports = { User };