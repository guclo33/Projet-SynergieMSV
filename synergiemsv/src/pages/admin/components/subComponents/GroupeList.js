"use client"

import { useState, useEffect, useContext } from "react"
import { useSelector, useDispatch } from "react-redux"
import { AdminContext } from "../../AdminContext"
import iconeProfile from "../../../../Images/iconeProfile.jpg"
import { AuthContext } from "../../../AuthContext"
import { updateSingleGroupsData, setGroupesData } from "../../Redux/adminSlice"
import { Link, useNavigate } from "react-router-dom"
import { getPromptSetsAPI } from "../../prompt/actions/prompt.action"
import { Loader2 } from "lucide-react"

export function GroupeList() {
  const [isLoading, setIsLoading] = useState(false)
  const [active, setActive] = useState(true)
  const [selectedId, setSelectedId] = useState(null)
  const [expand, setExpand] = useState(false)
  const { clientsData, apiUrl, leadersData, profilePhotos } = useContext(AdminContext)
  const { user } = useContext(AuthContext)
  const [modify, setModify] = useState(false)
  const [formUrl, setFormUrl] = useState("")
  const [leader, setLeader] = useState()
  const [selectedClientId, setSelectedClientId] = useState()
  const [filteredClientsData, setFilteredClientsData] = useState([])
  const [clientsIdUpdated, setClientsIdUpdated] = useState([])
  const [restOfClients, setRestOfClients] = useState([])
  const [addRemoveIdArray, setAddRemoveIdArray] = useState({})
  const [activeGroups, setActiveGroups] = useState([])
  const { groupesData, groupesClients } = useSelector((state) => state.admin.groupesData)
  const [modifiedGroup, setModifiedGroup] = useState({})
  const [search, setSearch] = useState("")
  const dispatch = useDispatch()
  const apiUrlLocal = process.env.REACT_APP_RENDER_API || "http://localhost:3001"

  // États pour le modal de génération de profil
  const [modalOpen, setModalOpen] = useState(false)
  const [currentClient, setCurrentClient] = useState(null)
  const [selectedFormId, setSelectedFormId] = useState(null)
  const [promptSets, setPromptSets] = useState([])
  const [selectedPromptSet, setSelectedPromptSet] = useState("")
  const [generationMethod, setGenerationMethod] = useState("standard")
  const [loadingPromptSets, setLoadingPromptSets] = useState(false)

  const navigate = useNavigate()

  useEffect(() => {
    if (!groupesData) {
      return
    }
    const selectedGroup = groupesData.find((group) => group.id === selectedId)
    const selectedGroupClients = groupesClients.filter((client) => client.groupe_id === selectedId)
    const clientsArray = selectedGroupClients.map((client) => client.client_id)
    setModifiedGroup(selectedGroup)
    setClientsIdUpdated(clientsArray)
  }, [selectedId, modify, groupesData, groupesClients])

  useEffect(() => {
    setFormUrl("")
  }, [selectedId])

  // Modifier la fonction useEffect qui filtre les groupes pour inclure le nom du groupe
  useEffect(() => {
    const selectedGroup = groupesData.filter((group) => group.active === active)
    const searchedGroup = selectedGroup.filter(
      (group) =>
        group.group_name.toLowerCase().includes(search) ||
        (group.nom_leader && group.nom_leader.toLowerCase().includes(search)),
    )
    setActiveGroups(searchedGroup)
  }, [groupesData, active, search])

  useEffect(() => {
    let filteredClients = clientsData.filter((client) => clientsIdUpdated.includes(client.id))
    const restOfClientsArray = clientsData.filter((client) => !clientsIdUpdated.includes(client.id))
    const selectedGroup = groupesData.find((group) => group.id === selectedId)

    if (selectedGroup && selectedGroup.have_leader) {
      const leader = leadersData.find((leader) => leader.id === selectedGroup.leader_id)
      const leaderClientId = leader.clientid
      filteredClients = filteredClients.filter((client) => client.id !== leaderClientId)
    }

    setFilteredClientsData(filteredClients)
    setRestOfClients(restOfClientsArray)
  }, [expand, clientsIdUpdated, groupesData, groupesClients])

  useEffect(() => {
    const selectedMembersId = groupesClients.filter((group) => group.groupe_id === selectedId)
    const realIdsArray = selectedMembersId.map((client) => client.client_id)

    const newValues = [
      ...clientsIdUpdated.filter((item) => !realIdsArray.includes(item)),
      ...realIdsArray.filter((item) => !clientsIdUpdated.includes(item)),
    ]

    if (clientsIdUpdated.length > realIdsArray.length) {
      setAddRemoveIdArray({
        ids_to_add: newValues,
        ids_to_remove: null,
      })
      return
    }

    if (clientsIdUpdated.length < realIdsArray.length) {
      setAddRemoveIdArray({
        ids_to_add: null,
        ids_to_remove: newValues,
      })
      return
    }
  }, [clientsIdUpdated])

  // Charger les prompt sets au montage du composant
  useEffect(() => {
    const fetchPromptSets = async () => {
      if (user && user.id) {
        setLoadingPromptSets(true)
        try {
          const sets = await getPromptSetsAPI(user.id)
          console.log("Prompt sets loaded:", sets)
          if (Array.isArray(sets) && sets.length > 0) {
            setPromptSets(sets)
            setSelectedPromptSet(sets[0].id)
          } else {
            console.log("No prompt sets found or invalid response format", sets)
            setPromptSets([])
          }
        } catch (error) {
          console.error("Error fetching prompt sets:", error)
          setPromptSets([])
        } finally {
          setLoadingPromptSets(false)
        }
      }
    }

    fetchPromptSets()
  }, [user])

  if (!groupesData || !clientsData) {
    return (
      <div className="flex items-center justify-center h-40">
        <div className="spinner"></div>
        <span className="ml-3 text-lg font-medium">Chargement...</span>
      </div>
    )
  }

  const handleExpand = (e) => {
    const name = Number(e.currentTarget.dataset.name)
    if (selectedId !== name) {
      setSelectedId(name)
      setExpand(true)
    }
  }

  const handleReduire = () => {
    setExpand(false)
    setSelectedId(null)
  }

  const handleCopy = async () => {
    if (!formUrl) return

    try {
      await navigator.clipboard.writeText(formUrl)
      alert("Lien copié !")
    } catch (err) {
      console.error("Erreur lors de la copie :", err)
    }
  }

  const handleUrl = async () => {
    const selectedGroup = activeGroups.find((group) => group.id === selectedId)
    if (!selectedGroup) {
      return
    }

    try {
      const response = await fetch(`${apiUrl}/api/form/url`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          group_name: selectedGroup.group_name,
          group_id: selectedGroup.id,
          have_leader: selectedGroup.have_leader,
          nom_leader: selectedGroup.nom_leader,
          leader_id: selectedGroup.leader_id,
          date_presentation: selectedGroup.date_presentation,
        }),
      })

      const data = await response.json()
      if (data.id) {
        const Url = `${apiUrlLocal}/form?id=${data.id}`
        setFormUrl(Url)
      } else {
        console.error("Erreur : ID non reçu")
      }
    } catch (error) {
      console.error("Erreur lors de la requête :", error)
    }
  }

  const modifyGroup = (e) => {
    const { name, type, checked, value } = e.target
    setModifiedGroup((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const modifyGroupLeader = (e) => {
    const { name, value } = e.target

    try {
      const parsedValue = JSON.parse(value)
      setModifiedGroup((prev) => ({
        ...prev,
        [name]: parsedValue,
      }))
    } catch (error) {
      console.error("Erreur de parsing JSON:", error)
    }
  }

  const handleRemoveClient = (e) => {
    const name = e.currentTarget.dataset.name
    const id = Number(name)
    setClientsIdUpdated((prev) => prev.filter((client) => client !== id))
  }

  const handleMemberId = (e) => {
    const selectedId = Number(e.target.value)
    setClientsIdUpdated((prev) => (prev.includes(selectedId) ? prev : [...prev, selectedId]))
  }

  // Modifier la fonction handleSearch pour inclure le filtrage par nom de groupe
  const handleSearch = (e) => {
    const { value } = e.target
    setSearch(value.toLowerCase())
  }

  const handleSubmit = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/admin/${user.id}/gestion/groupe`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          group_id: selectedId,
          group_name: modifiedGroup.group_name,
          have_leader: modifiedGroup.have_leader,
          nom_leader: modifiedGroup.leader ? modifiedGroup.leader.nom_leader : modifiedGroup.nom_leader,
          leader_id: modifiedGroup.leader ? modifiedGroup.leader.leader_id : modifiedGroup.leader_id,
          date_presentation: modifiedGroup.date_presentation,
          active: modifiedGroup.active,
          ids_to_add: addRemoveIdArray.ids_to_add,
          ids_to_remove: addRemoveIdArray.ids_to_remove,
        }),
      })
      if (response.ok) {
        console.log("group successfully updated")
        const groupeData = {
          active: modifiedGroup,
          date_presentation: modifiedGroup.date_presentation,
          group_name: modifiedGroup.group_name,
          have_leader: modifiedGroup.have_leader,
          id: selectedId,
          leader_id: modifiedGroup.leader ? modifiedGroup.leader.leader_id : modifiedGroup.leader_id,
          nom_leader: modifiedGroup.leader ? modifiedGroup.leader.nom_leader : modifiedGroup.nom_leader,
        }
        dispatch(updateSingleGroupsData({ groupeData: groupeData, id: selectedId }))
        setModify(false)
        const response2 = await fetch(`${apiUrl}/api/admin/${user.id}`, {
          method: "GET",
          credentials: "include",
        })
        if (response2.ok) {
          const data = await response2.json()
          console.log("got the new data", data)
          const groupesData = {
            groupesData: data.groupesData.groupesData.rows,
            groupesClients: data.groupesData.groupesClients.rows,
          }
          dispatch(setGroupesData(groupesData))
        }
        return
      } else {
        console.log("probleme au niveau du server pour l'update de groupe")
      }
    } catch (error) {
      console.log("couldn't update the group", error)
    }
  }

  const handleShowProfile = (e) => {
    const { id, checked } = e.target
    const value = Boolean(!checked)

    try {
      const response = fetch(`${apiUrlLocal}/api/admin/${user.id}/group/showProfile/${id}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: value,
      })
      if (response.ok) {
        console.log("réussi la mise à jour du showProfile!")
      }
    } catch (error) {
      console.log("N'a pas updater ShowProfile", error)
    }
  }

  const handleGenerateCanva = (e) => {
    const { id } = e.target

    try {
      const response = fetch(`${apiUrlLocal}/api/admin/${user.id}/group/generateCanva/${id}`, {
        method: "GET",
        credentials: "include",
      })
      if (response.ok) {
        console.log("réussi l'autofill Canva")
      }
    } catch (error) {
      console.log("N'a pas fait l'autofill Canva", error)
    }
  }

  // Fonction pour ouvrir le modal de génération de profil
  const handleProfileClick = (client) => {
    setCurrentClient(client)

    // Vérifier si les prompt sets sont déjà chargés, sinon les charger
    if (promptSets.length === 0 && !loadingPromptSets) {
      setLoadingPromptSets(true)
      getPromptSetsAPI(user.id)
        .then((sets) => {
          if (Array.isArray(sets) && sets.length > 0) {
            setPromptSets(sets)
            setSelectedPromptSet(sets[0].id)
          }
        })
        .catch((error) => {
          console.error("Error fetching prompt sets:", error)
        })
        .finally(() => {
          setLoadingPromptSets(false)
        })
    }

    // Réinitialiser la méthode de génération à standard
    setGenerationMethod("standard")

    // Si un seul form_id est disponible, le présélectionner
    if (client.form_ids && client.form_ids.length === 1) {
      setSelectedFormId(client.form_ids[0])
    } else {
      setSelectedFormId("")
    }

    // Ouvrir le modal
    setModalOpen(true)
  }

  // Fonction pour générer le profil
  const handleProfileGenerate = async (clientId, formId, promptSetId = null) => {
    if (!formId) {
      alert("Veuillez sélectionner un formulaire")
      return
    }

    if (generationMethod === "promptSet" && !promptSetId) {
      alert("Veuillez sélectionner un set de prompts")
      return
    }

    setIsLoading(true)
    try {
      let response

      if (generationMethod === "standard" || !promptSetId) {
        // Méthode standard existante
        response = await fetch(`${apiUrl}/api/form/generateProfile/${formId}`, {
          method: "GET",
          credentials: "include",
        })
      } else {
        // Nouvelle méthode avec prompt set
        response = await fetch(`${apiUrl}/api/admin/${user.id}/newGenerateProfile`, {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            formId,
            clientId,
            selectedSetId: promptSetId,
          }),
        })
      }

      if (response.ok) {
        const data = await response.json()
        console.log("Message from API:", data.message)
        console.log("Profil généré avec succès")
        navigate(`/admin/${user.id}/details/${clientId}`)
      } else {
        console.error("Erreur lors de la génération du profil")
        alert("Erreur lors de la génération du profil")
      }
    } catch (error) {
      console.error("Erreur réseau:", error)
      alert("Erreur réseau lors de la génération du profil")
    } finally {
      setIsLoading(false)
      setModalOpen(false) // Ferme le modal après action
    }
  }

  if (isLoading) {
    return (
      <div className="loading-overlay">
        <div className="spinner"></div>
      </div>
    )
  }

  // Modifier la section de recherche pour corriger l'icône superposée
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Vos groupes de formation :</h2>
        <div className="activeSearch flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <label htmlFor="active?" className="text-sm font-medium text-gray-700">
              Voir vos groupes inactifs
            </label>
            <input
              type="checkbox"
              checked={!active}
              onChange={() => setActive(!active)}
              className="h-4 w-4 text-[#6F1E49] focus:ring-[#6F1E49] border-gray-300 rounded"
            />
          </div>
          <div className="relative flex-grow max-w-md">
            <input
              name="search"
              type="search"
              onChange={handleSearch}
              value={search}
              placeholder="Recherchez votre groupe"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#6F1E49] focus:border-transparent"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="groupList">
        {activeGroups.map((group) => {
          if (expand && selectedId === group.id && modify) {
            return (
              <div key={group.id} data-name={group.id} className="groupModify">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">Nom du groupe</label>
                    <input
                      type="text"
                      name="group_name"
                      value={modifiedGroup?.group_name || "Loading..."}
                      onChange={modifyGroup}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#6F1E49] focus:border-transparent"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">Date de la présentation</label>
                    <input
                      type="datetime-local"
                      name="date_presentation"
                      value={modifiedGroup?.date_presentation || ""}
                      onChange={modifyGroup}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#6F1E49] focus:border-transparent"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <label className="text-sm font-medium text-gray-700">Possède un leader?</label>
                    <input
                      type="checkbox"
                      name="have_leader"
                      checked={modifiedGroup?.have_leader || false}
                      onChange={modifyGroup}
                      className="h-4 w-4 text-[#6F1E49] focus:ring-[#6F1E49] border-gray-300 rounded"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">Nom du leader</label>
                    <select
                      name="leader"
                      value={JSON.stringify(leader)}
                      onChange={modifyGroupLeader}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#6F1E49] focus:border-transparent"
                    >
                      <option value={group.nom_leader}>Pas de changement</option>
                      {leadersData.map((leader) => (
                        <option
                          key={leader.id}
                          value={JSON.stringify({ nom_leader: leader.nom, leader_id: leader.id })}
                        >
                          {leader.nom}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center space-x-2">
                    <label className="text-sm font-medium text-gray-700">Groupe actif?</label>
                    <input
                      type="checkbox"
                      name="active"
                      checked={modifiedGroup?.active || false}
                      onChange={modifyGroup}
                      className="h-4 w-4 text-[#6F1E49] focus:ring-[#6F1E49] border-gray-300 rounded"
                    />
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <h4 className="text-md font-medium text-gray-700">Membres du groupe :</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {filteredClientsData?.length > 0 ? (
                      filteredClientsData.map((client) => (
                        <div key={client.id} className="flex items-center justify-between bg-gray-50 p-2 rounded-md">
                          <div className="flex items-center space-x-2">
                            <img
                              className="h-10 w-10 rounded-full object-cover border border-gray-200"
                              src={profilePhotos[client.nom] || iconeProfile}
                              alt={client.nom}
                            />
                            <div>
                              <p className="text-sm font-medium">{client.nom}</p>
                              <p className="text-xs text-gray-600">{client.email}</p>
                            </div>
                          </div>
                          <button
                            data-name={client.id}
                            onClick={handleRemoveClient}
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
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </button>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 italic">Aucun membre</p>
                    )}
                  </div>
                </div>

                <div className="space-y-1 mb-4">
                  <label className="block text-sm font-medium text-gray-700">Ajouter des clients existants</label>
                  <select
                    name="members_ids"
                    value={selectedClientId}
                    onChange={handleMemberId}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#6F1E49] focus:border-transparent"
                  >
                    <option value="">-- Sélectionner un autre client --</option>
                    {restOfClients.map((client) => (
                      <option key={client.id} value={client.id}>
                        {client.nom}, {client.email}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex justify-end space-x-3">
                  <button onClick={handleSubmit} className="btn-primary">
                    Modifier
                  </button>
                  <button onClick={() => setModify(false)} className="btn-edit">
                    Annuler
                  </button>
                </div>
              </div>
            )
          }

          if (expand && selectedId === group.id) {
            return (
              <div
                key={group.id}
                data-name={group.id}
                className="bg-white rounded-lg shadow-md p-6 border border-gray-200 col-span-full"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Nom du groupe</h3>
                    <p className="text-gray-900">{group.group_name}</p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Date de la présentation</h3>
                    <p className="text-gray-900">
                      {group.date_presentation
                        ? new Date(group.date_presentation).toLocaleString("en-CA")
                        : "Date non définie"}
                    </p>
                  </div>
                </div>

                <div className="space-y-4 mb-4">
                  {group.have_leader && (
                    <div className="bg-gray-50 p-4 rounded-md">
                      <h4 className="text-md font-medium text-gray-700 mb-2">Leader :</h4>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <img
                            className="h-12 w-12 rounded-full object-cover border-2 border-gray-200"
                            src={profilePhotos[group.nom_leader] || iconeProfile}
                            alt={group.nom_leader}
                          />
                          <div>
                            <p className="text-sm font-medium">
                              <Link
                                to={`../details/${
                                  leadersData.find((leader) => leader.nom === group.nom_leader).clientid
                                }`}
                                className="text-[#6F1E49] hover:underline"
                              >
                                {group.nom_leader}
                              </Link>
                            </p>
                            <p className="text-xs text-gray-600">
                              {leadersData.find((leader) => leader.nom === group.nom_leader)?.email || "Email inconnu"}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button id={group.leader_id} className="btn-edit text-xs" onClick={handleGenerateCanva}>
                            Générer Canva
                          </button>
                          <div className="flex items-center space-x-1">
                            <label htmlFor="showProfile" className="text-xs text-gray-700">
                              Montrer profil?
                            </label>
                            <input
                              id={leadersData.find((leader) => leader.nom === group.nom_leader).clientid}
                              type="checkbox"
                              name="showProfile"
                              checked={
                                clientsData.find((leader) => leader.nom_client === group.nom_leader)?.showProfile ||
                                false
                              }
                              onChange={handleShowProfile}
                              className="h-4 w-4 text-[#6F1E49] focus:ring-[#6F1E49] border-gray-300 rounded"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div>
                    <h4 className="text-md font-medium text-gray-700 mb-2">Membres du groupe :</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {filteredClientsData?.length > 0 ? (
                        filteredClientsData.map((client) => (
                          <div
                            key={client.id}
                            className="bg-gray-50 p-3 rounded-md flex flex-col md:flex-row md:items-center md:justify-between"
                          >
                            <div className="flex items-center space-x-3 mb-2 md:mb-0">
                              <img
                                className="h-10 w-10 rounded-full object-cover border border-gray-200"
                                src={profilePhotos[client.nom] || iconeProfile}
                                alt={client.nom}
                              />
                              <div>
                                <p className="text-sm font-medium">
                                  <Link to={`../details/${client.id}`} className="text-[#6F1E49] hover:underline">
                                    {client.nom}
                                  </Link>
                                </p>
                                <p className="text-xs text-gray-600">{client.email}</p>
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              <button className="btn-edit text-xs" onClick={() => handleProfileClick(client)}>
                                Générer Profil
                              </button>

                              {client.profile_ids && client.profile_ids[0] && (
                                <button id={client.id} className="btn-edit text-xs" onClick={handleGenerateCanva}>
                                  Générer Canva
                                </button>
                              )}

                              <div className="flex items-center space-x-1">
                                <label htmlFor="showProfile" className="text-xs text-gray-700">
                                  Montrer profil?
                                </label>
                                <input
                                  id={client.id}
                                  type="checkbox"
                                  name="showProfile"
                                  checked={client && client.showProfile ? client.showProfile : false}
                                  onChange={handleShowProfile}
                                  className="h-4 w-4 text-[#6F1E49] focus:ring-[#6F1E49] border-gray-300 rounded"
                                />
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-500 italic col-span-2">Aucun membre</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap justify-end gap-2 mt-4">
                  <button onClick={() => setModify(true)} className="btn-edit">
                    Modifier
                  </button>
                  <button onClick={handleUrl} className="btn-primary">
                    Générer un lien de questionnaire
                  </button>
                  <button onClick={handleReduire} className="btn-edit">
                    Réduire
                  </button>
                </div>

                {formUrl && (
                  <div className="mt-4 p-3 bg-gray-50 rounded-md flex items-center justify-between">
                    <a
                      href={formUrl}
                      className="text-[#6F1E49] hover:underline text-sm truncate"
                      rel="noopener noreferrer"
                    >
                      {formUrl}
                    </a>
                    <button onClick={handleCopy} className="btn-edit text-xs ml-2">
                      Copier
                    </button>
                  </div>
                )}
              </div>
            )
          }

          // Affichage réduit (fermé)
          return (
            <div
              key={group.id}
              data-name={group.id}
              className="bg-white rounded-lg shadow-md p-4 border border-gray-200 hover:border-[#6F1E49] transition-colors cursor-pointer"
              onClick={handleExpand}
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <h3 className="text-xs font-medium text-gray-500 mb-1">Nom du groupe</h3>
                  <p className="text-gray-900 font-medium">{group.group_name}</p>
                </div>
                <div>
                  <h3 className="text-xs font-medium text-gray-500 mb-1">Date de la présentation</h3>
                  <p className="text-gray-900">
                    {group.date_presentation
                      ? new Date(group.date_presentation).toLocaleString("en-CA")
                      : "Date non définie"}
                  </p>
                </div>
                <div>
                  <h3 className="text-xs font-medium text-gray-500 mb-1">Nom du leader</h3>
                  <p className="text-gray-900">{group.have_leader ? group.nom_leader : "Groupe sans leader"}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Modal pour choisir un form_id et éventuellement un prompt set */}
      {modalOpen && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-[9999]">
          <div className="bg-white p-8 rounded-lg shadow-xl w-[600px] max-w-[95vw]">
            <h2 className="text-2xl font-bold mb-6 text-center text-[#6F1E49]">Générer un profil</h2>

            {/* Tabs pour choisir la méthode de génération */}
            <div className="flex mb-6 border-b">
              <button
                className={`py-3 px-6 flex-1 transition-all ${
                  generationMethod === "standard"
                    ? "bg-gradient-to-r from-[#6F1E49] to-[#D7A5BE] text-white font-bold rounded-t-lg"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
                onClick={() => setGenerationMethod("standard")}
              >
                Standard
              </button>
              <button
                className={`py-3 px-6 flex-1 transition-all ${
                  generationMethod === "promptSet"
                    ? "bg-gradient-to-r from-[#6F1E49] to-[#D7A5BE] text-white font-bold rounded-t-lg"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
                onClick={() => setGenerationMethod("promptSet")}
              >
                Avec prompt set
              </button>
            </div>

            {currentClient ? (
              <div className="max-h-[60vh] overflow-y-auto px-1">
                {generationMethod === "standard" ? (
                  // Méthode standard - choisir un form ID
                  <>
                    <p className="mb-4 font-medium text-gray-700">Choisissez un formulaire :</p>
                    <div className="space-y-3">
                      {currentClient.form_ids &&
                        currentClient.form_ids.map((formId) => (
                          <button
                            key={formId}
                            className="block w-full py-3 px-4 rounded-lg bg-gradient-to-r from-[#6F1E49] to-[#D7A5BE] text-white font-medium hover:shadow-lg transition-all"
                            onClick={() => handleProfileGenerate(currentClient.id, formId)}
                            disabled={isLoading}
                          >
                            {isLoading ? (
                              <span className="flex items-center justify-center">
                                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                Génération en cours...
                              </span>
                            ) : (
                              `Formulaire ID: ${formId}`
                            )}
                          </button>
                        ))}
                    </div>
                  </>
                ) : (
                  // Méthode avec prompt set
                  <>
                    <div className="space-y-5">
                      <div>
                        <label className="block mb-2 font-medium text-gray-700">Choisissez un formulaire :</label>
                        <select
                          className="w-full h-12 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6F1E49] focus:border-[#6F1E49] transition-all"
                          value={selectedFormId || ""}
                          onChange={(e) => setSelectedFormId(e.target.value)}
                        >
                          <option value="">Sélectionnez un formulaire</option>
                          {currentClient.form_ids &&
                            currentClient.form_ids.map((formId) => (
                              <option key={formId} value={formId}>
                                Formulaire ID: {formId}
                              </option>
                            ))}
                        </select>
                      </div>

                      <div>
                        <label className="block mb-2 font-medium text-gray-700">Choisissez un set de prompts :</label>
                        {loadingPromptSets ? (
                          <div className="flex items-center justify-center h-12 px-4 border border-gray-300 rounded-lg">
                            <Loader2 className="w-5 h-5 mr-2 animate-spin text-[#6F1E49]" />
                            Chargement des sets de prompts...
                          </div>
                        ) : promptSets.length > 0 ? (
                          <select
                            className="w-full h-12 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6F1E49] focus:border-[#6F1E49] transition-all"
                            value={selectedPromptSet}
                            onChange={(e) => setSelectedPromptSet(e.target.value)}
                          >
                            {promptSets.map((set) => (
                              <option key={set.id} value={set.id}>
                                {set.prompt_set_name}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <div className="h-12 px-4 flex items-center border border-gray-300 rounded-lg text-gray-500">
                            Aucun set de prompts disponible
                          </div>
                        )}
                      </div>

                      <button
                        className={`w-full py-4 px-4 rounded-lg font-medium transition-all ${
                          isLoading || !selectedFormId || (promptSets.length > 0 && !selectedPromptSet)
                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                            : "bg-gradient-to-r from-[#6F1E49] to-[#D7A5BE] text-white hover:shadow-lg"
                        }`}
                        onClick={() => handleProfileGenerate(currentClient.id, selectedFormId, selectedPromptSet)}
                        disabled={isLoading || !selectedFormId || (promptSets.length > 0 && !selectedPromptSet)}
                      >
                        {isLoading ? (
                          <span className="flex items-center justify-center">
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            Génération en cours...
                          </span>
                        ) : (
                          "Générer avec prompt set"
                        )}
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <p className="text-center text-gray-500">Aucun client sélectionné</p>
            )}

            <button
              className="w-full mt-6 py-4 px-4 rounded-lg bg-red-500 text-white font-medium hover:bg-red-600 transition-all"
              onClick={() => setModalOpen(false)}
            >
              Annuler
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

