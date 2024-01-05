const groupServices = require('../services/group.services')


const createGroup = async (req, res) => {

    const name = req.body.name;
    const owner_id = req.user_id;

    const response = await groupServices.create(name,owner_id);
    return res.status(response.statusCode).json(response);
    
}

const index = async (req, res) => {

    const user_id = req.user_id
    const owner_id = req.query.owner_id
    const response = await groupServices.index(user_id,owner_id);

    return res.status(response.statusCode).json(response);
}

const showGroup = async (req, res) => {

    const group_id = req.params.id;

    const response = await groupServices.show(group_id);

    return res.status(response.statusCode).json(response);
}

const destroyGroup = async (req, res) => {

    const group_id = req.params.id;
    const owner_id = req.user_id;

    const response = await groupServices.destroy(group_id,owner_id);

    return res.status(response.statusCode).json(response);
}

const addUserToGroup = async (req, res) => {

    const { group_id, user_id } = req.body;

    const response = await groupServices.addUser(group_id, user_id);

    return res.status(response.statusCode).json(response);

}

const removeUserFromGroup = async (req, res) => {

    const { group_id, user_id } = req.params;
    const user = req.user_id;

    const response = await groupServices.removeUser(user_id, group_id,user);

    return res.status(response.statusCode).json(response);

}



module.exports = {
    createGroup,
    index,
    showGroup,
    destroyGroup,
    addUserToGroup,
    removeUserFromGroup

}