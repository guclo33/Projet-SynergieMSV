import React, {useState, useEffect, useRef} from "react";
import { useParams } from "react-router";
import { GeneralInfos } from "./GeneralInfos";
import {Documents} from "./Documents";
import { Profile } from "./Profile";
import iconeProfile from "../../../../Images/iconeProfile.jpg"
import { useContext } from "react";
import { AdminContext } from "../../AdminContext";
import { DetailForm } from "./DetailsForm";

export function DetailsById({detailsData}) {
    const {profilePhotos} = useContext(AdminContext)
    const detailFormRef = useRef(null);
     
    if(!detailsData || Object.keys(detailsData).length === 0){
        return <h2>...loading</h2>
    }
    console.log("Voici le detailsData", detailsData, "voici profilePhotos:", profilePhotos)

    

    const handleClick = () => {
        detailFormRef.current.scrollIntoView({ behavior: "smooth" });
      };
    
    
    return(
        <div className="detailsById">
            <h3>{detailsData.info.nom_client}</h3>
                <div className="info">
                    <img className="imgSmall" src={profilePhotos[detailsData.info.nom_client] || iconeProfile} alt={detailsData.info.nom_client} />
                </div>
                <GeneralInfos detailsData={detailsData} />
                <Documents detailsData={detailsData}/>
                {detailsData && detailsData.form.length>0 ?
                <button onClick={handleClick}>Voir questionnaire</button>
                : null}
                
                <Profile detailsData={detailsData}/>
                {detailsData && detailsData.form.length>0 ?
                <div ref={detailFormRef}>
                    <DetailForm form={detailsData.form}/>
                </div>
                : null}
             
            
        </div>
    )
}