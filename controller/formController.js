const bcrypt = require("bcryptjs");
const multer = require('multer');
const path = require('path');
const fs = require('fs')
const s3Client = require('../server/config/s3-config')
const {PutObjectCommand,HeadObjectCommand, GetObjectCommand, ListObjectsV2Command, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl} = require('@aws-sdk/s3-request-presigner')
const { Upload } = require('@aws-sdk/lib-storage');
require("dotenv").config();
const {} = require("../model/formTasks")

const createFormController = async (req, res) => {
    const {form} = req.body;
    console.log("form", form)
}

const uploadProfilPhotoController = (req, res) => {

}

module.exports = {createFormController, uploadProfilPhotoController}