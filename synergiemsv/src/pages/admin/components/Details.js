import React, {useState, useEffect, useContext} from "react";
import { useParams, useLocation } from "react-router";
import { DetailsById } from "./subComponents/DetailsById";
import { DetailsLeaders } from "./subComponents/DetailsLeaders";
import { AuthContext } from "../../AuthContext";

export function Details() {
    const [leadersData, setLeadersData] = useState([]);
    const [detailsData, setDetailsData] = useState({});
    const {clientid = null} = useParams()
    const {user} = useContext(AuthContext);
    const location = useLocation()

    useEffect(()=>{
        const getLeadersData = async () => {
            try {
                const response = await fetch(`http://localhost:3000/api/admin/${user.id}/details`, {
                    method: "GET",
                    credentials: "include",
                    });
                    if(response.ok){
                        const data = await response.json();
                        
                        const dataArray = data.rows.map((row) => ( {
                            leader_id: row.leaderid,
                            client_id: row.clientid,
                            nom: row.nom,
                            email: row.email,
                            phone: row.phone,
                            active: row.active,
                            
                        }));
                        
                        setLeadersData(dataArray)
                        
                        
                        
                    } else {
                        const errorText = await response.text();
                        console.error("Error response from server:", errorText)
                };
            } catch(error) {
                console.error("Could not connect to getadminhomedata", error)
            }
        }
        
        getLeadersData()
        
    }, [])
    
   
    useEffect(() => {
        if(!clientid){
            console.log("client id non dispo pour l'instant")
            return
        }
        console.log("getDetails called with clientid", clientid)
        const getDetailsData = async () => {
            try {
                const response = await fetch(`http://localhost:3000/api/admin/${user.id}/details/${clientid}`, {
                    method: "GET",
                    credentials: "include",
                    });
                    if(response.ok){
                        const data = await response.json();
                        console.log("here's Details", data)
                        
                        setDetailsData(data)
   
                        console.log("detailsData:", detailsData)
                            
                    } else {
                        const errorText = await response.text();
                        console.error("Error response from server:", errorText)
                };
            } catch(error) {
                console.error("Could not connect to get details data", error)
            }
        }
            
        getDetailsData()
        }, [clientid])
    
    
    
    
    return(
        <div className="details">
            {clientid ? <DetailsById detailsData={detailsData} /> : <DetailsLeaders leadersData={leadersData}/>}
        </div>
    )
}