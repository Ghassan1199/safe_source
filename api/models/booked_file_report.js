const { Sequelize, DataTypes } = require("sequelize");

module.exports = (Sequelize, DataTypes) => {
    return Sequelize.define("booked-files_report", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        file_id: {

        },
        user_id: {
        },
        group_id: {

        },
        check_in_date: {

        },
        check_out_date: {

        },
    })
}