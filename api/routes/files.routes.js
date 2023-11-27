const express = require("express");

const router = express.Router();
const upload = require('../helpers/upload');
const auth = require('../middlewares/auth')

const file_controller = require('../controllers/file.controller');

router.use(auth.checkUser);


router.post('/add', upload(), file_controller.add_file);
router.delete('/delete/:file_id', file_controller.remove_file);
router.get('/index', file_controller.show_files);
router.post('/share_with_group', file_controller.shareWithGroup);

router.use((err, req, res, next) => {
    if (err) {
        console.error(err.message);
        res.status(400).json({ error: err.message });
    } else {
        next();
    }
});



module.exports = router;