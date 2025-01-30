import psycopg2
from dotenv import load_dotenv
import os

load_dotenv()

def update_database (nom_profile, motivation_text, bref_text, forces_text, defis_text, changements_text, interpersonnelles_text, structure_text, problemes_text, arch1_nom, arch2_nom, desc_arch1_text, desc_arch2_text, travail_text, adapte_rouge_text, adapte_bleu_text, adapte_vert_text, adapte_jaune_text, bleu, rouge, jaune, vert, explorateur, protecteur, bouffon, souverain, magicien, createur, hero, citoyen, sage, amoureuse, rebelle, optimiste , email, nom_leader) :
    
    conn = psycopg2.connect(
    dbname= os.getenv("DB_RENDER_DATABASE"),
    user= os.getenv("DB_RENDER_USER"),
    password= os.getenv("DB_RENDER_PASSWORD"),
    host= os.getenv("DB_RENDER_HOST")
)
    cursor = conn.cursor()
    
    print("starting update to database")
    
    cursor.execute("INSERT INTO leader (nom_leader) VALUES (%s) ON CONFLICT (nom_leader) DO UPDATE SET nom_leader = EXCLUDED.nom_leader RETURNING ID", (nom_leader,))
    leader_id = cursor.fetchone()[0]
    
    cursor.execute(
        """WITH ins AS (
            INSERT INTO client (nom_client, email, leader_id)
            VALUES (%s, %s, %s) 
            ON CONFLICT (nom_client, email) DO UPDATE SET nom_client = EXCLUDED.nom_client
            RETURNING id
        ) 
        SELECT id FROM ins 
        UNION ALL 
        SELECT id FROM client WHERE nom_client = %s AND email = %s;""", (nom_profile, email, leader_id, nom_profile, email)
    )
    client_id = cursor.fetchone()[0]
        


    # Insérer les données dans la table
    cursor.execute(
        "INSERT INTO profile (client_id, nomclient, email , enbref,  forcesenlumieres, defispotentiels, perceptionchangement, relationsinterpersonnelles, perceptionstructure, perceptionproblemes, archnum1, archnum2, textarch1, textarch2, toitravail, adapterouge, adaptebleu, adaptevert, adaptejaune, bleu, rouge, jaune, vert, explorateur, protecteur, bouffon, souverain, magicien, createur, hero, citoyen, sage, amoureuse, rebelle, optimiste, motivationsnaturelles ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s) RETURNING id",
        (client_id, nom_profile, email, bref_text, forces_text, defis_text, changements_text, interpersonnelles_text, structure_text, problemes_text, arch1_nom, arch2_nom, desc_arch1_text, desc_arch2_text, travail_text, adapte_rouge_text, adapte_bleu_text, adapte_vert_text, adapte_jaune_text, bleu, rouge, jaune, vert, explorateur, protecteur, bouffon, souverain, magicien, createur, hero, citoyen, sage, amoureuse, rebelle, optimiste, motivation_text )
    )
    profile_id = cursor.fetchone()[0]
    
    cursor.execute("INSERT INTO client_profile (client_id, profile_id) VALUES (%s, %s)", (client_id, profile_id))
    
    cursor.execute("""
        UPDATE client
        SET profile_id = %s
        WHERE id = %s
        """, (profile_id, client_id))
    

    # Valider les changements et fermer la connexion
    conn.commit()
    cursor.close()
    conn.close()


nom_profile= "Catherine Lavoie"
motivation_text= """Catherine est profondément motivée par la quête de nouvelles idées et la capacité à inspirer le changement positif. Elle cherche à créer un impact significatif avec sa Radieuse Académie, abordant le bien-être féminin avec authenticité et compassion. Guidée par l'humour et des connexions émotionnelles profondes, elle valorise les moments de partage et d'inspiration, transformant chaque interaction en une occasion d'enrichissement mutuel. Sa détermination à surmonter les défis et à évoluer vers une autonomie accomplie illustre son courage et sa résilience. Catherine est animée par un désir de découverte, tant dans le monde qu'en elle-même, en s'efforçant de bâtir un avenir lumineux et harmonieux.
"""
bref_text= """Catherine est une personne chaleureuse et amusante, animée par une audace qui se manifeste dans sa manière d'aborder les défis. Son caractère résolument positif et bienveillant en fait une influence radieuse dans son entourage. Elle est à l'aise pour se lancer dans l'inconnu avec confiance, cherchant à vivre des expériences nouvelles et stimulantes tout en partageant son enthousiasme contagieux. Bien qu'elle ne soit pas particulièrement méthodique ou organisée, sa capacité à inspirer et amuser les autres est un atout indéniable dans ses divers projets.

Dans sa vie professionnelle, Catherine privilégie les relations interpersonnelles et l'impact émotionnel. Son indépendance et son sens de l'initiative la guident pour entreprendre des idées innovantes et créer des événements qui incluent ses pairs. Elle accorde de l'importance aux objectifs ambitieux, s'appuyant sur ses décisions rapides et son intuition. Son envie de connecter avec de nouvelles personnes et sa facilité à rendre la communication vivante sont des éléments clés de son approche professionnelle.

Motivée par un désir de changement et d'inclusion, Catherine utilise son humour pour détendre ses interlocuteurs et son affection sincère pour établir des relations authentiques. Sa capacité à partager ses connaissances avec passion et à guider d'autres vers la transformation témoigne de son engagement à contribuer positivement au bien-être collectif. Ayant traversé des épreuves difficiles, elle affiche une résilience exemplaire et une détermination à continuer de développer sa Radieuse Académie, avec l'aspiration de toucher et d'aider toujours plus de femmes à travers son entreprise.

"""
forces_text= """🌟 **Chaleur et Bienveillance :** Catherine est dotée d’une chaleur naturelle et d’une grande bienveillance, ce qui lui permet de créer des liens authentiques avec les autres et de contribuer activement à un environnement harmonieux.

🎉 **Enthousiasme et Divertissement :** Sa personnalité divertissante et amusante illumine les moments passés avec elle, rendant les situations plus agréables et engageantes pour tous, tout en inspirant l’enthousiasme.

🚀 **Audace et Création :** Forte de son audace, Catherine n'hésite pas à explorer de nouvelles idées et à créer des initiatives qui sortent de l'ordinaire, portant avec confiance des projets innovants.

🤝 **Capacité à Inspirer :** Avec un talent naturel pour motiver et influencer positivement les autres, elle utilise son enthousiasme pour encourager et guider ses pairs vers l'atteinte de grands objectifs.

✨ **Empathie et Soutien :** Sa compassion et son envie d'aider les autres se manifestent dans son engagement à apporter un soutien sincère, créant un impact significatif dans la vie des personnes qu'elle côtoie.

"""
defis_text= """🔄 **Manque de Méthodicité :** Sa spontanéité et son absence de rigueur méthodique peuvent parfois entraîner des désorganisations dans la gestion quotidienne.

🌍 **Sensibilité au Stress :** Son manque de détente et de patience pourrait la rendre vulnérable au stress face à des situations exigeantes ou complexes.

🚧 **Prise de Risques Élevés :** Sa tendance à éviter la prudence peut occasionner des décisions hâtives sans évaluer pleinement les conséquences.

⏱️ **Difficulté avec Détails :** Son désintérêt pour les processus détaillés peut provoquer des erreurs mineures, réduisant l'efficacité de ses projets à long terme.

"""
changements_text= """Catherine perçoit le changement comme une opportunité stimulante et un espace de création. Son audace et sa détermination la poussent à embrasser les nouvelles expériences, les voyant comme des moyens de croître et d'impacter positivement son environnement. Forte de sa sociabilité et de son enthousiasme, elle s'adapte aux nouvelles situations grâce à une approche intuitive et spontanée. 

Elle aborde le changement avec passion, tirant parti de son indépendance pour explorer et innover sans crainte. Catherine transforme le changement en une scène où elle peut inspirer et divertir, contribuant à des environnements dynamiques et engageants. 

Cependant, d'autres pourraient percevoir son attitude comme trop aventureuse ou peu réfléchie. Catherine pourrait voir ces personnes comme prudentes, limitant l'innovation et l'intégration rapide des nouvelles idées. Ce contraste crée un équilibre entre action audacieuse et approche mesurée.

**Évaluation :**

1. Vitesse d'Adaptation : Plus rapide que la moyenne
2. Niveau de Confiance : Plus confiante que la moyenne


"""
interpersonnelles_text= """Catherine envisage les relations interpersonnelles avec chaleur et bienveillance. Son attitude chaleureuse et amusante favorise la création de liens solides, où elle valorise les échanges joyeux et positifs. Elle apprécie les interactions où elle peut exprimer son authenticité et son optimisme, créant des environnements collaboratifs et dynamiques. Sa nature sociable et indépendante lui permet de s'intégrer facilement dans les équipes et de partager son énergie positive.

Elle aborde les relations avec une approche intuitive, préférant des connexions harmonieuses et évitant les conflits. Sa tendance à agir avec confiance et son audace à entreprendre de nouvelles idées renforcent son rôle de soutien au sein de l'équipe. Catherine favorise l'écoute et la compréhension mutuelle, ce qui lui permet de gérer les tensions avec tact.

Certaines personnes pourraient percevoir Catherine comme peu approfondie ou trop impulsive dans ses relations, privilégiant les interactions légères sur des connexions profondes. Inversement, elle pourrait voir ces personnes comme trop focalisées sur les conflits, limitant ainsi l'harmonie et l'enthousiasme qu'elle chérit dans ses relations.

1. Le niveau de sociabilité : Plus sociable que la moyenne
2. Le niveau de confiance dans les relations : Plus confiante que la moyenne

"""
structure_text= """Catherine adopte une approche plutôt flexible lorsqu'il s'agit de structurer ses tâches. Elle ne ressent pas le besoin d'une organisation rigide et formelle, préférant laisser de la place à l'innovation et à l'improvisation. Sa spontanéité et son indépendance la rendent apte à naviguer avec aisance dans des environnements où les directives sont moins structurées. Elle favorise l'initiative personnelle et s'épanouit dans des contextes qui permettent la créativité.

En ce qui concerne la prévisibilité, Catherine ne se sent pas contrainte par des besoins de planification stricte et accepte facilement les changements inattendus. Sa capacité à s'adapter à de nouvelles situations avec confiance témoigne de sa préférence pour un travail dynamique.

Cependant, d'autres pourraient voir cette approche comme un manque de rigueur ou d'organisation. En revanche, Catherine pourrait percevoir ces personnes comme trop strictes ou peu adaptables aux imprévus, freinant ainsi l'énergie créative qu'elle valorise tant.

1. Le besoin de structure dans les tâches : Moins que la moyenne
2. La prévisibilité dans le travail : Moins de prévisibilité que la moyenne


"""

problemes_text="""Catherine perçoit les défis, les problèmes et les difficultés comme des occasions de mettre en œuvre son audace et son enthousiasme. Elle aborde ces situations avec une préférence pour l'action rapide, s'appuyant sur son intuition et son indépendance. Pour elle, les défis sont des opportunités d'exprimer sa créativité et de renforcer sa confiance en elle, plutôt que des obstacles insurmontables. 

Sa spontanéité et son optimisme l'encouragent à envisager des méthodes innovantes pour résoudre des problèmes. Catherine préfère faire preuve de résilience et de flexibilité, adaptant rapidement son approche pour relever les défis. Bien qu'elle ne soit pas particulièrement méthodique, sa capacité à improviser fait partie de ses forces distinctives.

Cependant, certains pourraient percevoir cette approche comme passant par-dessus les détails ou manquant de réflexion. Catherine pourrait voir ces personnes comme trop prudentes ou lentes à agir, ce qui pourrait lui sembler freiner l'avancement et la découverte de nouvelles possibilités.

1. Positivité face aux défis : Plus positive que la moyenne
2. Gestion du stress : Moins bien que la moyenne


"""
arch1_nom="Exploratrice"
arch2_nom="Amoureuse"
desc_arch1_text="""Catherine, animée par un esprit d'exploratrice, est passionnée par la découverte de nouvelles idées et l'expansion de ses horizons. Elle se plaît à sortir de sa zone de confort pour vivre des aventures excitantes et enrichir sa perspective du monde. Pour elle, explorer signifie défier les conventions, découvrir des lieux et cultures différents, et repousser les frontières de ses connaissances. Ce désir inné d'exploration stimule sa créativité et son engagement envers le développement personnel et professionnel. Catherine s'épanouit dans l'inconnu, motivée par la possibilité de grandir et de créer quelque chose d'innovant. Sa capacité à inspirer les autres à élargir leurs propres horizons constitue une source constante de motivation dans sa quête d'apprentissage constant et d'aventure"""
desc_arch2_text= """Catherine, guidée par son archétype d'amoureuse, chérit les connexions émotionnelles profondes et sincères. Elle trouve une grande joie dans les moments de partage et de complicité, privilégiant des relations où la sincérité et l'affection règnent. Pour elle, l'authenticité est au cœur des interactions humaines, et elle s'efforce de créer des liens où l'amour et la tendresse sont pleinement exprimés. Catherine se consacre à soutenir ceux qui la entourent, s'assurant que chacun se sente inclus et respecté. Son désir d'encourager l'harmonie et l'épanouissement personnel des autres inspire ses choix, tant dans sa vie personnelle que professionnelle, nourrissant son aspiration à un monde plus connecté et bienveillant."""
travail_text= """Catherine Lavoie se distingue par son audace vibrante et sa nature chaleureuse, qui teintent chaque aspect de son engagement professionnel. Elle possède une approche unique et passionnée du travail, marquée par une profonde envie d'inspiration et de partage. Sa capacité à explorer de nouvelles idées et à repousser les limites des connaissances lui permet de se démarquer par son enthousiasme et sa détermination, faisant d'elle une figure singulière dans son domaine.

Dans son parcours professionnel, Catherine excelle par sa capacité à transformer des concepts novateurs en projets tangibles, notamment avec sa Radieuse Académie. Son style de travail est dynamique, ne se conformant pas aux cadres traditionnels et visant à insuffler de l'optimisme et de l'innovation à ses initiatives. Par exemple, elle anime ses cours de maquillage avec une approche bien-être unique, en veillant à ce que chaque session non seulement éduque mais enrichisse aussi personnellement.

En équipe, Catherine est une contributrice proactive, connue pour son approche directe mais bienveillante. Elle sait créer un environnement harmonieux, encourageant chacun à exprimer ses idées dans un cadre positif. Sa gestion des situations critiques se manifeste par sa capacité à utiliser l'humour pour désamorcer les tensions et à motiver ses collègues à travers les défis collectifs.

Bien qu'elle ne se positionne pas naturellement dans des rôles d'autorité, Catherine inspire par son authenticité et sa capacité à guider les autres vers l'épanouissement personnel et collectif. Elle sait transmettre sa vision avec clarté, galvanisant son équipe par la confiance qu’elle incarne.

L'impact de Catherine se ressent profondément dans la dynamique de travail, où son énergie positive instaure un climat d'ouverture et de créativité. Elle influence ses collègues à voir au-delà des conventions, encouragée par sa volonté de créer un espace qui favorise l'émergence de liens enrichissants et l'acceptation des idées audacieuses. Ses qualités font d'elle une partenaire indispensable, propulsant une dynamique où chaque contribution est valorisée et chaque innovation célébrée.

"""
adapte_rouge_text="""🗣 **Communication Directe et Confiante :** Catherine, au style naturellement dynamique et authentique, devrait adopter une communication claire et assertive lorsqu'elle s'adresse aux Rouges. En restant concise et en mettant l'accent sur les résultats escomptés, elle captera leur attention. Utiliser l'humour pour détendre l'atmosphère peut aussi faciliter une connexion efficace.

⚡ **Prise de Décision Affirmée et Rapide :** À l'aise avec l'initiative, Catherine peut impressionner les Rouges en   affichant une détermination et une capacité à prendre des décisions rapides. Elle doit se concentrer sur les objectifs finaux sans hésiter à faire confiance à son instinct, ce qui est apprécié par les personnes rouges cherchant des leaders réactifs.

🎯 **Encourager l’Engagement par l’Impact :** Les Rouges sont attirés par des résultats tangibles. Catherine peut tirer parti de sa créativité pour démontrer comment chaque action concrète contribue à des objectifs majeurs, renforçant ainsi l'engagement des Rouges. Elle devrait partager des exemples concrets de ses succès pour les motiver davantage.

🏆 **Célébration via les Accomplissements Tangibles :** Plutôt que de simplement encourager, Catherine devrait reconnaître et fêter les grandes réalisations des Rouges. Présenter des réussites concrètes et montrer l'impact de leurs efforts sur l’objectif global les stimule. Une reconnaissance basée sur des faits précis et des récompenses visibles est essentielle pour maintenir leur motivation.

💥 **Gestion des Conflits avec Assurances :** En cas de désaccord, Catherine doit faire preuve d'assertivité et de rapidité dans sa réponse. Les Rouges valorisent une gestion de conflits directe. En se concentrant rapidement sur les solutions, elle montrera qu'elle est adaptable et capable de gérer efficacement l'imprévu, tout en maintenant l'harmonie dans l'équipe.

En travaillant avec des Rouges, Catherine devrait accentuer son dynamisme et sa capacité à inspirer par l’action, tout en restant ferme sur les objectifs à atteindre. Sa capacité à influencer énergétiquement les situations en fait un atout précieux dans ce contexte.

"""
adapte_bleu_text= """🗣 **Communication Claire et Détailée :** Catherine, avec sa chaleur naturelle, devrait fournir des informations complètes et précises aux personnes Bleues. En veillant à ce que ses messages soient bien structurés et factuels, elle répondra à leur besoin de clarté et de compréhension approfondie. Inclure des données tangibles et des exemples concrets peut renforcer son discours.

⚙️ **Prise de Décision Logique et Méthodique :** Bien que Catherine soit intuitive, elle peut capter l'attention des Bleus en intégrant des éléments de logique dans ses décisions. Présenter des analyses claires et montrer le processus de réflexion derrière ses choix leur offre la sécurité qu’ils recherchent. Son approche ouverte doit être équilibrée par une démonstration de rigueur.

🔍 **Encourager l’Engagement par la Fiabilité :** Les Bleus apprécient la précision et la constance dans l'effort. Catherine peut augmenter leur engagement en offrant un soutien régulier et une communication transparente concernant les progrès et les étapes. Valoriser la contribution des Bleus en soulignant l'importance de leur attention aux détails renforce leur motivation.

📊 **Reconnaissance Basée sur la Précision :** Au lieu de féliciter uniquement les résultats globaux, Catherine devrait valoriser les efforts méticuleux des Bleus. En reconnaissant leurs compétences analytiques et l'exactitude de leur travail, elle leur montre que leur dévouement aux normes élevées est apprécié et essentiel au succès collectif.

🛠 **Gestion des Conflits avec Diplomatie :** Face aux conflits, Catherine doit adopter une approche réfléchie et factuelle pour satisfaire le penchant analytique des Bleus. En fournissant des explications détaillées et des solutions raisonnées, elle assure une résolution calme et logique qui respecte leur besoin d’ordre et de structure.

En travaillant avec des Bleus, Catherine peut bénéficier de leur rigueur et précision en alliant ces qualités à sa propre adaptabilité et son style communicatif engageant. Son ouverture et son dynamisme peuvent compléter efficacement la méthodologie et la minutie naturelle des Bleus.

"""
adapte_vert_text= """🗣 **Communication Empathique et Patiente :** Catherine, avec son attitude bienveillante, devrait adopter une approche empathique et patiente lorsqu'elle s'adresse aux Verts. En assurant un climat de communication ouvert et en prenant le temps d’écouter attentivement, elle répond à leur besoin d'harmonie et de compréhension. Utiliser un ton chaleureux renforce la confiance et facilite l’échange.

🤝 **Prise de Décision Collaborative :** Bien que Catherine soit indépendante, elle peut engager les verts en incluant leur point de vue dans la prise de décision. Encourager les discussions et valoriser le consensus leur donne un sentiment de sécurité. Son style de leadership doit faire place à la collaboration en montrant qu’elle respecte et intègre leurs opinions.

🍃 **Encourager l’Engagement par le Soutien :** Les Verts sont motivés par un environnement de travail stable et encourageant. Catherine peut accentuer leur engagement en créant une atmosphère de soutien constant où leur bien-être est prioritaire. Offrir des moments de reconnexion et de détente pendant le processus de travail peut renforcer leur fidélité et leur motivation.

🌷 **Reconnaissance par l’Appui Personnel :** Plutôt que de célébrer uniquement les succès, Catherine devrait reconnaître les efforts et contributions des Verts par un soutien personnel et attentionné. En montrant de l’appréciation pour leurs qualités humaines et leur dévouement, elle cultive un sentiment d’appartenance pour leur travail et leur contribution.

🌱 **Gestion des Conflits avec Douceur et Compréhension :** Dans des situations de conflits, Catherine doit privilégier une approche douce en offrant écoute et compréhension. En abordant les différends avec une attitude calme et non confrontante, elle rassure les Verts et favorise une résolution pacifique.

En travaillant avec des Verts, Catherine peut tirer parti de leur sens de la collaboration et de leur loyauté en mariant leurs forces à son dynamisme et sa chaleur communicative. Sa capacité à harmoniser les environnements de groupe complète parfaitement leur désir de stabilité et de coopération.

"""
adapte_jaune_text= """🗣 **Communication Dynamique et Enthousiaste :** Avec sa nature sociable et amusante, Catherine devrait engager les Jaunes avec une communication vibrant d'enthousiasme et de positivité. Partager ses idées avec enthousiasme et encourager des conversations animées capte leur énergie et maintient leur intérêt. Utiliser des anecdotes et des récits captivants peut renforcer la connexion.

🌟 **Prise de Décision Inspirée et Créative :** Bien que Catherine soit intuitive, elle peut aligner sa prise de décision avec les attentes des Jaunes en intégrant des éléments créatifs et inspirants dans ses choix. Les impliquant dans des brainstorming collectifs et encourageant un environnement propice aux idées novatrices, elle inspire leur esprit inventif.

🎉 **Encourager l’Engagement par l’Excitation :** Les Jaunes sont stimulés par des environnements dynamiques et joyeux. Catherine peut augmenter leur engagement en rendant les tâches attrayantes et en mettant en avant les aspects exaltants des projets. En célébrant ensemble les petites victoires, elle encourage un climat de motivation continue.

🏆 **Reconnaissance Ludique et Chaleureuse :** Au lieu de se limiter aux compliments formels, Catherine devrait reconnaître les accomplissements des Jaunes par des célébrations joyeuses et légères. En créant des moments de reconnaissance amusants et inoubliables, elle souligne l'importance de leur contribution tout en cultivant une ambiance positive.

💬 **Gestion des Conflits avec Optimisme et Ouverture :** Dans des situations conflictuelles, Catherine doit aborder les défis avec un optimisme palpable et une attitude ouverte. En utilisant l'humour pour apaiser les tensions, elle montre privilégie la résolution positive des différends, en encourageant le dialogue amical et l'expression des émotions. 

En travaillant avec des Jaunes, Catherine peut capitaliser sur leur énergie vive et leur créativité, en marquant ses interventions de son propre dynamisme et naturel engageant. Sa capacité à insuffler de l'enthousiasme contribue à générer un environnement où l'innovation et l’innovation prennent vie.

"""
bleu= 21
rouge= 75
jaune= 91
vert= 59
explorateur= 100
protecteur= 53
bouffon= 90
souverain= 20
magicien= 87
createur= 53
hero= 50
citoyen= 93
sage= 60
amoureuse= 97
rebelle= 23
optimiste= 57
email="catherine.lavoie86@gmail.com"
nom_leader="Audrey Lapointe"


update_database (nom_profile, motivation_text, bref_text, forces_text, defis_text, changements_text, interpersonnelles_text, structure_text, problemes_text, arch1_nom, arch2_nom, desc_arch1_text, desc_arch2_text, travail_text, adapte_rouge_text, adapte_bleu_text, adapte_vert_text, adapte_jaune_text, bleu, rouge, jaune, vert, explorateur, protecteur, bouffon, souverain, magicien, createur, hero, citoyen, sage, amoureuse, rebelle, optimiste , email, nom_leader)