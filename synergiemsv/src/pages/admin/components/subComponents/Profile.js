import React, {useState, useRef} from "react";


export function Profile({detailsData}) {
    const [view, setView] = useState(false)
    const {info} = detailsData
    const sectionRef = useRef(null)
    
    const handleClick = () => {
        setView(!view)
        setTimeout(() => {
           
        if (sectionRef.current) {
        sectionRef.current.scrollIntoView({ behavior: "smooth" })
        }},100)
    }

    return(
        <div className="profile">
            <button ref={sectionRef} onClick={handleClick}>Voir profil</button>
            {view ? (
                
            <>
            <h2 >Profil Synergia :</h2>
            <h4>Couleurs:</h4>
            <div className="couleur">
                <h6 className="bleu">Bleu</h6> 
                <h6 className="vert">Vert</h6> 
                <h6 className="jaune">Jaune</h6> 
                <h6 className="rouge">Rouge</h6> 
                <p>{info.bleu}</p>
                <p>{info.vert}</p>
                <p>{info.jaune}</p>
                <p>{info.rouge}</p>

            </div>
            <h4>Vos deux pricipaux archétypes:</h4>
            <div className="archetype">
                
                <p>{info.archnum1}</p>
                <p>{info.archnum2}</p>
                <img href={`C:/Users/Guillaume Cloutier/Projets/Projet Synergia/synergiemsv/src/Images/archetypes/${info.archnum1}`} alt="archétype#1"/>
                <img href={`C:/Users/Guillaume Cloutier/Projets/Projet Synergia/synergiemsv/src/Images/archetypes/${info.archnum2}`} alt="archétype#1"/>

            </div>
            <div className="texteProfile">
                <h5>En bref :</h5>
                <p>{info.enbref}</p>
                <h5>Tes forces mis en lumière:</h5>
                <p>{info.forcesenlumieres}</p>
                <h5>Tes défis portentiels:</h5>
                <p>{info.defispotentiels}</p>
                <h5>Perception du changement:</h5>
                <p>{info.perceptionchangement}</p>
                <h5>Perception des relations interpersonnelles :</h5>
                <p>{info.relationsinterpersonnelles}</p>
                <h5>Perception de la structure et de la prévisibilité :</h5>
                <p>{info.perceptionstructure}</p>
                <h5>Perceptions des défis, problèmes et difficultés :</h5>
                <p>{info.perceptionproblemes}</p>
                <h4>Tes archétypes</h4>
                <h5>Tes motivations naturelle :</h5>
                <p>{info.motivationsnaturelles}</p>
                <h5>{info.archnum1}</h5>
                <p>{info.textarch1}</p>
                <h5>{info.archnum2}</h5>
                <p>{info.textarch2}</p>
                <h5>Toi et le marché du travail</h5>
                <p>{info.toitravail}</p>
                <h5>S'adapter au rouge</h5>
                <p>{info.adapterouge}</p>
                <h5>S'adapter au bleu</h5>
                <p>{info.adaptebleu}</p>
                <h5>S'adapter au vert</h5>
                <p>{info.adaptevert}</p>
                <h5>S'adapter au jaune</h5>
                <p>{info.adaptejaune}</p>
                <p></p>
            </div>
            </>
            ) : null}

        </div>
    )
}