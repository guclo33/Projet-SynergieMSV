"use client"

import React, { useState, useEffect, useContext, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { AuthContext } from "../../../AuthContext"
import { processImageForUpload, isHeicFile, getHeicWarning, validateImageFile } from "../../../../components/imageUtils"

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

// Fonction pour normaliser les noms de fichiers côté frontend (optionnel, pour la cohérence)
const normalizeFileName = (fileName) => {
  return fileName
    .normalize('NFD') // Décompose les caractères accentués
    .replace(/[\u0300-\u036f]/g, '') // Supprime les diacritiques
    .replace(/[^a-zA-Z0-9.-]/g, '_') // Remplace les caractères spéciaux par des underscores
    .replace(/_+/g, '_') // Remplace les underscores multiples par un seul
    .replace(/^_|_$/g, ''); // Supprime les underscores en début et fin
};

export function DropZone({ detailsData, category, apiUrl }) {
  const [files, setFiles] = useState([])
  const [selectedFile, setSelectedFile] = useState()
  const [isProcessing, setIsProcessing] = useState(false)
  const [warning, setWarning] = useState(null)
  const { user } = useContext(AuthContext)
  const { info, group } = detailsData

  const fetchFiles = useCallback(async () => {
    let encodedGroupName = ""
    if (group && group.group_name) {
      encodedGroupName = encodeURIComponent(group.group_name)
    }
    const encodedClientName = encodeURIComponent(info.nom_client)

    try {
      const response = await fetch(`${apiUrl}/${category}/list/${encodedClientName}/${encodedGroupName}`, {
        method: "GET",
        credentials: "include",
      })
      if (response.ok) {
        if (category === "photos") {
          const data = await response.json()
          if (data.files.length === 0) {
            // Plus de fichier => on peut faire setFiles([]) ou autre
            return setFiles([])
          }
          // Sinon, on prend le premier
          const filename = data.files[0].Key.split("/").pop()
          return setFiles([filename])
        }
        const data = await response.json()


        const filenames = data.files.map((file) => file.split("/").pop())

        setFiles(filenames)
      }
    } catch (error) {
      console.error("Error fetching files:", error)
    }
  }, [apiUrl, category])

  const onDrop = useCallback(
    async (acceptedFiles) => {
      if (acceptedFiles.length === 0) return

      const file = acceptedFiles[0]
      
      // Valider le fichier
      const validation = validateImageFile(file)
      if (!validation.valid) {
        alert(validation.error)
        return
      }

      // Vérifier les avertissements HEIC
      const heicWarning = getHeicWarning(file)
      if (heicWarning) {
        setWarning(heicWarning)
      } else {
        setWarning(null)
      }

      setIsProcessing(true)
      try {
        // Traiter le fichier (préparer pour upload)
        const processedFile = await processImageForUpload(file)
        


        const formData = new FormData()
        formData.append("file", processedFile)
        formData.append("fileName", processedFile.name)

        const response = await fetch(`${apiUrl}/${category}/upload/${info.nom_client}/${group.group_name}`, {
          method: "POST",
          credentials: "include",
          body: formData,
        })
        if (response.ok) {
          const data = await response.json()

          setWarning(null) // Effacer l'avertissement après upload réussi
          fetchFiles()
        } else {
          const errorText = await response.text()
          alert(`Erreur lors de l'upload: ${errorText}`)
        }
      } catch (error) {
        console.error("couldn't upload file", error)
        alert("Erreur lors de l'upload du fichier. Vérifiez que le fichier est valide.")
      } finally {
        setIsProcessing(false)
      }
    },
    [apiUrl, category, detailsData],
  )

  const downloadFile = async (fileName) => {
    const encodedClientName = encodeURIComponent(info.nom_client)
    let encodedGroupName = ""
    if (group && group.group_name) {
      encodedGroupName = encodeURIComponent(group.group_name)
    }

    try {
      const response = await fetch(
        `${apiUrl}/${category}/download/${encodedClientName}/${fileName}/${encodedGroupName}`,
        {
          method: "GET",
          credentials: "include",
        },
      )
      if (response.ok) {
        const data = await response.json()

        if (data.downloadUrl) {
          window.open(data.downloadUrl, "_blank")
        }
      }
    } catch (error) {
      console.error("Error downloading file:", error)
    }
  }

  const deleteFile = async (fileName) => {
    let encodedGroupName = ""
    if (group && group.group_name) {
      encodedGroupName = encodeURIComponent(group.group_name)
    }
    const encodedClientName = encodeURIComponent(info.nom_client)

    try {
      const response = await fetch(
        `${apiUrl}/${category}/delete/${encodedClientName}/${fileName}/${encodedGroupName}`,
        {
          method: "DELETE",
          credentials: "include",
        },
      )
      if (response.ok) {
        await fetchFiles()
      }
    } catch (err) {
      console.error("Couldn't delete the file", err)
    }
  }

  useEffect(() => {
    fetchFiles()
  }, [fetchFiles])

  const handleClick = (e) => {
    e.stopPropagation()
    const fileName = e.target.getAttribute("data-name")
    downloadFile(fileName)
  }

  const handleDelete = async (e) => {
    e.stopPropagation()
    const fileName = e.target.getAttribute("data-name")
    const confirmDelete = window.confirm(`Voulez-vous vraiment supprimer le fichier "${fileName}" ?`)

    if (!confirmDelete) {
      console.info("Suppression annulée")
      return // Annuler la suppression si l'utilisateur clique sur "Annuler"
    }
    deleteFile(fileName)
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Valider le fichier
      const validation = validateImageFile(file)
      if (!validation.valid) {
        alert(validation.error)
        e.target.value = null
        return
      }

      // Vérifier les avertissements HEIC
      const heicWarning = getHeicWarning(file)
      if (heicWarning) {
        setWarning(heicWarning)
      } else {
        setWarning(null)
      }

      setSelectedFile(file)
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Svp sélectionner un fichier d'abord")
      return
    }
    
    setIsProcessing(true)
    try {
      // Traiter le fichier (préparer pour upload)
      const processedFile = await processImageForUpload(selectedFile)
      

      
      const formData = new FormData()
      formData.append("file", processedFile)

      
      if (category === "photos") {
        formData.append("fileName", `${info.nom_client}.${processedFile.name.split(".").pop()}`)
      } else {
        formData.append("fileName", processedFile.name)
      }
      
    
      let encodedGroupName = ""
      if (group && group.group_name) {
        encodedGroupName = encodeURIComponent(group.group_name)
      }
      const encodedClientName = encodeURIComponent(info.nom_client)

      const response = await fetch(`${apiUrl}/${category}/upload/${encodedClientName}/${encodedGroupName}`, {
        method: "POST",
        credentials: "include",
        body: formData,
      })
      if (response.ok) {
        const data = await response.json()
        setWarning(null) // Effacer l'avertissement après upload réussi
        setSelectedFile(null) // Réinitialiser la sélection
        fetchFiles()
      } else {
        const errorText = await response.text()
        alert(`Erreur lors de l'upload: ${errorText}`)
      }
    } catch (error) {
      console.error("couldn't upload file", error)
      alert("Erreur lors de l'upload du fichier. Vérifiez que le fichier est valide.")
    } finally {
      setIsProcessing(false)
    }
  }

  const { getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject } = useDropzone({
    onDrop,
  })

  return (
    <div className="dropSection">
      <h3 className="text-base font-medium mb-2">{capitalizeFirstLetter(category)}</h3>

      {/* Avertissement HEIC */}
      {warning && (
        <div className="mb-3 p-3 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded">
          <p className="text-sm">{warning}</p>
        </div>
      )}

      <div className="flex flex-col space-y-2">
        <div className="flex items-center space-x-2">
          <div className="relative flex-grow">
            <input
              type="file"
              onChange={handleFileChange}
              className="opacity-0 absolute inset-0 w-full h-full cursor-pointer z-10"
            />
            <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
              <span className="px-3 py-2 text-sm text-gray-500 truncate flex-grow">
                {selectedFile ? selectedFile.name : "Choisir un fichier"}
              </span>
            </div>
          </div>
          <button 
            onClick={handleUpload} 
            className="btn-upload"
            disabled={isProcessing || !selectedFile}
          >
            {isProcessing ? "Upload..." : "Ajouter"}
          </button>
        </div>

        <div
          {...getRootProps()}
          className={`dropzone-container ${isDragActive ? "active" : ""} ${isDragAccept ? "accept" : ""} ${isDragReject ? "reject" : ""}`}
        >
          <input {...getInputProps()} />

          {files.length === 0 ? (
            <div className="dropzone-placeholder">
              <p className="text-sm text-center text-gray-500">
                {isDragActive
                  ? isDragReject
                    ? "Fichier non valide"
                    : "Déposez le fichier ici..."
                  : "Glissez et déposez un fichier ici, ou cliquez pour sélectionner"}
              </p>
            </div>
          ) : (
            <ul className="file-list">
              {files.map((file, index) => (
                <li key={index} className="file-item">
                  <span className="file-name" data-name={file} onClick={handleClick}>
                    {file}
                  </span>
                  <button className="file-delete" data-name={file} onClick={handleDelete}>
                    ×
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}

