const { Sequelize, DataTypes } = require("sequelize");

module.exports = (Sequelize,DataTypes) =>{
    return Sequelize.define("group_file",{
        id:{
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name:{
            type: DataTypes.STRING,
            allowNull: false
        },
        owner_id:{
            
        }
    })
}