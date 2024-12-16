import os
import sys
import pandas as pd
import warnings
warnings.filterwarnings("ignore", category=UserWarning, module="openpyxl")
pd.set_option('future.no_silent_downcasting', True)
from openai import OpenAI
from docx import Document
import subprocess
from canvaAutofill import autofill_job
from fonction_database import update_database



  
# *****À FAIRE**** code pour automatisation, activation lors de réception d'un nouveau formulaire 

#NOM format "Prénom, Nom"

arg = sys.argv[1]

if arg == "error":
    raise ValueError("Une erreur s'est produite")

nom = arg

nom_profile = nom.replace(",", "")

prenom = nom.split(",")[0]

#DONNÉES EXCEL

#Pour le client
synergia = pd.read_excel("C:/Users/Guillaume Cloutier/OneDrive/Synergia/Synergia.xlsx", sheet_name="synergia_mlm")

synergia_model = pd.read_excel("C:/Users/Guillaume Cloutier/OneDrive/Synergia/Synergia.xlsx", sheet_name="Réponses 3")

synergia_nom = pd.DataFrame(synergia.loc[synergia["Prénom, Nom"]== nom])


#plage de questions utilisé pour les prompts

plage_nom = synergia_nom.iloc[:,2:3]
plage_questions1_15 = synergia_nom.iloc[:,6:66]
plage_questions16_24 = synergia_nom.iloc[:,66:102]
plage_questions_developpement = synergia_nom.iloc[:,102:105]
plage_questionnaire_complet = synergia_nom.iloc[:,6:105]
email = synergia_nom.iloc[0,3]
nom_leader = synergia_nom.iloc[0,4]


#definition de la fonction pour formatter les résultats des bases de données
def excel_to_string(*args):
  return pd.concat(args, axis=1).transpose().to_string(header=False)



#section couleurs

synergia_couleur_string = excel_to_string(plage_nom, plage_questions1_15)


#section archétype

synergia_archetype_string = excel_to_string(plage_nom, plage_questions16_24)


#Questions développement


synergia_section_developpement_string = excel_to_string(plage_nom, plage_questions_developpement)


#Questionnaire complet

#synergia_complet_string = excel_to_string(plage_nom, plage_questionnaire_complet)

synergia_complet_string = synergia_couleur_string + "\n" +synergia_archetype_string+ "\n" + synergia_section_developpement_string

#Pour le model 1

synergia_model1 = synergia_model.iloc[[92]]

plage_model1 = synergia_model1.iloc[:,2]
plage_model1_questions1_11 = synergia_model1.iloc[:,6:50]
plage_model1_questions17_20 = synergia_model1.iloc[:,62:78]

synergia_model1_section1_string = excel_to_string(plage_model1, plage_model1_questions1_11, plage_model1_questions17_20)



#Pour le model 2

synergia_model2 = synergia_model.iloc[[88]]

plage_model2 = synergia_model2.iloc[:,2]
plage_model2_questions1_11 = synergia_model2.iloc[:,6:50]
plage_model2_questions17_20 = synergia_model2.iloc[:,62:78]

synergia_model2_section1_string = excel_to_string(plage_model2, plage_model2_questions1_11, plage_model2_questions17_20)


#***VARIABLES ET FONCTIONS***


client = OpenAI(
    api_key=os.environ.get("OPENAI_API_KEY"),
)

def generateur_texte(message, token):
    response=client.chat.completions.create(model= "gpt-4o", 
        messages = message, 
        max_tokens = token)
    return response
  
def context_append(assistant, user) :
  message_data.append( 
    {
      "role": "assistant", 
      "content": assistant
    }
  )
  message_data.append(
    {
        "role": "user",
        "content": user
    }
  )


    
#Pour avoir les pourcentage de Couleur et d'archétype

def moyenne(*colonnes):
    colonne = synergia_nom.iloc[:,list(colonnes)].replace({
        "Plus comme moi" : 10,
        "Moins comme moi" : 0
    }).infer_objects(copy=False)
    valeurs= colonne.to_numpy()
    return round(valeurs.mean()*10)

bleu = moyenne(6, 13, 17, 18, 24, 29, 30, 34, 41, 45, 49, 51, 57, 59, 64)
rouge = moyenne(7,12,14,19,22,27,31,35,39,44,48,50,55,61,65)
jaune = moyenne(8,10,15,21,23,26,32,36,40,42,46,52,56,60,62)
vert = moyenne(9,11,16,20,25,28,33,37,38,43,47,53,54,58,63)
explorateur = moyenne(66, 78, 90)
protecteur = moyenne(70, 79, 91)
bouffon = moyenne(68, 80, 92)
souverain = moyenne(69, 77, 93)
magicien = moyenne(67, 82, 98)
createur = moyenne(71, 87, 95)
hero = moyenne(72, 84,96)
citoyen = moyenne(73, 85, 97)
sage = moyenne(74, 86, 94)
amoureuse = moyenne(75, 83, 99)
rebelle = moyenne(76, 88, 100)
optimiste = moyenne(81, 89, 101)

text_pourcentage_complet = f"COULEURS\nbleu : {bleu}%, rouge : {rouge}%, jaune : {jaune}%, vert : {vert}%\n" + f"ARCHÉTYPE\nexploreur : {explorateur}%, protecteur : {protecteur}%, bouffon : {bouffon}%, souverain : {souverain}%\nmagicien : {magicien}%, créateur : {createur}%, héro : {hero}%, citoyen : {citoyen}%\nsage : {sage}%, amoureuse : {amoureuse}%, rebelle : {rebelle}%, optimiste : {optimiste}%\n\n"

text_pourcentage_couleur = f"COULEURS\nbleu : {bleu}%, rouge : {rouge}%, jaune : {jaune}%, vert : {vert}%\n"

text_pourcentage_archetype= f"ARCHÉTYPE\nexploreur : {explorateur}%, protecteur : {protecteur}%, bouffon : {bouffon}%, souverain : {souverain}%\nmagicien : {magicien}%, créateur : {createur}%, héro : {hero}%, citoyen : {citoyen}%\nsage : {sage}%, amoureuse : {amoureuse}%, rebelle : {rebelle}%, optimiste : {optimiste}%"

# GÉNÉRER UN TEXTE POUR CHAQUE SECTION

#SECTION "EN BREF":

bref_system = "Je souhaite que tu crées un résumé de personnalité qui capte les aspects essentiels d'une personne, basé sur ses réponses à un questionnaire DISC et ses caractéristiques personnelles. Je t'envoie un format ou la première ligne est le nom et les suivantes sont les questions posées ainsi qu'un choix de réponse, les valeurs correspondent à une échelle de 0 à 10. Si c'est 0, ça ne représente pas la personne et 10 représente beacuoup la personne . Les valeurs \"moins que moi\" équivalent à 0 et \"plus que moi\" équivalent à 10. Le texte doit comprendre trois à quatre paragraphes, chacun se concentrant sur différents aspects de la personnalité de la personne : ses forces principales, sa manière de travailler, ses interactions sociales, et ses valeurs ou préférences. Inclut les forces dominantes comme le leadership, l'analytique, la créativité, ou l'organisation. Décris comment cette personne aborde son travail, en mettant en avant des aspects tels que la méthodicité, la rigueur, l'innovation, ou la flexibilité. Explique comment cette personne interagit avec les autres, que ce soit par son charisme, son écoute, ou sa bienveillance. Mentionne ses valeurs et préférences, telles que la recherche de qualité, la stabilité, la spontanéité, ou l'impact sur les autres. Adopte un ton positif et valorisant, en utilisant un langage riche et nuancé pour refléter les particularités de la personne. Assure-toi que chaque phrase soit unique et ajoute une touche de sophistication au texte. Assure-toi que le texte soit fluide, sans répétitions, et qu'il donne une vision claire et engageante de la personnalité."

bref_user = f"On va faire un test. Dans un texte de **MAXIMUM DE 220 MOTS**, voici les réponses aux questions de Madame test:\n {synergia_model1_section1_string}"

bref_assistant= "Marie-Soleil est une personne déterminée et audacieuse, qui utilise son indépendance et sa confiance en elle pour relever les défis avec assurance. Elle excelle dans la prise de décisions rapides et directes, grâce à son esprit stratégique et son sens de l'initiative, ce qui fait d'elle une leader naturelle.\n Sa spontanéité et son approche positive, alliées à une ouverture d'esprit, lui permettent de s'adapter aisément aux imprévus. Motivée par des objectifs ambitieux, elle n'hésite pas à se lancer dans l'inconnu avec assurance. Bien qu'elle soit orientée vers l'action et l'efficacité, elle sait captiver les autres par son esprit divertissant et rendre chaque moment plus engageant.\n Dans ses interactions sociales, Marie-Soleil est sociable et apprécie rencontrer de nouvelles personnes. Même si elle privilégie une communication directe, elle fait preuve de compassion, même si elle reste concentrée sur ses propres objectifs. Sa nature passionnée et spontanée fait d'elle une personne dynamique, capable d'inspirer son entourage et d'encourager des discussions stimulantes.\n En somme, Marie-Soleil est une personne énergique et stratégiquement orientée, qui vise l'excellence tout en maintenant une grande adaptabilité dans ses actions."

bref_user2= f"Voici un deuxième exemple de Monsieur test. Dans un texte de **MAXIMUM DE 220 MOTS**, voici le questionnaire:\n {synergia_model2_section1_string}"

bref_assistant2= "Guillaume est une personne méthodique et analytique, guidée par un désir de comprendre les choses en détail et de s'assurer que tout suit un ordre logique. Son approche structurée et son attention aux détails font de lui un professionnel organisé, capable de garantir des résultats d'excellence. Il vise des standards élevés et cherche constamment à perfectionner son travail.\n Sa prudence et son analyse réfléchie des situations montrent sa capacité à évaluer les options avant de prendre des décisions. Bien qu'il préfère analyser les données plutôt que d'agir sur des impulsions, il est déterminé à atteindre ses objectifs une fois sa décision prise. Cette rigueur est renforcée par une grande patience et une tolérance pour les situations complexes, lui permettant de persévérer même dans les environnements exigeants.\n Dans ses interactions sociales, Guillaume est plus réservé, préférant se concentrer sur les faits concrets plutôt que sur les discussions superficielles. Il valorise le tact et la bienveillance dans ses relations, mais est avant tout motivé par le besoin d'assurer une qualité irréprochable dans tout ce qu'il fait. Sa capacité à évaluer l'impact de ses actions sur les autres montre un souci de préserver l'équilibre.\n En somme, Guillaume est une personne rigoureuse, organisée et analytique, engagée à atteindre des résultats de haute qualité tout en maintenant une approche réfléchie et structurée."

bref_prompt= f"""Maintenant, voici le véritable questionnaire qui nous servira pour toute la suite de la conversation. Execute la même tâche que les deux exemples précédents dans un **MAXIMUM DE 200 MOTS** pour le questionnaire suivant:\n {synergia_complet_string}. Utilise principalement les réponses des questions 1 à 15 pour générer le résumé principal du profil. Mais intègre très subtilement les réponses des questions 16 à 24 afin d'ajouter un léger accent au profil, simplement en captant l’essence des motivations profondes de la personne mais sans que cette section ne prenne le dessus. Fais 3 paragraphes

À partir des questions 1 à 15, dis-moi quels serait les % disc de la personne. Exemple : Marie-Soleil est 85% rouge, 78% jaune, 30% verte et 28% bleu."""

message_data= [{"role": "system",
               "content": bref_system},
               {"role": "user",
               "content": bref_user},
               {"role": "assistant",
               "content": bref_assistant},
               {"role": "user",
               "content": bref_user2},
               {"role": "assistant",
               "content": bref_assistant2},
               {"role": "user",
               "content": bref_prompt,}]

bref = generateur_texte(message_data, 500)

bref_text = bref.choices[0].message.content

#Section "Tes forces mises en lumière"

forces_prompt = f"Je souhaite que tu identifies et présentes les 5 principales forces de cette même personne dans un texte de **MAXIMUM DE 150 MOTS** sous forme de points clés, basées sur ses couleurs de personalités ainsi que son questionnaire : {synergia_couleur_string}.\nPrésente chaque force sous la forme d'une phrase concise accompagnée d'une icône représentative (comme un emoji) au début de chaque point. Adopte un ton positif et valorisant, en utilisant un langage précis et professionnel. Assure-toi que chaque point soit clair, succinct, et reflète les compétences de la personne dans sa vie personnelle. Voici un exemple de ce que je souhaite obtenir : [exemple 1 💡 Audace et Prise de Risques : Madame Test se distingue par sa capacité à prendre des risques calculés, n'hésitant pas à foncer vers l'inconnu avec une confiance remarquable.🎯 Orientation Vers les Objectifs : Sa détermination à atteindre des objectifs ambitieux la pousse à agir rapidement et efficacement, en restant toujours concentrée sur les résultats à atteindre.💬 Communication Directe : Elle excelle dans l'art de communiquer de manière claire et directe, ce qui lui permet de naviguer avec assurance dans les interactions et les prises de décision.🌟 Flexibilité et Spontanéité : Madame Test sait s'adapter aux situations imprévues avec une grande spontanéité, transformant les défis en opportunités pour innover et avancer. 🚀 Autonomie et Initiative : Son indépendance lui permet de travailler de manière autonome, prenant des initiatives audacieuses pour mener ses projets à terme sans nécessiter de supervision constante.\n "


context_append(bref_text, forces_prompt)

forces = generateur_texte(message_data, 300)

forces_text = forces.choices[0].message.content

#Section "Tes défis Potentiels"

defis_prompt = "Je souhaite que tu identifies et présentes les 4 défis potentiels de cette personne dans sa vie personnelle basé sur ses couleurs de personnalité ainsi que sur son questionnaire des questions 1 à 15, sous forme de points clés, mais avec un **MAXIMUM DE 120 MOTS**. Présente chaque défi sous la forme d'une phrase concise, accompagnée d'une icône représentative (comme un emoji) au début de chaque point. Utilise un ton neutre mais constructif, en soulignant les défis d'une manière qui incite à la réflexion sans être trop critique. Assure-toi que chaque point soit clair, succinct, et directement lié aux caractéristiques clés de la personne. Voici un exemple de ce que je souhaite obtenir : exemple 1 🔄 Précipitation dans l'action : Sa tendance à agir rapidement et à prendre des risques peut parfois manquer de la réflexion nécessaire, surtout dans des situations complexes. 🌍 Interaction sociale réservée : Son indépendance et son orientation vers l'action peuvent parfois la rendre moins attentive aux besoins émotionnels des autres, ce qui pourrait créer des décalages dans les relations. 🚧 Approche directe et sans détour : Sa communication franche et directe, bien que souvent efficace, peut parfois être perçue comme un manque de tact, ce qui pourrait engendrer des malentendus. ⏩ Tolérance limitée à l'attente : Son désir de voir des résultats rapides peut rendre difficile pour elle de tolérer les délais ou les processus lents, ce qui pourrait mener à une frustration dans des environnements moins dynamiques.\n "


context_append(forces_text, defis_prompt)

defis = generateur_texte(message_data, 250)

defis_text = defis.choices[0].message.content

#Section "Perception du changement"

changement_prompt = f"""Je souhaite que tu crées une section 'Perception du changement' dans un **MAXIMUM DE 100 MOTS** qui décrit comment une personne perçoit et réagit au changement. Cette fois-ci,  en se basant sur la totalité des question du questionnaire suivant:\n {synergia_couleur_string}.\n Le texte doit être en plusieurs paragraphes, décrivant comment la personne aborde le changement, en mettant en avant son attitude générale, ses forces, et son approche face aux nouvelles situations. Inclut un paragraphe final qui la compare avec une perception opposée. Décris comment la personne voit le changement – est-ce qu'elle l'embrasse, le redoute, ou le considère comme une opportunité ? Mentionne la manière dont la personne s'adapte aux nouvelles situations. Pour la dernière partie du texte, mentionne plutôt une perception qui serait opposée à celle de la personne décrite. Par exemple, si la personne est rapide et positive, mentionne que d'autres pourraient la percevoir comme étant trop précipitée ou optimiste, tandis qu'elle pourrait percevoir ces personnes comme trop prudentes ou focalisées sur les risques. Utilise un ton engageant, tout en restant réaliste et nuancé. Assure-toi que la section finale sur la perception opposée soit constructive et présente un équilibre entre les différentes perspectives. Voici un exemple de ce que je souhaite obtenir : [exemple 1 Maxime perçoit le changement comme une opportunité excitante et un moteur de croissance personnelle et professionnelle. Son audace et son esprit d'initiative le rendent particulièrement réceptif aux nouvelles expériences et aux défis. Il aborde le changement avec un optimisme contagieux, voyant chaque nouveauté comme une chance de tester ses capacités de leader et d'innovateur. Maxime est naturellement incliné à embrasser le changement plutôt que de le redouter, considérant chaque transition comme une porte ouverte vers de nouvelles possibilités et aventures. Sa capacité à prendre des décisions rapides et à s'adapter spontanément le rend apte à naviguer efficacement dans des environnements en constante évolution. Pour Maxime, le changement est synonyme de progrès et d'opportunités pour influencer positivement son entourage et laisser une empreinte durable. À noter que certaines personnes pourraient percevoir l'attitude de Maxime comme étant trop rapide ou optimiste, ce qui pourrait leur sembler précipité ou risqué. En revanche, Maxime pourrait percevoir ces personnes comme étant trop prudentes ou trop axées sur les détails, ce qui pourrait lui sembler freiner l'innovation et l'action rapide.\n "Je souhaite que vous évaluiez la perception du changement d'une personne en fonction de deux critères :

1. Vitesse d'Adaptation : Indique si la personne s'adapte (1) plus rapidement que la moyenne, (2) dans la moyenne, ou (3) plus lentement que la moyenne face aux changements, en te basant sur ses réponses au questionnaire.

2. Niveau de Confiance : Indique si la personne est (1) plus confiante que la moyenne, (2) dans la moyenne, ou (3) moins confiante que la moyenne par rapport au changement, en analysant ses réponses.

Je ne souhaite pas un texte explicatif, juste une évaluation claire sous la forme : "Plus rapide que la moyenne", "Dans la moyenne", ou "Plus lent que la moyenne" pour la vitesse d'adaptation et la confiance." """


context_append(defis_text, changement_prompt)

changements = generateur_texte(message_data, 350)

changements_text = changements.choices[0].message.content


#Section Perception des relations interpersonnelles

interpersonnelles_prompt = """Utilise les questions 1 à 15 "Je souhaite que tu crées une section 'Perception des relations interpersonnelles' dans un MAXIMUM DE 150 MOTS qui décrit comment une personne perçoit et gère ses relations avec les membres de son équipe, en se basant sur ses réponses au questionnaire de 1 à 15 et ses caractéristiques personnelles. Le texte doit être en plusieurs paragraphes, décrivant comment la personne envisage les relations interpersonnelles, en mettant en avant son attitude générale, ses forces, et sa manière de cultiver ces relations. Inclut un paragraphe final qui compare sa perception des relations avec une perception opposée. Décris comment la personne voit et valorise ses relations – recherche-t-elle des connexions profondes, préfère-t-elle des interactions légères, ou est-elle plus réservée ? Mentionne la manière dont la personne interagit avec ses coéquipiers, en se basant sur ses réponses concernant la sociabilité, la communication, et la

gestion des conflits. Aborde aussi sa préférence pour l’harmonie ou son approche face aux tensions dans l’équipe. Pour la dernière partie du texte, mentionne une perception opposée : par exemple, si la personne évite les conflits, mentionne que d'autres pourraient la percevoir comme trop passive, tandis qu'elle pourrait percevoir ces personnes comme trop confrontationales ou impulsives. Utilise un ton engageant et nuancé, tout en restant positif."

Exemple 1 - Monsieur Test : Monsieur Test aborde les relations interpersonnelles avec une approche analytique et réfléchie. Il privilégie les relations qui apportent une certaine stabilité et qui sont fondées sur des valeurs communes, telles que la rigueur, la précision, et le respect des normes. Bien que réservé et peu sociable, il apprécie les relations qui respectent son besoin de calme et de structuration. Il n'est pas le genre à rechercher des relations superficielles ou à se précipiter dans de nouvelles interactions. Pour lui, la qualité prime sur la quantité, et il préfère s’entourer de personnes fiables et sérieuses avec qui il peut avoir des discussions profondes et enrichissantes.

Monsieur Test est également quelqu'un de prudent dans ses relations interpersonnelles. Il évite les personnes qui pourraient introduire de l'instabilité ou des comportements imprévisibles. Il préfère des interactions où l'efficacité et la logique sont au premier plan, et où les émotions sont gérées de manière rationnelle. Bien qu'il soit moins démonstratif dans ses relations, il accorde une grande importance à la loyauté et au respect mutuel.

À noter que certaines personnes pourraient percevoir l'attitude de Monsieur Test comme étant trop réservée ou rigide, ce qui pourrait leur sembler distant ou peu engageant. En revanche, Monsieur Test pourrait percevoir ces personnes comme trop spontanées ou désorganisées, ce qui pourrait lui sembler perturbant ou difficile à intégrer dans ses routines bien établies.

Exemple 2 - Madame Test : Madame Test aborde ses relations avec les membres de son équipe avec un esprit d’ouverture et d’audace. Elle privilégie les connexions légères et positives, préférant des interactions simples et sans complications. Elle ne ressent pas le besoin d’approfondir les relations, mais valorise des échanges fréquents et joyeux qui apportent une dynamique de groupe agréable. Grâce à son enthousiasme naturel, elle a tendance à attirer les autres et à maintenir une ambiance conviviale, créant ainsi un environnement propice à la collaboration et à la croissance.

Madame Test apprécie particulièrement les moments d’harmonie, où chacun se sent à l’aise et libre d’exprimer ses idées sans crainte de conflits. Bien qu’elle soit capable de gérer les tensions, elle préfère éviter les confrontations directes et favorise des solutions qui minimisent les risques de friction. Elle perçoit les relations comme des sources de plaisir, où les défis sont abordés avec légèreté.

À noter que certaines personnes pourraient percevoir Madame Test comme trop insouciante ou évitant les conflits, ce qui pourrait être perçu comme un manque de profondeur ou de sérieux dans ses relations. En contrepartie, Madame Test pourrait voir ces personnes comme trop rigides ou focalisées sur les problèmes, ce qui pourrait limiter le côté spontané et positif qu’elle cherche à maintenir dans ses relations.

" Par la suite, je souhaite obtenir deux informations basées sur les réponses aux questions 1 à 15 du questionnaire. Indique simplement :

1. Le niveau de sociabilité : est-ce que la personne est 'plus sociable que la moyenne', 'dans la moyenne' ou 'moins sociable que la moyenne' ?

2. Le niveau de confiance dans les relations : est-ce que la personne est 'plus confiante que la moyenne', 'dans la moyenne' ou 'moins confiante que la moyenne' ?"""

context_append(changements_text, interpersonnelles_prompt)

interpersonnelles = generateur_texte(message_data, 500)

interpersonnelles_text = interpersonnelles.choices[0].message.content

#Section Perception du besoin de structure et de prévisibilité

structure_prompt = """Je souhaite que tu crées une section 'Perception du besoin de structure et de prévisibilité' dans un maximum de 150 mots qui décrit comment une personne gère le besoin de structure dans ses tâches et sa préférence pour la prévisibilité dans son travail. Le texte doit être en plusieurs paragraphes, décrivant l'attitude générale de la personne face à la planification, l'organisation, et sa tolérance aux changements inattendus. Base-toi sur les réponses aux questions 1 à 15 du questionnaire. Inclut un paragraphe final qui compare sa perception avec une perception opposée. Par exemple, si la personne préfère plus de structure, mentionne que d'autres pourraient la percevoir comme trop rigide, tandis qu'elle pourrait voir ces personnes comme manquant d'organisation. Utilise un ton engageant et nuancé." [Madame Test préfère une approche flexible lorsqu'il s'agit de structurer ses tâches. Elle apprécie avoir la liberté d'organiser son travail à sa manière, sans directives strictes ou des processus rigides à suivre. Sa créativité et son esprit d'initiative lui permettent de s'adapter rapidement aux situations imprévues, et elle n'est pas dérangée par un manque de structure formelle.

En termes de prévisibilité, Madame Test est à l'aise avec les changements soudains. Elle n’a pas besoin que les projets soient planifiés à l'avance de manière rigide et accepte facilement les ajustements en cours de route. Elle prospère dans les environnements dynamiques et apprécie les défis imprévus qui stimulent sa capacité à improviser.

À noter que certaines personnes plus rigoureuses pourraient percevoir Madame Test comme manquant d'organisation ou de planification, tandis qu'elle pourrait voir ces personnes comme trop rigides ou inflexibles face aux changements.

Je souhaite obtenir deux informations basées sur les réponses aux questions 1 à 15 du questionnaire concernant :

1. Le besoin de structure dans les tâches : est-ce que la personne a un besoin de structure 'plus que la moyenne', 'dans la moyenne' ou 'moins que la moyenne' ?

2. La prévisibilité dans le travail : est-ce que la personne préfère 'plus de prévisibilité que la moyenne', 'dans la moyenne' ou 'moins de prévisibilité que la moyenne' ?"""

context_append(interpersonnelles_text, structure_prompt)

structure = generateur_texte(message_data, 500)

structure_text = structure.choices[0].message.content


#Section "Perception défis, problèmes et difficultés"

problemes_prompt = """Je souhaite que tu crées une section 'Perception des défis, problèmes et difficultés' dans un **MAXIMUM DE 150 MOTS** qui décrit comment une personne perçoit et gère les défis, les problèmes, et les difficultés, en se basant sur ses réponses du questionnaire DISC de la question précédente et ses caractéristiques personnelles. Le texte doit être en plusieurs paragraphes, décrivant l'attitude générale de la personne face aux défis, en mettant en avant son approche, ses forces, et ses éventuelles zones d'amélioration. Inclut un paragraphe final qui compare sa perception des défis avec une perception opposée. Décris comment la personne voit les défis – les perçoit-elle comme des opportunités d'apprentissage, des obstacles à surmonter, ou des situations stressantes ? Mentionne ses stratégies pour gérer les problèmes, comme l'analyse, la patience, ou la collaboration. Mentionne la manière dont la personne aborde les problèmes, en se basant sur ses réponses concernant l'impulsivité, la méthode, la tolérance au stress, et la collaboration. Aborde aussi ses préférences pour l'analyse ou l'action rapide. Pour la dernière partie du texte, au lieu de mentionner une dominance de couleur, mentionne une perception qui serait opposée à celle de la personne décrite. Par exemple, si la personne est prudente et méthodique, mentionne que d'autres pourraient la percevoir comme trop lente, tandis qu'elle pourrait percevoir ces personnes comme trop impulsives ou agressives. Utilise un ton engageant et nuancé, en restant réaliste et en soulignant les forces et les défis potentiels de la personne. Voici un exemple de ce que je souhaite obtenir : [Exemple 1 Madame Test perçoit les défis, les problèmes, et les difficultés comme des occasions de démontrer son audace, sa créativité, et sa capacité à prendre des décisions rapidement. Elle aborde ces situations avec un esprit entreprenant, préférant l'action immédiate à l'analyse prolongée. Pour elle, chaque obstacle est une chance de prouver son indépendance et de mettre en avant son esprit d'initiative. Elle n'hésite pas à se lancer dans l'inconnu, voyant dans les difficultés une opportunité d'explorer de nouvelles solutions et de repousser les limites établies.\n Son approche est marquée par une volonté de maximiser les expériences positives, même dans les moments difficiles. Madame Test préfère une stratégie proactive, cherchant à surmonter les obstacles avec détermination et en gardant un regard optimiste sur l'issue. Elle valorise les solutions innovantes et n'a pas peur de remettre en question les méthodes traditionnelles si elle pense qu'une approche différente pourrait être plus efficace.\n À noter que certaines personnes pourraient percevoir l'attitude de Madame Test comme étant trop impulsive ou risquée, ce qui pourrait leur sembler précipité ou imprudent. En revanche, Madame Test pourrait percevoir ces personnes comme étant trop prudentes ou lentes à réagir, ce qui pourrait lui sembler freiner la progression et limiter les opportunités d'innovation.\n "Je souhaite obtenir deux informations basées sur les réponses au questionnaire :

1. Positivité face aux défis : Indique si la personne est 'plus positive que la moyenne', 'dans la moyenne' ou 'moins positive que la moyenne' lorsqu'elle fait face aux défis et difficultés.

2. Gestion du stress : Indique si la personne gère le stress 'mieux que la moyenne', 'dans la moyenne' ou 'moins bien que la moyenne'."""


context_append(structure_text, problemes_prompt)

problemes = generateur_texte(message_data, 350)

problemes_text = problemes.choices[0].message.content


#Section "Archétype"

archetype_prompt = f"""Tes motivations naturelles "Je souhaite que tu crées un texte de ***100 MOTS MAXIMUM*** qui décrit les motivations profondes de la personne. Base-toi sur ces questionnaires : {synergia_archetype_string} et{synergia_section_developpement_string}, ainsi que sur les archétypes de la personnalité, sans les nommer. Le texte doit refléter ce qui motive la personne de façon unique, en soulignant ses valeurs fondamentales et ce qui la rend spéciale. Utilise un ton positif qui met en avant son individualité et son approche singulière dans ses actions et décisions." (exemple : Madame Test est profondément motivée par la volonté de créer un impact positif à travers des projets innovants et inspirants. Elle aime repousser les frontières de la connaissance, guider les autres vers la transformation, et inspirer des changements de perspective. L'humour et l'authenticité jouent un rôle clé dans ses interactions, tout comme son désir de vivre des connexions émotionnelles profondes. Ambitieuse et orientée vers l'action, elle cherche à bâtir un avenir où elle pourra diriger avec confiance, tout en restant fidèle à ses valeurs de créativité et de simplicité.)"""

context_append(problemes_text, archetype_prompt)

archetype = generateur_texte(message_data, 300)

motivation_text = archetype.choices[0].message.content

#Section Description Archétype 1

desc_arch1_prompt= f"""Je souhaite obtenir un texte de 100 mots par archétype, basé sur les deux principaux archétypes de la personne. Le texte doit refléter ce que la personne aime, en se basant sur ces deux questionnaires:\n {synergia_archetype_string} et\n {synergia_section_developpement_string}. À partir de ces pourcentages calculés : \n {text_pourcentage_archetype}\n pondère les archétypes en fonction des questions à développement. Nous allons commencer par le premier texte de 100 mot pour le premier archétype, le deuxième texte viendra dans le prompt suivant et devra suivre la même logique que celui-ci. Assure-toi de mettre en avant les préférences, désirs, et motivations de la personne en lien avec le premier de ses deux principaux archétypes, tout en expliquant ce qui la motive profondément." (Exemple : Madame Test aime inspirer les autres à voir de nouvelles possibilités et à transformer leurs pensées. Elle apprécie particulièrement guider les gens vers leur propre croissance et transformation, en trouvant des moyens d'influencer positivement leur vie. Son intérêt pour les idées innovantes et sa volonté de voir des changements profonds chez les autres la motivent profondément. Elle aime également créer des projets concrets qui font une réelle différence, reflétant son désir constant d’apporter de la magie et de la transformation dans le monde qui l'entoure. Madame Test aime créer des relations profondes et authentiques avec ceux qui l’entourent. Elle apprécie particulièrement les moments de connexion émotionnelle et les interactions où la sincérité et l’affection sont présentes. Elle aime partager des expériences riches en émotions et exprimer ses sentiments de manière directe et authentique. Pour elle, la profondeur des liens humains est essentielle, et elle se sent épanouie lorsqu'elle peut être elle-même et vivre des relations pleines d'intimité et de complicité. Madame Test recherche des relations qui nourrissent son besoin d'authenticité et de sincérité.)"""


context_append(motivation_text, desc_arch1_prompt)

desc_arch1 = generateur_texte(message_data, 700)

desc_arch1_text = desc_arch1.choices[0].message.content




#Section description Archétype 2

desc_arch2_prompt= f"""En se fiant au même contexte que le prompt précédant en lien des deux principaux archétype de la personne, j'ai besoin que tu m'écrive le texte de 100 mots avec les mêmes consignes et informations, mais cette fois-ci pour le deuxième de ses deux principaux archétypes"""


context_append(desc_arch1_text, desc_arch2_prompt)

desc_arch2 = generateur_texte(message_data, 700)

desc_arch2_text = desc_arch2.choices[0].message.content

#Section nom du premier archétype

arch1_prompt = "J'ai besoin que tu me sorte le premier de ses deux archétype principaux que tu as choisis mais en ***1 SEUL MOT! SANS POINT!***"

context_append(desc_arch2_text, arch1_prompt)

arch1 = generateur_texte(message_data, 50)

arch1_nom = arch1.choices[0].message.content

#Section nom du deuxième archétype

arch2_prompt = "J'ai besoin que tu me sorte le deuxième de ses deux archétype principaux que tu as choisis mais en ***1 SEUL MOT! SANS POINT!***"

context_append(arch1_nom, arch2_prompt)

arch2 = generateur_texte(message_data, 50)

arch2_nom = arch2.choices[0].message.content



#section Toi et le marché du travail

travail_prompt = """Je souhaite que tu rédiges un texte complet qui décrit le profil professionnel d’une personne, en utilisant ses réponses au questionnaire, ses traits de personnalité DISC, et ses motivations principales. Le texte doit suivre une structure précise et inclure plusieurs paragraphes décrivant différents aspects de sa personnalité et de sa façon de travailler, ***DANS UN MAXIMUM DE 325 MOTS***. Assure-toi d’utiliser un langage fluide, engageant, et de ne pas répéter les mêmes mots ou expressions. Voici la structure à suivre :\n1.	Introduction de la Personne :\nDébute par une description de la nature et des traits de personnalité principaux de la personne, et comment ces caractéristiques influencent sa manière de travailler. Mets en avant ce qui la rend unique dans son approche professionnelle.\n2.	Compétences et Style de Travail :\nPrésente les compétences professionnelles distinctives de la personne et son style de travail. Décris comment ses traits se manifestent concrètement dans son travail, en expliquant ce qui la rend efficace dans son rôle. Inclue des exemples ou scénarios pour illustrer ces compétences.\n3.	Approche en Équipe et Prise de Décision :\nDécris comment la personne contribue à la dynamique d’équipe et à la prise de décision. Mentionne sa manière de collaborer, son style de communication, et comment elle aborde les défis en groupe. Ajoute un aperçu de la gestion des conflits ou des situations délicates pour montrer comment elle réagit en moments critiques.\n4.	Style de Leadership :\nSi la personne est en position de leadership, décris son style de gestion et comment elle est perçue par les autres. Mets en avant ses qualités de leader et la façon dont elle inspire, motive, ou guide son équipe. \n5.	Impact sur l’Équipe :\nConclus en expliquant l’impact de la personne sur ses collègues et sur la dynamique de l’équipe. Mentionne comment elle influence son entourage, crée une dynamique de travail spécifique, et en quoi ses qualités apportent de la valeur. \nAssure-toi que le texte soit équilibré, nuancé, et qu’il donne une vision complète de la personne en montrant à la fois ses forces et ses zones d’amélioration. Il ne doit pas répéter les mêmes caractéristiques fréquemment. Inclue des exemples concrets et explore les aspects relationnels pour offrir un portrait riche et engageant. Voici un exemple de ce que je souhaite obtenir : [Exemple 1 :Madame Test se distingue par sa nature audacieuse et indépendante, qui transparaît dans sa manière de travailler. Elle valorise la liberté d’action et l’autonomie, ce qui lui permet de prendre des initiatives audacieuses et d’aborder les projets avec une grande créativité. Son désir de se démarquer et de créer un impact positif est évident dans chaque aspect de son travail. Son approche professionnelle est marquée par une volonté constante de repousser les limites, tant pour elle-même que pour son équipe.\nSur le plan professionnel, Madame Test se révèle particulièrement efficace dans des contextes où l’innovation est encouragée. Elle excelle à transformer des idées novatrices en actions concrètes, notamment lors de la création d’animations à domicile ou dans des projets qui demandent une touche personnelle. Son style de travail est dynamique et énergique : elle aime explorer de nouvelles voies et se lance sans hésiter dans des initiatives non conventionnelles. Par exemple, lorsqu'elle initie un projet, elle s’assure que chaque détail reflète son sens de l’originalité et de la nouveauté, apportant ainsi une dimension unique à ses réalisations.\nDans une équipe, Madame Test adopte une approche directe et proactive, contribuant à la prise de décision avec assurance. Elle n’hésite pas à exprimer ses idées et à encourager les autres à sortir de leur zone de confort. Sa capacité à gérer des situations délicates avec un mélange d’audace et de réflexion rapide lui permet de naviguer efficacement dans les moments critiques. Elle sait mobiliser son équipe en utilisant son enthousiasme contagieux, même si son style peut parfois dérouter ceux qui préfèrent une approche plus structurée et méthodique.\nEn tant que leader, Madame Test inspire par sa détermination et son esprit d’initiative. Elle est perçue comme une figure motivante, toujours prête à explorer de nouvelles stratégies et à encourager son équipe à faire de même. Sa capacité à diriger avec confiance tout en laissant de la place à l’innovation en fait une leader qui se démarque par son approche visionnaire. Elle sait guider son équipe avec un équilibre entre indépendance et engagement, créant un environnement où chacun se sent libre de contribuer.\nL’impact de Madame Test sur son entourage est marqué par sa capacité à insuffler une dynamique positive et stimulante. Elle influence ses collègues par son énergie et sa passion pour l’innovation, poussant l’équipe à se dépasser et à embrasser le changement avec enthousiasme. Ses qualités font d’elle une alliée précieuse, capable de transformer la dynamique de travail en un espace où les idées audacieuses et les approches non conventionnelles sont non seulement acceptées, mais encouragées.\n."""


context_append(arch2_nom, travail_prompt)

travail = generateur_texte(message_data, 700)

travail_text = travail.choices[0].message.content

# Section comment s'adapter Rouge

adapte_rouge_prompt = """Je souhaite obtenir une section intitulée 'Comment s'adapter' pour un profil DISC en contexte MLM, avec des conseils organisés pour interagir avec une personne rouge. La réponse doit proposer des stratégies de communication et de motivation adaptées aux préférences des rouges, tout en tenant compte des forces et faiblesses de la personne selon son propre profil DISC. Chaque conseil doit être concret, facile à appliquer et basé sur les caractéristiques spécifiques de la personne.***LE TEXTE DOIT AVOIR UN MAXIMUM DE 350 MOTS***. Organise les conseils sous forme de puces pour chaque point et il est important que tu retiennes ce format pour les prompts suivants:

1. Communication : Décris comment la personne peut adapter sa communication avec une personne rouge, en s’appuyant sur ses forces et en évitant ses faiblesses.

2. Prise de Décision et Leadership : Fournis des conseils sur les styles de leadership et de prise de décision pour une personne rouge, alignés sur les points forts et les points d’amélioration de la personne.

3. Encourager l’Engagement et la Fidélité : Propose des méthodes pour susciter l'engagement durable d’une personne rouge, adaptées aux compétences et aux limites naturelles de la personne.

4. Reconnaissance et Célébration : Suggère des façons de reconnaître et célébrer les succès en fonction d’une personne rouge, tout en intégrant les talents et les préférences spécifiques de la personne.

5. Gestion des Conflits et de l’Adaptabilité : Indique des stratégies pour gérer les conflits et s’adapter aux imprévus avec une personne rouge, en se basant sur les comportements naturels de la personne.

Exemple : 🗣 Communication Directe et Concise : Monsieur Test, avec son style de communication analytique, doit adapter ses échanges avec les Rouges en simplifiant ses messages et en allant droit au but. Les Rouges apprécient la clarté et l'efficacité ; ainsi, en évitant les détails superflus et en se concentrant sur les points essentiels, Monsieur Test gagnera leur respect et leur attention.

⚡ Prise de Décision Rapide et Assurée : Bien que Monsieur Test préfère analyser les options en profondeur, il est important qu'il montre de l'assurance et prenne des décisions rapides avec les Rouges. Ces derniers valorisent la fermeté et la rapidité. Monsieur Test peut s’exercer à réduire le temps de réflexion et à se montrer plus déterminé pour répondre à leurs attentes.

🎯 Encourager l’Engagement et la Fidélité : Les Rouges sont motivés par les résultats et les objectifs concrets. Monsieur Test pourrait mettre en avant l'impact direct des actions pour les inciter à s'engager durablement. En soulignant la façon dont leurs efforts mènent à des accomplissements visibles, il leur donne un sens de direction et de satisfaction qui correspond à leur besoin d’efficacité.

🏆 Reconnaissance Basée sur les Accomplissements : Plutôt que de se concentrer sur des encouragements réguliers, Monsieur Test devrait souligner les accomplissements majeurs des Rouges. Ils sont sensibles à la reconnaissance de leurs résultats concrets. En valorisant leurs réussites de manière factuelle et en leur montrant l'impact direct de leurs contributions, il renforcera leur motivation.

💥 Gestion des Conflits et Adaptabilité : Les Rouges apprécient une approche assertive dans la gestion des conflits. Monsieur Test, qui peut avoir tendance à être méthodique, devrait se montrer plus réactif et éviter de trop s’attarder sur l’analyse des situations conflictuelles. Une réponse rapide et claire sera plus efficace avec eux, et cela leur montrera qu’il est capable de gérer des imprévus avec confiance."""

context_append(travail_text, adapte_rouge_prompt)

adapte_rouge = generateur_texte(message_data, 1000)

adapte_rouge_text = adapte_rouge.choices[0].message.content

# Section comment s'adapter Bleu

adapte_bleu_prompt = """Pour ce texte, j'ai besoin du même style et consigne que le prompt précédent en lien avec l'adaptation selon les couleurs de personnalité, mais cette fois-ci, il faut s'adapter à une personne ayant une couleur de personnalité BLEU"""

context_append(adapte_rouge_text, adapte_bleu_prompt)

adapte_bleu = generateur_texte(message_data, 1000)

adapte_bleu_text = adapte_bleu.choices[0].message.content

# Section comment s'adapter Vert

adapte_vert_prompt = """Pour ce texte, j'ai besoin du même style et consigne que le prompt précédent en lien avec l'adaptation selon les couleurs de personnalité, mais cette fois-ci, il faut s'adapter à une personne ayant une couleur de personnalité VERTE"""

context_append(adapte_bleu_text, adapte_vert_prompt)

adapte_vert = generateur_texte(message_data, 1000)

adapte_vert_text = adapte_vert.choices[0].message.content

# Section comment s'adapter Jaune

adapte_jaune_prompt = """Pour ce texte, j'ai besoin du même style et consigne que le prompt précédent en lien avec l'adaptation selon les couleurs de personnalité, mais cette fois-ci, il faut s'adapter à une personne ayant une couleur de personnalité JAUNE"""

context_append(adapte_vert_text, adapte_jaune_prompt)

adapte_jaune = generateur_texte(message_data, 1000)

adapte_jaune_text = adapte_jaune.choices[0].message.content


#Print la totalité des textes

full_text= text_pourcentage_complet + "EN BREF\n" + bref_text + "\n\n" + "Tes forces mises en lumière\n" + forces_text + "\n\n" + "Tes défis Potentiels\n" + defis_text + "\n\n" + "Perception du changement\n" + changements_text + "\n\n" + "Perception des relations interpersonnelles\n" + interpersonnelles_text + "\n\n" + "Perception dubesoin de structure et de prévisibilité\n" + structure_text + "\n\n" + "Perception des défis, problèmes et difficultés\n" + problemes_text + "\n\n" + "Section Archétypes\n" + motivation_text + "\n\n" + "Description des 2 archétypes\n" + desc_arch1_text + desc_arch2_text + "\n\n" + "Toi et le marché du travail\n" + travail_text + "\n\n" + "Comment s'adapter au rouge\n" + adapte_rouge_text + "\n\n" + "Comment s'adapter au bleu\n" + adapte_bleu_text + "\n\n" + "Comment s'adapter au vert\n" + adapte_vert_text + "\n\n" + "Comment s'adapter au jaune\n" + adapte_jaune_text + "\n\n" 



#POUR GÉNÉRATION DES DOSSIERS ET WORD
    
def generate_unique_filename(base_filename, extension=".docx"):
    counter = 1
    filename = base_filename + extension
    while os.path.exists(filename):
        filename = f"{base_filename}_{counter}{extension}"
        counter += 1
    return filename

def generate_simple_word(file_path, text_content):
    # Créer un document Word
    unique_file_path = generate_unique_filename(file_path)
    doc = Document()

    # Ajouter du texte au document
    for line in text_content.splitlines():
        doc.add_paragraph(line)
    
    # Sauvegarder le document
    doc.save(unique_file_path)

# Chemin du nouveau dossier à créer

nom_organisateur = synergia_nom.iloc[0, 4]

nouveau_dossier = f"C:/Users/Guillaume Cloutier/OneDrive/Synergia/{nom_organisateur}/profils"
dossier_facture = f"C:/Users/Guillaume Cloutier/OneDrive/Synergia/{nom_organisateur}/factures"
dossier_questionnaires = f"C:/Users/Guillaume Cloutier/OneDrive/Synergia/{nom_organisateur}/questionnaires"

if not os.path.exists(nouveau_dossier):
    os.makedirs(nouveau_dossier)
    
if not os.path.exists(dossier_facture):
    os.makedirs(dossier_facture)

if not os.path.exists(dossier_questionnaires):
    os.makedirs(dossier_questionnaires)

# Générer le fichier Word
generate_simple_word(f"{nouveau_dossier}/{nom_profile}", full_text)
    
# Pour updater la database

update_database(nom_profile, motivation_text, bref_text, forces_text, defis_text, changements_text, interpersonnelles_text, structure_text, problemes_text, arch1_nom, arch2_nom, desc_arch1_text, desc_arch2_text, travail_text, adapte_rouge_text, adapte_bleu_text, adapte_vert_text, adapte_jaune_text, bleu, rouge, jaune, vert, explorateur, protecteur, bouffon, souverain, magicien, createur, hero, citoyen, sage, amoureuse, rebelle, optimiste , email, nom_leader)

# Pour Autofill le template Canva

autofill_job(nom_profile, motivation_text, bref_text, forces_text, defis_text, changements_text, interpersonnelles_text, structure_text, problemes_text, arch1_nom, arch2_nom, desc_arch1_text, desc_arch2_text, travail_text, adapte_rouge_text, adapte_bleu_text, adapte_vert_text, adapte_jaune_text, bleu, rouge, jaune, vert)

