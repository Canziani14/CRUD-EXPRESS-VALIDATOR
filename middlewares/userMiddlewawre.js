const user = require ("../models/user");

//con esto defino que mostrar en el ejs dependiendo si hay alguien logueado o no
const userLoggedMiddleware = function (req, res, next) {
    res.locals.isLogged=false; //local son variables que puedo compartir a traves de las vistas sin importar el controlador
    

    //recordar usuario con cookies
    let emailInCookie = req.cookies.userEmail //con req solicito la cookie
    let userFromCookie = user.findByField("email", emailInCookie)// si esta, la busco en la base

    if (userFromCookie) {
        req.session.userLogged = userFromCookie; //como tengo alguien en cookie lo paso a session
    }


    if (req.session.userLogged) { // pregunta si en userLogged tiene algo en session, si da true, cambia el islogged a true
        res.locals.isLogged=true
        res.locals.userLogged= req.session.userLogged //paso lo que tengo en session a locals para poder pasarle locals.userLogged a la vista para que muestre
        //la imagen y el nombre en la barra    
    }

    next();

}

module.exports = userLoggedMiddleware