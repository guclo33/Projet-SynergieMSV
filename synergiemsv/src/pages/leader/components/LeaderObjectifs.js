import React, {useState, useEffect, useContext} from "react";
import { ObjectifsById } from "../../admin/components/subComponents/ObjectifsById";

import { AuthContext } from "../../AuthContext";
import { LeaderContext } from "../LeaderContext";

export function LeaderObjectifs () {
    const {user} = useContext(AuthContext)
    const { leaderData } = useContext(LeaderContext)
    const apiUrl = process.env.REACT_APP_RENDER_API || 'http://localhost:3000'
    
    
    if(!user){
        return <h2>Loading...</h2>
        
    }
    

    //faire une fonction client id***
    
    return (
        <div className="Objectifs">
            <ObjectifsById clientsData={null} user={user} clientid={leaderData.info.client_id}  apiUrl={apiUrl}/>
        </div>
    )
}