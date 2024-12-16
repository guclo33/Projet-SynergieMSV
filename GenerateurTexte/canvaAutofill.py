import requests
import json
import time
import webbrowser

with open('accessToken.json', 'r') as file:
    data = json.load(file)
    access_token = data.get('accessToken')
    refresh_token = data.get("refreshToken")
    template_id = data.get("templateId")


def autofill_job(nom_profile, motivation_text, bref_text, forces_text, defis_text, changements_text, interpersonnelles_text, structure_text, problemes_text, arch1_nom, arch2_nom, desc_arch1_text, desc_arch2_text, travail_text, adapte_rouge_text, adapte_bleu_text, adapte_vert_text, adapte_jaune_text, bleu, rouge, jaune, vert) :

    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json"
    }

    data = {
                "brand_template_id": f"{template_id}",
                "title": nom_profile,
                "data": {
                    "motivationsNaturelles": {
                        "type": "text",
                        "text": motivation_text
                    },
                    "nomClient": {
                        "type": "text",
                        "text": nom_profile
                    },
                    "nomPersonalite": {
                        "type": "text",
                        "text": nom_profile
                    },
                    "enBref": {
                        "type": "text",
                        "text": bref_text
                    },
                    "valeurCouleur": {
                        "type": "chart",
                        "chart_data": {
                            "rows": [
                            {
                                "cells": [
                                {
                                    "type": "number",
                                    "value": bleu
                                },
                                {
                                    "type": "number",
                                    "value": rouge
                                },
                                {
                                    "type": "number",
                                    "value": jaune
                                },
                                {
                                    "type": "number",
                                    "value": vert
                                }
                                ]}
                            ]}}
                    ,
                    "forcesEnLumieres": {
                        "type": "text",
                        "text": forces_text
                    },
                    "defisPotentiels": {
                        "type": "text",
                        "text": defis_text
                    },
                    "perceptionChangement": {
                        "type": "text",
                        "text": changements_text
                    },
                    "relationsInterpersonnelles": {
                        "type": "text",
                        "text": interpersonnelles_text
                    },
                    "perceptionStructure": {
                        "type": "text",
                        "text": structure_text
                    },
                    "perceptionProblemes": {
                        "type": "text",
                        "text": problemes_text
                    },
                    "archNum1": {
                        "type": "text",
                        "text": arch1_nom
                    },
                    "archNum2": {
                        "type": "text",
                        "text": arch2_nom
                    },
                    "textArch1": {
                        "type": "text",
                        "text": desc_arch1_text
                    },
                    "textArch2": {
                        "type": "text",
                        "text": desc_arch2_text
                    },
                    "toiTravail": {
                        "type": "text",
                        "text": travail_text
                    },
                    "adapteRouge": {
                        "type": "text",
                        "text": adapte_rouge_text
                    },
                    "adapteBleu": {
                        "type": "text",
                        "text": adapte_bleu_text
                    },
                    "adapteVert": {
                        "type": "text",
                        "text": adapte_vert_text
                    },
                    "adapteJaune": {
                        "type": "text",
                        "text": adapte_jaune_text
                    }
                }
            }


    response = requests.post("https://api.canva.com/rest/v1/autofills",
                            headers = headers,
                            json = data)

    if response.status_code == 200:
        job = response.json()["job"]
        job_id = job["id"]
        print(f"Job ID: {job_id} démarré avec succès.")
        
        job_status = None
        
        while job_status != "success":
            time.sleep(5)
            
            job_response = requests.get(f"https://api.canva.com/rest/v1/autofills/{job_id}",
                                        headers = {"Authorization": f"Bearer {access_token}"})
            print("En train d'attendre la fin de la production")
            if job_response.status_code == 200:   
                job_done = job_response.json()["job"]
                job_status = job_done["status"]
                
                if job_status == "success":
                    edit_url = job_done["result"]["design"]["url"]
                    webbrowser.open(edit_url)
                    print(job_done)
                else :
                    print("job n'est pas terminé")
            else:
                print(f"Erreur lors de la vérification du statut du job: {job_response.status_code}")
    
    else:
        print(f"Erreur lors de la création du job: {response.status_code}")
    
    