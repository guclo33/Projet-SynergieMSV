import React, {useEffect, useState, useContext} from "react";
import { AuthContext } from "../../AuthContext";
import { Link } from "react-router-dom";

export function Overview() {
    const [overviewData, setOverviewData] = useState([])
    const [modifyId, setModifyId] = useState(null);
    const [newInfos, setNewInfos] = useState({
        date_presentation : overviewData.date_presentation,
        echeance : overviewData.echeance,
        statut: overviewData.statut,
        priorite : overviewData.priorite,
        client_id: overviewData.client_id
    })

    const {user} = useContext(AuthContext)

    useEffect(() => {
        const getOverviewData = async () => {
            try {
                const response = await fetch(`http://localhost:3000/api/admin/${user.id}/overview`, {
                    method: "GET",
                    credentials: "include",
                    });
                    if(response.ok){
                        const data = await response.json();
                        console.log("here's data", data.rows)
                        const dataArray = data.rows.map((row) => ( {
                            leader_id: row.leader_id,
                            nom: row.nom,
                            date_presentation: row.date_presentation,
                            echeance: row.echeance,
                            statut: row.statut,
                            priorite: row.priorite,
                            client_id: row.client_id
                        }));
                        console.log("dataArray:", dataArray)
                        setOverviewData(dataArray)
                        console.log("overviewData:", overviewData)
                        
                        
                    } else {
                        const errorText = await response.text();
                        console.error("Error response from server:", errorText)
                };
            } catch(error) {
                console.error("Could not connect to getadminhomedata", error)
            }
        }

        

        getOverviewData();
        
    }, [])
    
    const handleClick = (e) =>{
        const leaderID = e.target.getAttribute("data-id")
        setModifyId(leaderID)
    }

    const handleChange = (e) => {
        const {name, value} = e.target;
        setNewInfos(prev => ({
            ...prev,
            [name] : value
        }))

    }

    const handleCancelButton = () =>{
        setModifyId(null)
    }

    const handleSubmit = async (e) =>  {
        e.preventDefault()
        
        try{
            const response = await fetch(`http://localhost:3000/api/admin/${user.id}/overview`, {
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
                    priorite: newInfos.priorite
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
    
    return(
        <div className="Overview">
            <h2>Tableau de bord: vue d'ensemble</h2>
            <div className="label">
                <h5 className="a">Date de présentation :</h5>
                <h5 className="b">Date d'échéance :</h5>
                <h5 className="c">Statut :</h5>
                <h5 className="d">Priorité :</h5>
            </div>
            
            {overviewData.map(leader => (
                modifyId == leader.leader_id ? (
                    <form onSubmit={handleSubmit} className="modifyForm">
                        <h4>{leader.nom}</h4>     
                        <input className="a" type="datetime-local" name="date_presentation" value={newInfos.date_presentation || leader.date_presentation || ""} onChange={handleChange} />

                        <input className="b" type="date" name="echeance" value={newInfos.echeance || leader.echeance || ""}  onChange={handleChange} />

                        <select className="c" name="statut" value={newInfos.statut || leader.statut || ""} onChange={handleChange}> 
                            <option value="À faire">À faire</option>
                            <option value="En cours">En cours</option>
                            <option value="Terminé">Terminé</option>
                        </select>

                        <select className="d" name="priorite" value={newInfos.priorite || leader.priorite || ""} onChange={handleChange}>
                            <option value="Faible">Faible</option>
                            <option value="Moyenne">Moyenne</option>
                            <option value="Élevé">Élevé</option>
                        </select>
                        <div className="e">
                            <button onClick={handleCancelButton}>Annuler</button>
                            <button type="submit" name="modify">Confirmé</button>
                        </div>        
                    </form>
                ) : (
                <div className="overviewLeader" key={leader.leader_id}>
                    
                    <Link to={`/admin/${user.id}/details/${leader.client_id}`}><h4>{leader.nom}</h4></Link>
                    
                    <p className="a">{new Date(leader.date_presentation).toLocaleDateString('en-CA')}</p>
                    
                    <p className="b">{new Date(leader.echeance).toLocaleDateString('en-CA')}</p>
                    
                    <p className="c">{leader.statut}</p>
                    
                    <p className="d">{leader.priorite}</p>

                    <button className="e" data-id={leader.leader_id} name="modify" onClick={handleClick}>Modifier</button>
                </div>)
            ))}
        </div>
    )
}