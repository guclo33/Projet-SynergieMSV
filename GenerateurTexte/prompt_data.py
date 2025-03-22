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
    value = cursor.fetchone()[0] 
     
    
    print ("value fetched", value)
    
    cursor.close()
    conn.close()
    
    if value:
         
        return value 
    else:
        print("Aucune valeur trouvé pour cet ID et nom de prompt.")
        return None
    
