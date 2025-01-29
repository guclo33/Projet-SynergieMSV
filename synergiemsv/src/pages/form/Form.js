import React, {useContext, useState, useEffect} from 'react';
import { AuthContext } from '../AuthContext';
import { useSelector, useDispatch } from 'react-redux';
import { setPage, addPage, removePage } from './Redux/pageSlice'
import { addKeyValue } from './Redux/formSlice';
import './form.css';
import { FirstPage } from './Components/FirstPage';
import { PagesDISC } from './Components/PagesDISC';
import { QuestionsDev } from './Components/QuestionsDev';
import { decryptParams } from './Components/cryptoFunctions';




export function Form() {
    
    const { user} = useContext(AuthContext);
    const form = useSelector((state) => state.session.form);
    const {pageNum} = useSelector((state) => state.session.page);
    const dispatch = useDispatch();
    const apiUrl = process.env.REACT_APP_RENDER_API || 'http://localhost:3000'

    console.log("page",pageNum)
    

    useEffect(()=> {
        const urlParams = new URLSearchParams(window.location.search)
        const id = urlParams.get("id")
        console.log("URL ID", id)
        const getURLData = async () => {
            try {
                const response = await fetch(`${apiUrl}/api/form/url/${id}`, {
                    method : "GET",
                    credentials: "include",
                    headers: {"Content-Type" : "application/json"}

                });
                if(response.ok) {
                    const data = await response.json();
                    const formData = data[0].data
                    console.log("formData =", formData);

                    dispatch(addKeyValue({key : "have_leader", value : formData.have_leader }))
                    dispatch(addKeyValue({key : "nom_leader", value : formData.nom_leader }))
                    dispatch(addKeyValue({key : "group_id", value : formData.group_id }))
                    dispatch(addKeyValue({key : "group_name", value : formData.group_name }))
                    console.log("FORM =", form)
                    
                }
            } catch( error) {
                console.log("couldnt get data", error)
            }
        }

        getURLData()
    }, [])

    
   /* const encryptedData = urlParams.get("data");
    console.log("🟢 URL Search Params:", window.location.search);
    console.log("🟢 Encrypted Data from URL:", encryptedData);

    if (encryptedData) {
        const decryptedData = decryptParams(decodeURIComponent(encryptedData));
        console.log("🔓 Données déchiffrées :", decryptedData);
    }*/



  return (
        <div className="questionnaire">
            <h1>Questionnaire Synergia</h1>
            {pageNum === 0 ?
                (
                    <FirstPage  />
                ): pageNum === 25 ? (
                    <QuestionsDev />
                ):(
                    <PagesDISC />
                )}
                
        </div>
  );
}