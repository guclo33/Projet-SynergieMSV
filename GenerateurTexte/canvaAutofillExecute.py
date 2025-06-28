from canvaAutofill import autofill_job
import sys
import json
import psycopg2
from dotenv import load_dotenv
import os
import boto3
from utils.file_utils import normalize_filename

load_dotenv()

# Valider l'argument clientid
if len(sys.argv) < 2:
    print("Erreur: clientid manquant")
    sys.exit(1)

clientid = sys.argv[1]

# Valider que clientid est un nombre valide
try:
    clientid_int = int(clientid)
    print(f"Client ID recu: {clientid_int}")
except ValueError:
    print(f"Erreur: clientid '{clientid}' n'est pas un nombre valide")
    sys.exit(1)

conn = psycopg2.connect(
    dbname= os.getenv("DB_RENDER_DATABASE"),
    user= os.getenv("DB_RENDER_USER"),
    password= os.getenv("DB_RENDER_PASSWORD"),
    host= os.getenv("DB_RENDER_HOST")
)
cursor = conn.cursor()

try:
    cursor.execute("SELECT * from profile WHERE client_id = %s ORDER BY id DESC LIMIT 1", (clientid_int,))
    data = cursor.fetchone()
    
    if not data:
        print(f"Erreur: Aucun profil trouve pour client_id = {clientid_int}")
        sys.exit(1)
        
    print(f"Profil trouve pour client_id = {clientid_int}")
    
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

    # Debug logging for AWS credentials
    print(f"AWS Access Key ID present: {'Yes' if os.getenv('AWS_ACCESS_KEY_ID') else 'No'}")
    print(f"AWS Secret Access Key present: {'Yes' if os.getenv('AWS_SECRET_ACCESS_KEY') else 'No'}")
    print(f"AWS Region: {os.getenv('AWS_REGION')}")
    print(f"AWS Bucket Name: {os.getenv('AWS_BUCKET_NAME')}")

    # Utiliser le nom original sans normalisation pour S3
    print(f"Nom profil original: {nom_profile}")
    print(f"Nom profil pour S3: {nom_profile}")

    # Essayer differentes extensions d'images courantes
    image_extensions = ['jpg', 'jpeg', 'png', 'gif', 'webp']
    photo_url = None

    for ext in image_extensions:
        try:
            # Verifier si l'objet existe dans S3 avant de generer l'URL signee
            s3_key = f"Synergia/Photos/{nom_profile}.{ext}"
            print(f"Verification de l'existence de la cle S3: {s3_key}")
            
            # Verifier si l'objet existe
            s3_client.head_object(Bucket=os.getenv("AWS_BUCKET_NAME"), Key=s3_key)
            print(f"Objet trouve dans S3 avec l'extension .{ext}")
            
            # Generer l'URL signee seulement si l'objet existe
            photo_url = s3_client.generate_presigned_url(
                ClientMethod='get_object',
                Params={'Bucket': os.getenv("AWS_BUCKET_NAME"), 'Key': s3_key},
                ExpiresIn=3600  # 1 heure
            )
            print(f"URL signee generee pour .{ext}")
            break  # Sortir de la boucle si on trouve la photo
        except s3_client.exceptions.NoSuchKey:
            print(f"Objet non trouve dans S3 avec l'extension .{ext}")
            continue
        except Exception as e:
            print(f"Erreur lors de la verification de l'extension .{ext}: {e}")
            continue

    if not photo_url:
        print(f"Aucune photo trouvee pour {nom_profile} dans S3")
        print("Extensions testees:", image_extensions)
        photo_url = None
    else:
        print(f"URL signee generee avec succes pour {nom_profile}")

    autofill_job(nom_profile, motivation_text, bref_text, forces_text, defis_text, changements_text, interpersonnelles_text, structure_text, problemes_text, arch1_nom, arch2_nom, desc_arch1_text, desc_arch2_text, travail_text, adapte_rouge_text, adapte_bleu_text, adapte_vert_text, adapte_jaune_text, bleu, rouge, jaune, vert, photo_url)

except Exception as e:
    print(f"Erreur lors de l'execution: {e}")
    sys.exit(1)
finally:
    conn.commit()
    cursor.close()
    conn.close()