import React, {useEffect, useState} from "react";

export function Progress ({progresData, URL, clientid, user}) {
    const [modify, setModify] = useState(false)
    const [modifyProg, setModifyProg] = useState(null)
    const [value, setValue] = useState("")
    const [valueProg, setValueProg] = useState("")
    
    
    console.log("progress Data", progresData)

    
    const handleModify = (e) => {
            setModify(!modify)
        }
    


    const handleSubmit = async() => {
        try {
            const response = await fetch(URL, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    value: value,
                })
            });
            if(response.ok) {
                console.log("progrès crée avec succès!");
                setModify(false);
                setValue("")
                return
            }
            return

        } catch(error) {
            console.log("erreur en ajoutant le progrès", error)
            return
        }
            
            
    }

    const handleClick = async(e) => {
        const {name} = e.target
        console.log("clé", name)
        try {
            console.log("sending data to update progres", valueProg)
            const response = await fetch(URL, {
                method: "PUT",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    prog_id: name,
                    value: valueProg
                })
            });
            if(response.ok) {
                console.log("Progrès mis à jour avec succès!");
                setModifyProg(null);
                setValueProg("")
                return
            }

        } catch(error) {
            console.log("erreur en mettant à jour le progrès", error)
        }
    }

    const handleChange = (e) => {
        const {value} = e.target;
        setValue(value);
    }

    const handleModifyProg = (e) => {
        const {name} = e.target
        setModifyProg(name)
    }

    const handleDelete = async(e) => {
        const {name} = e.target
        console.log("clé", name)
        const confirmDelete = window.confirm(`Voulez-vous vraiment supprimer ce progrès?`);
        if(confirmDelete) {
            try {
                console.log("sending data to update progres", value)
                const response = await fetch(URL, {
                    method: "DELETE",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        prog_id: name,
                        
                    })
                });
                if(response.ok) {
                    console.log("progrès supprimé avec succès!");
                    setModify(false);
                    return
                }

            } catch(error) {
                console.log("erreur en supprimant le progrès", error)
            }}

    }
    
    const handleChangeProg = (e) => {
        const {value} = e.target
        setValueProg(value)
    }
    
    
    return(
         <div>
            {progresData.length === 0 ? (
                <div className="clientObjectifs">
                    
                        
                    <h2 className="titre">Progrès</h2>
                        
                        
                    
                    {modify ? (
                    <div className="progresInput">
                        <input type="text" value={value} onChange={handleChange} placeholder="Veuillez écrire un progrès!"/>
                        <div className="modifyButton">
                            <button onClick={handleModify}>Annuler</button>
                            <button onClick={handleSubmit}>Ajouter</button>
                        </div>
                    </div>) : (
                        <p onClick={handleModify}>Aucun progrès d'inscrit pour l'instant! Cliquez ici pour en créer un!</p>
                    )}

            </div>
        ):(
                <div className="clientObjectifs">
                    <h2 className="titre">Progrès</h2>
                    <div className="progresArea">
                        {progresData.map((progres) => (
                            modifyProg===progres.id ? ( 
                                <div id={progres.id} name={progres.id} className="singleProgres">
                                    
                                        <input name={progres.id} type="text" value={(valueProg ? valueProg : progres.progres)} onChange={handleChangeProg} />
                                        <button name={progres.id} onClick={()=>setModifyProg(null)}>Annuler</button>
                                        <button name={progres.id} onClick={handleClick}>Modifier</button>

                                </div> ) : (
                                    <div id={progres.id} className="singleProgres">
                                        <p  onClick={() => setModifyProg(progres.id)}>{progres.progres}</p>
                                        <button name={progres.id} onClick={handleDelete}>X</button>
                                    </div>
                        )))}
                    </div>
                    
                    {modify ? (
                        <div className="progresInput">
                        <input type="text" value={value} onChange={handleChange} placeholder="Veuillez écrire un progrès!"/>
                        <div className="modifyButton">
                            <button onClick={handleModify}>Annuler</button>
                            <button onClick={handleSubmit}>Ajouter</button>
                        </div>
                    </div>) : (
                        <p className="addProg"onClick={handleModify}>Cliquez ici pour ajouter un progrès</p>
                    )}
                    
                </div>
        )}
        </div>
    )
}