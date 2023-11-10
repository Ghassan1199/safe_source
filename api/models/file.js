const { Sequelize, DataTypes } = require("sequelize");

module.exports = (Sequelize,DataTypes) =>{
    return Sequelize.define("file",{
        id:{
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name:{
            type: DataTypes.STRING,
            allowNull: false
        },
        path:{
            type: DataTypes.STRING,
            allowNull: false
        },
        check:{
            type:bool
        },
        public:{
            type:bool
        },
        owner_id:{
            
        },
        date:{

        }
    },{timestamps: true})
}