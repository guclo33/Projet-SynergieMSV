import os
import pandas as pd
import warnings
warnings.filterwarnings("ignore", category=UserWarning, module="openpyxl")
pd.set_option('future.no_silent_downcasting', True)
from openai import OpenAI
from openai.types import Completion, CompletionChoice, CompletionUsage
import textwrap



  
#code pour automatisation, activation lors de réception d'un nouveau formulaire

#NOM

nom = "Veillette, Joanie"

#DONNÉES EXCEL

#Pour trouver les data du client
synergia = pd.read_excel("C:/Users/Guillaume Cloutier/OneDrive/Synergia/Synergia.xlsx", sheet_name="synergia_mlm")

synergia_nom = pd.DataFrame(synergia.loc[synergia["Prénom, Nom"]== nom])

nom_leader = synergia_nom.iloc[0,4]

#Pour avoir les pourcentage de Couleur et d'archétype

def moyenne(*colonnes):
    colonne = synergia_nom.iloc[:,list(colonnes)].replace({
        "Plus comme moi" : 10,
        "Moins comme moi" : 0
    }).infer_objects(copy=False)
    valeurs= colonne.to_numpy()
    return round(valeurs.mean()*10)




print(nom_leader)
