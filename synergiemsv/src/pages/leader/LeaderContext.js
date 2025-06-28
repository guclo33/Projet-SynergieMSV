import React, { createContext, useState, useEffect, useContext } from 'react';
import { AuthContext, AuthProvider } from '../AuthContext';
import { useParams } from 'react-router';

export const LeaderContext = createContext();

export const LeaderProvider = ({children}) => {
    const [leaderData, setLeaderData] = useState([])
    const [profilePhotos, setProfilePhotos] = useState({})
    const {id} = useParams()
    const apiUrl = process.env.REACT_APP_RENDER_API || 'http://localhost:3000';


    useEffect( () => {
        const getLeaderData = async () => {

            try { 
                const response= await fetch(`${apiUrl}/api/leader/${id}`, {
                    method: "GET",
                    credentials: "include"
                });
                if(response.ok){
                    const data = await response.json();

                    setLeaderData(data)


                    try {
                                
                                
                        const promises = data.equipe.map(async (client) => {
                            const response = await fetch(`${apiUrl}/api/leader/${id}/${data.info.nom_client}/${client.nom}/photos`,{
                                method: "GET",
                                credentials: "include",
                                }
                            );
                            if(response.ok){
                                const imageUrl = await response.json();

                                const name = client.nom
                                setProfilePhotos((prev) => ({
                                    ...prev,
                                    [name] : imageUrl.url
                                }))
                            } /*else {
                                const name = client.nom
                                setProfilePhotos((prev) => ({
                                    ...prev,
                                    [name] : null
                                }))
                            }*/
                        })

                        await Promise.all(promises)

                    
                        
                    } catch (error) {
                        console.error("couldn't get image url", error)
                    }

                } else {
                    const errorText = await response.text();
                    console.error("Error response from server:", errorText)
                }

            } catch(error) {
                console.error("error", error)
            }
        };


        getLeaderData() 
        
    }, [])

        return (
            <LeaderContext.Provider value={{ leaderData, setLeaderData, profilePhotos, setProfilePhotos }}>
              {children}
            </LeaderContext.Provider>
          );
    


}