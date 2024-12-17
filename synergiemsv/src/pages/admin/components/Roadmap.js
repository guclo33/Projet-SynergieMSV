import React, {useState, useEffect, useContext} from "react";
import { useParams, useLocation } from "react-router";
import { AuthContext } from "../../AuthContext";
import { Link } from "react-router-dom";
import Modal from "react-modal"


export function Roadmap() {
    
    const [filteredRoadmapdata, setFilteredRoadMapData] = useState([])
    const [fullRoadData, setFullRoadData] = useState([]);
    const [showDone, setShowDone] = useState(false)
    const [addTodos, setAddTodos] = useState({
        task: "",
        category: "",
        is_default: false
    })
    const [showModal, setShowModal] = useState(false);
    const [deleteTodos, setDeleteTodos] = useState({
        task: "",
        delete_default: false
    })
    const [deleteModal, setDeleteModal] = useState(false)
    const {leaderid} = useParams()
    const {user} = useContext(AuthContext)
    const location = useLocation()

    

    useEffect(() => {
        const getRoadmapData = async () => {
            try {
                const response = await fetch(`http://localhost:3000/api/admin/${user.id}/roadmap`, {
                    method: "GET",
                    credentials: "include",
                    });
                    if(response.ok){
                        const data = await response.json();
                        
                        if(!leaderid) {
                            console.log("fullRoadData:", data.rows)
                            setFullRoadData(data.rows)
                            return
                        }
                        
                        console.log("leader id:", leaderid)
                        console.log("filteredRoadmap data avec leader id:", data.rows.filter(leader => leader.leader == leaderid))
                        setFilteredRoadMapData(data.rows.filter(leader => leader.leader == leaderid))
                        return 
                        
                        
                        
                    } else {
                        const errorText = await response.text();
                        console.error("Error response from server:", errorText)
                };
            } catch(error) {
                console.error("Could not connect to getRoadmapData", error)
            }
        }
        if (!user || !user.id) {
            console.error("User ID is undefined");
            return;
        }
        
        

        getRoadmapData()
    }, [leaderid])
    
    if (!leaderid && !fullRoadData) {
        return <p>Loading...</p>;
    }

    if(leaderid && !filteredRoadmapdata) {
        return <p>Loading...</p>;
    }

    let dataArrayPreparation = null;
    let dataArrayExecution = null;
    let dataArrayPrepDataDone = null;
    let dataArrayExecDataDone = null;

    if(filteredRoadmapdata) {
        dataArrayPreparation = filteredRoadmapdata.filter(row => row.category === "préparation" && row.is_completed == false)
        console.log(" dataArrayPreparation", dataArrayPreparation)

        dataArrayExecution = filteredRoadmapdata.filter(row => row.category === "exécution" && row.is_completed == false)
        console.log(" dataArrayExecution", dataArrayExecution)

        dataArrayPrepDataDone = filteredRoadmapdata.filter(row => row.category === "préparation" && row.is_completed == true)
        console.log(" dataArrayPrepDataDone", dataArrayPrepDataDone)

        dataArrayExecDataDone = filteredRoadmapdata.filter(row => row.category === "exécution" && row.is_completed == true)
        console.log(" dataArrayExecDataDone", dataArrayExecDataDone)
        
    }

    
    const handleButton = () => {
        setShowDone(!showDone)
    }

    const handleClick = async (e) => {
        
        const {value} = e.target
        const {name} = e.target
        let newValue = null
        console.log("value", value)
        if (value === "true") {
            newValue = false
            console.log("newValue", newValue)
        } 
        if (value === "false") {
            newValue = true
            console.log("newValue", newValue)
        }
        

        
        try{
            const response = await fetch(`http://localhost:3000/api/admin/${user.id}/roadmap`, {
                method: "PUT",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body : JSON.stringify({
                    is_completed: newValue,
                    task: name,
                    leaderid : leaderid
                })
            });
            if(response.ok){
                console.log(`succesfully updated ${name} with ${newValue}`)

            } else {
                console.log("could not update the task")
            }
        } catch(error) {
            console.log("error updating todo list", error)
        }
    }
    
    const uniqueLeaders = fullRoadData.reduce((acc, current) => {
        if (!acc.find(item => item.nom === current.nom)) {
            acc.push(current);
        }
        return acc;
    }, []);
   /* const handleNewTask = async() => {

    }*/
    
    /*if (!filteredObjectPrep || !roadmapPrepData || !roadmapExecData) {
        return <p>Loading...</p>;
    }*/
    
    const handleAddTodos = async (e) => {
        e.preventDefault()


        try {
            const response = await fetch(`http://localhost:3000/api/admin/${user.id}/roadmap/${leaderid}`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    
                    task: addTodos.task,
                    category: addTodos.category,
                    is_default: addTodos.is_default
                })
            });
            if(response.ok){
                console.log("Task succesfully added")
                setShowModal(false)
            } else {
                console.log("could not add task")
            }

        } catch(error) {
            console.log("error adding todos", error)
        }
    };

    const handleAddTodosChange =(e) => {
        const {name, value} = e.target;
        setAddTodos((prev) => ({
            ...prev,
            [name] : value
        }))
    }

    const handleDeleteTodos = async (e) => {
        e.preventDefault();
        const userConfirmed = window.confirm("Êtes-vous certain de vouloir supprimer cette tâche ?");

        if(userConfirmed) {
            try {
                const response = await fetch(`http://localhost:3000/api/admin/${user.id}/roadmap/${leaderid}`, {
                    method: "DELETE",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        
                        task: deleteTodos.task,
                        delete_default: deleteTodos.delete_default
                    })
                });
                if(response.ok){
                    console.log("Task succesfully deleted")
                    setDeleteModal(false)
                } else {
                    console.log("could not delete task")
                }

            } catch(error) {
                console.log("error deleting todos", error)
            }
        } else {
            console.alert("suppression annulée")
        }
    }

    const handleDeleteTodosChange =(e) => {
        const {name, value} = e.target;
        setDeleteTodos((prev) => ({
            ...prev,
            [name] : value
        }))
    }
        

    return(
        <div className="roadmap">
            <h2>Feuille de route</h2>
           
                {leaderid ? (
                    <div className="todoList">
                            <h2>{filteredRoadmapdata.nom}</h2>
                            <h3>Préparation</h3>
                            <div key={filteredRoadmapdata.leader} >
                                <div className="preparation">
                                {dataArrayPreparation.map((task) => (
                                    <div key={task} className="todo">
                                        <label htmlFor={task.task}>{task.task}</label>
                                        <input name={task.task} value={Boolean(task.is_completed)} type="checkbox" checked={task.is_completed} onChange={handleClick}/>
                                        
                                    </div>
                            ))}
                            </div>
                            {showDone && (
                            <div className="done">
                                <h3 className="tacheComplete">Tâches complétées</h3>
                                <div className="doneChecklist">
                                {dataArrayPrepDataDone.map((task) => (
                                    <div key={task.task} className="todo">
                                        <label htmlFor={task.task}>{task.task}</label>
                                        <input 
                                            name={task.task} 
                                            value={Boolean(task.is_completed)} 
                                            type="checkbox" 
                                            checked={task.is_completed} 
                                            onChange={handleClick} 
                                        />
                                    </div>
                                ))}
                                </div>
                            </div>
                        )}
                        </div>
                        <div className="execution">
                            <h3>Exécution</h3>
                            <div className="execContainer">
                                {dataArrayExecution.map((task) => (
                                    <div key={task.task} className="todo">
                                        <label htmlFor={task.task}>{task.task}</label>
                                        <input name={task.task} value={Boolean(task.is_completed)} type="checkbox" checked={task.is_completed} onChange={handleClick} />
                                    </div>
                                ))}
                            </div>
                            {showDone && (
                                <div className="executionDone">
                                    <h3 className="tacheComplete">Tâches complétées</h3>
                                    <div className="execDoneChecklist">
                                    {dataArrayExecDataDone.map((task) => (
                                
                                        <div key={task.task} className="todo">
                                            <label htmlFor={task.task}>{task.task}</label>
                                            <input name={task.task}  value={Boolean(task.is_completed)} type="checkbox" checked={task.is_completed} onChange={handleClick} />
                                        </div>
                                ))}
                                </div>
                                </div>
                            )}
                        </div>
                        <div className="roadmapButton">
                            <button className="showDone" name="showDone" onClick={handleButton}>Voir tâches complétées</button>
                            <button className="showModal" name="showModal" onClick = {() => setShowModal(true)}>Ajouter une nouvelle tâche</button>
                            <button className="deleteModal" name="deleteModal" onClick = {() => setDeleteModal(true)}>Supprimer des tâches</button>
                        </div>
                        <Modal className="modal" isOpen={showModal} onRequestClose={() => setShowModal(false)}>
                            <div className="modalContent">
                                <h2>Ajouter une nouvelle tâche</h2>
                                <form onSubmit={handleAddTodos}>
                                    <div className="inputModal">
                                        <label htmlfor="task">Description de la tâche</label>
                                        <input className="textArea" name="task" value={addTodos.taks} type="textarea" onChange={handleAddTodosChange}/>
                                    </div>
                                    <div className="inputModal">
                                        <label htmlfor="category">Catégorie</label>
                                        <select name="category" value={addTodos.category} onChange={handleAddTodosChange}>
                                            <option value="préparation">Préparation</option>
                                            <option value="exécution" >Exécution</option>
                                        </select>
                                    </div>
                                    <div className="inputModal">
                                    <label htmlfor="is_default">S'applique à tous les leaders?</label>
                                    <input type="checkbox" name="is_default" value={addTodos.is_default} checked={addTodos.is_default} onChange={handleAddTodosChange}/>
                                    </div>
                                    <button className="submitAddTodos" name="submitAddTodos" type="submit">Soumettre</button>
                                </form>
                            
                                <button name="unShowModal" onClick={()=> setShowModal(false)}>Fermer</button>
                            </div>
                        </Modal>
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
                        </Modal>
                    </div> ): 
                        (
                            
                            <div className="leadersMap">    
                                {uniqueLeaders.map(leader => (
                                <div className="leader" key={leader.leader}>
                                    <h4><Link to={`${leader.leader}`}>{leader.nom}</Link></h4>
                                </div> ))}
                            </div>    
                                
                        )}

                            
                
                  
            
        
    </div>
    )
}

/*<button className="newTask" name="newTask" onClick={handleNewTask}>Créer une nouvelle tâche</button>*/