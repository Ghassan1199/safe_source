const { Model } = require('../../database/db');
const GroupUser = Model.GroupUser;
const GroupFile = Model.GroupFile;
const RError = require('../../helpers/error')


const chickInValidator = async(user_id, group_id, file_id)=>
{


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
}

module.exports = chickInValidator;