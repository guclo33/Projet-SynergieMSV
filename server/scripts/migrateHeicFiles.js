/**
 * Script de migration des fichiers HEIC existants vers JPEG
 * Usage: node server/scripts/migrateHeicFiles.js
 */

const s3Client = require('../config/s3-config');
const { ListObjectsV2Command, GetObjectCommand, PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const sharp = require('sharp');
const { normalizeFileName } = require('../utils/fileUtils');
require('dotenv').config();

/**
 * Convertit un buffer HEIC en JPEG
 * @param {Buffer} heicBuffer - Le buffer HEIC
 * @returns {Promise<Buffer>} - Le buffer JPEG
 */
const convertHeicBufferToJpeg = async (heicBuffer) => {
    try {
        const jpegBuffer = await sharp(heicBuffer)
            .jpeg({ quality: 90 })
            .toBuffer();
        return jpegBuffer;
    } catch (error) {
        console.error('Erreur lors de la conversion HEIC:', error);
        throw error;
    }
};

/**
 * Vérifie si un fichier est au format HEIC
 * @param {string} fileName - Le nom du fichier
 * @returns {boolean} - True si c'est un fichier HEIC
 */
const isHeicFile = (fileName) => {
    const name = fileName.toLowerCase();
    return name.includes('.heic') || name.includes('.heif');
};

/**
 * Migre un fichier HEIC vers JPEG
 * @param {string} bucketName - Le nom du bucket S3
 * @param {string} key - La clé du fichier dans S3
 */
const migrateHeicFile = async (bucketName, key) => {
    try {

        
        // Télécharger le fichier HEIC
        const getCommand = new GetObjectCommand({
            Bucket: bucketName,
            Key: key
        });
        
        const response = await s3Client.send(getCommand);
        const heicBuffer = await response.Body.transformToByteArray();
        const buffer = Buffer.from(heicBuffer);
        
        // Convertir HEIC en JPEG
        const jpegBuffer = await convertHeicBufferToJpeg(buffer);
        
        // Créer la nouvelle clé avec l'extension .jpg
        const newKey = key.replace(/\.(heic|heif)$/i, '.jpg');
        
        // Uploader le fichier JPEG
        const putCommand = new PutObjectCommand({
            Bucket: bucketName,
            Key: newKey,
            Body: jpegBuffer,
            ContentType: 'image/jpeg',
            ContentDisposition: 'inline'
        });
        
        await s3Client.send(putCommand);

        
        // Supprimer l'ancien fichier HEIC
        const deleteCommand = new DeleteObjectCommand({
            Bucket: bucketName,
            Key: key
        });
        
        await s3Client.send(deleteCommand);

        
        return { success: true, oldKey: key, newKey: newKey };
        
    } catch (error) {
        console.error(`Erreur lors de la migration de ${key}:`, error);
        return { success: false, key: key, error: error.message };
    }
};

/**
 * Trouve tous les fichiers HEIC dans le bucket
 * @param {string} bucketName - Le nom du bucket S3
 * @param {string} prefix - Le préfixe pour filtrer les fichiers
 * @returns {Promise<Array>} - Liste des clés des fichiers HEIC
 */
const findHeicFiles = async (bucketName, prefix = 'Synergia/Photos/') => {
    try {
        const command = new ListObjectsV2Command({
            Bucket: bucketName,
            Prefix: prefix
        });
        
        const response = await s3Client.send(command);
        const heicFiles = response.Contents.filter(obj => isHeicFile(obj.Key));
        
        return heicFiles.map(obj => obj.Key);
        
    } catch (error) {
        console.error('Erreur lors de la recherche des fichiers HEIC:', error);
        return [];
    }
};

/**
 * Fonction principale de migration
 */
const migrateAllHeicFiles = async () => {
    const bucketName = process.env.AWS_BUCKET_NAME;
    
    if (!bucketName) {
        console.error('AWS_BUCKET_NAME non défini dans les variables d\'environnement');
        process.exit(1);
    }
    
    
    try {
        // Trouver tous les fichiers HEIC
        const heicFiles = await findHeicFiles(bucketName);
        
        if (heicFiles.length === 0) {
            return;
        }
        
        // Migrer chaque fichier
        const results = [];
        for (const key of heicFiles) {
            const result = await migrateHeicFile(bucketName, key);
            results.push(result);
            
            // Pause entre les migrations pour éviter de surcharger S3
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
        

        
    } catch (error) {
        console.error('Erreur lors de la migration:', error);
    }
};

// Exécuter la migration si le script est appelé directement
if (require.main === module) {
    migrateAllHeicFiles()
        .then(() => {
            process.exit(0);
        })
        .catch((error) => {
            console.error('Erreur fatale:', error);
            process.exit(1);
        });
}

module.exports = {
    migrateHeicFile,
    findHeicFiles,
    migrateAllHeicFiles
}; 