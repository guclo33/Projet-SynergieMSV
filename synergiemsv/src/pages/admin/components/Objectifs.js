import React from "react";
import { useEffect, useState, useContext  } from "react";
import { AuthContext } from "../../AuthContext";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { ObjectifsById } from "./subComponents/ObjectifsById";

export function Objectifs () {
    const[searchQuery, setSearchQuery] = useState("")
    const [clientsData, setClientsData] = useState([])
    const {clientid} = useParams()
    const {user} = useContext(AuthContext)


    const apiUrl = process.env.REACT_APP_RENDER_API || 'http://localhost:3000';

    useEffect(()=>{
            const getClientsData = async () => {
                try {
                    const response = await fetch(`${apiUrl}/api/admin/${user.id}/details`, {
                        method: "GET",
                        credentials: "include",
                        });
                        if(response.ok){
                            const data = await response.json();
                            
                            
    
                            const clientsArray = data.clientsData.rows.map((row) => ({
                                id: row.id,
                                nom: row.nom_client
                            }))
                            
                            setClientsData(clientsArray)
                            console.log("clientsData",clientsData, "clientsArray", clientsArray, "data", data)
                            
                            
                        } else {
                            const errorText = await response.text();
                            console.error("Error response from server:", errorText)
                    };
                } catch(error) {
                    console.error("Could not connect to getadminhomedata", error)
                }
            }
            
            getClientsData()
            
        }, [])

        

        return (
            <div className="Objectifs">
                {clientid ? <ObjectifsById clientsData={clientsData} clientid={clientid} user={user} apiUrl={apiUrl} /> : 
                <div>
                <h2>Liste des clients:</h2>
                <label htmlfor="search">Recherche</label>
                <input name="search" type="search" value={searchQuery} />
                                <div className="detailsLeader">
                                    {clientsData.map(client => (
                                            <Link to={`${client.id}`}><div className="detailsLeaders" key={client.id}>
                                                <h4>{client.nom}</h4>
                                                
                
                                            </div></Link>
                                    ))}
                                </div> 
                </div>}
            </div>
        )

}