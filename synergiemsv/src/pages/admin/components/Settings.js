import React, {useState} from "react";
import { useContext } from "react";
import { AuthContext } from "../../AuthContext";


export function Settings() {
    const [modify, setModify] = useState(false)
    const {user} = useContext(AuthContext)
    const [newInfos, setNewInfos] = useState({
        username : user.username,
        email : user.email
    })
    const [newPassword, setNewPassword] = useState("")

    console.log("user :", user)
    const handleClick = () => {
        setModify(true)
    }

    const handleCancel = () => {
        setModify(false)
    }

    const handleChange = (e) => {
        const {name, value} = e.target;
        setNewInfos(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try{
            const response = await fetch(`http://localhost:3000/api/admin/${user.id}/settings/`, {
                method : "PUT",
                credentials : "include",
                headers : {
                    "Content-Type" : "application/json"
                },
                body : JSON.stringify({
                    email : newInfos.email,
                    username : newInfos.username,
                    
                })
            });
            if(response.ok){
                console.log(`User succesfully updated`)
                setModify(false)
            } else {
                console.log("error while trying to update user in the server")
            }
        } catch(error) {
            console.log("couldn't update user infos data" , error)
        }

    }

    const handlePassword = (e) => {
        const {value} = e.target
        setNewPassword(value)
    }
    const submitPassword = async () => {
        if(newPassword.length===0) {
            return alert("Votre mot de passe est vide, action annulé")
        }
        
        const isConfirmed = window.confirm("Êtes-vous sûr de vouloir modifier votre mot de passe ?");
        if (isConfirmed) {
            
            console.log("Mot de passe modifié !");
               
            try{
                const response = await fetch(`http://localhost:3000/api/admin/${user.id}/settings/password`, {
                    method : "PUT",
                    credentials : "include",
                    headers : {
                        "Content-Type" : "application/json"
                    },
                    body : JSON.stringify(newPassword)
                });
                if(response.ok){
                    console.log(`User password succesfully updated`)
                    setModify(null)
                } else {
                    console.log("error while trying to update the password in the server")
                }
            } catch(error) {
                console.log("couldn't update user password" , error)
            }
            
        } else {
            // Ne rien faire si annulé
            console.log("Action annulée.");
        }
    
        
        
    }

    return(
        <div className="settings">
            { modify ? (
                <>
                    <form className="settingsContainer" onSubmit={handleSubmit}>
                        <h5>Username :</h5>
                        <input className="z" type="text" name="username" value={newInfos.username ||  ""} onChange={handleChange} />
                        <h5>Courriel :</h5>
                        <input className="z" type="email" name="email" value={newInfos.email ||  ""} onChange={handleChange} />
                        
                        <button onClick={handleCancel}>Annuler</button>
                        <button type="submit">Confirmer</button>
                    </form>
                    <div className="modifyPassword">
                        <h5>Modifier le mot de passe :</h5>
                        <input  type="password" name="password" value={newPassword ||  ""} onChange={handlePassword} />
                        <button onClick={handleCancel}>Annuler</button>
                        <button onClick={submitPassword}>Confirmer le nouveau mot de passe</button>
                    </div>
                </>
            ): (
                <div className="settingsContainer" >
                    <h5>Username :</h5>
                    <p className="z">{user.username}</p>
                    <h5>Courriel :</h5>
                    <p className="z">{user.email}</p>
                    <h5>Rôle :</h5>
                    <p className="z">{user.role}</p>                 
                    <button onClick={handleClick}>Modifier</button>
                </div>
            )}
            
        </div>
    )
}