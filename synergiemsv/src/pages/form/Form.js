import React, {useContext} from 'react';
import { NavLink } from 'react-router-dom';
import { Outlet } from 'react-router';
import { AuthContext } from '../AuthContext';
import image from '../../Images/logo2 sans fond.png';
import { useSelector, useDispatch } from 'react-redux';
import { setPage, addPage, removePage } from './Redux/pageSlice'



export function Form() {
    const { user} = useContext(AuthContext);
    const state = useSelector((state) => state.someData); // Accéder aux données du store
    const dispatch = useDispatch();

  return (
        <div>

        </div>
  );
}