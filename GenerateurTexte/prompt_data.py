import psycopg2
from dotenv import load_dotenv
import os
import json

load_dotenv()

def get_prompt_data (selectedSetId, promptName) :
    conn = psycopg2.connect(
    dbname= os.getenv("DB_RENDER_DATABASE"),
    user= os.getenv("DB_RENDER_USER"),
    password= os.getenv("DB_RENDER_PASSWORD"),
    host= os.getenv("DB_RENDER_HOST")
)
    cursor = conn.cursor()
    
    
    cursor.execute("SELECT value FROM prompts WHERE prompt_set_id = %s AND prompt_name = %s", [selectedSetId, promptName])
    value = cursor.fetchone() 
     
    
    cursor.close()
    conn.close()
    
    if value:
         
        return value[0] 
    else:
        print("Aucune valeur trouvé pour cet ID et nom de prompt.")
        return None
    

def get_prompts (selectedSetId) :
    conn = psycopg2.connect(
    dbname= os.getenv("DB_RENDER_DATABASE"),
    user= os.getenv("DB_RENDER_USER"),
    password= os.getenv("DB_RENDER_PASSWORD"),
    host= os.getenv("DB_RENDER_HOST")
)
    cursor = conn.cursor()
    
    
    cursor.execute("SELECT prompt_name, prompt_number, value FROM prompts WHERE prompt_set_id = %s", [selectedSetId])
    prompts = cursor.fetchall() 
    

     
    
    cursor.close()
    conn.close()
    
    if prompts:
         
        return prompts 
    else:
        print("Aucune valeur trouvé pour cet ID de prompt.")
        return None
    

