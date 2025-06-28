import React, {useState} from "react";

export function DetailForm({form}) {
    const [selectedForm, setSelectedForm] = useState(0);


    const filteredForm = form[selectedForm].form


    const indexArray = [];
    for (let i = 0; i < form.length; i++) {
    indexArray.push(i);
    }

    if(!form) {
        return (null)
    }

    return (
        <div className="formInfo">
            <h2>Formulaire:</h2>
            {form.length > 1 ?(
            <><label htmlFor="selectIndex">Sélectionner le formulaire (0 = plus récent)</label>
            <select name="selectIndex" value={selectedForm} onChange={(e) => setSelectedForm(e.target.value)}>
                {indexArray.map(num =>
                    <option key={num} value={num}>{num}</option>
                )}
                
            </select> </>) : null
            }

            <h3>Question 1:</h3>
            <p>Je suis ... Analytique :</p><p>{filteredForm["1. Je suis .. [ Analytique ]"] || filteredForm["Je suis ... Analytique"]}</p>
            <p>Je suis ... Audacieux:</p><p>{filteredForm["1. Je suis .. [ Audacieux ]"] || filteredForm["Je suis ... Audacieux"]}</p>
            <p>Je suis ... Amusant :</p><p>{filteredForm["1. Je suis .. [ Amusant ]"] || filteredForm["Je suis ... Amusant"]}</p>
            <p>Je suis ... Chaleureux :</p><p>{filteredForm["1. Je suis .. [ Chaleureux ]"] || filteredForm["Je suis ... Chaleureux"]}</p>

            <h3>Question 2:</h3>
            <p>Je suis ... Sociable :</p><p>{filteredForm['2. Je suis ... [ Sociable ]'] || filteredForm["Je suis ... Sociable"]}</p>
            <p>Je suis ... Détendu :</p><p>{filteredForm['2. Je suis ... [ Détendu ]'] || filteredForm["Je suis ... Détendu"]}</p>
            <p>Je suis ... Décidé :</p><p>{filteredForm["2. Je suis ... [ Décidé ]"] || filteredForm["Je suis ... Décidé"]}</p>
            <p>Je suis ... Organisé :</p><p>{filteredForm['2. Je suis ... [ Organisé ]'] || filteredForm['Je suis ... Organisé']}</p>

            <h3>Question 3:</h3>
            <p>Je suis ... Indépendant :</p><p>{filteredForm["3. Je suis ... [ Indépendant ]"] || filteredForm["Je suis ... Indépendant"]}</p>
            <p>Je suis ... Bavard :</p><p>{filteredForm['3. Je suis ... [ Bavard ]'] || filteredForm["Je suis ... Bavard"]}</p>
            <p>Je suis ... Méthodique :</p><p>{filteredForm['3. Je suis ... [ Méthodique ]'] || filteredForm["Je suis ... Méthodique"]}</p>
            <p>Je suis ... Stratégique :</p><p>{filteredForm['3. Je suis ... [ Stratégique ]'] || filteredForm["Je suis ... Stratégique"]}</p>

            <h3>Question 4:</h3>
            <p>Je suis ... Prudent :</p><p>{filteredForm['4. Je suis ... [ Prudent ]'] || filteredForm["Je suis ... Prudent"]}</p>
            <p>Je suis ... Droit au but :</p><p>{filteredForm['4. Je suis ... [ Droit au but ]'] || filteredForm["Je suis ... Droit au but"]}</p>
            <p>Je suis ... Bienveillant :</p><p>{filteredForm['4. Je suis ... [ Bienveillant ]'] || filteredForm["Je suis ... Bienveillant"]}</p>
            <p>Je suis ... Positif :</p><p>{filteredForm['4. Je suis ... [ Positif ]'] || filteredForm['Je suis ... Positif']}</p>

            <h3>Question 5:</h3>
            <p>Je considère important de viser des objectifs ambitieux :</p><p>{filteredForm['5. [ Je considère important de viser des objectifs ambitieux ]'] || filteredForm["Je considère important de viser des objectifs ambitieux"]}</p>
            <p>On dit de moi que je suis une personne divertissante :</p><p>{filteredForm['5. [ On dit de moi que je suis une personne divertissante ]'] || filteredForm['On dit de moi que je suis une personne divertissante']}</p>
            <p>Je préfère me baser sur des faits concrets que sur des opinions :</p><p>{filteredForm['5. [ Je préfère me baser sur des faits concrets que sur des opinions ]'] || filteredForm["Je préfère me baser sur des faits concrets que sur des opinions"]}</p>
            <p>Je fais passer les besoins des autres avant les miens :</p><p>{filteredForm['5. [ Je fais passer les besoins des autres avant les miens ]'] || filteredForm["Je fais passer les besoins des autres avant les miens"]}</p>

            <h3>Question 6:</h3>
            <p>J'aime créer des évènements et y impliquer les autres :</p><p>{filteredForm["6. [ J'aime créer des évènements et y impliquer les autres ]"] || filteredForm["J'aime créer des évènements et y impliquer les autres"]}</p>
            <p>Je fonce vers l'inconnu avec confiance :</p><p>{filteredForm["6. [ Je fonce vers l'inconnu avec confiance ]"] || filteredForm["Je fonce vers l'inconnu avec confiance"]}</p>
            <p>Je peux tolérer beaucoup de choses avant de changer une situation désagréable :</p><p>{filteredForm['6. [ Je peux tolérer beaucoup de choses avant de changer une situation désagréable ]'] || filteredForm["Je peux tolérer beaucoup de choses avant de changer une situation désagréable"]}</p>
            <p>Je porte attention aux détails et j'accompli les tâches avec exactitude :</p><p>{filteredForm["6. [ Je porte attention aux détails et j'accompli les tâches avec exactitude ]"] || filteredForm["Je porte attention aux détails et j'accompli les tâches avec exactitude"]}</p>

            <h3>Question 7:</h3>
            <p>Je vise l'excellence dans tout ce que je fais :</p><p>{filteredForm["7. [ Je vise l'excellence dans tout ce que je fais ]"] || filteredForm["Je vise l'excellence dans tout ce que je fais"]}</p>
            <p>J'agis de manière confiante :</p><p>{filteredForm["7. [ J'agis de manière confiante ]"] || filteredForm["J'agis de manière confiante"]}</p>
            <p>J'aime rencontrer de nouvelles personnes :</p><p>{filteredForm["7. [ J'aime rencontrer de nouvelles personnes ]"] || filteredForm["J'aime rencontrer de nouvelles personnes"]}</p>
            <p>Je fais preuve de tact: {filteredForm['7. [ Je fais preuve de tact ]'] || filteredForm["Je fais preuve de tact"]}</p>

            <h3>Question 8:</h3>
            <p>Je vise l'excellence dans tout ce que je fais :</p><p>{filteredForm["8. [ J'aime les standards élevés ]"] || filteredForm["J'aime les standards élevés"]}</p>
            <p>Je suis déterminé à atteindre mes objectifs :</p><p>{filteredForm['8. [ Je suis déterminé à atteindre mes objectifs ]'] || filteredForm["Je suis déterminé à atteindre mes objectifs"]}</p>
            <p>Lorsque j'aime vraiment quelque chose, je ne peux pas m'empêcher de le partager avec les autres :</p><p>{filteredForm["8. [ Lorsque j'aime vraiment quelque chose, je ne peux pas m'empêcher de le partager avec les autres ]"] || filteredForm["Lorsque j'aime vraiment quelque chose, je ne peux pas m'empêcher de le partager avec les autres"]}</p>
            <p>Je montre de la compassion pour les autres:</p><p>{filteredForm['8. [ Je montre de la compassion pour les autres ]'] || filteredForm["Je montre de la compassion pour les autres"]}</p>
            
            <h3>Question 9:</h3>
            <p>Je suis une personne patiente :</p><p>{filteredForm['9. [ Je suis une personne patiente ]'] || filteredForm["Je suis une personne patiente"]}</p>
            <p>On dit de moi que je suis une personne directe :</p><p>{filteredForm['9. [ On dit de moi que je suis une personne directe ]'] || filteredForm["On dit de moi que je suis une personne directe"]}</p>
            <p>J'agis de façon spontanée :</p><p>{filteredForm["9. [ J'agis de façon spontanée ]"] || filteredForm["J'agis de façon spontanée"]}</p>
            <p>Je crois que tout a un ordre et une suite logique :</p><p>{filteredForm['9. [ Je crois que tout a un ordre et une suite logique ]'] || filteredForm["Je crois que tout a un ordre et une suite logique"]}</p>

            <h3>Question 10:</h3>
            <p>Je suis motivé par créer quelque chose de nouveau :</p><p>{filteredForm['10. Je suis motivé par [ Créer quelque chose de nouveau ]'] || filteredForm["Je suis motivé par créer quelque chose de nouveau"]}</p>
            <p>Je suis motivé par aider et soutenir les autres :</p><p>{filteredForm['10. Je suis motivé par [ Aider et soutenir les autres ]'] || filteredForm["Je suis motivé par aider et soutenir les autres "]}</p>
            <p>Je suis motivé par l'opportunité de relever des défis :</p><p>{filteredForm["10. Je suis motivé par [ L'opportunité de relever des défis ]"] || filteredForm["Je suis motivé par l'opportunité de relever des défis"]}</p>
            <p>Je suis motivé par améliorer et perfectionner chaque détail :</p><p>{filteredForm['10. Je suis motivé par [ Améliorer et perfectionner chaque détail ]'] || filteredForm["Je suis motivé par améliorer et perfectionner chaque détail"]}</p>

            <h3>Question 11:</h3>
            <p>J'aime les idées nouvelles qui sortent de l'ordinaire :</p><p>{filteredForm["11. [ J'aime les idées nouvelles qui sortent de l'ordinaire ]"] || filteredForm["J'aime les idées nouvelles qui sortent de l'ordinaire"]}</p>
            <p>Je crois que les réponses ne doivent pas être précipitées, elles prennent du temps à incuber :</p><p>{filteredForm['11. [ Je crois que les réponses ne doivent pas être précipitées, elles prennent du temps à incuber ]'] || filteredForm["Je crois que les réponses ne doivent pas être précipitées, elles prennent du temps à incuber"]}</p>
            <p>J'ai une certaine facilité à diriger les autres :</p><p>{filteredForm["11. [ J'ai une certaine facilité à diriger les autres ]"] || filteredForm["J'ai une certaine facilité à diriger les autres"]}</p>
            <p>Je m'assure de produire un travail de qualité :</p><p>{filteredForm["11. [ Je m'assure de produire un travail de qualité ]"] || filteredForm["Je m'assure de produire un travail de qualité"]}</p>

            <h3>Question 12:</h3>
            <p>Lorsque j'ai une décision à prendre ... j'évalue rapidement les options :</p><p>{filteredForm["12. Lorsque j'ai une décision à prendre ... [ J'évalue rapidement les options ]"] || filteredForm["Lorsque j'ai une décision à prendre ... j'évalue rapidement les options"]}</p>
            <p>Lorsque j'ai une décision à prendre ... je prends le temps d'analyser les données :</p><p>{filteredForm["12. Lorsque j'ai une décision à prendre ... [ Je prends le temps d'analyser les données ]"] || filteredForm["Lorsque j'ai une décision à prendre ... je prends le temps d'analyser les données"]}</p>
            <p>Lorsque j'ai une décision à prendre ... je suis mon intuition :</p><p>{filteredForm["12. Lorsque j'ai une décision à prendre ... [ Je suis mon intuition ]"] || filteredForm["Lorsque j'ai une décision à prendre ... je suis mon intuition"]}</p>
            <p>Lorsque j'ai une décision à prendre ... j'évalue l'impact qu'elle aura sur les autres :</p><p>{filteredForm["12. Lorsque j'ai une décision à prendre ... [ J'évalue l'impact qu'elle aura sur les autres ]"] || filteredForm["Lorsque j'ai une décision à prendre ... j'évalue l'impact qu'elle aura sur les autres"]}</p>

            <h3>Question 13:</h3>
            <p>Dans une équipe ... j'écoute les préoccupations des autres et je priorise la création d'un environnement harmonieux :</p><p>{filteredForm["13. Dans une équipe ... [ J'écoute les préoccupations des autres et je priorise la création d'un environnement harmonieux ]"] || filteredForm["Dans une équipe ... j'écoute les préoccupations des autres et je priorise la création d'un environnement harmonieux"]}</p>
            <p>Dans une équipe ... je prends des initiatives et des risques pour atteindre les objectifs :</p><p>{filteredForm['13. Dans une équipe ... [ Je prends des initiatives et des risques pour atteindre les objectifs ]'] || filteredForm["Dans une équipe ... je prends des initiatives et des risques pour atteindre les objectifs"]}</p>
            <p>Dans une équipe ... j'utilise mon enthousiasme pour influencer les décisions :</p><p>{filteredForm["13. Dans une équipe ... [ J'utilise mon enthousiasme pour influencer les décisions ]"] || filteredForm["Dans une équipe ... j'utilise mon enthousiasme pour influencer les décisions"]}</p>
            <p>Dans une équipe ... je veille à la coordination des tâches et je m'assure de la conformité aux règles et procédures :</p><p>{filteredForm["13. Dans une équipe ... [ Je veille à la coordination des tâches et je m'assure de la conformité aux règles ]"] || filteredForm["Dans une équipe ... je veille à la coordination des tâches et je m'assure de la conformité aux règles et procédures"]}</p>

            <h3>Question 14:</h3>
            <p>Je suis préoccupé... par ce que pense les autres :</p><p>{filteredForm['14. Je suis préoccupé... [ Par ce que pense les autres ]'] || filteredForm["Je suis préoccupé... par ce que pense les autres"]}</p>
            <p>Je suis préoccupé... par la planification des situations futures :</p><p>{filteredForm['14. Je suis préoccupé... [ Par la planification des situations ]'] || filteredForm["Je suis préoccupé... par la planification des situations futures"]}</p>
            <p>Je suis préoccupé... par comment rendre le moment encore plus intéressant :</p><p>{filteredForm['14. Je suis préoccupé... [ Par comment rendre le moment encore plus intéressant ]'] || filteredForm["Je suis préoccupé... par comment rendre le moment encore plus intéressant"]}</p>
            <p>Je suis préoccupé... par comment être encore plus efficace :</p><p>{filteredForm['14. Je suis préoccupé... [ Par comment être encore plus efficace ]'] || filteredForm["Je suis préoccupé... par comment être encore plus efficace"]}</p>

            <h3>Question 15:</h3>
            <p>Dans une discussion... je veux qu'on parle avec passion, rien de pire qu'une discussion plate :</p><p>{filteredForm["15. Dans une discussion.. [ Je veux qu'on parle avec passion, rien de pire qu'une discussion plate ]"] || filteredForm["Dans une discussion... je veux qu'on parle avec passion, rien de pire qu'une discussion plate"]}</p>
            <p>Dans une discussion... il est important de prendre le temps de s'écouter l'un, l'autre :</p><p>{filteredForm["15. Dans une discussion.. [ Il est important de prendre le temps de s'écouter l'un, l'autre ]"] || filteredForm["Dans une discussion... il est important de prendre le temps de s'écouter l'un, l'autre"]}</p>
            <p>Dans une discussion... il est important d'être concret, exact et structuré :</p><p>{filteredForm["15. Dans une discussion.. [ Il est important d'être concret, exact et structuré ]"] || filteredForm["Dans une discussion... il est important d'être concret, exact et structuré"]}</p>
            <p>Dans une discussion... j'aime qu'on aille directement à l'essentiel :</p><p>{filteredForm["15. Dans une discussion.. [ J'aime qu'on aille directement à l'essentiel ]"] || filteredForm["Dans une discussion... j'aime qu'on aille directement à l'essentiel"]}</p>

            <h3>Question 16:</h3>
            <p>J'aime explorer de nouvelles idées et repousser les frontières de mes connaissances :</p><p>{filteredForm['16. [ J’aime explorer de nouvelles idées et repousser les frontières de mes connaissances. ]'] || filteredForm["J'aime explorer de nouvelles idées et repousser les frontières de mes connaissances."]}</p>
            <p>J'aime inspirer les autres à changer leur façon de penser et à voir de nouvelles possibilités :</p><p>{filteredForm['16. [ J’aime inspirer les autres à changer leur façon de penser et à voir de nouvelles possibilités. ]'] || filteredForm["J'aime inspirer les autres à changer leur façon de penser et à voir de nouvelles possibilités."]}</p>
            <p>J'aime détendre l'atmosphère en faisant rire les autres dans les moments sérieux :</p><p>{filteredForm['16. [ J’aime détendre l’atmosphère en faisant rire les autres dans les moments sérieux. ]'] || filteredForm["J'aime détendre l'atmosphère en faisant rire les autres dans les moments sérieux."]}</p>
            <p>J'aime guider une équipe vers l'atteinte de grands objectifs avec autorité :</p><p>{filteredForm['16. [ J’aime guider une équipe vers l’atteinte de grands objectifs avec autorité. ]'] || filteredForm["J'aime guider une équipe vers l'atteinte de grands objectifs avec autorité."]}</p>

            <h3>Question 17:</h3>
            <p>J'aime offrir un soutien inconditionnel à ceux qui traversent des moments difficiles :</p><p>{filteredForm['17. [ J’aime offrir un soutien inconditionnel à ceux qui traversent des moments difficiles. ]'] || filteredForm["J'aime offrir un soutien inconditionnel à ceux qui traversent des moments difficiles."]}</p>
            <p>J'aime inventer des solutions nouvelles pour résoudre des problèmes complexes :</p><p>{filteredForm['17. [ J’aime inventer des solutions nouvelles pour résoudre des problèmes complexes. ]'] || filteredForm["J'aime inventer des solutions nouvelles pour résoudre des problèmes complexes."]}</p>
            <p>J'aime relever des défis difficiles et démontrer ma force et mon courage :</p><p>{filteredForm['17. [ J’aime relever des défis difficiles et démontrer ma force et mon courage. ]'] || filteredForm["J'aime relever des défis difficiles et démontrer ma force et mon courage."]}</p>
            <p>J'aime contribuer au bien-être de la communauté en m'assurant que tout le monde se sente inclus et respecté :</p><p>{filteredForm['17. [ J’aime contribuer au bien-être de la communauté en m’assurant que tout le monde se sente inclus et respecté. ]'] || filteredForm["J'aime contribuer au bien-être de la communauté en m'assurant que tout le monde se sente inclus et respecté."]}</p>

            <h3>Question 18:</h3>
            <p>J'aime rechercher la vérité et approfondir mes connaissances sur des sujets élaborés :</p><p>{filteredForm['18. [ J’aime rechercher la vérité et approfondir mes connaissances sur des sujets élaborés. ]'] || filteredForm["J'aime rechercher la vérité et approfondir mes connaissances sur des sujets élaborés."]}</p>
            <p>J'aime développer des relations profondes et émotionnellement riches avec les autres :</p><p>{filteredForm['18. [ J’aime développer des relations profondes et émotionnellement riches avec les autres. ]'] || filteredForm["J'aime développer des relations profondes et émotionnellement riches avec les autres."]}</p>
            <p>J'aime défier les conventions pour ouvrir la voie à de nouvelles idées et approches ;</p><p>{filteredForm['18. [ J’aime défier les conventions pour ouvrir la voie à de nouvelles idées et approches. ]'] || filteredForm["J'aime défier les conventions pour ouvrir la voie à de nouvelles idées et approches."]}</p>
            <p>J'aime structurer et organiser les ressources pour garantir l'efficacité :</p><p>{filteredForm['18. [ J’aime structurer et organiser les ressources pour garantir l’efficacité. ]'] || filteredForm["J'aime structurer et organiser les ressources pour garantir l'efficacité."]}</p>

            <h3>Question 19:</h3>
            <p>J'aime sortir de ma zone de confort pour vivre des aventures excitantes :</p><p>{filteredForm['19. [ J’aime sortir de ma zone de confort pour vivre des aventures excitantes. ]'] || filteredForm["J'aime sortir de ma zone de confort pour vivre des aventures excitantes."]}</p>
            <p>J'aime être la personne sur qui les autres peuvent compter en cas de besoin :</p><p>{filteredForm['19. [ J’aime être la personne sur qui les autres peuvent compter en cas de besoin. ]'] || filteredForm["J'aime être la personne sur qui les autres peuvent compter en cas de besoin."]}</p>
            <p>J'aime surprendre les autres avec mon humour décalé et mes blagues inattendues :</p><p>{filteredForm['19. [ J’aime surprendre les autres avec mon humour décalé et mes blagues inattendues. ]'] || filteredForm["J'aime surprendre les autres avec mon humour décalé et mes blagues inattendues."]}</p>
            <p>J'aime voir le bon côté des choses et adopter une attitude optimiste face à la vie :</p><p>{filteredForm['19. [ J’aime voir le bon côté des choses et adopter une attitude optimiste face à la vie. ]'] || filteredForm["J'aime voir le bon côté des choses et adopter une attitude optimiste face à la vie."]}</p>

            <h3>Question 20:</h3>
            <p>J'aime guider les autres vers leur propre transformation et croissance :</p><p>{filteredForm['20. [ J’aime guider les autres vers leur propre transformation et croissance. ]'] || filteredForm["J'aime guider les autres vers leur propre transformation et croissance."]}</p>
            <p>J'aime exprimer mon affection de manière directe et authentique :</p><p>{filteredForm['20. [ J’aime exprimer mon affection de manière directe et authentique. ]'] || filteredForm["J'aime exprimer mon affection de manière directe et authentique."]}</p>
            <p>J'aime repousser mes limites pour atteindre mes objectifs ambitieux :</p><p>{filteredForm['20. [ J’aime repousser mes limites pour atteindre mes objectifs ambitieux. ]'] || filteredForm["J'aime repousser mes limites pour atteindre mes objectifs ambitieux."]}</p>
            <p>J'aime faire partie d'un groupe où tout le monde est traité sur un pied d'égalité :</p><p>{filteredForm['20. [ J’aime faire partie d’un groupe où tout le monde est traité sur un pied d’égalité. ]'] || filteredForm["J'aime faire partie d'un groupe où tout le monde est traité sur un pied d'égalité."]}</p>

            <h3>Question 21:</h3>
            <p>J'aime partager mes connaissances pour éclairer et guider ceux qui m'entourent :</p><p>{filteredForm['21. [ J’aime partager mes connaissances pour éclairer et guider ceux qui m’entourent. ]'] || filteredForm["J'aime partager mes connaissances pour éclairer et guider ceux qui m'entourent."]}</p>
            <p>J'aime transformer mes idées en projets concrets qui font une différence :</p><p>{filteredForm['21. [ J’aime transformer mes idées en projets concrets qui font une différence. ]'] || filteredForm["J'aime transformer mes idées en projets concrets qui font une différence."]}</p>
            <p>J'aime prendre des risques calculés pour changer les choses autour de moi :</p><p>{filteredForm['21. [ J’aime prendre des risques calculés pour changer les choses autour de moi. ]'] || filteredForm["J'aime prendre des risques calculés pour changer les choses autour de moi."]}</p>
            <p>J'aime vivre une vie simple et harmonieuse, à l'abri des complications inutiles :</p><p>{filteredForm["21. [ J’aime vivre une vie simple et harmonieuse, à l'abri des complications inutiles. ]"] || filteredForm["J'aime vivre une vie simple et harmonieuse, à l'abri des complications inutiles."]}</p>

            <h3>Question 22:</h3>
            <p>J'aime découvrir des lieux et des cultures différents pour élargir mes perspectives :</p><p>{filteredForm['22. [ J’aime découvrir des lieux et des cultures différents pour élargir mes perspectives. ]'] || filteredForm["J'aime découvrir des lieux et des cultures différents pour élargir mes perspectives."]}</p>
            <p>J'aime anticiper les risques et protéger les autres avant qu'ils n'en aient conscience :</p><p>{filteredForm["22. [ J’aime anticiper les risques et protéger les autres avant qu'ils n'en aient conscience. ]"] || filteredForm["J'aime anticiper les risques et protéger les autres avant qu'ils n'en aient conscience."]}</p>
            <p>J'aime utiliser l'humour pour désamorcer des situations tendues et ramener de la légèreté :</p><p>{filteredForm['22. [ J’aime utiliser l’humour pour désamorcer des situations tendues et ramener de la légèreté. ]'] || filteredForm["J'aime utiliser l'humour pour désamorcer des situations tendues et ramener de la légèreté."]}</p>
            <p>J'aime prendre des décisions importantes pour maintenir l'ordre et la stabilité :</p><p>{filteredForm['22. [ J’aime prendre des décisions importantes pour maintenir l’ordre et la stabilité. ]'] || filteredForm["J'aime prendre des décisions importantes pour maintenir l'ordre et la stabilité."]}</p>

            <h3>Question 23:</h3>
            <p>J'aime poser des questions difficiles pour aller au fond des choses :</p><p>{filteredForm['23. [ J’aime poser des questions difficiles pour aller au fond des choses. ]'] || filteredForm["J'aime poser des questions difficiles pour aller au fond des choses."]}</p>
            <p>J'aime créer des choses qui n'ont jamais été vues auparavant, en laissant libre cours à mon imagination :</p><p>{filteredForm['23. [ J’aime créer des choses qui n’ont jamais été vues auparavant, en laissant libre cours à mon imagination. ]'] || filteredForm["J'aime créer des choses qui n'ont jamais été vues auparavant, en laissant libre cours à mon imagination."]}</p>
            <p>J'aime être une personne reconnu pour surmonter les obstacles :</p><p>{filteredForm['23. [ J’aime être une personne reconnu pour surmonter les obstacles. ]'] || filteredForm["J'aime être une personne reconnu pour surmonter les obstacles."]}</p>
            <p>J'aime être la personne sur qui l'on peut compter dans les moments difficiles pour maintenir l'harmonie collective :</p><p>{filteredForm['23. [ J’aime être la personne sur qui l’on peut compter dans les moments difficiles pour maintenir l’harmonie collective. ]'] || filteredForm["J'aime être la personne sur qui l'on peut compter dans les moments difficiles pour maintenir l'harmonie collective."]}</p>

            <h3>Question 24:</h3>
            <p>J'aime provoquer des changements profonds et durables chez les autres :</p><p>{filteredForm['24. [ J’aime provoquer des changements profonds et durables chez les autres. ]'] || filteredForm["J'aime provoquer des changements profonds et durables chez les autres."]}</p>
            <p>J'aime vivre des moments intenses de connexion et de partage avec ceux que j'aime :</p><p>{filteredForm['24. [ J’aime vivre des moments intenses de connexion et de partage avec ceux que j’aime. ]'] || filteredForm["J'aime vivre des moments intenses de connexion et de partage avec ceux que j'aime."]}</p>
            <p>J'aime bousculer les règles établies pour provoquer des transformations radicales :</p><p>{filteredForm['24. [ J’aime bousculer les règles établies pour provoquer des transformations radicales. ]'] || filteredForm["J'aime bousculer les règles établies pour provoquer des transformations radicales."]}</p>
            <p>J'aime croire en la bonté des autres et espérer des résultats positifs :</p><p>{filteredForm['24. [ J’aime croire en la bonté des autres et espérer des résultats positifs. ]'] || filteredForm["J'aime croire en la bonté des autres et espérer des résultats positifs."]}</p>

            <h3>Questions à développement:</h3>
            <p>Quelle est ta situation professionnelle actuelle et quelles sont tes aspirations à long terme?</p><p>{filteredForm['Quelle est ta situation professionnelle actuelle et quelles sont tes aspirations à long terme?'] || filteredForm["Quelle est ta situation professionnelle actuelle et quelles sont tes aspirations à long terme?"]}</p>
            <p>Quel a été le plus grand défi que tu as rencontré et comment as-tu réussi à le surmonter ?</p><p>{filteredForm['Quel a été le plus grand défi que tu as surmonté, et comment as-tu réussi à le surmonter ?'] || filteredForm["Quel a été le plus grand défi que tu as rencontré et comment as-tu réussi à le surmonter ?"]}</p>
            <p>Parle moi d'une réussite dont tu es particulièrement fier(ère)?</p><p>{filteredForm["Parle moi d'une réussite dont tu es particulièrement fier(ère)?"] || filteredForm["Parle moi d'une réussite dont tu es particulièrement fier(ère)?"]}</p>
            

        </div>
    )
}