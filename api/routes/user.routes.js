const express = require("express");

const router = express.Router();

const userController = require("../controllers/user.controller");



router.post("/register", userController.register);
router.post("/login", userController.login);
router.get("/getUsers", userController.getUsers);
router.get("/showUser", userController.showUser);
router.delete("/deleteUser", userController.deleteUser);


module.exports = router;