const express = require("express");
const router = express.Router();
const userController = require("../controller/userController");
const multer = require("multer");
const path = require("path");
const { body } = require("express-validator");  //se necesitas la funcion body de express-validator (check)
const controller = require("../controller/mainController");
const mainController = require("../controller/mainController");

router.get ("/", mainController.home );

module.exports = router;