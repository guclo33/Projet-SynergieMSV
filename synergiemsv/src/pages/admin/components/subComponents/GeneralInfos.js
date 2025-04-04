"use client"

import { useState, useContext } from "react"
import { useParams } from "react-router"
import { AuthContext } from "../../../AuthContext"
import { Link } from "react-router-dom"
import iconeProfile from "../../../../Images/iconeProfile.jpg"
import { AdminContext } from "../../AdminContext"
// Importer le nouveau composant ModalForm
import { ModalForm } from "./ModalForm"

export function GeneralInfos({ detailsData, openModal }) {
  const { info, equipe } = detailsData
  // Corriger le problème du modal en s'assurant que les valeurs initiales sont correctement définies
  // Mettre à jour l'état initial avec les valeurs actuelles
  const [newInfos, setNewInfos] = useState({
    email: info.email || "",
    phone: info.phone || "",
    price_sold: info.price_sold || "",
    active: info.active !== undefined ? info.active : true,
    additional_infos: info.additional_infos || "",
    echeance: info.echeance || "",
  })

  const { clientid } = useParams()
  const { user } = useContext(AuthContext)
  const { profilePhotos } = useContext(AdminContext)
  const apiUrl = process.env.REACT_APP_RENDER_API || "http://localhost:3000"

  const formatPhoneNumber = (phoneNumber) => {
    if (!phoneNumber) return "Non spécifié"

    // Supprimer tous les caractères non numériques
    const cleaned = phoneNumber.replace(/\D/g, "")

    // Vérifier si le numéro a la bonne longueur
    if (cleaned.length !== 10) {
      return phoneNumber // Retourner le numéro tel quel s'il n'a pas 10 chiffres
    }

    // Formater le numéro (XXX) XXX-XXXX
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    console.log(`Changing ${name} to ${value}`) // Ajouter un log pour déboguer
    setNewInfos((prev) => {
      const updated = { ...prev, [name]: value }
      console.log("Updated state:", updated) // Ajouter un log pour déboguer
      return updated
    })
  }

  // Modifier la fonction handleSubmit pour accepter les données du formulaire
  const handleSubmit = async (formData) => {
    try {
      const response = await fetch(`${apiUrl}/api/admin/${user.id}/details/${clientid}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        console.log(`overview for client ${clientid} data are successfully updated`)
        window.location.reload() // Reload to show updated data
      } else {
        console.log("error while trying to update in the server")
      }
    } catch (error) {
      console.log("couldn't update client details data", error)
    }
  }

  // Modifier la fonction handleModify pour utiliser la nouvelle approche du modal
  // Remplacer la fonction handleModify par:

  const handleModify = () => {
    // Préparer les données initiales pour le formulaire
    const initialData = {
      email: info.email || "",
      phone: info.phone || "",
      price_sold: info.price_sold || "",
      active: info.active !== undefined ? info.active : true,
      additional_infos: info.additional_infos || "",
      echeance: info.echeance || "",
    }

    // Ouvrir le modal avec le composant ModalForm
    openModal(() => <ModalForm initialData={initialData} onSubmit={handleSubmit} hasTeam={!!detailsData.equipe} />)
  }

  // Si pas d'équipe, afficher une version simplifiée
  if (!detailsData.equipe) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-3">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center">
            <img
              className="h-16 w-16 rounded-full object-cover border-2 border-gray-200 mr-3"
              src={profilePhotos[info.nom_client] || iconeProfile}
              alt={info.nom_client}
            />
            <h2 className="text-lg font-semibold text-gray-800">Informations générales</h2>
          </div>
          <button onClick={handleModify} className="btn-edit">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
              />
            </svg>
            Modifier
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <div className="bg-gray-50 p-2 rounded-md">
            <h3 className="text-xs font-medium text-gray-500 mb-1">Courriel :</h3>
            <p className="text-gray-900 text-sm">{info.email || "Non spécifié"}</p>
          </div>

          <div className="bg-gray-50 p-2 rounded-md">
            <h3 className="text-xs font-medium text-gray-500 mb-1">Téléphone :</h3>
            <p className="text-gray-900 text-sm">{formatPhoneNumber(info.phone)}</p>
          </div>
        </div>

        {info.additional_infos && (
          <div className="mt-2 bg-gray-50 p-2 rounded-md">
            <h3 className="text-xs font-medium text-gray-500 mb-1">Informations supplémentaires :</h3>
            <p className="text-gray-900 text-sm whitespace-pre-line">{info.additional_infos}</p>
          </div>
        )}
      </div>
    )
  }

  // Version avec équipe
  const teamWithoutLeader = detailsData.equipe.filter((client) => client.nom !== detailsData.info.nom_client)

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-3">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center">
          <img
            className="h-16 w-16 rounded-full object-cover border-2 border-gray-200 mr-3"
            src={profilePhotos[info.nom_client] || iconeProfile}
            alt={info.nom_client}
          />
          <h2 className="text-lg font-semibold text-gray-800">Informations générales</h2>
        </div>
        <button onClick={handleModify} className="btn-edit">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
            />
          </svg>
          Modifier
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        <div className="bg-gray-50 p-2 rounded-md">
          <h3 className="text-xs font-medium text-gray-500 mb-1">Courriel :</h3>
          <p className="text-gray-900 text-sm">{info.email || "Non spécifié"}</p>
        </div>

        <div className="bg-gray-50 p-2 rounded-md">
          <h3 className="text-xs font-medium text-gray-500 mb-1">Téléphone :</h3>
          <p className="text-gray-900 text-sm">{formatPhoneNumber(info.phone)}</p>
        </div>

        <div className="bg-gray-50 p-2 rounded-md">
          <h3 className="text-xs font-medium text-gray-500 mb-1">Montant :</h3>
          <p className="text-gray-900 text-sm">{info.price_sold} $</p>
        </div>

        <div className="bg-gray-50 p-2 rounded-md">
          <h3 className="text-xs font-medium text-gray-500 mb-1">Échéance :</h3>
          <p className="text-gray-900 text-sm">{info.echeance || "Non spécifiée"}</p>
        </div>

        <div className="bg-gray-50 p-2 rounded-md">
          <h3 className="text-xs font-medium text-gray-500 mb-1">Actif ?</h3>
          <p className="text-gray-900 text-sm">{info.active ? "Oui" : "Non"}</p>
        </div>
      </div>

      {info.additional_infos && (
        <div className="mt-2 bg-gray-50 p-2 rounded-md">
          <h3 className="text-xs font-medium text-gray-500 mb-1">Informations supplémentaires :</h3>
          <p className="text-gray-900 text-sm whitespace-pre-line">{info.additional_infos}</p>
        </div>
      )}

      {teamWithoutLeader.length > 0 && (
        <div className="mt-3 pt-2 border-t border-gray-100">
          <h3 className="text-sm font-semibold text-gray-800 mb-2">Équipe:</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {teamWithoutLeader.map((teamMate) => (
              <Link
                to={`/admin/${user.id}/details/${teamMate.id}`}
                key={teamMate.id}
                className="flex items-center bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 transition-colors duration-200 p-2"
              >
                <img
                  className="w-10 h-10 rounded-full object-cover border border-gray-200"
                  src={profilePhotos[teamMate.nom] || iconeProfile}
                  alt={teamMate.nom}
                />
                <div className="ml-2">
                  <h4 className="text-xs font-medium text-gray-900">{teamMate.nom}</h4>
                  <p className="text-xs text-gray-600">{teamMate.email}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

