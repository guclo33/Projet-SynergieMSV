import React, { useState, useEffect, useContext, useRef } from "react";
import { questionDev1, questionDev2, questionDev3 } from "../questionArray";
import { useDispatch, useSelector } from "react-redux";
import { addValueForm, addValueInfo } from "../Redux/formSlice";
import { addPage, removePage, setPage } from "../Redux/pageSlice";
import { AuthContext } from "../../AuthContext";
import { clearFile } from "../Redux/fileSlice";
import { persistor, store } from "../Redux/store";
import { testFormObject } from "../testFormObject";
import { processImageForUpload, isHeicFile, getHeicWarning, validateImageFile } from "../../../components/imageUtils";
import Toast from "../../../components/Toast";
import Loading from "../../../components/Loading";

export function QuestionsDev () {
    const [validated, setValidated] = useState(false)
    const [warning, setWarning] = useState(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [toast, setToast] = useState(null)
    const [loadingMessage, setLoadingMessage] = useState('')
    const [fileObj, setFileObj] = useState(null)
    const dispatch = useDispatch();
    const {form, info} = useSelector((state) => state.session.form);
    
    const {pageNum, totalPage} = useSelector((state) => state.session.page)
    const fileState = useSelector(state => state.file)
    const pageArray = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26]
    const {apiUrl, user} = useContext(AuthContext)

    useEffect(() => {
        if(form[questionDev1] && form[questionDev2] && form[questionDev3]) {
            setValidated(true)
        } else {
            setValidated(false)
        }
    },[form])

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [pageNum, totalPage]);

    // Récupérer le fichier depuis sessionStorage
    useEffect(() => {
        const getFileFromSessionStorage = async () => {
            try {
                const fileDataStr = sessionStorage.getItem('uploadedFile');
                if (!fileDataStr) {

                    setFileObj(null);
                    return;
                }
                
                const fileData = JSON.parse(fileDataStr);
  
                
                // Convertir le base64 en blob puis en File
                const base64Response = await fetch(fileData.base64);
                const blob = await base64Response.blob();
                const file = new File([blob], fileData.name, { type: fileData.type });
                setFileObj(file);

            } catch (error) {
                console.error("[FRONTEND] [FILE] Erreur lors de la récupération depuis sessionStorage:", error);
                setFileObj(null);
            }
        };
        
        getFileFromSessionStorage();
    }, []);

    const showToast = (message, type = 'error') => {
        setToast({ message, type });
    };

    const hideToast = () => {
        setToast(null);
    };

    if (!fileState || !fileState._persist || !fileState._persist.rehydrated) {
        return <Loading message="Chargement du formulaire..." />; 
    }

    const handleChange = (e) => {
        const {name, value} = e.target;
        dispatch(addValueForm({key: name, value: value}))
    }

    // Récupérer le nom du client depuis le formulaire
    const getClientName = () => {
        // Privilégie le prénom + nom avec accents
        const firstName = info.firstName || form.firstName || form['Prénom'] || '';
        const lastName = info.lastName || form.lastName || '';
        if (firstName || lastName) {
            return `${firstName} ${lastName}`.trim();
        }
        // Fallback sur un champ unique
        if (form.nom || form.name) return form.nom || form.name;
        // Fallback ultime
        return user?.id || `user_${Date.now()}`;
    };

    const sendFileData = async (formId, clientName) => {
        if (!fileObj) {

            return null;
        }

        try {
            setLoadingMessage('Validation du fichier...');
            
            // Valider le fichier
            const validation = validateImageFile(fileObj);
            if (!validation.valid) {
                console.error("[FRONTEND] [UPLOAD] Fichier invalide:", validation.error);
                throw new Error(validation.error);
            }

            // Vérifier les avertissements HEIC
            const heicWarning = getHeicWarning(fileObj);
            if (heicWarning) {

                setWarning(heicWarning);
            }

            setLoadingMessage('Préparation du fichier...');
            
            // Traiter le fichier avec le nom du client
            const processedFile = await processImageForUpload(fileObj, clientName);
            
 
            setLoadingMessage('Envoi de la photo...');

            const formData = new FormData();
            formData.append("file", processedFile);
            formData.append("formId", formId); // Ajouter l'ID du formulaire
            formData.append("clientName", clientName); // AJOUT
            

            const response = await fetch(`${apiUrl}/api/form/photo`, {
                method: "POST",
                credentials: "include",
                body: formData
            });
            
            if(response.ok){
                const data = await response.json();

                return data;
            } else {
                const errorText = await response.text();
                console.error("[FRONTEND] [UPLOAD] Erreur lors de l'envoi:", errorText);
                throw new Error(`Erreur upload photo: ${errorText}`);
            }
        } catch(error) {
            console.error("[FRONTEND] [UPLOAD] couldn't send picture", error);
            throw error;
        }
    }

    const sendFormData = async () => {
        try {
            setLoadingMessage('Envoi du formulaire...');
            
            const response = await fetch(`${apiUrl}/api/form/`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    form: form,
                    info: info,
                })
            });
            
            if(response.ok) {
                const data = await response.json();
                const formId = data.id;

                return { formId, data };
            } else {
                const errorText = await response.text();
                console.error("Erreur lors de l'envoi du formulaire:", errorText);
                throw new Error(`Erreur formulaire: ${errorText}`);
            }
        } catch(error) {
            console.error("impossible d'envoyer le formdata", error);
            throw error;
        }
    }

    const handleSubmit = async () => {
        if (isSubmitting) return; // Éviter les soumissions multiples
        
        setIsSubmitting(true);
        setWarning(null);
        setLoadingMessage('Début de la soumission...');
        
        try {
            const clientName = getClientName();

            
            // Préparer les promesses
            const promises = [];
            
            // Toujours envoyer le formulaire
            setLoadingMessage('Envoi du formulaire...');
            const formPromise = sendFormData();
            promises.push(formPromise);
            
            // Envoyer la photo seulement si elle existe
            if (fileObj) {
 
                setLoadingMessage('Envoi du formulaire et de la photo...');
                
                // Créer une promesse pour l'upload de photo qui attend l'ID du formulaire
                const photoPromise = formPromise.then(formResult => {
                    setLoadingMessage('Envoi de la photo...');
                    return sendFileData(formResult.formId, clientName);
                });
                promises.push(photoPromise);
            }
            
            // Exécuter toutes les promesses
            const results = await Promise.all(promises);

            
            // Succès - nettoyer et passer à la page suivante
            setWarning(null);
            setLoadingMessage('');
            showToast('Formulaire et photo envoyés avec succès !', 'success');
            
        } catch (error) {
            console.error("[FRONTEND] [SUBMIT] Erreur lors de la soumission:", error);
            setWarning(`Erreur lors de la soumission: ${error.message}`);
            showToast(`Erreur lors de la soumission: ${error.message}`, 'error');
        } finally {
            setIsSubmitting(false);
            setLoadingMessage('');
        }
    }

    const handleSetPage = (num) => {
        if(!validated && num-1>pageNum){
            return;
        }
        dispatch(setPage(num-1));
    }
    
    return(
        <div className="page">
            <h2>Questions à développement</h2>
            
            {/* Avertissement HEIC */}
            {warning && (
                <div className="warning-message" style={{
                    padding: '10px',
                    margin: '10px 0',
                    backgroundColor: warning.includes('Erreur') ? '#f8d7da' : '#fff3cd',
                    border: warning.includes('Erreur') ? '1px solid #f5c6cb' : '1px solid #ffeaa7',
                    borderRadius: '4px',
                    color: warning.includes('Erreur') ? '#721c24' : '#856404'
                }}>
                    <p>{warning}</p>
                </div>
            )}
            
            <div className="questionDev">
                <h3>{questionDev1}</h3>
                <textarea name={questionDev1} value={form[questionDev1] ? form[questionDev1] : ""} onChange={handleChange} />
            </div>
            <div className="questionDev">
                <h3>{questionDev2}</h3>
                <textarea type="text" name={questionDev2} value={form[questionDev2] ? form[questionDev2] : ""} onChange={handleChange} />
            </div>
            <div className="questionDev">
                <h3>{questionDev3}</h3>
                <textarea type="text" name={questionDev3} value={form[questionDev3] ? form[questionDev3] : ""} onChange={handleChange} />
            </div>
            
            {/* Loading overlay */}
            {isSubmitting && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000
                }}>
                    <div style={{
                        backgroundColor: 'white',
                        padding: '30px',
                        borderRadius: '10px',
                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
                        textAlign: 'center'
                    }}>
                        <Loading message={loadingMessage} size="large" />
                    </div>
                </div>
            )}
            
            <div className="formButton">
                <button 
                    onClick={() => dispatch(removePage())}
                    disabled={isSubmitting}
                >
                    Retour
                </button>
                <button 
                    disabled={!validated || isSubmitting}
                    style={{
                        backgroundColor: (!validated || isSubmitting) ? '#ccc' : '#4CAF50',  
                        cursor: (!validated || isSubmitting) ? 'not-allowed' : 'pointer',    
                        boxShadow: (!validated || isSubmitting) ? 'none' : '0 4px 8px rgba(0, 0, 0, 0.2)',  
                        opacity: (!validated || isSubmitting) ? 0.4 : 1,  
                    }}
                    onClick={handleSubmit}
                >
                    {isSubmitting ? 'Envoi en cours...' : 'Soumettre'}
                </button>
            </div>
            <div className="setPage">
                <h5>Retourner à la page :</h5>
                <div className="setPageNumber">
                    {pageArray.slice(0,totalPage+1).map(num => ( 
                        <p 
                            style={{
                                filter: pageNum === num - 1 ? "brightness(0.8)" : "none"
                            }}
                            key={num} 
                            onClick={() => handleSetPage(num)}
                        >
                            {num}
                        </p>
                    ))}
                </div>
            </div>
            
            {/* Toast notifications */}
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={hideToast}
                    duration={toast.type === 'success' ? 3000 : 5000}
                />
            )}
        </div>
    )
}