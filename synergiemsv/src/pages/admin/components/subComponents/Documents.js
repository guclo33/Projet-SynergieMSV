import React, {useCallback,useContext, useState, useEffect} from "react";
import { useParams } from "react-router";
import { useDropzone } from 'react-dropzone';
import { AuthContext } from "../../../AuthContext";
import { DropZone } from "./DropZone";

export function Documents({detailsData}) {
        const {user} = useContext(AuthContext)
        const apiU = process.env.REACT_APP_API_URL || 'http://localhost:3000';
        const apiUrl = `${apiU}/api/admin/${user.id}/details`;
        
        if(!detailsData.equipe){
            return
        }
        
        return (
            <div className="documents">
                <DropZone detailsData={detailsData} apiUrl={apiUrl} category="profils" />
                <DropZone detailsData={detailsData} apiUrl={apiUrl} category="factures" />
                <DropZone detailsData={detailsData} apiUrl={apiUrl} category="questionnaires" />
            </div>
        );
    }