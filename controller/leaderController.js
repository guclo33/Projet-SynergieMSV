const { getLeaderData } = require("../model/leaderAndUserTask");
const {getAdminHomeData, getOverviewData, getRoadmapData, updateRoadmapTodos, updateOverview, getDetailsData, updateDetailsGeneralInfosQuery, updateUserInfosQuery, updateUserPasswordQuery, addTodosQuery, deleteRoadmapTodosQuery,getObjectifsData, createObjectifsData, updateObjectifsData, deleteObjectifsData} = require("../model/tasks")
const s3Client = require('../server/config/s3-config')
const {PutObjectCommand,HeadObjectCommand, GetObjectCommand, ListObjectsV2Command, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl} = require('@aws-sdk/s3-request-presigner')
require("dotenv").config();

const getLeaderDataController = async (req, res) => {
    const {id} = req.params;
    console.log("getting leader data for id", id)
    try {
        const data = await getLeaderData(id);
        return res.status(200).json(data);

    } catch (error) {
        console.error("Erreur lors de la récupération des données du leader :", error);
        return res.status(500).json({ error: 'Erreur interne du serveur.' });
    }
}

const getLeaderPhotosController = async (req, res) => {
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
}
}



module.exports = {
    getLeaderDataController,
    getLeaderPhotosController
}