const express = require("express");
const app = express();
require('dotenv').config();


const {connection} = require("./api/database/db");


app.listen(3000,async ()=>{
    console.log(`Listening on port ${3000}....`);
    
    connection.sequelize.sync({alter:true}).then(()=>{
        console.log("connected to the database....")
    });
    
})

