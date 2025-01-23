import React, {useState, useEffect} from "react";
import { useDispatch, useSelector } from "react-redux";


export function CreateurGroupe() {
    const [creatingGroup, setCreatingGroup] = useState(false)
    const newGroup = useSelector((state) => state.admin.newGroup)
    const dispatch = useDispatch()


    return (
        <>
            
            {creatingGroup ?
            
            <form>
                <label htmlFor="groupe_name">Nom du nouveau groupe:</label>
                <input type="text" name="groupe_name" value={newGroup.groupe_name} />
                
                
            </form>
            : <button onClick={()=> setCreatingGroup(true)}>Créer un nouveau groupe</button>}
        </>
    )
}