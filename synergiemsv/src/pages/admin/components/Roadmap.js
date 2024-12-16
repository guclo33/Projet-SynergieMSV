import React, {useState, useEffect, useContext} from "react";
import { useParams, useLocation } from "react-router";
import { AuthContext } from "../../AuthContext";
import { Link } from "react-router-dom";


export function Roadmap() {
    const [roadmapPrepData, setRoadmapPrepData] = useState([])
    const [roadmapExecData, setRoadmapExecData] = useState([])
    const [showDone, setShowDone] = useState(false)
    const {leaderid} = useParams()
    const {user} = useContext(AuthContext)
    const location = useLocation()

    

    useEffect(() => {
        const getRoadmapData = async () => {
            try {
                const response = await fetch(`http://localhost:3000/api/admin/${user.id}/roadmap`, {
                    method: "GET",
                    credentials: "include",
                    });
                    if(response.ok){
                        const data = await response.json();
                        console.log("here's roadmap data", data.rows)
                        const dataArrayPreparation = data.rows.map((row) => ( {
                            nom: row.nom,
                            leader_id : row.leader_id,
                            "Création du groupe messenger" : row.creation_messenger,
                            "Date confirmée": row.date_confirme,
                            "Questionnaires et Consignes envoyés": row.questionnaire_envoye,
                            "Création Zoom": row.creation_zoom,
                            "Envoie des factures": row.envoie_factures,
                            "Réception du paiement": row.recept_paiement,
                            "Comptabilité à jour": row.comptabilite,
                            "Rédaction profils": row.redaction_profil,
                            "Profil Leader": row.profil_leader,
                            "Tout importer, prêt à partager": row.pret_partage,
                            "Présentation powerpoint": row.powerpoint,
                            "Mentimeter": row.mentimeter,
                            
                        }));

                        const dataArrayExecution = data.rows.map((row) => ( {
                            nom:row.nom,
                            leader_id : row.leader_id,
                            "Planification des rencontres 1": row.planif_rencontres1,
                            "Envoie du questionnaire Introspection": row.envoie_introspection,
                            "Rencontres 1": row.rencontres1,
                            "Planification des rencontres 2": row.planif_rencontres2,
                            "Envoie des questionnaires objectifs": row.envoie_questionnaire_objectifs,
                            "Rencontre 2": row.rencontres2,
                            "Rencontre leader, profiles des autres": row.leader_profil_autres,
                            "Rencontre leader, S'adapter": row.leader_adapter,
                            "Rencontre leader, Suivi": row.leader_suivi
                        }));
                        console.log("preparation :", dataArrayPreparation)
                        console.log("execution :",dataArrayExecution)
                        setRoadmapPrepData(dataArrayPreparation);
                        setRoadmapExecData(dataArrayExecution)
                        
                        
                        
                        
                    } else {
                        const errorText = await response.text();
                        console.error("Error response from server:", errorText)
                };
            } catch(error) {
                console.error("Could not connect to getRoadmapData", error)
            }
        }
        if (!user || !user.id) {
            console.error("User ID is undefined");
            return;
        }
        
        

        getRoadmapData()
    }, [roadmapExecData, roadmapPrepData])
    
    if (!roadmapPrepData || !roadmapExecData) {
        return <p>Loading...</p>;
    }

    let filteredObjectPrep = {};
    
    let filteredObjectExec = {};
    
    let prepTrueArray = [];

    let prepFalseArray = [];

    let execTrueArray = [];

    let execFalseArray = [];

    let prepArray = [];
    let execArray = [];

    
    if(leaderid) {
        
        filteredObjectPrep = roadmapPrepData.find(leader => leader.leader_id == leaderid);
        
        
        filteredObjectExec = roadmapExecData.find(leader => leader.leader_id == leaderid);
        
        if(filteredObjectPrep) {
            prepArray = Object.entries(filteredObjectPrep)
        }
        if(filteredObjectExec) {
            execArray = Object.entries(filteredObjectExec)
        }
        prepTrueArray = prepArray.filter(([key, value]) => value === true)
        
        prepFalseArray = prepArray.filter(([key, value]) =>  value === false)
        
        execTrueArray = execArray.filter(([key, value]) =>  value === true)

        execFalseArray = execArray.filter(([key, value]) =>  value === false)
    }
    
    const handleButton = () => {
        setShowDone(!showDone)
    }

    const handleClick = async (e) => {
        
        const {value} = e.target
        const {name} = e.target

        const newValue = value === "true" ? false : true
        
        try{
            const response = await fetch(`http://localhost:3000/api/admin/${user.id}/roadmap`, {
                method: "PUT",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body : JSON.stringify({
                    value: newValue,
                    name: name,
                    leaderid : leaderid
                })
            });
            if(response.ok){
                console.log(`succesfully updated ${name} with ${value}`)

            } else {
                console.log("could not update the task")
            }
        } catch(error) {
            console.log("error updating todo list", error)
        }
    }
    

   /* const handleNewTask = async() => {

    }*/
    
    if (!filteredObjectPrep || !roadmapPrepData || !roadmapExecData) {
        return <p>Loading...</p>;
    }

    return(
        <div className="roadmap">
            <h2>Feuille de route</h2>
           
                {leaderid ? (
                    <div className="todoList">
                            <h2>{filteredObjectPrep.nom}</h2>
                            <h3>Préparation</h3>
                            <div key={filteredObjectPrep.leader_id} >
                                <div className="preparation">
                                {prepFalseArray.map(([key, value]) => (
                                    <div key={key} className="todo">
                                        <label htmlFor={key}>{key}</label>
                                        <input name={key} value={value} type="checkbox" checked={Boolean(value)} onChange={handleClick}/>
                                        
                                    </div>
                            ))}
                            </div>
                            {showDone && (
                            <div className="done">
                                <h3 className="tacheComplete">Tâches complétées</h3>
                                <div className="doneChecklist">
                                {prepTrueArray.map(([key, value]) => (
                                    <div key={key} className="todo">
                                        <label htmlFor={key}>{key}</label>
                                        <input 
                                            name={key} 
                                            value={value} 
                                            type="checkbox" 
                                            checked={value} 
                                            onChange={handleClick} 
                                        />
                                    </div>
                                ))}
                                </div>
                            </div>
                        )}
                        </div>
                        <div className="execution">
                            <h3>Exécution</h3>
                            <div className="execContainer">
                                {execFalseArray.map(([key, value]) => (
                                    <div key={key} className="todo">
                                        <label htmlFor={key}>{key}</label>
                                        <input name={key} value={value} type="checkbox" checked={value} onChange={handleClick} />
                                    </div>
                                ))}
                            </div>
                            {showDone && (
                                <div className="executionDone">
                                    <h3 className="tacheComplete">Tâches complétées</h3>
                                    <div className="execDoneChecklist">
                                    {execTrueArray.map(([key, value]) => (
                                
                                        <div key={key} className="todo">
                                            <label htmlFor={key}>{key}</label>
                                            <input name={key} value={value} type="checkbox" checked={value} onChange={handleClick} />
                                        </div>
                                ))}
                                </div>
                                </div>
                            )}
                        </div>
                        <div className="overviewButton">
                            <button className="showDone" name="showDone" onClick={handleButton}>Voir tâches complétées</button>
                            
                        </div>
                    </div> ): 
                        (
                            
                            <div className="leadersMap">    
                                {roadmapPrepData.map(leader => (
                                <div className="leader" key={leader.leader_id}>
                                    <h4><Link to={`${leader.leader_id}`}>{leader.nom}</Link></h4>
                                </div> ))}
                            </div>    
                                
                        )}

                            
                
                  
            
        
    </div>
    )
}

/*<button className="newTask" name="newTask" onClick={handleNewTask}>Créer une nouvelle tâche</button>*/