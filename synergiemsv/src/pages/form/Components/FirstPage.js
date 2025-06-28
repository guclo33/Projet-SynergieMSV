import React, {useState, useEffect, useContext} from "react";
import { useSelector, useDispatch } from 'react-redux';
import { setPage, addPage, removePage,  } from '../Redux/pageSlice'
import { addValueForm, addValueInfo} from '../Redux/formSlice';
import { setFile, setFileBase64, clearFile } from "../Redux/fileSlice";
import { persistor, store } from "../Redux/store";
import { AuthContext } from "../../AuthContext";
import image from '../../../Images/logo2 sans fond.png';
import iconeProfile from '../../../Images/iconeProfile.jpg';
import { isHeicFile } from "../../../components/imageUtils";

export function FirstPage () {
    const [validated,setValidated] = useState(false)  
    const [modify, setModify] = useState(false)
    const [fileObj, setFileObj] = useState(null)
    const [isHeic, setIsHeic] = useState(false)
    const {pageNum, totalPage} = useSelector((state) => state.session.page)
    const {form, info} = useSelector((state) => state.session.form);
    const file = useSelector((state) => state.file)
    const {fileURL} = file;
    const [errors, setErrors] = useState({ email: '', phone: '' });
    const { apiUrl } = useContext(AuthContext);
    
    useEffect(() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }, [pageNum, totalPage]);
        
        
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
        
        if(info["firstName"] && info["lastName"] && valid && fileURL && fileObj) {
            setValidated(true)
        } else {
            setValidated(false)
        }
    }, [fileURL, form, info])

   

    useEffect(() => {
        if(info && info.firstName) {
            dispatch(addValueForm({key:"Prénom", value: info.firstName}))
        }
    }, [info.firstName])

    const pageArray = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26]

    


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
            const heicFile = isHeicFile(selectedFile);
            setIsHeic(heicFile);
            if (heicFile) {
                dispatch(setFile({ url: iconeProfile, file: selectedFile }))
            } else {
                const objectUrl = URL.createObjectURL(selectedFile)
                dispatch(setFile({ url: objectUrl, file: selectedFile }))
            }
            try {
                const reader = new FileReader();
                reader.onload = () => {
                    const fileData = {
                        base64: reader.result,
                        name: selectedFile.name,
                        type: selectedFile.type,
                        size: selectedFile.size
                    };
                    sessionStorage.setItem('uploadedFile', JSON.stringify(fileData));
                };
                reader.readAsDataURL(selectedFile);
            } catch (error) {
                console.error("[FRONTEND] [FILE] Erreur lors du stockage:", error);
            }
            setFileObj(selectedFile)
            setModify(false)
        }
    }

    // Déterminer l'image à afficher
    let photoSrc = iconeProfile;
    if (fileURL && !isHeic) {
        photoSrc = fileURL;
    }
    // Si HEIC ou aucun fichier, on garde iconeProfile


    const capitalizeFirstLetter = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    }

    const handleNextPage = ()=> {
        dispatch(addPage());
        
    }
    const handleSetPage = (num) => {
            
            if(!validated && num-1>pageNum){
                return
            }
            dispatch(setPage(num-1))
            
        }

    const sendFileData = async () => {
        if (!fileObj) {
            console.info("[FRONTEND] [UPLOAD] Pas de fichier à envoyer");
            return;
        }

        const formData = new FormData();
        formData.append("file", fileObj);
        
        try {

            const response = await fetch(`${apiUrl}/api/form/photo`, {
                method: "POST",
                credentials: "include",
                body: formData
            });
            
            if(response.ok){
                const data = await response.json();

                dispatch(clearFile());
                persistor.purge(); 
                sessionStorage.clear();
                dispatch(addPage());
            } else {
                console.error("[FRONTEND] [UPLOAD] Erreur lors de l'envoi:", await response.text());
            }
        } catch(error) {
            console.error("[FRONTEND] [UPLOAD] couldn't send picture", error);
        }
    }

    return (
        <div className="page">
            <h1 className="formTitle">Questionnaire Synergia</h1>
            
            
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
                <div className="questionsPhoto" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 20 }}>
                    <label htmlFor="file" style={{ alignSelf: 'flex-start', marginBottom: 8, fontWeight: 500 }}>Photo de profil</label>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                        <img
                            className="profilPhoto"
                            src={photoSrc}
                            alt="Photo de profil"
                            style={{
                                width: 120,
                                height: 120,
                                objectFit: 'cover',
                                borderRadius: '50%',
                                border: '2px solid #b57ba6',
                                background: '#fff',
                                boxShadow: '0 2px 8px rgba(181,123,166,0.08)'
                            }}
                        />
                        {isHeic && (
                            <div style={{
                                padding: '8px 16px',
                                margin: '8px 0',
                                backgroundColor: '#fff3cd',
                                border: '1px solid #ffeaa7',
                                borderRadius: '4px',
                                color: '#856404',
                                fontSize: '13px',
                                textAlign: 'center',
                                maxWidth: 220
                            }}>
                                ⚠️ Fichier HEIC détecté. Il sera converti en JPEG lors de l'upload.
                            </div>
                        )}
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            style={{
                                marginTop: 8,
                                border: 'none',
                                background: 'none',
                                color: '#b57ba6',
                                fontWeight: 500
                            }}
                        />
                        {fileObj && fileObj.name && (
                            <div style={{ fontSize: 13, color: '#555', marginTop: 4 }}>{fileObj.name}</div>
                        )}
                    </div>
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
                                        <p 
                                        style={{
                                            //backgroundColor: !validated ? "red" : "white",
                                            filter: pageNum === num - 1 ? "brightness(0.8)" : "none"
                                        }}

                                        key={num} onClick={() => handleSetPage(num)}>{num}</p>
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