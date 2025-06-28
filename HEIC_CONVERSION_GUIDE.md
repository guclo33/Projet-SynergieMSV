# Guide complet de conversion HEIC

## Vue d'ensemble

Ce guide explique comment gérer les fichiers HEIC dans votre application Synergia, depuis l'upload jusqu'à l'affichage.

## 🚀 Installation des dépendances

### Backend (Node.js)
```bash
npm install sharp
```

### Frontend (React)
Aucune dépendance supplémentaire requise - la conversion se fait côté serveur.

## 📁 Structure des fichiers

```
server/
├── utils/
│   └── fileUtils.js          # Utilitaires de traitement d'images
├── scripts/
│   └── migrateHeicFiles.js   # Script de migration des fichiers existants
└── ...

synergiemsv/src/
├── components/
│   └── imageUtils.js         # Utilitaires côté frontend
└── ...
```

## 🔄 Conversion automatique

### 1. Upload de nouveaux fichiers

Les fichiers HEIC sont automatiquement convertis en JPEG lors de l'upload :

#### Côté frontend (DropZone)
```javascript
import { processImageForUpload, getHeicWarning } from '../../../../components/imageUtils';

// Le fichier est préparé pour l'upload (conversion côté serveur)
const processedFile = await processImageForUpload(selectedFile);

// Afficher un avertissement pour les fichiers HEIC
const warning = getHeicWarning(file);
```

#### Côté backend (Controllers)
```javascript
import { processImageFile } from '../server/utils/fileUtils';

// Le fichier est traité avant l'envoi vers S3
const processedFile = await processImageFile(file.buffer, file.originalname, file.mimetype);
```

### 2. Migration des fichiers existants

Pour migrer les fichiers HEIC existants vers JPEG :

```bash
# Exécuter le script de migration
npm run migrate-heic
```

Le script va :
- Trouver tous les fichiers HEIC dans le bucket S3
- Les convertir en JPEG
- Supprimer les anciens fichiers HEIC
- Afficher un rapport de migration

## 🎯 Utilisation dans le code

### Frontend - Validation et avertissements

```javascript
import { validateImageFile, getHeicWarning, isHeicFile } from '../components/imageUtils';

// Valider un fichier image
const validation = validateImageFile(file);
if (!validation.valid) {
    console.error(validation.error);
}

// Afficher un avertissement pour les fichiers HEIC
const warning = getHeicWarning(file);
if (warning) {
    // Afficher l'avertissement à l'utilisateur
}

// Vérifier si un fichier est HEIC
if (isHeicFile(file)) {
    console.log('Fichier HEIC détecté');
}
```

### Backend - Traitement d'images

```javascript
import { 
    processImageFile, 
    convertHeicToJpeg, 
    isHeicFile 
} from '../server/utils/fileUtils';

// Traitement complet d'une image
const processedFile = await processImageFile(buffer, fileName, mimetype);

// Conversion directe HEIC → JPEG
const jpegBuffer = await convertHeicToJpeg(heicBuffer);

// Vérification du type de fichier
if (isHeicFile(fileName, mimetype)) {
    console.log('Fichier HEIC détecté');
}
```

## 🔧 Configuration

### Variables d'environnement

Assurez-vous que ces variables sont définies :
```env
AWS_BUCKET_NAME=your-bucket-name
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_REGION=your-region
```

### Qualité de conversion

La qualité JPEG est configurée à 90% par défaut. Pour la modifier :

```javascript
// Dans server/utils/fileUtils.js
const jpegBuffer = await sharp(fileBuffer)
    .jpeg({ quality: 85 }) // Changer la qualité ici
    .toBuffer();
```

## 📊 Avantages de cette approche

### Conversion côté serveur (Recommandé)
- ✅ Conversion automatique lors de l'upload
- ✅ Qualité optimisée avec Sharp
- ✅ Compatibilité garantie
- ✅ Pas de dépendance côté client
- ✅ Gestion d'erreurs robuste

### Interface utilisateur améliorée
- ✅ Avertissements pour les fichiers HEIC
- ✅ Validation des fichiers avant upload
- ✅ Messages d'erreur clairs
- ✅ Indicateurs de progression

## 🐛 Dépannage

### Erreur "sharp module not found"
```bash
npm install sharp
# ou
npm rebuild sharp
```

### Fichiers HEIC non convertis
1. Vérifiez que sharp est installé
2. Vérifiez les logs du serveur
3. Exécutez le script de migration

### Problèmes de performance
- Réduisez la qualité JPEG (85% au lieu de 90%)
- Ajoutez des délais entre les conversions
- Optimisez la taille des fichiers avant upload

## 📈 Métriques de conversion

Le système log automatiquement :
- Nombre de fichiers convertis
- Temps de conversion
- Erreurs de conversion
- Taille des fichiers avant/après

## 🔮 Évolutions futures

### Améliorations possibles
- Support du format WebP
- Compression progressive
- Redimensionnement automatique
- Cache des conversions
- Conversion en arrière-plan

### Formats supportés
- ✅ HEIC/HEIF → JPEG
- ✅ JPEG (inchangé)
- ✅ PNG (inchangé)
- 🔄 WebP (à implémenter)
- 🔄 AVIF (à implémenter)

## 📞 Support

En cas de problème :
1. Vérifiez les logs du serveur
2. Exécutez le script de migration
3. Vérifiez les dépendances
4. Consultez la documentation Sharp

## 🎉 Résultat final

Avec cette implémentation :
- Les fichiers HEIC sont automatiquement convertis en JPEG
- L'interface affiche des avertissements appropriés
- La conversion se fait côté serveur pour une meilleure fiabilité
- Les fichiers existants peuvent être migrés en lot
- Tous les formats d'image sont supportés de manière transparente 