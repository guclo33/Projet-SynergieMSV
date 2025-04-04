"use client"

import { useCallback, useContext, useState, useEffect } from "react"
import { useDropzone } from "react-dropzone"
import { AuthContext } from "../../../AuthContext"

function capitalizeFirstLetter(string) {
  if (!string) return ""
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase()
}

export function DropZone({ detailsData, category, apiUrl }) {
  const [files, setFiles] = useState([])
  const [selectedFile, setSelectedFile] = useState()
  const { user } = useContext(AuthContext)
  const { info, group } = detailsData

  const fetchFiles = useCallback(async () => {
    let encodedGroupName = ""
    if (group && group.group_name) {
      encodedGroupName = encodeURIComponent(group.group_name)
    }
    const encodedClientName = encodeURIComponent(info.nom_client)
    console.log("calling fetchfiles with apiurl:", apiUrl, "category:", category, "nom_client", info.nom_client)
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

        console.log("data", data)
        const filenames = data.files.map((file) => file.split("/").pop())

        setFiles(filenames)
      }
    } catch (error) {
      console.error("Error fetching files:", error)
    }
  }, [apiUrl, category])

  const onDrop = useCallback(
    async (acceptedFiles) => {
      if (!detailsData?.info?.nom_client) {
        console.error("detailsData.info.nom_client is not defined")
        return
      }

      const formData = new FormData()
      formData.append("file", acceptedFiles[0])
      formData.append("fileName", encodeURIComponent(acceptedFiles[0].name))

      try {
        const response = await fetch(`${apiUrl}/${category}/upload/${info.nom_client}/${group.group_name}`, {
          method: "POST",
          credentials: "include",
          body: formData,
        })
        if (response.ok) {
          const data = await response.json()
          console.log("Uploaded file:", data)
          fetchFiles()
        }
      } catch (error) {
        console.log("couldn't upload file")
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

    console.log("apiUrl", apiUrl, "category", category, "encoded leader", info.nom_leader, "filename", fileName)
    console.log("apiURL", `${apiUrl}/${category}/download/${encodedClientName}/${fileName}/${encodedGroupName}`)
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
        console.log("data", data)
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
        console.log(fileName, "successfully deleted")
        await fetchFiles()
      }
    } catch (err) {
      console.log("Couldn't delete the file", err)
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
      console.log("Suppression annulée")
      return // Annuler la suppression si l'utilisateur clique sur "Annuler"
    }
    deleteFile(fileName)
  }

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0])
  }

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Svp sélectionner un fichier d'abord")
      return
    }
    const formData = new FormData()
    formData.append("file", selectedFile)
    console.log("selectedFile", selectedFile)
    if (category === "photos") {
      formData.append("fileName", encodeURIComponent(`${info.nom_client}.${selectedFile.name.split(".").pop()}`))
    } else {
      formData.append("fileName", encodeURIComponent(selectedFile.name))
    }
    console.log("selectedFile", selectedFile)
    let encodedGroupName = ""
    if (group && group.group_name) {
      encodedGroupName = encodeURIComponent(group.group_name)
    }
    const encodedClientName = encodeURIComponent(info.nom_client)

    try {
      const response = await fetch(`${apiUrl}/${category}/upload/${encodedClientName}/${encodedGroupName}`, {
        method: "POST",
        credentials: "include",
        body: formData,
      })
      if (response.ok) {
        const data = await response.json()
        console.log("Uploaded file:", data)
        fetchFiles()
      }
    } catch (error) {
      console.log("couldn't upload file")
    }
  }

  const { getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject } = useDropzone({
    onDrop,
  })

  return (
    <div className="dropSection">
      <h3 className="text-base font-medium mb-2">{capitalizeFirstLetter(category)}</h3>

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
          <button onClick={handleUpload} className="btn-upload">
            Ajouter
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

