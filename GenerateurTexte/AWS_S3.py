import os
from docx import Document
import boto3
from botocore.exceptions import NoCredentialsError
from io import BytesIO
from dotenv import load_dotenv


#Connection à et setup AWS S3
load_dotenv()


BUCKET_NAME= os.getenv("AWS_BUCKET_NAME")

s3 = boto3.client(
    's3',
    aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
    aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY"),
    region_name=os.getenv("AWS_REGION")
)

def generate_simple_word_in_memory(text):
    doc = Document()
    doc.add_paragraph(text)
    buffer = BytesIO()
    doc.save(buffer)
    buffer.seek(0)
    return buffer

def file_exists_in_s3(s3_path):
    
    try:
        s3.head_object(Bucket=BUCKET_NAME, Key=s3_path)
        return True  
    except s3.exceptions.ClientError as e:
        if e.response['Error']['Code'] == "404":
            return False  
        else:
            raise  

def get_unique_s3_path(base_path):
    """Ajoute un suffixe au fichier si le fichier existe déjà."""
    count = 1
    s3_path = base_path
    while file_exists_in_s3(s3_path):
        
        s3_path = f"{base_path.rsplit('.docx', 1)[0]}_{count}.docx"
        count += 1
    return s3_path


def upload_to_s3(buffer, s3_path):
    try:
        unique_s3_path = get_unique_s3_path(s3_path)  
        s3.upload_fileobj(buffer, BUCKET_NAME, unique_s3_path)
        print(f"Fichier uploadé sur S3 à {unique_s3_path}")
    except NoCredentialsError:
        print("Erreur : Impossible de trouver les identifiants AWS.")
    except Exception as e:
        print(f"Erreur lors de l'upload sur S3 : {e}")

def synergia_upload_s3(full_text, nom_organisateur, nom_profile):        
    try:
        buffer = generate_simple_word_in_memory(full_text)
        s3_path = f"Synergia/{nom_organisateur}/{nom_profile}/profils/{nom_profile}.docx"
        upload_to_s3(buffer, s3_path)
    except Exception as e:
        print(f"Erreur lors de la génération et de l'upload du fichier Word : {e}")