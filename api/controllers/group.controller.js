const groupServices = require('../services/group.services')


const createGroup = async (req, res) => {
    const name = req.body.name;
    const owner_id = req.user_id;
    const response = await groupServices.create(name,owner_id);
    return res.status(response.statusCode).json(response);
}

const index = async (_, res) => {
    const response = await groupServices.index()
    return res.status(response.statusCode).json(response)
}

const showGroup = async (req, res) => {
    const group_id = req.params.id;
    const response = await groupServices.show(group_id)
    return res.status(response.statusCode).json(response)
}

const destroyGroup = async (req, res) => {
    const group_id = req.body.group_id
    const response = await groupServices.destroy(group_id)
    return res.status(response.statusCode).json(response)
}

const addUserToGroup = async (req, res) => {

    const { group_id, user_id } = req.body;
    const response = await groupServices.addUser(group_id, user_id)
    return res.status(response.statusCode).json(response)

}

const removeUserToGroup = (req, res) => {

}


module.exports = {
    createGroup,
    index,
    showGroup,
    destroyGroup,
    addUserToGroup,
    removeUserToGroup

}