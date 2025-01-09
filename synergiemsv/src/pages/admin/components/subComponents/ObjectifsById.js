import React from "react";
import { useEffect, useState } from "react";
import { Progress } from "./Progress";
import { ClientObjectifs } from "./ClientObjectifs";


export function ObjectifsById ({clientsData, user, clientid, apiUrl}) {
    const [objectifsData, setObjectifsData] = useState({});
    const [progresData, setProgresData] = useState([])
    
    
    
    useEffect(() => {
        const getObjectifsData = async () => {
            console.log("clientid", clientid)
            try { const response = await fetch(`${apiUrl}/api/admin/${user.id}/objectifs/${clientid}`, {
                method: "GET",
                credentials: "include"
            });
            if(response.ok){
                const data = await response.json()
                
                setObjectifsData(data.objectifs.rows[0]);
                console.log("objectifs data:", objectifsData)
                setProgresData(data.progres.rows)
                console.log("progrès data:", progresData)
            }
    
            } catch(error) {
                console.log("couldn't get objectifs Data", error)
            }
        }
    
        getObjectifsData()
    }, [clientid, progresData, objectifsData])

    
    const client = clientsData.find(client => client.id === Number(clientid))
    console.log("client", client, "clientsData", clientsData)

    if(!client){
        return <h2>Loading...</h2>
    }    
    
    
    return(
        <div className="ObjectifsById">
            <h1>{client.nom}</h1>
            <h5>veuillez cliquer les sections pour modifier!</h5>
            <ClientObjectifs clientid={clientid} user={user} apiUrl={apiUrl} objectifsData={objectifsData} category="objectifs"/>
            <ClientObjectifs clientid={clientid} user={user} apiUrl={apiUrl} objectifsData={objectifsData} category="actions"/>
            <ClientObjectifs clientid={clientid} user={user} apiUrl={apiUrl} objectifsData={objectifsData} category="new_ideas"/>
            <Progress clientid={clientid} user={user} apiUrl={apiUrl} progresData={progresData} />
            <ClientObjectifs clientid={clientid} user={user} apiUrl={apiUrl} objectifsData={objectifsData} category="section1"/>
            <ClientObjectifs clientid={clientid} user={user} apiUrl={apiUrl} objectifsData={objectifsData} category="section2"/>
            

        </div>
    )
}