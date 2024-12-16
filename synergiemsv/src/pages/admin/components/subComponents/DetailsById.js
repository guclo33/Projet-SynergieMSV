import React, {useState, useEffect} from "react";
import { useParams } from "react-router";
import { GeneralInfos } from "./GeneralInfos";
import {Documents} from "./Documents";
import { Profile } from "./Profile";

export function DetailsById({detailsData}) {
    if(!detailsData || Object.keys(detailsData).length === 0){
        return <h2>...loading</h2>
    }
    console.log("Voici le detailsData", detailsData)
    
    return(
        <div className="detailsById">
            <h3>{detailsData.info.nom_client}</h3>
            
                <GeneralInfos detailsData={detailsData} />
                <Documents detailsData={detailsData}/>
                <Profile detailsData={detailsData}/>
             
            
        </div>
    )
}