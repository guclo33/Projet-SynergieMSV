import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../../AuthContext";
import { AdminContext } from "../../AdminContext";
import iconeProfile from "../../../../Images/iconeProfile.jpg";
import { useNavigate } from "react-router-dom";

// Icônes Lucide
import { FilePlus, Target, Map as Roadmap, Info } from "lucide-react";


export function ClientsList() {
  const { user } = useContext(AuthContext);
  const { profilePhotos, clientsData, getAdminHomeData } = useContext(AdminContext);
  const [initialData, setInitialData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFormId, setSelectedFormId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentClientId, setCurrentClientId] = useState(null);

  const [active, setActive] = useState(true);
  const [search, setSearch] = useState("");

  const apiUrl = process.env.REACT_APP_RENDER_API || "http://localhost:3000";

  const navigate = useNavigate();

  useEffect(() => {
    if (clientsData.length > 0) {
      setInitialData(clientsData)
    }
  }, [clientsData])


  console.log("user.id", user.id);


  console.log("initialData", initialData, "clientsData", clientsData);
  const handleToggleActive = () => setActive((prev) => !prev);
  const handleSearch = (e) => setSearch(e.target.value.toLowerCase());

  const handleClick = async (id, currentActive) => {
    try {

      // Met à jour localement le state pour un rendu immédiat
      setInitialData((prevClients) =>
        prevClients.map((client) =>
          client.id === id ? { ...client, active: !currentActive } : client
        )
      );

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
      });

      // Si l'API répond mal, on restaure l'ancien état
      if (!response.ok) {
        console.error("Erreur lors de la mise à jour côté serveur.");
        setInitialData((prevClients) =>
          prevClients.map((client) =>
            client.id === id ? { ...client, active: currentActive } : client
          )
        );
      } else {
        getAdminHomeData(); // Recharge les données depuis l’API (optionnel)
      }
    } catch (error) {
      console.error("Erreur lors de la modification du client", error);
    }
  };


  const handleProfileClick = (e, leader) => {
    const clientId = e.target.id;

    console.log("leader", leader, "clientId", clientId);

    if (leader.form_ids.length === 1) {
      // Si un seul form_id, on l’utilise directement
      handleProfileGenerate(clientId, leader.form_ids[0]);
    } else if (leader.form_ids.length > 1) {
      // Si plusieurs form_ids, ouvrir le modal pour choisir
      setCurrentClientId(clientId);
      console.log("clientId", clientId);
      setModalOpen(true);
    }
  };


 const handleProfileGenerate = async (clientId, formId) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${apiUrl}/api/form/generateProfile/${formId}`, {
        method: "GET",
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Message from Python:", data.message);
        console.log("Profil généré avec succès");
        navigate(`/admin/${user.id}/details/${clientId}`);
      } else {
        console.error("Erreur lors de la génération du profil");
      }
    } catch (error) {
      console.error("Erreur réseau:", error);
    } finally {
      setIsLoading(false);
      setModalOpen(false); // Ferme le modal après action
    }
  };

  const clientsAffiches = initialData
    .filter((client) => client.active === active)
    .filter((client) => client.nom.toLowerCase().includes(search));

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
                <Link
                  to={`details/${leader.id}`}
                  className="text-primary font-semibold hover:underline"
                >
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
                  ? new Date(leader.date_presentation).toLocaleDateString(
                    "en-CA"
                  )
                  : "Date non définie"}
              </p>
            </div>

            {/* Icônes d'action */}
            <div className="flex gap-2 flex-1 justify-end">
              <button 
              id={leader.id} 
               
              title="Générer le profil" 
              disabled={!leader.form_ids || leader.form_ids.length === 0 || isLoading}
              onClick={(e) => handleProfileClick(e, leader)}
              className={`btn ${!leader.form_ids || leader.form_ids.length === 0 ? "btn-disabled" : "btn-action"}`}>
                <FilePlus className="w-5 h-5" />
              </button>
              <button title="Diriger vers les objectifs"><Link to={`objectifs/${leader.id}`} className="btn-action text-white">
                <Target className="w-5 h-5" />
              </Link></button>
              <button title="Diriger vers la feuille de route"><Link to={`roadmap/${leader.id}`} className="btn-action text-white">
                <Roadmap className="w-5 h-5" />
              </Link></button>
              <button title="Diriger vers les informations"><Link to={`details/${leader.id}`} className="btn-action text-white">
                <Info className="w-5 h-5" />
              </Link></button>
            </div>
          </div>

          
        ))}
      </div>
            {/* Modal pour choisir un form_id si plusieurs options */}
            {modalOpen && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-lg font-bold mb-4">Choisissez un formulaire</h3>
            {clientsData.find((c) => c.id === currentClientId)?.form_ids.map((formId) => (
              <button
                key={formId}
                className="block w-full bg-primary text-white py-2 rounded-md mb-2"
                onClick={() => handleProfileGenerate(currentClientId, formId)}
              >
                Formulaire ID: {formId}
              </button>
            ))}
            <button
              className="w-full bg-red-500 text-white py-2 rounded-md"
              onClick={() => setModalOpen(false)}
            >
              Annuler
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

