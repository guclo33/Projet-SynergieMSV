const express = require("express");
const router = express.Router({ mergeParams: true });
const path = require('path');
const multer = require('multer');
const memoryStorage = multer.memoryStorage();
const upload = multer({ storage: memoryStorage });
const {createFormController, uploadProfilPhotoController, createUrl, getUrlParams} = require("../controller/formController")

router.post("/", createFormController);

router.post("/photo", uploadProfilPhotoController)

router.post("/url", createUrl)

router.get("/url/:formId", getUrlParams)




module.exports = router