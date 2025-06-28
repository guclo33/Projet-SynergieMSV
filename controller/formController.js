const bcrypt = require("bcryptjs");
const multer = require('multer');
const path = require('path');
const fs = require('fs')
const s3Client = require('../server/config/s3-config')
const {PutObjectCommand,HeadObjectCommand, GetObjectCommand, ListObjectsV2Command, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl} = require('@aws-sdk/s3-request-presigner')
const { Upload } = require('@aws-sdk/lib-storage');
require("dotenv").config();
const {createPreformUrl, getPreformData, createForm} = require("../model/formTasks")
const { exec } = require('child_process')
const { normalizeFileName, normalizeMimeType, processImageFile } = require('../server/utils/fileUtils');

const storedForms = {};

const createFormController = async (req, res) => {
    const {form, info} = req.body;
    try{
        const id = await createForm(form, info)
        res.status(200).json({ id })
    }catch(error) {
        res.status(400).send("Couldn't insert Form")
    }
}

const uploadProfilPhotoController = async (req, res) => {
    const file = req.file
    const { formId, clientName } = req.body;
    const finalClientName = clientName || 'unknown';

    try {
        // Traiter le fichier image (convertir HEIC si nécessaire)
        const processedFile = await processImageFile(file.buffer, file.originalname, file.mimetype);
       
        // Utiliser le nom du client tel quel pour nommer le fichier
        let normalizedFileName = processedFile.originalName;
        if (finalClientName && finalClientName !== 'unknown') {
            const fileExtension = processedFile.originalName.split('.').pop().toLowerCase();
            normalizedFileName = `${finalClientName}.${fileExtension}`;
        }
        const filePath = `Synergia/Photos/${normalizedFileName}`

        const upload = new Upload({
            client: s3Client,
            params: {
              Bucket: process.env.AWS_BUCKET_NAME,
              Key: filePath,
              Body: processedFile.buffer, // Utiliser le buffer traité
              ContentType: processedFile.mimetype, // Utiliser le type MIME traité
              ContentDisposition: 'inline', // Pour que les images s'affichent directement
            },
          });
        upload.on('httpUploadProgress', (progress) => {
            console.log(`[BACKEND] [UPLOAD] Progression upload S3: ${progress.loaded}/${progress.total} bytes`);
        });
        const result = await upload.done(); 
      
        res.status(200).json({ message: 'Fichier uploadé avec succès', location: result.Location });
    } catch (error) {
        console.error('[BACKEND] [UPLOAD] Erreur lors de l\'upload:', error);
        res.status(500).send('Error during upload');
    }
}

const createUrl = async( req, res) => {
    const formData = req.body;
    const formId = Math.random().toString(36).slice(2, 11); 
    try {
        
        const id = await createPreformUrl(formId, formData)

        res.json(id);
    } catch(error) {
        console.error("could upload dataForm", error)
    }
}

const getUrlParams = async( req, res) => {
    const {formId} = req.params;
    try {
        const data = await getPreformData(formId)
        res.status(200).send(data)

    } catch(error) {
        console.error("Couldn't get data from preform Id", error)
    }
}

const generateProfileController = async(req, res) => {
    const { formId } = req.params;
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
    })

}



module.exports = {createFormController, uploadProfilPhotoController, createUrl, getUrlParams, generateProfileController}