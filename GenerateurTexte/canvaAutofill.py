import requests
import json
import time
import base64
import psycopg2
from dotenv import load_dotenv
import os
from flask import Flask, jsonify

app = Flask(__name__)
load_dotenv()

# Connexion à la base de données
conn = psycopg2.connect(
    dbname=os.getenv("DB_RENDER_DATABASE"),
    user=os.getenv("DB_RENDER_USER"),
    password=os.getenv("DB_RENDER_PASSWORD"),
    host=os.getenv("DB_RENDER_HOST")
)
cursor = conn.cursor()
cursor.execute("SELECT * FROM canva_token")
canva_token = cursor.fetchone()

access_token = canva_token[2]
template_id = canva_token[4]

# 🎨 Création du design avec données + image

def autofill_job(nom_profile, motivation_text, bref_text, forces_text, defis_text, changements_text, interpersonnelles_text, structure_text, problemes_text, arch1_nom, arch2_nom, desc_arch1_text, desc_arch2_text, travail_text, adapte_rouge_text, adapte_bleu_text, adapte_vert_text, adapte_jaune_text, bleu, rouge, jaune, vert, photo_url):
    if photo_url :
        # ---- Upload image dans Canva ----
        name_base64 = base64.b64encode(nom_profile.encode("utf-8")).decode("utf-8")
        image_response = requests.get(photo_url)
        if image_response.status_code != 200:
            print("Erreur en téléchargeant l’image :", image_response.status_code)
            

        headers_upload = {
            "Authorization": f"Bearer {access_token}",
            "Content-Type": "application/octet-stream",
            "Asset-Upload-Metadata": json.dumps({"name_base64": name_base64})
        }

        upload_response = requests.post(
            "https://api.canva.com/rest/v1/asset-uploads",
            headers=headers_upload,
            data=image_response.content
        )

        upload_json = upload_response.json()
        print("Upload response:", json.dumps(upload_json, indent=2))

        if upload_response.status_code != 200 or "job" not in upload_json:
            print("❌ Upload initial échoué.")
            

    job_id = upload_json["job"]["id"]
    job_status = upload_json["job"]["status"]

    if job_status != "success":
        for _ in range(10):
            print(f"⌛ Attente du traitement du job Canva... (status: {job_status})")
            time.sleep(5)
            check_response = requests.get(
                f"https://api.canva.com/rest/v1/asset-uploads/{job_id}",
                headers={"Authorization": f"Bearer {access_token}"}
            )
            check_json = check_response.json()
            job_status = check_json["job"]["status"]
            print("Check response:", json.dumps(check_json, indent=2))
            if job_status == "success":
                asset_id = check_json["job"]["asset"]["id"]
                break
        else:
            print("❌ L'upload a pris trop de temps ou a échoué.")
            return
    else:
        asset_id = upload_json["job"]["asset"]["id"]

    # ---- Suite du design Canva ----
    print("starting autofill job")
    print(asset_id)

    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json"
    }

    data = {
        "brand_template_id": template_id,
        "title": nom_profile,
        "data": {
            "motivationsNaturelles": {"type": "text", "text": motivation_text},
            "nomClient": {"type": "text", "text": nom_profile},
            "nomPersonalite": {"type": "text", "text": nom_profile},
            "enBref": {"type": "text", "text": bref_text},
            "valeurCouleur": {
                "type": "chart",
                "chart_data": {
                    "rows": [
                        {"cells": [
                            {"type": "number", "value": bleu},
                            {"type": "number", "value": rouge},
                            {"type": "number", "value": jaune},
                            {"type": "number", "value": vert}
                        ]},
                        {"cells": [
                            {"type": "number", "value": bleu},
                            {"type": "number", "value": rouge},
                            {"type": "number", "value": jaune},
                            {"type": "number", "value": vert}
                        ]}
                    ]
                }
            },
            "forcesEnLumieres": {"type": "text", "text": forces_text},
            "defisPotentiels": {"type": "text", "text": defis_text},
            "perceptionChangement": {"type": "text", "text": changements_text},
            "relationsInterpersonnelles": {"type": "text", "text": interpersonnelles_text},
            "perceptionStructure": {"type": "text", "text": structure_text},
            "perceptionProblemes": {"type": "text", "text": problemes_text},
            "archNum1": {"type": "text", "text": arch1_nom},
            "archNum2": {"type": "text", "text": arch2_nom},
            "textArch1": {"type": "text", "text": desc_arch1_text},
            "textArch2": {"type": "text", "text": desc_arch2_text},
            "toiTravail": {"type": "text", "text": travail_text},
            "adapteRouge": {"type": "text", "text": adapte_rouge_text},
            "adapteBleu": {"type": "text", "text": adapte_bleu_text},
            "adapteVert": {"type": "text", "text": adapte_vert_text},
            "adapteJaune": {"type": "text", "text": adapte_jaune_text},
            "photoProfil": {"type": "image", "asset_id": asset_id}
        }
    }

    response = requests.post("https://api.canva.com/rest/v1/autofills", headers=headers, json=data)

    if response.status_code == 200:
        job = response.json()["job"]
        job_id = job["id"]
        print(f"Job ID: {job_id} démarré avec succès.")
        job_status = None

        while job_status != "success":
            time.sleep(5)
            job_response = requests.get(f"https://api.canva.com/rest/v1/autofills/{job_id}",
                                        headers={"Authorization": f"Bearer {access_token}"})
            if job_response.status_code == 200:
                job_done = job_response.json()["job"]
                job_status = job_done["status"]

                if job_status == "success":
                    edit_url = job_done["result"]["design"]["urls"]["edit_url"]
                    print("✅ Design prêt :", edit_url)
                    return edit_url
                else:
                    print("⌛ En attente de finalisation...")
            else:
                print("❌ Erreur lors du suivi du job Canva.")
                break
    else:
        print("❌ Erreur lors de la création du design Canva :", response.text)

# 🔹 Fermer la connexion DB
conn.commit()
cursor.close()
conn.close()
