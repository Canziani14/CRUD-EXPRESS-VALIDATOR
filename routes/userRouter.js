const express = require("express");
const router = express.Router();
const userController = require("../controller/userController");
const multer = require("multer");
const path = require("path");
const { body } = require("express-validator");  //se necesitas la funcion body de express-validator (check)


//formulario de registro
router.get("/register", userController.register);


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

//genero array de validaciones para poner en el post
//body recibe el name del input
//not empty valida que los campos del form no esten vacios
const validaciones = [
    body("fullName").notEmpty().withMessage("tenes que escribir un nombre"),
    body("email")
        .notEmpty().withMessage("tenes que escribir un email")   //bail() es un metodo que corta las validaciones si se produjo el error en la linea
        .isEmail().withMessage("debes escribir un formato de email valido"),
    body("password").notEmpty().withMessage("tenes que escribir una contraseña"),
    //los .custom los defino yo y el throw new Error (" ") siempre va para mostrar el error
    body("avatar").custom(function (value, { req }) {
        let file = req.file; //obtengo el archivo por multer ya que ya declare que traiga el archivo por separado
        let acceptedExtension = [".jpg", ".png",".gif"] //genero un array con las extensiones de imagenes permitidas
        if (!file) { //si no encuentra una imagen ejecuta el error. lo niega porque si no hay nada es undifined (false) y si lo niego ! es true, y ejecuta el mensaje de error 
            throw new Error("tienes que subir una imagen");
        } else {
            let fileExtension = path.extname (file.originalname);
            if (!acceptedExtension.includes(fileExtension)) { //include devuelve un true o false dependiendo si encuentra el elemento en el array
                throw new Error (`las extensiones de archivos permitidas son ${acceptedExtension.join (`, `)} `);
            }
        }
        return true
    }),
]

//procesamiento de registro

router.post("/register", uploadFile.single("avatar"), validaciones, userController.processRegister);  //el upload lleva entre los parentecis el name del input que tiene en el form

/*
//formulario de login
router.get ("/login", userController.login);

//perfil del usuario
router.get ("/profile/:userId", userController.profile);
*/
module.exports = router;