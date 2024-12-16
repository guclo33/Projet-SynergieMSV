import psycopg2
from dotenv import load_dotenv
import os

load_dotenv()

def update_database (nom_profile, motivation_text, bref_text, forces_text, defis_text, changements_text, interpersonnelles_text, structure_text, problemes_text, arch1_nom, arch2_nom, desc_arch1_text, desc_arch2_text, travail_text, adapte_rouge_text, adapte_bleu_text, adapte_vert_text, adapte_jaune_text, bleu, rouge, jaune, vert, explorateur, protecteur, bouffon, souverain, magicien, createur, hero, citoyen, sage, amoureuse, rebelle, optimiste , email, nom_leader) :
    
    conn = psycopg2.connect(
    dbname= os.getenv("DB_DATABASE"),
    user= os.getenv("DB_USER"),
    password= os.getenv("DB_PASSWORD"),
    host= os.getenv("DB_HOST")
)
    cursor = conn.cursor()
    
    
    
    cursor.execute("INSERT INTO leader (nom_leader) VALUES (%s) ON CONFLICT (nom_leader) DO UPDATE SET nom_leader = EXCLUDED.nom_leader RETURNING ID", (nom_leader,))
    leader_id = cursor.fetchone()[0]
    
    cursor.execute(
        """WITH ins AS (
            INSERT INTO client (nom_client, email, leader_id)
            VALUES (%s, %s, %s) 
            ON CONFLICT (nom_client, email) DO UPDATE SET nom_client = EXCLUDED.nom_client
            RETURNING id
        ) 
        SELECT id FROM ins 
        UNION ALL 
        SELECT id FROM client WHERE nom_client = %s AND email = %s;""", (nom_profile, email, leader_id, nom_profile, email)
    )
    client_id = cursor.fetchone()[0]
        


    # Insérer les données dans la table
    cursor.execute(
        "INSERT INTO profile (client_id, nomclient, email , enbref,  forcesenlumieres, defispotentiels, perceptionchangement, relationsinterpersonnelles, perceptionstructure, perceptionproblemes, archnum1, archnum2, textarch1, textarch2, toitravail, adapterouge, adaptebleu, adaptevert, adaptejaune, bleu, rouge, jaune, vert, explorateur, protecteur, bouffon, souverain, magicien, createur, hero, citoyen, sage, amoureuse, rebelle, optimiste, motivationsnaturelles ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s) RETURNING id",
        (client_id, nom_profile, email, bref_text, forces_text, defis_text, changements_text, interpersonnelles_text, structure_text, problemes_text, arch1_nom, arch2_nom, desc_arch1_text, desc_arch2_text, travail_text, adapte_rouge_text, adapte_bleu_text, adapte_vert_text, adapte_jaune_text, bleu, rouge, jaune, vert, explorateur, protecteur, bouffon, souverain, magicien, createur, hero, citoyen, sage, amoureuse, rebelle, optimiste, motivation_text )
    )
    profile_id = cursor.fetchone()[0]
    
    cursor.execute("INSERT INTO client_profile (client_id, profile_id) VALUES (%s, %s)", (client_id, profile_id))
    
    cursor.execute("""
        UPDATE client
        SET profile_id = %s
        WHERE id = %s
        """, (profile_id, client_id))
    

    # Valider les changements et fermer la connexion
    conn.commit()
    cursor.close()
    conn.close()


