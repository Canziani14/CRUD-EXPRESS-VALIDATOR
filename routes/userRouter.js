const express = require("express");
const router = express.Router();
const userController = require("../controller/userController");
const validaciones = require("../middlewares/validateRegisterMiddleware");
const uploadFile = require ("../middlewares/multerMiddleware");
const guestMiddleware = require ("../middlewares/guestMiddleware");
const authMiddleware = require ("../middlewares/authMiddleware");



//formulario de registro
router.get("/register", guestMiddleware,  userController.register); //le paso un middleware que verifica si hay un usuario, si hay un usuario ehecuta el middle
//procesamiento de registro

router.post("/register", validaciones, uploadFile.single("avatar"), userController.processRegister);  //el upload lleva entre los parentecis el name del input que tiene en el form


//formulario de login
router.get ("/login", guestMiddleware, userController.login); //le paso un middleware que verifica si hay un usuario, si hay un usuario ehecuta el middle
//procesamiento login
router.post ("/login",validaciones, userController.processLogin);

//perfil del usuario
router.get ("/profile",authMiddleware, userController.profile); //le paso un middleware que hace que no se pueda entrar a un perfil si no hay nadie logueado

//Logout
//destruye lo que hay en session para cerrar sesion del usuario
router.get ("/logout", userController.logout);


module.exports = router;