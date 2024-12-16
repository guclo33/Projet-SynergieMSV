const express = require("express");
const router = express.Router();
const {login} = require("../controller/loginAndRegister")

router.post("/", login)

module.exports = router