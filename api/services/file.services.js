const { Model } = require('../database/db')
const responseMessage = require('../helpers/responseHandler')
const RError = require('../helpers/error');
const Group = Model.Group;
const fs = require('fs');
const GroupUser = Model.GroupUser;
const GroupFile = Model.GroupFile;
const { sequelize } = require('../database/connection');
const { ValidationError, DATE } = require('sequelize');
const booked_file_report = require('../models/booked_file_report');
const File = Model.File;
const Booked_file = Model.BFR;

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


const index = async (owner_id = null, group_id = null, public = true, check = false) => {
    try {

        const where = {};
        let files;
        if (owner_id) where.owner_id = owner_id
        where.public = public;

        if (group_id) {
            where.group_id = group_id;
            const group = await Group.findByPk(group_id, {
                include: {
                    model: File,
                    through: {
                        model: GroupFile,
                    },
                },
                where: where
            });

            if (!group) {
                throw new RError(404, 'this group in not found')
            }

            const filesInGroup = await group.files;
            files = filesInGroup
            console.log(filesInGroup);

        } else {
            files = await File.findAll({
                where: where
            })
        }

        return responseMessage(true, 200, "files is sent", files);

    } catch (error) {

        let statusCode = error.statusCode || 500;

        if (error instanceof ValidationError) statusCode = 400

        return responseMessage(false, statusCode, error.message);

    }
}

const shareWithGroup = async (file_id, owner_id, group_id) => {
    try {
        const file = await File.findByPk(file_id);

        if (!file) throw new RError(404, "file not found");

        if (file.owner_id != owner_id) throw new RError(403, "you are not the file owner");

        const group_user = await GroupUser.findOne({
            where: {
                userId: owner_id,
                groupId: group_id
            }
        });
        if (!group_user) throw new RError(403, "you are not in the group");

        await GroupFile.create({
            groupId: group_id,
            fileId: file_id
        })

        return responseMessage(true, 200, "file shared with group successfully");

    } catch (error) {
        console.log(error)
        let statusCode = error.statusCode || 500;

        if (error instanceof ValidationError) statusCode = 400

        return responseMessage(false, statusCode, error.message);

    }


}

//user and file must be in the same group or the file must be public 
//the user must be the one who checked the file in
const update = async (file_id, user_id) => {

    const file = await File.findByPk(file_id);


    try {

        if (!file) throw new RError(404, "file not found");
    
        const BF = await Booked_file.findOne({ 
            where:{
            user_id: user_id, file_id: file_id }
        }
            );
    
        if (!BF) throw new RError(403, "You Are Not Allowed");

        return responseMessage(true, 200, "file updated Successfully", file);

    } catch (error) {
        let statusCode = error.statusCode || 500;
if(file){if(fs.existsSync(file.path)) fs.unlinkSync(file.path);}
        if (error instanceof ValidationError) statusCode = 400

        return responseMessage(false, statusCode, error.message);

    }


}


const check_in = async (user_id, file_id, group_id) => {

    try {

        const file = await File.findByPk(file_id);
        if (!file) throw new RError(404, "file not found");

        if (file.check) throw new RError(400, "file is checked before");

        if (file.owner_id == user_id) {
            file.check = true;
            await Booked_file.create({ group_id:group_id,user_id: user_id, file_id: file_id,check_in_date:new Date() });
            await file.save();

            return responseMessage(true, 200, "file has been checked in successfully", file);
        }

        const group_user = await GroupUser.findOne({
            where: {
                userId: user_id,
                groupId: group_id
            }
        });

        if (!group_user) throw new RError(403, "you are not in the group");

        const file_group = await GroupFile.findOne({
            where: {
                fileId: file_id,
                groupId: group_id
            }
        });

        if (!file_group) throw new RError(403, "the file is not in the group");

        await Booked_file.create({ group_id:group_id,user_id: user_id, file_id: file_id,check_in_date:new Date() });
        file.check = true;
        await file.save();

        return responseMessage(true, 200, "file has been checked in successfully", file);


    } catch (error) {

        console.log(error)
        let statusCode = error.statusCode || 500;

        if (error instanceof ValidationError) statusCode = 400

        return responseMessage(false, statusCode, error.message);

    }


}


const check_out = async (user_id, file_id) => {
    try {

        const file = await File.findByPk(file_id);
        if (!file) throw new RError(404, "file not found");

        if (!file.check) throw new RError(400, "file is already checked out before");

        if (file.owner_id == user_id) {
            file.check = false;
            await file.save();
            return responseMessage(true, 200, "file has been checked out  successfully", file);
        }

        const group_user = await GroupUser.findOne({
            where: {
                userId: user_id,
                groupId: group_id
            }
        });

        if (!group_user) throw new RError(403, "you are not in the group");

        const file_group = await GroupFile.findOne({
            where: {
                fileId: file_id,
                groupId: group_id
            }
        });

        if (!file_group) throw new RError(403, "the file is not in the group");


        const booked_file = await Booked_file.findOne({
            where:{
                user_id : user_id,
                file_id : file_id,
                group_id : group_id
            }
        });
        if(!booked_file) throw new RError(403, "you are not the one who checked in");
        await booked_file.destroy();

        file.check = false;
        await file.save();
        return responseMessage(true, 200, "file has been checked out successfully", file);


    } catch (error) {

        console.log(error)
        let statusCode = error.statusCode || 500;

        if (error instanceof ValidationError) statusCode = 400

        return responseMessage(false, statusCode, error.message);

    }

}




module.exports = {
    create,
    remove,
    update,
    index,
    check_in,
    check_out,
    shareWithGroup
}