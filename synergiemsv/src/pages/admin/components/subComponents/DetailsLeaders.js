import React, {useContext, useState}from "react";


import { Link } from "react-router-dom";
import { AdminContext } from "../../AdminContext";

export function DetailsLeaders({}) {
   const [searchQuery, setSearchQuery] = useState("")
   const { leadersData, clientsData} = useContext(AdminContext)
   
    if(!leadersData) {
        return <h2>...loading</h2>
    }


    const handleSearch = (e) => {
        const {value} = e.target
        setSearchQuery(value.toLowerCase())
    }
    
    return(
        <div className="detail">
            <h3>Liste des leaders:</h3>
            <div className="search"> 
                    <label htmlfor="search" >Rechercher : </label>
                    <input name="search" onChange={handleSearch} type="search" value={searchQuery} />
            </div>
                <div className="detailsLeader">
                
                    {leadersData.filter(leader => leader.nom.toLowerCase().includes(searchQuery)).map(leader => (
                        <Link  to={`${leader.clientid}`}><div style={{backgroundColor:'#FDEEFF'}} className="detailsLeaders" key={leader.leader_id}>
                            <h4>{leader.nom}</h4>
                            

                        </div></Link>
                    ))}
                </div>
            <h3>Liste des clients:</h3>
                <div className="detailsLeader">
                    {clientsData.filter(client => client.nom.toLowerCase().includes(searchQuery)).map(client => (
                            <Link to={`${client.id}`}><div className="detailsLeaders" key={client.id}>
                                <h4>{client.nom}</h4>
                                

                            </div></Link>
                    ))}
                </div>
        </div>
    )
}