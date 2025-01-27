import React, {useState, useEffect, useContext, useCallback} from "react";
import { useSelector, useDispatch } from "react-redux";
import { AdminContext } from "../../AdminContext";
import { encryptParams } from "../../../form/Components/cryptoFunctions";

export function GroupeList() {
    const [active, setActive] = useState(true)
    const [selectedId, setSelectedId] = useState(null)
    const [expand, setExpand] = useState(false)
    const {clientsData, apiUrl} = useContext(AdminContext)
    const [modify, setModify] = useState(false)
    const [formUrl, setFormUrl] = useState("")
    const [clientsRemoved, setClientsRemoved] = useState([])
    const [clientsAdded, setClientsAdded] = useState([])
    const [clientsFilteredArray, setClientsFilteredArray] = useState([])
    const [selectedClientId, setSelectedClientId] = useState()
    const [filteredClientsData, setFilteredClientsData] = useState([])
    
    const {groupesData, groupesClients} = useSelector((state) => state.admin.groupesData)
    const [modifiedGroup , setModifiedGroup] = useState({})
    const dispatch = useDispatch()
    const apiUrlLocal = process.env.REACT_APP_RENDER_API || 'http://localhost:3001'
    
    useEffect(() => {
        const selectedGroup = groupesData.find(group => group.id === selectedId)
        setModifiedGroup(selectedGroup)
        setClientsRemoved([])
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

    console.log("GROUPES DATA ====", groupesData, "GROUPES CLIENTS", groupesClients, "ACTIVE GROUP ===", activeGroups)

    let groupClientsArray =[]
    const selectedGroupClients = groupesClients.filter(client => client.groupe_id === selectedId)
    const firstFilter = clientsData.filter(client=> selectedGroupClients.some(groupClient => groupClient.client_id === client.id))
    groupClientsArray = firstFilter
    let filteredClients = []

    useEffect(() => {
        filteredClients = clientsData.filter(client => !groupClientsArray.map(cli => cli.id).includes(client.id))
        setFilteredClientsData(filteredClients)
    }, [clientsAdded, clientsRemoved])

    useEffect(() => {
        if (clientsRemoved.length>0) {
            groupClientsArray = firstFilter.filter(client => !clientsRemoved.includes(client.id))
            console.log("selectedGroupClients ===", selectedGroupClients,"groupClientsArray ====",groupClientsArray)
            setClientsFilteredArray(groupClientsArray)
            return
        }
        setClientsFilteredArray(groupClientsArray)
            
            
        
    },[clientsRemoved])
    

    const handleExpand = (e) => {
        const name = e.currentTarget.dataset.name
        if(selectedId !== name) {
            setSelectedId(Number(name))
        }
        setExpand(prev => prev && selectedId === name ? false : true);
        
        
        console.log("expand", expand, "selectedID==", selectedId, "NAME", name)
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
        const {name, value} = e.target;
        setModifiedGroup( prev => ({
            ...prev,
            [name] : value
    }))
    }

    const handleRemoveClient = (e) => {
        const name = e.currentTarget.dataset.name
        const id = Number(name)
        setClientsRemoved(prev => ( [...prev, id]))
        
    }

    const handleMemberId = (e) => {
        const selectedId = Number(e.target.value)
        setSelectedClientId(selectedId)
        console.log("adding this value", selectedId)
        if(!clientsAdded.includes(selectedId)) {
        setClientsAdded(prev => ([...prev, selectedId]))
        }
        console.log("addedCLIENTS ==", clientsAdded)
    }
    
    console.log("CLIENTSREMOVED= =", clientsRemoved)
    
    return (
        <div className="gestionGroupe">
            <h2>Vos groupes de formation :</h2>
            <label htmlFor="active?">Voir vos groupes inactif</label>
            <input type="checkbox" checked={!active} onChange={()=> setActive(!active)} />
            <div className="groupList">
            
                {activeGroups.map(group =>(
                    
                    (expand && selectedId === group.id) ? (  
                        modify ? (
                            <div key={group.id} data-name={group.id} className="groupModify" onClick={handleExpand}>
                                <h3>Nom du groupe</h3>
                                <input type="text" name="group_name" value={modifiedGroup.group_name} onChange={modifyGroup}/>
                                <h3>Date de la présentation</h3>
                                <input type="datetime-local" name="date_presentation" value={modifiedGroup.date_presentation} onChange={modifyGroup}/>
                                <h3>possède un leader?</h3>
                                <input type="checkbox" name="have_leader" checked={modifiedGroup.have_leader} onChange={modifyGroup}/>
                                <h3>Nom du leader</h3>
                                <input type="text" name="nom_leader" value={modifiedGroup.nom_leader} onChange={modifyGroup}/>
                                <h3>Groupe actif?</h3>
                                <input type="checkbox" name="active" checked={modifiedGroup.active} onChange={modifyGroup}/>
                                <h4>Membres du groupe :</h4>
                                <div className="groupMembers">
                                {clientsFilteredArray.length > 0 ? 
                                clientsFilteredArray.map(client => (
                                    <div className="clientModify">
                                        <p>{client.nom}</p>
                                        <p>{client.email}</p>
                                        <button data-name={client.id} onClick={handleRemoveClient}>X</button>
                                        
                                    </div> )) : null}

                                </div>
                                <div className="addingMember">
                                    <label htmlFor="members_ids">Ajouter des clients déjà existants</label>
                                    <select  name="members_ids" value={selectedClientId} onChange={handleMemberId}>
                                        <option>-- Sélectionner un autre client --</option>
                                        {filteredClientsData.map(client => (
                                        <option key={client.id} value={client.id}>
                                            {client.nom}, {client.email}
                                        </option>
                                    ))}
                                    </select>
                                </div>
                                <div className="modifyGroupButtons">
                                    <button>Modifier</button>
                                    <button onClick={()=>setModify(false)}>Annuler</button>
                                </div>
                            </div>
                        ) : (

                        
                        <div key={group.id} data-name={group.id} className="group" onClick={handleExpand}>
                            <h3>Nom du groupe</h3>
                            <p>{group.group_name}</p>
                            <h3>Date de la présentation</h3>
                            <p>{group.date_presentation ? new Date(group.date_presentation).toLocaleString('en-CA') : "Date non définie"}</p>
                            <h3>Nom du leader</h3>
                            <p>{group.have_leader === true ? group.nom_leader : "Groupe sans leader"}</p>
                            <h4>Membres du groupe :</h4>
                            <div className="groupMembers">
                            {clientsFilteredArray.length > 0 ? 
                            clientsFilteredArray.map(client => (
                                <div className="client">
                                    <p>{client.nom}</p>
                                    <p>{client.email}</p>
                                    
                                </div>
                            ))
                            : null}
                            </div>
                            <div className="groupButton">
                                <button onClick={()=>(setModify(true))}>Modifier</button>
                                <button onClick={handleUrl}>Générer un lien de questionnaire</button>
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