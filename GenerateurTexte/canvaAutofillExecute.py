from canvaAutofill import autofill_job
import sys
import json
import psycopg2
from dotenv import load_dotenv
import os
import boto3


clientid = sys.argv[1]

conn = psycopg2.connect(
    dbname= os.getenv("DB_RENDER_DATABASE"),
    user= os.getenv("DB_RENDER_USER"),
    password= os.getenv("DB_RENDER_PASSWORD"),
    host= os.getenv("DB_RENDER_HOST")
)
cursor = conn.cursor()



cursor.execute("SELECT * from profile WHERE client_id = %s ORDER BY id DESC LIMIT 1", (clientid,))

data = cursor.fetchone()

nom_profile = data[2]
motivation_text = data[36]
bref_text = data[4]
forces_text = data[5]
defis_text = data[6]
changements_text = data[7]
interpersonnelles_text = data[8]
structure_text = data[9]
problemes_text = data[10]
arch1_nom = data[11]
arch2_nom = data[12]
desc_arch1_text = data[13]
desc_arch2_text = data[14]
travail_text = data[15]
adapte_rouge_text = data[16]
adapte_bleu_text = data[17]
adapte_vert_text = data[18]
adapte_jaune_text = data[19]
bleu = data[20]
rouge = data[21]
jaune = data[22]
vert = data[23]

s3_client = boto3.client(
    's3',
    aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
    aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY"),
    region_name=os.getenv("AWS_REGION")
)


photo_url = s3_client.generate_presigned_url(
        ClientMethod='get_object',
        Params={'Bucket': os.getenv("AWS_BUCKET_NAME"), 'Key': f"Synergia/Photos/{nom_profile}.png"},
        ExpiresIn=180
    )

print(photo_url)
    


print(adapte_rouge_text)
autofill_job(nom_profile, motivation_text, bref_text, forces_text, defis_text, changements_text, interpersonnelles_text, structure_text, problemes_text, arch1_nom, arch2_nom, desc_arch1_text, desc_arch2_text, travail_text, adapte_rouge_text, adapte_bleu_text, adapte_vert_text, adapte_jaune_text, bleu, rouge, jaune, vert, photo_url)

conn.commit()
cursor.close()
conn.close()