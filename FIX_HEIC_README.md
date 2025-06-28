# Correction des problèmes avec les fichiers HEIC et types MIME

## Problème identifié

Lors de l'upload de photos vers AWS S3, certains fichiers (notamment les photos HEIC prises avec des appareils iOS récents) causaient des problèmes :

1. **Fichiers HEIC** : Les appareils iOS récents prennent des photos au format HEIC, mais les navigateurs ne les reconnaissent pas toujours correctement
2. **Types MIME incorrects** : Le type MIME détecté par multer n'était pas toujours correct
3. **Affichage vs téléchargement** : Certaines images s'affichaient directement, d'autres forçaient un téléchargement

## Solution implémentée

### 1. Normalisation des types MIME

Une fonction `normalizeMimeType()` a été créée qui :
- Détecte et convertit les fichiers HEIC/HEIF en JPEG
- Normalise les types MIME pour tous les formats d'image
- Mappe les types MIME vers les bonnes extensions de fichiers

### 2. Gestion des extensions multiples

Les fonctions de récupération de photos essaient maintenant plusieurs extensions :
- `jpg`, `jpeg`, `png`, `gif`, `webp`
- Trouve automatiquement la bonne extension pour chaque photo

### 3. Headers HTTP appropriés

Ajout de `ContentDisposition: 'inline'` pour les images afin qu'elles s'affichent directement dans le navigateur au lieu de forcer un téléchargement.

## Fichiers modifiés

### Backend (Node.js)
- `server/utils/fileUtils.js` - Ajout des fonctions `normalizeMimeType()` et `isImage()`
- `controller/formController.js` - Utilise la normalisation MIME pour les photos de profil
- `controller/adminController.js` - Utilise la normalisation MIME pour tous les uploads

### Python
- `GenerateurTexte/canvaAutofillExecute.py` - Essaie plusieurs extensions lors de la génération d'URLs

## Exemples de transformation

### Types MIME
| Type original | Type normalisé | Extension |
|---------------|----------------|-----------|
| `image/heic` | `image/jpeg` | `.jpg` |
| `image/heif` | `image/jpeg` | `.jpg` |
| `image/jpeg` | `image/jpeg` | `.jpg` |
| `image/png` | `image/png` | `.png` |

### Extensions de fichiers
| Nom original | Nom normalisé |
|-------------|---------------|
| `photo.heic` | `photo.jpg` |
| `image.HEIC` | `image.jpg` |
| `photo.jpeg` | `photo.jpg` |

## Avantages de cette solution

1. **Compatibilité universelle** : Les fichiers HEIC sont automatiquement convertis en JPEG
2. **Affichage direct** : Les images s'affichent directement dans le navigateur
3. **Flexibilité** : Support de multiples formats d'image
4. **Robustesse** : Gestion automatique des extensions manquantes

## Différence entre les anciennes et nouvelles photos

### Anciennes photos (fonctionnelles)
- Type MIME : `image/jpeg` ou `image/png`
- Extension : `.jpg` ou `.png`
- Affichage : Direct dans le navigateur

### Nouvelles photos (problématiques)
- Type MIME : `image/heic` ou `image/heif`
- Extension : `.heic` ou `.heif`
- Affichage : Forçait un téléchargement

### Après correction
- Type MIME : Toujours `image/jpeg` pour les HEIC
- Extension : Toujours `.jpg` pour les HEIC
- Affichage : Direct dans le navigateur

## Tests recommandés

1. Tester l'upload de photos HEIC depuis un iPhone
2. Vérifier que les photos s'affichent directement dans le navigateur
3. Tester la récupération de photos avec différentes extensions
4. Vérifier que les URLs générées pour Canva fonctionnent correctement

## Le plus fiable

**La nouvelle approche est plus fiable** car :
- Elle normalise tous les types de fichiers
- Elle garantit la compatibilité avec tous les navigateurs
- Elle évite les problèmes de téléchargement forcé
- Elle supporte automatiquement les nouveaux formats d'image 