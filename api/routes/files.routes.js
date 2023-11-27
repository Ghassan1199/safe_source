const express = require("express");

const router = express.Router();
const upload = require('../helpers/upload');
const auth = require('../middlewares/auth')

const file_controller = require('../controllers/file.controller');


router.post('/add', auth.checkUser, upload(), file_controller.add_file);
router.delete('/delete/:file_id', auth.checkUser, file_controller.remove_file);
router.get('/index/:group_id', auth.checkUser, file_controller.show_files);





module.exports = router;