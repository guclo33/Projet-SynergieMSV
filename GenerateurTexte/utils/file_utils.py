"""
Utilitaires pour la gestion des fichiers
"""

import unicodedata
import re

def normalize_filename(filename):
    """
    Normalise un nom de fichier en supprimant les accents et caractères spéciaux
    
    Args:
        filename (str): Le nom de fichier à normaliser
        
    Returns:
        str: Le nom de fichier normalisé
    """
    if not filename:
        return filename
    
    # Normaliser les caractères Unicode (décompose les caractères accentués)
    normalized = unicodedata.normalize('NFD', filename)
    
    # Supprimer les diacritiques (accents)
    normalized = ''.join(c for c in normalized if not unicodedata.combining(c))
    
    # Remplacer les caractères spéciaux par des underscores
    normalized = re.sub(r'[^a-zA-Z0-9.-]', '_', normalized)
    
    # Remplacer les underscores multiples par un seul
    normalized = re.sub(r'_+', '_', normalized)
    
    # Supprimer les underscores en début et fin
    normalized = normalized.strip('_')
    
    return normalized

def generate_unique_filename(base_name, extension, exists_check_func):
    """
    Génère un nom de fichier unique en ajoutant un suffixe numérique si nécessaire
    
    Args:
        base_name (str): Le nom de base du fichier
        extension (str): L'extension du fichier
        exists_check_func (callable): Fonction pour vérifier si le fichier existe
        
    Returns:
        str: Le nom de fichier unique
    """
    filename = f"{base_name}.{extension}"
    counter = 1
    
    while exists_check_func(filename):
        filename = f"{base_name}_{counter}.{extension}"
        counter += 1
    
    return filename 