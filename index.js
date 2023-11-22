const express = require("express");
const morgan = require('morgan')
const app = express();
require('dotenv').config();

const {connection} = require("./api/database/db");

const userRoutes = require("./api/routes/user.routes");
const groupRoutes= require("./api/routes/group.routes");

const bodyParser = require("body-parser");

app.use(morgan("dev"))

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.listen(3000,async ()=>{
    console.log(`Listening on port ${3000}....`);
    
    connection.sequelize.sync({alter:true}).then(()=>{
        console.log("connected to the database....")
    });
    
});

app.use("/users", userRoutes);
app.use("/groups",groupRoutes);

