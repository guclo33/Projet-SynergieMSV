const express = require("express")
const router = express.Router();
const {createUser} = require("../controller/loginAndRegister")

router.post("/", createUser)

module.exports = router