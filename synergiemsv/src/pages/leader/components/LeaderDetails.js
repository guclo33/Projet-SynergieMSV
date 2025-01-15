import React, {useState, useEffect, useContext} from "react";
import { DetailsById } from "../../admin/components/subComponents/DetailsById";

import { AuthContext } from "../../AuthContext";

export function LeaderObjectifs () {
    const {user} = useContext(AuthContext)
    const [detailsData, setDetailsData] = useState({})
    const apiUrl = process.env.REACT_APP_RENDER_API || 'http://localhost:3000'
    
    
    if(!user){
        return <h2>Loading...</h2>
        
    }
    
    useEffect(() => {
            
            console.log("getDetails called with id", user.id)
            const getDetailsData = async () => {
                try {
                    const response = await fetch(`${apiUrl}/api/${user.role}/${user.id}/details/`, {
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
            }, [user])

    //faire une fonction client id***
    
    return (
        <div className="Objectifs">
            <DetailsById/>
        </div>
    )
}