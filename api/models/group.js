
    module.exports =(sequelize, DataTypes) => {
        return sequelize.define("group",{
            id:{
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            name:{
                type:DataTypes.STRING,
                allowNull: false
            }
        });
    };