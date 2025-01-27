const {} = require("../model/tasks")
const multer = require('multer');
const path = require('path');
const fs = require('fs')
const s3Client = require('../server/config/s3-config');
const  { getSignedUrl } = require("@aws-sdk/s3-request-presigner")
const {PutObjectCommand,HeadObjectCommand, GetObjectCommand, ListObjectsV2Command, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const {createUserQuery, loginQuery, findUserById, getAdminHomeData, getOverviewData, getRoadmapData, updateRoadmapTodos, updateOverview, getDetailsData, updateDetailsGeneralInfosQuery, updateUserInfosQuery, updateUserPasswordQuery, addTodosQuery, deleteRoadmapTodosQuery, getObjectifsData, createObjectifsData, updateObjectifsData, deleteObjectifsData, createGroup, createLeader} = require("../model/tasks")
const { Upload } = require('@aws-sdk/lib-storage');
require("dotenv").config();



const getAdminHomeDataController = async (req,res) => {
    
    console.log("TESTEE!!!1111")
    try {
        const data = await getAdminHomeData()

        console.log("Backend data:", data)
        if(data){
            
            return  res.status(200).json(data)
        }
        res.status(404).send("no data found")
        return
    } catch (error){
        return res.status(500).send("internal server error")
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
    const {is_completed, task, clientid} = req.body
    
    if ( !task || !clientid) {
        return res.status(400).send("Missing parameters");
    }
    

    try {
        await updateRoadmapTodos(is_completed, clientid, task)
        
        res.status(200).send("Succesfully updated todos!")
    } catch(error) {
        res.status(400).send(error)
    }
}

const addRoadmapTodos = async(req, res) => {
    const {clientid} = req.params;
    const {task, category, is_default} = req.body;
    console.log("task:", task, "category:", category, "is_default", is_default)
    try {
        await addTodosQuery(clientid, category, task, is_default)
        res.status(200).send("succesfully added à new task!")
    } catch(error) {
        res.status(400).send(error)
    }
    

}

const deleteRoadmapTodos = async(req,res) => {
    const {clientid} = req.params;
    const {task, delete_default} = req.body;
    
    try {
        deleteRoadmapTodosQuery(clientid, task, delete_default);
        res.status(200).send("tasks succesfully deleted")
    } catch(error) {
        res.status(400).send("Couldn't delete todos")
    }
    
}

/*const createOverviewTask = async (req, res) =>{

}*/

const updateOverviewController = async (req, res) => {
    const { id, date_presentation, echeance, priorite, active} = req.body;
    console.log("req.body=", req.body)
    console.log("id", id,"date pres:", date_presentation,"echeance", echeance,"priorite", priorite)
    try {
        await updateOverview(date_presentation, echeance, priorite, id, active)
        res.status(200).send("completed update overview")
    } catch(error) {
        res.status(400).send(error)
    }

}

const getObjectifsDataController = async (req,res) => {
    const {clientid, id} = req.params
    try {
        const data = await getObjectifsData(clientid, id)
        res.status(200).json(data)

    } catch(error) {
        res.status(400).send(error)
    }
}

const createObjectifsDataController = async (req,res) => {
    const {clientid} = req.params
    
    const {value, category, titre} = req.body
    console.log("body", req.body, "clientid", clientid)
    let query = ""
    let queryArray = []

    if(titre) {
        
        const categoryTitre = `${category}_titre`;
        query = `INSERT INTO objectifs (client_id, ${category}, ${categoryTitre}) VALUES ($1, $2, $3)`
        queryArray = [clientid, value, titre]
        try {
            await createObjectifsData(query, queryArray)
            res.status(200).send("objectifs crées avec succès!")
            return
    
        } catch(error) {
            res.status(400).send(error)
            return
        }

    }

    if(category) {
    query = `INSERT INTO objectifs (client_id, ${category}) VALUES ($1, $2)`
    queryArray = [clientid, value]
    try {
        await createObjectifsData(query, queryArray)
        res.status(200).send("objectifs crées avec succès!")
        return
    } catch(error) {
        res.status(400).send(error)
        return
    }}

    query= `INSERT INTO progres (client_id, progres) VALUES (${clientid}, $1)`
    try {
        await createObjectifsData(query, queryArray, value)
        res.status(200).send("Progrès crées avec succès!")

    } catch(error) {
        res.status(400).send(error)
    }

}

const createObjectifsUserController = async (req,res) => {
    const {id} = req.params
    
    const {value, category, titre} = req.body
    console.log("body", req.body, "id", id)
    let query = ""
    let queryArray = []

    if(titre) {
        
        const categoryTitre = `${category}_titre`;
        query = `INSERT INTO objectifs (client_id, ${category}, ${categoryTitre}) VALUES ((SELECT client_id FROM users WHERE users.id = $1), $2, $3)`
        queryArray = [Number(id), value, titre]
        try {
            await createObjectifsData(query, queryArray)
            res.status(200).send("objectifs crées avec succès!")
            return
    
        } catch(error) {
            res.status(400).send(error)
            return
        }

    }

    if(category) {
    query = `INSERT INTO objectifs (client_id, ${category}) VALUES ((SELECT client_id FROM users WHERE users.id = $1), $2)`
    queryArray = [Number(id), value]
    try {
        await createObjectifsData(query, queryArray)
        res.status(200).send("objectifs crées avec succès!")
        return
    } catch(error) {
        res.status(400).send(error)
        return
    }}

    query= `INSERT INTO progres (client_id, progres) VALUES ((SELECT client_id FROM users WHERE users.id = ${Number(id)}), $1)`
    try {
        await createObjectifsData(query, queryArray, value)
        res.status(200).send("Progrès crées avec succès!")
        return

    } catch(error) {
        res.status(400).send(error)
    }

}




const updateObjectifsDataController = async (req,res) => {
    const {clientid} = req.params
    const {value, category, titre, prog_id} = req.body
    console.log("body", req.body, "clientid", clientid)
    let query = ""
    let queryArray = []

    if(titre) {
        console.log("tentative d'update avec Titre")
        const categoryTitre = `${category}_titre`;
        query = `UPDATE objectifs SET ${category} = $1, ${categoryTitre} = $2 WHERE client_id = $3`
        queryArray = [value, titre, clientid]
        try {await updateObjectifsData(query, queryArray)
            res.status(200).send("objectifs mis à jour avec succès!")
            return
    
        } catch(error) {
            res.status(400).send(error)
            return
        }}

    
    if(category){
        query = `UPDATE objectifs SET ${category} = $1 WHERE client_id = $2`
        queryArray = [value, clientid]
        console.log("tentative d'update sans Titre")
        try {
            await updateObjectifsData(query, queryArray)
            res.status(200).send("objectifs mis à jour avec succès!")
            return

        } catch(error) {
            res.status(400).send(error)
            return
        }}
    
    query = `UPDATE progres SET progres = $1 WHERE id = $2`
    try {
        await updateObjectifsData(query, queryArray, prog_id, value)
        res.status(200).send("Progrès mis à jour avec succès!")

    } catch(error) {
        res.status(400).send(error)
    }

}

const updateObjectifsUserController = async (req,res) => {
    const {id} = req.params
    const {value, category, titre, prog_id} = req.body
    console.log("body", req.body, "id", id)
    let query = ""
    let queryArray = []

    if(titre) {
        console.log("tentative d'update avec Titre")
        const categoryTitre = `${category}_titre`;
        query = `UPDATE objectifs SET ${category} = $1, ${categoryTitre} = $2 FROM users JOIN client ON users.client_id = client.id WHERE objectifs.client_id = client.id AND users.id = $3`
        queryArray = [value, titre, id]
        try {await updateObjectifsData(query, queryArray)
            res.status(200).send("objectifs mis à jour avec succès!")
            return
    
        } catch(error) {
            res.status(400).send(error)
            return
        }}

    
    if(category){
        query = `UPDATE objectifs SET ${category} = $1 FROM users JOIN client ON users.client_id = client.id WHERE objectifs.client_id = client.id AND users.id = $2`
        queryArray = [value, id]
        console.log("tentative d'update sans Titre")
        try {
            await updateObjectifsData(query, queryArray)
            res.status(200).send("objectifs mis à jour avec succès!")
            return

        } catch(error) {
            res.status(400).send(error)
            return
        }}
    
    query = `UPDATE progres SET progres = $1 WHERE id = $2`
    try {
        await updateObjectifsData(query, queryArray, prog_id, value)
        res.status(200).send("Progrès mis à jour avec succès!")

    } catch(error) {
        res.status(400).send(error)
    }

}

const deleteObjectifsDataController = async(req, res) => {
    const {clientid} = req.params;
    const {prog_id} = req.body
    console.log("supprimé avec l'id", prog_id)

    try {
        await deleteObjectifsData(prog_id)
        res.status(200).send("Progrès supprimé avec succès!")

    } catch(error) {
        res.status(400).send(error)
    }
}

const getDetailsById = async (req,res) => {
    const {clientid, id} = req.params;
    console.log("clientID:" , clientid, "ID", id)
    try{
        const data = await getDetailsData(clientid, id)
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
    const {leaderName, category} = req.params;
    const file = req.file
    const decodedFileName = decodeURIComponent(req.body.fileName)
    const filePath = `Synergia/${leaderName}/${category}/${decodedFileName}`

    console.log("req.file =", req.file, "leaderName", leaderName, "filePath", filePath, 'decodedFileName', decodedFileName)

  try {
    const upload = new Upload({
        client: s3Client,
        params: {
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: filePath,
          Body: file.buffer, 
          ContentType: file.mimetype,
        },
      });
  
      upload.on('httpUploadProgress', (progress) => {
        console.log(`Uploaded ${progress.loaded}/${progress.total} bytes`);
      });
  
      const result = await upload.done(); 
      res.status(200).json({ message: 'Fichier uploadé avec succès', location: result.Location });
    } catch (error) {
      console.error('Error during upload:', error);
      res.status(500).send('Error during upload');
    }
;

    
    
    
    
    
    /*console.log("req.file :", req.file)
    
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
    });*/
};


const listFile = async (req, res) => {
    const { category, leaderName } = req.params;
    
    const folderKey = `Synergia/${leaderName}/${category}`;

    try {
        const command = new ListObjectsV2Command({
          Bucket: process.env.AWS_BUCKET_NAME,
          Prefix: folderKey, 
        });
    
        const data = await s3Client.send(command);
        const files = data.Contents ? data.Contents.map((file) => file.Key) : [];
        
        res.status(200).json({ files });
      } catch (error) {
        console.error('Erreur lors du listing des fichiers :', error);
        res.status(500).send('Erreur lors du listing des fichiers');
      }
    

    /*if (!leaderName) {
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
    })*/;
};

const downloadFile = async (req, res) => {
    const { leaderName, category, fileName } = req.params; 
    console.log(`Téléchargement du fichier: ${fileName}, catégorie: ${category}, leader: ${leaderName}`);
    
    
    const folderKey = `Synergia/${leaderName}/${category}/${fileName}`
    

    
    try {
        const command = new GetObjectCommand({
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: folderKey,
        });
    
        const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 }); // Lien valide 1 heure
        console.log("signedUrl", signedUrl)
        res.status(200).json({ downloadUrl: signedUrl });
      } catch (error) {
        console.error('Erreur lors du téléchargement du fichier :', error);
        res.status(500).send('Erreur lors du téléchargement');
      }
    
    
    /*if (!fs.existsSync(filePath)) {
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
    }*/
};

const deleteFile = async(req, res) => {
    const {leaderName, category, fileName} = req.params;

    const key = `Synergia/${leaderName}/${category}/${fileName}`; 

    const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: key,
    };

    try {
        const command = new DeleteObjectCommand(params);
        await s3Client.send(command);
        console.log(`Fichier ${fileName} supprimé avec succès de S3.`);
    } catch (error) {
        console.error(`Erreur lors de la suppression du fichier ${filePath} :`, error);
    }
}

const getProfilePhoto = async(req, res) => {
    const {nomLeader, clientName} = req.params;
    
    if (!nomLeader || !clientName) {
        console.log("Paramètres manquants. Aucune action.");
        return; 
      }
    
    console.log("nomLeader et clientName", nomLeader, clientName)
    const s3params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `Synergia/${nomLeader}/photos/${clientName}.png`,
        Expires: 7200,
    }

    console.log("nomLeader et clientName", nomLeader, clientName,"s3Params", s3params)
    
    try {

        const headCommand = new HeadObjectCommand({ Bucket: s3params.Bucket, Key: s3params.Key });
        await s3Client.send(headCommand);  

        const command = new GetObjectCommand(s3params);
        const url = await getSignedUrl(s3Client, command);
        console.log("URL = ", url)
        return res.status(200).json({url})
    } catch (error) {
        if (error.name === 'NotFound' || error.$metadata?.httpStatusCode === 404) {
            console.log("Objet introuvable :", s3params.Key);
            return res.status(200).json({ url: null });
    }

    console.error("Erreur lors de la génération de l'URL :", error);
    return res.status(500).json({ error: 'Erreur interne du serveur.' });
   
}}

const createGroupController = async (req, res) => {
    const {group_name, have_leader, nom_leader, leader_id, members_ids, date_presentation, active} = req.body
    console.log("voici le body", req.body)

    try {
        await createGroup(group_name, have_leader, nom_leader, leader_id, members_ids, date_presentation, active);
        res.status(200).send("succesfully created group")

    } catch (error) {
        res.status(400).send("couldnt create group", error)
    }
}

const createLeaderController = async (req, res) => {
    const {nom_leader, email} = req.body

    try {
        await createLeader(nom_leader, email);
        res.status(200).send("succesfully created leader")

    } catch (error) {
        res.status(400).send("couldnt create leader", error)
    }
}



module.exports = { getAdminHomeDataController, getOverviewDataController, getRoadmapDataController, updateRoadmapTodosController, updateOverviewController, getDetailsById, updateDetailsGeneralInfos, updateUserInfos, updateUserPassword, uploadFile, listFile, downloadFile, addRoadmapTodos, deleteRoadmapTodos, deleteFile, getObjectifsDataController, updateObjectifsDataController, createObjectifsDataController, deleteObjectifsDataController, updateObjectifsUserController, createObjectifsUserController, getProfilePhoto, createGroupController, createLeaderController };