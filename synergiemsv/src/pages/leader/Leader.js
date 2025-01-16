import React, {useEffect, useContext} from "react";
import { NavLink, useParams } from "react-router-dom";
import { Outlet } from "react-router-dom";
import { AuthContext } from "../AuthContext";
import { useNavigate } from "react-router-dom";
import "../pages.css";
import "../admin/admin.css";
import "./leader.css"
import image from "../../Images/logo2 sans fond.png";


export function Leader() {
    const {id} = useParams()
    
    return(
        <div className="leader">
            <nav className="nav">
                <ul>
                    
                    <li><NavLink to={`/leader/${id}`} end className={({ isActive }) => (isActive ? 'isActive' : '')} >Accueil</NavLink></li>
                    <li><NavLink to="objectifs" className={({ isActive }) => (isActive ? 'isActive' : '')} >Objectifs</NavLink></li>
                    
                    <li><NavLink to="details" className={({ isActive }) => (isActive ? 'isActive' : '')} >Informations</NavLink></li>
                    <li><NavLink to="settings" className={({ isActive }) => (isActive ? 'isActive' : '')} >Paramètres</NavLink></li>
                    <a href="https://www.synergiemsv.com"><img src={image} alt="logo SynergieMSV" /></a>
                </ul> 
            </nav>
            
            <Outlet />
        </div>
    )
}