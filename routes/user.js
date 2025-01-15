const express = require("express");
const router = express.Router({ mergeParams: true });
const {getObjectifsDataController , createObjectifsUserController, updateObjectifsUserController, deleteObjectifsDataController, getAdminHomeDataController, getDetailsById, updateDetailsGeneralInfos} = require("../controller/adminController");
const { getUserDataController, getUserPhotosController } = require("../controller/userController");

router.get("/", getUserDataController)

router.get("/photos", getUserPhotosController)

router.get("/objectifs", getObjectifsDataController)

router.post("/objectifs", createObjectifsUserController)

router.put("/objectifs", updateObjectifsUserController)

router.delete("/objectifs", deleteObjectifsDataController)



router.get("/details/", getDetailsById )

router.put("/details/", updateDetailsGeneralInfos)

module.exports = router