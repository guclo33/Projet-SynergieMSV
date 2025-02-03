import React, {useState, useEffect} from "react";
import { useSelector, useDispatch } from 'react-redux';
import { setPage, addPage, removePage,  } from '../Redux/pageSlice'
import { addValueForm, addValueInfo} from '../Redux/formSlice';
import { setFile } from "../Redux/fileSlice";
import image from '../../../Images/logo2 sans fond.png';

export function FirstPage () {
    const [validated,setValidated] = useState(false)  
    const [modify, setModify] = useState(false)
    const [fileObj, setFileObj] = useState({})
    const {pageNum, totalPage} = useSelector((state) => state.session.page)
    const {form, info} = useSelector((state) => state.session.form);
    const file = useSelector((state) => state.file)
    const {fileURL} = file;
    const [errors, setErrors] = useState({ email: '', phone: '' });
    
    
        
    const dispatch = useDispatch();



    useEffect(() => {
        const newErrors = { email: '', phone: '' };
        let valid = true

        function formatPhoneNumber(input) {
                
            const cleaned = input.replace(/\D/g, "");
              
                
            if (cleaned.length === 11 && cleaned[0] === "1") {
                // Format : 1-XXX-XXX-XXXX
                return `${cleaned[0]}-${cleaned.slice(1, 4)}-${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
            }
            // Si le numéro contient 10 chiffres
            else if (cleaned.length === 10) {
                // Format : XXX-XXX-XXXX
                return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
            }
            // Dans le cas où le nombre de chiffres est inattendu, retourner la valeur nettoyée ou lever une erreur
            return cleaned;
            }

            if (info.phone) {
            const cleanedPhone = info.phone.replace(/\D/g, "");
            // Le numéro est valide s'il contient 10 chiffres ou 11 chiffres commençant par "1"
            if (cleanedPhone.length !== 10 && !(cleanedPhone.length === 11 && cleanedPhone[0] === "1")) {
                newErrors.phone = "Numéro de téléphone invalide";
                valid = false;
            } else {
                // Si valide, on formate et met à jour l'info dans le store
                const formattedPhone = formatPhoneNumber(info.phone);
                dispatch(addValueInfo({ key: "phone", value: formattedPhone }));
            }
            } else {
            // Si le champ est vide et qu'il est requis, vous pouvez ajouter une erreur
            newErrors.phone = "Le numéro de téléphone est requis";
            valid = false;
            }
            
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(info.email)) {
            newErrors.email = "Email invalide";
            valid = false;
          }
         
          setErrors(newErrors)
        
        if(info["firstName"] && info["lastName"] && valid && fileURL) {
            setValidated(true)
        } else {
            setValidated(false)
        }
    }, [fileURL, form, info])

    useEffect(() => {
        console.log("fileURL rechargé après refresh :", fileURL);
    }, [fileURL]);

    useEffect(() => {
        if(info && info.firstName) {
            dispatch(addValueForm({key:"Prénom", value: info.firstName}))
        }
    }, [info.firstName])

    const pageArray = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25]

    function formatPhoneNumber(input) {
            
            const cleaned = input.replace(/\D/g, "");
          
            
            if (cleaned.length === 11 && cleaned[0] === "1") {
              // Format : 1-XXX-XXX-XXXX
              return `${cleaned[0]}-${cleaned.slice(1, 4)}-${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
            }
            // Si le numéro contient 10 chiffres
            else if (cleaned.length === 10) {
              // Format : XXX-XXX-XXXX
              return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
            }
            // Dans le cas où le nombre de chiffres est inattendu, retourner la valeur nettoyée ou lever une erreur
            return cleaned;
          }


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

    console.log("file==", file, "fileURL ==",fileURL, "info=", info )

    const capitalizeFirstLetter = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    }

    const handleNextPage = ()=> {
        dispatch(addPage());
        setTimeout(() => {  
            window.scrollTo({ top: 0, behavior: 'smooth' }) 
            },50)
    }
    

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
                    <input name="firstName" type="text" value={info.firstName} onChange={(e) => dispatch(addValueInfo({key: 'firstName', value: capitalizeFirstLetter(e.target.value)}))} required/>
                </div>   
                <div className="questions">  
                    <label htmlFor="lastName">Nom</label>
                    <input name="lastName" type="text" value={info.lastName} onChange={(e) => dispatch(addValueInfo({key: 'lastName', value: capitalizeFirstLetter(e.target.value)}))} required/>
                </div>     
                <div className="questions">
                    <label htmlFor="email">Email</label>
                    <input name="email" type="email" value={info.email} onChange={(e) => dispatch(addValueInfo({key: 'email', value: e.target.value.toLowerCase()}))} required/>
                </div>   
                <div className="questions">    
                <label htmlFor="phone">Téléphone</label>
                <input name= "phone" type="tel" value={info.phone} onChange={(e) => dispatch(addValueInfo({key: 'phone', value: e.target.value}))} required />
                </div>
                <div className="questionsPhoto">    
                    <label htmlFor="file">Photo de profil</label>
                    {fileURL ? modify ? (
                        <div className="modifyProfil">
                            <img className="profilPhoto" src={fileURL} alt={info.firstName + " " + info.lastName} />
                            <input type="file"  accept="image/*"  onChange={handleFileChange} />
                            <button className="annulerButton" onClick={()=> setModify(false)}>Annuler</button>
                            
                        
                        </div> ): (
                        <div className="questionsPhoto">
                            <img className="profilPhoto" src={fileURL} alt={info.firstName + " " + info.lastName} />
                            <button onClick={() => setModify(true)}>Modifier</button>
                        </div>
                        
                        ):(
                        <>
                        <input type="file"  accept="image/*"  onChange={handleFileChange} required/>
                        {fileObj && <p>Selected file: {fileObj.name}</p>}
                        </>)}
                     
                </div>
                
                <button 
                                disabled={!validated}
                                className="firstButton"
                                style={{
                                    backgroundColor: !validated ? '#ccc' : '#4CAF50',  
                                    cursor: !validated ? 'not-allowed' : 'pointer',    
                                    boxShadow: !validated ? 'none' : '0 4px 8px rgba(0, 0, 0, 0.2)',  
                                    opacity: !validated ? 0.4 : 1,  
                                }} 
                                onClick={handleNextPage}>Suivant
                </button>
                <div className="formatError">
                    <p>{errors.email? errors.email : null}</p>
                    <p>{errors.phone? errors.phone : null}</p>
                </div>
                <div className="setPage">
                                <h5>Retourner à la page :</h5>
                                <div className="setPageNumber">
                                    {pageArray.slice(0,totalPage+1).map( num => ( 
                                        <p key={num} onClick={(e) => dispatch(setPage(num-1))}>{num}</p>
                                    ))
                                    }
                                </div>
                </div>
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