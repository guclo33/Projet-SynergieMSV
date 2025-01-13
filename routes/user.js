const express = require("express");
const router = express.Router({ mergeParams: true });
const {getObjectifsDataController , createObjectifsUserController, updateObjectifsUserController, deleteObjectifsDataController} = require("../controller/adminController")

router.get("/objectifs", getObjectifsDataController)

router.post("/objectifs", createObjectifsUserController)

router.put("/objectifs", updateObjectifsUserController)

router.delete("/objectifs", deleteObjectifsDataController)

module.exports = router