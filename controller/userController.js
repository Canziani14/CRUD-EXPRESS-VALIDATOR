const fs = require("fs");
const path = require("path");
const bcryptjs = require("bcryptjs");
const { validationResult, body } = require("express-validator"); //requiere una funcion de express validator, se le pasa todo el req
const user = require("../models/user");



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
                delete userToLogin.password //con esto eliminamos almacenar la contraseña en sesion (es por seguridad)
                req.session.userLogged = userToLogin; //con esto guardo los datos del usuario que entro a login y paso las validaciones

                if (req.body.remember_user) {//remember_user es como se llama en el formulario el checkbox
                    res.cookie("userEmail", req.body.email, {maxAge:(1000*60)*2})//metodo que tengo en el res que permite guardar algo en el navegador
                }//como las mando viajan en el res
                //la cookie lleva primero el nombre que le damos, despues lo que va a guardar y despues la duracion

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
    //con esto le mando al perfil la sesion del usuario que se habia logueado
    profile: function (req, res) {
        return res.render ("perfil", {
            user: req.session.userLogged   //indico que de session utilice userlogged, que contiene guardado al usuario que ingreso
        });
    },
    //logout
    // solo borra todo lo que esta en session
    logout: function (req, res) {
        req.session.destroy()
        return res.redirect ("/"); // y redirijo a la home
    }


}

module.exports = controller;