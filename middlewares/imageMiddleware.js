const multer = require("multer");
const path = require("path");
const ApiError = require("../utils/ApiError");

// const storage = multer.diskStorage({
//     destination: function(req, file, cb){
//         cb(null, './uploads/')
//     },
//     filename: (req, file, cb) => {
//         cb(null, `${file.fieldname}-${req.user.uuid}-${Date.now()}${path.extname(file.originalname)}`)
//     }
// })
const storage = multer.memoryStorage()

const upload = multer({
    storage,
    limits: { fileSize: 1000000 },
    fileFilter: (req, file, cb) => {
        checkFileType(file, cb)
    }
}).single('profileImage');

function checkFileType(file, cb) {
  const filetypes = /jpeg|jpg|png|gif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new ApiError(400, 'Please upload image only'), false);
  }
}

module.exports = upload;