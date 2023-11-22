require('dotenv').config()

const jwt = require("jsonwebtoken");

const bcrypt = require('bcrypt');

const RError = require("../helpers/error");

const responseMessage = require("../helpers/responseHandler");


const userAuth = require("../middlewares/auth");

const userValidation = require("../middlewares/validation/userValidation");




const { Model, Op } = require("../database/db");



const create = async (req) => {
    try {


        const name = req.body.name;
        let password = req.body.password;


        if (!name || !password) {

            throw new RError(404, "All fields are required");
        }

        const oldUser = await Model.User.findOne({ where: { name } });

        if (oldUser != null) {

            throw new RError(409, "name is taken");

        }

        password = await bcrypt.hash(password, 10);


        await Model.User.create({ name, password });

        return responseMessage(true, 201, "user is added");

    } catch (error) {

        const statusCode = error.statusCode || 500;
        return responseMessage(false, statusCode, error.message);

    }

}

const login = async (req) => {
    try {


        const user = await userValidation.loginValidator(req);



        const token = jwt.sign({ id: user.id }, process.env.SECRET_KEY, { expiresIn: "1h" });

        return responseMessage(true, 200, "token is generated", { token });


    } catch (error) {

        const statusCode = error.statusCode || 500;
        return responseMessage(false, statusCode, error.message);
    }
}

const index = async (req) => {

    try {
        const token = req.headers.auth;


        if (!token) {
            throw new RError(401, "unauthorized");
        }

        const user = await userAuth.getUser(token);

        const users = await Model.User.findAll({
            where: {
                id: { [Op.ne]: user.id }
            },
            attributes: ['id', 'name']
        });
        return responseMessage(true, 200, "users are retrieved", { users });

    } catch (error) {

        const statusCode = error.statusCode || 500;
        return responseMessage(false, statusCode, error.message);
    }
}


const show = async (req) => {

    try {
        const token = req.headers.auth;


        if (!token) {
            throw new RError(401, "unauthorized");
        }

        const user = await userAuth.getUser(token);

        return responseMessage(true, 200, "user is retrieved", { user });

    } catch (error) {

        const statusCode = error.statusCode || 500;
        return responseMessage(false, statusCode, error.message);
    }
}



const destroy = async (req) => {
    try {
        const token = req.headers.auth;


        if (!token) {
            throw new RError(401, "unauthorized");
        }

        const user = await userAuth.getUser(token);

        await Model.User.destroy({
            where: {
                id: user.id
            },
        });
        return responseMessage(true, 200, "account is deleted");

    } catch (error) {

        const statusCode = error.statusCode || 500;
        return responseMessage(false, statusCode, error.message);
    }
}


module.exports = { create, login, index, show, destroy };