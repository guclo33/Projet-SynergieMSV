import React, {useCallback,useContext, useState, useEffect} from "react";
import { useParams } from "react-router";
import { useDropzone } from 'react-dropzone';
import { AuthContext } from "../../../AuthContext";

function capitalizeFirstLetter(string) {
    if (!string) return ""; 
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

export function DropZone({detailsData, category, apiUrl}) {
    const [files, setFiles] = useState([]);
    const [selectedFile, setSelectedFile] = useState()
    const {user} = useContext(AuthContext)
    const {info, group} = detailsData

    

    const fetchFiles = useCallback(async () => {
        let encodedGroupName = ""
        if(group && group.group_name){
            encodedGroupName = encodeURIComponent(group.group_name)
        }
        const encodedClientName = encodeURIComponent(info.nom_client)
        console.log("calling fetchfiles with apiurl:", apiUrl, "category:", category, "nom_client", info.nom_client)
        try {
            const response = await fetch(`${apiUrl}/${category}/list/${encodedClientName}/${encodedGroupName}`, {
                method: "GET",
                credentials: "include",
            });
            if (response.ok) {
                if(category === "photos") {
                    const data = await response.json();
                    if (data.files.length === 0) {
                        // Plus de fichier => on peut faire setFiles([]) ou autre
                        return setFiles([]);
                      }
                      // Sinon, on prend le premier
                      const filename = data.files[0].Key.split("/").pop();
                      return setFiles([filename]);
                    
                    
                }
                const data = await response.json();
                
                console.log("data", data)
                const filenames = data.files.map(file => file.split("/").pop())

                setFiles(filenames);
            }
        } catch (error) {
            console.error("Error fetching files:", error);
        }
    }, [apiUrl, category]);


    const onDrop = useCallback(async (acceptedFiles) => {
        if (!detailsData?.info?.nom_client) {
            console.error("detailsData.info.nom_client is not defined");
            return;
        }
        
        const formData = new FormData();
        formData.append('file', acceptedFiles[0]);
        formData.append('fileName', encodeURIComponent(acceptedFiles[0].name));

        try {
            const response = await fetch(`${apiUrl}/${category}/upload/${info.nom_client}/${group.group_name}`, {
                method: "POST",
                credentials : "include",
                body : formData
            });
            if (response.ok) {
                const data = await response.json()
                console.log('Uploaded file:', data);
                fetchFiles();
            }
        } catch (error) {
            console.log("couldn't upload file")
        }

    },[apiUrl, category, detailsData]);

    const downloadFile = async (fileName) => {
        const encodedClientName = encodeURIComponent(info.nom_client)
        let encodedGroupName = ""
        if(group && group.group_name){
            encodedGroupName = encodeURIComponent(group.group_name)
        }
        
        console.log("apiUrl", apiUrl, "category", category, 'encoded leader', info.nom_leader, 'filename', fileName)
        console.log("apiURL", `${apiUrl}/${category}/download/${encodedClientName}/${fileName}/${encodedGroupName}`)
        try {
            const response = await fetch(`${apiUrl}/${category}/download/${encodedClientName}/${fileName}/${encodedGroupName}`, {
                method: "GET",
                credentials: "include",
            });
            if (response.ok) {
                const data = await response.json();
                console.log("data", data)
                if (data.downloadUrl) {
                window.open(data.downloadUrl, "_blank"); 
                }
            }
        } catch (error) {
            console.error("Error downloading file:", error);
        }
    };

    const deleteFile = async(fileName) => {
        let encodedGroupName = ""
        if(group && group.group_name){
            encodedGroupName = encodeURIComponent(group.group_name)
        }
        const encodedClientName = encodeURIComponent(info.nom_client)
        
        try {
            const response = await fetch(`${apiUrl}/${category}/delete/${encodedClientName}/${fileName}/${encodedGroupName}`, {
                method: 'DELETE',
                credentials: "include"
            });
            if(response.ok) {
                console.log(fileName, "successfully deleted")
                await fetchFiles()
                
            } 
        } catch (err) {
            console.log("Couldn't delete the file", err)
        }
    }

    useEffect(() => {
        fetchFiles();
    }, [fetchFiles]);


    const handleClick = (e) => {
        e.stopPropagation()
        const fileName = e.target.getAttribute('data-name')
        downloadFile(fileName)
    }

    const handleDelete =  async (e) => {
        e.stopPropagation()
        const fileName = e.target.getAttribute('data-name')
        const confirmDelete = window.confirm(`Voulez-vous vraiment supprimer le fichier "${fileName}" ?`);

        if (!confirmDelete) {
          console.log("Suppression annulée");
          return; // Annuler la suppression si l'utilisateur clique sur "Annuler"
        }
        deleteFile(fileName)

    }

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0])
    }

    const handleUpload = async () => {
        if(!selectedFile) {
            alert("Svp sélectionner un fichier d'abord")
            return
        }
        const formData = new FormData();
        formData.append('file', selectedFile);
        console.log("selectedFile", selectedFile)
        if(category === "photos") {
            formData.append('fileName', encodeURIComponent(`${info.nom_client}.${selectedFile.name.split('.').pop()}`));
        } else {
        formData.append('fileName', encodeURIComponent(selectedFile.name));
        }
        console.log("selectedFile", selectedFile)
        let encodedGroupName = ""
        if(group && group.group_name){
            encodedGroupName = encodeURIComponent(group.group_name)
        }
        const encodedClientName = encodeURIComponent(info.nom_client)

        try {
            const response = await fetch(`${apiUrl}/${category}/upload/${encodedClientName}/${encodedGroupName}`, {
                method: "POST",
                credentials : "include",
                body : formData
            });
            if (response.ok) {
                const data = await response.json()
                console.log('Uploaded file:', data);
                fetchFiles();
            }
        } catch (error) {
            console.log("couldn't upload file")
        }

    }
    

    const { getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject } = useDropzone({
        onDrop, })

    const baseStyle = {
        border: "1px solid var(--secondary-color)",
        boxShadow: "0 4px 8px var(--primary-color)",
        borderRadius: "20px",
        padding: "1rem",
        minHeight: '7rem',
        maxHeight: '10rem',
        overflow: 'auto',
        textAlign: "center",
        transition: "border-color 0.3s, background-color 0.3s",
        marginBottom: "1rem",
        
        };
        
        const activeStyle = {
        borderColor: "#2196f3",
        backgroundColor: "#e3f2fd",
        };
        
        const acceptStyle = {
        borderColor: "#4caf50",
        backgroundColor: "#e8f5e9",
        };
        
        const rejectStyle = {
        borderColor: "#f44336",
        backgroundColor: "#ffebee",
        };
        
          // Fusionner les styles en fonction de l'état
        const currentStyle = {
            ...baseStyle,
            ...(isDragActive ? activeStyle : {}),
            ...(isDragAccept ? acceptStyle : {}),
            ...(isDragReject ? rejectStyle : {}),
        };

    return (
        <div className="dropSection">
            <h3>{capitalizeFirstLetter(category)}</h3>
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleUpload}>Ajouter un fichier</button>
            <div   
            {...getRootProps({ className: "dropzone" })}
            style={currentStyle}
            >
            
            <input {...getInputProps()} />
            {isDragReject && <p style={{ color: "#f44336" }}>Fichiers non valides.</p>}
            {isDragAccept && <p style={{ color: "#4caf50" }}>Relâchez pour déposer.</p>}
            
            <ul>

                
                {files.map((file, index) => (
                <li className="files" key={index} style={{ display : file.length===0? 'none': 'flex'}}>
                    <p
                    style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }}
                    data-name={file}
                    rel="noopener noreferrer"
                    onClick={handleClick}
                    >
                    {file}
                    </p>
                    <button data-name={file} onClick={handleDelete}>X</button>
                </li>
                ))}
            </ul>
    </div>
    </div>
    );
}

