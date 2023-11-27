const { Model } = require('../database/db')
const responseMessage = require('../helpers/responseHandler')
const RError = require('../helpers/error');
const Group = Model.Group;
const fs = require('fs');
const GroupUser = Model.GroupUser;
const GroupFile = Model.GroupFile;
const { sequelize } = require('../database/connection');
const { ValidationError, DATE } = require('sequelize');
const File = Model.File;

//TODO must add the group_id so the file is added to the group ; 
const create = async (file_name, path, owner_id, check, public) => {
    try {

        const file = await File.create({ name: file_name, path, date: new Date(), check, public, owner_id });
        return responseMessage(true, 200, "file added Successfully", file);

    } catch (error) {
        let statusCode = error.statusCode || 500;
        if (fs.existsSync(path)) fs.unlinkSync(path);
        if (error instanceof ValidationError) statusCode = 400

        return responseMessage(false, statusCode, error.message);

    }
}

const remove = async (file_id, owner_id) => {

    try {
        const file = await File.findByPk(file_id);
        console.log(file)
        if (file == null) throw new RError(404, "not found");

        if (file.owner_id != owner_id) throw new RError(403, "not authorized");

        if (fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
        }

        await file.destroy();

        return responseMessage(true, 200, "file deleted succesffuly");

    } catch (error) {
        let statusCode = error.statusCode || 500;

        if (error instanceof ValidationError) statusCode = 400

        return responseMessage(false, statusCode, error.message);

    }

}

//TODO should return only the files_id
const index = async (group_id = null) => {
    try {
        if (!group_id) throw new RError(400, "no group_id is givin");
        const group_files = await GroupFile.findAll({
            where: {
                groupId: group_id
            }
        });

        if (group_files.length == 0) throw new RError(404, "no files found in this group");

        return responseMessage(true, 200, "files_id is sent", group_files);

    } catch (error) {
        let statusCode = error.statusCode || 500;

        if (error instanceof ValidationError) statusCode = 400

        return responseMessage(false, statusCode, error.message);

    }
}

//user and file must be in the same group or the file must be public 
//the user must be the one who checked the file in
const update = async (file_id, user_id) => {

}

//the file must be checked out
const check_in = async (user_id, file_id) => {

}

//the file must be checked in and the user is the one whos checked in
const check_out = async (user_id, file_id) => {

}


module.exports = {
    create,
    remove,
    update,
    index,
    check_in,
    check_out
}