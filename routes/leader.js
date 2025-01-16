const express = require("express");
const router = express.Router({ mergeParams: true });
const {getObjectifsDataController , createObjectifsUserController, updateObjectifsUserController, deleteObjectifsDataController, getAdminHomeDataController, getDetailsById, updateDetailsGeneralInfos} = require("../controller/adminController");
const { getLeaderDataController, getLeaderPhotosController } = require("../controller/leaderController");


router.get("/", getLeaderDataController)

router.get("/:nomLeader/:clientName/photos", getLeaderPhotosController)

router.get("/objectifs", getObjectifsDataController)

router.post("/objectifs", createObjectifsUserController)

router.put("/objectifs", updateObjectifsUserController)

router.delete("/objectifs", deleteObjectifsDataController)


router.get("/details/", getDetailsById )

router.put("/details/", updateDetailsGeneralInfos)

module.exports = router