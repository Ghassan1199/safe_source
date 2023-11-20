const groupServices = require('../services/goup.servcies')


const createGroup = async (req, res)=>{
    const response = await groupServices.create(req)
    return res.status(response.status).json(response)
}

const index = (_, res)=>{
    
}

const showGroup = (req, res)=>{
    
}

const destroyGroup = (req, res)=>{
    
}

const addUserToGroup = (req, res)=>{
    
}

const removeUserToGroup = (req, res)=>{
    
}