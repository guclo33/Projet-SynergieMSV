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
const { normalizeFileName, normalizeMimeType, isImage, processImageFile } = require('../server/utils/fileUtils');

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
            JSON.stringify(data.rows, null, 2)
            return  res.status(200).send({ rows: data.rows })
        }
        res.status(404).send("no data found")
        return
    } catch (error){
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
    let query = ""
    let queryArray = []

    if(titre) {
        
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

    let query = ""
    let queryArray = []

    if(titre) {
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


    try {
        await deleteObjectifsData(prog_id)
        res.status(200).send("Progrès supprimé avec succès!")

    } catch(error) {
        res.status(400).send(error)
    }
}

const getDetailsById = async (req,res) => {
    const {clientid, id} = req.params;

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

    try {
        await updateDetailsGeneralInfosQuery(email, phone, price_sold, active, additional_infos, clientid);
        res.status(200).send("Succesfully updated details general infos")
    } catch(error) {
        res.status(400).send(error)
    }
}

const updateProfileController = async (req, res) => {
    const { name, value, profile_id } = req.body;

    if (name) {
        try {
            const query = `UPDATE profile SET ${name} = $1 WHERE id = $2`;
            const params = [value, profile_id];
            await updateProfile(query, params);  // Assurez-vous de passer value comme un tableau
            return res.status(200).send("Succesfully updated profile");
        } catch (error) {
            return res.status(500).json({ message: "Erreur lors de la mise à jour du profil", error });
        }
    }

    if (value && value.hero) {
        try {
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


    const hashedPassword = await bcrypt.hash(newPassword, 10);

    try{
        await updateUserPasswordQuery(hashedPassword, id);
        res.status(200).send("sucessfully updated the password")

    } catch(error) {
        res.status(400).send(error)
    }
}

const uploadFile = async (req, res) => {
    const {clientName, groupName, category} = req.params;
    const file = req.file
    const decodedFileName = decodeURIComponent(req.body.fileName)
    
    try {
        let processedFile;
        let normalizedFileName;
        
        // Si c'est une image, traiter le fichier (convertir HEIC si nécessaire)
        if (isImage(file.mimetype)) {
            processedFile = await processImageFile(file.buffer, file.originalname, file.mimetype);
            
            
            normalizedFileName = normalizeFileName(processedFile.originalName);
        } else {
            // Pour les fichiers non-images, utiliser la logique existante
            const mimeInfo = normalizeMimeType(file.originalname, file.mimetype);
            normalizedFileName = normalizeFileName(decodedFileName);
            
            if (mimeInfo.extension) {
                const nameWithoutExt = normalizedFileName.replace(/\.[^/.]+$/, '');
                normalizedFileName = `${nameWithoutExt}.${mimeInfo.extension}`;
            }
            
            processedFile = {
                buffer: file.buffer,
                mimetype: mimeInfo.contentType
            };
        }
        
        let filePath = `Synergia/${clientName}/${category}/${normalizedFileName}`

        if(groupName) {
            filePath = `Synergia/${groupName}/${clientName}/${category}/${normalizedFileName}`
        }


        const uploadParams = {
            client: s3Client,
            params: {
              Bucket: process.env.AWS_BUCKET_NAME,
              Key: filePath,
              Body: processedFile.buffer, // Utiliser le buffer traité
              ContentType: processedFile.mimetype, // Utiliser le type MIME traité
            },
        };
        
        // Ajouter ContentDisposition pour les images
        if (isImage(file.mimetype)) {
            uploadParams.params.ContentDisposition = 'inline';
        }
        
        const upload = new Upload(uploadParams);
    
    
        const result = await upload.done(); 
        res.status(200).json({ message: 'Fichier uploadé avec succès', location: result.Location });
    } catch (error) {
        console.error('Error during upload:', error);
        res.status(500).send('Error during upload');
    }
};


const listFile = async (req, res) => {
    const { category, groupName, clientName } = req.params;

    let folderKey = `Synergia/${clientName}/${category}`;
    if(groupName) {
        folderKey = `Synergia/${groupName}/${clientName}/${category}`;
    }


    if(category === "photos") {
        folderKey = `Synergia/Photos`;

        try {
            const command = new ListObjectsV2Command({
              Bucket: process.env.AWS_BUCKET_NAME,
              Prefix: folderKey, 
            });
        
            const data = await s3Client.send(command);

            const files = data.Contents
            ? data.Contents.filter((item) => item.Key.includes(clientName))
            : [];
 
            
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
    } catch (error) {
        console.error(`Erreur lors de la suppression du fichier ${filePath} :`, error);
    }
}

const getProfilePhoto = async(req, res) => {
    const {nomLeader, clientName} = req.params;
    
    if (!nomLeader || !clientName) {
        return; 
    }
    
    
    // Essayer différentes extensions d'images courantes
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
    let photoUrl = null;
    
    for (const ext of imageExtensions) {
        try {
            const s3params = {
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: `Synergia/Photos/${clientName}.${ext}`,
                Expires: 7200,
            };
            
            const headCommand = new HeadObjectCommand({ Bucket: s3params.Bucket, Key: s3params.Key });
            await s3Client.send(headCommand);
            
            const command = new GetObjectCommand(s3params);
            photoUrl = await getSignedUrl(s3Client, command);
            
            break; // Sortir de la boucle si on trouve la photo
            
        } catch (error) {
            if (error.name === 'NotFound' || error.$metadata?.httpStatusCode === 404) {
                
                continue; // Essayer la prochaine extension
            } else {
                console.error(`Erreur lors de la vérification de l'extension .${ext}:`, error);
                continue;
            }
        }
    }
    
    if (photoUrl) {
        return res.status(200).json({ url: photoUrl });
    } else {

        return res.status(200).json({ url: null });
    }
};

const createGroupController = async (req, res) => {
    const {group_name, have_leader, nom_leader, leader_id, members_ids, date_presentation, active} = req.body

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


    try {
        await updateGroup(group_id, group_name, have_leader, nom_leader,leader_id, date_presentation,active,ids_to_add,ids_to_remove)
        res.status(200).send("successfully updated group")
        
    } catch(error) {
        console.error("could'nt update group", error)
    }
}

const getPromptSetsController = async (req, res) => {
    
    try {
        const data = await getPromptSets()
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
        return res.status(200).json(data.rows)
    } catch (error) {
        res.send(500).send("internal server error")
    }

}

const createPromptController = async (req, res) => {
    const { promptSetName } = req.params;
    const prompts = req.body;
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

    if (!promptSetName) return res.status(400).send("Prompt set name is required");

    if (Array.isArray(prompts)) {
        try {
            // Appel de la fonction pour traiter le cas où 'prompts' est un tableau
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
    try {
        const data = await deletePrompt(promptSetName, promptName)
        return res.status(200).json(data)
    } catch (error) {
        res.status(500).send("internal server error")
    }
}

const generateAnswer = async (req, res) => {
    const {formId, promptName, selectedSetId} = req.body;

    try {
        const pythonFile = path.join(__dirname, './../GenerateurTexte/Synergia MLM avec newform.py');
        exec(`python "${pythonFile}" "${formId}"`, (error, stdout, stderr) => {
            if (error) {
                console.error(`exec error: ${error}`);
                return res.status(500).json({ error: stderr });
            }

            if (stderr) {
                console.error(`stderr: ${stderr}`);
                return res.status(500).json({ error: stderr });
            }

            res.json({ message: stdout });
        });
    } catch (error) {
        console.error("Error in generateAnswer:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

const generateTemplate = async (req, res) => {
    const {clientid} = req.params;
  

    // Valider que clientid est un nombre valide
    if (!clientid || isNaN(parseInt(clientid))) {
        console.error("Invalid clientid:", clientid);
        return res.status(400).json({ error: "Invalid client ID" });
    }

    try {
        // Utiliser un chemin absolu pour le script Python
        const pythonFile = path.resolve(__dirname, '../GenerateurTexte/canvaAutofillExecute.py');
        
        // Vérifier si le fichier existe
        const fs = require('fs');
        if (!fs.existsSync(pythonFile)) {
            console.error("Python file not found:", pythonFile);
            return res.status(500).json({ error: "Python script not found" });
        }
        
        // Utiliser 'python' ou 'python3' selon l'environnement
        const pythonCommand = process.platform === 'win32' ? 'python' : 'python3';
        const fullCommand = `${pythonCommand} "${pythonFile}" "${clientid}"`;
        
        
        exec(fullCommand, { cwd: path.dirname(pythonFile) }, (error, stdout, stderr) => {
  ;
            
            if (error) {
                console.error(`exec error: ${error}`);
                console.error("Error details:", error.message);
                return res.status(500).json({ error: `Erreur d'exécution Python: ${error.message}` });
            }

            if (stderr) {
                console.error(`stderr: ${stderr}`);
                // Ne pas retourner d'erreur pour stderr car il peut contenir des messages de debug
            }

            
            // Utiliser une expression régulière pour extraire l'URL du tuple
            const match = stdout.match(/(https:\/\/www\.canva\.com\/api\/design\/[^\s]+)/);
            
            if (match) {
                const editUrl = match[0]; // L'URL est capturée dans le premier groupe de l'expression régulière
                
                // Renvoyer l'URL au client sous forme de JSON
                return res.status(200).json({ message: "Template généré avec succès", editUrl: editUrl });
            } else {
                console.error("Impossible de trouver l'URL dans la sortie");
                console.error("Sortie complète:", stdout);
                return res.status(500).json({ error: "Erreur de parsing des données - URL non trouvée" });
            }
        });
    } catch (error) {
        console.error("Error in generateTemplate:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

const updateJsonProfileController = async (req, res) => {
    const {formId} = req.body;

    try {
        await updateJsonProfile(formId);
        res.status(200).json({ message: "Profile JSON updated successfully" });
    } catch (error) {
        console.error("Error updating JSON profile:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

const newGenerateProfileController = async (req, res) => {
    const {formId} = req.params;
    if(!formId) {   
        res.status(400).send("Did not receive the formId");
    } 
    const pythonFile = path.join(__dirname, './../GenerateurTexte/Synergia MLM avec newform.py');

    exec(`python "${pythonFile}" "${formId}"`, (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return res.status(500).json({ error: stderr });
        }

        if (stderr) {
            console.error(`stderr: ${stderr}`);
            return res.status(500).json({ error: stderr });
        }
        
        res.json({ message: stdout });
    });
};

module.exports = {
    getAdminHomeDataController,
    getOverviewDataController,
    getRoadmapDataController,
    updateRoadmapTodosController,
    addRoadmapTodos,
    deleteRoadmapTodos,
    updateOverviewController,
    getObjectifsDataController,
    createObjectifsDataController,
    createObjectifsUserController,
    updateObjectifsDataController,
    updateObjectifsUserController,
    deleteObjectifsDataController,
    getDetailsById,
    updateDetailsGeneralInfos,
    updateProfileController,
    updateUserInfos,
    updateUserPassword,
    uploadFile,
    listFile,
    downloadFile,
    deleteFile,
    getProfilePhoto,
    createGroupController,
    createLeaderController,
    updateGroupController,
    getPromptSetsController,
    getPromptsController,
    createPromptController,
    updatePromptController,
    deletePromptController,
    generateAnswer,
    generateTemplate,
    updateJsonProfileController,
    newGenerateProfileController
};