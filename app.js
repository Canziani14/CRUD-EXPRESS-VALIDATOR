const express = require ("express");
const app = express();

//indico que la carpeta dinamica es public
app.use (express.static ("./public"));

//indico que capture todo lo que se envie desde un formulario via post
app.use(express.urlencoded({extended:false}));

//levanto el servidor
app.listen (3000, function (){
    console.log ("se levanto el servidor en el puerto 3000");
})

//defino ejs
app.set ("view engine", "ejs");

//rutas
//const mainRoutes = require ("./routes/mainRouter");
const userRoutes = require ("./routes/userRouter");

//app.use ("/", mainRoutes);
app.use ("/user", userRoutes);