import psycopg2
from dotenv import load_dotenv
import os
import json

load_dotenv()

def get_profil_data (id) :
    conn = psycopg2.connect(
    dbname= os.getenv("DB_RENDER_DATABASE"),
    user= os.getenv("DB_RENDER_USER"),
    password= os.getenv("DB_RENDER_PASSWORD"),
    host= os.getenv("DB_RENDER_HOST")
)
    cursor = conn.cursor()
    
    
    cursor.execute("SELECT form, client_id FROM questionnaire WHERE id = %s", [id])
    fetched_form = cursor.fetchone()  
    
    form = json.loads(fetched_form[0])
    
    
    
    full_form = {
        "first_name" : form["Prénom"],
        "client_id" : fetched_form[1],
        "form_1_15" : {

            "Je suis ... Analytique": form["Je suis ... Analytique"],
            "Je suis ... Audacieux": form["Je suis ... Audacieux"],
            "Je suis ... Amusant": form["Je suis ... Amusant"],
            "Je suis ... Chaleureux": form["Je suis ... Chaleureux"],
            "Je suis ... Organisé": form["Je suis ... Organisé"],
            "Je suis ... Décidé": form["Je suis ... Décidé"],
            "Je suis ... Détendu": form["Je suis ... Détendu"],
            "Je suis ... Sociable": form["Je suis ... Sociable"],
            "Je suis ... Indépendant": form["Je suis ... Indépendant"],
            "Je suis ... Bavard": form["Je suis ... Bavard"],
            "Je suis ... Méthodique": form["Je suis ... Méthodique"],
            "Je suis ... Stratégique": form["Je suis ... Stratégique"],
            "Je suis ... Prudent": form["Je suis ... Prudent"],
            "Je suis ... Droit au but": form["Je suis ... Droit au but"],
            "Je suis ... Bienveillant": form["Je suis ... Bienveillant"],
            "Je suis ... Positif": form["Je suis ... Positif"],
            "Je fais passer les besoins des autres avant les miens": form["Je fais passer les besoins des autres avant les miens"],
            "Je préfère me baser sur des faits concrets que sur des opinions": form["Je préfère me baser sur des faits concrets que sur des opinions"],
            "On dit de moi que je suis une personne divertissante": form["On dit de moi que je suis une personne divertissante"],
            "Je considère important de viser des objectifs ambitieux": form["Je considère important de viser des objectifs ambitieux"],
            "Je porte attention aux détails et j'accompli les tâches avec exactitude": form["Je porte attention aux détails et j'accompli les tâches avec exactitude"],
            "Je peux tolérer beaucoup de choses avant de changer une situation désagréable": form["Je peux tolérer beaucoup de choses avant de changer une situation désagréable"],
            "Je fonce vers l'inconnu avec confiance": form["Je fonce vers l'inconnu avec confiance"],
            "J'aime créer des évènements et y impliquer les autres": form["J'aime créer des évènements et y impliquer les autres"],
            "Je fais preuve de tact": form["Je fais preuve de tact"],
            "J'aime rencontrer de nouvelles personnes": form["J'aime rencontrer de nouvelles personnes"],
            "J'agis de manière confiante": form["J'agis de manière confiante"],
            "Je vise l'excellence dans tout ce que je fais": form["Je vise l'excellence dans tout ce que je fais"],
            "Je montre de la compassion pour les autres": form["Je montre de la compassion pour les autres"],
            "Lorsque j'aime vraiment quelque chose, je ne peux pas m'empêcher de le partager avec les autres": form["Lorsque j'aime vraiment quelque chose, je ne peux pas m'empêcher de le partager avec les autres"],
            "Je suis déterminé à atteindre mes objectifs": form["Je suis déterminé à atteindre mes objectifs"],
            "J'aime les standards élevés": form["J'aime les standards élevés"],
            "Je crois que tout a un ordre et une suite logique": form["Je crois que tout a un ordre et une suite logique"],
            "J'agis de façon spontanée": form["J'agis de façon spontanée"],
            "On dit de moi que je suis une personne directe": form["On dit de moi que je suis une personne directe"],
            "Je suis une personne patiente": form["Je suis une personne patiente"],
            "Je suis motivé par améliorer et perfectionner chaque détail": form["Je suis motivé par améliorer et perfectionner chaque détail"],
            "Je suis motivé par l'opportunité de relever des défis": form["Je suis motivé par l'opportunité de relever des défis"],
            "Je suis motivé par aider et soutenir les autres ": form["Je suis motivé par aider et soutenir les autres "],
            "Je suis motivé par créer quelque chose de nouveau": form["Je suis motivé par créer quelque chose de nouveau"],
            "Je m'assure de produire un travail de qualité": form["Je m'assure de produire un travail de qualité"],
            "J'ai une certaine facilité à diriger les autres": form["J'ai une certaine facilité à diriger les autres"],
            "Je crois que les réponses ne doivent pas être précipitées, elles prennent du temps à incuber": form["Je crois que les réponses ne doivent pas être précipitées, elles prennent du temps à incuber"],
            "J'aime les idées nouvelles qui sortent de l'ordinaire": form["J'aime les idées nouvelles qui sortent de l'ordinaire"],
            "Lorsque j'ai une décision à prendre ... j'évalue l'impact qu'elle aura sur les autres": form["Lorsque j'ai une décision à prendre ... j'évalue l'impact qu'elle aura sur les autres"],
            "Lorsque j'ai une décision à prendre ... je suis mon intuition": form["Lorsque j'ai une décision à prendre ... je suis mon intuition"],
            "Lorsque j'ai une décision à prendre ... je prends le temps d'analyser les données": form["Lorsque j'ai une décision à prendre ... je prends le temps d'analyser les données"],
            "Lorsque j'ai une décision à prendre ... j'évalue rapidement les options": form["Lorsque j'ai une décision à prendre ... j'évalue rapidement les options"],
            "Dans une équipe ... je veille à la coordination des tâches et je m'assure de la conformité aux règles et procédures": form["Dans une équipe ... je veille à la coordination des tâches et je m'assure de la conformité aux règles et procédures"],
            "Dans une équipe ... j'utilise mon enthousiasme pour influencer les décisions": form["Dans une équipe ... j'utilise mon enthousiasme pour influencer les décisions"],
            "Dans une équipe ... je prends des initiatives et des risques pour atteindre les objectifs": form["Dans une équipe ... je prends des initiatives et des risques pour atteindre les objectifs"],
            "Dans une équipe ... j'écoute les préoccupations des autres et je priorise la création d'un environnement harmonieux": form["Dans une équipe ... j'écoute les préoccupations des autres et je priorise la création d'un environnement harmonieux"],
            "Je suis préoccupé... par comment être encore plus efficace": form["Je suis préoccupé... par comment être encore plus efficace"],
            "Je suis préoccupé... par comment rendre le moment encore plus intéressant": form["Je suis préoccupé... par comment rendre le moment encore plus intéressant"],
            "Je suis préoccupé... par la planification des situations futures": form["Je suis préoccupé... par la planification des situations futures"],
            "Je suis préoccupé... par ce que pense les autres": form["Je suis préoccupé... par ce que pense les autres"],
            "Dans une discussion... j'aime qu'on aille directement à l'essentiel": form["Dans une discussion... j'aime qu'on aille directement à l'essentiel"],
            "Dans une discussion... je veux qu'on parle avec passion, rien de pire qu'une discussion plate": form["Dans une discussion... je veux qu'on parle avec passion, rien de pire qu'une discussion plate"],
            "Dans une discussion... il est important de prendre le temps de s'écouter l'un, l'autre": form["Dans une discussion... il est important de prendre le temps de s'écouter l'un, l'autre"],
            "Dans une discussion... il est important d'être concret, exact et structuré": form["Dans une discussion... il est important d'être concret, exact et structuré"],
            }
        ,
        "form_16_24" : {
            "J'aime guider une équipe vers l'atteinte de grands objectifs avec autorité.": form["J'aime guider une équipe vers l'atteinte de grands objectifs avec autorité."],
            "J'aime détendre l'atmosphère en faisant rire les autres dans les moments sérieux.": form["J'aime détendre l'atmosphère en faisant rire les autres dans les moments sérieux."],
            "J'aime inspirer les autres à changer leur façon de penser et à voir de nouvelles possibilités.": form["J'aime inspirer les autres à changer leur façon de penser et à voir de nouvelles possibilités."],
            "J'aime explorer de nouvelles idées et repousser les frontières de mes connaissances.": form["J'aime explorer de nouvelles idées et repousser les frontières de mes connaissances."],
            "J'aime relever des défis difficiles et démontrer ma force et mon courage.": form["J'aime relever des défis difficiles et démontrer ma force et mon courage."],
            "J'aime contribuer au bien-être de la communauté en m'assurant que tout le monde se sente inclus et respecté.": form["J'aime contribuer au bien-être de la communauté en m'assurant que tout le monde se sente inclus et respecté."],
            "J'aime inventer des solutions nouvelles pour résoudre des problèmes complexes.": form["J'aime inventer des solutions nouvelles pour résoudre des problèmes complexes."],
            "J'aime offrir un soutien inconditionnel à ceux qui traversent des moments difficiles.": form["J'aime offrir un soutien inconditionnel à ceux qui traversent des moments difficiles."],
            "J'aime structurer et organiser les ressources pour garantir l'efficacité.": form["J'aime structurer et organiser les ressources pour garantir l'efficacité."],
            "J'aime défier les conventions pour ouvrir la voie à de nouvelles idées et approches.": form["J'aime défier les conventions pour ouvrir la voie à de nouvelles idées et approches."],
            "J'aime développer des relations profondes et émotionnellement riches avec les autres.": form["J'aime développer des relations profondes et émotionnellement riches avec les autres."],
            "J'aime rechercher la vérité et approfondir mes connaissances sur des sujets élaborés.": form["J'aime rechercher la vérité et approfondir mes connaissances sur des sujets élaborés."],
            "J'aime voir le bon côté des choses et adopter une attitude optimiste face à la vie.": form["J'aime voir le bon côté des choses et adopter une attitude optimiste face à la vie."],
            "J'aime surprendre les autres avec mon humour décalé et mes blagues inattendues.": form["J'aime surprendre les autres avec mon humour décalé et mes blagues inattendues."],
            "J'aime être la personne sur qui les autres peuvent compter en cas de besoin.": form["J'aime être la personne sur qui les autres peuvent compter en cas de besoin."],
            "J'aime sortir de ma zone de confort pour vivre des aventures excitantes.": form["J'aime sortir de ma zone de confort pour vivre des aventures excitantes."],
            "J'aime guider les autres vers leur propre transformation et croissance.": form["J'aime guider les autres vers leur propre transformation et croissance."],
            "J'aime exprimer mon affection de manière directe et authentique.": form["J'aime exprimer mon affection de manière directe et authentique."],
            "J'aime repousser mes limites pour atteindre mes objectifs ambitieux.": form["J'aime repousser mes limites pour atteindre mes objectifs ambitieux."],
            "J'aime faire partie d'un groupe où tout le monde est traité sur un pied d'égalité.": form["J'aime faire partie d'un groupe où tout le monde est traité sur un pied d'égalité."],
            "J'aime vivre une vie simple et harmonieuse, à l'abri des complications inutiles.": form["J'aime vivre une vie simple et harmonieuse, à l'abri des complications inutiles."],
            "J'aime prendre des risques calculés pour changer les choses autour de moi.": form["J'aime prendre des risques calculés pour changer les choses autour de moi."],
            "J'aime transformer mes idées en projets concrets qui font une différence.": form["J'aime transformer mes idées en projets concrets qui font une différence."],
            "J'aime partager mes connaissances pour éclairer et guider ceux qui m'entourent.": form["J'aime partager mes connaissances pour éclairer et guider ceux qui m'entourent."],
            "J'aime découvrir des lieux et des cultures différents pour élargir mes perspectives.": form["J'aime découvrir des lieux et des cultures différents pour élargir mes perspectives."],
            "J'aime anticiper les risques et protéger les autres avant qu'ils n'en aient conscience.": form["J'aime anticiper les risques et protéger les autres avant qu'ils n'en aient conscience."],
            "J'aime utiliser l'humour pour désamorcer des situations tendues et ramener de la légèreté.": form["J'aime utiliser l'humour pour désamorcer des situations tendues et ramener de la légèreté."],
            "J'aime prendre des décisions importantes pour maintenir l'ordre et la stabilité.": form["J'aime prendre des décisions importantes pour maintenir l'ordre et la stabilité."],
            "J'aime être une personne reconnu pour surmonter les obstacles.": form["J'aime être une personne reconnu pour surmonter les obstacles."],
            "J'aime être la personne sur qui l'on peut compter dans les moments difficiles pour maintenir l'harmonie collective.": form["J'aime être la personne sur qui l'on peut compter dans les moments difficiles pour maintenir l'harmonie collective."],
            "J'aime créer des choses qui n'ont jamais été vues auparavant, en laissant libre cours à mon imagination.": form["J'aime créer des choses qui n'ont jamais été vues auparavant, en laissant libre cours à mon imagination."],
            "J'aime poser des questions difficiles pour aller au fond des choses.": form["J'aime poser des questions difficiles pour aller au fond des choses."],
            "J'aime vivre des moments intenses de connexion et de partage avec ceux que j'aime.": form["J'aime vivre des moments intenses de connexion et de partage avec ceux que j'aime."],
            "J'aime bousculer les règles établies pour provoquer des transformations radicales.": form["J'aime bousculer les règles établies pour provoquer des transformations radicales."],
            "J'aime provoquer des changements profonds et durables chez les autres.": form["J'aime provoquer des changements profonds et durables chez les autres."],
            "J'aime croire en la bonté des autres et espérer des résultats positifs.": form["J'aime croire en la bonté des autres et espérer des résultats positifs."]
        },
        "form_dev" : {
            "Quelle est ta situation professionnelle actuelle et quelles sont tes aspirations à long terme?": form["Quelle est ta situation professionnelle actuelle et quelles sont tes aspirations à long terme?"],
            "Quel a été le plus grand défi que tu as rencontré et comment as-tu réussi à le surmonter ?": form["Quel a été le plus grand défi que tu as rencontré et comment as-tu réussi à le surmonter ?"],
            "Parle moi d'une réussite dont tu es particulièrement fier(ère)?": form["Parle moi d'une réussite dont tu es particulièrement fier(ère)?"]
        }
        
    }
    
    cursor.close()
    conn.close()  

    if full_form:
         
        return full_form 
    else:
        print("Aucun formulaire trouvé pour cet ID.")
        return None
    






def moyenne_bleu (form) :
    bleu = [form["Je suis ... Analytique"], form["Je suis ... Organisé"], form["Je suis ... Stratégique"], form["Je suis ... Prudent"], form["Je préfère me baser sur des faits concrets que sur des opinions"], form["Je porte attention aux détails et j'accompli les tâches avec exactitude"], form["Je vise l'excellence dans tout ce que je fais"], form["J'aime les standards élevés"], form["Je crois que tout a un ordre et une suite logique"], form["Je suis motivé par améliorer et perfectionner chaque détail"], form["Je m'assure de produire un travail de qualité"], form["Lorsque j'ai une décision à prendre ... je prends le temps d'analyser les données"], form["Dans une équipe ... je veille à la coordination des tâches et je m'assure de la conformité aux règles et procédures"], form["Je suis préoccupé... par la planification des situations futures"], form["Dans une discussion... il est important d'être concret, exact et structuré"]]
    
    percent = round(sum(bleu) / len(bleu) * 10)
    
    
    
    return percent


print("bleu= ", moyenne_bleu(form))


def moyenne_rouge (form) :
    bleu = [form["Je suis ... Audacieux"], form["Je suis ... Décidé"], form["Je suis ... Indépendant"], form["Je suis ... Droit au but"], form["Je considère important de viser des objectifs ambitieux"], form["Je fonce vers l'inconnu avec confiance"], form["J'agis de manière confiante"], form["Je suis déterminé à atteindre mes objectifs"], form["On dit de moi que je suis une personne directe"], form["Je suis motivé par l'opportunité de relever des défis"], form["J'ai une certaine facilité à diriger les autres"], form["Lorsque j'ai une décision à prendre ... j'évalue rapidement les options"], form["Dans une équipe ... je prends des initiatives et des risques pour atteindre les objectifs"], form["Je suis préoccupé... par comment être encore plus efficace"], form["Dans une discussion... j'aime qu'on aille directement à l'essentiel"]]
    
    percent = round(sum(bleu) / len(bleu) * 10)
    
    
    
    return percent


print("rouge= ", moyenne_rouge(form))

def moyenne_jaune (form) :
    bleu = [form["Je suis ... Amusant"], form["Je suis ... Sociable"], form["Je suis ... Bavard"], form["Je suis ... Positif"], form["On dit de moi que je suis une personne divertissante"], form["J'aime créer des évènements et y impliquer les autres"], form["J'aime rencontrer de nouvelles personnes"], form["Lorsque j'aime vraiment quelque chose, je ne peux pas m'empêcher de le partager avec les autres"], form["J'agis de façon spontanée"], form["Je suis motivé par créer quelque chose de nouveau"], form["J'aime les idées nouvelles qui sortent de l'ordinaire"], form["Lorsque j'ai une décision à prendre ... je suis mon intuition"], form["Dans une équipe ... j'utilise mon enthousiasme pour influencer les décisions"], form["Je suis préoccupé... par comment rendre le moment encore plus intéressant"], form["Dans une discussion... je veux qu'on parle avec passion, rien de pire qu'une discussion plate"]]
    
    percent = round(sum(bleu) / len(bleu) * 10)
    
    
    
    return percent


print("jaune= ", moyenne_jaune(form))

def moyenne_vert (form) :
    bleu = [form["Je suis ... Chaleureux"], form["Je suis ... Détendu"], form["Je suis ... Méthodique"], form["Je suis ... Bienveillant"], form["Je fais passer les besoins des autres avant les miens"], form["Je peux tolérer beaucoup de choses avant de changer une situation désagréable"], form["Je fais preuve de tact"], form["Je montre de la compassion pour les autres"], form["Je suis une personne patiente"], form["Je suis motivé par aider et soutenir les autres "], form["Je crois que les réponses ne doivent pas être précipitées, elles prennent du temps à incuber"], form["Lorsque j'ai une décision à prendre ... j'évalue l'impact qu'elle aura sur les autres"], form["Dans une équipe ... j'écoute les préoccupations des autres et je priorise la création d'un environnement harmonieux"], form["Je suis préoccupé... par ce que pense les autres"], form["Dans une discussion... il est important de prendre le temps de s'écouter l'un, l'autre"]]
    
    percent = round(sum(bleu) / len(bleu) * 10)
    
    
    
    return percent

print("vert= ", moyenne_vert(form))


def moyenne_hero (form) :
    array = [form["J'aime relever des défis difficiles et démontrer ma force et mon courage."], form["J'aime repousser mes limites pour atteindre mes objectifs ambitieux."], form["J'aime être une personne reconnu pour surmonter les obstacles."]]
    
    percent = round(sum(array) / len(array) * 10)
    
    return percent

def moyenne_amoureuse (form) :
    array = [form["J'aime développer des relations profondes et émotionnellement riches avec les autres."], form["J'aime exprimer mon affection de manière directe et authentique."], form["J'aime vivre des moments intenses de connexion et de partage avec ceux que j'aime."]]
    
    percent = round(sum(array) / len(array) * 10)
    
    return percent

def moyenne_bouffon (form) :
    array = [form["J'aime détendre l'atmosphère en faisant rire les autres dans les moments sérieux."], form["J'aime surprendre les autres avec mon humour décalé et mes blagues inattendues."], form["J'aime utiliser l'humour pour désamorcer des situations tendues et ramener de la légèreté."]]
    
    percent = round(sum(array) / len(array) * 10)
    
    return percent

def moyenne_citoyen (form) :
    array = [form["J'aime contribuer au bien-être de la communauté en m'assurant que tout le monde se sente inclus et respecté."], form["J'aime faire partie d'un groupe où tout le monde est traité sur un pied d'égalité."], form["J'aime être la personne sur qui l'on peut compter dans les moments difficiles pour maintenir l'harmonie collective."]]
    
    percent = round(sum(array) / len(array) * 10)
    
    return percent

def moyenne_createur (form) :
    array = [form["J'aime inventer des solutions nouvelles pour résoudre des problèmes complexes."], form["J'aime transformer mes idées en projets concrets qui font une différence."], form["J'aime créer des choses qui n'ont jamais été vues auparavant, en laissant libre cours à mon imagination."]]
    
    percent = round(sum(array) / len(array) * 10)
    
    return percent

def moyenne_explorateur (form) :
    array = [form["J'aime explorer de nouvelles idées et repousser les frontières de mes connaissances."], form["J'aime sortir de ma zone de confort pour vivre des aventures excitantes."], form["J'aime découvrir des lieux et des cultures différents pour élargir mes perspectives."]]
    
    percent = round(sum(array) / len(array) * 10)
    
    return percent

def moyenne_optimiste (form) :
    array = [form["J'aime voir le bon côté des choses et adopter une attitude optimiste face à la vie."], form["J'aime vivre une vie simple et harmonieuse, à l'abri des complications inutiles."], form["J'aime croire en la bonté des autres et espérer des résultats positifs."]]
    
    percent = round(sum(array) / len(array) * 10)
    
    return percent

def moyenne_magicien (form) :
    array = [form["J'aime inspirer les autres à changer leur façon de penser et à voir de nouvelles possibilités."], form["J'aime guider les autres vers leur propre transformation et croissance."], form["J'aime provoquer des changements profonds et durables chez les autres."]]
    
    percent = round(sum(array) / len(array) * 10)
    
    return percent

def moyenne_protecteur (form) :
    array = [form["J'aime offrir un soutien inconditionnel à ceux qui traversent des moments difficiles."], form["J'aime être la personne sur qui les autres peuvent compter en cas de besoin."], form["J'aime anticiper les risques et protéger les autres avant qu'ils n'en aient conscience."]]
    
    percent = round(sum(array) / len(array) * 10)
    
    return percent

def moyenne_rebelle (form) :
    array = [form["J'aime défier les conventions pour ouvrir la voie à de nouvelles idées et approches."], form["J'aime prendre des risques calculés pour changer les choses autour de moi."], form["J'aime bousculer les règles établies pour provoquer des transformations radicales."]]
    
    percent = round(sum(array) / len(array) * 10)
    
    return percent

def moyenne_sage (form) :
    array = [form["J'aime rechercher la vérité et approfondir mes connaissances sur des sujets élaborés."], form["J'aime partager mes connaissances pour éclairer et guider ceux qui m'entourent."], form["J'aime poser des questions difficiles pour aller au fond des choses."]]
    
    percent = round(sum(array) / len(array) * 10)
    
    return percent

def moyenne_souverain (form) :
    array = [form["J'aime guider une équipe vers l'atteinte de grands objectifs avec autorité."], form["J'aime structurer et organiser les ressources pour garantir l'efficacité."], form["J'aime prendre des décisions importantes pour maintenir l'ordre et la stabilité."]]
    
    percent = round(sum(array) / len(array) * 10)
    
    return percent