import React from "react";
import { useEffect, useState } from "react";
import { Progress } from "./Progress";
import { ClientObjectifs } from "./ClientObjectifs";


export function ObjectifsById ({clientsData, user, clientid, apiUrl}) {
    const [objectifsData, setObjectifsData] = useState({});
    const [progresData, setProgresData] = useState([])
    
    let URL = `${apiUrl}/api/user/${user.id}/objectifs`
    if(user.role==="superadmin" || user.role === "admin"){
        URL = `${apiUrl}/api/admin/${user.id}/objectifs/${clientid}`
    }
    if(user.role==="leader") {
        URL = `${apiUrl}/api/leader/${user.id}/objectifs`
    }
    console.log("URL", URL)
    
    useEffect(() => {
        const getObjectifsData = async () => {
            console.log("clientid", clientid)
            try { const response = await fetch(URL, {
                method: "GET",
                credentials: "include"
            });
            if(response.ok){
                const data = await response.json()
                console.log("DATA", data)
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

    let client = {}
    if (clientsData) {
    client = clientsData.find(client => client.id === Number(clientid))
    console.log("client", client, "clientsData", clientsData)
        if(!client){
            return <h2>Loading...</h2>
        } 
    }
       
    
    
    return(
        <div className="ObjectifsById">
            <h1>{(client && client.nom ? client.nom : user.username)}</h1>
            <h5>veuillez cliquer les sections pour modifier!</h5>
            <ClientObjectifs URL={URL} clientid={clientid} user={user}  objectifsData={objectifsData} category="objectifs"/>
            <ClientObjectifs URL={URL} clientid={clientid} user={user}  objectifsData={objectifsData} category="actions"/>
            <ClientObjectifs URL={URL} clientid={clientid} user={user}  objectifsData={objectifsData} category="new_ideas"/>
            <Progress URL={URL} clientid={clientid} user={user} progresData={progresData} />
            <ClientObjectifs URL={URL} clientid={clientid} user={user}  objectifsData={objectifsData} category="section1"/>
            <ClientObjectifs URL={URL} clientid={clientid} user={user}  objectifsData={objectifsData} category="section2"/>
            

        </div>
    )
}