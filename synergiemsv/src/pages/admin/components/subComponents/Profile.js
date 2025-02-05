import React, {useState, useRef} from "react";
import { EditableField } from "./editableField";


export function Profile({detailsData}) {
    const [view, setView] = useState(false)
    const {info} = detailsData
    const sectionRef = useRef(null)
    const [newInfo, setNewInfo] = useState({})
    
    const handleClick = () => {
        setView(!view)
        setTimeout(() => {
           
        if (sectionRef.current) {
        sectionRef.current.scrollIntoView({ behavior: "smooth" })
        }},100)
    }

    const handleChange = (fieldName, newValue) => {
        // Logique : faire un setState local ou un appel API
        // Par exemple, si vous stockez `info` dans un state local :
        setNewInfo(prev => ({ ...prev, [fieldName]: newValue }));
    
        // ou un appel : updateInfo(fieldName, newValue);
      }

    if(!detailsData.info.profile_id) {
        return (
            <h3>Il n'y pas de profil présentement disponible!</h3>
        )
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
                <img href={`C:/Users/Guillaume Cloutier/Projets/Projet Synergia/synergiemsv/src/Images/archetypes/${info.archnum2}`} alt="archétype#2"/>

            </div>
            <div className="texteProfile">
                <EditableField
                    label="En bref"
                    name="enbref"
                    value={info.enbref}
                    
                />
                
                
                <EditableField
                    label="Tes forces mis en lumière:"
                    name="forcesenlumieres"
                    value={info.forcesenlumieres}
                    
                />
                
                <EditableField
                    label="Tes défis portentiels:"
                    name="defispotentiels"
                    value={info.defispotentiels}
                    
                />
                
                <EditableField
                    label="Perception du changement:"
                    name="perceptionchangement"
                    value={info.perceptionchangement}
                    
                />
                
                <EditableField
                    label="Perception des relations interpersonnelles :"
                    name="relationsinterpersonnelles"
                    value={info.relationsinterpersonnelles}
                    
                />
                
                <EditableField
                    label="Perception de la structure et de la prévisibilité :"
                    name="perceptionstructure"
                    value={info.perceptionstructure}
                    
                />
               
                <EditableField
                    label="Perceptions des défis, problèmes et difficultés :"
                    name="perceptionproblemes"
                    value={info.perceptionproblemes}
                    
                />
                
                
                <h4>Tes archétypes</h4>
                <EditableField
                    label="Tes motivations naturelle :"
                    name="motivationsnaturelles"
                    value={info.motivationsnaturelles}
                    
                />
                
                <EditableField
                    label=""
                    name="archnum1"
                    value={info.archnum1}
                    
                />
                
                <EditableField
                    label=""
                    name="textarch1"
                    value={info.textarch1}
                    
                />
                
                <EditableField
                    label=""
                    name="archnum2"
                    value={info.archnum2}
                    
                />
                
                <EditableField
                    label="En bref"
                    name="textarch2"
                    value={info.textarch2}
                    
                />
                
                <EditableField
                    label="Toi et le marché du travail"
                    name="toitravail"
                    value={info.toitravail}
                    
                />
                
                <EditableField
                    label="S'adapter au rouge"
                    name="adapterouge"
                    value={info.adapterouge}
                    
                />
                
                <EditableField
                    label="S'adapter au bleu"
                    name="adaptebleu"
                    value={info.adaptebleu}
                    
                />
                
                <EditableField
                    label="S'adapter au vert"
                    name="adaptevert"
                    value={info.adaptevert}
                    
                />
                
                <EditableField
                    label="S'adapter au jaune"
                    name="adaptejaune"
                    value={info.adaptejaune}
                    
                />
                
                                
                
                
            </div>
            </>
            ) : null}

        </div>
    )
}