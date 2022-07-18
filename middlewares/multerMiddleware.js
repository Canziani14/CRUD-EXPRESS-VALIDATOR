const multer = require("multer");
const path = require ("path");
//procesar registro

//multer (si tiene imagenes)

const storage = multer.diskStorage({
    //indico donde guardar la imagen
    destination: function (req, file, cb) {
        cb(null, "./public/images/avatar");
    },
    //indico el nombre del archivo
    filename: function (req, file, cb) {
        let fileName = `${Date.now()}_img ${path.extname(file.originalname)}`;
        cb(null, fileName);
    }
})
const uploadFile = multer({ storage })

module.exports = uploadFile;