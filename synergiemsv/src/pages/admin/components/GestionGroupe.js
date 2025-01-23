import React, {useState, useEffect} from "react";
import { CreateurGroupe } from "./subComponents/CreateurGroupe";
import { GroupeList } from "./subComponents/GroupeList";

export function GestionGroupe() {
    return (
        <div className="gestionGroupe">
            <CreateurGroupe />
            <GroupeList />
        </div>
    )
}