
module.exports = (sequelize, DataTypes) => {
    
    return sequelize.define("file",{
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
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        public:{
            type: DataTypes.BOOLEAN,
            defaultValue: false

        },
        date:{
            type:DataTypes.DATE
        }
    });
};
