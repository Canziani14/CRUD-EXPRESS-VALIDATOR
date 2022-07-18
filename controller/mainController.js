const users = require("../database/user.json");
const fs = require("fs");
const path = require("path");
const bcryptjs = require("bcryptjs");
const multer = require("multer");
const { validationResult } = require("express-validator"); //requiere una funcion de express validator, se le pasa todo el req
const user = require("../models/user");


const mainController = {
    home: function (req, res) {
        return res.render("../views/home")
    },
}

module.exports = mainController;