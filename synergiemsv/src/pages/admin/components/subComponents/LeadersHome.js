import React, {useContext, useState,useEffect} from "react";
import { Link } from "react-router-dom";
import "../../../pages.css"
import { AuthContext } from "../../../AuthContext";
import { AdminContext } from "../../AdminContext";
import iconeProfile from "../../../../Images/iconeProfile.jpg"


export function LeadersHome () {
    const [active, setActive] = useState(true)
    const [modifyId, setModifyId] = useState(null);
    const {profilePhotos, setClientsData, clientsData, leadersData} = useContext(AdminContext)
    const [search, setSearch] = useState("")
    
    console.log("profilePhotos =", profilePhotos)
    
    
    const [newInfos, setNewInfos] = useState(clientsData)
    const {user} = useContext(AuthContext)

    /*useEffect(()=> {
        if(clientsData.date_presentation !== newInfos.date_presentation || clientsData.echeance !== newInfos.echeance || clientsData.active !== newInfos.active || clientsData.priorite !== newInfos.priorite){
            setClientsData(prev => ({
                ...prev,
                date_presentation : newInfos.date_presentation,
                echeance : newInfos.echeance,
                active: newInfos.active,
                priorite : newInfos.priorite

            }))
    }},[newInfos, clientsData])*/

   
    useEffect(()=> {
        if(modifyId) {
            const leaderData = clientsData.find(leader => leader.id === Number(modifyId))
            console.log("leaderData:", leaderData)
            if (!leaderData) {
                console.error(`Leader with id ${modifyId} not found`);
                return;
              }
            setNewInfos({
                date_presentation : leadersData.date_presentation,
                echeance : leaderData.echeance,
                
                priorite : leaderData.priorite,
                active: leaderData.active
            })
            
        }
    }, [modifyId])
    

    const apiUrl = process.env.REACT_APP_RENDER_API || 'http://localhost:3000';

    const handleClick = (e) =>{
        const leaderID = e.target.getAttribute("data-id")
        //const clientFound = clientsData.find(client => client.id === Number(leaderID))
        setModifyId(leaderID)
    }

    const handleCancelButton = () =>{
        setModifyId(null)
    }

    const handleCheck = () =>{
        
        setActive(!active)
        
        
    }
    const handleChange = (e) => {
        const {name, value} = e.target;
        console.log("name:", name, "value,", value)
        setNewInfos(prev => ({
            ...prev,
            [name] : value,
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
                    id : modifyId,
                    date_presentation: newInfos.date_presentation,
                    echeance: newInfos.echeance,
                    
                    priorite: newInfos.priorite,
                    active: newInfos.active
                    

                })
            });
            if(response.ok){
                console.log(`overview for leaderId ${modifyId}data are succesfully updated`)
                
                setClientsData(prev => prev.map(client => client.id === Number(modifyId) ? {...client, ...newInfos} : client))
                setModifyId(null)
            } else {
                console.log("error while trying to update in the server")
            }
        } catch(error) {
            console.log("couldn't update leader overview data" , error)
        }
    }
    
    const handleSearch = (e) => {
        const {value} = e.target
        setSearch(value.toLowerCase())
    }

    console.log("newInfos", newInfos)

    const leadersActif = clientsData.filter(leader => leader.active !== undefined && leader.active === active);
    const clientSearched = leadersActif.filter(client => client.nom.toLowerCase().includes(search))

    return (
        <div className="leadersHome">
            <h2>Mes clients!</h2>
             <div className="input">  
                <input id = "active" type="checkbox" checked={!active} onChange={handleCheck} />
                <label htmlFor="active">Voir les clients inactifs</label>
                <label htmlFor="search">Recherchez votre client</label>
                <input name="search" type="search" onChange={handleSearch} value={search} />
            
            </div> 
            {clientSearched.map((leader) => (
                modifyId == leader.id ? (
                    <form className="leadersList" onSubmit={handleSubmit}>
                        <div className="info">
                            <img className="imgSmall" src={profilePhotos[leader.nom] || iconeProfile} alt={leader.nom} />
                        </div>
                        <div className="info">
                        <h4>Client</h4>
                        <p>{leader.nom}</p> 
                        </div>    
                        
                        <div className="info">
                            <h4>Statut</h4>
                            <select className="c" name="active" value={newInfos.active !== undefined ? newInfos.active : leader.active || false} onChange={handleChange}>
                                <option value={true} >Actif</option>
                                <option value={false}>Inactif</option>
                            </select>
                            
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
                            <img className="imgSmall" src={profilePhotos[leader.nom] || iconeProfile} alt={leader.nom} />
                        </div> 
                        <div className="info">
                            <h4>Client</h4>
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
                            <p>{leader.date_presentation ? new Date(leader.date_presentation).toLocaleDateString('en-CA') : "Date non définie"} </p>
                        </div>
                        <div className="info">
                            <h4>Échéance</h4>
                            <p>{leader.echeance ? new Date(leader.echeance).toLocaleDateString('en-CA') : "Date non définie"} </p>
                        </div>
                        
                        <button className="e" data-id={leader.id} name="modify" onClick={handleClick}>Modifier</button>
                    </div>
                )))}
        </div>
    );
}

