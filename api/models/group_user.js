

    module.exports =(sequelize, DataTypes) => {
        return sequelize.define("group_user",{
        id:{
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        }
    });
};




