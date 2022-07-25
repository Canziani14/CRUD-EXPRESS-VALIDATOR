const express = require ("express");
const { body } = require("express-validator");
const app = express();
const path = require("path");
const session = require ("express-session");


//rutas
const mainRoutes = require ("./routes/mainRouter");
const userRoutes = require ("./routes/userRouter");


//indico session
//con session puedo acceder a todo lo que tengo en el 
app.use (session({
    secret : "Logeo de session",
    resave: false,
    saveUninitialized: false
}));

//indico que la carpeta dinamica es public
app.use (express.static ("./public"));

//indico que capture todo lo que se envie desde un formulario via post
app.use(express.json())
app.use(express.urlencoded({extended:false}));

//levanto el servidor
app.listen (3000, function (){
    console.log ("se levanto el servidor en el puerto 3000");
})

//defino ejs
app.set('views', path.join(__dirname, 'views'));
app.set ("view engine", "ejs");


//defino los use
app.use ("/", mainRoutes);
app.use ("/user", userRoutes);



