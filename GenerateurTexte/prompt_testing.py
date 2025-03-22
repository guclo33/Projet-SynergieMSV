import os
import sys
import warnings
warnings.filterwarnings("ignore", category=UserWarning, module="openpyxl")
from openai import OpenAI
from docx import Document
from AWS_S3 import synergia_upload_s3
from dotenv import load_dotenv
import profil_generator_data
import prompt_data
import json




form_id = sys.argv[1]
promptName = sys.argv[2]
selectedSetId = sys.argv[3]

if form_id == "error":
    raise ValueError("Une erreur s'est produite")

system_value = prompt_data.get_prompt_data(selectedSetId, "system")

prompt_value = prompt_data.get_prompt_data(selectedSetId, promptName)   

form = profil_generator_data.get_profil_data(form_id)

first_name = form["first_name"]

nom_profile = form["nom_client"]

client_id = form["client_id"]

group_name = form["group_name"]

form_1_15 = json.dumps(form["form_1_15"], indent = 2, ensure_ascii=False)

form_16_24 = json.dumps(form["form_16_24"], indent = 2, ensure_ascii=False)

form_dev = json.dumps(form["form_dev"], indent =2, ensure_ascii=False )


#Pour le model 1

model1_form = json.dumps(profil_generator_data.model1_form, indent =2, ensure_ascii=False)

#Pour le model 2

model2_form = json.dumps(profil_generator_data.model2_form, indent =2, ensure_ascii=False)

#***VARIABLES ET FONCTIONS***

client = OpenAI(
    api_key=os.environ.get("OPENAI_API_KEY"),
)

def generateur_texte(message, token):
    response=client.chat.completions.create(model= "gpt-4o", 
        messages = message, 
        max_tokens = token)
    return response
  
def context_append(assistant, user) :
  message_data.append( 
    {
      "role": "assistant", 
      "content": assistant
    }
  )
  message_data.append(
    {
        "role": "user",
        "content": user
    }
  )


    
#Pour avoir les pourcentage de Couleur et d'archétype

bleu = profil_generator_data.moyenne_bleu(form["form_1_15"])
rouge = profil_generator_data.moyenne_rouge(form["form_1_15"])
jaune = profil_generator_data.moyenne_jaune(form["form_1_15"])
vert = profil_generator_data.moyenne_vert(form["form_1_15"])
explorateur = profil_generator_data.moyenne_explorateur(form["form_16_24"])
protecteur = profil_generator_data.moyenne_protecteur(form["form_16_24"])
bouffon = profil_generator_data.moyenne_bouffon(form["form_16_24"])
souverain = profil_generator_data.moyenne_souverain(form["form_16_24"])
magicien = profil_generator_data.moyenne_magicien(form["form_16_24"])
createur = profil_generator_data.moyenne_createur(form["form_16_24"])
hero = profil_generator_data.moyenne_hero(form["form_16_24"])
citoyen = profil_generator_data.moyenne_citoyen(form["form_16_24"])
sage = profil_generator_data.moyenne_sage(form["form_16_24"])
amoureuse = profil_generator_data.moyenne_amoureuse(form["form_16_24"])
rebelle = profil_generator_data.moyenne_rebelle(form["form_16_24"])
optimiste = profil_generator_data.moyenne_optimiste(form["form_16_24"])


text_pourcentage_complet = f"COULEURS\nbleu : {bleu}%, rouge : {rouge}%, jaune : {jaune}%, vert : {vert}%\n" + f"ARCHÉTYPE\nexploreur : {explorateur}%, protecteur : {protecteur}%, bouffon : {bouffon}%, souverain : {souverain}%\nmagicien : {magicien}%, créateur : {createur}%, héro : {hero}%, citoyen : {citoyen}%\nsage : {sage}%, amoureuse : {amoureuse}%, rebelle : {rebelle}%, optimiste : {optimiste}%\n\n"

text_pourcentage_couleur = f"COULEURS\nbleu : {bleu}%, rouge : {rouge}%, jaune : {jaune}%, vert : {vert}%\n"

text_pourcentage_archetype= f"ARCHÉTYPE\nexploreur : {explorateur}%, protecteur : {protecteur}%, bouffon : {bouffon}%, souverain : {souverain}%\nmagicien : {magicien}%, créateur : {createur}%, héro : {hero}%, citoyen : {citoyen}%\nsage : {sage}%, amoureuse : {amoureuse}%, rebelle : {rebelle}%, optimiste : {optimiste}%"

# GÉNÉRER UN TEXTE POUR CHAQUE SECTION

#SECTION "EN BREF":

system_append = f"""Voici les informations spécifiques au client :
prénom du client : {first_name}. Voici aussi les réponses à son questionnaire, tu vas trouver trois sections différentes, si tu ne te fais pas demander une utilisation spécifique de l'un d'entre eux, utilise les tous.
Questionnaire en lien avec les couleurs de personnalité : {form_1_15}
Questionnaire en lien avec les archétypes : {form_16_24}
Questionnaire en lien avec les valeurs ou questions à développement : {form_dev}
"""
system_value = system_value + system_append


message_data= [{"role": "system",
               "content": system_value},
               {"role": "user",
               "content": prompt_value},
]

text = generateur_texte(message_data, 2000)

globals()[promptName] = text.choices[0].message.content

print(promptName)




