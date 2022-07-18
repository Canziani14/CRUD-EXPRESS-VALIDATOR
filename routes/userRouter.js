const express = require("express");
const router = express.Router();
const userController = require("../controller/userController");
const multer = require("multer");
const path = require("path");
const valicaciones = require("../middlewares/validateRegisterMiddleware");
const controller = require("../controller/userController");
const validaciones = require("../middlewares/validateRegisterMiddleware");
const uploadFile = require ("../middlewares/multerMiddleware");


//formulario de registro
router.get("/register", userController.register);

router.get ("/login",userController.login);



//procesamiento de registro

router.post("/register",uploadFile.single("avatar"), validaciones , userController.processRegister);  //el upload lleva entre los parentecis el name del input que tiene en el form


//formulario de login
router.get ("/login", userController.login);
/*
//perfil del usuario
router.get ("/profile/:userId", userController.profile);
*/
module.exports = router;