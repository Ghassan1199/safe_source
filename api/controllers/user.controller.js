

const userServices = require("../services/user.services");
const register = async (req, res)=>{

    const response = await userServices.create(req);
    res.status(response.statusCode).send(response);

}

const login = async (req, res)=>{
    const response = await userServices.login(req);
    res.status(response.statusCode).send(response);
}

const getUsers = async (req, res)=>{
    const response = await userServices.index(req);
    res.status(response.statusCode).send(response);
}

const showUser = async (req, res)=>{
    const response = await userServices.show(req);
    res.status(response.statusCode).send(response);
}

const deleteUser = async (req, res)=>{
    const response = await userServices.destroy(req);
    res.status(response.statusCode).send(response);
}



module.exports = {register, login, getUsers, showUser, deleteUser};