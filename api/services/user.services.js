require('dotenv').config()

const jwt = require("jsonwebtoken");

const bcrypt = require('bcrypt');

const RError = require("../helpers/error");

const responseMessage = require("../helpers/responseHandler");


const userAuth = require("../middlewares/auth");

const userValidation = require("../middlewares/validation/userValidation");




const { Model, Op } = require("../database/db");



const create = async (name, password) => {
    try {



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

const login = async (name, password) => {
    try {


        const user = await userValidation.loginValidator(name, password);

        const token = jwt.sign({ id: user.id }, process.env.SECRET_KEY, { expiresIn: "1h" });
        const user_id = user.id

        return responseMessage(true, 200, "token is generated", { token,user_id} );


    } catch (error) {

        const statusCode = error.statusCode || 500;
        return responseMessage(false, statusCode, error.message);
    }
}

const index = async () => {

    try {

        const users = await Model.User.findAll({
            attributes: ['id', 'name']
        });

        return responseMessage(true, 200, "users retrieved", { users });

    } catch (error) {

        const statusCode = error.statusCode || 500;
        return responseMessage(false, statusCode, error.message);
    }
}


const show = async (user_id) => {

    try {

        const user = await Model.User.findByPk(user_id, { attributes: ['id', 'name'] });

        return responseMessage(true, 200, "user is retrieved", { user });

    } catch (error) {

        const statusCode = error.statusCode || 500;
        return responseMessage(false, statusCode, error.message);
    }
}



const destroy = async (user_id) => {
    try {

        const user = await Model.User.findByPk(user_id);
        user.destroy();
        return responseMessage(true, 200, "account is deleted",{user})

    } catch (error) {

        const statusCode = error.statusCode || 500;
        return responseMessage(false, statusCode, error.message);
    }
}

const get_users_not_in_group= async (group_id)=> {

        try {
            const usersInGroup = await Model.User.findAll({
                attributes: ['id'],
                include: {
                  model: Model.Group,
                  where: {
                    id: group_id,
                  },
                },
              });
              
              const userIds = usersInGroup.map(user => user.id);

              
            const users = await Model.User.findAll({
                attributes: ['id', 'name'],
                where: {
                    id: {
                      [Op.notIn]: userIds,
                    },
                  },
              });
    
            return responseMessage(true, 200, "users not in the specific group returned successfully", {users});
    
        } catch (err) {
            console.log(err);
            return responseMessage(false, 400, "couldn't fetch the users not in the specific group", err);
        }
    
}



module.exports = { create, login, index, show, destroy ,get_users_not_in_group};