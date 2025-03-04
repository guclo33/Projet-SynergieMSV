import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
// Importer tes fichiers CSS ou Tailwind si tu en utilises
import { AuthContext } from "../../../AuthContext";
import { AdminContext } from "../../AdminContext";
// Icône par défaut si pas de photo
import iconeProfile from "../../../../Images/iconeProfile.jpg";

// ---- Import des icônes lucide-react ----
import {
  FilePlus,  // exemple pour "Generate Profile"
  Target,    // exemple pour "Objectif"
  Map as Roadmap, // ou 'MapPin', 'Map', etc.
  Info,
} from "lucide-react"; 

export function ClientsList() {
  const { user } = useContext(AuthContext);
  const { profilePhotos, clientsData } = useContext(AdminContext);
  
  // État qui gère la vue "actifs/inactifs"
  const [active, setActive] = useState(true);
  // État pour la barre de recherche
  const [search, setSearch] = useState("");

  // Inverse la valeur active/inactive
  const handleToggleActive = () => {
    setActive((prev) => !prev);
  };

  // Met à jour la recherche
  const handleSearch = (e) => {
    setSearch(e.target.value.toLowerCase());
  };

  // Filtrer d’abord par actif/inactif
  const clientsFiltrees = clientsData.filter(
    (client) => client.active === active
  );
  // Puis filtrer par nom en fonction de la recherche
  const clientsAffiches = clientsFiltrees.filter((client) =>
    client.nom.toLowerCase().includes(search)
  );

  // Fonction pour "Générer un profil" (à adapter selon ton besoin)
  const handleGenerateProfile = (leaderId) => {
    console.log("Génération du profil pour l'ID :", leaderId);
    // Effectuer ici l'action voulue (ex: appel API, etc.)
  };

  return (
    <div className="leadersHome">
      <h2>Mes clients !</h2>

      {/* Barre d'options : toggle actif/inactif et search */}
      <div className="input">
        <input
          id="showInactive"
          type="checkbox"
          checked={!active}      // si actif = true, alors !active = false
          onChange={handleToggleActive}
        />
        <label htmlFor="showInactive">
          Voir les clients inactifs
        </label>

        <label htmlFor="searchInput">
          Recherchez votre client
        </label>
        <input
          id="searchInput"
          name="search"
          type="search"
          onChange={handleSearch}
          value={search}
        />
      </div>

      {/* Liste des clients correspondant à la recherche et à l'état actif/inactif */}
      {clientsAffiches.map((leader) => (
        <div className="leadersList" key={leader.id}>
          {/* Photo de profil */}
          <div className="info">
            <img
              className="imgSmall"
              src={profilePhotos[leader.nom] || iconeProfile}
              alt={leader.nom}
            />
          </div>

          {/* Nom du client -> lien vers détails */}
          <p>
            <Link to={`details/${leader.id}`}>{leader.nom}</Link>
          </p>

          {/* Affichage "Actif ?" readonly (si tu veux le modifier, ajoute une logique onChange) */}
          <div className="info">
            <label htmlFor={`active-${leader.id}`}>Actif ?</label>
            <input
              id={`active-${leader.id}`}
              type="checkbox"
              checked={leader.active}
              readOnly
            />
          </div>

          {/* Date de présentation */}
          <div className="info">
            <h4>Date Présentation</h4>
            <p>
              {leader.date_presentation
                ? new Date(leader.date_presentation).toLocaleDateString("en-CA")
                : "Date non définie"}
            </p>
          </div>

          {/* Boutons avec icônes lucide-react */}
          <button
            id="generateProfile"
            title="Générer le profil"
            onClick={() => handleGenerateProfile(leader.id)}
          >
            <FilePlus />
          </button>

          {/* Lien vers "objectif" */}
          <Link to={`objective/${leader.id}`}>
            <button id="goToObjectifs" title="Aller aux Objectifs">
              <Target />
            </button>
          </Link>

          {/* Lien vers "roadmap" */}
          <Link to={`roadmap/${leader.id}`}>
            <button id="goToRoadmap" title="Aller à la Roadmap">
              <Roadmap />
            </button>
          </Link>

          {/* Lien vers "details" */}
          <Link to={`details/${leader.id}`}>
            <button id="goToDetail" title="Aller aux Détails">
              <Info />
            </button>
          </Link>
        </div>
      ))}
    </div>
  );
}
