import React, { useState, useEffect, useContext } from "react";
import { questionDev1, questionDev2, questionDev3 } from "../questionArray";
import { useDispatch, useSelector } from "react-redux";
import { addKeyValue } from "../Redux/formSlice";
import { addPage, removePage } from "../Redux/pageSlice";
import { AuthContext } from "../../AuthContext";
import { clearFile } from "../Redux/fileSlice";

export function QuestionsDev () {
    const [validated, setValidated] = useState(false)
    const dispatch = useDispatch();
    const form = useSelector((state) => state.form);
    const page = useSelector((state) => state.page);
    const file = useSelector((state) => state.file)
    const {fileUrl} = file
    const {apiUrl, user} = useContext(AuthContext)

    useEffect(() => {
        if(form[questionDev1] && form[questionDev2] && form[questionDev3]) {
            setValidated(true)
        } else {
            validated(false)
        }
    },[form])

    const handleChange = (e) => {
        const {name, value} = e.target;
        dispatch(addKeyValue({key: name, value: value}))
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

        const file = base64ToFile(fileUrl, `${form.firstName} ${form.lastName}.png`); 
        console.log("file après base64 to File", file)
        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await fetch (`${apiUrl}/form/photo/${user.id}`, {
                method : "POST",
                credentials : "include",
                body : formData
            });
            if(response.ok){
                const data = await response.json();
                console.log("successfully sent photo to AWS", data);
                clearFile()
            }

        } catch(error) {
            console.log("couldnt send picture", error)
        }
    }

    const sendFormData = async () => {
        
        try {
            const response = await fetch(`${apiUrl}/form/${user.id}`, {
                method : "POST",
                credentials : "include",
                headers : {
                    "Content-Type" : "application/json"
                },
                body : JSON.stringify(form)
                
            })

        } catch(error) {
            console.log("impossible d'envoyer le formdata", error)
        }
    }

    const handleSubmit = async () => {
        await sendFormData();
        await sendFileData();
        
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