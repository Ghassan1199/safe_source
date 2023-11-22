const express = require("express");

const router = express.Router();

const auth = require('../middlewares/auth')

const groupController = require('../controllers/group.controller')

router.post('/create',auth.checkUser,groupController.createGroup);
router.get('/index',groupController.index);
router.get('/show/:id',groupController.showGroup)
router.delete('/delete/:id',auth.checkUser,groupController.destroyGroup)
router.post('/add_user',groupController.addUserToGroup);

module.exports = router