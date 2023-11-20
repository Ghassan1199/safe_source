const mongoose = require('mongoose');

require('dotenv').config()

const jwt = require("jsonwebtoken");

const bcrypt = require('bcrypt');

const RError = require("../helpers/error");

const responseMessage = require("../helpers/responseHandler");


const userAuth = require("../middlewares/auth");

const userValidation = require("../middlewares/validation/userValidation");




const Model = require("../database");



const create = async (req) => {
    try {


        const name = req.body.name;
        let password = req.body.password;


        if(!name || !password){

            throw new RError(404, "All fields are required");
        }

        const oldUser = await User.findOne({ name:name }).select("_id");


        if (oldUser != null) {

            throw new RError(409, "name is taken");

        }

        password = await bcrypt.hash(password, 10);


        await User.create({name, password});

        return responseMessage(true, 201, "user is added");

    } catch (error) {

        const statusCode = error.statusCode || 500;
        return responseMessage(false, statusCode, error.message);

    }

}

const login = async (req) => {
    try {


        const user = await userValidation.loginValidator(req);



        const data =jwt.sign({ _id:user._id }, process.env.SECRET_KEY, { expiresIn:"1h" });

        return responseMessage(true, 200, "token is generated", data);


    } catch (error) {

        const statusCode = error.statusCode || 500;
        return responseMessage(false, statusCode, error.message);
    }
}

const show = (req)=>{
    
}

const destroy = (req)=>{
    
}