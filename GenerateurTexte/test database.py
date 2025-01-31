import os
import sys
import pandas as pd
import warnings
warnings.filterwarnings("ignore", category=UserWarning, module="openpyxl")
pd.set_option('future.no_silent_downcasting', True)
from openai import OpenAI
from docx import Document
from AWS_S3 import synergia_upload_s3
from canvaAutofill import autofill_job
from fonction_database import update_database
from dotenv import load_dotenv
import profil_generator_data
import json

form = profil_generator_data.get_profil_data(26)

bleu = profil_generator_data.moyenne_bleu(form["form_1_15"])
rouge = profil_generator_data.moyenne_bleu(form["form_1_15"])
jaune = profil_generator_data.moyenne_bleu(form["form_1_15"])
vert = profil_generator_data.moyenne_bleu(form["form_1_15"])
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



print(explorateur)