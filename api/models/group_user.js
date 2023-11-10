const { Sequelize, DataTypes } = require("sequelize");

module.exports = (Sequelize,DataTypes) =>{
    return Sequelize.define("group_user",{
        id:{
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        user_id:{

        },
        group_id:{
            
        }
    })
}