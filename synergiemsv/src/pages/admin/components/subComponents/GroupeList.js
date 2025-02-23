import React, {useState, useEffect, useContext, useCallback} from "react";
import { useSelector, useDispatch } from "react-redux";
import { AdminContext } from "../../AdminContext";
import iconeProfile from "../../../../Images/iconeProfile.jpg"
import { AuthContext } from "../../../AuthContext";
import { setLeadersData, updateSingleGroupsData, setGroupesData } from "../../Redux/adminSlice";
import { Link, useNavigate } from "react-router-dom";

export function GroupeList() {
    const [isLoading, setIsLoading] = useState(false);
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
    const [activeGroups, setActiveGroups] = useState([])
    const {groupesData, groupesClients} = useSelector((state) => state.admin.groupesData)
    const [modifiedGroup , setModifiedGroup] = useState({})
    const [search, setSearch] = useState("")
    const dispatch = useDispatch()
    const apiUrlLocal = process.env.REACT_APP_RENDER_API || 'http://localhost:3001'
    
    const navigate = useNavigate()
    
    useEffect(() => {
        if (!groupesData) {
            return;
        }
        const selectedGroup = groupesData.find(group => group.id === selectedId);
        const selectedGroupClients = groupesClients.filter(client => client.groupe_id === selectedId);
        const clientsArray = selectedGroupClients.map(client => client.client_id)
        setModifiedGroup(selectedGroup)
        setClientsIdUpdated(clientsArray)
    }, [selectedId, modify, groupesData, groupesClients])

    useEffect(() => {
        setFormUrl("")
        
    }, [selectedId]);

    useEffect(() => {
        console.log("expand has changed, checking formUrl:", formUrl);
    }, [expand]);

    
    useEffect(() => {
        const selectedGroup = groupesData.filter(group => group.active === active)
        const searchedGroup = selectedGroup.filter(group => group.group_name.toLowerCase().includes(search))
        setActiveGroups(searchedGroup) 
        
    }, [groupesData, active, search])

    

    

    useEffect(() => {
        let filteredClients = clientsData.filter(client => clientsIdUpdated.includes(client.id))
        const restOfClientsArray = clientsData.filter(client => !clientsIdUpdated.includes(client.id))
        const selectedGroup = groupesData.find(group => group.id === selectedId);
        console.log("selectedGroup",selectedGroup, "SELECTEDID", selectedId)
        console.log("CLIENTSDATA",clientsData, "FILTEREDCLIENTS", filteredClients)
        if(selectedGroup && selectedGroup.have_leader) {
            const leader = leadersData.find(leader => leader.id === selectedGroup.leader_id);
            const leaderClientId = leader.clientid
            console.log("LEADER=", leader, "leadersClientId", leaderClientId)
            filteredClients = filteredClients.filter(client => client.id !== leaderClientId)

            console.log("FILTEREDCLIENTS", filteredClients)
        }


        setFilteredClientsData(filteredClients)
        setRestOfClients(restOfClientsArray)
        console.log("filteredClientsDATA=", filteredClientsData)
    }, [expand, clientsIdUpdated, groupesData, groupesClients])

    useEffect(() => {
        const selectedMembersId = groupesClients.filter(group => group.groupe_id === selectedId);
        const realIdsArray = selectedMembersId.map(client => client.client_id)
        
        const newValues = [
            ...clientsIdUpdated.filter(item => !realIdsArray.includes(item)),  
            ...realIdsArray.filter(item => !clientsIdUpdated.includes(item))   
        ]

        

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
    
    if(!groupesData || !clientsData) {
        return <h2>...LOADING</h2>
    }


    const handleExpand = (e) => {
        const name = Number(e.currentTarget.dataset.name); 

    if (selectedId !== name) {
        setSelectedId(name);
        setExpand(true);
         
    }
        
        
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
                    nom_leader: selectedGroup.nom_leader,
                    leader_id : selectedGroup.leader_id,
                    date_presentation : selectedGroup.date_presentation
                })
            });
    
            const data = await response.json();
            if (data.id) {
                
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
    
    const handleSearch = (e) => {
        const {value} = e.target
        setSearch(value.toLowerCase())
    }
    
    

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
                const groupeData = {
                    active: modifiedGroup,
                    date_presentation: modifiedGroup.date_presentation,
                    group_name: modifiedGroup.group_name,
                    have_leader: modifiedGroup.have_leader,
                    id : selectedId,
                    leader_id: modifiedGroup.leader ? modifiedGroup.leader.leader_id : modifiedGroup.leader_id,
                    nom_leader : modifiedGroup.leader ? modifiedGroup.leader.nom_leader : modifiedGroup.nom_leader,
                }
                dispatch(updateSingleGroupsData({groupeData : groupeData, id : selectedId}))
                setModify(false);
                const response2 = await fetch(`${apiUrl}/api/admin/${user.id}`, {
                    method: "GET",
                    credentials: "include",
                    });
                    if(response2.ok) {
                    
                    const data = await response2.json();
                    console.log("got the new data", data)
                    const groupesData = {
                        groupesData : data.groupesData.groupesData.rows,
                        groupesClients : data.groupesData.groupesClients.rows
                    }
                    dispatch(setGroupesData(groupesData))
                }
                //window.location.reload()
                return
            } else {
                console.log("probleme au niveau du server pour l'update de groupe")
            }

            

        } catch (error) {
            console.log("couldn't update the group", error)
        }
    }
    const handleShowProfile =(e) => {
        const {id, checked} = e.target
        const value = Boolean(!checked)
        console.log("ID", id, "VALUE", value, "CHECKED", checked)

        try {
            const response = fetch(`${apiUrlLocal}/api/admin/${user.id}/group/showProfile/${id}`,{
                method: "PUT",
                credentials: "include",
                headers : {
                    "Content-Type" : "application/json"
                },
                body : value
            });
            if(response.ok) {
                console.log("réussi la mise à jour du showProfile!")
            }

        } catch(error) {
        console.log("N'a pas updater ShowProfile", error)
        }
    }

    const handleGenerateCanva =(e) => {
        const {id} = e.target
        
        try {
            const response = fetch(`${apiUrlLocal}/api/admin/${user.id}/group/generateCanva/${id}`,{
                method: "GET",
                credentials: "include",
            });
            if(response.ok) {
                console.log("réussi l'autofill Canva")
            }

        } catch(error) {
        console.log("N'a pas fait l'autofill Canva", error)
        }
    }

    const handleGenerateProfile = async (e) => {
        const formId = e.target.name
        const clientId = e.target.id
        console.log("formId", formId)
        setIsLoading(true)
        try{
            const response = await fetch(`${apiUrl}/api/form/generateProfile/${formId}`, {
                method: "GET",
                credentials : "include",
            });
            if(response.ok){
                const data = await response.json();
                console.log("Message from python", data.message)
                console.log("profil généré avec succès")
                navigate(`/admin/${user.id}/details/${clientId}`)
            }
        } catch (error) {
            console.log("couldn't generate profile")
        } finally {
            setIsLoading(false)
        }

    }

    if(isLoading){
        return(
            
                <div className="loading-overlay">
                  <div className="spinner"></div>
                </div>
        )
    }

    return (
        <div className="gestionGroupe">
            <h2>Vos groupes de formation :</h2>
            <div className="activeSearch">
                <label htmlFor="active?">Voir vos groupes inactifs</label>
                <input type="checkbox" checked={!active} onChange={() => setActive(!active)} />
                <label htmlFor="search">Recherchez votre groupe</label>
                <input name="search" type="search" onChange={handleSearch} value={search} />
            </div>
    
           
            <div className="groupList">
                {activeGroups.map(group => {
                    
                    if (expand && selectedId === group.id && modify) {
                        return (
                            <div key={group.id} data-name={group.id} className="groupModify">
                                <h3>Nom du groupe</h3>
                                <input type="text" name="group_name" value={modifiedGroup?.group_name || "Loading..."} onChange={modifyGroup} />
                                
                                <h3>Date de la présentation</h3>
                                <input type="datetime-local" name="date_presentation" value={modifiedGroup?.date_presentation || ""} onChange={modifyGroup} />
                                
                                <h3>Possède un leader?</h3>
                                <input type="checkbox" name="have_leader" checked={modifiedGroup?.have_leader || false} onChange={modifyGroup} />
                                
                                <h3>Nom du leader</h3>
                                <select name="leader" value={JSON.stringify(leader)} onChange={modifyGroupLeader}>
                                    <option value={group.nom_leader}>Pas de changement</option>
                                    {leadersData.map(leader => (
                                        <option key={leader.id} value={JSON.stringify({ nom_leader: leader.nom, leader_id: leader.id })}>
                                            {leader.nom}
                                        </option>
                                    ))}
                                </select>
    
                                <h3>Groupe actif?</h3>
                                <input type="checkbox" name="active" checked={modifiedGroup?.active || false} onChange={modifyGroup} />
    
                                <h4>Membres du groupe :</h4>
                                <div className="groupMembers">
                                    {filteredClientsData?.length > 0 ? (
                                        filteredClientsData.map(client => (
                                            <div key={client.id} className="clientModify">
                                                <img className="imgSmall" src={profilePhotos[client.nom] || iconeProfile} alt={client.nom} />
                                                <p>{client.nom}</p>
                                                <p>{client.email}</p>
                                                <button data-name={client.id} onClick={handleRemoveClient}>X</button>
                                            </div>
                                        ))
                                    ) : (
                                        <p>Aucun membre</p>
                                    )}
                                </div>
    
                                <div className="addingMember">
                                    <label htmlFor="members_ids">Ajouter des clients existants</label>
                                    <select name="members_ids" value={selectedClientId} onChange={handleMemberId}>
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
                                    <button onClick={() => setModify(false)}>Annuler</button>
                                </div>
                            </div>
                        );
                    }
    
                    
                    if (expand && selectedId === group.id) {
                        return (
                            <div key={group.id} data-name={group.id} className="group" onClick={handleExpand}>
                                <h3>Nom du groupe</h3>
                                <p>{group.group_name}</p>
    
                                <h3>Date de la présentation</h3>
                                <p>{group.date_presentation ? new Date(group.date_presentation).toLocaleString('en-CA') : "Date non définie"}</p>
    
                                <div className="groupMembers">
                                    {group.have_leader && (
                                        <>
                                            <h4>Leader :</h4>
                                            <div className="client">
                                                <img className="imgSmall" src={profilePhotos[group.nom_leader] || iconeProfile} alt={group.nom_leader} />
                                                <p><Link to={`../details/${leadersData.find(leader => leader.nom === group.nom_leader).clientid}`}>{group.nom_leader}</Link></p>
                                                <p>{leadersData.find(leader => leader.nom === group.nom_leader)?.email || "Email inconnu"}</p>
                                                <div className="showProfileInput">
                                                    <button id={group.leader_id} className="canva" onClick={handleGenerateCanva}>Générer Canva</button>
                                                    <label htmlFor="showProfile">Montrer profil?</label>
                                                    <input id={leadersData.find(leader => leader.nom === group.nom_leader).clientid} type="checkbox" name="showProfile" checked={clientsData.find(leader => leader.nom_client === group.nom_leader)?.showProfile || false} onChange={handleShowProfile}/>
                                                    
                                                </div>
                                                
                                            </div>
                                        </>
                                    )}
    
                                    <h4>Membres du groupe :</h4>
                                    {filteredClientsData?.length > 0 ? (
                                        filteredClientsData.map(client => (
                                            <div key={client.id} className="client">
                                                <img className="imgSmall" src={profilePhotos[client.nom] || iconeProfile} alt={client.nom} />
                                                <p><Link to={`../details/${client.id}`}>{client.nom}</Link></p>
                                                <p>{client.email}</p>
                                                <div className="showProfileInput">
                                                    
                                                    <button id={client.id} name={client.form_ids[client.form_ids.length -1]} className="canva" onClick={handleGenerateProfile}>Générer Profil</button>

                                                    {client.profile_ids[0] ?
                                                    <button id={client.id} className="canva" onClick={handleGenerateCanva}>Générer Canva</button>
                                                    : null}
                                                    
                                                    <label htmlFor="showProfile">Montrer profil?</label>
                                                    <input id={client.id} type="checkbox" name="showProfile" checked={client && client.showProfile  ? client.showProfile : false} onChange={handleShowProfile}/>
                                                </div>
                                                
                                            </div>
                                        ))
                                    ) : (
                                        <p>Aucun membre</p>
                                    )}
                                </div>
    
                                <div className="groupButton">
                                    <button onClick={() => setModify(true)}>Modifier</button>
                                    <button onClick={handleUrl}>Générer un lien de questionnaire</button>
                                    <button onClick={handleReduire}>Réduire</button>
                                </div>
    
                                {formUrl && (
                                    <div className="groupA">
                                        <a href={formUrl} rel="noopener noreferrer">{formUrl}</a>
                                        <button onClick={handleCopy}>Copier</button>
                                    </div>
                                )}
                            </div>
                        );
                    }
    
                    // 🔥 Condition par défaut : Affichage réduit (fermé)
                    return (
                        <div key={group.id} data-name={group.id} className="group" onClick={handleExpand}>
                            <h3>Nom du groupe</h3>
                            <p>{group.group_name}</p>
                            <h3>Date de la présentation</h3>
                            <p>{group.date_presentation ? new Date(group.date_presentation).toLocaleString('en-CA') : "Date non définie"}</p>
                            <h3>Nom du leader</h3>
                            <p>{group.have_leader ? group.nom_leader : "Groupe sans leader"}</p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
    
}
