const { Model } = require('../database/db')
const responseMessage = require('../helpers/responseHandler')
const RError = require('../helpers/error');
const Group = Model.Group;
const fs = require('fs');
const GroupUser = Model.GroupUser;
const GroupFile = Model.GroupFile;
const { sequelize } = require('../database/connection');
const { ValidationError } = require('sequelize');
const File = Model.File;
const Booked_file = Model.BFR;

const { Mutex } = require('async-mutex');
const chickInValidator = require('../middlewares/validation/checkValidation');
const dateAndTime = require('date-and-time');

const mutex = new Mutex();


const create = async (file_name, path, owner_id, check, public = false) => {
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


const index = async (owner_id = null, group_id = null, public = true, check) => {
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
            if(check){
                files = filesInGroup.filter(file => file.check);

            }else{
                files = filesInGroup.filter(file => !file.check);
            }

        } else {
            where.check = check;
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
        let statusCode = error.statusCode || 500;

        if (error instanceof ValidationError) statusCode = 400

        return responseMessage(false, statusCode, error.message);

    }


}

const update = async (file_id, user_id) => {

    const file = await File.findByPk(file_id);

    try {

        if (!file) throw new RError(404, "file not found");

        const BF = await Booked_file.findOne({
            where: {
                user_id: user_id, file_id: file_id,
                check_out_date:null
            }
        }
        );

        if (!BF) throw new RError(403, "You Are Not Allowed");

        return responseMessage(true, 200, "file updated Successfully", {file});

    } catch (error) {
        let statusCode = error.statusCode || 500;
        if (file) { if (fs.existsSync(file.path)) fs.unlinkSync(file.path); }
        if (error instanceof ValidationError) statusCode = 400

        return responseMessage(false, statusCode, error.message);

    }


}


const check_in = async (user_id, file_ides, group_id)=>{


    let transaction;
   
    try {

    
        await mutex.acquire();
    
        transaction = await sequelize.transaction();

    for(const file_id of file_ides){

        await chickInValidator(user_id, group_id, file_id);

        const file = await File.findByPk(file_id);
    
        if (!file) throw new RError(404, "file not found");


        if (file.check) throw new RError(400, "checked before");

        const exp_date = dateAndTime.addDays(new Date(), 3);

        await Booked_file.create({ group_id: group_id, user_id: user_id, file_id: file_id, check_in_date: new Date(), exp_date },{transaction});
        file.check = true;
        await file.save({transaction});

    }
            await transaction.commit();
    
            return responseMessage(true, 200, "checked in");
    
        } catch (error) {
            console.log(error)
    
            let statusCode = error.statusCode || 500;
    
            if (error instanceof ValidationError) statusCode = 400
            
    
            if(transaction){
                await transaction.rollback();
            }
    
            return responseMessage(false, statusCode, error.message);
    
        } finally{
            mutex.release();
    
        }

}


const check_out = async (user_id, file_id) => {
   
    let transaction;
    try {

        transaction = await sequelize.transaction();

        const file = await File.findByPk(file_id);
        if (!file) throw new RError(404, "file not found");


        const booked_file = await Booked_file.findOne({
            where: {
                user_id: user_id,
                file_id: file_id,
                check_out_date :null
            }
        });

        if (!booked_file) throw new RError(403, "you are not the one who checked in");
        booked_file.check_out_date = new Date();
        await booked_file.save();

        file.check = false;
        await file.save();
        await transaction.commit();
        return responseMessage(true, 200, "file has been checked out successfully", file);


    } catch (error) {

        let statusCode = error.statusCode || 500;

        if (error instanceof ValidationError) statusCode = 400
        await transaction.rollback();

        return responseMessage(false, statusCode, error.message);

    }

}

const download = async (file_id, user_id) => {
   
    try {

        const file = await File.findByPk(file_id);
        if (!file) throw new RError(404, "file not found");


        const booked_file = await Booked_file.findOne({
            where: {
                user_id: user_id,
                file_id: file_id,
                check_out_date :null
            }
        });

        if (!booked_file) throw new RError(403, "you are not the one who checked in");

    

        return responseMessage(true, 200, "file is sent", file);


    } catch (error) {

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
    shareWithGroup,
    download
}