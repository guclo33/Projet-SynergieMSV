/**
 * Utilitaires pour la gestion des images côté frontend
 */

/**
 * Crée un URL d'objet pour une image
 * @param {File|Blob} file - Le fichier image
 * @returns {string} - L'URL de l'objet
 */
export const createImageUrl = (file) => {
    return URL.createObjectURL(file);
};

/**
 * Libère un URL d'objet
 * @param {string} url - L'URL à libérer
 */
export const revokeImageUrl = (url) => {
    if (url && url.startsWith('blob:')) {
        URL.revokeObjectURL(url);
    }
};

/**
 * Normalise un nom de fichier en supprimant les accents et caractères spéciaux
 * @param {string} fileName - Le nom de fichier original
 * @returns {string} - Le nom de fichier normalisé
 */
export const normalizeFileName = (fileName) => {
    if (!fileName || typeof fileName !== 'string') return '';
    return fileName
        .normalize('NFD')
        .replace(/[0-\u036f]/g, '') // Supprime les accents
        .replace(/[^a-zA-Z0-9.-]/g, '_') // Remplace les caractères spéciaux par des underscores
        .replace(/_+/g, '_') // Remplace les underscores multiples par un seul
        .replace(/^_|_$/g, ''); // Supprime les underscores en début et fin
};

/**
 * Vérifie si un fichier est au format HEIC
 * @param {File} file - Le fichier à vérifier
 * @returns {boolean} - True si c'est un fichier HEIC
 */
export const isHeicFile = (file) => {
    if (!file || !file.name) return false;
    const fileName = file.name.toLowerCase();
    const mimeType = (file.type || '').toLowerCase();
    return mimeType.includes('heic') ||
           mimeType.includes('heif') ||
           fileName.endsWith('.heic') ||
           fileName.endsWith('.heif');
};

/**
 * Gère l'affichage d'une image en gérant les formats HEIC
 * @param {File} file - Le fichier image
 * @returns {Promise<string>} - L'URL de l'image prête à afficher
 */
export const processImageForDisplay = async (file) => {
    if (isHeicFile(file)) {
        try {
            // Pour les fichiers HEIC, on essaie de les lire directement
            // Si le navigateur ne les supporte pas, on affiche un message d'erreur
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => {
                    // Vérifier si l'image peut être chargée
                    const img = new Image();
                    img.onload = () => resolve(reader.result);
                    img.onerror = () => {
                        console.warn('Fichier HEIC non supporté par le navigateur');
                        reject(new Error('Format HEIC non supporté. Veuillez convertir en JPEG.'));
                    };
                    img.src = reader.result;
                };
                reader.onerror = () => reject(new Error('Impossible de lire le fichier'));
                reader.readAsDataURL(file);
            });
        } catch (error) {
            console.error('Erreur lors du traitement du fichier HEIC:', error);
            throw new Error('Format HEIC non supporté. Veuillez convertir en JPEG avant l\'upload.');
        }
    } else {
        return createImageUrl(file);
    }
};

/**
 * Gère l'upload d'une image en vérifiant le format
 * @param {File} file - Le fichier image à uploader
 * @param {string} clientName - Le nom du client pour nommer le fichier
 * @returns {Promise<File>} - Le fichier prêt pour l'upload
 */
export const processImageForUpload = async (file, clientName = null) => {
    if (!file) {
        throw new Error('Aucun fichier fourni');
    }
    
    let fileName = file.name;
    
    // Si un nom de client est fourni, l'utiliser tel quel pour nommer le fichier (avec accents)
    if (clientName) {
        const fileExtension = file.name.split('.').pop().toLowerCase();
        fileName = `${clientName}.${fileExtension}`;
    }
    
    if (isHeicFile(file)) {
        // Pour les fichiers HEIC, on affiche un avertissement
        // La conversion se fera côté serveur
        console.warn('Fichier HEIC détecté. La conversion en JPEG se fera côté serveur.');
        
        // Créer un nouveau fichier avec l'extension .jpg pour l'upload
        const baseName = clientName ? clientName : file.name.replace(/\.(heic|heif)$/i, '');
        fileName = `${baseName}.jpg`;
        return new File([file], fileName, { type: 'image/jpeg' });
    }
    
    // Créer un nouveau fichier avec le nom du client (accents conservés)
    return new File([file], fileName, { type: file.type });
};

/**
 * Affiche un avertissement pour les fichiers HEIC
 * @param {File} file - Le fichier à vérifier
 * @returns {string|null} - Message d'avertissement ou null
 */
export const getHeicWarning = (file) => {
    if (isHeicFile(file)) {
        return "Fichier HEIC détecté. Il sera automatiquement converti en JPEG lors de l'upload.";
    }
    return null;
};

/**
 * Valide un fichier image
 * @param {File} file - Le fichier à valider
 * @returns {object} - Résultat de la validation
 */
export const validateImageFile = (file) => {
    if (!file) {
        return {
            valid: false,
            error: 'Aucun fichier fourni'
        };
    }

    // Accepte aussi les fichiers dont le nom finit par .heic ou .heif même si type vide
    const validTypes = [
        'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/heic', 'image/heif'
    ];
    const maxSize = 10 * 1024 * 1024; // 10MB

    const fileName = file.name ? file.name.toLowerCase() : '';
    const isHeicExt = fileName.endsWith('.heic') || fileName.endsWith('.heif');

    if ((!file.type || !validTypes.includes(file.type.toLowerCase())) && !isHeicExt) {
        return {
            valid: false,
            error: 'Format de fichier non supporté. Utilisez JPEG, PNG, GIF, WebP ou HEIC.'
        };
    }

    if (file.size > maxSize) {
        return {
            valid: false,
            error: 'Fichier trop volumineux. Taille maximum : 10MB.'
        };
    }

    return { valid: true };
}; 