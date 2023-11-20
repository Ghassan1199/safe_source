require('dotenv').config()

const jwt = require("jsonwebtoken");

const User = require("../database/db");


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


const getUser = async (token, secretKey = process.env.ACCESS_SECRET_KEY) => {

    if (!token) {
        throw new RError(401, "unauthorized");
    }


    console.log("user")

    const decodedToken = jwt.verify(token, secretKey);

    const _id = decodedToken.payload;


    const user = await User.findById(_id).select("_id deleted refresh_token password");


    if (user == null) {

        throw new RError(404, "user not found")

    }

    if (user.deleted) {

        throw new RError(404, "user not found")

    }

    return user;


}

module.exports = {checkUser, getUser};