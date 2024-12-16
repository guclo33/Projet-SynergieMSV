const express = require("express");
const router = express.Router({ mergeParams: true });
const {isAuthenticated} = require("../controller/loginAndRegister");
const { exec } = require('child_process');
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const upload = multer({ dest: 'C:/Users/Guillaume Cloutier/Downloads' });


const { getAdminHomeDataController, getOverviewDataController, getRoadmapDataController, updateRoadmapTodosController, updateOverviewController, getDetailsById, updateDetailsGeneralInfos, updateUserInfos, updateUserPassword, uploadFile, listFile, downloadFile} = require ("../controller/adminController")


router.get("/", getAdminHomeDataController)

router.get("/overview",getOverviewDataController)

router.put("/overview", updateOverviewController)

router.get("/roadmap", getRoadmapDataController)

router.put("/roadmap", updateRoadmapTodosController )

router.get("/details", getAdminHomeDataController)

router.get("/details/:clientid", getDetailsById )

router.put("/details/:clientid", updateDetailsGeneralInfos)

router.put("/settings", updateUserInfos),

router.put("/settings/password", updateUserPassword)

router.post("/details/:category/upload/:leaderName", upload.single("file"), uploadFile);

router.get("/details/:category/list/:leaderName", listFile)

router.get("/details/:category/download/:leaderName/:fileName",  downloadFile)



router.post("/profilgenerator", (req,res) => {
    const { firstName, lastName} = req.body;
    
    if(!firstName || !lastName) {   
        res.status(400).send("Did not receive profile name")
    } 
    const profilName = `${firstName}, ${lastName}`
    const pythonFile = path.join(__dirname, './../GenerateurTexte/Synergia MLM.py');

    exec(`python "${pythonFile}" "${profilName}"`, (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return res.status(500).json({ error: stderr });
        }

        if (stderr) {
            console.error(`stderr: ${stderr}`);
            return res.status(500).json({ error: stderr });
        }

        
        res.json({ message: stdout });
    })

})


module.exports = router