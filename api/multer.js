const multer  = require('multer')
const path = require('path')
module.exports = multer({
    storage: multer.diskStorage({}),
    fileFilter: (req, file, cb) => {
        let ext = path.extname(file.originalname);
        if(ext !== '.jpeg' && ext !== '.jpg' && ext !== '.png'){
            console.log("file is not supported")
            cb(null, false);
            return;
        }
        cb(null, true)
    },
});