/*
middleware para verificar si hay un usuario logeado que no me permita entrar al form de login
o de registrer.
este middleware se pone en la ruta de login y registrer para validar
*/

const guestMiddleware = function  (req, res, next){
    if (req.session.userLogged){
        return res.redirect ("/user/profile")
    }
    next();

}

module.exports = guestMiddleware;