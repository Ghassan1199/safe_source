
module.exports = (sequelize, DataTypes)=>{ 
    return sequelize.define("booked-files_report", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        check_in_date: {
           type: DataTypes.DATE,
           allowNull: false


        },
        check_out_date: {
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue: null
        },
        exp_date: {
            type: DataTypes.DATE,
            allowNull: true,
            
        }
    });
};

