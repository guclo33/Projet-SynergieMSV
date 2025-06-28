import React, { useContext, useState }  from "react";
import { AuthContext } from "../../../AuthContext";

export function EditableField({ label, name,  value, profileId }) {
    const [isEditing, setIsEditing] = useState(false);
    const [draft, setDraft] = useState(value);
    const {user} = useContext(AuthContext)
  
    const apiUrl = process.env.REACT_APP_RENDER_API || 'http://localhost:3000'

    // Ouvrir l'édition
    const handleEdit = () => setIsEditing(true);
  
    // Quand on quitte le champ
    const handleBlur = (e) => {
      if (
        e.relatedTarget &&
        (e.relatedTarget.id === 'modifyButton' || e.relatedTarget.id === 'cancelButton')
      ) {
        // On ne fait rien, pour laisser le clic sur le bouton se faire
        return;
      }  
      
      setDraft(value)
        setIsEditing(false);
      
    };

    const handleModify = async() => {
        const accepted = window.confirm("Êtes-vous sûr de vouloir modifier ?")

        if(!accepted) {
            return
        }
        try {
            const response = await fetch(`${apiUrl}/api/admin/${user.id}/details/profileUpdate`, {
                method: "PUT",
                credentials: "include",
                headers: {
                  "Content-Type" : "application/json"
                },
                body : JSON.stringify({
                    name: name,
                    value : draft,
                    profile_id : profileId
                })
            });

              const data = {
                name: name,
                value : draft,
                profile_id : profileId
            }
          
            if(response.ok){

                setIsEditing(false)
            }

        } catch(error) {
            console.error("couldn't modify profile", error)
        }

        
    }
  
    const handleCancel = () => {
        setDraft(value)
        setIsEditing(false);
    }

    return (
      <div>
        <h5>{label ? label : null}</h5>
        {isEditing ? (
          <div  className="editableField">
          <textarea
            autoFocus 
            onBlur={handleBlur}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            
          />
          <button id="modifyButton" onClick={handleModify}>Modifier</button>
          <button id="cancelButton" onClick={handleCancel}>Annuler</button>
          </div>
        ) : (
          <p onClick={handleEdit}>{draft}</p>
        )}
      </div>
    );
  }