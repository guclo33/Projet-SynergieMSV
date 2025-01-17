import React, {useState, useEffect, useContext} from "react";
import { useParams, useLocation } from "react-router";
import { DetailsById } from "./subComponents/DetailsById";
import { DetailsLeaders } from "./subComponents/DetailsLeaders";
import { AuthContext } from "../../AuthContext";

export function Details() {
    
    const [detailsData, setDetailsData] = useState({});
    
    const {clientid = null} = useParams()
    const {user} = useContext(AuthContext);
    const location = useLocation()
    const apiUrl = process.env.REACT_APP_RENDER_API || 'http://localhost:3000';
    
    
   
    useEffect(() => {
        if(!clientid){
            console.log("client id non dispo pour l'instant")
            return
        }
        console.log("getDetails called with clientid", clientid)
        const getDetailsData = async () => {
            try {
                const response = await fetch(`${apiUrl}/api/admin/${user.id}/details/${clientid}`, {
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
            {clientid ? <DetailsById detailsData={detailsData} /> : <DetailsLeaders />}
        </div>
    )
}