const XLSX = require("xlsx");
const pg = require("pg");
const fs = require("fs")
require("dotenv").config
const pool = require("./database.js")




// 📂 Lire le fichier Excel
const filePath = "C:/Users/Guillaume Cloutier/OneDrive/Synergia/Synergia.xlsx"; // Remplace par le chemin de ton fichier Excel
const workbook = XLSX.readFile(filePath);
const sheetName = workbook.SheetNames[7]; // Prend la première feuille
const worksheet = workbook.Sheets[sheetName];

// 📌 Convertir les données Excel en JSON
let jsonData = XLSX.utils.sheet_to_json(worksheet);
jsonData = jsonData.filter((row, index) => index >= 22);


// 📌 Fonction pour insérer les données dans PostgreSQL

const insertDataToDB = async () => {
    try {
        // Parcours chaque ligne du fichier Excel
        for (const row of jsonData) {
            const clientId = row["client_id"] || null;
            const form = JSON.stringify(row); // Convertir l'objet JSON en string

            // 📝 Insérer la ligne dans la table PostgreSQL
            await pool.query(
                "INSERT INTO questionnaire (client_id, form) VALUES ($1, $2)",
                [clientId, form]
            );
        }

        pool.end(); // Ferme la connexion
    } catch (error) {
        console.error("❌ Erreur lors de l'insertion :", error);
    }
};

// 🔥 Exécuter l'import
insertDataToDB();
