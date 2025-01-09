import React, {useEffect, useState} from "react";
import { useParams } from "react-router";


export function ClientObjectifs ({user, objectifsData, apiUrl, category}) {
    
    const [modify, setModify] = useState(false)
    const [value, setValue]= useState((objectifsData && objectifsData[category]) || "")
    const [valueTitre, setValueTitre] = useState((objectifsData && objectifsData[category+"_titre"]) || "")
    const {clientid} = useParams();
    
    
    
    

    const handleModify = (e) => {
            setModify(!modify)
        }
    
    const handleSubmit = async(e) => {
        console.log("objectifsData", objectifsData)
            
        if(objectifsData && objectifsData.objectifs_id){
            try {
                console.log("sending data to update objectif", value)
                const response = await fetch(`${apiUrl}/api/admin/${user.id}/objectifs/${clientid}`, {
                    method: "PUT",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        category: category,
                        value: value,
                        titre: valueTitre
                    })
                });
                if(response.ok) {
                    console.log("Objectifs mis à jour avec succès!");
                    setModify(false);
                    return
                }
    
            } catch(error) {
                console.log("erreur en mettan à jour l'objectifs", error)
            }
        }
        try {
            console.log("sending data to create objectifs. user.id", user.id, "clientid", clientid)

            const response = await fetch(`${apiUrl}/api/admin/${user.id}/objectifs/${clientid}`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    category: category,
                    value: value,
                    titre: valueTitre

                })
            });
            if(response.ok) {
                console.log("Objectifs crée avec succès!");
                setModify(false);
            }

        } catch(error) {
            console.log("erreur en ajoutant l'objectifs", error)
        }

        

    }

    const handleTitreChange = (e) => {
        const {value} = e.target
        setValueTitre(value)
    }

    const handleChange = (e) => {
        const {value} = e.target
        setValue(value)
    }
    
    let titre = ""
    switch (category) {
        
        
        case "objectifs":
            titre = "Objectifs";
        break;
        case "actions":
            titre = "Actions";
        break;
        case "new_ideas":
            titre="Idées nouvelles";
        break;
        case "section1":
            const titreSection = category+"_titre";
            (objectifsData && objectifsData.objectifs_id) ? (titre = objectifsData[titreSection]) : (titre = "Orientation du contenu");
        break;
        case "section2":
            const titreSection2 = category+"_titre";
            (objectifsData && objectifsData.objectifs_id) ? (titre = objectifsData[titreSection2]) : (titre = "Stratégie de prospection");
        break;
        default:
            titre= "Autre catégories";
        break;

    }
    
    if(objectifsData && objectifsData.objectifs_id ) {
        console.log("data category:", objectifsData[category] )
        
        return(
            <div>
                {modify ? (
                    <div className="clientObjectifs">
                    <div className="sectionTitre">
                        {category === "section1" || category === "section2" ? (
                            <input type="text" value={valueTitre} name="titre" onChange={handleTitreChange} placeholder={valueTitre || titre}/>
                        ) : (
                        <h2 className="titre">{titre}</h2>
                        )}
                        <div className="modifyButton">
                            <button onClick={handleModify}>Annuler</button>
                            <button onClick={handleSubmit}>Confirmer</button>
                        </div>
                    </div>
                <textarea value={value} onChange={handleChange} />

            </div>
                ):(
                    <div className="clientObjectifs">
                        <h2 className="titre">{titre}</h2>
                        
                        <p  onClick={handleModify}>{objectifsData[category]}</p>
                    </div>
                )}
            </div>
        )
    }

    
    

    return(
        <div>
            {modify ? (
                <div className="clientObjectifs">
                    <div className="sectionTitre">
                        {category === "section1" || category === "section2" ? (
                            <input type="text" value={valueTitre} name="titre" onChange={handleTitreChange} placeholder={valueTitre || titre}/>
                        ) : (
                        <h2 className="titre">{titre}</h2>
                        )}
                        <div className="modifyButton">
                            <button onClick={handleModify}>Annuler</button>
                            <button onClick={handleSubmit}>Confirmer</button>
                        </div>
                    </div>
                <textarea value={value} onChange={handleChange} placeholder="Veuillez écrire votre objectif!"/>

            </div>
        ):(
                <div className="clientObjectifs">
                    <h2 className="titre">{titre}</h2>
                    
                    <p onClick={handleModify}>Les objectifs ne sont pas encore déterminés!</p>
                </div>
        )}
        </div>
    )
}