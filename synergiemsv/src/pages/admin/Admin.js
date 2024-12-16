import React, {useEffect, useContext} from "react";
import { NavLink, useParams } from "react-router-dom";
import { Outlet } from "react-router-dom";
import { AuthContext } from "../AuthContext";
import { useNavigate } from "react-router-dom";
import "../pages.css";
import image from "../../Images/logo2 sans fond.png";



export function Admin() {
    const { user} = useContext(AuthContext);
    const { id } = useParams()
  
    const navigate = useNavigate()

    

    /*useEffect(() => {
        if(user) {
            console.log(`Voici les infos envoyer au server : ${user.id}`)
            const data = {user}
            const setUser = async() => {
                try {
                    const response = await fetch("http://localhost:3000/api/admin/setsession",{
                        method: "POST",
                        credentials: "include",
                        headers : {
                            "Content-Type" : "application/json" 
                        },
                        body : JSON.stringify(data)                   
                    });
                    if(response.ok) {
                        console.log(`Session on server successfully saved for ${user.username}`)
                    } else {
                        console.log("problem saving user info")
                    }

                } catch(error){
                    console.error("could not send user info to the server")
                }
            }
        
            setUser()
        }
    }, [user])*/

    if (!user) {
        // Si les données de l'utilisateur ne sont pas encore chargées, ne pas rediriger
        return <div>Loading...</div>;
      }

    if(user.role !== "admin" && user.id !== id) {
            navigate("/unauthorized");
            return null;
        }

    return(
        <div className="admin">
            <nav className="navAdmin">
                <ul>
                    
                    <li><NavLink to={`/admin/${id}`} end className={({ isActive }) => (isActive ? 'isActive' : '')} >Accueil</NavLink></li>
                    <li><NavLink to="overview" className={({ isActive }) => (isActive ? 'isActive' : '')} >Vue d'ensemble</NavLink></li>
                    <li><NavLink to="roadmap" className={({ isActive }) => (isActive ? 'isActive' : '')} >Feuille de route</NavLink></li>
                    <li><NavLink to="details" className={({ isActive }) => (isActive ? 'isActive' : '')} >Informations</NavLink></li>
                    <li><NavLink to="settings" className={({ isActive }) => (isActive ? 'isActive' : '')} >Paramètres</NavLink></li>
                    <a href="https://www.synergiemsv.com"><img src={image} alt="logo SynergieMSV" /></a>
                </ul> 
            </nav>
            
            <Outlet />
        </div>
    )
}