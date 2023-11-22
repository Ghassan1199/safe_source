const { Model } = require('../database/db')
const responseMessage = require('../helpers/responseHandler')
const RError = require('../helpers/error');
const Group = Model.Group;
const { getUser } = require('../middlewares/auth')
const { sequelize } = require('../database/connection');


const create = async (req) => {
    try {

        const transaction = await sequelize.transaction();
        const group = await Group.create({
            "name": req.body.name,
            "owner_id": req.user_id
        }, { transaction: transaction })


        await transaction.commit();

        return responseMessage(true, 200, "group created Successfully", group)

    } catch (err) {
        console.log(err)
        return responseMessage(false, 400, "couldn`t create the group", err)

    }


}

const index = async () => {
    try {

        const groups = await Group.findAll();
        return responseMessage(true, 200, "groups returned successfully", groups)

    } catch (err) {
        console.log(err)
        return responseMessage(false, 400, "couldn`t fetch the groups", err)

    }

}

const show = async (req) => {
    try {

        const group = await Group.findByPk(req.params.id)
        if (!group) throw new RError(404, "not found")
        return responseMessage(true, 200, "group returned successfully", group)


    } catch (error) {
        const statusCode = error.statusCode || 500;
        return responseMessage(false, statusCode, error.message);
    }
}

const destroy = async (req) => {
    try {

        const group = await Group.findByPk(req.params.id)

        if (!group) throw new RError(404, "not found")

        if (req.user_id != group.owner_id) throw new RError(403, "you are not autherized")

        await group.destroy();

        return responseMessage(true, 200, "group is deleted");

    } catch (error) {

        const statusCode = error.statusCode || 500;
        return responseMessage(false, statusCode, error.message);

    }
}

const addUser = (req) => {
    
}

const removeUser = (req) => {

}

module.exports = {
    create,
    index,
    show,
    destroy,
    addUser,
    removeUser
}