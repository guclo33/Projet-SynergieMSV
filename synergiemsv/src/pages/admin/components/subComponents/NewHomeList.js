"use client"

import { useContext, useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { AuthContext } from "../../../AuthContext"
import { AdminContext } from "../../AdminContext"
import iconeProfile from "../../../../Images/iconeProfile.jpg"
import { useNavigate } from "react-router-dom"
import { getPromptSetsAPI } from "../../prompt/actions/prompt.action"

// Icônes Lucide
import { FilePlus, Target, MapIcon as Roadmap, Info, Loader2 } from "lucide-react"

export function ClientsList() {
  const { user } = useContext(AuthContext)
  const { profilePhotos, clientsData, getAdminHomeData } = useContext(AdminContext)
  const [initialData, setInitialData] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedFormId, setSelectedFormId] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [currentClientId, setCurrentClientId] = useState(null)
  const [selectedClient, setSelectedClient] = useState(null)
  const [promptSets, setPromptSets] = useState([])
  const [selectedPromptSet, setSelectedPromptSet] = useState("")
  const [generationMethod, setGenerationMethod] = useState("standard") // "standard" or "promptSet"
  const [loadingPromptSets, setLoadingPromptSets] = useState(false)

  const [active, setActive] = useState(true)
  const [search, setSearch] = useState("")

  const apiUrl = process.env.REACT_APP_RENDER_API || "http://localhost:3000"

  const navigate = useNavigate()

  useEffect(() => {
    if (clientsData.length > 0) {
      setInitialData(clientsData)
    }
  }, [clientsData])

  useEffect(() => {
    if (currentClientId) setSelectedClient(clientsData.find((c) => c.id === currentClientId))
  }, [currentClientId, clientsData])

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

  const handleToggleActive = () => setActive((prev) => !prev)
  const handleSearch = (e) => setSearch(e.target.value.toLowerCase())

  const handleClick = async (id, currentActive) => {
    try {
      // Met à jour localement le state pour un rendu immédiat
      setInitialData((prevClients) =>
        prevClients.map((client) => (client.id === id ? { ...client, active: !currentActive } : client)),
      )

      // Envoie la mise à jour à l'API
      const response = await fetch(`${apiUrl}/api/admin/${user.id}/overview`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: id,
          active: !currentActive,
        }),
      })

      // Si l'API répond mal, on restaure l'ancien état
      if (!response.ok) {
        console.error("Erreur lors de la mise à jour côté serveur.")
        setInitialData((prevClients) =>
          prevClients.map((client) => (client.id === id ? { ...client, active: currentActive } : client)),
        )
      } else {
        getAdminHomeData() // Recharge les données depuis l'API (optionnel)
      }
    } catch (error) {
      console.error("Erreur lors de la modification du client", error)
    }
  }

  // Modifiez la fonction handleProfileClick pour qu'elle ouvre toujours le modal
  const handleProfileClick = async (e, leader) => {
    // Utilisez directement l'ID du leader
    const clientId = leader.id

    // Vérifier si les prompt sets sont déjà chargés, sinon les charger
    if (promptSets.length === 0 && !loadingPromptSets) {
      setLoadingPromptSets(true)
      try {
        const sets = await getPromptSetsAPI(user.id)
        console.log("Prompt sets loaded on click:", sets)
        if (Array.isArray(sets) && sets.length > 0) {
          setPromptSets(sets)
          setSelectedPromptSet(sets[0].id)
        }
      } catch (error) {
        console.error("Error fetching prompt sets:", error)
      } finally {
        setLoadingPromptSets(false)
      }
    }

    // Toujours ouvrir le modal, peu importe le nombre de form_ids
    setCurrentClientId(clientId)
    // Définir explicitement le client sélectionné
    setSelectedClient(leader)
    // Réinitialiser la méthode de génération à standard
    setGenerationMethod("standard")
    // Si un seul form_id est disponible, le présélectionner
    if (leader.form_ids.length === 1) {
      setSelectedFormId(leader.form_ids[0])
    } else {
      setSelectedFormId("")
    }
    // Ouvrir le modal
    setModalOpen(true)
  }

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

  const clientsAffiches = initialData
    .filter((client) => client.active === active)
    .filter((client) => client.nom.toLowerCase().includes(search))

  if (isLoading) {
    return (
      <div className="loading-overlay">
        <div className="spinner"></div>
      </div>
    )
  }

  return (
    <div className="leadersHome">
      <h2 className="text-2xl font-bold text-center mb-6">Mes clients !</h2>

      {/* Barre d'options : toggle actif/inactif et recherche */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2">
          <input
            id="showInactive"
            type="checkbox"
            checked={!active}
            onChange={handleToggleActive}
            className="h-4 w-4 accent-primary"
          />
          <label htmlFor="showInactive" className="text-gray-700">
            Voir les clients inactifs
          </label>
        </div>

        <div className="flex items-center gap-2 w-full max-w-md">
          <input
            id="searchInput"
            name="search"
            type="search"
            placeholder="Rechercher un client..."
            onChange={handleSearch}
            value={search}
            className="w-full px-3 py-2 border rounded-full border-primary focus:ring-2 focus:ring-secondary"
          />
        </div>
      </div>

      {/* Liste des clients */}
      <div className="space-y-4">
        {clientsAffiches.map((leader) => (
          <div
            key={leader.id}
            className="flex items-center justify-between bg-white shadow-lg border border-primary rounded-xl p-4 transition-all hover:shadow-xl"
          >
            {/* Image & Nom */}
            <div className="flex items-center gap-4 flex-1">
              <img
                src={profilePhotos[leader.nom] || iconeProfile}
                alt={leader.nom}
                className="w-14 h-14 object-cover rounded-full border-2 border-primary"
              />
              <div>
                <Link to={`details/${leader.id}`} className="text-primary font-semibold hover:underline">
                  {leader.nom}
                </Link>
                <div className="mt-1 flex items-center gap-2 text-sm text-primary">
                  <label htmlFor={`active-${leader.id}`} className="font-medium">
                    Actif ?
                  </label>
                  <input
                    id={leader.id}
                    type="checkbox"
                    checked={leader.active}
                    onChange={() => handleClick(leader.id, leader.active)}
                    className="h-4 w-4 accent-primary"
                  />
                </div>
              </div>
            </div>

            {/* Date Présentation */}
            <div className="flex-1 text-center">
              <h4 className="font-semibold text-primary">Date Présentation</h4>
              <p className="text-textColor">
                {leader.date_presentation
                  ? new Date(leader.date_presentation).toLocaleDateString("en-CA")
                  : "Date non définie"}
              </p>
            </div>

            {/* Icônes d'action */}
            <div className="flex gap-2 flex-1 justify-end">
              <button
                id={leader.id}
                title="Générer le profil"
                aria-disabled={!leader.form_ids[0] || isLoading}
                onClick={(e) => handleProfileClick(e, leader)}
                className={`${!leader.form_ids[0] ? "!bg-gray-radial text-gray-700 font-bold px-4 py-2 rounded-md transition cursor-not-allowed" : "btn-action"}`}
              >
                <FilePlus className="w-5 h-5" />
              </button>
              <Link to={`objectifs/${leader.id}`} className="btn-action text-white">
                <button title="Diriger vers les objectifs">
                  <Target className="w-5 h-5" />
                </button>
              </Link>

              <Link to={`roadmap/${leader.id}`} className="btn-action text-white">
                <button title="Diriger vers la feuille de route">
                  <Roadmap className="w-5 h-5" />
                </button>
              </Link>

              <Link to={`details/${leader.id}`} className="btn-action text-white">
                <button title="Diriger vers les informations">
                  <Info className="w-5 h-5" />
                </button>
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Modal pour choisir un form_id et éventuellement un prompt set */}
      {modalOpen && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-[9999]">
          <div className="bg-white p-8 rounded-lg shadow-xl w-[600px] max-w-[95vw]">
            <h2 className="text-2xl font-bold mb-6 text-center text-primary">Générer un profil</h2>

            {/* Tabs pour choisir la méthode de génération */}
            <div className="flex mb-6 border-b">
              <button
                className={`py-3 px-6 flex-1 transition-all ${
                  generationMethod === "standard"
                    ? "bg-gradient-to-r from-primary to-secondary text-white font-bold rounded-t-lg"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
                onClick={() => setGenerationMethod("standard")}
              >
                Standard
              </button>
              <button
                className={`py-3 px-6 flex-1 transition-all ${
                  generationMethod === "promptSet"
                    ? "bg-gradient-to-r from-primary to-secondary text-white font-bold rounded-t-lg"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
                onClick={() => setGenerationMethod("promptSet")}
              >
                Avec prompt set
              </button>
            </div>

            {selectedClient ? (
              <div className="max-h-[60vh] overflow-y-auto px-1">
                {generationMethod === "standard" ? (
                  // Méthode standard - choisir un form ID
                  <>
                    <p className="mb-4 font-medium text-gray-700">Choisissez un formulaire :</p>
                    <div className="space-y-3">
                      {selectedClient.form_ids.map((formId) => (
                        <button
                          key={formId}
                          className="block w-full py-3 px-4 rounded-lg bg-gradient-to-r from-primary to-secondary text-white font-medium hover:shadow-lg transition-all"
                          onClick={() => handleProfileGenerate(selectedClient.id, formId)}
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
                          className="w-full h-12 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                          value={selectedFormId || ""}
                          onChange={(e) => setSelectedFormId(e.target.value)}
                        >
                          <option value="">Sélectionnez un formulaire</option>
                          {selectedClient.form_ids.map((formId) => (
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
                            <Loader2 className="w-5 h-5 mr-2 animate-spin text-primary" />
                            Chargement des sets de prompts...
                          </div>
                        ) : promptSets.length > 0 ? (
                          <select
                            className="w-full h-12 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all"
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
                            : "bg-gradient-to-r from-primary to-secondary text-white hover:shadow-lg"
                        }`}
                        onClick={() => handleProfileGenerate(selectedClient.id, selectedFormId, selectedPromptSet)}
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

