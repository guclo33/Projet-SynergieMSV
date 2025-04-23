const multer = require('multer');
const path = require('path');
const fs = require('fs')
const s3Client = require('../server/config/s3-config');
const  { getSignedUrl } = require("@aws-sdk/s3-request-presigner")
const {PutObjectCommand,HeadObjectCommand, GetObjectCommand, ListObjectsV2Command, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const {createUserQuery, loginQuery, findUserById, getAdminHomeData, getOverviewData, getRoadmapData, updateRoadmapTodos, updateOverview, getDetailsData, updateDetailsGeneralInfosQuery, updateUserInfosQuery, updateUserPasswordQuery, addTodosQuery, deleteRoadmapTodosQuery, getObjectifsData, createObjectifsData, updateObjectifsData, deleteObjectifsData, createGroup, createLeader, updateGroup, updateProfile, getPromptSets, getPrompts, updatePrompt, createPrompts, deletePrompt, saveAllPrompts, updateJsonProfile} = require("../model/tasks")
const { Upload } = require('@aws-sdk/lib-storage');
const { exec } = require('child_process');
require("dotenv").config();




const getAdminHomeDataController = async (req,res) => {
    
    try {
        const data = await getAdminHomeData()

        
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
    const { id, active} = req.body;
    console.log("req.body=", req.body)
    
    try {
        await updateOverview( id, active)
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

const updateProfileController = async (req, res) => {
    const { name, value, profile_id } = req.body;
    console.log("starting update profile controller");
    console.log("BODY", req.body);

    if (name) {
        try {
            console.log("updating infos");
            const query = `UPDATE profile SET ${name} = $1 WHERE id = $2`;
            const params = [value, profile_id];
            await updateProfile(query, params);  // Assurez-vous de passer value comme un tableau
            return res.status(200).send("Succesfully updated profile");
        } catch (error) {
            console.log("error updating profile", error);
            return res.status(500).json({ message: "Erreur lors de la mise à jour du profil", error });
        }
    }

    if (value && value.hero) {
        try {
            console.log("updating arch");
            const query = `UPDATE profile SET 
                hero=$1, sage=$2, rebelle=$3, souverain=$4, citoyen=$5, bouffon=$6, 
                magicien=$7, explorateur=$8, protecteur=$9, amoureuse=$10, optimiste=$11, 
                createur=$12 WHERE id = $13`;
            const params = [
                value.hero, value.sage, value.rebelle, value.souverain, value.citoyen, 
                value.bouffon, value.magicien, value.explorateur, value.protecteur, 
                value.amoureuse, value.optimiste, value.createur, profile_id
            ];
            await updateProfile(query, params, profile_id);  // Passez un tableau de paramètres
            return res.status(200).send("Succesfully updated profile");
        } catch (error) {
            return res.status(500).json({ message: "Erreur lors de la mise à jour du profil", error });
        }
    }

    if (value && value.bleu) {
        try {
            console.log("updating colors");
            const query = `UPDATE profile SET bleu = $1, rouge = $2, jaune = $3, vert = $4 WHERE id = $5`;
            const params = [value.bleu, value.rouge, value.jaune, value.vert, profile_id];
            await updateProfile(query, params, profile_id);  // Passez un tableau de paramètres
            return res.status(200).send("Succesfully updated profile");
        } catch (error) {
            return res.status(500).json({ message: "Erreur lors de la mise à jour du profil", error });
        }
    }
};

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
    const {clientName, groupName, category} = req.params;
    const file = req.file
    const decodedFileName = decodeURIComponent(req.body.fileName)
    console.log("decodedFileName", decodedFileName)
    let filePath = `Synergia/${clientName}/${category}/${decodedFileName}`

    if(groupName) {
        filePath = `Synergia/${groupName}/${clientName}/${category}/${decodedFileName}`
    }

    console.log("req.file =", req.file,  "filePath", filePath, 'decodedFileName', decodedFileName)

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
    const { category, groupName, clientName } = req.params;

    console.log("CLIENT NAME", clientName)
    let folderKey = `Synergia/${clientName}/${category}`;
    if(groupName) {
        folderKey = `Synergia/${groupName}/${clientName}/${category}`;
    }
    console.log("folderKey", folderKey)

    if(category === "photos") {
        folderKey = `Synergia/Photos`;

        try {
            const command = new ListObjectsV2Command({
              Bucket: process.env.AWS_BUCKET_NAME,
              Prefix: folderKey, 
            });
        
            const data = await s3Client.send(command);

            console.log("data", data)
            const files = data.Contents
            ? data.Contents.filter((item) => item.Key.includes(clientName))
            : [];
            console.log("files", files)
            
            return res.status(200).json({ files });
          } catch (error) {
            console.error('Erreur lors du listing des fichiers :', error);
            res.status(500).send('Erreur lors du listing des fichiers');
          }
    }

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
    const { groupName, clientName, category, fileName } = req.params; 
    console.log(`Téléchargement du fichier: ${fileName}, catégorie: ${category}, client: ${clientName}`);
    
    
    let folderKey = `Synergia/${clientName}/${category}/${fileName}`
    if(groupName) {
        folderKey = `Synergia/${groupName}/${clientName}/${category}/${fileName}`
    }
    
    if(category === "photos") {
        folderKey = `Synergia/Photos/${clientName}.png`
    }
    
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
    const {clientName, groupName, category, fileName} = req.params;

    let key = `Synergia/${clientName}/${category}/${fileName}`; 
    if(groupName) {
        key = `Synergia/${groupName}/${clientName}/${category}/${fileName}`
    }

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
        
        return; 
      }
    
    
    const s3params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `Synergia/Photos/${clientName}.png`,
        Expires: 7200,
    }

    
    
    try {

        const headCommand = new HeadObjectCommand({ Bucket: s3params.Bucket, Key: s3params.Key });
        await s3Client.send(headCommand);  

        const command = new GetObjectCommand(s3params);
        const url = await getSignedUrl(s3Client, command);
        
        return res.status(200).json({url})
    } catch (error) {
        if (error.name === 'NotFound' || error.$metadata?.httpStatusCode === 404) {
            
            return res.status(200).json({ url: null });
    }

    
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
    console.log("nom_leader", nom_leader, "email", email)

    try {
        await createLeader(nom_leader, email);
        return res.status(200).send("succesfully created leader")

    } catch (error) {
        return res.status(400).json({ message: "couldnt create leader", error: error.message });
    }
};

const updateGroupController = async(req, res) => {
    const {
        group_id,
        group_name,
        have_leader,
        nom_leader,
        leader_id,
        date_presentation,
        active,
        ids_to_add,
        ids_to_remove
    } = req.body
    
    console.log("REQ.BODY", req.body)

    try {
        await updateGroup(group_id, group_name, have_leader, nom_leader,leader_id, date_presentation,active,ids_to_add,ids_to_remove)
        res.status(200).send("successfully updated group")
        
    } catch(error) {
        console.log("could'nt update group", error)
    }
}

const getPromptSetsController = async (req, res) => {
    
    try {
        const data = await getPromptSets()
        console.log("getPromptssets data:", data.rows)
        return res.status(200).json(data.rows)
    } catch (error) {
        res.send(500).send("internal server error")
    }
}

const getPromptsController = async (req, res) => {
    const { promptSetName } = req.params;
    if (!promptSetName) return [];
    try {
        const data = await getPrompts(promptSetName)
        console.log("getPrompts data:", data.rows)
        return res.status(200).json(data.rows)
    } catch (error) {
        res.send(500).send("internal server error")
    }

}

const createPromptController = async (req, res) => {
    const { promptSetName } = req.params;
    const prompts = req.body;
    console.log("Creating prompts:", prompts)
    if (!promptSetName) {
        return null
    }
    
    try {
        const data = await createPrompts(promptSetName, prompts)
        return res.status(200).json(data)
    } catch (error) {
        res.status(500).send("internal server error")
    }
}

const updatePromptController = async (req, res) => {
    const { promptSetName } = req.params;
    const prompts = req.body;
    console.log("prompts controller:", prompts)

    if (!promptSetName) return res.status(400).send("Prompt set name is required");

    if (Array.isArray(prompts)) {
        try {
            // Appel de la fonction pour traiter le cas où 'prompts' est un tableau
            console.log("SAVING ALL PROMPTS")
            const data = await saveAllPrompts(promptSetName, prompts); // Fonction personnalisée pour gérer le tableau
            return res.status(200).json({ message: "Success!" });
        } catch (error) {
            console.error("Error while handling array:", error);
            return res.status(500).json({ message: "Internal server error while handling array", error: error.message });
        }
    }

    try {
        const data = await updatePrompt(promptSetName, prompts);
        return res.status(200).json(data);
    } catch (error) {
        console.error("Error updating prompt:", error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};


const deletePromptController = async (req, res) => {
    const { promptSetName, promptName } = req.params;
    if (!promptSetName || !promptName) return null;
    console.log("promptSetName:", promptSetName, "promptName:", promptName)
    try {
        const data = await deletePrompt(promptSetName, promptName)
        return res.status(200).json(data)
    } catch (error) {
        res.status(500).send("internal server error")
    }
}

const generateAnswer = async (req, res) => {
    const {formId, promptName, selectedSetId} = req.body;
    console.log("formId", formId, "promptName", promptName, "selectedSetId", selectedSetId)

    try {
        exec(`python ./GenerateurTexte/prompt_testing.py ${formId} ${promptName} ${selectedSetId}`, (error, stdout, stderr) => {
            if (error) {
                console.error(`Erreur d'exécution: ${error}`);
                return res.status(500).json({ message: "Erreur d'exécution du script Python" });
            }

            if (stderr) {
                console.error(`stderr: ${stderr}`);
                return res.status(500).json({ message: "Erreur lors de l'exécution du script Python" });
            }

            console.log("stdout:", stdout);
            return res.json({ message: stdout });
        })} catch (error) {   
        console.log("Erreur lors de la génération de la réponse:", error);
        return res.status(500).json({ message: "Erreur lors de la génération de la réponse", error });
    }
}

const generateTemplate = async (req, res) => {
    const { clientid } = req.params;
    console.log("clientid", clientid);

    try {
        exec(`python ./GenerateurTexte/canvaAutofillExecute.py ${clientid}`, (error, stdout, stderr) => {
            if (error) {
                console.error("Erreur d'exécution:", error);
                return res.status(500).json({ message: "Erreur d'exécution du script Python" });
            }

            console.log("stdout:", stdout);

            // Utiliser une expression régulière pour extraire l'URL du tuple
            const match = stdout.match(/(https:\/\/www\.canva\.com\/api\/design\/[^\s]+)/);
            

            if (match) {
                const editUrl = match[0]; // L'URL est capturée dans le premier groupe de l'expression régulière
                console.log("URL générée:", editUrl);

                if (stderr) {
                    console.error("Messages stderr :", stderr);
                }

                // Renvoyer l'URL au client sous forme de JSON
                return res.status(200).json({ message: "Template généré avec succès", editUrl: editUrl });
            } else {
                console.error("Impossible de trouver l'URL dans la sortie");
                return res.status(500).json({ message: "Erreur de parsing des données" });
            }
        });
    } catch (error) {
        console.log("Erreur lors de la génération du template:", error);
        return res.status(500).json({ message: "Erreur lors de la génération du template", error });
    }
};

const updateJsonProfileController = async (req, res) => {
    const { profile_id, profilejson } = req.body;
    console.log("profile_id", profile_id, "profilejson", profilejson)
    try {
        updateJsonProfile(profile_id, profilejson)
        res.status(200).send("successfully updated profile json")
    } catch (error) {
        res.status(400).send("couldn't update profile json")
    }
}


const newGenerateProfileController = async (req, res) => {
    const {formId, clientId, selectedSetId} = req.body;

    console.log("formId", formId, "clientId", clientId, "selectedSetId", selectedSetId)

    try {
        exec(`python ./GenerateurTexte/new_profil_generator.py ${formId} ${selectedSetId}`, (error, stdout, stderr) => {
            if (error) {
                console.error(`Erreur d'exécution: ${error}`);
                return res.status(500).json({ message: "Erreur d'exécution du script Python" });
            }
            res.status(200).json({ message: stdout });
    })


    } catch (error) {
        console.log("Erreur lors de la génération du profil:", error);
        return res.status(500).json({ message: "Erreur lors de la génération du profil", error });
    }
}


module.exports = { getAdminHomeDataController, getOverviewDataController, getRoadmapDataController, updateRoadmapTodosController, updateOverviewController, getDetailsById, updateDetailsGeneralInfos, updateUserInfos, updateUserPassword, uploadFile, listFile, downloadFile, addRoadmapTodos, deleteRoadmapTodos, deleteFile, getObjectifsDataController, updateObjectifsDataController, createObjectifsDataController, deleteObjectifsDataController, updateObjectifsUserController, createObjectifsUserController, getProfilePhoto, createGroupController, createLeaderController , updateGroupController, updateProfileController, getPromptSetsController, getPromptsController, createPromptController, updatePromptController, deletePromptController, generateTemplate, generateAnswer, updateJsonProfileController, newGenerateProfileController};