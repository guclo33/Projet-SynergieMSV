const express = require("express");
const router = express.Router({ mergeParams: true });
const path = require('path');
const multer = require('multer');
const memoryStorage = multer.memoryStorage();
const upload = multer({ storage: memoryStorage });
const {createFormController, uploadProfilPhotoController} = require("../controller/formController")

router.post("/", createFormController);

router.post("/photo", uploadProfilPhotoController)




module.exports = router