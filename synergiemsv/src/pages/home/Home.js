import React from "react";
import { Link } from 'react-router-dom';
import image from "../../Images/logo2 sans fond.png"
import "../pages.css"
import { useLocation } from "react-router-dom";



export function Home() {
    const location = useLocation();
    
    return (
        <div className="home">
            <nav>
            <ul>
                    
                    <li style={{
          fontWeight: location.pathname === '/' ? 'bold' : 'normal',
        }}><Link to="/">Accueil</Link></li>
                    <li style={{
          fontWeight: location.pathname === '/login' ? 'bold' : 'normal',
        }}><Link to="/login">Se connecter</Link></li>
                    <li style={{
          fontWeight: location.pathname === '/register' ? 'bold' : 'normal',
        }}><Link to="/register">Créer un compte</Link></li>
                    <a href="https://www.synergiemsv.com"><img src={image} alt="logo SynergieMSV" /></a>
                </ul>
            </nav>
            
        </div>
    )
}