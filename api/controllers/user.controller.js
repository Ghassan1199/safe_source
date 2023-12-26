

const userServices = require("../services/user.services");
const register = async (req, res)=>{

    const name = req.body.name;
    let password = req.body.password;

    const response = await userServices.create(name,password);
    res.status(response.statusCode).send(response);

}

const login = async (req, res)=>{

    const {name, password} = req.body;

    const response = await userServices.login(name,password);

    res.status(response.statusCode).send(response);
}

const getUsers = async (req, res)=>{

    const response = await userServices.index();
    res.status(response.statusCode).send(response);
}

const showUser = async (req, res)=>{
    const user_id = req.params.id;
    const response = await userServices.show(user_id);
    res.status(response.statusCode).send(response);
}

const deleteUser = async (req, res)=>{
    const user_id = req.user_id
    const response = await userServices.destroy(user_id);
    res.status(response.statusCode).send(response);
}


const not_in_group = async(req,res)=>{
    const group_id = req.params.group_id
    const response = await userServices.get_users_not_in_group(group_id);
    res.status(response.statusCode).send(response);
}


module.exports = {register, login, getUsers, showUser, deleteUser,not_in_group};