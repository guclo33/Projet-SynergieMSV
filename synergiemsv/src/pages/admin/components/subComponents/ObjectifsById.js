import React from "react";
import { useEffect, useState } from "react";
import { Progress } from "./Progress";
import { ClientObjectifs } from "./ClientObjectifs";


export function ObjectifsById ({clientsData, user, clientid, apiUrl}) {
    const [objectifsData, setObjectifsData] = useState({});
    const [modify, setModify] = useState(false)
    
    
    useEffect(() => {
        const getObjectifsData = async () => {
            console.log("clientid", clientid)
            try { const response = await fetch(`${apiUrl}/api/admin/${user.id}/objectifs/${clientid}`, {
                method: "GET",
                credentials: "include"
            });
            if(response.ok){
                const data = await response.json()
                console.log("data", data)
                setObjectifsData(data.rows[0]);
                console.log("objectifs data:", objectifsData)
            }
    
            } catch(error) {
                console.log("couldn't get objectifs Data", error)
            }
        }
    
        getObjectifsData()
    }, [clientid, objectifsData])

    
    const client = clientsData.find(client => client.id === Number(clientid))
    console.log("client", client, "clientsData", clientsData)

    if(!client){
        return <h2>Loading...</h2>
    }    
    
    
    return(
        <div className="ObjectifsById">
            <h1>{client.nom}</h1>
            <ClientObjectifs clientid={clientid} user={user} apiUrl={apiUrl} objectifsData={objectifsData} category="objectifs"/>
            <ClientObjectifs clientid={clientid} user={user} apiUrl={apiUrl} objectifsData={objectifsData} category="actions"/>
            <ClientObjectifs clientid={clientid} user={user} apiUrl={apiUrl} objectifsData={objectifsData} category="new_ideas"/>
            <Progress clientid={clientid} user={user} apiUrl={apiUrl} objectifsData={objectifsData} />
            <ClientObjectifs clientid={clientid} user={user} apiUrl={apiUrl} objectifsData={objectifsData} category="section1"/>
            <ClientObjectifs clientid={clientid} user={user} apiUrl={apiUrl} objectifsData={objectifsData} category="section2"/>
            

        </div>
    )
}