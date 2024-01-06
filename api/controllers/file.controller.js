const file_services = require('../services/file.services');
const path = require('path');
const add_file = async (req, res) => {
    const path = req.file.path;

    const { file_name, check, public } = req.body;

    const owner_id = req.user_id;

    const response = await file_services.create(file_name, path, owner_id, check, public)

    return res.status(response.statusCode).json(response);

}

const remove_file = async (req, res) => {

    const file_id = req.params.file_id;

    const owner_id = req.user_id;

    const responsne = await file_services.remove(file_id, owner_id);

    return res.status(responsne.statusCode).json(responsne);

}

const show_files = async (req, res) => {

    const owner_id = req.query.owner_id;

    const group_id = req.query.group_id;

    const public = req.query.public;

    const check = req.body.check;


    const response = await file_services.index(owner_id, group_id, public, check);
    return res.status(response.statusCode).json(response);

}

const shareWithGroup = async (req, res) => {

    const owner_id = req.user_id;

    const file_id = req.body.file_id;

    const group_id = req.body.group_id;

    const response = await file_services.shareWithGroup(file_id, owner_id, group_id);
    return res.status(response.statusCode).json(response);
}

const check_in = async (req, res) => {
    
    const user_id = req.user_id;
    const file_ides = req.query.file_ides.split(',');
    const group_id = req.params.group_id

    const response = await file_services.check_in(user_id, file_ides, group_id);
    return res.status(response.statusCode).json(response);
}

const check_out = async (req, res) => {
    const user_id = req.user_id;
    const file_id = req.params.file_id;
    const group_id = req.params.group_id

    const response = await file_services.check_out(user_id, file_id, group_id);
    return res.status(response.statusCode).json(response);
}

const update_file = async (req, res, next) => {
    const user_id = req.user_id;
    const file_id = req.params.file_id;

    const response = await file_services.update(file_id, user_id);
    if (response.status == false) {
        return res.status(response.statusCode).json(response);
    }
    req.k = response;
    next()
}


const download_file = async (req, res) => {
    const file_id = req.params.file_id;
    const user_id = req.user_id 
    const response = await file_services.download(file_id, user_id);
    if (response.status == false) {
        return res.status(response.statusCode).json(response);
    }

    const dirPath = __dirname.replace("\\api\\controllers","");

     const p = response.data.dataValues.path;
    const filePath = path.join(dirPath, p);

res.download(filePath);
}



module.exports = {
    add_file,
    remove_file,
    show_files,
    shareWithGroup,
    check_in,
    check_out,
    update_file,
    download_file
}