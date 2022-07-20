const { json } = require("express");
const fs = require ("fs");

const user = {

    //trae el archivo json
    filename: "./database/user.json",

    //convierte el archivo json en un array de objetos literales
    getData: function () {
        return JSON.parse(fs.readFileSync(this.filename, "utf-8"));
    },

    //

    findAll: function () {
        return this.getData();
    },

    //buscar usuarios por id
    findByPK: function (id) {
        let allUsers= this.findAll();
        let userFound = allUsers.find(oneUser => oneUser.id === id);
        return userFound;
    },

    //busca por cualquier propiedad, por eso, se ingresan 2 parametros
    // uno para la propiedad, y otro para el buscador
    //field = a la propiedad (name, mail,etc.) y text es el valor (matias, mcanziani12@gmail.com)
    //

    findByField: function (field, text) {
        let allUsers= this.findAll();
        let userFound = allUsers.find(oneUser => oneUser[field] === text );
        return userFound;
    },

    //crear un usuario

    //genera ID del nuevo usuario
    generateID: function () {
        let allUsers = this.findAll();
        let lastUser = allUsers.pop (); //guarda el ultimo usuario creado para tener el ultimo id
        if (lastUser) {
            return lastUser.id ; // le suma 1 al ultimo id
        }
        return 1 ; // y si detecta que no hay nada empieza por el id 1
    },

    create: function (userData) {
        let allUsers = this.findAll ();
        //creamos nuevo usuario y especuficamos que id va a ser la propiedad generateID
        let newUser = {   
            id: this.generateID(),
            ...userData,
        }
        allUsers.push(newUser);  //dentro de allUser metemos el newUser
        fs.writeFileSync(this.filename, JSON.stringify (allUsers, null, " ")); // escribimos el archivo con el newUser
        return ("Usuario Creado");
    },

    //eliminar usuario
    delete: function (id) {
        let allUser = this.findAll();
        //busca y crea un array finalUser con todos los id que no sean el ingresado (entonces lo borra)
        let finalUser = allUser.filter (oneUser => oneUser.id !== id);
        //reescribe el archivo eliminando el id seleccionado
        fs.writeFileSync(this.filename, JSON.stringify(finalUser, null , " "));
        return ("Usuario Eliminado")
    },

    //editar user
    edit: function () {

    }
}


module.exports = user