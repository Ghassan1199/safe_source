const multer = require('multer');
const path = require('path');
const fs = require('fs');
const RError = require('./error');
const {Mutex} = require('async-mutex')

const mutex = new Mutex();

const upload = (keep = true) => {
    !fs.existsSync(`./files`) && fs.mkdirSync(`./files`, { recursive: true })
    const storage = multer.diskStorage(
        {
            destination: (_, _2, cb) => {
                cb(null, `./files`)
            },
            filename: (req, file, cb) => {
                if (req.body.file_name)
                    cb(null, req.body.file_name + path.extname(file.originalname))
                else {
                    const file_name = req.k.data.file.name;
                    cb(null,file_name + path.extname(file.originalname))
                }
            },
        });


    const fileFilter = async (req, file, cb) => {

        const targetPath = path.join('./files', req.body.file_name + path.extname(file.originalname));
        // Check if the file with the same name already exists

        if (fs.existsSync(targetPath)) {

            // Reject the file upload
            return cb(new RError(400, 'File with the same name already exists.'));
        }

        // Accept the file upload
        cb(null, true);
    };

    return multer({ fileFilter, storage }).single('file');
};


module.exports = upload;



