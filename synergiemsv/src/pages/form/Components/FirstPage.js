import React, {useState, useEffect} from "react";
import { useSelector, useDispatch } from 'react-redux';
import { setPage, addPage, removePage,  } from '../Redux/pageSlice'
import { addKeyValue} from '../Redux/formSlice';
import { setFile } from "../Redux/fileSlice";

export function FirstPage () {
    const [validated,setValidated] = useState(false)  
    const [modify, setModify] = useState(false)
    const [fileObj, setFileObj] = useState({})
        
    const form = useSelector((state) => state.session.form);
    const file = useSelector((state) => state.file)
    const {fileURL} = file
    
        
    const dispatch = useDispatch();

    useEffect(() => {
        if(form["firstName"] && form["lastName"] && form["email"] && form["phone"] && fileURL && form["forfait"]) {
            setValidated(true)
        } else {
            setValidated(false)
        }
    }, [fileURL])

    useEffect(() => {
        console.log("fileURL rechargé après refresh :", fileURL);
    }, [fileURL]);

    //fonction pour transformer file en base64
    const convertFileToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file); // Convertit le fichier en Base64
            reader.onload = () => resolve(reader.result); // Retourne le résultat Base64
            reader.onerror = (error) => reject(error);
        });
    };

    /*useEffect(() => {
        if(file) {
            setFileURL(URL.createObjectURL(file))
        } else {
            setFileURL("")
        }
    },[file])*/

    const handleFileChange = async (e) => {
        const selectedFile = e.target.files[0]
        
        if(selectedFile){
            const base64File = await convertFileToBase64(selectedFile)
            dispatch(setFile(base64File))
            setFileObj(selectedFile)
            setModify(false)
        }
    }

    console.log("file==", file, "fileURL ==",fileURL )

    
    

    return (
        <div className="page">
            <h2>Informations</h2>
                <p>Vous vous apprêtez à répondre à un court questionnaire de 24 questions. Vous êtes invités à y répondre assez spontanément : la première réponse qui vous vient en tête est probablement la bonne!

                Pour chacune des questions suivantes, veuillez choisir l'énoncé qui vous correspond le plus, puis celui qui vous correspond le moins. Ensuite, attribuez une note de 1 à 9 aux deux affirmations restantes. (Veuillez ne pas donner la même note deux fois).

                Il est important de comprendre qu'il n'y a ni bonne ni mauvaise réponse. Ces réponses sont d'ailleurs confidentielles. Cependant, un résultat sous forme d'image et de couleur sera partagé avec le groupe, et une version très abrégée de votre profil sera transmise à l'organisateur de l'activité.

                Si vous hésitez entre deux énoncés parce que vous n'agissez pas de la même manière en milieu de travail et dans votre vie personnelle, choisissez ce que vous faites le plus naturellement et sans effort!

                Si vous ne voyez pas la question suivante apparaître, c'est que vous n'avez pas respecté les consignes précédentes. Il faudra alors revenir sur la dernière question.</p>
            <div className="form">
                <div className="questions">
                    <label htmlFor="firstName">Prénom</label>
                    <input name="firstName" type="text" value={form.firstName} onChange={(e) => dispatch(addKeyValue({key: 'firstName', value: e.target.value}))} required/>
                </div>   
                <div className="questions">  
                    <label htmlFor="lastName">Nom</label>
                    <input name="lastName" type="text" value={form.lastName} onChange={(e) => dispatch(addKeyValue({key: 'lastName', value: e.target.value}))} required/>
                </div>     
                <div className="questions">
                    <label htmlFor="email">Email</label>
                    <input name="email" type="email" value={form.email} onChange={(e) => dispatch(addKeyValue({key: 'email', value: e.target.value}))} required/>
                </div>   
                <div className="questions">    
                <label htmlFor="phone">Téléphone</label>
                <input name= "phone" type="tel" value={form.phone} onChange={(e) => dispatch(addKeyValue({key: 'phone', value: e.target.value}))} required />
                </div>
                <div className="questionsPhoto">    
                    <label htmlFor="file">Photo de profil</label>
                    {fileURL ? modify ? (
                        <div className="modifyProfil">
                            <img className="profilPhoto" src={fileURL} alt={form.firstName + " " + form.lastName} />
                            <input type="file"  accept="image/*"  onChange={handleFileChange} />
                            <button className="annulerButton" onClick={()=> setModify(false)}>Annuler</button>
                            
                        
                        </div> ): (
                        <div className="questionsPhoto">
                            <img className="profilPhoto" src={fileURL} alt={form.firstName + " " + form.lastName} />
                            <button onClick={() => setModify(true)}>Modifier</button>
                        </div>
                        
                        ):(
                        <>
                        <input type="file"  accept="image/*"  onChange={handleFileChange} required/>
                        {fileObj && <p>Selected file: {fileObj.name}</p>}
                        </>)}
                     
                </div>
                
                <button 
                                disabled={validated}
                                className="firstButton"
                                style={{
                                    backgroundColor: !validated ? '#ccc' : '#4CAF50',  
                                    cursor: !validated ? 'not-allowed' : 'pointer',    
                                    boxShadow: !validated ? 'none' : '0 4px 8px rgba(0, 0, 0, 0.2)',  
                                    opacity: !validated ? 0.4 : 1,  
                                }} 
                                onClick={() => dispatch(addPage())}>Suivant
                </button>
        </div>
    </div>
    )
}



/*<div className="questions">       
                    <label htmlFor="forfait">Forfait</label>
                    <select name="forfait" value={form.forfait} onChange={(e) => dispatch(addKeyValue({key: 'forfait', value: e.target.value}))} required>
                        <option value="individuel">Individuel</option>
                        <option value="equipe">Équipe</option>
                    </select>
                </div>

                {(form.forfait && form.forfait === "equipe") ? (
                    <div className="questions">
                        <label htmlFor="teamLeader">Es-tu le leader?</label>
                        <input type="checkbox" name="teamLeader" checked={form.teamLeader}  onChange={(e) => dispatch(addKeyValue({key: 'teamLeader', value: e.target.value}))} required/>
                        <label htmlFor="leaderName">Nom du leader</label>
                        <select name="leaderName" value={form.leaderName} onChange={(e) => dispatch(addKeyValue({key: 'leaderName', value: e.target.value}))} >
                            <option value="leader1">Leader 1</option>
                            <option value="leader2">Leader 2</option>
                        </select>
                    </div>
                ): null }
            </div>  */