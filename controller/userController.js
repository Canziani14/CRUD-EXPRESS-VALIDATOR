const users = require("../database/user.json");
const fs = require("fs");
const path = require("path");
const bcryptjs = require("bcryptjs");
const multer = require("multer");
const { validationResult, body } = require("express-validator"); //requiere una funcion de express validator, se le pasa todo el req
const user = require("../models/user");
const validaciones = require("../middlewares/validateRegisterMiddleware");
const uploadFile = require("../middlewares/multerMiddleware");






const controller = {

    //Trae el formulario de registro
    register: function (req, res) {
        return res.render("registro")
    },
    // Procesa el registro
    processRegister: function (req, res) {
        let resultValidation = validationResult(req);
        

        let userInDB = user.findByField("email", req.body.email) // validacion para ver si el email ya esta registrado en la base de datos
        //con el if pregunto si el usuario esta en la base devuelvo error, si no esta, lo crea
        if (userInDB) {

            return res.render("registro", {
                errors: {
                    email: {
                        msg: "este mail ya esta registrado en la base de datos"
                    },
                },
                oldData: req.body
            });

        }


        if (resultValidation.errors.length > 0) {
            return res.render("registro", {
                errors: resultValidation.mapped(),
                oldData: req.body //mapped convierte el array en un objeto literal
            })
        };




        if (resultValidation.isEmpty()) {
            //crea usuario en base a lo que ingreso el usuario, pero encripta la clave y guarda la imagen (avatar)
            // con la propiedad file de multer
            let userToCreate = {
                ...req.body,
                password: bcryptjs.hashSync(req.body.password, 10),
                avatar: req.file.filename
            };


            let userCreate = user.create(userToCreate)

            return res.redirect("login"); //despues de crear el usuario redirigir a la vista login
        }



        let archivoUsers = fs.readFileSync(path.resolve(__dirname, '../database/user.json'), { encoding: 'utf-8' });
        let users;
        if (archivoUsers == "") {
            users = [];
        } else {
            users = JSON.parse(archivoUsers);
        };

        users.push(userCreate);
        usersJSON = JSON.stringify(userCreate, null, 2);
        fs.writeFileSync(path.resolve(__dirname, '../database/user.json'), usersJSON);
        res.redirect('/user/login');
    },

    //Trae el formilario de login

    login: function (req, res) {
        return res.render("login")
    },

    //Procesa el formulario de login

    processLogin: function (req, res) {
        //creo una variable para validar que no se encuentre ese mail ya registrado
        let userToLogin = user.findByField("email", req.body.email)
        //si lo encuentra sigue con la validacion de la clave, comparando lo que esta en la base hasheado
        //con lo que escribio el usuario
        //primero va lo que escrivio el usuario y despues la clave hascheada
        if (userToLogin) {
            let isOkPassword = bcryptjs.compareSync(req.body.password, userToLogin.password);
            //el compare devuelve true o false
            //si es true redirecciona a la pagina de usuario
            
            if (isOkPassword) {
                req.session.userLogged = userToLogin; //con esto guardo los datos del usuario que entro a login y paso las validaciones
                return res.redirect ("/user/profile")
            }
            return res.render("login", {
                errors: {
                    password: {
                        msg: "Contraseña Incorrecta"
                    }
                }
            });
        }
        //si es false muestra la pagina del login con los errores
        return res.render("login", {
            errors: {
                email: {
                    msg: "no se encuentra el mail en la base de datos"
                }
            }
        })
    },

    profile: function (req, res) {
        return res.send (req.session)
    }


}

module.exports = controller;