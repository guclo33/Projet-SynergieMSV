import React, { createContext, useState, useEffect, useContext } from 'react';
import { AuthContext, AuthProvider } from '../AuthContext';
import { useParams } from 'react-router';

export const UserContext = createContext();

export const UserProvider = ({children}) => {
    const [userData, setUserData] = useState([])
    const [profilePhotos, setProfilePhotos] = useState({})
    const {id} = useParams()
    const apiUrl = process.env.REACT_APP_RENDER_API || 'http://localhost:3000';


    useEffect( () => {
           
    }, [])
    
        return (
            <UserContext.Provider value={{  }}>
              {children}
            </UserContext.Provider>
          );
    


}