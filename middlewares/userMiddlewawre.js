//con esto defino que mostrar en el ejs dependiendo si hay alguien logueado o no
const session = require("express-session");

const userLoggedMiddleware = function (req, res, next) {
    res.locals.isLogged=false; //local son variables que puedo compartir a traves de las vistas sin importar el controlador
    
    if (req.session.userLogged) { // pregunta si en userLogged tiene algo, si da true, cambia el islogged a true
        res.locals.isLogged=true    
    }

    next();

}

module.exports = userLoggedMiddleware