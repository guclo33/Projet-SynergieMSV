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

const storedForms = {};

const createFormController = async (req, res) => {
    const {form, info} = req.body;
    console.log("form", form, "INFO", info)
    try{
        const id = await createForm(form, info)
        res.status(200).json({ id })
    }catch(error) {
        res.status(400).send("Couldn't insert Form")
    }
}

const uploadProfilPhotoController = async (req, res) => {
    const file = req.file
    const decodedFileName = decodeURIComponent(file.originalname)
    const filePath = `Synergia/Photos/${decodedFileName}`
    
    console.log("req.file =", file, "filePath", filePath, 'decodedFileName', decodedFileName)

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
}

const createUrl = async( req, res) => {
    const formData = req.body;
    const formId = Math.random().toString(36).slice(2, 11); 
    try {
        
        const id = await createPreformUrl(formId, formData)

        console.log("IIIDDD", id)
        res.json(id);
    } catch(error) {
        console.log("could upload dataForm", error)
    }
}

const getUrlParams = async( req, res) => {
    const {formId} = req.params;
    console.log("FORMIDDDD", formId)
    try {
        const data = await getPreformData(formId)
        console.log("DATAA!!==", data)
        res.status(200).send(data)

    } catch(error) {
        console.log("Couldn't get data from preform Id", error)
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