const {getAdminHomeData, getOverviewData, getRoadmapData, updateRoadmapTodos, updateOverview, getDetailsData, updateDetailsGeneralInfosQuery, updateUserInfosQuery, updateUserPasswordQuery, addTodosQuery, deleteRoadmapTodosQuery} = require("../model/tasks")
const bcrypt = require("bcryptjs");
const multer = require('multer');
const path = require('path');
const fs = require('fs')


const getAdminHomeDataController = async (req,res) => {
    try {
        const data = await getAdminHomeData()
        
        if(data){
            
            return  res.status(200).send(data)
        }
        res.send(404).send("no data found")
        return
    } catch (error){
        return res.send(500).send("internal server error")
    }
};

const getOverviewDataController = async (req, res) =>{
    try {
        const data = await getOverviewData()
        
        if(data){
            
            return  res.status(200).send(data)
        }
        res.send(404).send("no data found")
        return
    } catch (error){
        return res.send(500).send("internal server error")
    }
};

const getRoadmapDataController = async (req, res) =>{
    
    try {
        const data = await getRoadmapData()
       
        
        if(data){
            console.log("leader =", data.rows)
            console.log("Data from SQL query:", JSON.stringify(data.rows, null, 2))
            return  res.status(200).send({ rows: data.rows })
        }
        res.status(404).send("no data found")
        return
    } catch (error){
        console.log("erreur getRoadmap")
        return res.status(500).send("internal server error")
    }
}

const updateRoadmapTodosController = async (req, res) => {
    const {is_completed, task, leaderid} = req.body
    
    if ( !task || !leaderid) {
        return res.status(400).send("Missing parameters");
    }
    

    try {
        await updateRoadmapTodos(is_completed, leaderid, task)
        
        res.status(200).send("Succesfully updated todos!")
    } catch(error) {
        res.status(400).send(error)
    }
}

const addRoadmapTodos = async(req, res) => {
    const {leaderid} = req.params;
    const {task, category, is_default} = req.body;
    console.log("task:", task, "category:", category, "is_default", is_default)
    try {
        await addTodosQuery(leaderid, category, task, is_default)
        res.status(200).send("succesfully added à new task!")
    } catch(error) {
        res.status(400).send(error)
    }
    

}

const deleteRoadmapTodos = async(req,res) => {
    const {leaderid} = req.params;
    const {task, delete_default} = req.body;
    
    try {
        deleteRoadmapTodosQuery(leaderid, task, delete_default);
        res.status(200).send("tasks succesfully deleted")
    } catch(error) {
        res.status(400).send("Couldn't delete todos")
    }
    
}

/*const createOverviewTask = async (req, res) =>{

}*/

const updateOverviewController = async (req, res) => {
    const { leader_id, date_presentation, echeance, statut, priorite} = req.body;
    console.log("req.body=", req.body)
    console.log("leader id", leader_id,"date pres:", date_presentation,"echeance", echeance,'statut', statut,"priorite", priorite)
    try {
        await updateOverview(date_presentation, echeance, statut, priorite, leader_id)
        res.status(200).send("completed update overview")
    } catch(error) {
        res.status(400).send(error)
    }

}

const getDetailsById = async (req,res) => {
    const {clientid} = req.params;
    console.log("clientID:" , clientid)
    try{
        const data = await getDetailsData(clientid)
        console.log(data)
        
        res.status(200).json(data)
    } catch(error) {
        res.status(400).send(error)
    }
}

const updateDetailsGeneralInfos = async (req, res) => {
    const {clientid} = req.params;
    const {email, phone, price_sold, active, additional_infos} = req.body;
    console.log("clientid", clientid, "req.body", req.body)
    try {
        await updateDetailsGeneralInfosQuery(email, phone, price_sold, active, additional_infos, clientid);
        res.status(200).send("Succesfully updated details general infos")
    } catch(error) {
        res.status(400).send(error)
    }
}

const updateUserInfos = async (req, res) => {
    const {username, email} = req.body;
    const {id} = req.params
    console.log("req.body", req.body, "id", id);
    try {
        await updateUserInfosQuery(username, email, id)
        res.status(200).send("succesfully updated user infos")
    }catch(error) {
        res.status(400).send(error)
    }
}

const updateUserPassword = async (req, res) => {
    const {newPassword} = req.body;
    const {id} = req.params
    console.log("req.body", req.body, "id", id);

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    try{
        await updateUserPasswordQuery(hashedPassword, id);
        res.status(200).send("sucessfully updated the password")

    } catch(error) {
        res.status(400).send(error)
    }
}

const uploadFile = async (req, res) => {
    console.log("req.file :", req.file)
    
    const {leaderName, category} = req.params;
    
    const uploadPath = path.join(`C:/Users/Guillaume Cloutier/OneDrive/Synergia/${leaderName}/${category}`);
    if (!req.file) {
        return res.status(400).send({ message: 'No file uploaded.' });
    }

    fs.mkdir(uploadPath, { recursive: true }, (err) => {
        if (err) {
            console.error('Error creating directory:', err);
            return res.status(500).send({ message: 'Error creating upload directory.' });
        }

        const targetPath = path.join(uploadPath, req.file.originalname);
        fs.rename(req.file.path, targetPath, (err) => {
            if (err) {
                console.error('Error moving file:', err);
                return res.status(500).send({ message: 'Error moving uploaded file.' });
            }

            res.status(200).send({
                message: 'File uploaded successfully.',
                filePath: targetPath,
            });
        });
    });
}


const listFile = async (req, res) => {
    const { category, leaderName } = req.params;
    

    if (!leaderName) {
        return res.status(400).send({ message: 'Leader name is required.' });
    }

    const uploadPath = path.join(`C:/Users/Guillaume Cloutier/OneDrive/Synergia/${leaderName}/${category}`);

    // Check if the directory exists
    if (!fs.existsSync(uploadPath)) {
        return res.status(404).send({ message: 'Directory not found.' });
    }

    fs.readdir(uploadPath, (err, files) => {
        if (err) {
            console.error('Error reading files:', err);
            return res.status(500).send({ message: 'Error reading files.' });
        }

        res.status(200).send({ files });
    });
};

const downloadFile = async (req, res) => {
    const { leaderName, category, fileName } = req.params; 
    console.log(`Téléchargement du fichier: ${fileName}, catégorie: ${category}, leader: ${leaderName}`);
    
    
    const filePath = path.join(
        `C:/Users/Guillaume Cloutier/OneDrive/Synergia/${leaderName}/${category}`,
        fileName
    );

    
    if (!fs.existsSync(filePath)) {
        return res.status(404).send({ message: 'Fichier non trouvé.' });
    }

    try {
        
        res.download(filePath, fileName, (err) => {
            if (err) {
                console.error('Erreur lors du téléchargement:', err);
                res.status(500).send({ message: 'Erreur lors du téléchargement.' });
            }
        });
    } catch (error) {
        console.error('Erreur inattendue:', error);
        res.status(500).send({ message: 'Erreur interne du serveur.' });
    }
};




module.exports = { getAdminHomeDataController, getOverviewDataController, getRoadmapDataController, updateRoadmapTodosController, updateOverviewController, getDetailsById, updateDetailsGeneralInfos, updateUserInfos, updateUserPassword, uploadFile, listFile, downloadFile, addRoadmapTodos, deleteRoadmapTodos };