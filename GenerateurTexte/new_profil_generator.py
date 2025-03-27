import os
import sys
import warnings
import time
import json
import requests
from requests.exceptions import RequestException

warnings.filterwarnings("ignore", category=UserWarning, module="openpyxl")
from openai import OpenAI
from dotenv import load_dotenv
import profil_generator_data
import prompt_data

# Load environment variables
load_dotenv()

# Check if API key is set
if not os.environ.get("OPENAI_API_KEY"):
    print("Error: OPENAI_API_KEY environment variable is not set.")
    sys.exit(1)

# Uncomment these lines when running with command line arguments
# form_id = sys.argv[1]
# selectedSetId = sys.argv[2]
form_id = 61
selectedSetId = "1"

if form_id == "error":
    raise ValueError("Une erreur s'est produite")

# Initialize OpenAI client with timeout and retry settings
client = OpenAI(
    api_key=os.environ.get("OPENAI_API_KEY"),
    timeout=60.0,  # Increase timeout to 60 seconds
)

def generateur_texte_with_retry(message, token):
    try:
        response = client.chat.completions.create(
            model="gpt-4o", 
            messages=message, 
            max_tokens=token
        )
        return response
    except Exception as e:
        print(f"Error calling OpenAI API: {str(e)}")
        # If we've retried the maximum number of times, return a placeholder
        return None

# Get all prompts for the selected set
try:
    prompts = prompt_data.get_prompts(selectedSetId)
except Exception as e:
    print(f"Error getting prompts: {str(e)}")
    sys.exit(1)

# Get form data
try:
    form = profil_generator_data.get_profil_data(form_id)
except Exception as e:
    print(f"Error getting form data: {str(e)}")
    sys.exit(1)

# Extract form data
first_name = form["first_name"]
nom_profile = form["nom_client"]
client_id = form["client_id"]
group_name = form["group_name"]
form_1_15 = json.dumps(form["form_1_15"], ensure_ascii=False)
form_16_24 = json.dumps(form["form_16_24"], ensure_ascii=False)
form_dev = json.dumps(form["form_dev"], ensure_ascii=False)

# Calculate percentages
try:
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
except Exception as e:
    print(f"Error calculating percentages: {str(e)}")
    sys.exit(1)

text_pourcentage_complet = f"COULEURS\nbleu : {bleu}%, rouge : {rouge}%, jaune : {jaune}%, vert : {vert}%\n" + f"ARCHÉTYPE\nexploreur : {explorateur}%, protecteur : {protecteur}%, bouffon : {bouffon}%, souverain : {souverain}%\nmagicien : {magicien}%, créateur : {createur}%, héro : {hero}%, citoyen : {citoyen}%\nsage : {sage}%, amoureuse : {amoureuse}%, rebelle : {rebelle}%, optimiste : {optimiste}%\n\n"
text_pourcentage_couleur = f"COULEURS\nbleu : {bleu}%, rouge : {rouge}%, jaune : {jaune}%, vert : {vert}%\n"
text_pourcentage_archetype = f"ARCHÉTYPE\nexploreur : {explorateur}%, protecteur : {protecteur}%, bouffon : {bouffon}%, souverain : {souverain}%\nmagicien : {magicien}%, créateur : {createur}%, héro : {hero}%, citoyen : {citoyen}%\nsage : {sage}%, amoureuse : {amoureuse}%, rebelle : {rebelle}%, optimiste : {optimiste}%"

# Get system prompt
try:
    system_base = prompt_data.get_prompt_data(selectedSetId, "system")
    system_append = f"""Voici les informations spécifiques au client :
- Prénom : {first_name}
- Groupe : {group_name}
- Résultats DISC : {form_1_15}
- Résultats Archétypes : {form_16_24}
- Réponses développement : {form_dev}

Ces données doivent être utilisées pour construire un portrait psychologique complet de la personne. Même si certaines réponses semblent générales ou brèves, utilise leur contenu au maximum pour faire ressortir la personnalité du client.
"""
    system_value = system_base + system_append
except Exception as e:
    print(f"Error getting system prompt: {str(e)}")
    sys.exit(1)

# Create a dictionary to store the generated texts
result_json = {}

# Process each prompt
# Assuming the tuple now has 3 elements: (prompt_name, prompt_value, prompt_number)
for prompt_tuple in prompts:
    # Unpack the tuple - adjust this if your tuple structure is different
    if len(prompt_tuple) == 3:
        prompt_name,prompt_number, prompt_value  = prompt_tuple
    else:
        # Fallback if tuple structure is different
        print(f"Warning: Unexpected tuple structure: {prompt_tuple}")
        prompt_name = prompt_tuple[0]
        prompt_number = prompt_tuple[1]
        prompt_value = prompt_tuple[2]
        
    
    # Skip the system prompt as it's handled separately
    if prompt_name == "system":
        continue
    
    print(f"Processing prompt: {prompt_name} (number: {prompt_number})")
    
    # Create message data for this prompt
    message_data = [
        {"role": "system", "content": system_value},
        {"role": "user", "content": prompt_value}
    ]
    
    # Try to generate text with retries
    max_retries = 3
    for attempt in range(max_retries):
        try:
            print(f"Attempt {attempt+1}/{max_retries} for prompt: {prompt_name}")
            
            # Generate text for this prompt
            response = generateur_texte_with_retry(message_data, 2000)
            
            if response is None:
                print(f"Failed to get response after retries for prompt: {prompt_name}")
                # Use a placeholder if all retries fail
                generated_text = f"[Erreur de génération pour {prompt_name}]"
            else:
                generated_text = response.choices[0].message.content
            
            # Add to result JSON with the new structure
            result_json[prompt_name] = {
                "prompt_number": prompt_number,
                "text": generated_text
            }
            
            print(f"Successfully generated text for prompt: {prompt_name}")
            
            
            
            # Success, break the retry loop
            break
            
        except Exception as e:
            print(f"Error on attempt {attempt+1} for prompt {prompt_name}: {str(e)}")
            if attempt < max_retries - 1:
                # Wait before retrying (exponential backoff)
                wait_time = 2 ** attempt
                print(f"Waiting {wait_time} seconds before retrying...")
                time.sleep(wait_time)
            else:
                # All retries failed, add placeholder to result
                result_json[prompt_name] = {
                    "prompt_number": prompt_number,
                    "text": f"[Erreur de génération pour {prompt_name}]"
                }
                print(f"All retries failed for prompt: {prompt_name}")

# Output the final JSON
print("\nFinal JSON result:")
print(json.dumps(result_json, ensure_ascii=False, indent=2))
