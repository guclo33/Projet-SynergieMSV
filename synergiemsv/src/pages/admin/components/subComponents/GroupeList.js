import React, {useState, useEffect} from "react";
import { useSelector, useDispatch } from "react-redux";

export function GroupeList() {
    const groupesData = useSelector((state) => state.admin.groupesData)
    const dispatch = useDispatch()
    
    
    return (
        <div className="gestionGroupe">
            
        </div>
    )
}