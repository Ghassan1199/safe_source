const {sequelize, DataTypes, Op} = require("./connection");

const {setHasMany, setBelongsToMany} = require("./relationFuns");

const connection ={};
connection.sequelize = sequelize;
const Model ={};
Model.BFR = require("../models/booked_file_report")(sequelize, DataTypes);
Model.File = require("../models/file")(sequelize, DataTypes);
Model.GroupFile = require("../models/group_file")(sequelize, DataTypes);
Model.GroupUser = require("../models/group_user")(sequelize, DataTypes);
Model.Group = require("../models/group")(sequelize, DataTypes);
Model.User = require("../models/user")(sequelize, DataTypes);



setHasMany(Model.User, Model.BFR);
setHasMany(Model.User,Model.Group,"owner_id")


setHasMany(Model.User, Model.File);


setBelongsToMany(Model.File, Model.Group,'group_file');


setHasMany(Model.User, Model.GroupUser);

setBelongsToMany(Model.User, Model.Group,'group_user');

setHasMany(Model.Group, Model.BFR);

setHasMany(Model.File, Model.BFR);




module.exports = {connection, Model, Op};

    