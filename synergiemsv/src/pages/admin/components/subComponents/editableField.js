import React, { useState }  from "react";

export function EditableField({ label, name,  value }) {
    const [isEditing, setIsEditing] = useState(false);
    const [draft, setDraft] = useState(value);
  
    const apiUrl = process.env.REACT_APP_RENDER_API || 'http://localhost:3000'

    // Ouvrir l'édition
    const handleEdit = () => setIsEditing(true);
  
    // Quand on quitte le champ
    const handleBlur = () => {
        setDraft(value)
        setIsEditing(false);
      
    };

    const handleModify = async() => {
        const accepted = window.confirm("Êtes-vous sûr de vouloir modifier ?")

        if(!accepted) {
            return
        }
        try {
            const response = await fetch(`${apiUrl}/api/admin/details/profile`, {
                method: "PUT",
                credentials: "include",
                body : JSON.stringify({
                    name: name,
                    value : value
                })
            });
            if(response.ok){
                console.log("succesfully updated profile")
                setIsEditing(false)
            }

        } catch(error) {
            console.log("couldn't modify profile", error)
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
          <div className="editableField">
          <textarea
            autoFocus
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={handleBlur}
          />
          <button onClick={handleModify}>Modifier</button>
          <button onClick={handleCancel}>Annuler</button>
          </div>
        ) : (
          <p onClick={handleEdit}>{value}</p>
        )}
      </div>
    );
  }