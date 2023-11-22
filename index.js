const express = require("express");
const app = express();
require('dotenv').config();

const {connection} = require("./api/database/db");

const router = require("./api/router");

const bodyParser = require("body-parser");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.listen(3000,async ()=>{
    console.log(`Listening on port ${3000}....`);
    
    connection.sequelize.sync({alter:true}).then(()=>{
        console.log("connected to the database....")
    });
    
});

app.use("/users", router);

