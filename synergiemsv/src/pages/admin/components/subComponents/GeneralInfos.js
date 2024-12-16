import React, {useState,  useContext} from "react";
import { useParams } from "react-router";
import { AuthContext } from "../../../AuthContext";
import { Link } from "react-router-dom";

export function GeneralInfos({detailsData}) {
    const {info, equipe} = detailsData
    const [modify, setModify] = useState(false)
    const [newInfos, setNewInfos] = useState({
        email : info.email,
        phone: info.phone,
        price_sold: info.price_sold,
        active: info.active,
        additional_infos: info.additional_infos
    })
    const {clientid} = useParams()
    const {user} = useContext(AuthContext)
    
    const handleModify = () => {
        setModify(true)
    }
    
    const handleChange = (e) => {
        const {name, value} = e.target;
        setNewInfos((prev) => ({
            ...prev,
            [name] : value
        }))
    }
    const handleCancel = () => {
        setModify(false)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try{
            const response = await fetch(`http://localhost:3000/api/admin/${user.id}/details/${clientid}`, {
                method : "PUT",
                credentials : "include",
                headers : {
                    "Content-Type" : "application/json"
                },
                body : JSON.stringify({
                    email : newInfos.email,
                    phone: newInfos.phone,
                    price_sold: newInfos.price_sold,
                    active: newInfos.active,
                    additional_infos: newInfos.additional_infos
                })
            });
            if(response.ok){
                console.log(`overview for client ${clientid}data are succesfully updated`)
                setModify(null)
            } else {
                console.log("error while trying to update in the server")
            }
        } catch(error) {
            console.log("couldn't update client details data" , error)
        }
    }

    const teamWithoutLeader = detailsData.equipe.filter(client => client.nom !== detailsData.info.nom_client)
    
    if(!detailsData.equipe) {
        
        return (
        <div className="generalInfos">
           
        {modify ? (<>
             <form onSubmit={handleSubmit} className="modify">
                 <div className="info">
                     <h5>Courriel :</h5>
                     <input type="email" name="email" value={newInfos.email || ""} onChange={handleChange} />
                 </div>
                 <div className="info">
                     <h5>Téléphone :</h5>
                     <input type="phone" name="phone" value={newInfos.phone || ""} onChange={handleChange} />
                 </div>    
                 
                 <div className="infoSup">
                     <h5>Informations supplémentaires :</h5>
                     <textarea type="textarea" name="additional_infos" rows="5" value={newInfos.additional_infos || ""} onChange={handleChange} />
                 </div>
                 
             </form>
             <div className="buttonDetails">
                 <button onClick={handleCancel}>Annuler</button>
                 <button type="submit">Confirmer</button>
             </div>
             </>
        ): (<>
         <div className="infos">
             <div className="info">
                 <h5>Courriel :</h5>
                 <p>{info.email}</p>
             </div>
             <div className="info">
                 <h5>Téléphone :</h5>
                 <p>{info.phone}</p>
             </div>
             
             <div className="infoSup">
                 <h5>Informations supplémentaires :</h5>
                 <p>{info.additional_infos}</p>
             </div>
             
         </div>
         <div className="buttonDetails">
             <button onClick={handleModify}>Modifier</button>
         </div>
         </>)}   
          
     </div>

 )
    }


    return(
        <div className="generalInfos">
           
           {modify ? (<>
                <form onSubmit={handleSubmit} className="modify">
                    <div className="info">
                        <h5>Courriel :</h5>
                        <input type="email" name="email" value={newInfos.email || ""} onChange={handleChange} />
                    </div>
                    <div className="info">
                        <h5>Téléphone :</h5>
                        <input type="phone" name="phone" value={newInfos.phone || ""} onChange={handleChange} />
                    </div>    
                    <div className="info">
                        <h5>Montant de la vente :</h5>
                        <input type="float" name="price_sold" value={newInfos.price_sold || ""} onChange={handleChange} />
                    </div>
                    <div className="info">
                        <h5>Date Échéance :</h5>
                        <input type="date" name="echeance" value={newInfos.echeance || ""} onChange={handleChange} />
                    </div>
                    <div className="info">
                        <h5>Actif ?</h5>
                        <select name="active" value={newInfos.active || ""} onChange={handleChange}>
                                <option value={true}>Oui</option>
                                <option value={false}>Non</option>
                        </select>
                    </div>
                    <div className="infoSup">
                        <h5>Informations supplémentaires :</h5>
                        <textarea type="textarea" name="additional_infos" rows="5" value={newInfos.additional_infos || ""} onChange={handleChange} />
                    </div>
                    
                </form>
                <div className="buttonDetails">
                    <button onClick={handleCancel}>Annuler</button>
                    <button type="submit">Confirmer</button>
                </div>
                </>
           ): (<>
            <div className="infos">
                <div className="info">
                    <h5>Courriel :</h5>
                    <p>{info.email}</p>
                </div>
                <div className="info">
                    <h5>Téléphone :</h5>
                    <p>{info.phone}</p>
                </div>
                <div className="info">
                    <h5>Montant de la vente :</h5>
                    <p>{info.price_sold} $</p>
                </div>    
                <div className="info">
                    <h5>Date Échéance :</h5>
                    <p>{info.echeance}</p>
                </div>
                <div className="info">
                    <h5>Actif ?</h5>
                    <p>{info.active ? "Oui" : "Non"}</p>
                </div>
                <div className="infoSup">
                    <h5>Informations supplémentaires :</h5>
                    <p>{info.additional_infos}</p>
                </div>
                
            </div>
            <div className="buttonDetails">
                <button onClick={handleModify}>Modifier</button>
            </div>
            </>)}   
            <>
            <h2>Équipe:</h2>
            <div className="team">
                
                {detailsData.equipe.length >0? (teamWithoutLeader.map(teamMate => (
                    <Link to={`/admin/${user.id}/details/${teamMate.id}`} key={teamMate.id} >
                        <h4>{teamMate.nom}</h4>
                        <div className="userInfo">
                            <p>Courriel: </p>
                            <p>{teamMate.email}</p>
                        </div>
                        <div className="userInfo">
                            <p>Téléphone: </p>
                            <p>{teamMate.phone}</p>
                        </div>
                    </Link>
                ))) : ("N'a pas d'équipe présentement")}
            </div>
            </>  
        </div>

    )
}