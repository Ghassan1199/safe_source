
module.exports = (sequelize, DataTypes) => {
    return sequelize.define("group_file",{
        id:{
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        }
    });
};
