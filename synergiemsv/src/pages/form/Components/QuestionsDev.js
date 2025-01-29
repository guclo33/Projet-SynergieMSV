import React, { useState, useEffect, useContext } from "react";
import { questionDev1, questionDev2, questionDev3 } from "../questionArray";
import { useDispatch, useSelector } from "react-redux";
import { addValueForm, addValueInfo } from "../Redux/formSlice";
import { addPage, removePage } from "../Redux/pageSlice";
import { AuthContext } from "../../AuthContext";
import { clearFile } from "../Redux/fileSlice";
import { persistor, store } from "../Redux/store";
import { testFormObject } from "../testFormObject";

export function QuestionsDev () {
    const [validated, setValidated] = useState(false)
    const dispatch = useDispatch();
    const {form, info} = useSelector((state) => state.session.form);
    const page = useSelector((state) => state.session.page);
    const file = useSelector((state) => state.file);
    const fileState = useSelector(state => state.file)
    const fileUrl = fileState.fileURL;
    
    const {apiUrl, user} = useContext(AuthContext)

    useEffect(() => {
        if(form[questionDev1] && form[questionDev2] && form[questionDev3]) {
            setValidated(true)
        } else {
            setValidated(false)
        }
    },[form])

    if (!fileState || !fileState._persist || !fileState._persist.rehydrated) {
        return <div>Chargement...</div>; 
    }

    

    const handleChange = (e) => {
        const {name, value} = e.target;
        dispatch(addValueForm({key: name, value: value}))
    }

    //pour mettre le fichier en base64
    
    const base64ToFile = (base64String, filename) => {
        const arr = base64String.split(",");
        const mime = arr[0].match(/:(.*?);/)[1];
        const byteString = atob(arr[1]);
        const arrayBuffer = new Uint8Array(byteString.length);
      
        for (let i = 0; i < byteString.length; i++) {
          arrayBuffer[i] = byteString.charCodeAt(i);
        }
      
        return new File([arrayBuffer], filename, { type: mime });
      };

    const sendFileData = async () => {
        if (!fileUrl) return; 

        const fileObj = await base64ToFile(fileUrl, `${form.firstName} ${form.lastName}.png`); 
        console.log("file après base64 to File", fileObj)
        const formData = new FormData();
        formData.append("file", fileObj);

        try {
            const response = await fetch (`${apiUrl}/form/photo/`, {
                method : "POST",
                credentials : "include",
                body : formData
            });
            if(response.ok){
                const data = await response.json();
                console.log("successfully sent photo to AWS", data);
                clearFile()
                persistor.purge(); 
                sessionStorage.clear();
            }

        } catch(error) {
            console.log("couldnt send picture", error)
        }
    }

    const sendFormData = async () => {
        
        try {
            const response = await fetch(`${apiUrl}/api/form/`, {
                method : "POST",
                credentials : "include",
                headers : {
                    "Content-Type" : "application/json"
                },
                body : JSON.stringify({
                    form: form,
                    info: info,

                })
                
            });
            if(response.ok) {
                console.log("formulaire ajouté à la base de donnée");
                //await sendFileData();
            }

        } catch(error) {
            console.log("impossible d'envoyer le formdata", error)
        }
    }


    console.log("form ==", form, "Infos =", info, "file avant transformation", fileUrl) 
    console.log("File State:", fileState);
    
    
    
    
    

    if(fileUrl){
    const fileFull = base64ToFile(fileUrl, `${form.firstName} ${form.lastName}.png`); 
    console.log("file après base64 to File", fileFull)
    const formData = new FormData();
    formData.append("file", fileFull)
    console.log("file===", formData )}

    

    const handleSubmit = async () => {
        await sendFormData();
        
        
    }
    
    return(
        <div className="page">
            <h2>Questions à développement</h2>
            <div className="questionDev">
                <h3>{questionDev1}</h3>
                <textarea  name={questionDev1} value={form[questionDev1] ? form[questionDev1] : ""} onChange={handleChange} />
            </div>
            <div className="questionDev">
                <h3>{questionDev2}</h3>
                <textarea type="text" name={questionDev2} value={form[questionDev2] ? form[questionDev2] : ""} onChange={handleChange} />
            </div>
            <div className="questionDev">
                <h3>{questionDev3}</h3>
                <textarea type="text" name={questionDev3} value={form[questionDev3] ? form[questionDev3] : ""} onChange={handleChange} />
            </div>
            <div className="formButton">
                <button onClick={() => dispatch(removePage())}>Retour</button>
                <button 
                    disabled={!validated}
                    style={{
                        backgroundColor: !validated ? '#ccc' : '#4CAF50',  
                        cursor: !validated ? 'not-allowed' : 'pointer',    
                        boxShadow: !validated ? 'none' : '0 4px 8px rgba(0, 0, 0, 0.2)',  
                        opacity: !validated ? 0.4 : 1,  
                    }}
                    onClick={handleSubmit}>Soumettre
                </button>
            </div>
        </div>
    )
}