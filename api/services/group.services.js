const { Model } = require('../database/db')
const responseMessage = require('../helpers/responseHandler')
const RError = require('../helpers/error');
const Group = Model.Group;
const GroupUser = Model.GroupUser;
const { sequelize } = require('../database/connection');
const { ValidationError } = require('sequelize');
const User = Model.User;
const file_services = require("./file.services");

const create = async (name, owner_id) => {
    const transaction = await sequelize.transaction();
    try {

        const group = await Group.create({
            "name": name,
            "owner_id": owner_id
        }, { transaction: transaction })

        addUser(group.id, owner_id)

        await transaction.commit();

        return responseMessage(true, 200, "group created Successfully", group)

    } catch (err) {
        console.log(err)
        await transaction.rollback();
        return responseMessage(false, 400, "couldn`t create the group", err)

    }


}

const index = async (user_id = null, owner_id = null) => {
    try {

        let data;
        const where = {};

        if(owner_id) where.owner_id = owner_id;
        
        data = await User.findAll({
            where: user_id,
            include: [{
                model: Group,
                attributes: ['id', 'name'],
                where:where
            }],
        });


        return responseMessage(true, 200, "groups returned successfully", data)

    } catch (err) {
        console.log(err)
        return responseMessage(false, 400, "couldn`t fetch the groups", err)

    }

}

const show = async (group_id) => {
    try {

        const group = await Group.findByPk(group_id)
        if (!group) throw new RError(404, "not found")
        return responseMessage(true, 200, "group returned successfully", group)


    } catch (error) {
        const statusCode = error.statusCode || 500;
        return responseMessage(false, statusCode, error.message);
    }
}

const destroy = async (group_id, owner_id) => {
    try {

        const group = await Group.findByPk(group_id)

        if (!group) throw new RError(404, "not found")

        if (owner_id != group.owner_id) throw new RError(403, "you are not autherized")

        await group.destroy();

        return responseMessage(true, 200, "group is deleted");

    } catch (error) {

        const statusCode = error.statusCode || 500;
        return responseMessage(false, statusCode, error.message);

    }
}

const addUser = async (group_id, user_id) => {
    try {
        const group = await Group.findByPk(group_id);
        if (!group) throw new RError(404, "group not found");
        const user = await User.findByPk(user_id);
        if (!user) throw new RError(404, "user not found");

        const group_user = await GroupUser.create({
            groupId: group_id,
            userId: user_id
        });

        return responseMessage(true, 200, "user add successfully", group_user);

    } catch (error) {

        let statusCode = error.statusCode || 500;

        if (error instanceof ValidationError) statusCode = 400

        return responseMessage(false, statusCode, error.message);

    }
}

const removeUser = async (user_id, group_id, user) => {
    try {

        const group = await Group.findByPk(group_id);

        if (!group) throw new RError(404, "group not found");

        if (group.owner_id == user_id) throw new RError(400, "can`t remove the group owner ");

        if (group.owner_id != user && user != user_id) throw new RError(403, "not autherized");

        const group_user = await GroupUser.findOne({
            where: {
                userId: user_id,
                groupId: group_id
            }
        });

        if (!group_user) throw new RError(404, "user not found");

        const files = await Model.BFR.findAll({
            where: {
                user_id: user_id,
                check_out_date: null
            },
            include: {
                model: Model.File,
                attributes: ['name']
            }
        });

        for(let file of files){
            console.log(file)
            await file_services.check_out(user_id, file.file_id);
        }

        await group_user.destroy();

        return responseMessage(true, 200, "user removed successfully", group_user);

    } catch (error) {

        let statusCode = error.statusCode || 500;

        if (error instanceof ValidationError) statusCode = 400

        return responseMessage(false, statusCode, error.message);
    }

}

module.exports = {
    create,
    index,
    show,
    destroy,
    addUser,
    removeUser,
}