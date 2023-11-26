const multer = require('multer');
const path = require('path');
const fs = require('fs');


const upload = (des) => {
    !fs.existsSync(`./${des}`) && fs.mkdirSync(`./${des}`, { recursive: true })

    const storage = multer.diskStorage(
        {
            destination: (_, _2, cb) => {
                cb(null, `./${des}`)
            },
            filename: (_, file, cb) => {
                cb(null, Date.now() + path.extname(file.originalname))
            },
        });
    return multer({ storage });
};


module.exports = upload;



