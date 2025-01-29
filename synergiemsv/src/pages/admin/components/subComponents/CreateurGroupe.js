import React, {useState, useEffect, useContext} from "react";
import { useDispatch, useSelector } from "react-redux";
import Modal from "react-modal"
import { appendMembersIds, removeMembersIds, resetNewGroup, setNewGroup, setNewLeader } from "../../Redux/adminSlice";
import { AdminContext } from "../../AdminContext";
import { AuthContext } from "../../../AuthContext";


export function CreateurGroupe() {
    const [creatingGroup, setCreatingGroup] = useState(false)
    const newGroup = useSelector((state) => state.admin.newGroup)
    const newLeader = useSelector((state) => state.admin.newLeader)
    const {leadersData, clientsData, apiUrl} = useContext(AdminContext)
    const dispatch = useDispatch()
    const [newLeaderModal, setNewLeaderModal] = useState(false)
    const [singleClientId, setSingleClientId] = useState()
    const {user} = useContext(AuthContext)

    useEffect(() => {
        
        if(leadersData && newGroup && newGroup.nom_leader){
        const selectedLeader = leadersData.find(leader => leader.nom === newGroup.nom_leader);
        dispatch(setNewGroup({key : "leader_id", value : selectedLeader.id}))
        }
    }, [newGroup.nom_leader])

    const handleChange = (e) => {
        const {name, value} = e.target;
        dispatch(setNewGroup({key: name, value : value}))
    }

    const handleClick = (e) => {
        e.preventDefault()
        setNewLeaderModal(!newLeaderModal)
    }

    const handleLeaderChange = (e) => {
        const {name, value} = e.target;
        dispatch(setNewLeader({key : name, value : value}))

    }

    
    const handleMemberId = (e) => {
        const selectedId = Number(e.target.value)
        setSingleClientId(selectedId)
        
        if(!newGroup.members_ids.includes(selectedId)) {
        dispatch(appendMembersIds(selectedId))
        }
    }

    const handleRemoveClient = (e, value) => {
        e.preventDefault();
        
        dispatch(removeMembersIds(value))
    }

    const handleReset = (e) => {
        e.preventDefault()
        dispatch(resetNewGroup())
    }

    const handleExit = (e) => {
        e.preventDefault();
        setCreatingGroup(false)
    }

   
    let filteredClientsData = [];
    let groupClientsArray = [];
    if(clientsData && newGroup && newGroup.members_ids) {

        groupClientsArray = clientsData.filter(client => Array.isArray(newGroup.members_ids) && newGroup.members_ids.map(id => Number(id)).includes(Number(client.id)));

        filteredClientsData = clientsData.filter(client => Array.isArray(newGroup.members_ids) && !newGroup.members_ids.map(id => Number(id)).includes(Number(client.id)))
    }

    const handleAddLeader = async (e) => {
        e.preventDefault()
        try{
            const response = await fetch (`${apiUrl}/api/admin/${user.id}/gestion/leader`, {
                method : "POST",
                credentials : "include",
                headers : {
                    "Content-Type" : "application/json"
                },
                body: JSON.stringify(newLeader)
            })
            if(response.ok){
                console.log("leader créé avec succès")
                const addedLeader = {
                    nom : newLeader.nom_leader,
                    email : newLeader.email
                }
                leadersData.push(addedLeader)
                setNewLeaderModal(false)

            }

        } catch( error) {
            console.log("couldn't add leader", error)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch (`${apiUrl}/api/admin/${user.id}/gestion/groupe`, {
                method : "POST",
                credentials : "include",
                headers : {
                    "Content-Type" : "application/json"
                },
                body: JSON.stringify(newGroup)
            });
            if(response.ok) {
                console.log("groupe créé avec succès!")
                setCreatingGroup(false)
                dispatch(resetNewGroup())
            }


        } catch(error) {
            console.log("Couldn't add group to server" , error)
        }
    }
    
    

    return (
        <>
            
            {creatingGroup ?
            
            <form onSubmit={handleSubmit}>
                <div className="question">
                    <label htmlFor="group_name">Nom du nouveau groupe:</label>
                    <input type="text" name="group_name" value={newGroup.group_name} onChange={handleChange} required/>
                </div>
                <div className="question">
                    <label htmlFor="date_presentation">Date présentation</label>
                    <input type="datetime-local" name="date_presentation" value={newGroup.date_presentation} onChange={handleChange} />
                </div>
                <div className="question">
                    <label htmlFor="have_leader">Est-ce que ce groupe a un leader?</label>
                    <input type="checkbox" name="have_leader" checked={newGroup.have_leader} onChange={(e)=> dispatch(setNewGroup({key:e.target.name, value: e.target.checked}))}/>
                </div>
                {newGroup.have_leader ? 
                <div className="question">
                    <label htmlFor="nom_leader">Quel est le nom du leader?</label>
                    <select  name="nom_leader" value={newGroup.nom_leader} onChange={handleChange}>
                        <option>-- Sélectionnez un leader --</option>
                        {leadersData.map(leader => (
                            <option key={leader.id} value={leader.nom}>
                                {leader.nom}, {leader.email}
                            </option>
                        ))}
                    </select>
                    <button onClick={handleClick}>Ajouter un leader</button>
                </div>
            : null
                
                }
                <div className="question">
                        <label htmlFor="members_ids">Ajouter des clients déjà existants</label>
                        <select  name="members_ids" value={singleClientId} onChange={handleMemberId}>
                        {filteredClientsData.map(client => (
                            <option key={client.id} value={client.id}>
                                {client.nom}, {client.email}
                            </option>
                        ))}
                        </select>
                </div>
                <h3>Liste des membres du groupe :</h3>
                <div className="groupMembers">
                    {groupClientsArray.length > 0 ? 
                    groupClientsArray.map(client => (
                        <div className="client">
                            <p>{client.nom}</p>
                            <p>{client.email}</p>
                            <button onClick={(e) => handleRemoveClient(e, client.id)}>Retirer</button>
                        </div>
                    ))
                    : null}
                </div>

            <button type="submit">Soumettre le nouveau groupe</button>
            <button onClick={handleReset}>Reset</button>
            <button onClick={handleExit}>Sortir</button>
            <Modal className="modal" isOpen={newLeaderModal} onRequestClose={() => setNewLeaderModal(false)}>
            <div className="modalContent">
                <h2>Ajouter un nouveau leader</h2>
                <div>
                    <div className="inputModal">
                        <label htmlfor="nom_leader">Nom complet</label>
                        <input className="text" name="nom_leader" value={newLeader.nom_leader} type="text" onChange={handleLeaderChange}/>
                    </div>
                    <div className="inputModal">
                        <label htmlfor="email">Email</label>
                        <input type="text" name="email" value={newGroup.email} onChange={handleLeaderChange} />
                    </div>
                
                    <button className="submitAddLeader" name="submitAddLeaders" onClick={handleAddLeader}>Soumettre</button>
                </div>
            
                <button name="unShowModal" onClick={()=> setNewLeaderModal(false)}>Fermer</button>
            </div>
        </Modal>

                
                
            </form>
            
            : <button onClick={()=> setCreatingGroup(true)}>Créer un nouveau groupe</button>}
        </>
    )
}

/*

                        <Modal className="modal" isOpen={deleteModal} onRequestClose={() => setDeleteModal(false)}>
                            <div className="modalContent">
                                <h2>Supprimer des tâches</h2>
                                <form onSubmit={handleDeleteTodos}>
                                    
                                    <div className="inputDeleteModal">
                                        <label htmlfor="task">Catégorie</label>
                                        <select name="task" value={deleteTodos.task} onChange={handleDeleteTodosChange}>
                                            {filteredRoadmapdata.map(task =>(
                                                <option key={task.task} value={task.task}>{task.task}</option>
                                                
                                            ))}
                                        </select>
                                    </div>
                                    <div className="inputDeleteModal">
                                        <label htmlfor="delete_default">Supprimer pour tous les leaders?</label>
                                        <input type="checkbox" name="delete_default" value={deleteTodos.delete_default} checked={deleteTodos.delete_default} onChange={handleDeleteTodosChange}/>
                                    </div>
                                    <button className="submitDeleteTodos" name="submitDeleteTodos" type="submit">Soumettre</button>
                                </form>
                                <button name="unShowModal" onClick={()=> setDeleteModal(false)}>Fermer</button>
                                </div>
                        </Modal>*/