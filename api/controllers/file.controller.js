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

    const responsne = await file_services.remove(file_id,owner_id);

    return res.status(responsne.statusCode).json(responsne);

}


module.exports = {
    add_file,
    remove_file
}