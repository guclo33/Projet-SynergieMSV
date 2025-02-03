import React, {useContext} from 'react';
import { NavLink } from 'react-router-dom';
import { Outlet } from 'react-router';
import { AuthContext } from '../AuthContext';
import { Form } from 'react-router-dom';
import image from '../../Images/logo2 sans fond.png';

export function FormHome() {
    const { user} = useContext(AuthContext);

  return (
    <div className="form">
      <Outlet/>
    </div>
  );
}

/*
<nav className="navForm">
                    <ul>
                        
                        <li><NavLink to={user ? `/${user.role}/${user.id}` : '/'} end className={({ isActive }) => (isActive ? 'isActive' : '')} >Accueil</NavLink></li>
                        
                        <a href="https://www.synergiemsv.com"><img src={image} alt="logo SynergieMSV" /></a>
                    </ul> 
                </nav>
                
                <Outlet />

*/