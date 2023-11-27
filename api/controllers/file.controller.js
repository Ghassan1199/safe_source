const file_services = require('../services/file.services');


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

    const response = await file_services.index(owner_id, group_id, public);
    return res.status(response.statusCode).json(response);

}

const shareWithGroup = async (req, res) => {
    const owner_id = req.user_id;
    const file_id = req.body.file_id;
    const group_id = req.body.group_id;

    const response = await file_services.shareWithGroup(file_id, owner_id, group_id);
    return res.status(response.statusCode).json(response);
}


module.exports = {
    add_file,
    remove_file,
    show_files,
    shareWithGroup
}