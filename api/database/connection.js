const { Sequelize, DataTypes } = require("sequelize");


const sequelize = new Sequelize('postgres://postgres:1234@localhost:5432/source',{logging:false});


  module.exports = {sequelize, DataTypes};