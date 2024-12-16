import os
import time
import pandas as pd
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler

#class ExcelEventHandler(FileSystemEventHandler):
    def __init__(self, excel_path):
        self.excel_path = excel_path
        self.previous_data = pd.read_excel(self.excel_path)
    
    def on_modified(self, event):
        if event.src_path == self.excel_path:
            new_data = pd.read_excel(self.excel_path)
            if len(new_data) > len(self.previous_data):  # Vérifie s'il y a de nouvelles lignes
                new_entry = new_data.iloc[-1]  # Récupère la dernière ligne ajoutée
                self.process_new_entry(new_entry)
            self.previous_data = new_data  # Mise à jour des données précédentes
    
    def process_new_entry(self, new_entry):
        nom = new_entry['Nom']
        print(f"Nouvelle entrée détectée : {nom}")
        # Placez ici le code que vous souhaitez exécuter lorsqu'une nouvelle entrée est détectée.

#def watch_excel_file(excel_path):
    event_handler = ExcelEventHandler(excel_path)
    observer = Observer()
    observer.schedule(event_handler, os.path.dirname(excel_path), recursive=False)
    observer.start()
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        observer.stop()
    observer.join()

# Chemin vers votre fichier Excel
excel_path = "C:/Users/Guillaume Cloutier/OneDrive/Synergia/Synergia.xlsx"

watch_excel_file(excel_path)
