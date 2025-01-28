import React, {useState, useEffect, useContext, useCallback} from "react";
import { useSelector, useDispatch } from "react-redux";
import { AdminContext } from "../../AdminContext";
import iconeProfile from "../../../../Images/iconeProfile.jpg"
import { AuthContext } from "../../../AuthContext";
import { setLeadersData, updateSingleGroupsData } from "../../Redux/adminSlice";

export function GroupeList() {
    const [active, setActive] = useState(true)
    const [selectedId, setSelectedId] = useState(null)
    const [expand, setExpand] = useState(false)
    const {clientsData, apiUrl, leadersData, profilePhotos} = useContext(AdminContext)
    const {user} = useContext(AuthContext)
    const [modify, setModify] = useState(false)
    const [formUrl, setFormUrl] = useState("");
    const [leader, setLeader] = useState()
    const [selectedClientId, setSelectedClientId] = useState()
    const [filteredClientsData, setFilteredClientsData] = useState([])
    const [clientsIdUpdated, setClientsIdUpdated] = useState([])
    const [restOfClients, setRestOfClients] = useState([])
    const [addRemoveIdArray, setAddRemoveIdArray] = useState({})
    
    
    const {groupesData, groupesClients} = useSelector((state) => state.admin.groupesData)
    const [modifiedGroup , setModifiedGroup] = useState({})
    const dispatch = useDispatch()
    const apiUrlLocal = process.env.REACT_APP_RENDER_API || 'http://localhost:3001'
    
    useEffect(() => {
        const selectedGroup = groupesData.find(group => group.id === selectedId);
        const selectedGroupClients = groupesClients.filter(client => client.groupe_id === selectedId);
        const clientsArray = selectedGroupClients.map(client => client.client_id)
        setModifiedGroup(selectedGroup)
        setClientsIdUpdated(clientsArray)
    }, [selectedId, modify])

    useEffect(() => {
        setFormUrl("")
        console.log("formUrl reseted:", formUrl);
    }, [selectedId]);

    useEffect(() => {
        console.log("expand has changed, checking formUrl:", formUrl);
    }, [expand]);

    let activeGroups = []
    if(groupesData) {
        activeGroups = groupesData.filter(group => group.active === active)
        
    }

    console.log("GROUPES DATA ====", groupesData, "GROUPES CLIENTS", groupesClients, "ACTIVE GROUP ===", activeGroups, "modifiedGroup===", modifiedGroup, "CLIENTSIDUPDATED", clientsIdUpdated, "profilesPhotos===", profilePhotos, "LEADERSDATA===", leadersData)

    

    useEffect(() => {
        const filteredClients = clientsData.filter(client => clientsIdUpdated.includes(client.id))
        const restOfClientsArray = clientsData.filter(client => !clientsIdUpdated.includes(client.id))
        setFilteredClientsData(filteredClients)
        setRestOfClients(restOfClientsArray)
        console.log("filteredClientsDATA=", filteredClientsData)
    }, [modify, expand, clientsIdUpdated])

    useEffect(() => {
        const selectedMembersId = groupesClients.filter(group => group.groupe_id === selectedId);
        const realIdsArray = selectedMembersId.map(client => client.client_id)
        
        const newValues = [
            ...clientsIdUpdated.filter(item => !realIdsArray.includes(item)),  
            ...realIdsArray.filter(item => !clientsIdUpdated.includes(item))   
        ]

        console.log("SELECCTED MEMBER ==", selectedMembersId, "ReALIdSArRaY ===", realIdsArray, "CLIENTS DATA!!!!", clientsData, "NEWVALUESSS", newValues)

        if(clientsIdUpdated.length > realIdsArray.length ) {
            setAddRemoveIdArray({
                ids_to_add : newValues,
                ids_to_remove : null,
        });

         return
        }

        if(clientsIdUpdated.length < realIdsArray.length ) {
            setAddRemoveIdArray({
                ids_to_add : null,
                ids_to_remove : newValues,
        });
        return
        }
    }, [clientsIdUpdated])
    

    const handleExpand = (e) => {
        const name = Number(e.currentTarget.dataset.name); 

    if (selectedId !== name) {
        setSelectedId(name);
        setExpand(true);
         
    }
        
        console.log("expand", expand, "selectedID==", selectedId, "NAME", name)
    };

    const handleReduire = () => {
        setExpand(false)
        setSelectedId(null);
    }

    const handleCopy = async () =>{
        
            if (!formUrl) return;
            
            try {
                await navigator.clipboard.writeText(formUrl);
                alert("Lien copié !");
            } catch (err) {
                console.error("Erreur lors de la copie :", err);
            }
        };
    

    const handleUrl = async () => {
        const selectedGroup = activeGroups.find(group => group.id === selectedId);
        if (!selectedGroup) {
            return;
        }
    
        try {
            const response = await fetch(`${apiUrl}/api/form/url`, {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    group_name: selectedGroup.group_name,
                    group_id: selectedGroup.id,
                    have_leader: selectedGroup.have_leader,
                    nom_leader: selectedGroup.nom_leader
                })
            });
    
            const data = await response.json();
            if (data.id) {
                console.log("DATA!!! ==", data)
                const Url = `${apiUrlLocal}/form?id=${data.id}`;
                setFormUrl(Url);
                
            } else {
                console.error("Erreur : ID non reçu");
            }
        } catch (error) {
            console.error("Erreur lors de la requête :", error);
        }
    }

    const modifyGroup = (e) => {
        const {name,type, checked, value} = e.target;
        setModifiedGroup( prev => ({
            ...prev,
            [name] : type === "checkbox" ? checked : value
    }))
    }

    const modifyGroupLeader = (e) => {
        const { name, value } = e.target;
        
        try {
            const parsedValue = JSON.parse(value); // 🔥 Convertir la string en objet
            setModifiedGroup(prev => ({
                ...prev,
                [name]: parsedValue
            }));
        } catch (error) {
            console.error("Erreur de parsing JSON:", error);
        }
    };

    const handleRemoveClient = (e) => {
        const name = e.currentTarget.dataset.name
        const id = Number(name)
        setClientsIdUpdated(prev => prev.filter(client => client !== id))
        
    }

    const handleMemberId = (e) => {
        const selectedId = Number(e.target.value)
        setClientsIdUpdated(prev => 
            prev.includes(selectedId) ? prev : [...prev, selectedId])
        
    }
    

    
    console.log("GROUPES DATA ====", groupesData, "GROUPES CLIENTS", groupesClients, "ACTIVE GROUP ===", activeGroups, "modifiedGroup===", modifiedGroup, "CLIENTSIDUPDATED", clientsIdUpdated, "AddRemoveIdArray", addRemoveIdArray)

    const handleSubmit = async () => {

        try{
            const response = await fetch(`${apiUrl}/api/admin/${user.id}/gestion/groupe`, {
                method : "PUT",
                credentials:"include",
                headers : {
                    "Content-Type" : "application/json"
                },
                body : JSON.stringify({
                    group_id: selectedId,
                    group_name : modifiedGroup.group_name,
                    have_leader : modifiedGroup.have_leader,
                    nom_leader : modifiedGroup.leader ? modifiedGroup.leader.nom_leader : modifiedGroup.nom_leader ,
                    leader_id : modifiedGroup.leader ? modifiedGroup.leader.leader_id : modifiedGroup.leader_id,
                    date_presentation : modifiedGroup.date_presentation,
                    active : modifiedGroup.active,
                    ids_to_add : addRemoveIdArray.ids_to_add,
                    ids_to_remove : addRemoveIdArray.ids_to_remove

                })
            });
            if (response.ok) {
                console.log("group successfully updated");
                /*const groupeData = {
                    active: modifiedGroup,
                    date_presentation: modifiedGroup.date_presentation,
                    group_name: modifiedGroup.group_name,
                    have_leader: modifiedGroup.have_leader,
                    id : selectedId,
                    leader_id: modifiedGroup.leader ? modifiedGroup.leader.leader_id : modifiedGroup.leader_id,
                    nom_leader : modifiedGroup.leader ? modifiedGroup.leader.nom_leader : modifiedGroup.nom_leader,
                }
                dispatch(updateSingleGroupsData({groupeData : groupeData, id : selectedId}))*/
                setModify(false);
                window.location.reload()
                return
            } else {
                console.log("probleme au niveau du server pour l'update de groupe")
            }

            

        } catch (error) {
            console.log("couldn't update the group", error)
        }
    }
    
    
    return (
        <div className="gestionGroupe">
            <h2>Vos groupes de formation :</h2>
            <label htmlFor="active?">Voir vos groupes inactifs</label>
            <input type="checkbox" checked={!active} onChange={()=> setActive(!active)} />
            <div className="groupList">
            
                {activeGroups.map(group =>(
                    
                    (expand===true && selectedId === group.id) ? (  
                        modify ? (
                            <div key={group.id} data-name={group.id} className="groupModify" onClick={handleExpand}>
                                <h3>Nom du groupe</h3>
                                <input type="text" name="group_name" value={modifiedGroup.group_name} onChange={modifyGroup}/>
                                <h3>Date de la présentation</h3>
                                <input type="datetime-local" name="date_presentation" value={modifiedGroup.date_presentation} onChange={modifyGroup}/>
                                <h3>Possède un leader?</h3>
                                <input type="checkbox" name="have_leader" checked={modifiedGroup.have_leader} onChange={modifyGroup}/>
                                <h3>Nom du leader</h3>
                                <select name="leader" value={JSON.stringify(leader)} onChange={modifyGroupLeader}>
                                    <option value={group.nom_leader}>Pas de changement</option>
                                    {leadersData.map(leader => (
                                        <option key={leader.id} value={JSON.stringify({nom_leader : leader.nom, leader_id : leader.id })}>{leader.nom}</option>
                                    ))}
                                </select>
                                <h3>Groupe actif?</h3>
                                <input type="checkbox" name="active" checked={modifiedGroup.active} onChange={modifyGroup}/>
                                <h4>Membres du groupe :</h4>
                                <div className="groupMembers">
                                {filteredClientsData.length > 0 ? 
                                filteredClientsData.map(client => (
                                    <div className="clientModify">
                                        <img className="imgSmall" src={profilePhotos[client.nom] || iconeProfile} alt={client.nom} />
                                        <p>{client.nom}</p>
                                        <p>{client.email}</p>
                                        <button data-name={client.id} onClick={handleRemoveClient}>X</button>
                                        
                                    </div> )) : null}

                                </div>
                                <div className="addingMember">
                                    <label htmlFor="members_ids">Ajouter des clients déjà existants</label>
                                    <select  name="members_ids" value={selectedClientId} onChange={handleMemberId}>
                                        <option>-- Sélectionner un autre client --</option>
                                        {restOfClients.map(client => (
                                        <option key={client.id} value={client.id}>
                                            {client.nom}, {client.email}
                                        </option>
                                    ))}
                                    </select>
                                </div>
                                <div className="modifyGroupButtons">
                                    <button onClick={handleSubmit}>Modifier</button>
                                    <button onClick={()=>setModify(false)}>Annuler</button>
                                </div>
                            </div>
                        ) : (

                        
                        <div key={group.id} data-name={group.id} className="group" onClick={handleExpand}>
                            <h3>Nom du groupe</h3>
                            <p>{group.group_name}</p>
                            <h3>Date de la présentation</h3>
                            <p>{group.date_presentation ? new Date(group.date_presentation).toLocaleString('en-CA') : "Date non définie"}</p>
                            
                            
                                <div className="groupMembers">
                                    { group.have_leader ? (
                                    <>  
                                       <h4>Leader :</h4>
                                        <div className="client">
                                            <img className="imgSmall" src={profilePhotos[group.nom_leader] || iconeProfile} alt={group.nom_leader} />
                                            <p>{group.nom_leader}</p>
                                            <p>{leadersData.filter(leader => leader.nom === group.nom_leader).email}</p>
                                        </div>
                                    </>) : null}
                                <h4>Membres du groupe :</h4>
                            {filteredClientsData.length > 0 ? 
                            filteredClientsData.map(client => (
                                <div className="client">
                                    <img className="imgSmall" src={profilePhotos[client.nom] || iconeProfile} alt={client.nom} />
                                    <p>{client.nom}</p>
                                    <p>{client.email}</p>
                                    
                                </div>
                            ))
                            : null}
                            </div>
                            <div className="groupButton">
                                <button onClick={()=>(setModify(true))}>Modifier</button>
                                <button onClick={handleUrl}>Générer un lien de questionnaire</button>
                                <button onClick={handleReduire}>Réduire</button>
                            </div>
                            
                                {formUrl && 
                                <div className="groupA">
                                    <a href={formUrl} rel="noopener noreferrer">{formUrl}</a>
                                    <button onClick={handleCopy}>Copier</button>
                                </div>}
                                
                            
                        </div> 
                    )) : (
                    <div key={group.id} data-name={group.id} className="group" onClick={handleExpand}>
                        <h3>Nom du groupe</h3>
                        <p>{group.group_name}</p>
                        <h3>Date de la présentation</h3>
                        <p>{group.date_presentation ? new Date(group.date_presentation).toLocaleString('en-CA') : "Date non définie"}</p>
                        <h3>Nom du leader</h3>
                        <p>{group.have_leader === true ? group.nom_leader : "Groupe sans leader"}</p>
                    </div> )
                ))}
            </div>
            
        </div>
    )
}


