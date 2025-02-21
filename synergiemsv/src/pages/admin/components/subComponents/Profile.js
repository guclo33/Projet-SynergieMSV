import React, {useState, useEffect, useRef, useContext} from "react";
import { EditableField } from "./editableField";
import { AuthContext } from "../../../AuthContext";
import { useParams } from "react-router";


export function Profile({detailsData}) {
    //const [view, setView] = useState(false)
    const {info} = detailsData
    const sectionRef = useRef(null)
    const [newInfo, setNewInfo] = useState({})
    const [modify, setModify] = useState(false)
    const [authUrl, setAuthUrl] = useState("")
    const [newColor, setNewColor] = useState({
        bleu: info.bleu,
        vert : info.vert,
        jaune: info.jaune,
        rouge: info.rouge
    })
    const apiUrl = process.env.REACT_APP_RENDER_API || 'http://localhost:3000'
    const {user} = useContext(AuthContext)
    const {clientid} = useParams()
    const queryString = window.location.search; 

    const urlParams = new URLSearchParams(queryString);

    const authValue = urlParams.get("auth"); // "true" ou null s’il n’y a pas "auth"
    
    
    useEffect(() =>{
            const fetchAuthUrl= async () =>{
                try{
                    const response = await fetch(`${apiUrl}/api/canva/authurl/`, {
                        methode : "GET",
                        credentials: 'include',
                    });
                    const data = await response.json()
                    console.log("authUrl", authUrl)
                    
    
                    setAuthUrl(data.authURL)
                }catch(error){
                    console.error("error fetching authurl", error)
            }};
    
            fetchAuthUrl();
        },[]);

    /*const handleClick = () => {
        setView(!view)
        setTimeout(() => {
           
        if (sectionRef.current) {
        sectionRef.current.scrollIntoView({ behavior: "smooth" })
        }},100)
    }*/

    const handleChange = (e) => {
        const {name, value} = e.target
        setNewColor(prev => ({ ...prev, [name]: Number(value) }));
    
        
      }

    if(!detailsData.info.profile_id) {
        return (
            <h3>Il n'y pas de profil présentement disponible!</h3>
        )
    }

    const handleModify = async () => {
        const accepted = window.confirm("Êtes-vous sûr de vouloir modifier ?")

        if(!accepted) {
            return
        }
        try {
            const response = await fetch(`${apiUrl}/api/admin/${user.id}/details/profileUpdate`, {
                method: "PUT",
                credentials: "include",
                headers: {
                  "Content-Type" : "application/json"
                },
                body : JSON.stringify({
                    
                    value : newColor,
                    profile_id : info.profileid
                })
            });
            if(response.ok){
                console.log("succesfully updated profile")
                setModify(false)
            }

        } catch(error) {
            console.log("couldn't modify profile", error)
        }

        
    }

    const handleCanva = async (e) =>{
        e.preventDefault();
        const currentURL = window.location.href;  // URL actuelle
        const authURLWithState = `${authUrl}&state=${encodeURIComponent(currentURL)}`
        window.location.href = authURLWithState;
    }
    

    
    const generateCanva = async() => {
        try {
            const response = await fetch(`${apiUrl}/api/admin/${user.id}/details/${clientid}`, {
                method: "GET",
                credentials: "include",
                });
                if(response.ok){
                    const data = await response.json();
                    console.log("here's Details", data)
                    const info = data.info
                    console.log("here's Info", info)
                    try {
                        const response = await fetch(`${apiUrl}/api/admin/${user.id}/details/canva/${clientid}`, {
                            method : "POST",
                            credentials:"include",
                            headers: {
                                "Content-Type" : "application/json"
                            },
                            body: JSON.stringify(info)
                        })
                        if(response.ok){
                            console.log("successfully autofill Canva")
                        }
                    }catch(error){
                        console.log("couldn't connect canva")
                    }
                        
                } else {
                    const errorText = await response.text();
                    console.error("Error response from server:", errorText)
            };
        } catch(error) {
            console.error("Could not connect to get details data", error)
        }
    }

    return(
        <div className="profile">
            {!authValue ? <button onClick={handleCanva}>Connecter Canva</button> : null}
            {authValue ? <button onClick={generateCanva}>Générer template Canva</button> : null}
            
            <h2 >Profil Synergia :</h2>
            <h4>Couleurs:</h4>
            <div  className="couleur">
                {modify? 
                <>
                    <h6 className="bleu">Bleu</h6> 
                    <h6 className="vert">Vert</h6> 
                    <h6 className="jaune">Jaune</h6> 
                    <h6 className="rouge">Rouge</h6> 
                    <input name="bleu" value={newColor.bleu} onChange={handleChange} />
                    <input name="vert" value={newColor.vert} onChange={handleChange} />
                    <input name="jaune" value={newColor.jaune} onChange={handleChange} />
                    <input name="rouge" value={newColor.rouge} onChange={handleChange} />
                    <button onClick={handleModify} >Modifier</button>
                    <button onClick={()=>setModify(false)}>Annuler</button>
                </> :
                <>
                    <h6 onClick={()=> setModify(true)} className="bleu">Bleu</h6> 
                    <h6 onClick={()=> setModify(true)} className="vert">Vert</h6> 
                    <h6 onClick={()=> setModify(true)} className="jaune">Jaune</h6> 
                    <h6 onClick={()=> setModify(true)} className="rouge">Rouge</h6> 
                    <p onClick={()=> setModify(true)}>{newColor.bleu}</p>
                    <p onClick={()=> setModify(true)}>{newColor.vert}</p>
                    <p onClick={()=> setModify(true)}>{newColor.jaune}</p>
                    <p onClick={()=> setModify(true)}>{newColor.rouge}</p>
                </>}
                

            </div>
            <h4>Vos deux principaux archétypes:</h4>
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
                    profileId={info.profileid}
                />
                
                
                <EditableField
                    label="Tes forces mis en lumière:"
                    name="forcesenlumieres"
                    value={info.forcesenlumieres}
                    profileId={info.profileid}
                />
                
                <EditableField
                    label="Tes défis portentiels:"
                    name="defispotentiels"
                    value={info.defispotentiels}
                    profileId={info.profileid}
                />
                
                <EditableField
                    label="Perception du changement:"
                    name="perceptionchangement"
                    value={info.perceptionchangement}
                    profileId={info.profileid}
                />
                
                <EditableField
                    label="Perception des relations interpersonnelles :"
                    name="relationsinterpersonnelles"
                    value={info.relationsinterpersonnelles}
                    profileId={info.profileid}
                />
                
                <EditableField
                    label="Perception de la structure et de la prévisibilité :"
                    name="perceptionstructure"
                    value={info.perceptionstructure}
                    profileId={info.profileid}
                />
               
                <EditableField
                    label="Perceptions des défis, problèmes et difficultés :"
                    name="perceptionproblemes"
                    value={info.perceptionproblemes}
                    profileId={info.profileid}
                />
                
                
                <h4>Tes archétypes</h4>
                <EditableField
                    label="Tes motivations naturelle :"
                    name="motivationsnaturelles"
                    value={info.motivationsnaturelles}
                    profileId={info.profileid}
                />
                
                <EditableField
                    label=""
                    name="archnum1"
                    value={info.archnum1}
                    profileId={info.profileid}
                />
                
                <EditableField
                    label=""
                    name="textarch1"
                    value={info.textarch1}
                    profileId={info.profileid}
                />
                
                <EditableField
                    label=""
                    name="archnum2"
                    value={info.archnum2}
                    profileId={info.profileid}
                />
                
                <EditableField
                    label="En bref"
                    name="textarch2"
                    value={info.textarch2}
                    profileId={info.profileid}
                />
                
                <EditableField
                    label="Toi et le marché du travail"
                    name="toitravail"
                    value={info.toitravail}
                    profileId={info.profileid}
                />
                
                <EditableField
                    label="S'adapter au rouge"
                    name="adapterouge"
                    value={info.adapterouge}
                    profileId={info.profileid}
                />
                
                <EditableField
                    label="S'adapter au bleu"
                    name="adaptebleu"
                    value={info.adaptebleu}
                    profileId={info.profileid}
                />
                
                <EditableField
                    label="S'adapter au vert"
                    name="adaptevert"
                    value={info.adaptevert}
                    profileId={info.profileid}
                />
                
                <EditableField
                    label="S'adapter au jaune"
                    name="adaptejaune"
                    value={info.adaptejaune}
                    profileId={info.profileid}
                />
                
                                
                
                
            </div>
            
            

        </div>
    )
}