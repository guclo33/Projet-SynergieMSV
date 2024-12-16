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
    const {user} = useContext(AuthContext)
    const {info} = detailsData
    

    const fetchFiles = useCallback(async () => {
        const encodedLeaderName = encodeURIComponent(info.nom_leader)
        console.log("calling fetchfiles with apiurl:", apiUrl, "category:", category, "nom leader", info.nom_leader)
        try {
            const response = await fetch(`${apiUrl}/${category}/list/${encodedLeaderName}`, {
                method: "GET",
                credentials: "include",
            });
            if (response.ok) {
                const data = await response.json();
                setFiles(data.files);
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

        try {
            const response = await fetch(`${apiUrl}/${category}/upload/${info.nom_leader}`, {
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
        try {
            const response = await fetch(`${apiUrl}/${category}/download/${info.nom_leader}/${fileName}`, {
                method: "GET",
                credentials: "include",
            });
            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = fileName;
                document.body.appendChild(a);
                a.click();
                a.remove();
            }
        } catch (error) {
            console.error("Error downloading file:", error);
        }
    };

    useEffect(() => {
        fetchFiles();
    }, [fetchFiles]);


    const handleClick = (e) => {
        
        const fileName = e.target.getAttribute('data-name')
        downloadFile(fileName)
    }

    

    const { getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject } = useDropzone({
        onDrop, })

    const baseStyle = {
        border: "1px solid var(--secondary-color)",
        boxShadow: "0 4px 8px var(--primary-color)",
        borderRadius: "20px",
        padding: "1rem",

        textAlign: "center",
        transition: "border-color 0.3s, background-color 0.3s",
        
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
            <div   
            {...getRootProps({ className: "dropzone" })}
            style={currentStyle}
            >
            
            <input {...getInputProps()} />
            {isDragReject && <p style={{ color: "#f44336" }}>Fichiers non valides.</p>}
            {isDragAccept && <p style={{ color: "#4caf50" }}>Relâchez pour déposer.</p>}
            
            <ul>
                {files.map((file, index) => (
                <li key={index}>
                    <p
                    style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }}
                    data-name={file}
                    rel="noopener noreferrer"
                    onClick={handleClick}
                    >
                    {file}
                    </p>
                </li>
                ))}
            </ul>
    </div>
    </div>
    );
}

