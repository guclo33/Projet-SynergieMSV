import React, {useContext, useState, useEffect} from 'react';
import { AuthContext } from '../AuthContext';
import { useSelector, useDispatch } from 'react-redux';
import { setPage, addPage, removePage } from './Redux/pageSlice'
import { addValueForm, addValueInfo } from './Redux/formSlice';
import './form.css';
import { FirstPage } from './Components/FirstPage';
import { LastPage } from './Components/LastPage';
import { PagesDISC } from './Components/PagesDISC';
import { QuestionsDev } from './Components/QuestionsDev';
import { decryptParams } from './Components/cryptoFunctions';
import image from '../../Images/logo2 sans fond.png'




export function Form() {
    
    const { user} = useContext(AuthContext);
    const {form, info} = useSelector((state) => state.session.form);
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

                    dispatch(addValueInfo({key : "have_leader", value : formData.have_leader }))
                    dispatch(addValueInfo({key : "nom_leader", value : formData.nom_leader }))
                    dispatch(addValueInfo({key : "group_id", value : formData.group_id }))
                    dispatch(addValueInfo({key : "group_name", value : formData.group_name }))
                    dispatch(addValueInfo({key : "leader_id", value : formData.leader_id }))
                    dispatch(addValueInfo({key : "date_presentation", value : formData.date_presentation }))
                    console.log("INFO =", info)
                    
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
    const renderPage = () => {
        if (pageNum === 0) {
            return <FirstPage />;
        }
        if (pageNum === 25) {
            return <QuestionsDev />;
        }
        if(pageNum === 26) {
            return <LastPage />
        }
        if(pageNum >= 1 && pageNum <=24){
        return <PagesDISC />;
        }
        return <h1>ERREUR</h1>
    };


  return (
        <div className="questionnaire">
            <h1>Questionnaire Synergia</h1>
            <img className="formLogo" src={image} alt="logo SynergieMSV" />
            {renderPage()}
        </div>
  );
}