import os
import time
import pandas as pd
import warnings
warnings.filterwarnings("ignore", category=UserWarning, module="openpyxl")
from openai import OpenAI
from openai.types import Completion, CompletionChoice, CompletionUsage
from reportlab.lib.pagesizes import letter
import textwrap
from docx import Document



  
# *****À FAIRE**** code pour automatisation, activation lors de réception d'un nouveau formulaire 

#NOM format "Prénom, Nom"

nom = "David, Bernier"

#DONNÉES EXCEL

#Pour le client
synergia = pd.read_excel("C:/Users/Guillaume Cloutier/OneDrive/Synergia/Synergia.xlsx", sheet_name="Réponses 3")

synergia_nom = pd.DataFrame(synergia.loc[synergia["Nom"]== nom])

plage_nom = synergia_nom.iloc[:,2:3]
plage_questions1_11 = synergia_nom.iloc[:,6:50]
plage_questions17_20 = synergia_nom.iloc[:,62:78]
plage_questions1_20 = synergia_nom.iloc[:,6:78]
plage_questions12_14 = synergia_nom.iloc[:,50:62]
plage_questions15_16 = synergia_nom.iloc[:,106:114]
plage_questions_dev1 = synergia_nom.iloc[:,104:106]
plage_questions_dev2 = synergia_nom.iloc[:,115:116]
plage_questions_complet = synergia_nom.iloc[:,6:115]
plage_questions21_26 = synergia_nom.iloc[:,78:102]

#section 1
synergia_section1= pd.concat([plage_nom, plage_questions1_11, plage_questions17_20], axis=1)

synergia_section1_transposed = synergia_section1.transpose()

synergia_section1_string = synergia_section1_transposed.to_string(header=False)

#section 2
synergia_section2 = pd.concat([plage_nom, plage_questions1_20], axis = 1)

synergia_section2_transposed = synergia_section2.transpose()

synergia_section2_string = synergia_section2_transposed.to_string(header=False)

#motivation
synergia_section_motivation= pd.concat([plage_nom, plage_questions1_20, plage_questions15_16], axis=1)

synergia_section_motivation_transposed = synergia_section_motivation.transpose()

synergia_section_motivation_string = synergia_section_motivation_transposed.to_string(header=False)


#couple
synergia_section_couple= pd.concat([plage_nom, plage_questions21_26], axis=1)

synergia_section_couple_transposed = synergia_section_couple.transpose()

synergia_section_couple_string = synergia_section_couple_transposed.to_string(header=False)

#question developpement

synergia_section_dev = pd.concat([plage_nom, plage_questions_dev1, plage_questions_dev2], axis = 1)

synergia_section_dev_transposed = synergia_section_dev.transpose()

synergia_section_dev_string = synergia_section_dev_transposed.to_string(header=False)


#Pour le model 1

synergia_model1 = synergia.iloc[[92]]

plage_model1 = synergia_model1.iloc[:,2]
plage_model1_questions1_11 = synergia_model1.iloc[:,6:50]
plage_model1_questions17_20 = synergia_model1.iloc[:,62:78]

synergia_model1_section1= pd.concat([plage_model1, plage_model1_questions1_11, plage_model1_questions17_20], axis=1)

synergia_model1_section1_transposed = synergia_model1_section1.transpose()

synergia_model1_section1_string = synergia_model1_section1_transposed.to_string(header=False)

#Pour le model 2

synergia_model2 = synergia.iloc[[88]]

plage_model2 = synergia_model2.iloc[:,2]
plage_model2_questions1_11 = synergia_model2.iloc[:,6:50]
plage_model2_questions17_20 = synergia_model2.iloc[:,62:78]

synergia_model2_section1= pd.concat([plage_model2, plage_model2_questions1_11, plage_model2_questions17_20], axis=1)

synergia_model2_section1_transposed = synergia_model2_section1.transpose()

synergia_model2_section1_string = synergia_model2_section1_transposed.to_string(header=False)


#***VARIABLES ET FONCTIONS***


client = OpenAI(
    api_key=os.environ.get("OPENAI_API_KEY"),
)

def generateur_texte(message, token):
    response=client.chat.completions.create(model= "gpt-4o", 
        messages = message, 
        max_tokens = token)
    return response
    

# GÉNÉRER UN TEXTE POUR CHAQUE SECTION

#SECTION "EN BREF":

bref_system = "Je souhaite que tu crées un résumé de personnalité qui capte les aspects essentiels d'une personne, basé sur ses réponses à un questionnaire DISC et ses caractéristiques personnelles. Je t'envoie un format ou la première ligne est le nom et les suivantes sont les questions posées ainsi qu'un choix de réponse, les valeurs correspondent à une échelle de 0 à 10. Si c'est 0, ça ne représente pas la personne et 10 représente beacuoup la personne . Les valeurs \"moins que moi\" équivalent à 0 et \"plus que moi\" équivalent à 10. Le texte doit comprendre trois à quatre paragraphes, chacun se concentrant sur différents aspects de la personnalité de la personne : ses forces principales, sa manière de travailler, ses interactions sociales, et ses valeurs ou préférences. Inclut les forces dominantes comme le leadership, l'analytique, la créativité, ou l'organisation. Décris comment cette personne aborde son travail, en mettant en avant des aspects tels que la méthodicité, la rigueur, l'innovation, ou la flexibilité. Explique comment cette personne interagit avec les autres, que ce soit par son charisme, son écoute, ou sa bienveillance. Mentionne ses valeurs et préférences, telles que la recherche de qualité, la stabilité, la spontanéité, ou l'impact sur les autres. Adopte un ton positif et valorisant, en utilisant un langage riche et nuancé pour refléter les particularités de la personne. Assure-toi que chaque phrase soit unique et ajoute une touche de sophistication au texte. Assure-toi que le texte soit fluide, sans répétitions, et qu'il donne une vision claire et engageante de la personnalité."

bref_user = f"On va faire un test. Dans un texte de **MAXIMUM DE 220 MOTS**, voici les réponses aux questions de Madame test:\n {synergia_model1_section1_string}"

bref_assistant= "Marie-Soleil est une personne déterminée et audacieuse, qui utilise son indépendance et sa confiance en elle pour relever les défis avec assurance. Elle excelle dans la prise de décisions rapides et directes, grâce à son esprit stratégique et son sens de l'initiative, ce qui fait d'elle une leader naturelle.\n Sa spontanéité et son approche positive, alliées à une ouverture d'esprit, lui permettent de s'adapter aisément aux imprévus. Motivée par des objectifs ambitieux, elle n'hésite pas à se lancer dans l'inconnu avec assurance. Bien qu'elle soit orientée vers l'action et l'efficacité, elle sait captiver les autres par son esprit divertissant et rendre chaque moment plus engageant.\n Dans ses interactions sociales, Marie-Soleil est sociable et apprécie rencontrer de nouvelles personnes. Même si elle privilégie une communication directe, elle fait preuve de compassion, même si elle reste concentrée sur ses propres objectifs. Sa nature passionnée et spontanée fait d'elle une personne dynamique, capable d'inspirer son entourage et d'encourager des discussions stimulantes.\n En somme, Marie-Soleil est une personne énergique et stratégiquement orientée, qui vise l'excellence tout en maintenant une grande adaptabilité dans ses actions."

bref_user2= f"Voici un deuxième exemple de Monsieur test. Dans un texte de **MAXIMUM DE 220 MOTS**, voici le questionnaire:\n {synergia_model2_section1_string}"

bref_assistant2= "Guillaume est une personne méthodique et analytique, guidée par un désir de comprendre les choses en détail et de s'assurer que tout suit un ordre logique. Son approche structurée et son attention aux détails font de lui un professionnel organisé, capable de garantir des résultats d'excellence. Il vise des standards élevés et cherche constamment à perfectionner son travail.\n Sa prudence et son analyse réfléchie des situations montrent sa capacité à évaluer les options avant de prendre des décisions. Bien qu'il préfère analyser les données plutôt que d'agir sur des impulsions, il est déterminé à atteindre ses objectifs une fois sa décision prise. Cette rigueur est renforcée par une grande patience et une tolérance pour les situations complexes, lui permettant de persévérer même dans les environnements exigeants.\n Dans ses interactions sociales, Guillaume est plus réservé, préférant se concentrer sur les faits concrets plutôt que sur les discussions superficielles. Il valorise le tact et la bienveillance dans ses relations, mais est avant tout motivé par le besoin d'assurer une qualité irréprochable dans tout ce qu'il fait. Sa capacité à évaluer l'impact de ses actions sur les autres montre un souci de préserver l'équilibre.\n En somme, Guillaume est une personne rigoureuse, organisée et analytique, engagée à atteindre des résultats de haute qualité tout en maintenant une approche réfléchie et structurée."

bref_prompt= f"Maintenant, voici le véritable questionnaire qui nous servira pour toute la suite de la conversation. Execute la même tâche que les deux exemples précédents dans un **MAXIMUM DE 200 MOTS** pour le questionnaire suivant:\n {synergia_section1_string}"

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

forces_prompt = f"Je souhaite que tu identifies et présentes les 5 principales forces de cette même personne dans un texte de **MAXIMUM DE 150 MOTS** sous forme de points clés, basées sur ses couleurs de personalités ainsi que son questionnaire : {synergia_section1_string}.\nPrésente chaque force sous la forme d'une phrase concise accompagnée d'une icône représentative (comme un emoji) au début de chaque point. Adopte un ton positif et valorisant, en utilisant un langage précis et professionnel. Assure-toi que chaque point soit clair, succinct, et reflète les compétences de la personne dans sa vie personnelle. Voici un exemple de ce que je souhaite obtenir : [exemple 1 💡 Audace et Prise de Risques : Madame Test se distingue par sa capacité à prendre des risques calculés, n'hésitant pas à foncer vers l'inconnu avec une confiance remarquable.🎯 Orientation Vers les Objectifs : Sa détermination à atteindre des objectifs ambitieux la pousse à agir rapidement et efficacement, en restant toujours concentrée sur les résultats à atteindre.💬 Communication Directe : Elle excelle dans l'art de communiquer de manière claire et directe, ce qui lui permet de naviguer avec assurance dans les interactions et les prises de décision.🌟 Flexibilité et Spontanéité : Madame Test sait s'adapter aux situations imprévues avec une grande spontanéité, transformant les défis en opportunités pour innover et avancer. 🚀 Autonomie et Initiative : Son indépendance lui permet de travailler de manière autonome, prenant des initiatives audacieuses pour mener ses projets à terme sans nécessiter de supervision constante.\n "

#"Exemple 2 🧠 Pensée Analytique : Guillaume excelle dans l'analyse détaillée, capable de naviguer à travers des situations complexes pour identifier les solutions optimales. 🔍 Orientation vers la Précision : Il possède une attention remarquable aux détails, s'assurant que chaque aspect de son travail répond aux plus hauts standards de qualité. 📈 Capacité de Planification Stratégique : Son aptitude à anticiper et à élaborer des stratégies à long terme démontre sa vision et sa capacité à orienter efficacement les ressources vers des objectifs définis. 🚀 Autonomie et Indépendance : Guillaume travaille efficacement de manière autonome, prenant des initiatives et conduisant des projets à leur terme avec peu de supervision. 🌱 Apprentissage Continu et Développement Personnel : Il est constamment en quête de croissance, cherchant à élargir ses connaissances et à perfectionner ses compétences pour s'adapter et innover.]. Assure-toi que les forces mises en avant soient directement liées aux caractéristiques clés de la personne et qu'elles reflètent une image positive et professionnelle."

message_data.append( 
  {
    "role": "assistant", 
    "content": bref_text
  }
)
  
message_data.append(
    {
        "role": "user",
        "content": forces_prompt
    }
)

forces = generateur_texte(message_data, 300)

forces_text = forces.choices[0].message.content

#Section "Tes défis Potentiels"

defis_prompt = "Je souhaite que tu identifies et présentes les 4 défis potentiels de cette personne dans sa vie personnelle basé sur ses couleurs de personnalité ainsi que sur son questionnaire, sous forme de points clés, mais avec un **MAXIMUM DE 120 MOTS**. Présente chaque défi sous la forme d'une phrase concise, accompagnée d'une icône représentative (comme un emoji) au début de chaque point. Utilise un ton neutre mais constructif, en soulignant les défis d'une manière qui incite à la réflexion sans être trop critique. Assure-toi que chaque point soit clair, succinct, et directement lié aux caractéristiques clés de la personne. Voici un exemple de ce que je souhaite obtenir : exemple 1 🔄 Précipitation dans l'action : Sa tendance à agir rapidement et à prendre des risques peut parfois manquer de la réflexion nécessaire, surtout dans des situations complexes. 🌍 Interaction sociale réservée : Son indépendance et son orientation vers l'action peuvent parfois la rendre moins attentive aux besoins émotionnels des autres, ce qui pourrait créer des décalages dans les relations. 🚧 Approche directe et sans détour : Sa communication franche et directe, bien que souvent efficace, peut parfois être perçue comme un manque de tact, ce qui pourrait engendrer des malentendus. ⏩ Tolérance limitée à l'attente : Son désir de voir des résultats rapides peut rendre difficile pour elle de tolérer les délais ou les processus lents, ce qui pourrait mener à une frustration dans des environnements moins dynamiques.\n "

#"Exemple 2 🔄 Tendance à l'analyse excessive : Son besoin de tout analyser en détail peut parfois ralentir la prise de décision, surtout dans des situations où une action rapide est nécessaire. 🚧 Réservé dans les interactions sociales : Sa nature introvertie et son manque d'enthousiasme pour les interactions sociales peuvent le rendre distant, ce qui pourrait limiter sa capacité à créer des connexions avec les autres. 🔍 Rigidité dans l'organisation : Son attachement à l'ordre et à la méthodologie peut le rendre moins flexible face aux changements ou aux idées nouvelles, ce qui pourrait créer des tensions dans des environnements plus dynamiques. ⏳ Prise de décision prudente : Sa préférence pour la prudence et la réflexion approfondie peut parfois être perçue comme de l'hésitation, surtout dans des situations où une action plus décisive est attendue. ]. Assure-toi que les défis potentiels identifiés reflètent une vision équilibrée et réaliste de la personnalité de la personne, tout en étant présentés de manière constructive."

message_data.append( 
  {
    "role": "assistant", 
    "content": forces_text
  }
)
  
message_data.append(
    {
        "role": "user",
        "content": defis_prompt
    }
)

defis = generateur_texte(message_data, 250)

defis_text = defis.choices[0].message.content

#Section "Perception du changement"

changement_prompt = f"""Je souhaite que tu crées une section 'Perception du changement' dans un **MAXIMUM DE 200 MOTS** qui décrit comment une personne perçoit et réagit au changement. Cette fois-ci,  en se basant sur la totalité des question du questionnaire suivant:\n {synergia_section2_string}.\n Le texte doit être en plusieurs paragraphes, décrivant comment la personne aborde le changement, en mettant en avant son attitude générale, ses forces, et son approche face aux nouvelles situations. Inclut un paragraphe final qui la compare avec une perception opposée. Décris comment la personne voit le changement – est-ce qu'elle l'embrasse, le redoute, ou le considère comme une opportunité ? Mentionne la manière dont la personne s'adapte aux nouvelles situations. Pour la dernière partie du texte, mentionne plutôt une perception qui serait opposée à celle de la personne décrite. Par exemple, si la personne est rapide et positive, mentionne que d'autres pourraient la percevoir comme étant trop précipitée ou optimiste, tandis qu'elle pourrait percevoir ces personnes comme trop prudentes ou focalisées sur les risques. Utilise un ton engageant, tout en restant réaliste et nuancé. Assure-toi que la section finale sur la perception opposée soit constructive et présente un équilibre entre les différentes perspectives. Voici un exemple de ce que je souhaite obtenir : [exemple 1 Maxime perçoit le changement comme une opportunité excitante et un moteur de croissance personnelle et professionnelle. Son audace et son esprit d'initiative le rendent particulièrement réceptif aux nouvelles expériences et aux défis. Il aborde le changement avec un optimisme contagieux, voyant chaque nouveauté comme une chance de tester ses capacités de leader et d'innovateur. Maxime est naturellement incliné à embrasser le changement plutôt que de le redouter, considérant chaque transition comme une porte ouverte vers de nouvelles possibilités et aventures. Sa capacité à prendre des décisions rapides et à s'adapter spontanément le rend apte à naviguer efficacement dans des environnements en constante évolution. Pour Maxime, le changement est synonyme de progrès et d'opportunités pour influencer positivement son entourage et laisser une empreinte durable. À noter que certaines personnes pourraient percevoir l'attitude de Maxime comme étant trop rapide ou optimiste, ce qui pourrait leur sembler précipité ou risqué. En revanche, Maxime pourrait percevoir ces personnes comme étant trop prudentes ou trop axées sur les détails, ce qui pourrait lui sembler freiner l'innovation et l'action rapide.\n """

#"Exemple 2 : Monsieur Test perçoit le changement avec une approche méthodique et prudente. Bien qu'il soit rigoureux et axé sur l'organisation, il n'est pas immédiatement enthousiaste face aux transitions soudaines ou non planifiées. Pour lui, le changement est avant tout une occasion de mettre à l'épreuve sa capacité à maintenir un haut niveau de précision et d'exactitude. Son besoin de sécurité et son attachement aux règles établies le poussent à aborder le changement avec une certaine réserve, préférant s'assurer que chaque étape soit soigneusement planifiée et analysée avant de l'adopter.\n Toutefois, Monsieur Test valorise la liberté et l'indépendance, ce qui lui permet de s'adapter lorsque le changement est nécessaire pour atteindre ses objectifs personnels ou professionnels. Il est motivé par le désir de perfectionner constamment ses compétences, ce qui le rend ouvert à des ajustements, à condition qu'ils soient bien réfléchis et qu'ils respectent ses standards élevés. Bien qu'il privilégie une approche réfléchie, il n'est pas réfractaire aux idées nouvelles, surtout si elles sont soutenues par des données concrètes et une logique solide.\n À noter que certaines personnes pourraient percevoir l'attitude réfléchie de Monsieur Test comme étant trop prudente ou lente à agir, ce qui pourrait leur sembler restrictif ou trop rigide. En revanche, Monsieur Test pourrait percevoir ces personnes comme étant trop impulsives ou désorganisées, ce qui pourrait lui sembler compromettre la qualité et la fiabilité des résultats.]"

message_data.append( 
  {
    "role": "assistant", 
    "content": defis_text
  }
)
  
message_data.append(
    {
        "role": "user",
        "content": changement_prompt
    }
)

changements = generateur_texte(message_data, 350)

changements_text = changements.choices[0].message.content


#Section "Perception des relations amicales"

amicale_prompt = """Je souhaite que tu crées une section 'Perception des relations amicales' dans un **MAXIMUM DE 200 MOTS** qui décrit comment une personne perçoit et gère ses amitiés, en se basant sur ses réponses au questionnaire de 1 à 20 comme la question précédente et ses caractéristiques personnelles. Le texte doit être en plusieurs paragraphes, décrivant comment la personne envisage les relations amicales, en mettant en avant son attitude générale, ses forces, et sa manière de cultiver ses amitiés. Inclut un paragraphe final qui compare sa perception des relations amicales avec une perception opposée. Décris comment la personne voit et valorise ses relations amicales – est-ce qu'elle recherche des connexions profondes, préfère-t-elle des interactions légères, ou est-elle réservée dans ses relations ? Mentionne la manière dont la personne interagit avec ses amis, en se basant sur ses réponses concernant la sociabilité, la communication, et la tolérance. Aborde aussi sa préférence pour l'harmonie ou son approche des conflits. Pour la dernière partie du texte, au lieu de mentionner une dominance de couleur, mentionne une perception qui serait opposée à celle de la personne décrite. Par exemple, si la personne est prudente et évite les conflits, mentionne que d'autres pourraient la percevoir comme trop passive, tandis qu'elle pourrait percevoir ces personnes comme trop confrontationales ou impulsives. Utilise un ton engageant et positif, en restant réaliste et nuancé. Voici un exemple de ce que je souhaite obtenir : [Exemple 1 Monsieur Test aborde les relations amicales avec une approche analytique et réfléchie. Il privilégie les amitiés qui apportent une certaine stabilité et qui sont fondées sur des valeurs communes, telles que la rigueur, la précision, et le respect des normes. Bien que réservé et peu sociable, il apprécie les amitiés qui respectent son besoin de calme et de structuration. Il n'est pas le genre à rechercher des relations superficielles ou à se précipiter dans de nouvelles amitiés. Pour lui, la qualité prime sur la quantité, et il préfère s'entourer de personnes fiables et sérieuses avec qui il peut avoir des discussions profondes et enrichissantes.\n Monsieur Test est également quelqu'un de prudent dans ses relations amicales. Il évite les amitiés qui pourraient introduire de l'instabilité ou des comportements imprévisibles. Il préfère des interactions où l'efficacité et la logique sont au premier plan, et où les émotions sont gérées de manière rationnelle. Bien qu'il soit moins démonstratif dans ses relations, il accorde une grande importance à la loyauté et au respect mutuel.\n À noter que certaines personnes pourraient percevoir l'attitude de Monsieur Test comme étant trop réservée ou rigide, ce qui pourrait leur sembler distant ou peu engageant. En revanche, Monsieur Test pourrait percevoir ces personnes comme trop spontanées ou désorganisées, ce qui pourrait lui sembler perturbant ou difficile à intégrer dans ses routines bien établies.\n """

#"Exemple 2 Madame Test perçoit les relations amicales comme des espaces d'exploration, de plaisir et d'indépendance. Elle valorise les amitiés qui lui permettent de maximiser les expériences positives et d'explorer de nouvelles idées, tout en préservant sa liberté personnelle. Pour elle, les amitiés sont des opportunités de partager des moments excitants et de créer des souvenirs mémorables, souvent en dehors des conventions traditionnelles. Elle préfère les relations qui ne la contraignent pas, mais qui au contraire, encouragent sa spontanéité et son désir de nouveauté.\n Son approche directe et audacieuse dans ses relations peut la rendre moins attentive aux aspects émotionnels plus subtils, préférant une communication franche et sans détour. Elle aime être entourée de personnes qui partagent son énergie et son enthousiasme pour les projets stimulants. Cependant, elle peut parfois avoir du mal à se connecter avec des amis qui recherchent davantage de stabilité ou qui sont plus attachés aux traditions et aux règles établies./n À noter que certaines personnes pourraient percevoir l'attitude de Madame Test comme étant trop indépendante ou imprévisible, ce qui pourrait leur sembler déstabilisant ou difficile à suivre. En revanche, Madame Test pourrait percevoir ces personnes comme trop attachées aux normes ou trop réticentes à sortir de leur zone de confort, ce qui pourrait lui sembler restreindre leur potentiel d'aventure et de découverte.] Assure-toi que la section finale sur la perception opposée soit constructive et présente un équilibre entre les différentes perspectives."

message_data.append( 
  {
    "role": "assistant", 
    "content": changements_text
  }
)
  
message_data.append(
    {
        "role": "user",
        "content": amicale_prompt
    }
)

amicale = generateur_texte(message_data, 500)

amicale_text = amicale.choices[0].message.content


#Section "Perception règles et convention sociale"

regles_prompt = """Je souhaite que tu crées une section 'Perception des règles et des conventions sociales' dans un **MAXIMUM DE 200 MOTS** qui décrit comment une personne perçoit et réagit aux règles, procédures, et conventions sociales, en se basant sur ses réponses du questionnaire de la question précédente et ses caractéristiques personnelles. Le texte doit être en plusieurs paragraphes, décrivant l'attitude générale de la personne envers les règles et les conventions, en mettant en avant son degré de flexibilité, son adhésion ou non aux normes, et son approche face à l'innovation et la créativité. Inclut un paragraphe final qui compare sa perception des règles avec une perception opposée. Décris comment la personne voit les règles et procédures – les perçoit-elle comme des guides flexibles ou des contraintes nécessaires ? Mentionne comment la personne interagit avec les conventions sociales, en se basant sur ses réponses concernant l'indépendance, l'innovation, et la conformité aux traditions. Pour la dernière partie du texte, au lieu de mentionner une dominance de couleur, mentionne une perception qui serait opposée à celle de la personne décrite. Par exemple, si la personne est flexible et innovante, mentionne que d'autres pourraient la percevoir comme rebelle ou indifférente, tandis qu'elle pourrait percevoir ces personnes comme trop rigides ou strictes. Utilise un ton engageant et nuancé, en restant réaliste et en soulignant les forces et les défis potentiels de la personne par rapport aux règles et conventions. Voici un exemple de ce que je souhaite obtenir : [Exemple 1 Monsieur Test perçoit les règles, les procédures, et les conventions sociales comme des éléments essentiels au bon fonctionnement de toute organisation ou communauté. Sa nature méthodique et organisée l'amène à valoriser la structure et la rigueur qu'apportent les règles. Pour lui, ces directives ne sont pas simplement des suggestions, mais des cadres nécessaires qui garantissent la qualité, l'ordre, et la prévisibilité dans les interactions et les processus. Il a tendance à suivre les normes établies avec précision, préférant s'appuyer sur des protocoles éprouvés plutôt que de se lancer dans des innovations hasardeuses.\n Bien qu'il soit ouvert à l'idée de nouvelles approches, Monsieur Test croit fermement que toute innovation doit être soigneusement planifiée, structurée, et alignée avec les règles existantes pour être efficace. Son respect pour les conventions sociales est également fort : il considère que les traditions et les normes sociales jouent un rôle clé dans le maintien de l'harmonie et de la stabilité au sein des groupes.\n À noter que certaines personnes pourraient percevoir l'attitude de Monsieur Test comme étant trop rigide ou peu flexible, ce qui pourrait leur sembler inhiber la créativité ou l'adaptabilité. En revanche, Monsieur Test pourrait percevoir ces personnes comme étant trop désorganisées ou insouciantes, ce qui pourrait lui sembler compromettre la qualité et la fiabilité des résultats.\n """

#"Exemple 2 Madame Test perçoit les règles, les procédures, et les conventions sociales comme des cadres souvent trop restrictifs qui peuvent freiner l'innovation, la liberté, et l'expression personnelle. Son désir d'indépendance et sa tendance à privilégier la spontanéité la poussent à voir les règles comme des obstacles plutôt que comme des guides. Elle préfère une approche plus flexible et adaptable, où la créativité et l'initiative personnelle sont mises en avant.\n Pour Madame Test, les conventions sociales ne devraient pas entraver la quête de nouvelles expériences et l'exploration de solutions originales. Elle est prête à remettre en question les normes établies si elle estime qu'elles limitent le potentiel de découverte ou d'amélioration. Elle valorise les environnements où elle peut exprimer ses idées sans être contrainte par des protocoles rigides, et où l'innovation est encouragée plutôt que restreinte.\n À noter que certaines personnes pourraient percevoir l'attitude de Madame Test comme étant trop indépendante ou indifférente aux règles, ce qui pourrait leur sembler déstabilisant ou difficile à gérer. En revanche, Madame Test pourrait percevoir ces personnes comme étant trop rigides ou conformistes, ce qui pourrait lui sembler restreindre leur capacité à innover ou à s'adapter rapidement aux changements.]"

message_data.append( 
  {
    "role": "assistant", 
    "content": amicale_text
  }
)
  
message_data.append(
    {
        "role": "user",
        "content": regles_prompt
    }
)

regles = generateur_texte(message_data, 350)

regles_text = regles.choices[0].message.content



#Section "Perception défis, problèmes et difficultés"

problemes_prompt = """Je souhaite que tu crées une section 'Perception des défis, problèmes et difficultés' dans un **MAXIMUM DE 200 MOTS** qui décrit comment une personne perçoit et gère les défis, les problèmes, et les difficultés, en se basant sur ses réponses du questionnaire DISC de la question précédente et ses caractéristiques personnelles. Le texte doit être en plusieurs paragraphes, décrivant l'attitude générale de la personne face aux défis, en mettant en avant son approche, ses forces, et ses éventuelles zones d'amélioration. Inclut un paragraphe final qui compare sa perception des défis avec une perception opposée. Décris comment la personne voit les défis – les perçoit-elle comme des opportunités d'apprentissage, des obstacles à surmonter, ou des situations stressantes ? Mentionne ses stratégies pour gérer les problèmes, comme l'analyse, la patience, ou la collaboration. Mentionne la manière dont la personne aborde les problèmes, en se basant sur ses réponses concernant l'impulsivité, la méthode, la tolérance au stress, et la collaboration. Aborde aussi ses préférences pour l'analyse ou l'action rapide. Pour la dernière partie du texte, au lieu de mentionner une dominance de couleur, mentionne une perception qui serait opposée à celle de la personne décrite. Par exemple, si la personne est prudente et méthodique, mentionne que d'autres pourraient la percevoir comme trop lente, tandis qu'elle pourrait percevoir ces personnes comme trop impulsives ou agressives. Utilise un ton engageant et nuancé, en restant réaliste et en soulignant les forces et les défis potentiels de la personne. Voici un exemple de ce que je souhaite obtenir : [Exemple 1 Madame Test perçoit les défis, les problèmes, et les difficultés comme des occasions de démontrer son audace, sa créativité, et sa capacité à prendre des décisions rapidement. Elle aborde ces situations avec un esprit entreprenant, préférant l'action immédiate à l'analyse prolongée. Pour elle, chaque obstacle est une chance de prouver son indépendance et de mettre en avant son esprit d'initiative. Elle n'hésite pas à se lancer dans l'inconnu, voyant dans les difficultés une opportunité d'explorer de nouvelles solutions et de repousser les limites établies.\n Son approche est marquée par une volonté de maximiser les expériences positives, même dans les moments difficiles. Madame Test préfère une stratégie proactive, cherchant à surmonter les obstacles avec détermination et en gardant un regard optimiste sur l'issue. Elle valorise les solutions innovantes et n'a pas peur de remettre en question les méthodes traditionnelles si elle pense qu'une approche différente pourrait être plus efficace.\n À noter que certaines personnes pourraient percevoir l'attitude de Madame Test comme étant trop impulsive ou risquée, ce qui pourrait leur sembler précipité ou imprudent. En revanche, Madame Test pourrait percevoir ces personnes comme étant trop prudentes ou lentes à réagir, ce qui pourrait lui sembler freiner la progression et limiter les opportunités d'innovation.\n """

#"Exemple 2 Monsieur Test perçoit les défis, les problèmes, et les difficultés avec une approche analytique et méthodique. Il préfère prendre le temps d'examiner chaque situation en détail, en analysant les données et en évaluant les différentes options avant de prendre une décision. Pour lui, les défis ne sont pas des obstacles insurmontables, mais plutôt des puzzles à résoudre avec rigueur et précision. Cette approche lui permet de trouver des solutions durables et bien pensées, minimisant les risques d'erreurs ou de conséquences imprévues.\n Monsieur Test valorise la stabilité et la sécurité dans la résolution des problèmes. Il s'assure que chaque action prise est bien fondée et alignée avec les normes et procédures établies. Il évite les solutions hâtives et privilégie une planification minutieuse pour garantir que les défis sont gérés de manière efficace et fiable. Bien qu'il soit patient et tolérant face aux situations complexes, sa préférence pour l'analyse approfondie peut parfois le rendre plus lent à réagir, surtout dans des situations nécessitant une action rapide.\n À noter que certaines personnes pourraient percevoir l'attitude de Monsieur Test comme étant trop rigide ou lent à agir, ce qui pourrait leur sembler inhiber la réactivité ou l'innovation. En revanche, Monsieur Test pourrait percevoir ces personnes comme étant trop impulsives ou désorganisées, ce qui pourrait lui sembler compromettre la qualité et la fiabilité des résultats.] Assure-toi que la section finale sur la perception opposée soit constructive et présente un équilibre entre les différentes perspectives."

message_data.append( 
  {
    "role": "assistant", 
    "content": regles_text
  }
)
  
message_data.append(
    {
        "role": "user",
        "content": problemes_prompt
    }
)

problemes = generateur_texte(message_data, 350)

problemes_text = problemes.choices[0].message.content


#Section "Encore un peu plus sur toi"

toi_prompt = f"""Je souhaite que tu crées une section 'Valeurs et motivations' qui décrit les valeurs principales et les motivations d'une personne, en se basant sur ses réponses au questionnaire DISC, ses caractéristiques personnelles, et les réponses aux questions 12 à 16 ainsi que les questions à développement de la fin. Voici le questionnaire :\n {synergia_section_motivation_string} et {synergia_section_dev_string}\n Le texte doit être en plusieurs paragraphes, ***DANS UN MAXIMUM DE 200 MOTS***, mettant en avant les aspects personnels de la personne en montrant comment ses valeurs influencent ses actions et ses décisions dans différents contextes de sa vie. Décris ce que la personne valorise dans sa vie personnelle, sa vie professionnelle, ses loisirs, et ses interactions avec ses proches. Mentionne ce qui motive la personne dans son travail – est-ce l'innovation, l'engagement, la rigueur, ou le désir d'influencer positivement son environnement ? Évoque ce qui est important pour elle. Utilise un ton inspirant et nuancé, qui met en lumière les forces et les motivations de la personne. Voici un exemple de ce que je souhaite obtenir : [Exemple 1 : Madame Test valorise avant tout la liberté et l’indépendance, que ce soit dans sa vie personnelle ou professionnelle. Elle a créé une entreprise d’animations à domicile et de consultations en entreprise, cherchant à inspirer et à influencer positivement son entourage. Son aspiration à long terme est de bâtir un réseau de franchisés qui partagent sa vision, lui permettant de rester alignée, motivée, et fière de son parcours tout en vivant une vie pleine de sens.\n Dans sa vie personnelle, Madame Test se connecte avec elle-même à travers des moments de solitude en faisant du sport, du ménage ou du plein air tout en écoutant des podcasts, ce qui nourrit son besoin de liberté. Elle apprécie également le sport d’équipe, une façon pour elle de créer des connexions intenses tout en prenant soin de son corps. Elle accorde une grande importance à ses moments de qualité avec son conjoint, où le partage et la complicité renforcent leur relation. \n Madame Test est motivée par l’innovation et l’exploration de projets excitants. Elle ne craint pas de prendre des risques et préfère l’action à l’attente, valorisant les expériences positives et l’impact qu’elle peut avoir sur les autres. Sa réussite personnelle, comme avoir pris le temps de réaligner sa vie, reflète son engagement à vivre selon ses propres termes, en étant libre et authentique.\n """

#"Exemple 2 Monsieur Test valorise avant tout la liberté et l’indépendance, cherchant à maximiser le plaisir dans sa vie tout en préservant un équilibre qui lui permet de profiter de sa famille et de sa santé. Il aspire à une carrière qui lui offre la flexibilité nécessaire pour être bien dans sa vie professionnelle tout en savourant ses moments personnels. Ce besoin d’autonomie se reflète dans sa préférence pour des projets excitants et des activités qui stimulent sa curiosité et son désir constant d’apprendre. \n Dans sa vie personnelle, Monsieur Test apprécie les moments de qualité avec sa conjointe, la pratique régulière de sport, et l'importance qu'il accorde à bien manger. Ces activités lui procurent non seulement un sentiment de satisfaction et de bien-être, mais elles contribuent également à sa santé physique et mentale, qu'il considère comme essentielles. Sa fierté d’avoir aidé une athlète à atteindre le niveau NCAA illustre son engagement à soutenir les autres et à perfectionner les talents autour de lui, tout en reflétant sa rigueur et sa passion pour le sport.\n Sur le plan professionnel, il est motivé par la recherche de nouvelles expériences et par l’amélioration continue de ses compétences, même s’il préfère éviter les environnements stressants. Son approche axée sur le plaisir, l’innovation modérée, et la reconnaissance de ses talents uniques le pousse à rechercher des situations qui valorisent ses forces tout en lui offrant une certaine stabilité.].\n Assure-toi que chaque paragraphe donne une vision cohérente et enrichissante des motivations et des valeurs de la personne."

message_data.append( 
  {
    "role": "assistant", 
    "content": problemes_text
  }
)
  
message_data.append(
    {
        "role": "user",
        "content": toi_prompt
    }
)

toi = generateur_texte(message_data, 500)

toi_text = toi.choices[0].message.content


#Section "Valeurs Schwartz"

schwartz_prompt = """Je souhaite que tu identifies les trois principales motivations d'une personne selon le modèle de Schwartz, ***J'AI BESOIN DE SEULEMENT LES TROIS MOTS***, en se basant sur l'ensemble des réponses au questionnaire de la section précédente, avec une attention particulière aux questions 12 à 16 ainsi qu’aux réponses à développement. Analyse les réponses pour repérer les valeurs dominantes en utilisant les dimensions du modèle de Schwartz (ex. hédonisme, stimulation, autonomie, sécurité, etc.). Évalue quelles valeurs ressortent le plus fortement en fonction des réponses. Attribue un score à chaque dimension de Schwartz en fonction des réponses fournies, notamment celles qui reflètent des thèmes comme l'indépendance, la tradition, le plaisir, la sécurité, l'innovation, etc. Sélectionne les trois dimensions avec les scores les plus élevés pour définir les principales motivations. Présente les trois principales motivations identifiées, accompagnées d'une brève description expliquant pourquoi ces motivations sont les plus fortes chez la personne, en se basant sur les réponses spécifiques du questionnaire."""

message_data.append( 
  {
    "role": "assistant", 
    "content": toi_text
  }
)
  
message_data.append(
    {
        "role": "user",
        "content": schwartz_prompt
    }
)

schwartz = generateur_texte(message_data, 400)

schwartz_text = schwartz.choices[0].message.content


#Section Valeur et motivations

valeur_prompt = """Je souhaite que tu identifies et décrives **QUATRES MOTIVATIONS SPÉCIFIQUES** et précises pour une personne, basées sur l'ensemble de ses réponses au questionnaire, en incluant particulièrement les deux dernières questions à développement.***LE TEXTE DOIT ÊTRE D'UN MAXIMUM DE 150 MOTS***. Prends aussi en considération les couleurs de personnalité DISC de la personne. Les motivations doivent refléter ce qui pousse réellement cette personne à agir dans sa vie personnelle et professionnelle. Je veux que tu utilises des déductions et reformulations sans répéter les mots exacts de la personne. (Exemple; , Accomplissement personnel, Reconnaissance sociale,  Croissance personnelle,  Sécurité financière, Liberté d’action, Impact sur les autres,  Plaisir et divertissement, Réussite professionnelle,  Apprentissage continu,  Relations familiales,  Stabilité émotionnelle,  Avoir un objectif clair,  Compétition et défis,  Amélioration de soi,  Innovation et créativité,  Contribution à une cause,  Autonomie et indépendance,  Appartenance à un groupe, Exploration et aventure,  Spiritualité et connexion intérieure). Pour chaque motivation, développe des actions concrètes et inspirantes qui pourraient l'aider à poursuivre ses objectifs. Assure-toi que chaque motivation soit présentée de manière unique et engageante, avec des exemples pratiques et des suggestions spécifiques. Voici un exemple de format que je souhaite obtenir pour une motivation : Exemple 1\n •  Madame Test est motivée par l’innovation et la recherche de projets excitants.\n 🚀 Lancer des Initiatives Innovantes : Propose des idées nouvelles dans ton entreprise et cherche constamment à sortir des sentiers battus. Créer des franchises pour tes animations à domicile peut répondre à ton désir d’expansion et de nouveauté.\n 🧩 Participer à des Conférences sur l’Innovation : Assiste à des événements ou conférences sur les nouvelles tendances dans ton domaine, pour alimenter ta soif de projets excitants et de connaissances actuelles.\n 📝 Brainstorming Créatif : Organise des sessions de brainstorming pour développer des concepts nouveaux, que ce soit pour ton entreprise ou des projets personnels. Cela alimente ton esprit d’innovation tout en explorant des terrains inconnus.\n 🎯 Collaborations avec des Esprits Créatifs : Associe-toi à des personnes ou des équipes qui partagent ta passion pour l’innovation. Les échanges d’idées peuvent inspirer et revitaliser tes projets.\n """

#"Exemple 2\n Monsieur Test est motivé par la structure et l’organisation pour atteindre ses objectifs.\n📅 Planification Stratégique des Activités : Utilise des outils d’organisation, comme des calendriers ou des applications de gestion de projets, pour structurer tes activités et rester sur la bonne voie dans tes engagements.\n🗂️ Établissement de Routines : Crée des routines claires pour t’assurer que les choses se déroulent selon tes attentes, que ce soit dans ton environnement professionnel ou personnel.\n📊 Analyse des Résultats : Prends le temps d’évaluer régulièrement tes résultats pour ajuster tes actions en fonction de ce qui fonctionne ou non, afin de maximiser l’efficacité et les chances de succès.\n🛠️ Optimisation des Procédés : Cherche constamment à améliorer tes méthodes de travail pour gagner en efficacité, en utilisant des techniques d'optimisation et des technologies adaptées. \nAssure-toi que chaque motivation soit précise et alignée avec les traits de personnalité et les aspirations révélées dans le questionnaire, en mettant en avant des actions concrètes et inspirantes."


message_data.append( 
  {
    "role": "assistant", 
    "content": schwartz_text
  }
)
  
message_data.append(
    {
        "role": "user",
        "content": valeur_prompt
    }
)

valeur = generateur_texte(message_data, 500)

valeur_text = valeur.choices[0].message.content



#section Toi et le marché du travail

travail_prompt = """Je souhaite que tu rédiges un texte complet qui décrit le profil professionnel d’une personne, en utilisant ses réponses au questionnaire, ses traits de personnalité DISC, et ses motivations principales. Le texte doit suivre une structure précise et inclure plusieurs paragraphes décrivant différents aspects de sa personnalité et de sa façon de travailler, ***DANS UN MAXIMUM DE 325 MOTS***. Assure-toi d’utiliser un langage fluide, engageant, et de ne pas répéter les mêmes mots ou expressions. Voici la structure à suivre :\n1.	Introduction de la Personne :\nDébute par une description de la nature et des traits de personnalité principaux de la personne, et comment ces caractéristiques influencent sa manière de travailler. Mets en avant ce qui la rend unique dans son approche professionnelle.\n2.	Compétences et Style de Travail :\nPrésente les compétences professionnelles distinctives de la personne et son style de travail. Décris comment ses traits se manifestent concrètement dans son travail, en expliquant ce qui la rend efficace dans son rôle. Inclue des exemples ou scénarios pour illustrer ces compétences.\n3.	Approche en Équipe et Prise de Décision :\nDécris comment la personne contribue à la dynamique d’équipe et à la prise de décision. Mentionne sa manière de collaborer, son style de communication, et comment elle aborde les défis en groupe. Ajoute un aperçu de la gestion des conflits ou des situations délicates pour montrer comment elle réagit en moments critiques.\n4.	Style de Leadership :\nSi la personne est en position de leadership, décris son style de gestion et comment elle est perçue par les autres. Mets en avant ses qualités de leader et la façon dont elle inspire, motive, ou guide son équipe. \n5.	Impact sur l’Équipe :\nConclus en expliquant l’impact de la personne sur ses collègues et sur la dynamique de l’équipe. Mentionne comment elle influence son entourage, crée une dynamique de travail spécifique, et en quoi ses qualités apportent de la valeur. \nAssure-toi que le texte soit équilibré, nuancé, et qu’il donne une vision complète de la personne en montrant à la fois ses forces et ses zones d’amélioration. Il ne doit pas répéter les mêmes caractéristiques fréquemment. Inclue des exemples concrets et explore les aspects relationnels pour offrir un portrait riche et engageant. Voici un exemple de ce que je souhaite obtenir : [Exemple 1 :Madame Test se distingue par sa nature audacieuse et indépendante, qui transparaît dans sa manière de travailler. Elle valorise la liberté d’action et l’autonomie, ce qui lui permet de prendre des initiatives audacieuses et d’aborder les projets avec une grande créativité. Son désir de se démarquer et de créer un impact positif est évident dans chaque aspect de son travail. Son approche professionnelle est marquée par une volonté constante de repousser les limites, tant pour elle-même que pour son équipe.\nSur le plan professionnel, Madame Test se révèle particulièrement efficace dans des contextes où l’innovation est encouragée. Elle excelle à transformer des idées novatrices en actions concrètes, notamment lors de la création d’animations à domicile ou dans des projets qui demandent une touche personnelle. Son style de travail est dynamique et énergique : elle aime explorer de nouvelles voies et se lance sans hésiter dans des initiatives non conventionnelles. Par exemple, lorsqu'elle initie un projet, elle s’assure que chaque détail reflète son sens de l’originalité et de la nouveauté, apportant ainsi une dimension unique à ses réalisations.\nDans une équipe, Madame Test adopte une approche directe et proactive, contribuant à la prise de décision avec assurance. Elle n’hésite pas à exprimer ses idées et à encourager les autres à sortir de leur zone de confort. Sa capacité à gérer des situations délicates avec un mélange d’audace et de réflexion rapide lui permet de naviguer efficacement dans les moments critiques. Elle sait mobiliser son équipe en utilisant son enthousiasme contagieux, même si son style peut parfois dérouter ceux qui préfèrent une approche plus structurée et méthodique.\nEn tant que leader, Madame Test inspire par sa détermination et son esprit d’initiative. Elle est perçue comme une figure motivante, toujours prête à explorer de nouvelles stratégies et à encourager son équipe à faire de même. Sa capacité à diriger avec confiance tout en laissant de la place à l’innovation en fait une leader qui se démarque par son approche visionnaire. Elle sait guider son équipe avec un équilibre entre indépendance et engagement, créant un environnement où chacun se sent libre de contribuer.\nL’impact de Madame Test sur son entourage est marqué par sa capacité à insuffler une dynamique positive et stimulante. Elle influence ses collègues par son énergie et sa passion pour l’innovation, poussant l’équipe à se dépasser et à embrasser le changement avec enthousiasme. Ses qualités font d’elle une alliée précieuse, capable de transformer la dynamique de travail en un espace où les idées audacieuses et les approches non conventionnelles sont non seulement acceptées, mais encouragées.\n."""

#"Exemple 2 : Monsieur Test se distingue par sa rigueur et son approche méthodique, qui font de lui un professionnel fiable et structuré. Sa personnalité analytique et son besoin de précision se manifestent dans chaque aspect de son travail, lui permettant de naviguer efficacement dans des environnements où l'ordre et l'organisation sont primordiaux. Sa capacité à analyser les situations en profondeur et à anticiper les défis fait de lui un collaborateur particulièrement précieux.\nSur le plan professionnel, Monsieur Test se démarque par ses compétences en planification et en gestion de projets complexes. Il excelle lorsqu'il s'agit d'établir des processus clairs et de suivre des procédures établies, assurant ainsi une exécution précise et sans faille. Lorsqu'il est confronté à des tâches complexes, il applique une approche méthodique, en prenant le temps de décomposer les problèmes et d'élaborer des solutions bien pensées. Son attention aux détails et sa capacité à suivre des normes élevées garantissent que chaque projet est mené à bien avec une grande qualité.\nDans le travail d'équipe, Monsieur Test adopte une approche réfléchie et posée. Il est connu pour sa capacité à structurer les responsabilités et à établir des attentes claires, ce qui aide son équipe à rester concentrée sur les objectifs. Lorsqu'il s'agit de prendre des décisions, il préfère s'appuyer sur des données concrètes et une analyse minutieuse, plutôt que de se précipiter. Sa manière de gérer les conflits est marquée par la prudence ; il cherche à éviter les tensions en favorisant une communication basée sur les faits et la logique.\nEn tant que leader, Monsieur Test inspire par son calme et sa capacité à garder le contrôle, même dans des situations stressantes. Il est perçu comme un leader prudent, fiable et toujours soucieux de maintenir des standards élevés. Son approche structurée et son souci du détail lui permettent de guider son équipe avec assurance, tout en s'assurant que chaque membre comprend clairement ses responsabilités. Cette attitude crée un environnement où la discipline et la rigueur sont valorisées.\nL’impact de Monsieur Test sur ses collègues se traduit par une stabilité et une sécurité accrue au sein de l’équipe. Il influence son entourage par son engagement envers la qualité et sa capacité à offrir une vision claire et structurée. Sa présence rassurante et son sens de l’organisation apportent une dynamique de travail où chacun sait ce qu'il a à faire, renforçant ainsi la confiance collective et l’efficacité des projets menés en groupe. ]"

message_data.append( 
  {
    "role": "assistant", 
    "content": valeur_text
  }
)
  
message_data.append(
    {
        "role": "user",
        "content": travail_prompt
    }
)

travail = generateur_texte(message_data, 750)

travail_text = travail.choices[0].message.content

#Section Environnements de travail favorable

environnement_prompt = """Je souhaite que tu rédiges un texte complet qui décrit l'environnement de travail favorable pour une personne, en se basant sur ses réponses au questionnaire, ses traits de personnalité DISC, et ses motivations principales, ***DANS UN MAXIMUM DE 300 MOTS***. Ne prends pas en compte les réponses aux questions à développement. Le texte doit suivre une structure précise, incluant plusieurs paragraphes qui décrivent les conditions de travail optimales pour cette personne, ainsi que les environnements les moins favorables et les raisons pour lesquelles ils sont moins adaptés. Assure-toi de développer pourquoi certains environnements sont positifs pour la personne et pourquoi d'autres ne le sont pas. Intègre également une section qui décrit ses préférences en matière de contacts sociaux, en précisant si ces interactions lui donnent de l’énergie ou la drainent, afin de refléter son niveau d’extraversion ou d’intraversion. Utilise un langage fluide, engageant, et évite de répéter les mêmes mots ou expressions. Voici la structure à suivre :\n1.	Introduction :\nDébute en expliquant dans quel type d'environnement la personne s’épanouit le mieux. Mentionne les caractéristiques principales de l’environnement qui lui permettent de se sentir à l’aise et de performer, en lien avec ses traits de personnalité.\n2.	Culture d'entreprise et style de travail :\nDécris les éléments de la culture d’entreprise qui sont les plus compatibles avec la personne, comme l'innovation, la prise de risque, ou la collaboration. Précise ce qui lui permet d'exprimer ses forces et de s’engager pleinement dans son travail, en élaborant sur les raisons pour lesquelles ces éléments sont positifs pour elle.\n3.	Préférences en Matière de Contacts Sociaux :\nMentionne si la personne préfère des interactions sociales fréquentes ou si elle privilégie des échanges plus authentiques et de qualité. Précise si ces interactions lui donnent de l’énergie ou la drainent, afin de déterminer son niveau d’extraversion ou d’intraversion. Explique comment ces préférences influencent son environnement de travail idéal.\n4.	Rôle et contribution :\nExplique comment la personne se comporte dans cet environnement et comment elle utilise ses compétences pour apporter de la valeur. Mentionne sa façon de contribuer à l’équipe ou au projet, et comment l’environnement lui permet de mettre en avant son leadership ou ses capacités spécifiques.\n5.	Environnements Moins Favorables :\nAjoute une section sur les types d’environnements qui conviennent le moins à la personne. Explique pourquoi ces environnements sont moins favorables, en lien avec ses traits de personnalité et ses préférences, et comment cela peut affecter sa performance ou son bien-être. Développe sur les aspects spécifiques qui rendent ces environnements difficiles pour elle.\n6.	Conclusion :\nConclus en résumant ce qui rend cet environnement idéal pour la personne, en soulignant comment cela maximise son potentiel et son épanouissement professionnel, tout en notant l'importance d'éviter les environnements moins adaptés.\nAssure-toi que le texte reflète fidèlement la personnalité et les préférences de la personne, en montrant clairement comment un environnement de travail spécifique peut l’aider à s’épanouir, et pourquoi d'autres environnements pourraient nuire à sa performance. Utilise des phrases positives et engageantes pour créer un portrait motivant et précis de son environnement de travail idéal et moins idéal. Voici un exemple de ce que je souhaite obtenir : \n: [Exemple 1 Monsieur Test s’épanouit dans un environnement de travail structuré et méthodique, où l’organisation, la stabilité et les normes élevées sont valorisées. Il excelle dans des contextes où les processus clairs et les règles définies permettent une gestion précise et ordonnée des projets. Ces environnements lui offrent un cadre sécurisant, lui permettant de se concentrer sur l’atteinte de l’excellence et la production de résultats de haute qualité. Le respect des procédures et la cohérence dans les pratiques lui permettent de minimiser les risques et de garantir un travail impeccable, aligné avec ses standards élevés.\nMonsieur Test apprécie particulièrement les cultures d'entreprise qui valorisent la planification, la précision, et le respect des protocoles établis. Ces contextes sont positifs pour lui car ils répondent à son besoin de clarté et de rigueur, lui offrant la stabilité nécessaire pour performer à son meilleur. La structure et l'organisation de ces environnements lui permettent de canaliser son souci du détail et sa capacité à analyser les données de manière approfondie, contribuant ainsi de manière efficace à l'atteinte des objectifs communs.\nEn matière de contacts sociaux, Monsieur Test préfère des interactions qui sont ciblées et pertinentes, plutôt que des échanges sociaux fréquents ou superficiels. Les contacts constants et les interactions trop nombreuses peuvent le drainer, affectant sa concentration et son efficacité. Il se sent plus énergisé lorsqu'il peut travailler de manière autonome ou dans des environnements où les échanges sont constructifs et limités à ce qui est nécessaire pour avancer dans les projets. Cela reflète une tendance plus introvertie, où les échanges de qualité priment sur la quantité.\nEn revanche, Monsieur Test est moins à l’aise dans des environnements trop dynamiques, imprévisibles, ou désorganisés, où les règles sont floues et les structures peu respectées. Les cultures d’entreprise qui favorisent l’improvisation, le changement constant, ou une approche trop flexible peuvent créer du stress et réduire son efficacité. Ces environnements peuvent affecter son bien-être car ils manquent de la clarté et de la stabilité dont il a besoin pour se sentir en contrôle et motivé.\nEn résumé, Monsieur Test s’épanouit dans des environnements de travail ordonnés et bien structurés, où ses compétences méthodiques et analytiques peuvent briller. Les environnements trop chaotiques ou axés sur l’improvisation risquent de nuire à son engagement et à sa performance, limitant ainsi sa capacité à apporter une contribution optimale à son équipe et à son organisation.\n"""

#"Exemple 2 : Madame Test s’épanouit dans un environnement de travail qui valorise l’indépendance, l’innovation et la flexibilité. Elle excelle dans des contextes où elle peut exercer sa créativité et prendre des initiatives audacieuses sans être entravée par des structures rigides. Les environnements dynamiques qui encouragent l’expérimentation et la prise de risque répondent parfaitement à son besoin de liberté et d’autonomie. Ces milieux lui permettent d’exprimer pleinement son potentiel en proposant des idées nouvelles et en explorant des approches non conventionnelles, ce qui nourrit son désir de se démarquer.\nElle préfère les cultures d'entreprise qui favorisent la liberté d’action et l’adaptabilité, car elles lui offrent l’espace nécessaire pour maximiser ses forces. Dans de tels environnements, Madame Test se sent motivée et engagée, car elle peut naviguer entre différentes initiatives avec souplesse et agilité. L'absence de contraintes rigides lui permet d’optimiser ses compétences en leadership, inspirant son entourage à adopter une vision plus audacieuse et à sortir des sentiers battus.\nEn matière de contacts sociaux, Madame Test apprécie les interactions authentiques et stimulantes plutôt que de nombreuses relations superficielles. Elle est énergisée par des échanges de qualité qui lui permettent de partager ses idées et de se connecter profondément avec ses collègues. Ce type de dynamique sociale lui permet de maintenir son enthousiasme et sa créativité, car elle se sent soutenue et valorisée. Cependant, des interactions trop fréquentes ou superficielles peuvent la drainer, car elles ne nourrissent pas son besoin de connexions significatives.\nÀ l’inverse, Madame Test est moins à l’aise dans des environnements de travail très structurés ou conservateurs, où les normes strictes limitent l’innovation et la prise d’initiative. Les cultures d’entreprise rigides, où la hiérarchie est prédominante et où les idées nouvelles sont rarement accueillies, ne conviennent pas à son style de travail. Ces contextes peuvent brider sa créativité et limiter son engagement, car elle se sent contrainte dans sa capacité à proposer des solutions innovantes et à influencer positivement son environnement.\nEn résumé, Madame Test prospère dans des environnements de travail dynamiques et ouverts, qui valorisent l’autonomie, l’innovation, et les interactions sociales significatives. En revanche, les environnements trop rigides ou socialement superficiels peuvent freiner son enthousiasme et son impact, limitant ainsi son potentiel de contribution créative et audacieuse. ]."

message_data.append( 
  {
    "role": "assistant", 
    "content": travail_text
  }
)
  
message_data.append(
    {
        "role": "user",
        "content": environnement_prompt
    }
)

environnement = generateur_texte(message_data, 650)

environnement_text = environnement.choices[0].message.content



#Section Exemples d’environnements de travail favorables

ex_env_prompt = """Je souhaite que tu rédiges une section qui présente des environnements de travail favorables pour une personne, en se basant sur l'entièreté de ses réponses au questionnaire et ses traits de personnalité DISC, ***DANS UN MAXIMUM DE 200 MOTS***. Propose des suggestions qui sont en lien avec ce qu'elle fait actuellement, mais inclut également des suggestions d'environnements qui pourraient lui convenir parfaitement selon ses réponses. Utilise un ton positif et engageant, et présente chaque suggestion de manière claire avec une phrase d'introduction suivie d'une explication précise du pourquoi cet environnement est favorable à la personne. Utilise des icônes pertinentes pour chaque suggestion pour rendre le texte plus visuel et attrayant. Voici la structure à suivre :\n1.	Présente l'environnement avec un titre et une icône :\nDonne un titre à chaque environnement de travail proposé avec une icône pertinente, comme : “Administration et Support Organisationnel 🏢”.\n2.	Décris pourquoi cet environnement convient :\nPour chaque suggestion, explique brièvement pourquoi cet environnement est favorable à la personne, en reliant cette explication à ses compétences, traits de personnalité, et préférences indiquées dans le questionnaire.\n3.	Inclut des exemples concrets ou des tâches typiques :\nMentionne des tâches spécifiques ou des aspects de l’environnement qui exploitent les forces et les compétences de la personne.\n4.	Assure-toi d’inclure des suggestions variées :\nInclut à la fois des environnements en lien avec ce qu’elle fait actuellement et d’autres qui pourraient être de bonnes options selon ses réponses, même si elles ne sont pas directement liées à son parcours actuel.\nAssure-toi que le texte soit concis, clair, et montre des possibilités de carrière ou d’environnements de travail dans lesquels la personne pourrait s’épanouir et utiliser ses forces au maximum. Voici un exemple de ce que je souhaite obtenir : [Exemple 1 : Entrepreneuriat et Création de Projets Innovants 🚀\nMadame Test excelle dans des environnements où l’innovation, l’indépendance, et la prise de risque sont au cœur des activités. En tant qu'entrepreneure, elle peut exploiter sa créativité et sa passion pour les nouvelles idées, tout en jouissant d'une grande liberté d’action. Ce cadre lui permet de prendre des décisions audacieuses et de mener des projets qui sortent des sentiers battus, alignés avec son besoin de liberté et d'autonomie.\nConsultation et Coaching en Développement Personnel 🧠\nAvec sa capacité à motiver et à influencer positivement les autres, Madame Test serait idéale pour des rôles en consultation ou en coaching. Ces environnements favorisent la communication directe, l'impact positif, et l’innovation, répondant parfaitement à son désir de faire une différence tout en travaillant de manière indépendante. Son enthousiasme et son approche inspirante peuvent transformer les expériences des personnes qu’elle accompagne.\nÉvénementiel et Organisation d’Animations à Domicile 🎉\nMadame Test se sentirait à l’aise dans des rôles qui impliquent la création d'événements et l'animation, où elle peut maximiser les expériences positives pour les participants. Son esprit innovateur et son désir de sortir des conventions s’alignent avec des activités dynamiques et créatives qui lui permettent de partager ses idées tout en interagissant avec les autres dans des contextes stimulants et sociaux.\nMarketing Créatif et Publicité 📣\nSon goût pour l'originalité et sa capacité à penser hors des sentiers battus rendent Madame Test particulièrement adaptée aux environnements de marketing créatif et de publicité. Elle peut y exploiter son sens de l’innovation, son esprit d’indépendance, et sa volonté de prendre des risques calculés pour créer des campagnes qui se démarquent et captent l’attention du public.\nRôle de Leadership dans Startups ou PME 💡\nMadame Test pourrait également exceller dans des rôles de leadership au sein de startups ou de PME, où la flexibilité et l'innovation sont valorisées. Ces environnements lui permettent de diriger des équipes avec audace et de mettre en place des stratégies novatrices tout en influençant directement la direction de l'entreprise. Sa capacité à inspirer et à motiver les autres serait un atout majeur dans ce type de contexte.\n"""

#"Exemple 2  Analyse de Données et Gestion de Processus 📊\nMonsieur Test excelle dans des environnements où l’analyse de données, la précision et la rigueur sont essentielles. Des rôles impliquant la gestion de processus et l'analyse des performances lui permettent de mettre à profit ses compétences méthodiques et son attention aux détails. Ces environnements structurés lui offrent la stabilité et la clarté nécessaires pour s’épanouir professionnellement.\nQualité et Contrôle des Standards 🔍\nLes environnements axés sur le contrôle qualité et la gestion des standards sont parfaitement adaptés à Monsieur Test. Il se sentirait à l’aise dans des rôles où il peut appliquer ses compétences en vérification et assurer que les normes sont respectées. Ces positions lui permettent de contribuer de manière significative en garantissant la fiabilité et l’exactitude des opérations au sein de l’organisation.\nGestion de Projets Techniques et Logistiques 🚧\nAvec son approche méthodique et son sens de l’organisation, Monsieur Test pourrait trouver satisfaction dans des rôles de gestion de projets techniques ou logistiques. Ces environnements structurés nécessitent une planification rigoureuse, le suivi des processus, et une gestion précise des ressources, des domaines où Monsieur Test excelle.\nComptabilité, Finance et Audit 💼\nMonsieur Test est bien adapté à des rôles en comptabilité, finance, ou audit, où sa capacité à travailler de manière structurée et son attention aux détails sont des atouts. Ces environnements requièrent une rigueur constante et un respect des procédures, correspondant parfaitement à son style de travail méthodique et précis.\nSupport Administratif et Organisationnel 🏢\nLes rôles en support administratif et organisationnel conviennent également à Monsieur Test, en raison de son approche ordonnée et de sa capacité à gérer des tâches complexes avec précision. Ces environnements lui offrent la possibilité de contribuer à la coordination des opérations internes, en assurant que chaque détail est pris en compte et géré efficacement.]."

message_data.append( 
  {
    "role": "assistant", 
    "content": environnement_text
  }
)
  
message_data.append(
    {
        "role": "user",
        "content": ex_env_prompt
    }
)

ex_env = generateur_texte(message_data, 350)

ex_env_text = ex_env.choices[0].message.content

#Section Tes couleurs en couple

couple_prompt = f"""Je souhaite que tu rédiges un texte ***D'UN MAXIMUM DE 200 MOTS*** qui décrit le profil de la personne dans sa relation de couple, en utilisant spécifiquement ces réponses :\n {synergia_section_couple_string}\n Pour chaque couleur (rouge, jaune, vert, bleu), mets en avant les points forts basés sur les réponses spécifiques données aux questions de cette section et mentionne aussi les aspects moins présents ou absents pour chaque couleur. Je veux que tu accordes à chaque énoncé une couleur pour t'aider à calculer le résultat, et que tu donnes un % calculé en fonction de donner une pondération à chaque énoncé. N’utilise pas de pourcentages mais qualifie les scores comme "fort", "modéré" ou "faible" selon les réponses. Voici comment structurer le texte :\n1.	Jaune (Influence) : Décris les forces telles que la convivialité, la sociabilité, et l'engagement émotionnel si le score est élevé. Si la couleur est moins présente, mentionne le manque de dynamisme social ou d'influence, indiquant une préférence pour d'autres types d'interactions.\n2.	Rouge (Dominance) : Mets en avant la prise d'initiative et la proactivité si le score est fort, expliquant comment la personne prend les devants dans la relation. Si le score est faible, note l'absence de traits dominants ou assertifs, avec une tendance à privilégier les décisions partagées ou la collaboration plutôt que le contrôle.\n3.	Vert (Stabilité) : Décris les points forts liés à la stabilité émotionnelle, à l'écoute et à la création d’un environnement serein si le score est élevé. Si cette couleur est moins présente, mentionne une tendance à moins rechercher l’harmonie ou la stabilité émotionnelle.\n4.	Bleu (Conformité) : Souligne les forces analytiques et la précision dans la communication si le score est élevé, en mettant en avant l'importance de la clarté et de la réflexion dans les échanges. Si le score est faible, note l’absence de structure ou de rigueur dans la communication, avec une préférence pour des approches moins formelles.\nAssure-toi que le texte soit équilibré, nuancé, et donne une vision complète de la dynamique de la personne en couple. Utilise un langage engageant et précis, en montrant à la fois ce qui est présent et ce qui manque dans chaque trait DISC."\n(Exemple 1 : Jaune (Influence) : Modéré\nMadame Test montre une influence modérée en matière de convivialité et d’engagement social dans sa relation de couple. Elle privilégie les discussions dynamiques et communicatives, mettant l’accent sur la clarté et l’échange. Cependant, ses interactions ne sont pas toujours axées sur la spontanéité ou l’exubérance sociale, ce qui montre qu’elle préfère des moments de connexion réfléchis et ciblés plutôt que des échanges trop fréquents ou légers.\nRouge (Dominance) : Fort\nMadame Test affiche un score fort en rouge, ce qui se traduit par une prise d’initiative marquée et une volonté de s’exprimer clairement dans la relation. Elle n’hésite pas à communiquer ses attentes de manière directe et à prendre des décisions rapidement lorsqu’il le faut. Cette approche proactive montre son désir de mener et d’influencer activement les dynamiques de son couple, tout en restant ouverte à la collaboration.\nVert (Stabilité) : Modéré\nSon score modéré en vert indique une appréciation pour l’harmonie et la stabilité émotionnelle, mais ce n’est pas sa priorité principale. Madame Test veille à maintenir un environnement relativement calme et serein, mais elle n’est pas exclusivement focalisée sur le maintien constant de l’harmonie. Elle est capable d’écouter et de soutenir son partenaire, mais sans nécessairement éviter les confrontations si elles s’avèrent nécessaires pour avancer.\nBleu (Conformité) : Fort\nMadame Test montre une forte affinité pour la réflexion et l’analyse dans ses interactions. Elle s’assure que ses attentes sont bien comprises en les expliquant en détail, ce qui souligne son besoin de précision et de clarté dans la communication. Cependant, elle n’adopte pas toujours une approche structurée ou formelle, indiquant une préférence pour une certaine flexibilité tout en gardant un œil sur les détails importants.\n"""

#"Exemple 2 : Jaune (Influence) : Faible\nMonsieur Test présente un score faible en jaune, indiquant une moindre orientation vers les interactions sociales et l’exubérance émotionnelle dans sa relation. Il ne cherche pas particulièrement à être le moteur dynamique ou communicatif du couple, préférant des interactions plus calmes et réfléchies. Les moments d’énergie et de spontanéité ne sont pas sa priorité, ce qui montre une préférence pour des échanges plus mesurés.\nRouge (Dominance) : Modéré\nAvec un score modéré en rouge, Monsieur Test prend des initiatives et montre une certaine proactivité, mais sans imposer ses décisions de manière dominante. Il est capable de prendre les devants lorsque nécessaire, mais préfère généralement des discussions où les décisions sont prises de façon concertée. Sa tendance à initier reste présente, mais sans être trop assertive, ce qui favorise une dynamique plus équilibrée.\nVert (Stabilité) : Fort\nMonsieur Test obtient un score fort en vert, indiquant une grande valorisation de l’harmonie et de la stabilité émotionnelle. Il privilégie un environnement calme et serein, cherchant à maintenir l’harmonie dans le couple. Son approche est axée sur l’écoute, le soutien et la patience, ce qui en fait un partenaire apaisant qui veille à ce que les tensions soient minimisées et les échanges restent sereins.\nBleu (Conformité) : Fort\nAvec un score fort en bleu, Monsieur Test adopte une approche analytique et réfléchie dans sa relation. Il communique de manière claire et détaillée, assurant que ses attentes sont bien comprises. Il valorise la précision et la structure dans les échanges, et préfère que les décisions soient prises après une analyse minutieuse des situations. Sa tendance à éviter les impulsivités et à privilégier une approche méthodique renforce le caractère stable et réfléchi de ses interactions.) "

message_data.append( 
  {
    "role": "assistant", 
    "content": ex_env_text
  }
)
  
message_data.append(
    {
        "role": "user",
        "content": couple_prompt
    }
)

couple = generateur_texte(message_data, 500)

couple_text = couple.choices[0].message.content



#Section Portrait

portrait_prompt = """Je souhaite que tu rédiges un texte ***D'UN MAXIMUM DE 200 MOTS*** qui décrit le profil de la personne dans sa relation de couple, en utilisant uniquement les informations de la section couple du questionnaire DISC de la section précédente. On ne sait pas si la personne à un ou une partenaire alors on va faire un texte inclusif. Le texte doit détailler les forces de la personne en tant que partenaire, en mettant en avant son style de communication, son approche au soutien émotionnel, et la manière dont elle aborde les objectifs communs et les projets futurs. Voici les éléments à inclure :\n1.	Introduction sur la Personne : Débute par une description des principaux traits de personnalité en couple, tels que la préférence pour la structure, la stabilité ou la spontanéité, selon les réponses.\n2.	Style de Communication : Explique comment la personne communique ses attentes et assure une compréhension claire entre les partenaires. Mentionne si elle privilégie une communication détaillée, directe ou émotionnelle.\n3.	Approche au Soutien Émotionnel : Décris la manière dont la personne offre du soutien à son partenaire, en mettant en avant son écoute, ses conseils réfléchis, ou ses solutions pratiques.\n4.	Stabilité Émotionnelle et Harmonie : Mentionne l'importance qu'elle accorde à la stabilité émotionnelle et à la sérénité dans la relation, et comment cela contribue à un environnement paisible.\n5.	Objectifs Communs et Personnels : Parle de l'importance des objectifs partagés et de la manière dont la personne s'engage à les atteindre en collaboration avec son partenaire.\n6.	Joie et Spontanéité : Décris comment la personne apporte de la joie et de la légèreté au quotidien, et en quoi son style unique rend chaque journée spéciale.\n7.	Approche des Projets Futurs : Explique comment la personne aborde les discussions sur les projets futurs, si elle préfère planifier, discuter spontanément ou réfléchir calmement aux décisions importantes.\nAssure-toi que le texte soit fluide, nuancé, et qu'il donne une vision complète de la personne en couple, en combinant organisation, soutien émotionnel et joie de vivre." \n(exemple1 :  Monsieur Test est un partenaire qui valorise l’harmonie, l’écoute et une approche réfléchie dans sa relation de couple. En tant que pacificateur, il veille à maintenir un environnement serein, évitant les conflits et favorisant une communication calme et posée. Sa manière de communiquer est détaillée et réfléchie, préférant expliquer ses attentes clairement pour éviter tout malentendu. Cette approche structurée aide à renforcer la compréhension mutuelle et à créer un climat de confiance dans la relation.\nMonsieur Test est également un soutien précieux pour son partenaire. Il écoute avec attention et apporte des conseils réfléchis, montrant un engagement profond envers le bien-être de l’autre. Sa capacité à maintenir la stabilité émotionnelle est un atout majeur dans son couple, car il crée un espace où chacun peut s’exprimer librement tout en se sentant soutenu. Cette attention aux besoins émotionnels permet de construire une relation fondée sur le respect mutuel et la compréhension.\nIl accorde une grande importance aux expériences partagées, apportant une énergie positive et une volonté de créer des moments agréables. Monsieur Test privilégie les discussions ouvertes et spontanées sur les projets futurs, tout en prenant le temps de réfléchir calmement aux décisions importantes. Sa capacité à maintenir l’équilibre entre réflexion et spontanéité permet de naviguer sereinement à travers les décisions communes.\nBien qu’il préfère les discussions posées, Monsieur Test ne fuit pas les confrontations lorsqu’elles sont nécessaires. Il aborde les défis avec une approche analytique, cherchant toujours à comprendre les situations avant d’agir. En résumé, Monsieur Test est un partenaire attentionné et réfléchi, qui combine harmonie, soutien émotionnel et une approche équilibrée dans sa vie de couple.\n"""

#"Exemple 2 : Madame Test est une partenaire dynamique et communicative, qui apporte une énergie positive et un sens de la spontanéité à sa relation de couple. Elle privilégie des échanges clairs et directs, n'hésitant pas à exprimer ses attentes de manière détaillée pour assurer une compréhension mutuelle. Cette transparence dans la communication aide à renforcer les liens et à éviter les malentendus, créant un climat de confiance et d’ouverture.\nEn tant que soutien, Madame Test se distingue par sa capacité à écouter attentivement et à offrir des conseils réfléchis. Elle encourage son partenaire à s’exprimer et partage des solutions pratiques et bien pensées pour les aider à surmonter ensemble les défis. Son approche est marquée par un souci constant d’équilibrer les émotions et de maintenir un environnement serein, tout en restant ouverte aux discussions profondes et constructives.\nL’accomplissement des objectifs, qu'ils soient personnels ou communs, est essentiel pour Madame Test. Elle aime travailler main dans la main avec son partenaire pour atteindre des buts partagés, ce qui renforce leur connexion et apporte un sentiment d’accomplissement mutuel. Sa volonté de prendre des initiatives et d'apporter des solutions efficaces témoigne de son engagement actif dans la relation.\nMadame Test apporte également une touche de joie et de légèreté au quotidien. Elle sait rendre chaque journée spéciale et pleine de rires, créant des moments précieux et inoubliables qui enrichissent la relation. Elle aborde les discussions sur les projets futurs avec enthousiasme, aimant rêver et planifier spontanément tout en restant ouverte à ajuster les décisions au besoin.\nEn somme, Madame Test est une partenaire communicative, réfléchie et engagée, qui allie structure, soutien émotionnel et joie de vivre pour créer une relation épanouie et harmonieuse.)"

message_data.append( 
  {
    "role": "assistant", 
    "content": couple_text
  }
)
  
message_data.append(
    {
        "role": "user",
        "content": portrait_prompt
    }
)

portrait = generateur_texte(message_data, 500)

portrait_text = portrait.choices[0].message.content



#Print la totalité des textes

full_text= "EN BREF\n" + bref_text + "\n\n" + "Tes forces mises en lumière\n" + forces_text + "\n\n" + "Tes défis Potentiels\n" + defis_text + "\n\n" + "Perception du changement\n" + changements_text + "\n\n" + "Perception des relations amicales\n" + amicale_text + "\n\n" + "Perception des règles et convention sociales\n" + regles_text + "\n\n" + "Perception des défis, problèmes et difficultés\n" + problemes_text + "\n\n" + "Encore un peu plus sur toi\n" + toi_text + "\n\n" + "Valeurs Schwartz\n" + schwartz_text + "\n\n" + "Valeur et motivation\n" + valeur_text + "\n\n" + "Toi et le marché du travail\n" + travail_text + "\n\n" + "Environnement de travail favorable\n" + environnement_text + "\n\n" + "Exemples d’environnements de travail favorables\n" + ex_env_text + "\n\n" + "Tes couleurs en couple\n" + couple_text + "\n\n" + "Ton portrait\n" + portrait_text



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

nouveau_dossier = f"C:/Users/Guillaume Cloutier/OneDrive/Synergia/{nom_organisateur}/{nom}"

if not os.path.exists(nouveau_dossier):
    os.makedirs(nouveau_dossier)

# Générer le fichier Word
generate_simple_word(f"{nouveau_dossier}/{nom}", full_text)
    

