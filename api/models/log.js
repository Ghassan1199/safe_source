

module.exports = (sequelize, DataTypes) => {
    return sequelize.define("log", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        req_method :{
            type:DataTypes.STRING,
        },
        req_url :{
            type:DataTypes.STRING,
        },
        req_params:{
            type:DataTypes.JSON,
        },
        req_query:{
            type:DataTypes.JSON,
        },
        req_body:{
            type:DataTypes.JSON,
        },
        res_body: {
            type: DataTypes.JSON,
        },
        res_status:{
            type: DataTypes.STRING
        }

    });
};
