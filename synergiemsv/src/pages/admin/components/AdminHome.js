import React, {useContext, useEffect, useState} from "react";
import { AuthContext } from "../../AuthContext";
import { ProfilGenerator } from "./subComponents/ProfilGenerator";
import { LeadersHome } from "./subComponents/LeadersHome";
import "../admin.css"



export function AdminHome() {
    const [adminHomeData, setAdminHomeData] = useState([])
    const {user} = useContext(AuthContext);
    const apiUrl = process.env.REACT_APP_RENDER_API || 'http://localhost:3000';
    useEffect( () => {
        
        const getAdminHomeData = async () => {
            try {
                const response = await fetch(`${apiUrl}/api/admin/${user.id}`, {
                    method: "GET",
                    credentials: "include",
                    });
                    if(response.ok){
                        const data = await response.json();
                        console.log("here's data", data.rows)
                        const dataArray = data.rows.map((row) => ( {
                            id : row.leaderid,
                            clientid: row.clientid,
                            active: row.active,
                            nom: row.nom,
                            email: row.email,
                            phone: row.phone
                        }));
                        console.log(dataArray)
                        setAdminHomeData(dataArray)
                        
                        
                        
                    } else {
                        const errorText = await response.text();
                        console.error("Error response from server:", errorText)
                };
            } catch(error) {
                console.error("Could not connect to getadminhomedata", error)
            }
        }
        console.log("getAdmin called")
        getAdminHomeData();

    },[])
    
    
    return(
        <div className="AdminHome">
            <h1>Bienvenue {user.username}</h1>
            <ProfilGenerator />
            <LeadersHome adminHomeData={adminHomeData}/>
            <h3>Informations diverses:</h3>
        </div>
    )
}