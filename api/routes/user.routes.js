const express = require("express");

const router = express.Router();

const userController = require("../controllers/user.controller");
const { checkUser } = require("../middlewares/auth");



router.post("/register", userController.register);
router.post("/login", userController.login);
router.get("/getUsers", checkUser,userController.getUsers);
router.get("/showUser/:id", checkUser,userController.showUser);
router.delete("/deleteUser", checkUser,userController.deleteUser);
router.get("/notInGroup/:group_id",userController.not_in_group);

module.exports = router;