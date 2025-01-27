import React, {useState, useEffect} from "react";
import { CreateurGroupe } from "./subComponents/CreateurGroupe";
import { GroupeList } from "./subComponents/GroupeList";

export function GestionGroupe() {
    return (
        <div className="gestionGroupe">
            <h2>Gestion des groupes de formations</h2>
            <CreateurGroupe />
            <GroupeList />
        </div>
    )
}