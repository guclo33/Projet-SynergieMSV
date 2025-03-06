import React, { createContext, useState, useEffect, useContext } from 'react';
import { AuthContext, AuthProvider } from '../AuthContext';
import { useParams } from 'react-router';
import { Provider, useDispatch } from 'react-redux';
import { PersistGate } from 'redux-persist/lib/integration/react';
import { setGroupesData } from './Redux/adminSlice';

export const AdminContext = createContext();

export const AdminProvider = ({ children, store, persistor }) => {
    const [leadersData, setLeadersData] = useState([])
    const [clientsData, setClientsData] = useState([])
    const [udpatedClientsData, setUpdatedClientsData] = useState([]);
    const [udpatedLeadersData, setUpdatedLeadersData] = useState([]);
    const [profilePhotos, setProfilePhotos] = useState({})
    const dispatch = useDispatch()
    const { id } = useParams()
    const apiUrl = process.env.REACT_APP_RENDER_API || 'http://localhost:3000';


    useEffect(() => {
        console.log(`${apiUrl}/api/admin/${id}`);
        const getAdminHomeData = async () => {
            try {
                const response = await fetch(`${apiUrl}/api/admin/${id}`, {
                    method: "GET",
                    credentials: "include",
                });
                if (response.ok) {
                    const data = await response.json();
                    console.log("here's data", data)
                    const dataArray = data.leadersData.rows.map((row) => ({
                        id: row.leaderid,
                        clientid: row.clientid,
                        active: row.active,
                        nom: row.nom,
                        email: row.email,
                        phone: row.phone,
                        priorite: row.priorite,
                        echeance: row.echeance,
                        date_presentation: row.date_presentation,
                        statut: row.statut
                    }));
                    console.log(dataArray)
                    const clientsArray = data.clientsData.rows.map((row) => ({
                        id: row.id,
                        nom: row.nom_client,
                        nom_leader: row.nom_leader,
                        email: row.email,
                        leader_id: row.leader_id,
                        phone: row.phone,
                        active: row.active,
                        priorite: row.priorite,
                        additional_infos: row.additional_infos,
                        date_presentation: row.date_presentation,
                        echeance: row.echeance,
                        form_ids: row.form_ids,
                        profile_ids: row.profile_ids,

                    }))

                    const groupesData = {
                        groupesData: data.groupesData.groupesData.rows,
                        groupesClients: data.groupesData.groupesClients.rows
                    }
                    dispatch(setGroupesData(groupesData))



                    if (JSON.stringify(leadersData) !== JSON.stringify(dataArray)) {
                        setLeadersData(dataArray);
                    }
                    if (JSON.stringify(clientsData) !== JSON.stringify(clientsArray)) {
                        setClientsData(clientsArray);
                    }



                    try {


                        const promises = clientsArray.map(async (client) => {



                            const response = await fetch(`${apiUrl}/api/admin/${id}/profilePhoto/${client.nom_leader}/${client.nom}`, {
                                method: "GET",
                                credentials: "include",
                            }
                            );
                            if (response.ok) {
                                const imageUrl = await response.json();

                                const name = client.nom
                                setProfilePhotos((prev) => ({
                                    ...prev,
                                    [name]: imageUrl.url
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
                        console.log("couldn't get image url", error)
                    }



                } else {
                    const errorText = await response.text();
                    console.error("Error response from server:", errorText)
                };
            } catch (error) {
                console.error("Could not connect to getadminhomedata", error)
            }
        }
        console.log('user.id', id)
        console.log("getAdmin called")
        getAdminHomeData();

    }, [leadersData, clientsData, id])

    const getAdminHomeData = async () => {
        try {
            const response = await fetch(`${apiUrl}/api/admin/${id}`, {
                method: "GET",
                credentials: "include",
            });
            if (response.ok) {
                const data = await response.json();
                console.log("here's data", data)
                const dataArray = data.leadersData.rows.map((row) => ({
                    id: row.leaderid,
                    clientid: row.clientid,
                    active: row.active,
                    nom: row.nom,
                    email: row.email,
                    phone: row.phone,
                    priorite: row.priorite,
                    echeance: row.echeance,
                    date_presentation: row.date_presentation,
                    statut: row.statut
                }));
                console.log(dataArray)
                const clientsArray = data.clientsData.rows.map((row) => ({
                    id: row.id,
                    nom: row.nom_client,
                    nom_leader: row.nom_leader,
                    email: row.email,
                    leader_id: row.leader_id,
                    phone: row.phone,
                    active: row.active,
                    priorite: row.priorite,
                    additional_infos: row.additional_infos,
                    date_presentation: row.date_presentation,
                    echeance: row.echeance,
                    form_ids: row.form_ids,
                    profile_ids: row.profile_ids,

                }))

                const groupesData = {
                    groupesData: data.groupesData.groupesData.rows,
                    groupesClients: data.groupesData.groupesClients.rows
                }
                dispatch(setGroupesData(groupesData))



                if (JSON.stringify(leadersData) !== JSON.stringify(dataArray)) {
                    setLeadersData(dataArray);
                }
                if (JSON.stringify(clientsData) !== JSON.stringify(clientsArray)) {
                    setClientsData(clientsArray);
                }



                try {


                    const promises = clientsArray.map(async (client) => {



                        const response = await fetch(`${apiUrl}/api/admin/${id}/profilePhoto/${client.nom_leader}/${client.nom}`, {
                            method: "GET",
                            credentials: "include",
                        }
                        );
                        if (response.ok) {
                            const imageUrl = await response.json();

                            const name = client.nom
                            setProfilePhotos((prev) => ({
                                ...prev,
                                [name]: imageUrl.url
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
                    console.log("couldn't get image url", error)
                }



            } else {
                const errorText = await response.text();
                console.error("Error response from server:", errorText)
            };
        } catch (error) {
            console.error("Could not connect to getadminhomedata", error)
        }
    }

    return (

        <AdminContext.Provider value={{ profilePhotos, getAdminHomeData, setProfilePhotos, leadersData, setLeadersData, clientsData, setClientsData, apiUrl }}>
            {children}
        </AdminContext.Provider>

    );


}