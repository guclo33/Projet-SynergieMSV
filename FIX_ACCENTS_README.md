# Correction des problèmes avec les noms de fichiers contenant des accents

## Problème identifié

Lors de l'upload de fichiers vers AWS S3, les noms de fichiers contenant des caractères accentués (é, è, à, ç, etc.) causaient des problèmes car :

1. Le frontend encodait les noms de fichiers avec `encodeURIComponent()`
2. Le backend décodait avec `decodeURIComponent()`
3. AWS S3 peut avoir des problèmes avec certains caractères spéciaux dans les clés d'objets

## Solution implémentée

### 1. Fonction de normalisation des noms de fichiers

Une fonction `normalizeFileName()` a été créée qui :
- Décode d'abord le nom de fichier s'il est encodé
- Normalise les caractères Unicode (décompose les caractères accentués)
- Supprime les diacritiques (accents)
- Remplace les caractères spéciaux par des underscores
- Nettoie les underscores multiples et en début/fin

### 2. Fichiers modifiés

#### Backend (Node.js)
- `server/utils/fileUtils.js` - Nouveau fichier utilitaire centralisé
- `controller/formController.js` - Utilise la normalisation pour les photos de profil
- `controller/adminController.js` - Utilise la normalisation pour tous les uploads de fichiers

#### Frontend (React)
- `synergiemsv/src/pages/admin/components/subComponents/DropZone.js` - Supprime l'encodage côté frontend

#### Python
- `GenerateurTexte/utils/file_utils.py` - Nouveau fichier utilitaire Python
- `GenerateurTexte/AWS_S3.py` - Utilise la normalisation pour les uploads S3
- `GenerateurTexte/canvaAutofillExecute.py` - Utilise la normalisation pour les URLs de photos

### 3. Exemples de transformation

| Nom original | Nom normalisé |
|-------------|---------------|
| `photo_été.jpg` | `photo_ete.jpg` |
| `document_été_2023.pdf` | `document_ete_2023.pdf` |
| `profil_marie-claire.docx` | `profil_marie_claire.docx` |
| `rapport_été_été.docx` | `rapport_ete_ete.docx` |

## Avantages de cette solution

1. **Compatibilité AWS S3** : Les noms de fichiers normalisés sont compatibles avec toutes les fonctionnalités S3
2. **Cohérence** : Même logique de normalisation appliquée partout
3. **Lisibilité** : Les noms de fichiers restent lisibles même sans accents
4. **Robustesse** : Évite les erreurs liées aux caractères spéciaux

## Utilisation

La normalisation se fait automatiquement lors de :
- L'upload de photos de profil via le formulaire
- L'upload de fichiers via l'interface admin
- La génération de documents Word
- La création d'URLs de photos pour Canva

## Tests recommandés

1. Tester l'upload de fichiers avec des noms contenant des accents
2. Vérifier que les fichiers sont correctement stockés sur S3
3. Tester le téléchargement et l'affichage des fichiers normalisés
4. Vérifier que les URLs de photos fonctionnent correctement dans Canva 