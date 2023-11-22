const { Sequelize, DataTypes, Op } = require("sequelize");


const sequelize = new Sequelize(`${process.env.DATABASE}://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,{logging:false});


  module.exports = {sequelize, DataTypes, Op};