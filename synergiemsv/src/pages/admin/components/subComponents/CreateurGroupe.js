"use client"

import { useState, useEffect, useContext } from "react"
import { useDispatch, useSelector } from "react-redux"
import Modal from "react-modal"
import { appendMembersIds, removeMembersIds, resetNewGroup, setNewGroup, setNewLeader } from "../../Redux/adminSlice"
import { AdminContext } from "../../AdminContext"
import { AuthContext } from "../../../AuthContext"

export function CreateurGroupe() {
  const [creatingGroup, setCreatingGroup] = useState(false)
  const newGroup = useSelector((state) => state.admin.newGroup)
  const newLeader = useSelector((state) => state.admin.newLeader)
  const { leadersData, clientsData, apiUrl, getAdminHomeData } = useContext(AdminContext)
  const dispatch = useDispatch()
  const [newLeaderModal, setNewLeaderModal] = useState(false)
  const [singleClientId, setSingleClientId] = useState()
  const { user } = useContext(AuthContext)

  useEffect(() => {
    // Vérifier si newLeader est correctement initialisé
    if (!newLeader || !newLeader.nom_leader) {
      dispatch(setNewLeader({ key: "nom_leader", value: "" }))
      dispatch(setNewLeader({ key: "email", value: "" }))
    }
  }, [dispatch, newLeader])

  useEffect(() => {
    if (leadersData && newGroup && newGroup.nom_leader) {
      const selectedLeader = leadersData.find((leader) => leader.nom === newGroup.nom_leader)
      // Vérifier si selectedLeader existe avant d'accéder à sa propriété id
      if (selectedLeader) {
        dispatch(setNewGroup({ key: "leader_id", value: selectedLeader.id }))
      }
    }
  }, [leadersData, newGroup, dispatch])

  const handleChange = (e) => {
    const { name, value } = e.target
    dispatch(setNewGroup({ key: name, value: value }))
  }

  const handleClick = (e) => {
    e.preventDefault()
    setNewLeaderModal(!newLeaderModal)
  }

  const handleLeaderChange = (e) => {
    const { name, value } = e.target
    dispatch(setNewLeader({ key: name, value: value }))
  }

  const handleMemberId = (e) => {
    const selectedId = Number(e.target.value)
    setSingleClientId(selectedId)

    if (!newGroup.members_ids.includes(selectedId)) {
      dispatch(appendMembersIds(selectedId))
    }
  }

  const handleRemoveClient = (e, value) => {
    e.preventDefault()
    dispatch(removeMembersIds(value))
  }

  const handleReset = (e) => {
    e.preventDefault()
    dispatch(resetNewGroup())
  }

  const handleExit = (e) => {
    e.preventDefault()
    setCreatingGroup(false)
  }

  let filteredClientsData = []
  let groupClientsArray = []
  if (clientsData && newGroup && newGroup.members_ids) {
    groupClientsArray = clientsData.filter(
      (client) =>
        Array.isArray(newGroup.members_ids) && newGroup.members_ids.map((id) => Number(id)).includes(Number(client.id)),
    )

    filteredClientsData = clientsData.filter(
      (client) =>
        Array.isArray(newGroup.members_ids) &&
        !newGroup.members_ids.map((id) => Number(id)).includes(Number(client.id)),
    )
  }

  const handleAddLeader = async (e) => {
    e.preventDefault()
    try {
      // Vérifier que les données du leader sont valides
      if (!newLeader || !newLeader.nom_leader || !newLeader.email) {
        alert("Veuillez remplir tous les champs du formulaire")
        return
      }


      const response = await fetch(`${apiUrl}/api/admin/${user.id}/gestion/leader`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newLeader),
      })

      if (response.ok) {
        

        try {
          const data = await response.json()


          // Ajouter le leader à leadersData sans modifier l'état directement
          // Utiliser getAdminHomeData pour rafraîchir les données
          if (typeof getAdminHomeData === "function") {
            getAdminHomeData()
          }
        } catch (parseError) {
          console.error("Réponse reçue mais pas au format JSON:", parseError)
        }

        // Réinitialiser le formulaire
        dispatch(setNewLeader({ key: "nom_leader", value: "" }))
        dispatch(setNewLeader({ key: "email", value: "" }))

        setNewLeaderModal(false)

        // Afficher une confirmation à l'utilisateur
        alert(`Leader ${newLeader.nom_leader} ajouté avec succès!`)
      } else {
        console.error("Erreur lors de la création du leader:", response.status)
        alert("Erreur lors de la création du leader. Veuillez réessayer.")
      }
    } catch (error) {
      console.error("Erreur lors de l'ajout du leader:", error)
      alert("Erreur de connexion. Veuillez vérifier votre connexion internet et réessayer.")
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const response = await fetch(`${apiUrl}/api/admin/${user.id}/gestion/groupe`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newGroup),
      })
      if (response.ok) {

        setCreatingGroup(false)
        dispatch(resetNewGroup())
        getAdminHomeData()
      }
    } catch (error) {
      console.error("Couldn't add group to server", error)
    }
  }

  return (
    <>
      {creatingGroup ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label htmlFor="group_name" className="block text-sm font-medium text-gray-700">
                Nom du nouveau groupe:
              </label>
              <input
                type="text"
                name="group_name"
                value={newGroup.group_name}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#6F1E49] focus:border-transparent"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="date_presentation" className="block text-sm font-medium text-gray-700">
                Date présentation
              </label>
              <input
                type="datetime-local"
                name="date_presentation"
                value={newGroup.date_presentation}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#6F1E49] focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <label htmlFor="have_leader" className="text-sm font-medium text-gray-700">
              Est-ce que ce groupe a un leader?
            </label>
            <input
              type="checkbox"
              name="have_leader"
              checked={newGroup.have_leader}
              onChange={(e) => dispatch(setNewGroup({ key: e.target.name, value: e.target.checked }))}
              className="h-4 w-4 text-[#6F1E49] focus:ring-[#6F1E49] border-gray-300 rounded"
            />
          </div>

          {newGroup.have_leader && (
            <div className="space-y-1">
              <label htmlFor="nom_leader" className="block text-sm font-medium text-gray-700">
                Quel est le nom du leader?
              </label>
              <div className="flex space-x-2">
                <select
                  name="nom_leader"
                  value={newGroup.nom_leader}
                  onChange={handleChange}
                  className="flex-grow px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#6F1E49] focus:border-transparent"
                >
                  <option>-- Sélectionnez un leader --</option>
                  {leadersData.map((leader) => (
                    <option key={leader.id} value={leader.nom}>
                      {leader.nom}, {leader.email}
                    </option>
                  ))}
                </select>
                <button onClick={handleClick} className="btn-primary" type="button">
                  Ajouter un leader
                </button>
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label htmlFor="members_ids" className="block text-sm font-medium text-gray-700">
              Ajouter des clients déjà existants
            </label>
            <select
              name="members_ids"
              value={singleClientId}
              onChange={handleMemberId}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#6F1E49] focus:border-transparent"
            >
              <option value="">-- Sélectionnez un client --</option>
              {filteredClientsData.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.nom}, {client.email}
                </option>
              ))}
            </select>
          </div>

          {groupClientsArray.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-md font-medium text-gray-700">Liste des membres du groupe :</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {groupClientsArray.map((client) => (
                  <div key={client.id} className="flex items-center justify-between bg-gray-50 p-2 rounded-md">
                    <div>
                      <p className="text-sm font-medium">{client.nom}</p>
                      <p className="text-xs text-gray-600">{client.email}</p>
                    </div>
                    <button
                      onClick={(e) => handleRemoveClient(e, client.id)}
                      className="text-red-500 hover:text-red-700 focus:outline-none"
                      type="button"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-4">
            <button type="submit" className="btn-primary">
              Soumettre le nouveau groupe
            </button>
            <button onClick={handleReset} className="btn-edit" type="button">
              Réinitialiser
            </button>
            <button onClick={handleExit} className="btn-edit" type="button">
              Annuler
            </button>
          </div>
        </form>
      ) : (
        <button onClick={() => setCreatingGroup(true)} className="btn-primary">
          Créer un nouveau groupe
        </button>
      )}

      <Modal
        className="modal"
        isOpen={newLeaderModal}
        onRequestClose={() => setNewLeaderModal(false)}
        contentLabel="Ajouter un nouveau leader"
      >
        <div className="modalContent">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Ajouter un nouveau leader</h2>
            <button
              onClick={() => setNewLeaderModal(false)}
              className="text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-4">
            <div className="space-y-1">
              <label htmlFor="nom_leader" className="block text-sm font-medium text-gray-700">
                Nom complet
              </label>
              <input
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#6F1E49] focus:border-transparent"
                name="nom_leader"
                value={newLeader.nom_leader}
                type="text"
                onChange={handleLeaderChange}
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#6F1E49] focus:border-transparent"
                type="text"
                name="email"
                value={newLeader.email}
                onChange={handleLeaderChange}
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button className="btn-primary" name="submitAddLeaders" onClick={handleAddLeader}>
                Soumettre
              </button>
              <button className="btn-edit" name="unShowModal" onClick={() => setNewLeaderModal(false)}>
                Fermer
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  )
}

