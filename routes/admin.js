const express = require("express");
const router = express.Router({ mergeParams: true });
const {isAuthenticated} = require("../controller/loginAndRegister");
const { exec } = require('child_process');
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const memoryStorage = multer.memoryStorage();
const upload = multer({ storage: memoryStorage });


const { getAdminHomeDataController, getOverviewDataController, getRoadmapDataController, updateRoadmapTodosController, updateOverviewController, getDetailsById, updateDetailsGeneralInfos, updateUserInfos, updateUserPassword, uploadFile, listFile, downloadFile, addRoadmapTodos, deleteRoadmapTodos, deleteFile, getObjectifsDataController, createObjectifsDataController, updateObjectifsDataController, deleteObjectifsDataController, getProfilePhoto, createGroupController, createLeaderController, updateGroupController, updateProfileController} = require ("../controller/adminController");
const { connectCanvaDetail, generateTemplate } = require("../server/canvaTemplate");


router.get("/", getAdminHomeDataController)

router.get("/overview",getOverviewDataController)

router.put("/overview", updateOverviewController)

router.get("/objectifs/:clientid", getObjectifsDataController)

router.post("/objectifs/:clientid", createObjectifsDataController)

router.put("/objectifs/:clientid", updateObjectifsDataController)

router.delete("/objectifs/:clientid", deleteObjectifsDataController)

router.get("/roadmap", getRoadmapDataController)

router.put("/roadmap", updateRoadmapTodosController )

router.post("/roadmap/:clientid", addRoadmapTodos)

router.delete("/roadmap/:clientid", deleteRoadmapTodos)

router.get("/details", getAdminHomeDataController)

router.put("/details/profileUpdate", updateProfileController)

router.post("/details/canva/:clientid", generateTemplate)

router.get("/details/:clientid", getDetailsById )

router.put("/details/:clientid", updateDetailsGeneralInfos)



router.put("/settings", updateUserInfos),

router.put("/settings/password", updateUserPassword)

router.post("/details/:category/upload/:leaderName", upload.single("file"), uploadFile);

router.get("/details/:category/list/:leaderName", listFile)

router.get("/details/:category/download/:leaderName/:fileName", downloadFile);

router.delete("/details/:category/delete/:leaderName/:fileName", deleteFile)

router.get("/profilePhoto/:nomLeader/:clientName", getProfilePhoto)

router.post("/gestion/groupe", createGroupController);

router.put("/gestion/groupe", updateGroupController)

router.post("/gestion/leader", createLeaderController)



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