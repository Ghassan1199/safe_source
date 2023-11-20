const { Model } = require('../database/db')
const responseMessage = require('../helpers/responseHandler')
const RError = require('../helpers/error');
const Group = Model.Group;
const { getUser } = require('../middlewares/auth')
const { sequelize } = require('../database/connection')
const User = Model.User;


const create = async (req) => {
    try{
        const token = req.headers["auth"];
        const user = getUser(token);
        const transaction = await sequelize.transaction();
        const group = await Group.create({
            "name": req.body.name,
            "owner_id": user.id
        }, { transaction: transaction })

        await transaction.commit();
        return responseMessage(true,200,"group created Successfully",group)


    }catch(err){
        console.log(err)
    }


}

const index = () => {

}

const show = (req) => {

}

const destroy = (req) => {

}

const addUser = (req) => {

}

const removeUser = (req) => {

}

module.exports = {
    create
}