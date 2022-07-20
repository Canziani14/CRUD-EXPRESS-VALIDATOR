const users = require("../database/user.json");
const fs = require("fs");
const path = require("path");
const bcryptjs = require("bcryptjs");
const multer = require("multer");
const { validationResult } = require("express-validator"); //requiere una funcion de express validator, se le pasa todo el req
const user = require("../models/user");
const validaciones = require("../middlewares/validateRegisterMiddleware");
const uploadFile = require("../middlewares/multerMiddleware");




const controller = {
    register: function (req, res) {
        return res.render("../views/registro")
    },

    processRegister: function (req, res) {
        let resultValidation = validationResult(req);

        if (resultValidation.errors.length > 0) {
            return res.render("../views/registro", {
                errors: resultValidation.mapped(),
                oldData: req.body //mapped convierte el array en un objeto literal
            })
        };

        if (resultValidation.isEmpty()) {
          let user = {
            ...req.body,
            password: bcryptjs.hashSync(req.body.password, 10),
            avatar:  req.file ? req.file.filename : '',
          }
          let archivoUsers = fs.readFileSync(path.resolve(__dirname, '../database/user.json'), {
            encoding: 'utf-8'
          });
          let users;
          if (archivoUsers == "") {
            users = [];
          } else {
            users = JSON.parse(archivoUsers);
          };
    
          users.push(user);
          usersJSON = JSON.stringify(users, null, 2);
          fs.writeFileSync(path.resolve(__dirname, '../database/user.json'), usersJSON);
          res.redirect('/user/login');
        }


      /*  if (resultValidation.errors.length > 0) {
            return res.render("../views/registro", {
                errors: resultValidation.mapped(),
                oldData: req.body //mapped convierte el array en un objeto literal
            })
        };

        let userInDB = user.findByField("mail", req.body.mail) // validacion para ver si el email ya esta registrado en la base de datos
        //con el if pregunto si el usuario esta en la base devuelvo error, si no esta, lo crea
        if (userInDB) {
            return res.render("../views/registro", { error: { msg: "este mail ya esta registrado" }, oldData: req.body });
        }
        //crea usuario en base a lo que ingreso el usuario, pero encripta la clave y guarda la imagen (avatar)
        // con la propiedad file de multer
        let userToCreate = {
            ...req.body,
            password: bcryptjs.hashSync(req.body.password, 10),
            avatar: req.file.filename
        };


        let userCreate = user.create(userToCreate)

        return res.redirect("/user/login"); //despues de crear el usuario redirigir a la vista login
*/

    },




    login: function (req, res) {
        return res.render("../views/login")
    },

    processLogin: function (req, res) {
        //creo una variable para validar que no se encuentre ese mail ya registrado
        let userToLogin = user.findByField("email", req.body.mail)
        //si lo encuentra sigue con la validacion de la clave, comparando lo que esta en la base hasheado
        //con lo que escribio el usuario
        if (userToLogin) {
            let isOkPassword = bcryptjs.compareSync(req.body.password, userToLogin.password);
            //el compare devuelve true o false
            //si es true redirecciona a la pagina de usuario
            if (isOkPassword) {
                return res.redirect("/perfildelusuario")
            }
            return res.render("/vista de login", {
                errors: {
                    mail: {
                        msg: "credenciales invalidas"
                    }
                }
            });
        }
        //si es false muestra la pagina del login con los errores
        return res.render("/vista de login", {
            errors: {
                mail: {
                    msg: "no se encuentra el mail en la base de datos"
                }
            }
        })

    },

    profile: function (req, res) {

    }

}


module.exports = controller;
