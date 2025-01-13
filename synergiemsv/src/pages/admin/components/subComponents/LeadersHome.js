import React, {useContext, useState,useEffect} from "react";
import { Link } from "react-router-dom";
import "../../../pages.css"
import { AuthContext } from "../../../AuthContext";

export function LeadersHome ({ adminHomeData})  {
    const [active, setActive] = useState(true)
    const [modifyId, setModifyId] = useState(null);
    
    
    
    const [newInfos, setNewInfos] = useState({
        date_presentation : adminHomeData.date_presentation,
        echeance : adminHomeData.echeance,
        statut: adminHomeData.statut,
        priorite : adminHomeData.priorite,
        active: adminHomeData.active
    })
    const {user} = useContext(AuthContext)

   
    useEffect(()=> {
        if(modifyId) {
            const leaderData = adminHomeData.find(leader => leader.id === Number(modifyId))
            console.log("leaderData:", leaderData)
            if (!leaderData) {
                console.error(`Leader with id ${modifyId} not found`);
                return;
              }
            setNewInfos({
                date_presentation : leaderData.date_presentation,
                echeance : leaderData.echeance,
                statut: leaderData.statut,
                priorite : leaderData.priorite,
                active: leaderData.active
            })
            
        }
    }, [])
    

    const apiUrl = process.env.REACT_APP_RENDER_API || 'http://localhost:3000';

    const handleClick = (e) =>{
        const leaderID = e.target.getAttribute("data-id")
        setModifyId(leaderID)
    }

    const handleCancelButton = () =>{
        setModifyId(null)
    }

    const handleCheck = () =>{
        
        setActive(!active)
        
        
    }
    const handleChange = (e) => {
        const {name, value, type, checked} = e.target;
        console.log("name:", name, "value,", value)
        setNewInfos(prev => ({
            ...prev,
            [name] : type === "checkbox" ? checked : value,
        }))

    }

    const handleSubmit = async (e) =>  {
        e.preventDefault()
        console.log("data envoyé:", newInfos)
        try{
            const response = await fetch(`${apiUrl}/api/admin/${user.id}/overview`, {
                method : "PUT",
                credentials : "include",
                headers : {
                    "Content-Type" : "application/json"
                },
                body : JSON.stringify({
                    leader_id : modifyId,
                    date_presentation: newInfos.date_presentation,
                    echeance: newInfos.echeance,
                    statut: newInfos.statut,
                    priorite: newInfos.priorite,
                    active: newInfos.active
                    

                })
            });
            if(response.ok){
                console.log(`overview for leaderId ${modifyId}data are succesfully updated`)
                setModifyId(null)
            } else {
                console.log("error while trying to update in the server")
            }
        } catch(error) {
            console.log("couldn't update leader overview data" , error)
        }
    }

    const leadersActif = adminHomeData.filter(leader => leader.active !== undefined && leader.active === active);

    return (
        <div className="leadersHome">
            <h2>Mes leaders!</h2>
             <div className="input">  
                <input id = "active" type="checkbox" checked={!active} onChange={handleCheck} />
                <label htmlFor="active">Voir les leaders inactifs</label>
            </div> 
            {leadersActif.map((leader) => (
                modifyId == leader.id ? (
                    <form className="leaderHome" onSubmit={handleSubmit}>
                        
                        <div className="info">
                        <h4>Leader</h4>
                        <p>{leader.nom}</p> 
                        </div>    
                        
                        <div className="info">
                            <h4>Statut</h4>
                            <input type="checkbox" name="active"  value={newInfos.active}
                            checked={newInfos.active} onChange={handleChange}/>
                        </div>

                        <div className="info">
                            <h4>Priorité</h4>
                            <select className="d" name="priorite" value={newInfos.priorite || leader.priorite || ""} onChange={handleChange}>
                                <option value="Faible">Faible</option>
                                <option value="Moyenne">Moyenne</option>
                                <option value="Élevé">Élevé</option>
                            </select>
                        </div>

                        <div className="info">
                            <h4>Date présentation</h4>
                            <input className="a" type="datetime-local" name="date_presentation" value={newInfos.date_presentation || leader.date_presentation || ""} onChange={handleChange} />
                        </div>

                        <div className="info">
                            <h4>Échéance</h4>
                            <input className="b" type="date" name="echeance" value={newInfos.echeance || leader.echeance || ""}  onChange={handleChange} />
                        </div>

                        <div className="e">
                            <button onClick={handleCancelButton}>Annuler</button>
                            <button type="submit" name="modify">Confirmé</button>
                        </div>        
                </form>
                ):(
                    <div className="leadersList" key={leader.id}>   
                        <div className="info">
                            <h4>Leader</h4>
                            <p><Link to={`roadmap/${leader.id}`}>{leader.nom}</Link></p>
                        </div>
                        <div className="info">
                            <h4>Status</h4>
                            {leader.active ? <p>Actif</p> : <p>Inactif</p>}
                        </div>
                        <div className="info">
                            <h4>Priorité</h4>
                            <p>{leader.priorite || "non enregistré"} </p>
                        </div>
                        <div className="info">
                            <h4>Date Présentation</h4>
                            <p>{new Date(leader.date_presentation).toLocaleDateString('en-CA')} </p>
                        </div>
                        <div className="info">
                            <h4>Échéance</h4>
                            <p>{new Date(leader.echeance).toLocaleDateString('en-CA') || "non enregistré"} </p>
                        </div>
                        
                        <button className="e" data-id={leader.id} name="modify" onClick={handleClick}>Modifier</button>
                    </div>
                )))}
        </div>
    );
}

