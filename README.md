# Plateforme SynergieMSV


Une plateforme web conçue pour gérer efficacement les clients et les équipes des clients de Synergia. Personnalisé selon les demandes de la propriétaire. La plateforme permet la création de "profils" de personnalité grâce à l'intelligence artificiel pour ceux ayant rempli un questionnaires au préalable. 

---

## Table des matières

- [Aperçu](#aperçu)
- [Fonctionnalités](#fonctionnalités)
- [Technologies utilisées](#technologies-utilisées)
- [Deploiement](#Deploiement)
- [Licence](#licence)

---

## Aperçu

Cette plateforme a été développée pour centraliser la gestion des clients, générer des rapports, et optimiser les interactions entre les équipes. Elle inclut une interface conviviale permettant d'ajouter, de modifier, de visualiser les informations des clients et de générer des documents personnalisés à l'aide d'OpenAI. Ce texte sera également transposé dans un modèle Canva pour faciliter la finition. Pour l'instant seul la portion pour le rôle "admin" est disponible. 

## Fonctionnalités

- **Création d'utilisateur de plateforme** : Plateforme permettant de créer un mot de passe avec des sessions protégées et usage différent selon le type d'utilisateur.
- **Création de "Profils** : Création d'un texte automatisé, c'est également par cette fonction que le client ainsi que les leaders d'équipe seront enregistré dans la base de données.
- **Gestion des équipes** : Organisation des équipes liées aux leaders.
- **Téléversement et téléchargement de fichiers** : Gestion des documents pour chaque leader d'équipe.
- **Feuille de route** : liste de Todo pour avoir un meilleur suivi du progrès pour chaque client.
- **Navigation intuitive** : Interface claire et responsive.

## Technologies utilisées

- **Frontend** :
  - React
  - CSS (Grid, Flexbox)

- **Backend** :
  - Node.js
  - Express
  - Redis
  - Passport
  - Multer pour la gestion des fichiers

- **Base de données** :
  - PostgreSQL

- **API** :
  - OpenAI (GPT-4)
  - Canva

## Deploiement

Pour l'instant, le site n'est pas encore déployé et est en environement local seulement

## Amélioration à venir

- **Ajout des pages et fonctionnalités pour les rôles "leader" et "user"**
- **Ajout de fonction de recherche**
- **Ajout de la fonction "récupération de mot de passe**
- **Dans la fonction génération de texte, aller chercher directement les options disponibles. À la place de devoir connaître exactement le nom bien écrit**
- **Donner plus de flexibilité dans la création de client et leader**


## Licence

This project is proprietary and not open-source. All rights reserved.