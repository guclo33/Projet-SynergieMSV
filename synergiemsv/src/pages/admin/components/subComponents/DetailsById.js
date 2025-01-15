import React, {useState, useEffect} from "react";
import { useParams } from "react-router";
import { GeneralInfos } from "./GeneralInfos";
import {Documents} from "./Documents";
import { Profile } from "./Profile";
import iconeProfile from "../../../../Images/iconeProfile.jpg"
import { useContext } from "react";
import { AdminContext } from "../../AdminContext";

export function DetailsById({detailsData}) {
    const {profilePhotos} = useContext(AdminContext)
    if(!detailsData || Object.keys(detailsData).length === 0){
        return <h2>...loading</h2>
    }
    console.log("Voici le detailsData", detailsData, "voici profilePhotos:", profilePhotos)

    
    
    return(
        <div className="detailsById">
            <h3>{detailsData.info.nom_client}</h3>
                <div className="info">
                    <img className="imgSmall" src={profilePhotos[detailsData.info.nom_client] || iconeProfile} alt={detailsData.info.nom_client} />
                </div>
                <GeneralInfos detailsData={detailsData} />
                <Documents detailsData={detailsData}/>
                <Profile detailsData={detailsData}/>
             
            
        </div>
    )
}