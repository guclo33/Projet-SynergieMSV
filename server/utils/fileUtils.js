/**
 * Utilitaires pour la gestion des fichiers
 */

const sharp = require('sharp');
const heicConvert = require('heic-convert');
const FileType = require('file-type');

/**
 * Normalise un nom de fichier en supprimant les accents et caractères spéciaux
 * @param {string} fileName - Le nom de fichier à normaliser
 * @returns {string} - Le nom de fichier normalisé
 */
const normalizeFileName = (fileName) => {
    // Décoder d'abord si le nom est encodé
    let decodedName = fileName;
    try {
        decodedName = decodeURIComponent(fileName);
    } catch (e) {
        // Si le décodage échoue, utiliser le nom original
        decodedName = fileName;
    }
    
    // Normaliser les caractères accentués
    return decodedName
        .normalize('NFD') // Décompose les caractères accentués
        .replace(/[\u0300-\u036f]/g, '') // Supprime les diacritiques
        .replace(/[^a-zA-Z0-9.-]/g, '_') // Remplace les caractères spéciaux par des underscores
        .replace(/_+/g, '_') // Remplace les underscores multiples par un seul
        .replace(/^_|_$/g, ''); // Supprime les underscores en début et fin
};

/**
 * Normalise le type MIME et l'extension du fichier
 * @param {string} originalName - Le nom original du fichier
 * @param {string} mimetype - Le type MIME détecté
 * @returns {object} - Objet contenant le type MIME normalisé et la nouvelle extension
 */
const normalizeMimeType = (originalName, mimetype) => {
    const fileName = originalName.toLowerCase();
    const mimeType = mimetype.toLowerCase();
    
    // Gestion des fichiers HEIC/HEIF
    if (mimeType.includes('heic') || mimeType.includes('heif') || fileName.includes('.heic') || fileName.includes('.heif')) {
        return {
            contentType: 'image/jpeg',
            extension: 'jpg'
        };
    }
    
    // Gestion des autres types d'images
    if (mimeType.includes('image/')) {
        // Mapper les types MIME vers les extensions appropriées
        const mimeToExtension = {
            'image/jpeg': 'jpg',
            'image/jpg': 'jpg',
            'image/png': 'png',
            'image/gif': 'gif',
            'image/webp': 'webp',
            'image/bmp': 'bmp',
            'image/tiff': 'tiff',
            'image/tif': 'tiff'
        };
        
        const extension = mimeToExtension[mimeType] || 'jpg';
        return {
            contentType: mimeType,
            extension: extension
        };
    }
    
    // Pour les autres types de fichiers, retourner le type MIME original
    return {
        contentType: mimetype,
        extension: null
    };
};

/**
 * Convertit un fichier HEIC en JPEG
 * @param {Buffer} fileBuffer - Le buffer du fichier HEIC
 * @returns {Promise<Buffer>} - Le buffer du fichier JPEG converti
 */
const convertHeicToJpeg = async (fileBuffer) => {
    try {
        // Utiliser sharp pour convertir HEIC en JPEG
        const jpegBuffer = await sharp(fileBuffer)
            .jpeg({ quality: 90 }) // Qualité JPEG de 90%
            .toBuffer();
        

        return jpegBuffer;
    } catch (error) {
        console.error('[CONVERSION] Erreur lors de la conversion HEIC:', error);
        throw new Error('Impossible de convertir le fichier HEIC');
    }
};

/**
 * Traite un fichier image (convertit HEIC si nécessaire)
 * @param {Buffer} fileBuffer - Le buffer du fichier
 * @param {string} originalName - Le nom original du fichier
 * @param {string} mimetype - Le type MIME du fichier
 * @returns {Promise<object>} - Objet contenant le buffer traité et les métadonnées
 */
async function processImageFile(buffer, originalName, mimetype) {
    let outputBuffer;
    let outputMime = 'image/png';
    let outputName = originalName.replace(/\.[^.]+$/, '.png');
    let converted = false;

    try {
        // Détecter le vrai type de fichier à partir du buffer
        const detectedType = await FileType.fromBuffer(buffer);


        if (!detectedType) {
            throw new Error('Type de fichier non reconnu');
        }

        // Utiliser le type détecté pour décider de la méthode de conversion
        if (detectedType.mime === 'image/heic' || detectedType.ext === 'heic') {
            // Fichier HEIC détecté - utiliser heic-convert

            try {
                outputBuffer = await heicConvert({
                    buffer: buffer,
                    format: 'PNG',
                    quality: 1
                });
                converted = true;

            } catch (heicErr) {
                console.error('[BACKEND] [CONVERT] Erreur conversion HEIC->PNG:', heicErr);
                throw new Error('Impossible de convertir le fichier HEIC en PNG');
            }
        } else if (detectedType.mime.startsWith('image/')) {
            // Autre type d'image - utiliser sharp

            try {
                outputBuffer = await sharp(buffer).png().toBuffer();
                converted = true;
            } catch (sharpErr) {
                console.error('[BACKEND] [CONVERT] Erreur conversion sharp:', sharpErr);
                throw new Error('Impossible de convertir l\'image en PNG');
            }
        } else {
            throw new Error('Format de fichier non supporté');
        }

    } catch (error) {
        console.error('[BACKEND] [CONVERT] Erreur lors du traitement:', error);
        throw error;
    }

    return {
        buffer: outputBuffer,
        mimetype: outputMime,
        originalName: outputName,
        converted
    };
}

/**
 * Génère un nom de fichier unique en ajoutant un suffixe numérique si nécessaire
 * @param {string} baseName - Le nom de base du fichier
 * @param {string} extension - L'extension du fichier
 * @param {Function} existsCheck - Fonction pour vérifier si le fichier existe
 * @returns {Promise<string>} - Le nom de fichier unique
 */
const generateUniqueFileName = async (baseName, extension, existsCheck) => {
    let fileName = `${baseName}.${extension}`;
    let counter = 1;
    
    while (await existsCheck(fileName)) {
        fileName = `${baseName}_${counter}.${extension}`;
        counter++;
    }
    
    return fileName;
};

/**
 * Vérifie si un fichier est une image
 * @param {string} mimetype - Le type MIME du fichier
 * @returns {boolean} - True si c'est une image
 */
const isImage = (mimetype) => {
    return mimetype && mimetype.toLowerCase().startsWith('image/');
};

/**
 * Vérifie si un fichier est au format HEIC/HEIF
 * @param {string} originalName - Le nom du fichier
 * @param {string} mimetype - Le type MIME du fichier
 * @returns {boolean} - True si c'est un fichier HEIC/HEIF
 */
const isHeicFile = (originalName, mimetype) => {
    const fileName = originalName.toLowerCase();
    const mimeType = mimetype.toLowerCase();
    
    return mimeType.includes('heic') || 
           mimeType.includes('heif') || 
           fileName.includes('.heic') || 
           fileName.includes('.heif');
};

module.exports = {
    normalizeFileName,
    normalizeMimeType,
    convertHeicToJpeg,
    processImageFile,
    generateUniqueFileName,
    isImage,
    isHeicFile
}; 