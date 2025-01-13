import React, {useEffect, useContext} from "react";
import { NavLink, useParams } from "react-router-dom";
import { Outlet } from "react-router-dom";
import { AuthContext } from "../AuthContext";
import { useNavigate } from "react-router-dom";
import "../pages.css";
import image from "../../Images/logo2 sans fond.png";


export function User() {
    const {id} = useParams()
    
    return(
        <div className="user">
            <nav className="nav">
                <ul>
                    
                    <li><NavLink to={`/user/${id}`} end className={({ isActive }) => (isActive ? 'isActive' : '')} >Accueil</NavLink></li>
                    <li><NavLink to="objectifs" className={({ isActive }) => (isActive ? 'isActive' : '')} >Objectifs</NavLink></li>
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