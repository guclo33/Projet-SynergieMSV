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
        await createForm(form, info)
        res.status(200).send("succesfully created form")
    }catch(error) {
        res.status(400).send("Couldn't insert Form")
    }
}

const uploadProfilPhotoController = (req, res) => {

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


module.exports = {createFormController, uploadProfilPhotoController, createUrl, getUrlParams}