const groupServices = require('../services/group.services')


const createGroup = async (req, res)=>{
    const response = await groupServices.create(req)
    return res.status(response.statusCode).json(response)
}

const index = async (_, res)=>{
    const response = await groupServices.index()
    return res.status(response.statusCode).json(response)
}

const showGroup = async (req, res)=>{
    const response = await groupServices.show(req)
    return res.status(response.statusCode).json(response)
}

const destroyGroup = async (req, res)=>{
    const response = await groupServices.destroy(req)
    return res.status(response.statusCode).json(response)
}

const addUserToGroup = (req, res)=>{
    
}

const removeUserToGroup = (req, res)=>{
    
}


module.exports = {
    createGroup,
    index,
    showGroup,
    destroyGroup,
    addUserToGroup,
    removeUserToGroup

}