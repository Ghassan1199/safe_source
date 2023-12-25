const express = require("express");

const router = express.Router();

const auth = require('../middlewares/auth')

const groupController = require('../controllers/group.controller')

router.post('/create',auth.checkUser,groupController.createGroup);
router.get('/index',auth.checkUser,groupController.index);
router.get('/show/:id',groupController.showGroup)
router.delete('/delete/:id',auth.checkUser,groupController.destroyGroup)
router.post('/add_user',groupController.addUserToGroup);

router.delete('/remove_user/:group_id/:user_id',auth.checkUser,groupController.removeUserFromGroup)

module.exports = router