require('dotenv').config()

const jwt = require("jsonwebtoken");

const Model = require("../database/db");


const RError = require("../helpers/error");

const responseMessage = require("../helpers/responseHandler");

const checkUser = async (req, res, next) => {


    try {

        const token = req.headers.authorization;


        await getUser(token);


        next();

    } catch (error) {
         const statusCode = error.statusCode || 500;
        const response = responseMessage(false, statusCode, error.message);

        res.status(statusCode).send(response);
    }

}


const getUser = async (token) => {

    if (!token) {
        throw new RError(401, "unauthorized");
    }



    const decodedToken = jwt.verify(token, process.env.SECRET_KEY);

    const _id = decodedToken.payload;


    const user = await Model.User.findById(_id).select("_id name");


    if (user == null) {

        throw new RError(404, "user not found")

    }

    return user;

}

module.exports = {checkUser, getUser};