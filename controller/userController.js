const {getAdminHomeData, getOverviewData, getRoadmapData, updateRoadmapTodos, updateOverview, getDetailsData, updateDetailsGeneralInfosQuery, updateUserInfosQuery, updateUserPasswordQuery, addTodosQuery, deleteRoadmapTodosQuery,getObjectifsData, createObjectifsData, updateObjectifsData, deleteObjectifsData} = require("../model/tasks")
const s3Client = require('../server/config/s3-config')
const {PutObjectCommand,HeadObjectCommand, GetObjectCommand, ListObjectsV2Command, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl} = require('@aws-sdk/s3-request-presigner')
require("dotenv").config();

const getUserDataController = async (req, res) => {

}

const getUserPhotosController = async (req, res) => {

}



module.exports = {
    getUserDataController,
    getUserPhotosController
}