import React from "react";

import { Link } from "react-router-dom";

export function DetailsLeaders({clientsData, leadersData}) {
   
   
    if(!leadersData) {
        return <h2>...loading</h2>
    }
    
    return(
        <div className="detail">
            <h3>Liste des leaders:</h3>
                <div className="detailsLeader">
                
                    {leadersData.map(leader => (
                        <Link  to={`${leader.client_id}`}><div style={{backgroundColor:'#FDEEFF'}} className="detailsLeaders" key={leader.leader_id}>
                            <h4>{leader.nom}</h4>
                            

                        </div></Link>
                    ))}
                </div>
            <h3>Liste des clients:</h3>
                <div className="detailsLeader">
                    {clientsData.map(client => (
                            <Link to={`${client.id}`}><div className="detailsLeaders" key={client.id}>
                                <h4>{client.nom}</h4>
                                

                            </div></Link>
                    ))}
                </div>
        </div>
    )
}